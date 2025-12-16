import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandsSection } from "@/components/home/BrandsSection";
import { BestSellers } from "@/components/home/BestSellers";
import { PromoBanner } from "@/components/home/PromoBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <BrandsSection />
      <BestSellers />
      <PromoBanner />
    </>
  );
}
