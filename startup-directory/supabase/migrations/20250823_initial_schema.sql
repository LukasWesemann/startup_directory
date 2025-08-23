-- Create enums
CREATE TYPE stage_enum AS ENUM ('idea','pre-seed','seed','series-a','series-b','growth','public');

-- Create startups table (1:1 with auth.users)
CREATE TABLE public.startups (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  tagline TEXT,
  description_md TEXT,
  website_url TEXT,
  location TEXT,
  sectors TEXT[],
  stage stage_enum DEFAULT 'idea'::stage_enum,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on slug
CREATE INDEX startups_slug_idx ON public.startups (slug);

-- Create updates table (many per startup)
CREATE TABLE public.updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  title TEXT,
  content_md TEXT NOT NULL, -- 2 short paragraphs or bullet points (markdown)
  images JSONB NOT NULL DEFAULT '[]', -- array of { url, w, h, alt }
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for updates
CREATE INDEX updates_feed_idx ON public.updates (is_published, published_at DESC);
CREATE INDEX updates_startup_idx ON public.updates (startup_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END 
$$;

CREATE TRIGGER startups_touch 
  BEFORE UPDATE ON public.startups 
  FOR EACH ROW 
  EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TRIGGER updates_touch  
  BEFORE UPDATE ON public.updates  
  FOR EACH ROW 
  EXECUTE FUNCTION public.tg_touch_updated_at();

-- Create startup row at signup (DB trigger on auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
  base TEXT := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1));
  proposed_slug TEXT := regexp_replace(lower(base),'[^a-z0-9]+','-','g');
  unique_slug TEXT := proposed_slug;
  i INT := 1;
BEGIN
  WHILE EXISTS (SELECT 1 FROM public.startups s WHERE s.slug = unique_slug) LOOP
    i := i + 1;
    unique_slug := proposed_slug || '-' || i::text;
  END LOOP;

  INSERT INTO public.startups(id, name, slug)
  VALUES (NEW.id, base, unique_slug);
  RETURN NEW;
END 
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

-- Public can read public startups and published updates
CREATE POLICY "read_public_startups" ON public.startups
  FOR SELECT USING (is_public);

CREATE POLICY "read_published_updates" ON public.updates
  FOR SELECT USING (
    is_published AND EXISTS (
      SELECT 1 FROM public.startups s
      WHERE s.id = updates.startup_id AND s.is_public
    )
  );

-- Owners can read their own startup data
CREATE POLICY "owner_read_startup" ON public.startups
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Owners can manage their startup row
CREATE POLICY "owner_update_startup" ON public.startups
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Owners can read their own updates
CREATE POLICY "owner_read_update" ON public.updates
  FOR SELECT TO authenticated
  USING (startup_id = auth.uid());

-- Owners can create/update/delete their own updates
CREATE POLICY "owner_insert_update" ON public.updates
  FOR INSERT TO authenticated
  WITH CHECK (startup_id = auth.uid());

CREATE POLICY "owner_modify_update" ON public.updates
  FOR UPDATE TO authenticated
  USING (startup_id = auth.uid())
  WITH CHECK (startup_id = auth.uid());

CREATE POLICY "owner_delete_update" ON public.updates
  FOR DELETE TO authenticated
  USING (startup_id = auth.uid()); 