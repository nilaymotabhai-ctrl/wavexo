import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CMSProvider, useCMS } from "./lib/store";

/* public */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CursorGlow, FloatingWhatsApp, ScrollTopButton, CookieBanner, LoadingScreen } from "./components/fx";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Process from "./pages/Process";
import Work from "./pages/Work";
import Pricing from "./pages/Pricing";
import { BlogList, BlogPost } from "./pages/Blog";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import { FaqPage, LegalPage } from "./pages/Legal";
import NotFound from "./pages/NotFound";

/* admin */
import AdminLogin from "./admin/Login";
import AdminLayout from "./admin/Layout";
import Dashboard from "./admin/Dashboard";
import Leads from "./admin/Leads";
import ContentStudio from "./admin/ContentStudio";
import {
  ServicesAdmin, PricingAdmin, PortfolioAdmin, CaseStudiesAdmin,
  BlogAdmin, TestimonialsAdmin, FaqsAdmin, TeamAdmin, SectionsAdmin,
} from "./admin/configs";
import MediaLibrary from "./admin/Media";
import SeoManager from "./admin/Seo";
import Settings from "./admin/Settings";
import ActivityLog from "./admin/Activity";
import { Toasts } from "./admin/ui";

/* ---------------- utilities ---------------- */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
}

function VisitTracker() {
  const { trackVisit } = useCMS();
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith("/admin")) trackVisit(pathname);
  }, [pathname, trackVisit]);
  return null;
}

/* ---------------- public site layout ---------------- */

function SiteLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <div className="relative min-h-screen bg-space text-white">
      <CursorGlow />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
          <Footer />
        </motion.div>
      </AnimatePresence>
      <FloatingWhatsApp />
      <ScrollTopButton />
      <CookieBanner />
    </div>
  );
}

/* ---------------- app ---------------- */

export default function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <ScrollToTop />
        <VisitTracker />
        <LoadingScreen />
        <Toasts />
        <Routes>
          {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="content" element={<ContentStudio />} />
            <Route path="sections" element={<SectionsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="portfolio" element={<PortfolioAdmin />} />
            <Route path="case-studies" element={<CaseStudiesAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="faqs" element={<FaqsAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="activity" element={<ActivityLog />} />
          </Route>

          {/* public site */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/process" element={<Process />} />
            <Route path="/work" element={<Work />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="/refund" element={<LegalPage kind="refund" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}
