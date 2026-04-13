-- Add grade column to profiles for student grade tracking
-- Safe to re-run: uses IF NOT EXISTS pattern via DO block.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'grade'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN grade text;
  END IF;
END
$$;

-- Update the trigger function to also extract grade from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, grade)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'grade'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
