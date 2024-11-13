CREATE OR REPLACE FUNCTION increment(row_id uuid, value integer)
RETURNS void AS $$
BEGIN
    UPDATE news_posts
    SET score = score + value
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;