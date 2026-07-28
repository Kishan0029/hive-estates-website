import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getPropertyByIdFn, updatePropertyFn, uploadImageToServerFn } from "@/server-fns/properties";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null || Number.isNaN(Number(val))) ? null : Number(val),
  z.number().nullable()
);

export const Route = createFileRoute("/v2/admin/properties/$id/edit")({
  loader: async ({ params }) => {
    return await getPropertyByIdFn({ data: { id: params.id } });
  },
  component: EditProperty,
});

const schema = z.object({
  listing_number: z.string().optional().nullable(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  property_type: z.enum(["apartment", "villa", "plot", "commercial"]),
  listing_type: z.enum(["sale", "rent"]),
  price: optionalNumber,
  area_sqft: optionalNumber,
  city: z.string().min(2, "City is required"),
  status: z.enum(["draft", "active", "sold", "rented"]),
  price_on_request: z.boolean(),
  description: z.string().optional().nullable(),
  bhk: optionalNumber,
  bathrooms: optionalNumber,
  parking: optionalNumber,
  facing_direction: z.string().optional().nullable(),
  furnishing: z.string().optional().nullable(),
  property_age: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  layout_name: z.string().optional().nullable(),
  na_status: z.string().optional().nullable(),
  rera_approved: z.boolean().optional(),
  premium: z.boolean().optional(),
  featured: z.boolean().optional(),
  amenities: z.string().optional().nullable(), // Will be split by comma
  electricity: z.boolean().optional(),
  drainage: z.boolean().optional(),
  water_connection: z.boolean().optional(),
  vastu_compliant: z.boolean().optional(),
  approvals: z.string().optional().nullable(),
  survey_number: z.string().optional().nullable(),
  nearby_landmarks: z.string().optional().nullable(),
  schools: z.string().optional().nullable(),
  hospitals: z.string().optional().nullable(),
  shopping: z.string().optional().nullable(),
  connectivity: z.string().optional().nullable(),
  road_width: optionalNumber,
}).superRefine((data, ctx) => {
  if (!data.price_on_request && (!data.price || data.price <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price must be greater than 0 when 'Price on Request' is not checked",
      path: ["price"]
    });
  }
});

// Remove FormValues type

