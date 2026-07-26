import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getUploadUrlFn, createPropertyFn } from "@/lib/server/properties";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const Route = createFileRoute("/admin/properties/new")({
  component: AddProperty,
});

const schema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  property_type: z.enum(["apartment", "villa", "plot", "commercial"]),
  listing_type: z.enum(["sale", "rent"]),
  price: z.number().min(1),
  area_sqft: z.number().optional(),
  city: z.string().min(2),
  status: z.enum(["draft", "active", "sold", "rented"]),
  price_on_request: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function AddProperty() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      listing_type: "sale",
      property_type: "plot",
      status: "draft",
      price_on_request: false,
      city: "Belagavi"
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImagesToR2 = async () => {
    const uploadedKeys: string[] = [];
    for (const file of images) {
      const { url, r2Key } = await getUploadUrlFn({
        data: {
          filename: file.name,
          contentType: file.type
        }
      });

      // Upload directly to R2 using the pre-signed URL
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      uploadedKeys.push(r2Key);
    }
    return uploadedKeys;
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setUploading(true);
    try {
      // 1. Upload Images
      const uploadedImageKeys = await uploadImagesToR2();

      // 2. Save to Supabase
      await createPropertyFn({
        data: {
          data: {
            ...data,
            area_sqft: data.area_sqft ? Number(data.area_sqft) : undefined,
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
        <p className="text-sm text-muted-foreground mt-1">Fill out the details below to create a new listing.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {submitError && (
           <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-semibold">
             {submitError}
           </div>
        )}

        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="font-bold">Basic Details</h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
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
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">City</label>
              <input {...register("city")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" />
              {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Price (INR)</label>
              <input type="number" {...register("price", { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none" placeholder="0" />
              {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Property Type</label>
              <select {...register("property_type")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary transition outline-none">
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot / Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>
        </div>

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
