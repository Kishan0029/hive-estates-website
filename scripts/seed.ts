import { createClient } from "@supabase/supabase-js";
import { PROPERTIES } from "../src/lib/data";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log(`Starting to seed ${PROPERTIES.length} properties...`);

  for (const p of PROPERTIES) {
    console.log(`Seeding: ${p.title}`);

    // Map legacy propertyType to the enum in DB
    let property_type = "apartment";
    if (p.propertyType === "Bungalow") property_type = "villa";
    if (p.propertyType === "NA Plot" || p.propertyType === "Non-NA Plot") property_type = "plot";

    let status = "active";
    if (p.status === "Available" || p.status === "Ready to Move" || p.status === "New Launch" || p.status === "Under Construction") {
      status = "active";
    }

    const { data: propData, error: propErr } = await supabase
      .from("properties")
      .insert([
        {
          title: p.title,
          slug: p.slug,
          property_type: property_type,
          listing_type: "sale",
          price: p.price || 0,
          city: "Belagavi",
          status: status,
          price_on_request: p.priceOnRequest || false,
          area_sqft: p.area || null,
          currency: "INR",
        }
      ])
      .select("id")
      .single();

    if (propErr) {
      console.error(`Failed to insert ${p.title}:`, propErr.message);
      continue;
    }

    const property_id = propData.id;

    // For images, we won't upload to R2 during seed, 
    // we'll just insert the URLs directly into r2_key for now, 
    // and modify our frontend to handle raw URLs if they start with http.
    if (p.gallery && p.gallery.length > 0) {
      const imagesToInsert = p.gallery.map((url, index) => ({
        property_id,
        r2_key: url,
        sort_order: index,
        is_cover: index === 0,
      }));

      const { error: imgErr } = await supabase
        .from("property_images")
        .insert(imagesToInsert);

      if (imgErr) {
        console.error(`Failed to insert images for ${p.title}:`, imgErr.message);
      }
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
