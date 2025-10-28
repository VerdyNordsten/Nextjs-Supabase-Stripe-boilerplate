-- =========================================================
-- U P T O P I L O T  -  USER CORE ONLY (CLEANED VERSION) v1.2
-- =========================================================
--
-- TRIAL FLOW:
-- 1. User registers (email/Google OAuth)
-- 2. After registration, redirect to Stripe Checkout with trial_period_days=7
-- 3. User enters payment method (required for validation)
-- 4. Stripe validates payment and creates subscription with status='trialing'
-- 5. No charge during trial period
-- 6. After 7 days, automatically converts to paid subscription
-- 7. User can cancel anytime during trial with no charge
--

-- 0) Extensions
create extension if not exists pgcrypto;

-- =========================================================
-- 1) USER-CORE TABLES ONLY
-- =========================================================

create table if not exists public.users (
  id uuid primary key,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  reactivated_at timestamptz,
  constraint users_id_fkey
    foreign key (id) references auth.users (id) on delete cascade
);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  has_completed_onboarding boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_user_id_key unique (user_id),
  constraint user_preferences_user_id_fkey
    foreign key (user_id) references public.users (id) on delete cascade
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  price_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancel_at_period_end boolean default false,
  current_period_end timestamptz,
  constraint subscriptions_user_id_fkey
    foreign key (user_id) references public.users (id) on delete cascade,
  constraint subscriptions_status_chk
    check (status is null or status in ('trialing','active','past_due','canceled','unpaid','incomplete','incomplete_expired','paused'))
);

create unique index if not exists subscriptions_stripe_customer_uidx
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists subscriptions_stripe_subscription_uidx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text,
  login_type text,
  email_unsubscribed boolean default false,
  referral_source text,
  badges text[],
  feedbacks jsonb,
  profile_image_key text,
  stripe_customer_id text,
  current_subscription_id uuid references public.subscriptions(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2) INDEXES
-- =========================================================
create index if not exists idx_user_profiles_user_id on public.user_profiles(user_id);
create index if not exists idx_user_profiles_stripe_customer on public.user_profiles(stripe_customer_id);

-- =========================================================
-- 3) RLS
-- =========================================================
alter table public.users enable row level security;
alter table public.user_preferences enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_profiles enable row level security;

-- users
drop policy if exists "Users can read their own data" on public.users;
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own data" on public.users;
create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Service role full access to users" on public.users;
create policy "Service role full access to users" on public.users
  for all to service_role using (true) with check (true);

-- user_preferences
drop policy if exists "Users can read their own preferences" on public.user_preferences;
create policy "Users can read their own preferences" on public.user_preferences
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own preferences" on public.user_preferences;
create policy "Users can insert their own preferences" on public.user_preferences
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own preferences" on public.user_preferences;
create policy "Users can update their own preferences" on public.user_preferences
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Service role full access to preferences" on public.user_preferences;
create policy "Service role full access to preferences" on public.user_preferences
  for all to service_role using (true) with check (true);

-- subscriptions (READ by user; WRITE only by service_role)
drop policy if exists "Users can read their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own subscriptions" on public.subscriptions;
drop policy if exists "Users can update their own subscriptions" on public.subscriptions;

drop policy if exists "Service role full access to subscriptions" on public.subscriptions;
create policy "Service role full access to subscriptions" on public.subscriptions
  for all to service_role using (true) with check (true);

-- user_profiles
drop policy if exists "Profiles: owner can read" on public.user_profiles;
create policy "Profiles: owner can read"
  on public.user_profiles for select using (auth.uid() = user_id);

drop policy if exists "Profiles: owner can insert" on public.user_profiles;
create policy "Profiles: owner can insert"
  on public.user_profiles for insert with check (auth.uid() = user_id);

drop policy if exists "Profiles: owner can update" on public.user_profiles;
create policy "Profiles: owner can update"
  on public.user_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Profiles: service full access" on public.user_profiles;
create policy "Profiles: service full access"
  on public.user_profiles for all to service_role using (true) with check (true);

-- =========================================================
-- 4) TRIGGERS: updated_at
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'public.users',
    'public.user_preferences',
    'public.subscriptions',
    'public.user_profiles'
  ]
  loop
    execute format('drop trigger if exists trg_set_updated_at on %s', t);
    execute format('create trigger trg_set_updated_at
                    before update on %s
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- =========================================================
-- 5) RPCs
-- =========================================================

-- 5.1 Sync user + profile saat SIGNED_IN (boleh dipanggil client)
drop function if exists public.sync_user_on_signup(uuid, text);
drop function if exists public.sync_user_on_signup(uuid, text, text, text, text, text, text);

