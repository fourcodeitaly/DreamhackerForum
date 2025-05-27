-- Add original_link column to posts table
ALTER TABLE posts ADD COLUMN original_link TEXT DEFAULT NULL;

CREATE OR REPLACE FUNCTION handle_comment_vote(
  p_user_id UUID,
  p_comment_id UUID,
  p_vote_type INTEGER,
  p_current_vote_type INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- If vote type is 0, remove the vote
  IF p_vote_type = 0 THEN
    -- Remove the vote
    DELETE FROM comment_votes
    WHERE user_id = p_user_id AND comment_id = p_comment_id;
    
    -- Update comment vote counts
    IF p_current_vote_type = 1 THEN
      UPDATE comments
      SET upvotes = GREATEST(upvotes - 1, 0)
      WHERE id = p_comment_id;
    ELSIF p_current_vote_type = -1 THEN
      UPDATE comments
      SET downvotes = GREATEST(downvotes - 1, 0)
      WHERE id = p_comment_id;
    END IF;
  ELSE
    -- Handle existing vote
    IF p_current_vote_type != 0 THEN
      -- Remove the effect of the previous vote
      IF p_current_vote_type = 1 THEN
        UPDATE comments
        SET upvotes = GREATEST(upvotes - 1, 0)
        WHERE id = p_comment_id;
      ELSIF p_current_vote_type = -1 THEN
        UPDATE comments
        SET downvotes = GREATEST(downvotes - 1, 0)
        WHERE id = p_comment_id;
      END IF;
      
      -- Update or delete the vote
      IF p_current_vote_type = p_vote_type THEN
        -- If voting the same way, remove the vote
        DELETE FROM comment_votes
        WHERE user_id = p_user_id AND comment_id = p_comment_id;
        
        -- No need to update counts as we already decremented above
        RETURN;
      ELSE
        -- Update the vote
        UPDATE comment_votes
        SET vote_type = p_vote_type
        WHERE user_id = p_user_id AND comment_id = p_comment_id;
      END IF;
    ELSE
      -- Insert new vote
      INSERT INTO comment_votes (user_id, comment_id, vote_type)
      VALUES (p_user_id, p_comment_id, p_vote_type);
    END IF;
    
    -- Update comment vote counts
    IF p_vote_type = 1 THEN
      UPDATE comments
      SET upvotes = upvotes + 1
      WHERE id = p_comment_id;
    ELSIF p_vote_type = -1 THEN
      UPDATE comments
      SET downvotes = downvotes + 1
      WHERE id = p_comment_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;
