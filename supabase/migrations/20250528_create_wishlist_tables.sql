-- Create wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  mockup_link VARCHAR(255),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(255),
  votes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wish votes table to track who voted for what
CREATE TABLE IF NOT EXISTS wish_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wish_id UUID NOT NULL REFERENCES wishes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wish_id, user_id)
);

-- Create function to increment wish votes
CREATE OR REPLACE FUNCTION increment_wish_votes(wish_id UUID)
RETURNS wishes
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_wish wishes;
BEGIN
  UPDATE wishes
  SET votes = votes + 1
  WHERE id = wish_id
  RETURNING * INTO updated_wish;
  
  RETURN updated_wish;
END;
$$;

-- Create function to check if a wish has reached badge thresholds
CREATE OR REPLACE FUNCTION check_wish_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  badge_added BOOLEAN := FALSE;
  current_badges TEXT[] := NEW.badges;
BEGIN
  -- Check for Community Favorite badge (100+ votes)
  IF NEW.votes >= 100 AND NOT 'community-favorite' = ANY(current_badges) THEN
    current_badges := array_append(current_badges, 'community-favorite');
    badge_added := TRUE;
  END IF;
  
  -- If any badges were added, update the record
  IF badge_added THEN
    NEW.badges := current_badges;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to check badges when votes are updated
CREATE TRIGGER check_wish_badges_trigger
BEFORE UPDATE OF votes ON wishes
FOR EACH ROW
EXECUTE FUNCTION check_wish_badges();

-- Enable row level security
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for wishes table
CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert wishes"
  ON wishes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishes"
  ON wishes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for wish_votes table
CREATE POLICY "Anyone can read wish votes"
  ON wish_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert votes"
  ON wish_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable real-time subscriptions for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE wish_votes;
