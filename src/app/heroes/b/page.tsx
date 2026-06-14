import type { Metadata } from "next";
import { HeroLeakingLine } from "@/components/heroes/HeroLeakingLine";

export const metadata: Metadata = {
  title: "Grip Hero B — The Leaking Line",
};

export default function HeroBPage() {
  return <HeroLeakingLine />;
}
