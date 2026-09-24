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

export const metadata = {
  title: "BaiMai (ใบไม้) — พื้นที่เล็ก ๆ สำหรับปล่อยความรู้สึก",
  description: "อารมณ์คือใบไม้ ที่สักวันจะร่วงหล่น... พื้นที่ปลอดภัย 100% สำหรับการเขียนระบายสิ่งที่อยู่ในใจ แล้วปล่อยให้ปลิวไปตามสายลม",
  keywords: ["BaiMai", "ใบไม้", "สุขภาพจิต", "ระบายความรู้สึก", "ปล่อยความรู้สึก", "ฝึกหายใจ", "safe space"],
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
              <span>🍃 BaiMai (ใบไม้)</span>
              <span>•</span>
              <span className="text-xs text-[#7A7A7A]">“อารมณ์คือใบไม้ ที่สักวันจะร่วงหล่น”</span>
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
              <Link href="/counselor" className="hover:underline text-[#245238] font-medium">ระบบดูแลนิสิต มมส. (สำหรับอาจารย์)</Link>
            </div>
          </div>
        </footer>

        <BottomNav />
      </body>
    </html>
  );
}
