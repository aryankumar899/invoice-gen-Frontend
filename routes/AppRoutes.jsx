import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import FeaturesPage from "../src/pages/FeaturesPage";
import TestimonialsPage from "../src/pages/TestimonialsPage";
import FAQPage from "../src/pages/FAQPage";
import Auth from "../src/pages/Auth";
import Dashboard from "../src/pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}