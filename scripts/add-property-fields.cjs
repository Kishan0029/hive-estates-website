const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/SUPABASE_DB_POOL_URL=(.*)/);
const connectionString = match ? match[1].trim() : null;

const { Client } = require('pg');

async function migrate() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to Supabase Postgres via pool URL");

    // Add new columns to properties table
    console.log("Adding new columns to properties table...");
    
    // Boolean columns
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity BOOLEAN DEFAULT FALSE;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS drainage BOOLEAN DEFAULT FALSE;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_connection BOOLEAN DEFAULT FALSE;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS vastu_compliant BOOLEAN DEFAULT FALSE;');
    
    // Text columns
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS approvals TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS survey_number TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_landmarks TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS schools TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS hospitals TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS shopping TEXT;');
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS connectivity TEXT;');
    
    // Numeric column
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_width NUMERIC;');

    console.log("Columns added successfully!");

    // Enable pg_trgm for fuzzy search
    console.log("Enabling pg_trgm extension...");
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    // Create the RPC function for smart search
    console.log("Creating smart_property_search function...");
    const rpcQuery = `
CREATE OR REPLACE FUNCTION smart_property_search(search_term text)
RETURNS SETOF properties AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM properties
  WHERE 
    status = 'active' AND (
      search_term IS NULL
      OR search_term = ''
      OR title ILIKE '%' || search_term || '%'
      OR city ILIKE '%' || search_term || '%'
      OR address_line ILIKE '%' || search_term || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(amenities) AS amenity 
        WHERE amenity ILIKE '%' || search_term || '%'
      )
      -- Fallback to fuzzy search if no exact substring match is found
      OR title % search_term
      OR city % search_term
      OR address_line % search_term
    )
  ORDER BY 
    CASE 
      WHEN search_term IS NOT NULL AND search_term != '' THEN
        greatest(
          similarity(title, search_term),
          similarity(city, search_term),
          similarity(address_line, search_term)
        )
      ELSE 0
    END DESC,
    created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    await client.query(rpcQuery);
    console.log("RPC function smart_property_search created successfully!");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
