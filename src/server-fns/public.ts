import { createServerFn } from "@tanstack/react-start";
import { serverSupabase } from "./supabase";
import { type Property } from "@/lib/data";

function mapDbToFrontendProperty(row: any): Property {
  const images = row.property_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
  let imageUrl = images.length > 0 ? images[0].r2_key : "/land-placeholder-1.png";
  if (!imageUrl.startsWith("http")) {
    imageUrl = `${process.env.R2_PUBLIC_BASE_URL || process.env.VITE_R2_PUBLIC_BASE_URL}/${imageUrl}`;
  }

  // Generate a deterministic 4-digit number from the UUID
  const numericHash = parseInt(row.id.replace(/-/g, '').substring(0, 8), 16) % 10000;
  const fourDigitId = String(numericHash).padStart(4, "0");

  return {
    id: row.id,
    listingNumber: fourDigitId,
    title: row.title,
    slug: row.slug,
    propertyType: (row.property_type === "villa" ? "Bungalow" : row.property_type === "apartment" ? "Apartment" : "NA Plot") as any,
    category: row.property_type === "plot" ? "land" : "home",
    price: row.price,
    pricePerSqFt: row.area_sqft ? Math.round(row.price / row.area_sqft) : undefined,
    location: `${row.city}, Karnataka`,
    locality: row.city,
    city: row.city,
    area: row.area_sqft || 0,
    description: row.description || "",
    gallery: images.map((i: any) => i.r2_key.startsWith("http") ? i.r2_key : `${process.env.R2_PUBLIC_BASE_URL || process.env.VITE_R2_PUBLIC_BASE_URL}/${i.r2_key}`),
    image: imageUrl,
    latitude: 15.8497,
    longitude: 74.4977,
    contactNumber: "+91 90000 00000",
    whatsappNumber: "919000000000",
    verified: true,
    hiveVerified: true,
    featured: row.featured || false,
    premium: row.premium || false,
    createdAt: row.created_at,
    updatedAt: row.created_at,
    status: (row.status === "active" ? "Ready to Move" : row.status) as any,
    amenities: row.amenities || [],
    tags: [],
    postedBy: "Agent",
    postedDate: new Date(row.created_at).toLocaleDateString(),
    bhk: row.bhk,
    bathrooms: row.bathrooms,
    parking: row.parking,
    facingDirection: row.facing_direction,
    furnishing: row.furnishing,
    age: row.property_age,
    dimensions: row.dimensions,
    layoutName: row.layout_name,
    land: row.property_type === "plot" ? {
      naStatus: row.na_status || "Non-NA",
      reraApproved: row.rera_approved || false,
      electricity: row.electricity || false,
      drainage: row.drainage || false,
      waterConnection: row.water_connection || false,
      approvals: row.approvals || "",
      surveyNumber: row.survey_number || "",
      nearbyLandmarks: row.nearby_landmarks || "",
      roadWidth: row.road_width || null,
      facingDirection: row.facing_direction || "",
      plotSize: row.area_sqft || 0,
    } : undefined,
    // Nearby
    schools: row.schools || "",
    hospitals: row.hospitals || "",
    shopping: row.shopping || "",
    connectivity: row.connectivity || "",
    vastuCompliant: row.vastu_compliant || false,
    priceOnRequest: row.price_on_request || false,
  } as Property;
}

export const getPublicPropertiesFn = createServerFn({ method: "GET" })
  .validator((d: { search?: string } | void) => d || {})
  .handler(async (ctx) => {
    let data, error;
    
    if (ctx.data?.search) {
      // Use fuzzy search RPC
      const res = await serverSupabase
        .rpc("smart_property_search", { search_term: ctx.data.search })
        .select(`*, property_images(r2_key, is_cover, sort_order)`);
      data = res.data;
      error = res.error;
    } else {
      // Normal fetch
      const res = await serverSupabase
        .from("properties")
        .select(`*, property_images(r2_key, is_cover, sort_order)`)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("Error fetching public properties:", error);
      throw new Error(error.message);
    }

    return (data || []).map(mapDbToFrontendProperty);
  });

export const getPropertiesByTypeFn = createServerFn({ method: "GET" })
  .validator((d: { type: string }) => d)
  .handler(async (ctx) => {
    const { type } = ctx.data;
    const { data, error } = await serverSupabase
      .from("properties")
      .select(`*, property_images(r2_key, is_cover, sort_order)`)
      .eq("status", "active")
      .eq("property_type", type)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data.map(mapDbToFrontendProperty);
  });

export const getPublicPropertyByIdFn = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async (ctx) => {
    const { id } = ctx.data;
    const { data, error } = await serverSupabase
      .from("properties")
      .select(`*, property_images(r2_key, is_cover, sort_order)`)
      .eq("status", "active")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return mapDbToFrontendProperty(data);
  });

export const getPublicPropertyBySlugFn = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(async (ctx) => {
    const { slug } = ctx.data;
    const { data, error } = await serverSupabase
      .from("properties")
      .select(`*, property_images(r2_key, is_cover, sort_order)`)
      .eq("status", "active")
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return mapDbToFrontendProperty(data);
  });
