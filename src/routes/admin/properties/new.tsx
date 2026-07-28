import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { uploadImageToServerFn, createPropertyFn, getNextListingNumberFn } from "@/server-fns/properties";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null || Number.isNaN(Number(val))) ? null : Number(val),
  z.number().nullable()
);

export const Route = createFileRoute("/admin/properties/new")({
  loader: async () => {
    const nextListingNumber = await getNextListingNumberFn();
    return { nextListingNumber };
  },
  component: AddProperty,
});

const schema = z.object({
  listing_number: z.string(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  property_type: z.enum(["apartment", "villa", "plot", "commercial"]),
  listing_type: z.enum(["sale", "rent"]),
  price: z.number({ invalid_type_error: "Price is required" }).min(1, "Price must be greater than 0"),
  area_sqft: optionalNumber,
  city: z.string().min(2, "City is required"),
  status: z.enum(["draft", "active", "sold", "rented"]),
  price_on_request: z.boolean(),
  description: z.string().optional().nullable(),
  bhk: optionalNumber,
  bathrooms: optionalNumber,
  parking: optionalNumber,
  facing_direction: z.string().optional().nullable(),
  furnishing: z.string().optional(),
  property_age: z.string().optional(),
  dimensions: z.string().optional(),
  layout_name: z.string().optional(),
  na_status: z.string().optional(),
  rera_approved: z.boolean().optional(),
  premium: z.boolean().optional(),
  featured: z.boolean().optional(),
  amenities: z.string().optional(), // Will be split by comma
  electricity: z.boolean().optional(),
  drainage: z.boolean().optional(),
  water_connection: z.boolean().optional(),
  vastu_compliant: z.boolean().optional(),
  approvals: z.string().optional(),
  survey_number: z.string().optional(),
  nearby_landmarks: z.string().optional(),
  schools: z.string().optional(),
  hospitals: z.string().optional(),
  shopping: z.string().optional(),
  connectivity: z.string().optional(),
  road_width: optionalNumber,
});

// Remove FormValues type

function AddProperty() {
  const { nextListingNumber } = Route.useLoaderData();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      listing_number: nextListingNumber,
      listing_type: "sale",
      property_type: "plot",
      status: "draft",
      price_on_request: false,
      city: "Belagavi",
      rera_approved: false,
      premium: false,
      featured: false,
      electricity: false,
      drainage: false,
      water_connection: false,
      vastu_compliant: false,
    }
  });
  
  const propertyType = watch("property_type");
  const title = watch("title");

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

  const uploadImagesToR2 = async () => {
    const uploadedKeys: string[] = [];
    for (const file of images) {
      const base64 = await fileToBase64(file);
      const { r2Key } = await uploadImageToServerFn({ 
        data: { 
          filename: file.name, 
          contentType: file.type, 
          base64 
        } 
      });
      uploadedKeys.push(r2Key);
    }
    return uploadedKeys;
  };

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    setUploading(true);
    try {
      const uploadedImageKeys = await uploadImagesToR2();

      await createPropertyFn({
        data: {
          data: {
            ...data,
            area_sqft: data.area_sqft ? Number(data.area_sqft) : undefined,
            amenities: data.amenities ? data.amenities.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
          },
          imageKeys: uploadedImageKeys
        }
      });
      
      alert("Property published successfully!");
      navigate({ to: "/admin/properties" });
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill out the complete details below to create a new listing.</p>
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
              <input type="number" {...register("price", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="0" />
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
             <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Upload Images (R2 Edge Storage)</label>
             <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-muted/10 transition cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="font-bold text-foreground">Click or drag images here</p>
                <p className="text-sm text-muted-foreground mt-1">High-resolution JPEGs or PNGs</p>
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
          <button type="button" onClick={() => navigate({ to: "/admin/properties" })} className="px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-secondary transition">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || uploading} className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:opacity-90 hover:-translate-y-0.5 transition disabled:opacity-50">
            {uploading || isSubmitting ? "Saving & Uploading..." : "Publish Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
