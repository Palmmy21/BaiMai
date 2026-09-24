import { Prompt, Mali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

const maliFont = Mali({
  weight: ["400", "500", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-mali",
  display: "swap",
});

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://jaidee-kappa.vercel.app";
};

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "jaidee (ใจดี) — พื้นที่เล็ก ๆ สำหรับปล่อยความรู้สึกและใจดีกับตัวเอง",
  description: "jaidee (ใจดี) พื้นที่ปลอดภัย 100% สำหรับการเขียนระบายสิ่งที่อยู่ในใจ ฝึกหายใจ และเช็กสุขภาพใจตนเอง ใจดีกับตัวเองในทุกวัน 🌱",
  keywords: ["jaidee", "ใจดี", "สุขภาพจิต", "ระบายความรู้สึก", "ปล่อยความรู้สึก", "ฝึกหายใจ", "safe space", "มัธยม"],
  authors: [{ name: "JaiDee Care Team" }],
  openGraph: {
    title: "jaidee (ใจดี) — พื้นที่เล็ก ๆ สำหรับปล่อยความรู้สึกและใจดีกับตัวเอง",
    description: "jaidee (ใจดี) พื้นที่ปลอดภัยสำหรับการเขียนระบายสิ่งที่อยู่ในใจ และดูแลใจตนเอง 🌱",
    url: siteUrl,
    siteName: "jaidee (ใจดี)",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "jaidee (ใจดี) — พื้นที่ปลอดภัยสำหรับใจคุณ",
        type: "image/jpeg",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "jaidee (ใจดี) — พื้นที่เล็ก ๆ สำหรับปล่อยความรู้สึกและใจดีกับตัวเอง",
    description: "jaidee (ใจดี) พื้นที่ปลอดภัยสำหรับการเขียนระบายสิ่งที่อยู่ในใจ และดูแลใจตนเอง 🌱",
    images: ["/og-cover.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${promptFont.variable} ${maliFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col paper-texture text-[#4A4A4A]">
        <Navbar />
        
        <main className="flex-1 pb-24 md:pb-12">
          {children}
        </main>

        <footer className="hidden md:block border-t border-[#F0ECE1] py-8 text-center text-xs text-[#8A8A8A] bg-[#FFFDF8]/60">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#4A4A4A]">
              <span>🍃 jaidee (ใจดี)</span>
              <span>•</span>
              <span className="text-xs text-[#7A7A7A]">“ใจดีกับตัวเอง... ในวันที่โลกใจร้าย”</span>
            </p>
            <p className="text-[12px] text-[#9A9A9A]">
              🔒 ข้อความระบายของคุณทำงานบนเบราว์เซอร์เท่านั้น ไม่มีการจัดเก็บข้อมูลลงฐานข้อมูล ปลอดภัย 100%
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[12px] pt-1 text-[#7A7A7A]">
              <Link href="/privacy" className="hover:underline">นโยบายความเป็นส่วนตัว</Link>
              <span>•</span>
              <Link href="/help" className="hover:underline text-[#DC2626]">สายด่วน 1323</Link>
              <span>•</span>
              <Link href="/assessment" className="hover:underline">เช็กใจตัวเอง (2Q/9Q/8Q)</Link>
              <span>•</span>
              <Link href="/counselor" className="hover:underline text-[#245238] font-medium">ระบบดูแลน้อง ๆ (สำหรับพี่ ๆ ผู้ดูแล)</Link>
            </div>
          </div>
        </footer>

        <BottomNav />
      </body>
    </html>
  );
}
