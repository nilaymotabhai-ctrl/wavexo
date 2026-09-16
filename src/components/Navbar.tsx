import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useCMS, publishedSorted, waLink } from "../lib/store";
import { Logo, Icon, cn, WhatsAppIcon } from "./ui";

const linkBase = "relative px-3 py-2 text-sm font-medium text-mist transition-colors duration-200 hover:text-white focus:outline-none focus-visible:text-white";

function ActivePill() {
  return (
    <motion.span layoutId="nav-underline"
      className="absolute inset-x-3 -bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-cyanx via-electric to-magentax" />
  );
}

function Dropdown({ label, items, active }: { label: string; active?: boolean; items: { to: string; title: string; desc?: string; icon?: string }[] }) {
  return (
    <div className="group relative">
      <button className={cn(linkBase, "flex items-center gap-1", active && "text-white")} aria-haspopup="true">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="g-border overflow-hidden rounded-2xl bg-midnight/95 p-2 shadow-2xl backdrop-blur-xl">
          {items.map((it) => (
            <Link key={it.to} to={it.to}
              className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-white/[0.06]">
              {it.icon && (
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
                  <Icon name={it.icon} className="h-4 w-4" />
                </span>
              )}
              <span>
                <span className="block text-sm font-semibold text-white">{it.title}</span>
                {it.desc && <span className="mt-0.5 block text-xs leading-snug text-faint">{it.desc}</span>}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { content } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [annDismissed, setAnnDismissed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const services = publishedSorted(content.services);
  const ann = content.settings.announcement;

  const serviceItems = [
    ...services.map((s) => ({ to: `/services/${s.slug}`, title: s.title, desc: s.short, icon: s.icon })),
    { to: "/services", title: "All Services", desc: "See the complete growth stack", icon: "sparkles" },
  ];
  const resourceItems = [
    { to: "/blog", title: "Blog & Resources", desc: "Playbooks and growth insights", icon: "chart" },
    { to: "/pricing", title: "Pricing & Packages", desc: "Transparent, flexible plans", icon: "gem" },
    { to: "/faqs", title: "FAQs", desc: "Answers to common questions", icon: "messages" },
  ];

  const navLink = (to: string, label: string) => (
    <NavLink key={to} to={to} end={to === "/"}
      className={({ isActive }) => cn(linkBase, isActive && "text-white")}>
      {({ isActive }) => (
        <>
          {label}
          {isActive && <ActivePill />}
        </>
      )}
    </NavLink>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement / offer bar — editable in Admin → Site Content */}
      <AnimatePresence>
        {ann.enabled && !annDismissed && !scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-electric/90 via-violetx/90 to-magentax/90"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-5 py-2 text-center">
              <Sparkles className="hidden h-3.5 w-3.5 shrink-0 text-white/90 sm:block" />
              <p className="truncate text-xs font-medium text-white sm:text-[13px]">{ann.text}</p>
              <Link to={ann.href || "/contact"} className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-white/25">
                {ann.cta || "Learn more"}
              </Link>
              <button onClick={() => setAnnDismissed(true)} aria-label="Dismiss announcement"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main nav */}
      <div className={cn(
        "transition-all duration-500",
        scrolled ? "border-b border-white/[0.07] bg-space/85 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl" : "bg-transparent"
      )}>
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
          <Logo />

          <div className="hidden items-center lg:flex">
            {navLink("/", "Home")}
            {navLink("/about", "About")}
            <Dropdown label="Services" active={location.pathname.startsWith("/services")} items={serviceItems} />
            {navLink("/work", "Work")}
            {navLink("/process", "Process")}
            <Dropdown label="Resources" active={["/blog", "/pricing", "/faqs"].some((p) => location.pathname.startsWith(p))} items={resourceItems} />
            {navLink("/contact", "Contact")}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/book"
              className="glow-btn group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric via-violetx to-magentax bg-[length:160%_100%] bg-left px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-right">
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <button className="glass-soft grid h-11 w-11 place-items-center rounded-xl text-white lg:hidden"
            onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-space/97 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-[68px] items-center justify-between px-5">
              <Logo />
              <button className="glass-soft grid h-11 w-11 place-items-center rounded-xl text-white"
                onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-10 pt-4">
              <motion.nav
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
                className="flex flex-col gap-1"
              >
                {[
                  { to: "/", label: "Home" }, { to: "/about", label: "About Us" },
                  { to: "/services", label: "Services" }, { to: "/work", label: "Our Work" },
                  { to: "/process", label: "Our Process" }, { to: "/pricing", label: "Pricing" },
                  { to: "/blog", label: "Blog & Resources" }, { to: "/faqs", label: "FAQs" },
                  { to: "/contact", label: "Contact" },
                ].map((l) => (
                  <motion.div key={l.to} variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}>
                    <NavLink to={l.to} end={l.to === "/"}
                      className={({ isActive }) => cn(
                        "font-display flex items-center justify-between border-b border-white/[0.06] py-4 text-2xl font-semibold transition-colors",
                        isActive ? "text-gradient" : "text-white/85 hover:text-white"
                      )}>
                      {l.label}
                      <ArrowRight className="h-5 w-5 text-faint" />
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="mt-8 flex flex-col gap-3">
                <button onClick={() => { setOpen(false); navigate("/book"); }}
                  className="glow-btn flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric to-violetx px-6 py-4 text-sm font-semibold text-white">
                  Book Free Consultation <ArrowRight className="h-4 w-4" />
                </button>
                {content.settings.whatsapp && (
                  <a href={waLink(content.settings.whatsapp)} target="_blank" rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-6 py-4 text-sm font-semibold text-emerald-300">
                    <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                )}
                <p className="mt-4 text-center text-xs text-faint">{content.settings.email} · {content.settings.phone}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
