import { createServerFn } from "@tanstack/react-start";
import { serverSupabase } from "./supabase";
import { generateUploadUrl } from "./r2";

export const getAdminPropertiesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await serverSupabase
    .from("properties")
    .select(`
      id,
      title,
      property_type,
      listing_type,
      price,
      status,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    throw new Error(error.message);
  }

  return data;
});

export const getUploadUrlFn = createServerFn({ method: "POST" })
  .validator((d: { filename: string, contentType: string }) => d)
  .handler(async (ctx) => {
    const payload = ctx.data;
  try {
    const ext = payload.filename.split('.').pop();
    // Use standard Web Crypto API available in Edge/Node 18+
    const uniqueId = crypto.randomUUID();
    const r2Key = `properties/${uniqueId}.${ext}`;
    
    const url = await generateUploadUrl(r2Key, payload.contentType);
    return { url, r2Key };
  } catch (err: any) {
    throw new Error(err.message || "Failed to generate upload URL");
  }
});

export const createPropertyFn = createServerFn({ method: "POST" })
  .validator((d: { data: any, imageKeys: string[] }) => d)
  .handler(async (ctx) => {
    const { data, imageKeys } = ctx.data;
  
  // 1. Insert property
  const { data: propData, error: propErr } = await serverSupabase
    .from("properties")
    .insert([
      {
        title: data.title,
        slug: data.slug,
        property_type: data.property_type,
        listing_type: data.listing_type,
        price: data.price,
        city: data.city,
        status: data.status,
        price_on_request: data.price_on_request,
        area_sqft: data.area_sqft || null,
        currency: "INR",
      }
    ])
    .select("id")
    .single();

  if (propErr) {
    throw new Error(propErr.message);
  }

  // 2. Insert image references
  if (imageKeys && imageKeys.length > 0) {
    const imagesToInsert = imageKeys.map((key, index) => ({
      property_id: propData.id,
      r2_key: key,
      sort_order: index,
      is_cover: index === 0,
    }));

    const { error: imgErr } = await serverSupabase
      .from("property_images")
      .insert(imagesToInsert);

    if (imgErr) {
      throw new Error("Property created, but images failed: " + imgErr.message);
    }
  }

  return propData;
});
