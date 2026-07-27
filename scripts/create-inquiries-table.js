import postgres from 'postgres';

const sql = postgres(process.env.SUPABASE_DB_POOL_URL);

async function run() {
  try {
    console.log("Creating inquiries table...");
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          message TEXT,
          status TEXT DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("Successfully created inquiries table!");
  } catch (err) {
    console.error("Failed to create table:", err);
  } finally {
    await sql.end();
  }
}

run();
