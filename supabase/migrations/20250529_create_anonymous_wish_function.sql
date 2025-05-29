-- Create a function to insert anonymous wishes bypassing foreign key constraints
CREATE OR REPLACE FUNCTION insert_anonymous_wish(
  p_title VARCHAR,
  p_category VARCHAR,
  p_description TEXT DEFAULT '',
  p_mockup_link VARCHAR DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_wish_id UUID;
BEGIN
  -- Insert the wish directly into the wishes table
  -- The function uses SECURITY DEFINER to bypass RLS policies
  INSERT INTO wishes (
    title,
    category,
    description,
    mockup_link,
    user_id,
    author_name,
    author_avatar
  ) VALUES (
    p_title,
    p_category,
    p_description,
    p_mockup_link,
    '00000000-0000-0000-0000-000000000000'::UUID, -- Anonymous user ID
    'Anonymous Wisher',
    NULL
  )
  RETURNING id INTO new_wish_id;
  
  RETURN new_wish_id;
END;
$$;

-- Add a special anonymous user if it doesn't exist (required for foreign key integrity)
DO $$
BEGIN
  -- Only proceed if the anonymous user doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000'::UUID
  ) THEN
    -- This part would typically be done via Supabase dashboard or API
    -- For a complete solution, create an anonymous user via Supabase admin API
    -- This is a placeholder to indicate what needs to be done
    RAISE NOTICE 'Anonymous user needs to be created manually with ID 00000000-0000-0000-0000-000000000000';
  END IF;
END
$$;
