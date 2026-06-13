import type { Metadata } from "next";
import { HeroGraphPaper } from "@/components/heroes/HeroGraphPaper";

export const metadata: Metadata = {
  title: "Revline Hero A — Graph Paper",
};

export default function HeroAPage() {
  return <HeroGraphPaper />;
}
