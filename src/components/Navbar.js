"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Feather, 
  Wind, 
  ShieldAlert, 
  Home, 
  Volume2, 
  VolumeX, 
  ClipboardCheck, 
  Menu, 
  X, 
  ShieldCheck 
} from "lucide-react";
import { soundManager } from "@/utils/audio";

const NAV_ITEMS = [
  { href: "/", label: "หน้าหลัก", icon: Home },
  { href: "/release", label: "ปล่อยความรู้สึก", icon: Feather, highlight: true },
  { href: "/breathe", label: "ผ่อนคลาย", icon: Wind },
  { href: "/assessment", label: "ประเมินสุขภาพจิต", icon: ClipboardCheck, badge: "ST-5/2Q/9Q" },
  { href: "/help", label: "ขอความช่วยเหลือ", icon: ShieldAlert },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    soundManager.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      soundManager.playHealingChime(440);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFFDF8]/85 border-b border-[#F0ECE1] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link 
          href="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <span className="w-8 h-8 rounded-full bg-[#B8DCC8] flex items-center justify-center text-sm shadow-sm group-hover:rotate-12 transition-transform duration-300">
            🍃
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-wide text-[#3A3A3A] flex items-center gap-1.5">
              jaidee
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[#E2F2E9] text-[#2F6B4A]">
                ใจดี
              </span>
            </span>
            <span className="text-[10px] text-[#8A8A8A] hidden sm:block -mt-0.5">
              ใจดีกับตัวเอง... ในวันที่โลกใจร้าย
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#9ec9b0] text-[#1b432e] shadow-sm ring-2 ring-[#B8DCC8]/50"
                      : "bg-[#B8DCC8] text-[#245238] hover:bg-[#a9d3bb] hover:shadow-sm"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  isActive
                    ? "bg-[#EBF3FA] text-[#2C5282] font-medium"
                    : "text-[#5A5A5A] hover:text-[#2A2A2A] hover:bg-[#F3EFE6]/60"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#3182CE]" : "text-[#8A8A8A]"} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-[#FAEBEE] text-[#8C243B] px-1.5 py-0.2 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Sound toggle + Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Assessment Button on Mobile */}
          <Link
            href="/assessment"
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAEBEE] text-[#8C243B] border border-[#F3D1D8]"
          >
            <ClipboardCheck size={13} />
            <span>ประเมินใจ</span>
          </Link>

          <button
            onClick={toggleSound}
            title={isMuted ? "เปิดเสียงประกอบผ่อนคลาย" : "ปิดเสียงประกอบ"}
            className="p-2 rounded-full text-[#7A7A7A] hover:text-[#3A3A3A] hover:bg-[#EFEAE1]/70 transition-colors"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#555] hover:bg-[#EFEAE1]/70 transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#F0ECE1] bg-[#FFFDF8]/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-xs font-semibold text-[#8A8A8A] px-2 uppercase tracking-wider pb-1">
            เมนูหลัก
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#E2F2E9] text-[#1B432E] font-medium"
                    : "text-[#4A4A4A] hover:bg-[#F3EFE6]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={17} className={isActive ? "text-[#245238]" : "text-[#7A7A7A]"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-[#FAEBEE] text-[#8C243B] px-2 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#EFEAE1] mt-2">
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#8A8A8A] hover:text-[#4A4A4A]"
            >
              <ShieldCheck size={14} />
              <span>นโยบายความเป็นส่วนตัว (Zero-Data)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
