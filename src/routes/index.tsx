import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ExternalLink, Layers, Search, Sparkles, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const TITLE = "OpenStack — Free & Open-Source Alternatives to Expensive SaaS";
const DESC =
  "Discover top-rated free, open-source, and low-cost alternatives to Stan Store, Notion, Typeform, Calendly, Loom and Canva. Save thousands every year.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

type Category = "stores" | "forms" | "scheduling" | "video" | "notes" | "design";
type License = "free" | "oss" | "freemium" | "lifetime";

interface Tool {
  name: string;
  initial: string;
  category: Category;
  vs: string;
  vsPrice: string;
  badges: string[];
  features: string[];
  savings: number;
  license: License[];
  popularity: number;
  added: number;
  url: string;
  featured?: boolean;
}

const CATEGORIES: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "stores", label: "🛒 Creator Stores" },
  { id: "forms", label: "📝 Forms & Surveys" },
  { id: "scheduling", label: "📅 Scheduling" },
  { id: "video", label: "🎥 Video & Loom" },
  { id: "notes", label: "📓 Notes & Docs" },
  { id: "design", label: "🎨 Design" },
];

const LICENSES: { id: "all" | License; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "100% Free" },
  { id: "oss", label: "Open Source" },
  { id: "freemium", label: "Freemium" },
  { id: "lifetime", label: "Lifetime Deal" },
];

const TOOLS: Tool[] = [
  {
    name: "Sety Store", initial: "S", category: "stores", vs: "Stan Store", vsPrice: "$29/mo",
    badges: ["Free Forever", "Zero Commission"],
    features: ["Zero fixed monthly fees", "Customizable link-in-bio storefront", "Instant digital downloads"],
    savings: 348, license: ["free", "freemium"], popularity: 100, added: 10, url: "https://sety.store", featured: true,
  },
  {
    name: "Gumroad Lite", initial: "G", category: "stores", vs: "Stan Store", vsPrice: "$29/mo",
    badges: ["Free Plan"], features: ["Sell digital products", "Built-in checkout", "Email audience"],
    savings: 348, license: ["freemium"], popularity: 80, added: 3, url: "https://gumroad.com",
  },
  {
    name: "Tally", initial: "T", category: "forms", vs: "Typeform", vsPrice: "$25/mo",
    badges: ["Free Forever"], features: ["Unlimited forms & responses", "Logic jumps & payments", "Notion-like editor"],
    savings: 300, license: ["free", "freemium"], popularity: 95, added: 5, url: "https://tally.so",
  },
  {
    name: "Formbricks", initial: "F", category: "forms", vs: "Typeform", vsPrice: "$25/mo",
    badges: ["Open Source", "Self-Hosted"], features: ["In-app & link surveys", "Privacy-first", "Unlimited on self-host"],
    savings: 300, license: ["oss", "free"], popularity: 70, added: 9, url: "https://formbricks.com",
  },
  {
    name: "Cal.com", initial: "C", category: "scheduling", vs: "Calendly", vsPrice: "$12/mo",
    badges: ["Open Source", "Free Plan"], features: ["Unlimited event types", "Workflows & reminders", "Self-host option"],
    savings: 144, license: ["oss", "freemium"], popularity: 92, added: 6, url: "https://cal.com",
  },
  {
    name: "Cap", initial: "C", category: "video", vs: "Loom", vsPrice: "$15/mo",
    badges: ["Open Source", "Self-Hosted"], features: ["Instant screen recording", "Shareable links", "Own your storage"],
    savings: 180, license: ["oss", "free"], popularity: 75, added: 8, url: "https://cap.so",
  },
  {
    name: "AppFlowy", initial: "A", category: "notes", vs: "Notion", vsPrice: "$10/mo",
    badges: ["Open Source", "Self-Hosted"], features: ["Docs, wikis & databases", "Offline-first", "AI built in"],
    savings: 120, license: ["oss", "free"], popularity: 85, added: 7, url: "https://appflowy.io",
  },
  {
    name: "Penpot", initial: "P", category: "design", vs: "Canva Pro", vsPrice: "$15/mo",
    badges: ["Open Source", "Free Forever"], features: ["Vector design & prototyping", "Real-time collaboration", "Web standards based"],
    savings: 180, license: ["oss", "free"], popularity: 78, added: 4, url: "https://penpot.app",
  },
  {
    name: "Photopea", initial: "P", category: "design", vs: "Canva Pro", vsPrice: "$15/mo",
    badges: ["Free Plan", "Lifetime Deal"], features: ["Runs in your browser", "Opens PSD, Sketch, XD", "One-time premium"],
    savings: 180, license: ["freemium", "lifetime"], popularity: 72, added: 2, url: "https://photopea.com",
  },
];

