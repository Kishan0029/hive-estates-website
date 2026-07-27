import postgres from 'postgres';

const sql = postgres(process.env.SUPABASE_DB_POOL_URL);

async function run() {
  try {
    console.log("Starting database alteration...");
    await sql`
      ALTER TABLE properties 
        ADD COLUMN IF NOT EXISTS description TEXT,
        ADD COLUMN IF NOT EXISTS bhk INTEGER,
        ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
        ADD COLUMN IF NOT EXISTS parking INTEGER,
        ADD COLUMN IF NOT EXISTS facing_direction TEXT,
        ADD COLUMN IF NOT EXISTS furnishing TEXT,
        ADD COLUMN IF NOT EXISTS property_age TEXT,
        ADD COLUMN IF NOT EXISTS dimensions TEXT,
        ADD COLUMN IF NOT EXISTS layout_name TEXT,
        ADD COLUMN IF NOT EXISTS na_status TEXT,
        ADD COLUMN IF NOT EXISTS rera_approved BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
    `;
    console.log("Successfully altered properties table!");
  } catch (err) {
    console.error("Failed to alter table:", err);
  } finally {
    await sql.end();
  }
}

run();
