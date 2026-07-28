import { createServerFn } from "@tanstack/react-start";
import { serverSupabase } from "./supabase";
import { generateUploadUrl, uploadToR2 } from "./r2";

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

export const getNextListingNumberFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await serverSupabase
    .from("properties")
    .select("listing_number")
    .not("listing_number", "is", null)
    .order("listing_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    // Ignore no rows found error
    console.error("Error fetching next listing number:", error);
  }

  if (data && data.listing_number) {
    const numPart = data.listing_number.replace(/[^0-9]/g, "");
    const nextNum = parseInt(numPart, 10) + 1;
    if (!isNaN(nextNum)) {
      return `#${String(nextNum).padStart(4, "0")}`;
    }
  }
  
  return "#0101";
});

export const getPropertyByIdFn = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async (ctx) => {
    const { data, error } = await serverSupabase
      .from("properties")
      .select(`*, property_images(r2_key, is_cover, sort_order)`)
      .eq("id", ctx.data.id)
      .single();

    if (error) {
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

export const uploadImageToServerFn = createServerFn({ method: "POST" })
  .validator((d: { filename: string; contentType: string; base64: string }) => d)
  .handler(async (ctx) => {
    try {
      const ext = ctx.data.filename.split('.').pop();
      const uniqueId = crypto.randomUUID();
      const r2Key = `properties/${uniqueId}.${ext}`;
      
      const buffer = Buffer.from(ctx.data.base64, 'base64');
      
      const { PutObjectCommand } = await import("@aws-sdk/client-s3");
      const { r2Client } = await import("./r2");
      
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME?.trim(),
        Key: r2Key,
        ContentType: ctx.data.contentType,
        Body: buffer,
      });
      await r2Client.send(command);
      
      return { r2Key };
    } catch (err: any) {
      throw new Error(err.message || "Failed to upload to R2");
    }
  });

export const createPropertyFn = createServerFn({ method: "POST" })
  .validator((d: { data: any, imageKeys: string[] }) => d)
  .handler(async (ctx) => {
    const { data, imageKeys } = ctx.data;
  
  const { data: propData, error: propErr } = await serverSupabase
    .from("properties")
    .insert([
      {
        listing_number: data.listing_number,
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
        description: data.description,
        bhk: data.bhk ? Number(data.bhk) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        parking: data.parking ? Number(data.parking) : null,
        facing_direction: data.facing_direction,
        furnishing: data.furnishing,
        property_age: data.property_age,
        dimensions: data.dimensions,
        layout_name: data.layout_name,
        na_status: data.na_status,
        rera_approved: data.rera_approved || false,
        premium: data.premium || false,
        featured: data.featured || false,
        amenities: data.amenities || [],
        electricity: data.electricity || false,
        drainage: data.drainage || false,
        water_connection: data.water_connection || false,
        vastu_compliant: data.vastu_compliant || false,
        approvals: data.approvals || null,
        survey_number: data.survey_number || null,
        nearby_landmarks: data.nearby_landmarks || null,
        schools: data.schools || null,
        hospitals: data.hospitals || null,
        shopping: data.shopping || null,
        connectivity: data.connectivity || null,
        road_width: data.road_width ? Number(data.road_width) : null,
      }
    ])
    .select("id")
    .single();

  if (propErr) {
    throw new Error(propErr.message);
  }

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

export const deletePropertyFn = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async (ctx) => {
    const { id } = ctx.data;
    const { error } = await serverSupabase
      .from("properties")
      .delete()
      .eq("id", id);
      
    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  });

export const updatePropertyFn = createServerFn({ method: "POST" })
  .validator((d: { id: string, data: any, imageKeys?: string[] }) => d)
  .handler(async (ctx) => {
    const { id, data, imageKeys } = ctx.data;
  
    const { error: propErr } = await serverSupabase
      .from("properties")
      .update({
        title: data.title,
        slug: data.slug,
        property_type: data.property_type,
        listing_type: data.listing_type,
        price: data.price,
        city: data.city,
        status: data.status,
        price_on_request: data.price_on_request,
        area_sqft: data.area_sqft || null,
        description: data.description,
        bhk: data.bhk ? Number(data.bhk) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        parking: data.parking ? Number(data.parking) : null,
        facing_direction: data.facing_direction,
        furnishing: data.furnishing,
        property_age: data.property_age,
        dimensions: data.dimensions,
        layout_name: data.layout_name,
        na_status: data.na_status,
        rera_approved: data.rera_approved || false,
        premium: data.premium || false,
        featured: data.featured || false,
        amenities: data.amenities || [],
        electricity: data.electricity || false,
        drainage: data.drainage || false,
        water_connection: data.water_connection || false,
        vastu_compliant: data.vastu_compliant || false,
        approvals: data.approvals || null,
        survey_number: data.survey_number || null,
        nearby_landmarks: data.nearby_landmarks || null,
        schools: data.schools || null,
        hospitals: data.hospitals || null,
        shopping: data.shopping || null,
        connectivity: data.connectivity || null,
        road_width: data.road_width ? Number(data.road_width) : null,
      })
      .eq("id", id);

    if (propErr) {
      throw new Error(propErr.message);
    }

    if (imageKeys && imageKeys.length > 0) {
      await serverSupabase.from("property_images").delete().eq("property_id", id);
      
      const imagesToInsert = imageKeys.map((key, index) => ({
        property_id: id,
        r2_key: key,
        sort_order: index,
        is_cover: index === 0,
      }));

      await serverSupabase.from("property_images").insert(imagesToInsert);
    }

    return { success: true };
  });

export const getAdminDashboardStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data: activeData, error: activeErr } = await serverSupabase
    .from("properties")
    .select("id", { count: "exact" })
    .eq("status", "active");

  const { data: pendingData, error: pendingErr } = await serverSupabase
    .from("properties")
    .select("id", { count: "exact" })
    .eq("status", "draft");
    
  const { data: soldData, error: soldErr } = await serverSupabase
    .from("properties")
    .select("id", { count: "exact" })
    .in("status", ["sold", "rented"]);

  const { data: inqData } = await serverSupabase
    .from("inquiries")
    .select("id", { count: "exact" });

  return {
    activeListings: activeData?.length ?? 0,
    pendingApprovals: pendingData?.length ?? 0,
    propertiesSold: soldData?.length ?? 0,
    totalInquiries: inqData?.length ?? 0,
  };
});

export const createInquiryFn = createServerFn({ method: "POST" })
  .validator((d: { property_id: string, name: string, email: string, phone: string, message: string }) => d)
  .handler(async (ctx) => {
    const { error } = await serverSupabase
      .from("inquiries")
      .insert([ctx.data]);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  });

export const getAdminInquiriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await serverSupabase
    .from("inquiries")
    .select(`
      *,
      property:property_id ( title )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
});

export const markInquiryReadFn = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async (ctx) => {
    const { error } = await serverSupabase
      .from("inquiries")
      .update({ status: 'read' })
      .eq("id", ctx.data.id);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  });
