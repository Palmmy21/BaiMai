"use client";

import MoodSection from "@/components/MoodSection";

export default function MoodPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-140px)] flex flex-col items-center justify-center">
      <MoodSection showCardContainer={false} />
    </div>
  );
}
