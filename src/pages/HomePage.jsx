import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DashboardPreview from '../components/DashboardPreview';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FooterCTA from '../components/FooterCTA';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <DashboardPreview />
      <Features />
      <Testimonials />
      <FAQ />
      <FooterCTA />
    </>
  );
}
