# [Project Name] - SaaS Boilerplate Template

A modern, production-ready SaaS boilerplate built with Next.js 15, TypeScript, and Tailwind CSS. This template includes authentication, payment integration, database setup, and a beautiful UI to help you launch your SaaS product faster.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

## 🌟 Key Features

### Core Platform
- 🔐 **Authentication** with Supabase (email/password, OAuth, magic links)
- 💳 **Stripe Integration** for subscription management
- 🌓 **Dark Mode Support** with seamless theme switching
- 📱 **Fully Responsive Design** optimized for all devices
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui components
- 🔄 **Real-time Updates** with React state management

### Dashboard Features
- 📈 **Analytics Dashboard** with customizable themes
- 📋 **User Management** with role-based access
- 🎯 **Getting Started Widget** for user onboarding
- ⏰ **Settings Management** for user preferences
- 🔄 **Data Visualization** with interactive charts

### Extensible Architecture
- 🔧 **Modular Components** for easy customization
- 📁 **File Upload** with Supabase Storage
- 🏷️ **Tag Management** for content organization
- 📊 **Analytics Integration** ready for tracking
- 🚀 **API Routes** for backend functionality

## 🚀 Quick Start

This boilerplate provides everything you need to launch a modern SaaS application:

1. **Authentication System**
   - Complete user registration and login flow
   - OAuth providers (Google, GitHub, etc.)
   - Protected routes and middleware

2. **Payment Integration**
   - Stripe checkout and subscription management
   - Multiple pricing tiers support
   - Webhook handling for payment events

3. **Dashboard & UI**
   - Beautiful dashboard with analytics
   - User settings and profile management
   - Responsive design for all devices

4. **Database & Backend**
   - Supabase for database and auth
   - Type-safe database queries
   - File storage integration

## 🎯 Customization Guide

This template is designed to be easily customizable for your specific use case:

- **Replace branding** in `app/layout.tsx` and components
- **Modify database schema** in the Supabase dashboard
- **Update payment plans** in Stripe dashboard
- **Customize UI components** in the `components` directory
- **Add your API routes** in the `app/api` directory

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Custom Hooks
- **Animations**: Framer Motion

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **AI**: OpenAI API
- **Analytics**: PostHog
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account
- A Stripe account
- A Google Cloud Platform account (for OAuth)
- OpenAI API key (for AI caption generation)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file with all variables from `.env.example`:

```env
NODE_ENV=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI Configuration (you'll need to add your key)
OPENAI_API_KEY=

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_
NEXT_PUBLIC_STRIPE_BUTTON_ID=buy_btn_
STRIPE_SECRET_KEY=sk_live_
STRIPE_WEBHOOK_SECRET=whsec_

# Analytics 
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Cloudflare Turnstile Configuration
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### 4. Cloudflare Turnstile Setup (Recommended)

Cloudflare Turnstile provides user-friendly, privacy-preserving bot protection:

1. **Create Turnstile Account**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Turnstile" on the left sidebar
   - Click "Add site" to create a new Turnstile site

2. **Configure Site Settings**
   - **Site name**: Your application name
   - **Domains**: Add your development and production domains
   - **Widget mode**: "Managed" (recommended)
   - **Pre-clearance**: "Off" (unless you need it)

3. **Get Your Keys**
   - **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → `TURNSTILE_SECRET_KEY`

4. **Integration Features**
   - Automatically integrated into registration and login forms
   - Invisible to users (no challenges to solve)
   - GDPR and privacy compliant
   - Helps prevent bot attacks and spam
   - **Development Mode**: Automatically disabled when `NODE_ENV=development` for easier development

### 5. OAuth Provider Setup (Optional)

1. Create OAuth 2.0 credentials in your provider's console (Google, GitHub, etc.)
2. Configure authorized JavaScript origins and redirect URIs
3. Save the Client ID and Client Secret in your Supabase dashboard
4. Enable the desired providers in Supabase Authentication settings

### 6. Supabase Configuration

#### a. Get API Keys
- Go to Project Settings > API
- Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Copy Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy Service Role Secret → `SUPABASE_SERVICE_ROLE_KEY`

**Target Hostname**: `[your-project].supabase.co` (already configured in next.config.js)

**Note**: The avatar bucket storage URL is already configured in next.config.js:
- `https://[your-project].supabase.co/storage/v1/object/public/**` (for avatar images)

