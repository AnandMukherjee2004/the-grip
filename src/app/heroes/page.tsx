import type { Metadata } from "next";
import { HeroVariationsPage } from "@/components/heroes/HeroVariationsPage";

export const metadata: Metadata = {
  title: "Grip — Hero Variations",
};

export default function HeroesPage() {
  return <HeroVariationsPage />;
}