function EditProperty() {
  const property = Route.useLoaderData();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>(
    property.property_images ? [...property.property_images].sort((a: any, b: any) => a.sort_order - b.sort_order) : []
  );
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      listing_number: property.listing_number,
      title: property.title,
      slug: property.slug,
      property_type: property.property_type,
      listing_type: property.listing_type,
      price: property.price,
      area_sqft: property.area_sqft,
      city: property.city,
      status: property.status,
      price_on_request: property.price_on_request,
      description: property.description || "",
      bhk: property.bhk,
      bathrooms: property.bathrooms,
      parking: property.parking,
      facing_direction: property.facing_direction || "",
      furnishing: property.furnishing || "",
      property_age: property.property_age || "",
      dimensions: property.dimensions || "",
      layout_name: property.layout_name || "",
      na_status: property.na_status || "",
      rera_approved: property.rera_approved || false,
      premium: property.premium || false,
      featured: property.featured || false,
      electricity: property.electricity || false,
      drainage: property.drainage || false,
      water_connection: property.water_connection || false,
      vastu_compliant: property.vastu_compliant || false,
      approvals: property.approvals || "",
      survey_number: property.survey_number || "",
      nearby_landmarks: property.nearby_landmarks || "",
      schools: property.schools || "",
      hospitals: property.hospitals || "",
      shopping: property.shopping || "",
      connectivity: property.connectivity || "",
      road_width: property.road_width,
      amenities: property.amenities ? property.amenities.join(", ") : "",
    }
  });

  const propertyType = watch("property_type");
  const title = watch("title");
  const priceOnRequest = watch("price_on_request");

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [title, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    setUploading(true);
    try {
      const newImageKeys: string[] = [];
      
      for (const file of images) {
        const base64 = await fileToBase64(file);
        const res = await uploadImageToServerFn({ 
          data: { 
            filename: file.name, 
            contentType: file.type, 
            base64 
          } 
        });
        newImageKeys.push(res.r2Key);
      }

      const allImageKeys = [...existingImages.map(img => img.r2_key), ...newImageKeys];

      await updatePropertyFn({
        data: {
          id,
          data: {
            ...data,
            price: data.price_on_request ? 0 : data.price,
            area_sqft: data.area_sqft ? Number(data.area_sqft) : undefined,
            amenities: data.amenities ? data.amenities.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
          },
          imageKeys: allImageKeys
        }
      });
      
      alert("Property updated successfully!");
      navigate({ to: "/v2/admin/properties" });
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-sm text-muted-foreground mt-1">Make changes to the listing below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {Object.keys(errors).length > 0 && (
           <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-semibold">
             Please fix the validation errors below:
             <ul className="list-disc ml-5 mt-2 font-normal">
               {Object.entries(errors).map(([key, err]) => (
                 <li key={key}>{err?.message as string || `${key} is invalid`}</li>
               ))}
             </ul>
           </div>
        )}

        {submitError && (
           <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-semibold">
             {submitError}
           </div>
        )}

        {/* BASIC DETAILS */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Basic Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Listing Number</label>
              <input {...register("listing_number")} readOnly className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm focus:border-primary transition outline-none cursor-not-allowed font-mono font-bold" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Title</label>
              <input {...register("title")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. 3 BHK Luxury Villa" />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Slug (URL)</label>
              <input {...register("slug")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. 3-bhk-luxury-villa" />
              {errors.slug && <p className="text-destructive text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Property Type</label>
              <select {...register("property_type")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                <option value="apartment">Apartment</option>
                <option value="villa">Bungalow / Villa</option>
                <option value="plot">Plot / Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
              <textarea {...register("description")} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="Write a compelling description..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">City</label>
              <input {...register("city")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Price (INR)</label>
              <input type="number" {...register("price", { valueAsNumber: true })} disabled={priceOnRequest} className={`w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none ${priceOnRequest ? "opacity-50 cursor-not-allowed bg-muted" : ""}`} placeholder={priceOnRequest ? "Price on Request" : "0"} />
              {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Area (SqFt)</label>
              <input type="number" {...register("area_sqft", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="1200" />
            </div>
            
            <div className="flex items-center gap-2 mt-8">
              <input type="checkbox" id="price_on_request" {...register("price_on_request")} className="w-4 h-4 rounded border-border" />
              <label htmlFor="price_on_request" className="text-sm font-semibold">Price on Request?</label>
            </div>
          </div>
        </div>

        {/* SPECIFIC DETAILS */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Property Specifications</h2>
          </div>
          <div className="p-8 grid md:grid-cols-3 gap-6">
            
            {/* If Plot */}
            {propertyType === "plot" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">NA Status</label>
                  <select {...register("na_status")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                    <option value="">Select...</option>
                    <option value="NA Approved">NA Approved</option>
                    <option value="Non-NA">Non-NA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Dimensions</label>
                  <input {...register("dimensions")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. 40x60" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Layout Name</label>
                  <input {...register("layout_name")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. Green Valley" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Survey Number</label>
                  <input {...register("survey_number")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. 142/A" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Approvals</label>
                  <input {...register("approvals")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. BUDA, BDA" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Road Width (ft)</label>
                  <input type="number" {...register("road_width", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. 30" />
                </div>
                
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="electricity" {...register("electricity")} className="w-4 h-4 rounded border-border" />
                    <label htmlFor="electricity" className="text-sm font-semibold">Electricity Available</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="drainage" {...register("drainage")} className="w-4 h-4 rounded border-border" />
                    <label htmlFor="drainage" className="text-sm font-semibold">Drainage / Gutters</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="water_connection" {...register("water_connection")} className="w-4 h-4 rounded border-border" />
                    <label htmlFor="water_connection" className="text-sm font-semibold">Water Connection</label>
                  </div>
                </div>
              </>
            )}

            {/* If Home */}
            {(propertyType === "apartment" || propertyType === "villa") && (
              <>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">BHK</label>
                  <input type="number" {...register("bhk", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bathrooms</label>
                  <input type="number" {...register("bathrooms", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Parking</label>
                  <input type="number" {...register("parking", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="1" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Furnishing</label>
                  <select {...register("furnishing")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                    <option value="">Select...</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Property Age</label>
                  <select {...register("property_age")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                    <option value="">Select...</option>
                    <option value="New">New / Under Construction</option>
                    <option value="0-5 Years">0-5 Years</option>
                    <option value="5-10 Years">5-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Facing Direction</label>
              <select {...register("facing_direction")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                <option value="">Select...</option>
                <option value="East">East (Vastu)</option>
                <option value="North">North (Vastu)</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="North-East">North-East</option>
              </select>
            </div>
            
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="vastu_compliant" {...register("vastu_compliant")} className="w-4 h-4 rounded border-border" />
                <label htmlFor="vastu_compliant" className="text-sm font-semibold">Vastu Compliant</label>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Amenities (Comma separated)</label>
              <input {...register("amenities")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. Swimming Pool, Gym, 24x7 Security" />
            </div>
          </div>
        </div>

        {/* NEARBY HOTSPOTS */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Nearby Hotspots & Connectivity</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nearby Landmarks</label>
              <input {...register("nearby_landmarks")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. Near Big Bazaar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Schools</label>
              <input {...register("schools")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. KLE School (0.8 km)" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Hospitals</label>
              <input {...register("hospitals")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. KLES Hospital (2 km)" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Shopping / Malls</label>
              <input {...register("shopping")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. City Market (0.9 km)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Connectivity / Transit</label>
              <input {...register("connectivity")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="e.g. Railway Station (3 km), Bus Stand (2 km)" />
            </div>
          </div>
        </div>

        {/* PUBLISHING */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Publishing Options</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Listing Status</label>
              <select {...register("status")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                <option value="draft">Draft (Hidden)</option>
                <option value="active">Active (Public)</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="rera_approved" {...register("rera_approved")} className="w-4 h-4 rounded border-border" />
                <label htmlFor="rera_approved" className="text-sm font-semibold">RERA Approved</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="premium" {...register("premium")} className="w-4 h-4 rounded border-border" />
                <label htmlFor="premium" className="text-sm font-semibold text-primary">Premium Listing</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" {...register("featured")} className="w-4 h-4 rounded border-border" />
                <label htmlFor="featured" className="text-sm font-semibold text-accent">Featured on Home Page</label>
              </div>
            </div>
          </div>
        </div>

         {/* MEDIA */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Media</h2>
          </div>
          <div className="p-8">
             {existingImages.length > 0 && (
               <div className="mb-6">
                 <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Existing Images</label>
                 <div className="flex gap-4 overflow-x-auto py-2">
                   {existingImages.map((img: any, i) => (
                     <div key={img.r2_key} className="shrink-0 w-24 h-24 rounded-xl border border-border overflow-hidden relative group">
                       <img src={img.url} alt="existing" className="w-full h-full object-cover" />
                       {img.is_cover && (
                         <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-white text-[10px] font-bold text-center py-0.5 pointer-events-none">
                           COVER
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))} className="text-white hover:text-destructive transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Add New Images</label>
             <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-muted/10 transition cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="font-bold text-foreground">Click or drag images here to add more</p>
                <p className="text-sm text-muted-foreground mt-1">New images will be appended to the existing ones.</p>
             </div>
             {images.length > 0 && (
               <div className="mt-4 flex gap-4 overflow-x-auto py-2">
                 {images.map((img, i) => (
                   <div key={i} className="shrink-0 w-24 h-24 rounded-xl border border-border overflow-hidden relative group">
                     <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-white">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate({ to: "/v2/admin/properties" })} className="px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-secondary transition">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || uploading} className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:opacity-90 hover:-translate-y-0.5 transition disabled:opacity-50">
            {uploading || isSubmitting ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