create or replace function public.sync_user_on_signup(
  p_user_id uuid,
  p_email text,
  p_full_name text default null,
  p_avatar_url text default null,
  p_timezone text default null,
  p_login_type text default null,
  p_stripe_customer_id text default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.users (id, email)
  values (p_user_id, p_email)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  insert into public.user_profiles (
    user_id, full_name, avatar_url, timezone, login_type, stripe_customer_id
  ) values (
    p_user_id,
    nullif(p_full_name, ''),
    nullif(p_avatar_url, ''),
    nullif(p_timezone, ''),
    nullif(p_login_type, ''),
    nullif(p_stripe_customer_id, '')
  )
  on conflict (user_id) do update set
    full_name          = coalesce(excluded.full_name,          public.user_profiles.full_name),
    avatar_url         = coalesce(excluded.avatar_url,         public.user_profiles.avatar_url),
    timezone           = coalesce(excluded.timezone,           public.user_profiles.timezone),
    login_type         = coalesce(excluded.login_type,         public.user_profiles.login_type),
    stripe_customer_id = coalesce(excluded.stripe_customer_id, public.user_profiles.stripe_customer_id),
    updated_at         = now();

  insert into public.user_preferences (user_id, has_completed_onboarding)
  values (p_user_id, false)
  on conflict (user_id) do nothing;
end;
$$;

grant execute on function public.sync_user_on_signup(
  uuid, text, text, text, text, text, text
) to authenticated, anon;

-- 5.2 Get Session Data - For Network Tab Visibility
drop function if exists public.get_session_data();

create or replace function public.get_session_data()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_user_email text;
  v_session_expires_at timestamptz;
  v_profile record;
  v_result jsonb;
begin
  -- Get current user from JWT
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '401';
  end if;

  -- Get user email from auth.users
  select email into v_user_email
  from auth.users
  where id = v_user_id;

  -- Get session expiry from JWT claims
  v_session_expires_at := to_timestamp(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'exp')::numeric
  );

  -- Get user profile
  select * into v_profile
  from public.user_profiles
  where user_id = v_user_id;

  -- Build result
  v_result := jsonb_build_object(
    'user', jsonb_build_object(
      'id', v_user_id,
      'email', v_user_email,
      'fullName', v_profile.full_name,
      'loginType', v_profile.login_type,
      'profileImage', v_profile.avatar_url
    ),
    'accessToken', current_setting('request.jwt.claims', true)::jsonb ->> 'sub',
    'expiresAt', v_session_expires_at,
    'timestamp', now()
  );

  return v_result;
end;
$$;

grant execute on function public.get_session_data() to authenticated;

-- =========================================================
-- 6) RPC: get_user_data
-- Returns ALL user data in ONE call to reduce API requests
-- =========================================================

drop function if exists public.get_user_data();

create or replace function public.get_user_data()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_user_email text;
  v_profile record;
  v_subscription record;
  v_result jsonb;
  v_plan_status text;
begin
  -- Get current user from JWT
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = 'PGRST301';
  end if;

  -- Get user email from auth.users
  select email into v_user_email
  from auth.users
  where id = v_user_id;

  -- Get user profile
  select
    id, user_id, full_name, avatar_url, timezone, login_type,
    email_unsubscribed, referral_source, badges, feedbacks,
    profile_image_key, stripe_customer_id, current_subscription_id,
    created_at, updated_at
  into v_profile
  from public.user_profiles
  where user_id = v_user_id;

  -- Get active subscription (if any)
  select
    id, user_id, status, stripe_customer_id, stripe_subscription_id,
    cancel_at_period_end, current_period_end, created_at, updated_at
  into v_subscription
  from public.subscriptions
  where user_id = v_user_id
    and status in ('active', 'trialing')
  order by created_at desc
  limit 1;

  -- Validate subscription is not expired
  if v_subscription.id is not null then
    if v_subscription.current_period_end < now() then
      v_subscription := null;
    end if;
  end if;

  -- Determine plan status
  if v_subscription.status = 'active' then
    v_plan_status := 'pro';
  elsif v_subscription.status = 'trialing' then
    v_plan_status := 'trial';
  else
    v_plan_status := 'free';
  end if;

  -- Build result with all data
  v_result := jsonb_build_object(
    'userId', v_user_id,
    'email', v_user_email,
    'profile', case
      when v_profile.id is not null then
        jsonb_build_object(
          'id', v_profile.id,
          'user_id', v_profile.user_id,
          'full_name', v_profile.full_name,
          'avatar_url', v_profile.avatar_url,
          'timezone', v_profile.timezone,
          'login_type', v_profile.login_type,
          'email_unsubscribed', v_profile.email_unsubscribed,
          'referral_source', v_profile.referral_source,
          'badges', v_profile.badges,
          'feedbacks', v_profile.feedbacks,
          'profile_image_key', v_profile.profile_image_key,
          'stripe_customer_id', v_profile.stripe_customer_id,
          'current_subscription_id', v_profile.current_subscription_id,
          'created_at', v_profile.created_at,
          'updated_at', v_profile.updated_at
        )
      else null
    end,
    'subscription', case
      when v_subscription.id is not null then
        jsonb_build_object(
          'id', v_subscription.id,
          'user_id', v_subscription.user_id,
          'status', v_subscription.status,
          'stripe_customer_id', v_subscription.stripe_customer_id,
          'stripe_subscription_id', v_subscription.stripe_subscription_id,
          'cancel_at_period_end', v_subscription.cancel_at_period_end,
          'current_period_end', v_subscription.current_period_end,
          'created_at', v_subscription.created_at,
          'updated_at', v_subscription.updated_at
        )
      else null
    end,
    'planStatus', v_plan_status,
    'isSubscriber', v_subscription.id is not null,
    'timestamp', now()
  );

  return v_result;
end;
$$;

-- Grant access to authenticated users
grant execute on function public.get_user_data() to authenticated;

comment on function public.get_user_data() is
'Returns all user data (profile, subscription, plan status) in a single RPC call to minimize API requests';