function Index() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [lic, setLic] = useState<"all" | License>("all");
  const [sort, setSort] = useState<"popular" | "newest" | "savings">("popular");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [compare, setCompare] = useState<Tool | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = TOOLS.filter(
      (t) =>
        (cat === "all" || t.category === cat) &&
        (lic === "all" || t.license.includes(lic)) &&
        (!s || `${t.name} ${t.vs} ${t.features.join(" ")}`.toLowerCase().includes(s)),
    );
    const key = { popular: "popularity", newest: "added", savings: "savings" }[sort] as keyof Tool;
    return r.sort((a, b) => Number(b.featured) - Number(a.featured) || (b[key] as number) - (a[key] as number));
  }, [q, cat, lic, sort]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Toaster />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Layers className="size-4" />
            </span>
            OpenStack
          </a>
          <nav className="flex items-center gap-2 text-sm">
            <a href="#directory" className="hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:block">
              Browse Categories
            </a>
            <button onClick={() => setSubmitOpen(true)} className="hidden rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-xs text-accent-foreground transition-colors hover:bg-accent/20 sm:block">
              Sponsor ($29)
            </button>
            <button onClick={() => setSubmitOpen(true)} className="rounded-md bg-foreground px-3 py-1.5 font-medium text-background transition-opacity hover:opacity-90">
              Submit a Tool
            </button>
          </nav>
        </div>
      </header>

      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> {TOOLS.length * 14}+ curated alternatives
          </span>
          <h1 className="text-gradient mt-6 text-5xl font-semibold tracking-tighter sm:text-7xl">Stop Overpaying for SaaS.</h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            Discover top-rated free, open-source, and low-cost alternatives to expensive software. Save thousands every year.
          </p>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools or enter an expensive app (e.g. Typeform, Stan Store, Loom)..."
              className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-base shadow-2xl outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-glow"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Pill>
            ))}
          </div>
        </div>
      </section>

      <main id="directory" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground">License</span>
            {LICENSES.map((l) => (
              <Pill key={l.id} small active={lic === l.id} onClick={() => setLic(l.id)}>{l.label}</Pill>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs">
            {(["popular", "newest", "savings"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`rounded-md px-2.5 py-1 transition-colors ${sort === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {{ popular: "Most Popular", newest: "Newest", savings: "Highest Savings" }[s]}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No alternatives found. <button onClick={() => setSubmitOpen(true)} className="text-primary underline-offset-4 hover:underline">Submit one?</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => <ToolCard key={t.name} tool={t} onCompare={() => setCompare(t)} />)}
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-lg font-medium tracking-tight">Get 3 free alternatives to expensive tools in your inbox every week.</p>
            <p className="mt-1 text-sm text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); toast.success("You're subscribed!"); }}
            className="flex gap-2"
          >
            <input type="email" required placeholder="you@company.com" className="h-11 flex-1 rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary" />
            <button className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">Subscribe</button>
          </form>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} OpenStack · <a href="#" className="hover:text-foreground">Privacy</a></span>
          <span>Built for bootstrappers & creators.</span>
        </div>
      </footer>

      <SubmitModal open={submitOpen} onOpenChange={setSubmitOpen} />
      <CompareModal tool={compare} onClose={() => setCompare(null)} />
    </div>
  );
}

function Pill({ active, small, onClick, children }: { active: boolean; small?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border transition-all ${small ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1.5 text-sm"} ${
        active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:border-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ label }: { label: string }) {
  const oss = label === "Open Source" || label === "Self-Hosted";
  return (
    <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${oss ? "border-accent/40 bg-accent/10 text-accent" : "border-primary/40 bg-primary/10 text-primary"}`}>
      {label}
    </span>
  );
}

function ToolCard({ tool: t, onCompare }: { tool: Tool; onCompare: () => void }) {
  return (
    <article
      className={`group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 ${
        t.featured ? "border-primary/60 shadow-glow sm:col-span-2 lg:col-span-1" : "border-border hover:border-muted-foreground/40"
      }`}
    >
      {t.featured && (
        <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
          <Sparkles className="size-3" /> Community Choice · Best Value
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`grid size-11 shrink-0 place-items-center rounded-lg text-lg font-semibold ${t.featured ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t.initial}</div>
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{t.name}</h3>
          <p className="text-xs text-muted-foreground">
            Alternative to <span className="text-foreground/80">{t.vs}</span> ({t.vsPrice})
          </p>
        </div>
      </div>
      {t.featured && (
        <p className="mt-4 rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-xs">
          <span className="text-muted-foreground line-through">Stan Store $29/mo</span>
          <span className="mx-2 text-muted-foreground">vs.</span>
          <span className="text-primary">Sety Store $0/mo + Free Tier</span>
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">{t.badges.map((b) => <Badge key={b} label={b} />)}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {t.features.map((f) => (
          <li key={f} className="flex gap-2 text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-medium text-primary">Save ${t.savings}/year</span>
        <div className="mt-4 flex gap-2">
          <a href={t.url} target="_blank" rel="noreferrer" className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-90 ${t.featured ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
            Visit Tool <ExternalLink className="size-3.5" />
          </a>
          <button onClick={onCompare} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">
            Compare Specs
          </button>
        </div>
      </div>
    </article>
  );
}

function CompareModal({ tool, onClose }: { tool: Tool | null; onClose: () => void }) {
  return (
    <Dialog open={!!tool} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border bg-card sm:max-w-lg">
        {tool && (
          <>
            <DialogTitle className="tracking-tight">{tool.name} vs. {tool.vs}</DialogTitle>
            <DialogDescription>Side-by-side spec comparison.</DialogDescription>
            <div className="mt-2 overflow-hidden rounded-lg border border-border text-sm">
              {[
                ["Price", tool.featured ? "$0/mo" : "Free / low-cost", tool.vsPrice],
                ["License", tool.badges.join(", "), "Proprietary"],
                ...tool.features.map((f) => [f, "✓", "Paid tier"]),
                ["Yearly savings", `$${tool.savings}`, "—"],
              ].map(([k, a, b], i) => (
                <div key={i} className="grid grid-cols-3 border-b border-border last:border-0">
                  <div className="p-2.5 text-muted-foreground">{k}</div>
                  <div className="p-2.5 text-primary">{a}</div>
                  <div className="p-2.5 text-muted-foreground">{b}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SubmitModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [tab, setTab] = useState<"standard" | "featured">("standard");
  const field = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogTitle className="tracking-tight">Submit a Tool</DialogTitle>
        <DialogDescription>Help bootstrappers find better, cheaper software.</DialogDescription>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-background p-1 text-sm">
          {(["standard", "featured"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-2 text-left transition-colors ${tab === t ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
              <div className="font-medium">{t === "standard" ? "Standard" : "Featured"}</div>
              <div className="text-xs text-muted-foreground">{t === "standard" ? "Free · queued" : "$29 · 30 days"}</div>
            </button>
          ))}
        </div>
        {tab === "featured" && (
          <ul className="space-y-1.5 rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
            {["Guaranteed review within 48h", "#1 pinned spot for 30 days", "Glowing highlight card"].map((x) => (
              <li key={x} className="flex gap-2"><Check className="size-4 text-primary" />{x}</li>
            ))}
          </ul>
        )}
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success(tab === "standard" ? "Submitted! You're in the review queue." : "Thanks! Checkout coming soon — we'll email you.");
          }}
        >
          <input required placeholder="Tool name" className={field} />
          <input required type="url" placeholder="https://" className={field} />
          <input required placeholder="Alternative to (e.g. Calendly)" className={field} />
          <input required type="email" placeholder="Your email" className={field} />
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            {tab === "standard" ? "Submit for free" : "Continue to payment — $29"} <ArrowRight className="size-4" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
