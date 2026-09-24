"use client";

import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Trash2, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          <span>กลับหน้าหลัก</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7A7A] mt-1">
          BaiMai (ใบไม้) ถูกออกแบบมาให้เป็นพื้นที่ปลอดภัย 100% สำหรับการดูแลใจตนเอง ภายใต้แนวคิด “อารมณ์คือใบไม้ ที่สักวันจะร่วงหล่น”
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#555] leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#245238] font-semibold text-base">
            <Trash2 size={18} />
            <h2>1. Zero-Data Persistence (ไม่บันทึกข้อความระบาย)</h2>
          </div>
          <p>
            ข้อความใดก็ตามที่คุณพิมพ์ในหน้า <strong>“ปล่อยความรู้สึก”</strong> จะประมวลผลอยู่บนหน่วยความจำชั่วคราวของเบราว์เซอร์ในอุปกรณ์ของคุณเท่านั้น เมื่อคุณกดปุ่ม <strong>“ปล่อยความรู้สึก”</strong> ระบบจะทำการลบและล้างข้อความนั้นออกจากหน่วยความจำทันทีหลังแอนิเมชันจบ โดยไม่มีการส่งไปยังเซิร์ฟเวอร์, ฐานข้อมูล, หรือบริการภายนอกใด ๆ ทั้งสิ้น
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#204E78] font-semibold text-base">
            <EyeOff size={18} />
            <h2>2. ไม่มีการส่งข้อมูลไปยัง Third-party AI หรือโฆษณา</h2>
          </div>
          <p>
            BaiMai ไม่ส่งข้อความระบายความรู้สึกของผู้ใช้ไปยัง Third-party AI เพื่อนำไปฝึกสอนโมเดล และไม่มีการเชื่อมต่อกับระบบโฆษณาเพื่อติดตามพฤติกรรม (No Tracking Cookies) พื้นที่นี้เป็นของคุณคนเดียวอย่างแท้จริง
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#632734] font-semibold text-base">
            <Lock size={18} />
            <h2>3. การจัดเก็บข้อมูลอารมณ์รายวัน (Local Storage)</h2>
          </div>
          <p>
            ในหน้า <strong>“เช็กอารมณ์วันนี้”</strong> หากคุณทำการกดบันทึก ข้อมูลจะถูกจัดเก็บไว้เฉพาะใน LocalStorage ภายในเครื่องของคุณเท่านั้น เพื่อแสดงเป็นปฏิทินย้อนหลังให้คุณสังเกตแนวโน้มอารมณ์ตนเอง และคุณสามารถกดปุ่ม "ล้างประวัติ" เพื่อลบทิ้งได้ทุกเมื่อ
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#5C4D20] font-semibold text-base">
            <ShieldCheck size={18} />
            <h2>4. การขอความช่วยเหลือและการติดต่อผู้เชี่ยวชาญ</h2>
          </div>
          <p>
            หากคุณเลือกส่งข้อความขอคำปรึกษาในหน้า <strong>“ขอความช่วยเหลือ”</strong> ข้อมูลติดต่อที่คุณให้จะถูกส่งไปยังทีมงานผู้เชี่ยวชาญเพื่อการติดต่อกลับเท่านั้น โดยแยกเป็นเอกเทศจากฟังก์ชันระบายความรู้สึก และจะไม่มีการเปิดเผยต่อสาธารณะ
          </p>
        </div>
      </div>
    </div>
  );
}
