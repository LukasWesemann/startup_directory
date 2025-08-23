-- Create storage bucket for startup logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'startup-logos',
  'startup-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create RLS policies for the storage bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'startup-logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'startup-logos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'startup-logos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'startup-logos' 
    AND auth.role() = 'authenticated'
  ); 