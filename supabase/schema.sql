-- Create schema for Kairos application

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  university TEXT,
  major TEXT,
  graduation_year INT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create marketplace apps table
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0.0,
  university TEXT,
  is_new BOOLEAN DEFAULT false,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create app reviews table
CREATE TABLE IF NOT EXISTS public.app_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(app_id, user_id)
);

-- Set up Row Level Security (RLS) policies

-- Profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Waitlist table policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add to waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view waitlist"
  ON public.waitlist FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Page views table policies
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view analytics"
  ON public.page_views FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Apps table policies
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apps are viewable by everyone"
  ON public.apps FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert apps"
  ON public.apps FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update apps"
  ON public.apps FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- App reviews table policies
ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App reviews are viewable by everyone"
  ON public.app_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON public.app_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.app_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for apps table
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON public.apps
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for app reviews table
CREATE TRIGGER update_app_reviews_updated_at
BEFORE UPDATE ON public.app_reviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to update app ratings when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION public.update_app_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.apps
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.app_reviews
    WHERE app_id = COALESCE(NEW.app_id, OLD.app_id)
  )
  WHERE id = COALESCE(NEW.app_id, OLD.app_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for app reviews to update app ratings
CREATE TRIGGER update_app_rating_on_review_insert
AFTER INSERT ON public.app_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_app_rating();

CREATE TRIGGER update_app_rating_on_review_update
AFTER UPDATE ON public.app_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_app_rating();

CREATE TRIGGER update_app_rating_on_review_delete
AFTER DELETE ON public.app_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_app_rating();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auth.users to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
