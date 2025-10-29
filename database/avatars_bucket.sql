-- =========================================================
-- FIX AVATARS RLS POLICIES - Run this in Supabase SQL Editor
-- =========================================================
-- This script fixes the avatar upload RLS policy violation

-- 1. Ensure avatars bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Remove any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access to avatars" ON storage.objects;

-- 3. Create new policies for avatars bucket
-- Users can upload files to their own folder (userId/fileName)
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can read files from their own folder and all avatars are public
CREATE POLICY "Users can read their own avatar" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'anon')
);

-- Users can update files in their own folder
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete files from their own folder
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Service role has full access
CREATE POLICY "Service role full access to avatars" ON storage.objects
FOR ALL TO service_role USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated, anon;

-- 5. Test the policies (optional)
-- You can test by running:
-- SELECT storage.filename(name), storage.foldername(name)
-- FROM storage.objects
-- WHERE bucket_id = 'avatars';