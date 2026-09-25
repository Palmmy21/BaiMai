"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wind, Feather, ClipboardCheck, PhoneCall } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FFFDF8]/95 backdrop-blur-lg border-t border-[#EFEAE1] px-2 pb-safe pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === "/" ? "text-[#2F6B4A] font-medium" : "text-[#7A7A7A]"
          }`}
        >
          <Home size={19} className={pathname === "/" ? "stroke-[2.5]" : "stroke-[1.8]"} />
          <span className="text-[11px]">หน้าหลัก</span>
        </Link>

        {/* 2. Breathe */}
        <Link
          href="/breathe"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === "/breathe" ? "text-[#2B6CB0] font-medium" : "text-[#7A7A7A]"
          }`}
        >
          <Wind size={19} className={pathname === "/breathe" ? "stroke-[2.5]" : "stroke-[1.8]"} />
          <span className="text-[11px]">ผ่อนคลาย</span>
        </Link>

        {/* 3. Release Button - Prominent Center Floating */}
        <Link
          href="/release"
          className="relative -top-3 flex flex-col items-center group px-1"
        >
          <div className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            pathname === "/release" 
              ? "bg-[#91C3A5] text-[#133B23] scale-105 ring-4 ring-[#B8DCC8]/40" 
              : "bg-[#B8DCC8] text-[#1E4C31] group-hover:scale-105"
          }`}>
            <Feather size={22} className="stroke-[2.2]" />
          </div>
          <span className={`text-[10px] mt-0.5 font-medium ${
            pathname === "/release" ? "text-[#1E4C31]" : "text-[#555]"
          }`}>
            ปล่อย
          </span>
        </Link>

        {/* 4. Assessment (ประเมินสุขภาพจิต - สำคัญตามหลักการแพทย์ 2Q/9Q/8Q) */}
        <Link
          href="/assessment"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
            pathname === "/assessment" ? "text-[#632734] font-medium" : "text-[#7A7A7A]"
          }`}
        >
          <ClipboardCheck size={19} className={pathname === "/assessment" ? "stroke-[2.5] text-[#8C243B]" : "stroke-[1.8]"} />
          <span className="text-[11px] whitespace-nowrap">ประเมินใจ</span>
          <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-[#E53E3E]" title="มีแบบประเมินความเสี่ยง" />
        </Link>

        {/* 5. Help */}
        <Link
          href="/help"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === "/help" ? "text-[#DC2626] font-medium" : "text-[#7A7A7A]"
          }`}
        >
          <PhoneCall size={19} className={pathname === "/help" ? "stroke-[2.5]" : "stroke-[1.8]"} />
          <span className="text-[11px]">ช่วยเหลือ</span>
        </Link>
      </div>
    </nav>
  );
}
