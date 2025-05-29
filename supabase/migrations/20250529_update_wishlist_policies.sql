-- Drop the existing policy that restricts wish insertion to authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert wishes" ON wishes;

-- Create a new policy that allows anyone to insert wishes
CREATE POLICY "Anyone can insert wishes"
  ON wishes FOR INSERT
  USING (true);

-- Drop the existing policy that restricts voting to authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert votes" ON wish_votes;

-- Create a new policy that allows anyone to insert votes
CREATE POLICY "Anyone can insert votes"
  ON wish_votes FOR INSERT
  USING (true);