#### b. Configure URLs in Supabase
- Go to Project Settings > General > Configuration
- **Site URL**: Set to your application URL (e.g., `https://yourdomain.com` or `http://localhost:3000` for development)
- **Redirect URLs**: Add the following URLs:
  - `http://localhost:3000/` (development)
  - `https://yourdomain.com/` (production)
  - `http://localhost:3000/login` (development)
  - `https://yourdomain.com/login` (production)
  - `http://localhost:3000/auth/callback/` (development wildcard)
  - `https://yourdomain.com/auth/callback/` (production wildcard)

#### d. Set up Authentication Providers
- Go to Authentication > Providers
- Configure your desired OAuth providers (Google, GitHub, etc.)
- Update Site URL and Redirect URLs to match your domain

#### e. Google OAuth Setup Tutorial

Follow these steps to configure Google OAuth for your application:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API and Google OAuth2 API

2. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Select "Web application" as the application type
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Add authorized redirect URIs:
     - `https://[your-project].supabase.co/auth/v1/callback` 
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

3. **Get Google OAuth Credentials**
   - Copy **Client ID** → Will be used in Supabase
   - Copy **Client Secret** → Will be used in Supabase
   - Download the JSON file for backup

4. **Configure Google OAuth in Supabase**
   - Go to Authentication > Providers > Google
   - Enable the Google provider
   - Enter your Google **Client ID** and **Client Secret**
   - Save the configuration

5. **Test Google OAuth**
   - Start your development server: `npm run dev`
   - Try to sign up/login with Google
   - Verify the redirect works correctly

#### f. Storage Setup - Avatar Bucket

Create a storage bucket for user avatar images:

**Create Avatar Bucket**
   - Go to Storage in your Supabase dashboard
   - Click "New bucket"
   - **Bucket name**: `avatars`
   - **Public bucket**: Yes (for public access to avatar images)
   - **File size limit**: 5MB (recommended for avatars)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### g. Database Setup
- Enable Row Level Security (RLS) for all tables
- Create policies for authenticated users and service roles
- Run the initial schema from [`database/db_schema_v1.2_with_rpc.sql`](database/db_schema_v1.2_with_rpc.sql)

### 7. Stripe Configuration

#### a. Create Products and Pricing
- Create your subscription tiers (Free, Pro, Enterprise, etc.)
- Set up pricing and billing cycles
- Create payment links or checkout sessions

#### b. Get Required Keys
- Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Buy Button ID → `NEXT_PUBLIC_STRIPE_BUTTON_ID`
- Secret Key → `STRIPE_SECRET_KEY`
- Price ID → `STRIPE_PRICE_ID`

