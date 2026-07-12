import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Hive Estate" },
    { name: "description", content: "Get in touch with the Hive Estate team in Belagavi." },
  ]}),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-p mx-auto max-w-5xl mt-10">
      <h1 className="text-3xl md:text-4xl font-bold">Contact us</h1>
      <p className="mt-2 text-muted-foreground">We're here to help — call, WhatsApp or drop us a message.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
        <form onSubmit={(e) => e.preventDefault()} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Full name" className="rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
            <input placeholder="Phone" className="rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          </div>
          <input placeholder="Email" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          <select className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm">
            <option>I want to buy</option><option>I want to rent</option><option>I want to sell / rent out</option><option>Home loan enquiry</option>
          </select>
          <textarea rows={4} placeholder="Message" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          <button className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Send Message</button>
        </form>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold">Office</div>
            <p className="mt-2 text-sm text-muted-foreground">Camp Road, Belagavi<br />Karnataka 590001</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold">Phone</div>
            <a href="tel:+919000000000" className="mt-2 block text-sm text-primary">+91 90000 00000</a>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold">Email</div>
            <a href="mailto:hello@hiveestate.in" className="mt-2 block text-sm text-primary">hello@hiveestate.in</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
