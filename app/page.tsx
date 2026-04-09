"use client";

import { Hero, Features, HowItWorks, CTA, Footer } from "./landing";
import { APP } from "./lib/constants";
import { Gallery } from "./components";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}