#### c. Configure Webhooks
- Add endpoint: `your_url/api/stripe/webhook`
- Subscribe to events: `customer.subscription.*`, `checkout.session.*`, `invoice.*`
- Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 8. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js 15 app directory
│   │   ├── api/                  # API routes
│   │   │   ├── stripe/           # Stripe payment endpoints
│   │   │   │   ├── webhook/      # Stripe webhook handler
│   │   │   │   ├── create-checkout/
│   │   │   │   ├── cancel/       # Subscription cancellation
│   │   │   │   ├── sync/         # Subscription sync
│   │   │   │   └── reactivate/   # Subscription reactivation
│   │   │   └── verify-turnstile/ # Cloudflare Turnstile verification
│   │   ├── auth/                 # Authentication pages
│   │   │   └── callback/         # OAuth callback handler
│   │   ├── dashboard/            # Main dashboard pages
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   ├── settings/         # User settings page
│   │   │   ├── onboarding/       # User onboarding flow
│   │   │   ├── learning/         # Learning/resources page
│   │   │   ├── feedback/         # Feedback page
│   │   │   ├── referral/         # Referral program
│   │   │   └── support/          # Support page
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── checkout/             # Payment/subscription page
│   │   ├── verify-email/         # Email verification
│   │   ├── reset-password/       # Password reset
│   │   ├── update-password/      # Password update
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Global styles
│   │   └── metadata.ts           # App metadata
│   ├── components/               # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── dropdown-menu.tsx
│   │   ├── landing-page/         # Landing page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/            # Dashboard components
│   │   │   └── settings/         # Settings components
│   │   │       ├── SettingsLayout.tsx
│   │   │       ├── SubscriptionManager.tsx
│   │   │       ├── Notification.tsx
│   │   │       └── AvatarUpload.tsx
│   │   ├── TurnstileWidget.tsx   # Cloudflare Turnstile component
│   │   ├── StripeBuyButton.tsx   # Stripe payment button
│   │   ├── SubscriptionStatus.tsx # Subscription status display
│   │   ├── UpgradePrompt.tsx     # Upgrade prompt component
│   │   ├── LoadingSpinner.tsx    # Loading spinner
│   │   ├── VideoModal.tsx        # Video modal
│   │   ├── ForgotPasswordModal.tsx # Forgot password modal
│   │   ├── PostHogPageView.tsx   # Analytics page view tracker
│   │   └── PostHogErrorBoundary.tsx # Analytics error boundary
│   ├── contexts/                 # React contexts
│   │   └── PostHogContext.tsx    # Analytics context
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSubscription.ts    # Subscription management hook
│   │   ├── usePlanStatus.ts      # Plan status hook
│   │   ├── useTrialStatus.ts     # Trial status hook
│   │   └── useLandingPage.ts     # Landing page hook
│   ├── utils/                    # Utility functions
│   │   ├── supabase.ts           # Supabase client
│   │   ├── supabase-browser.ts   # Supabase browser client
│   │   ├── supabase-admin.ts     # Supabase admin client
│   │   ├── posthog.ts            # Analytics utilities
│   │   ├── analytics.ts          # Analytics helper
│   │   ├── cors.ts               # CORS utilities
│   │   └── env.ts                # Environment validation
│   ├── lib/                      # Library functions
│   │   └── utils.ts              # General utilities
│   ├── types/                    # TypeScript type definitions
│   │   ├── stripe.d.ts           # Stripe types
│   │   └── ValidateEntryTypes.ts # Validation types
│   ├── config/                   # Configuration files
│   │   └── api.ts                # API configuration
│   ├── constants/                # Constants
│   │   └── landing-page.ts       # Landing page constants
│   └── public/                   # Static assets
│       ├── favicon.ico
│       ├── favicon-vercel.ico
│       └── Google-Logo.png
├── database/                     # Database files
│   └── db_schema_v1.2_with_rpc.sql # Database schema
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.tsbuildinfo          # TypeScript build info
└── settings.json                 # Project settings
```

## 🔧 Key Components

### Key Components
- **Sidebar.tsx**: Main navigation with user profile
- **Header.tsx**: Top navigation with user menu
- **AuthForm.tsx**: Login and signup form component
- **DashboardLayout.tsx**: Main dashboard wrapper
- **SettingsForm.tsx**: User settings management
- **BillingComponent.tsx**: Subscription and payment management

### UI Components (shadcn/ui)
- Button, Card, Avatar, Dialog, Badge
- Dropdown Menu, Input, Textarea, Select
- All components follow accessibility best practices

## 🎨 Design System

### Color Scheme
- **Primary**: Blue gradient (customizable)
- **Sidebar**: Light/dark theme support
- **Active States**: Blue (#3B82F6)
- **Accent Colors**: Fully customizable via CSS variables

### Typography
- **Font**: Inter
- **Sizes**: 14px base, responsive scaling
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)

## 📊 Database Schema

The application uses a comprehensive database schema with the following core tables:

### Core User Tables
- **users**: Primary user table linked to Supabase auth
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email address
  - `created_at`, `updated_at` - Timestamps
  - `is_deleted` (boolean) - Soft delete flag
  - `deleted_at`, `reactivated_at` - Deletion/reactivation timestamps

- **user_preferences**: User settings and onboarding status
  - `user_id` (uuid, foreign key) - Links to users.id
  - `has_completed_onboarding` (boolean) - Onboarding completion flag
  - Created and updated timestamps

- **user_profiles**: Extended user information and profile data
  - `user_id` (uuid, unique foreign key) - Links to users.id
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile image URL
  - `timezone` (text) - User's timezone
  - `login_type` (text) - Authentication method used
  - `email_unsubscribed` (boolean) - Email subscription status
  - `referral_source` (text) - How user found the application
  - `badges` (text[]) - User achievement badges
  - `feedbacks` (jsonb) - User feedback data
  - `profile_image_key` (text) - Storage key for profile image
  - `stripe_customer_id` (text) - Stripe customer identifier
  - `current_subscription_id` (uuid) - Links to active subscription

### Subscription Tables
- **subscriptions**: Stripe subscription management
  - `user_id` (uuid, foreign key) - Links to users.id
  - `stripe_customer_id` (text) - Stripe customer ID (unique)
  - `stripe_subscription_id` (text) - Stripe subscription ID (unique)
  - `status` (text) - Subscription status (trialing, active, canceled, etc.)
  - `price_id` (text) - Stripe price identifier
  - `cancel_at_period_end` (boolean) - Cancellation flag
  - `current_period_end` (timestamptz) - Current billing period end

### Database Features
- **Row Level Security (RLS)** enabled on all tables
- **Automatic timestamps** with triggers for updated_at columns
- **Soft delete** functionality for users
- **JSONB support** for flexible data storage (feedbacks, badges)
- **Comprehensive indexing** for performance optimization
- **RPC functions** for user synchronization and signup flows

### Schema Setup
The complete schema is available in [`database/db_schema_v1.2_with_rpc.sql`](database/db_schema_v1.2_with_rpc.sql) and includes:
- Table creation statements
- Indexes for performance
- Row Level Security policies
- Trigger functions for automatic timestamps
- RPC functions for user management

### Trial Flow Architecture
The database supports a 7-day free trial flow:
1. User registers → creates user record
2. Redirect to Stripe with 7-day trial
3. Subscription created with status='trialing'
4. Automatic conversion to paid subscription after trial
5. Users can cancel anytime during trial with no charge

## 🔗 API Integration

### Authentication (Supabase Auth)
- Email/password authentication
- OAuth provider integration
- Session management
- Protected routes

### Payment Processing (Stripe)
- Checkout integration
- Subscription management
- Webhook handling
- Customer portal

### Optional Integrations
- **AI Services**: OpenAI API for AI features
- **Analytics**: PostHog or similar for user tracking
- **Email**: Resend or SendGrid for notifications
- **Storage**: Supabase Storage for file uploads

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo-name)

### Environment Variables for Production

Ensure all environment variables are properly configured in your hosting platform:

- Supabase URL and keys
- Stripe keys and webhook secret
- OpenAI API key
- PostHog analytics keys
- Google OAuth credentials

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Tailwind CSS team for the utility-first CSS framework
- Supabase team for the backend platform
- Stripe team for the payment infrastructure
- OpenAI for AI capabilities
- shadcn/ui for beautiful components

## 📫 Support

- Project Link: [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)
- Issues: [GitHub Issues](https://github.com/your-username/your-repo-name/issues)
- Documentation: [Check the docs](./docs) (if available)

## 🎉 What's Next?

This boilerplate provides a solid foundation for your SaaS application. Here are some common next steps:

- **Customize the design** to match your brand
- **Add your specific features** and business logic
- **Set up monitoring** and error tracking
- **Implement SEO** optimizations
- **Add testing** with Jest/Testing Library
- **Set up CI/CD** pipelines

---

Built with ❤️ as a SaaS boilerplate template
