import type { Metadata } from "next";
import { HeroNumbersDisagree } from "@/components/heroes/HeroNumbersDisagree";

export const metadata: Metadata = {
  title: "Revline Hero C — The Numbers Disagree",
};

export default function HeroCPage() {
  return <HeroNumbersDisagree />;
}
