"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("mode") === "signin") {
      router.replace("/sign-in");
    } else {
      router.replace("/sign-up");
    }
  }, [router, searchParams]);

  return null;
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <Redirect />
    </Suspense>
  );
}
