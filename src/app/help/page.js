"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PhoneCall, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  ExternalLink, 
  Send, 
  Check,
  Building2,
  Hospital,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

const MSU_CENTERS = [
  {
    name: "ศูนย์สุขภาวะนิสิต กองกิจการนิสิต มหาวิทยาลัยมหาสารคาม",
    sub: "MSU Student Wellness Center",
    number: "043-754388",
    tel: "tel:043754388",
    location: "อาคารพัฒนานิสิต กองกิจการนิสิต มหาวิทยาลัยมหาสารคาม (ม.ใหม่)",
    hours: "จันทร์ - ศุกร์ 08:30 - 16:30 น. (มีบริการนัดหมายล่วงหน้า)",
    desc: "บริการให้คำปรึกษาเชิงจิตวิทยา ดูแลสุขภาวะทางอารมณ์ และประสานงานดูแลช่วยเหลือนิสิต มมส. ทุกคณะอย่างเป็นความลับและอบอุ่น",
    tag: "สำหรับนิสิต มมส.",
    tagColor: "bg-[#E2F2E9] text-[#1B432E] border border-[#B8DCC8]",
    featured: true,
    isMsu: true,
  },
  {
    name: "โรงพยาบาลสุทธาเวช คณะแพทยศาสตร์ มหาวิทยาลัยมหาสารคาม",
    sub: "Suddhavej Hospital, Faculty of Medicine MSU",
    number: "043-021-021",
    tel: "tel:043021021",
    location: "ถนนนครสวรรค์ ต.ตลาด อ.เมือง จ.มหาสารคาม (ม.เก่า)",
    hours: "แผนกตรวจสุขภาพใจในเวลาราชการ และ แผนกฉุกเฉิน 24 ชั่วโมง",
    desc: "โรงพยาบาลมหาวิทยาลัย ให้บริการตรวจวินิจฉัยและดูแลรักษาทางจิตเวช โดยทีมแพทย์และพยาบาลผู้เชี่ยวชาญ พร้อมรับสิทธิ์บัตรทองนิสิต มมส.",
    tag: "รพ.มหาวิทยาลัย / ฉุกเฉิน 24 ชม.",
    tagColor: "bg-[#FAEBEE] text-[#701E2D] border border-[#F3D1D8]",
    featured: true,
    isMsu: true,
  },
];

const HOTLINES = [
  {
    name: "สายด่วนสุขภาพจิต กรมสุขภาพจิต",
    number: "1323",
    tel: "tel:1323",
    desc: "บริการให้คำปรึกษาปัญหาสุขภาพจิตและความเครียดโดยผู้เชี่ยวชาญ โทรฟรีตลอด 24 ชั่วโมง",
    tag: "โทรฟรี 24 ชม.",
    tagColor: "bg-[#E2F2E9] text-[#245238]",
    featured: true,
  },
  {
    name: "สมาคมสะมาริตันส์แห่งประเทศไทย",
    number: "02-113-6789",
    tel: "tel:021136789",
    desc: "บริการรับฟังด้วยใจเพื่อคลายทุกข์ โดยอาสาสมัครที่ผ่านการอบรมเพื่อป้องกันการสูญเสีย",
    tag: "รับฟังด้วยใจ",
    tagColor: "bg-[#EBF3FA] text-[#204E78]",
    featured: true,
  },
  {
    name: "สายด่วนสุขภาพทางเพศและเยาวชน (Lovecare)",
    number: "1663",
    tel: "tel:1663",
    desc: "บริการรับปรึกษาปัญหาความเครียด ความสัมพันธ์ และสุขภาวะสำหรับวัยรุ่นและนักเรียน",
    tag: "เฉพาะวัยรุ่น/เยาวชน",
    tagColor: "bg-[#FDF7E5] text-[#5C4D20]",
    featured: false,
  },
  {
    name: "สายด่วนกู้ชีพฉุกเฉิน",
    number: "1669",
    tel: "tel:1669",
    desc: "กรณีเกิดภาวะฉุกเฉินทางกายภาพหรือมีอันตรายต่อชีวิตเร่งด่วน โทรฟรี 24 ชั่วโมง",
    tag: "ฉุกเฉิน 24 ชม.",
    tagColor: "bg-[#FAEBEE] text-[#701E2D]",
    featured: false,
  },
];

export default function HelpPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ contact: "", topic: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAEBEE] text-[#701E2D] font-medium border border-[#F3D1D8]">
          <Heart size={13} className="text-[#E53E3E]" />
          <span>พื้นที่ดูแลและช่วยเหลือ</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          อยากคุยกับใครสักคนไหม?
        </h1>
        <p className="text-sm text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
          หากรู้สึกว่าสิ่งที่แบกไว้มันหนักเกินจะรับมือคนเดียว คุณไม่จำเป็นต้องเก็บไว้ มีผู้เชี่ยวชาญและอาสาสมัครที่พร้อมรับฟังโดยไม่ตัดสินคุณเสมอ
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-[#FFFDF8] border border-[#E8DFC9] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-xl bg-[#E2F2E9] text-[#245238] shrink-0 mt-0.5">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-[#555]">
          <p className="font-medium text-[#333]">
            การรักษาความลับและความปลอดภัย
          </p>
          <p className="text-[#777] leading-relaxed text-xs">
            หน้า “ขอความช่วยเหลือ” นี้แยกออกจากฟังก์ชัน “ปล่อยความรู้สึก” อย่างชัดเจน การโทรหรือติดต่อเจ้าหน้าที่เป็นการตัดสินใจของคุณโดยตรง และไม่มีการเชื่อมโยงข้อมูลข้อความระบายใด ๆ ทั้งสิ้น
          </p>
        </div>
      </div>

      {/* MSU University Support Centers (อิงตามคำแนะนำ มหาวิทยาลัยมหาสารคาม MSU) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFEAE1] pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E2F2E9] text-[#1B432E] mb-1">
              <Building2 size={12} />
              <span>มหาวิทยาลัยมหาสารคาม (MSU Care)</span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#3A3A3A] flex items-center gap-2">
              <span>🏛️ ช่องทางติดต่อและดูแลสุขภาวะ มหาวิทยาลัยมหาสารคาม</span>
            </h2>
          </div>
          <p className="text-xs text-[#7A7A7A]">
            บริการให้คำปรึกษาและตรวจรักษาสำหรับนิสิตและบุคลากร มมส.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MSU_CENTERS.map((center, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 sm:p-6 border border-[#B8DCC8] bg-white shadow-xs hover:shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${center.tagColor}`}>
                      {center.tag}
                    </span>
                    <span className="text-[11px] text-[#888] font-mono">{center.sub}</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#2D3748]">
                    {center.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                    {center.desc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666] bg-[#FFFDF8] p-3 rounded-xl border border-[#F0ECE1]">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#2F6B4A] shrink-0 mt-0.5" />
                  <span><strong>สถานที่:</strong> {center.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-[#2F6B4A] shrink-0 mt-0.5" />
                  <span><strong>เวลาทำการ:</strong> {center.hours}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <a
                  href={center.tel}
                  className="py-2.5 px-5 rounded-xl bg-[#2D5A3F] hover:bg-[#224430] text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <PhoneCall size={14} />
                  <span>โทรติดต่อ {center.number}</span>
                </a>

                <Link
                  href="/assessment"
                  className="text-xs text-[#2F6B4A] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>ทำแบบประเมินและขอรับการติดตามอาการ</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotline Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[#3A3A3A] flex items-center gap-2">
          <span>📞 สายด่วนสุขภาพจิตระดับประเทศ (โทรฟรี 24 ชม.)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOTLINES.map((h, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                h.featured
                  ? "bg-white border-[#B8DCC8] shadow-sm hover:shadow-md"
                  : "bg-white/80 border-[#EFEAE1] hover:bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${h.tagColor}`}>
                    {h.tag}
                  </span>
                  <PhoneCall size={15} className="text-[#888]" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-[#2D3748]">
                  {h.name}
                </h3>
                <p className="text-xs text-[#7A7A7A] leading-relaxed">
                  {h.desc}
                </p>
              </div>

              <div className="pt-4 mt-2">
                <a
                  href={h.tel}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2D5A3F] hover:bg-[#224430] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <PhoneCall size={14} />
                  <span>โทร {h.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Specialist Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-5">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-semibold text-[#3A3A3A] flex items-center gap-2">
            <MessageCircle size={18} className="text-[#2B6CB0]" />
            <span>ฝากข้อความถึงทีมผู้เชี่ยวชาญ / เจ้าหน้าที่ดูแลใจ</span>
          </h2>
          <p className="text-xs text-[#7A7A7A]">
            หากไม่สะดวกโทร สามารถพิมพ์ฝากข้อความหรือช่องทางติดต่อกลับที่สะดวก เพื่อให้เจ้าหน้าที่ติดต่อกลับได้
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-6 rounded-xl bg-[#E2F2E9] border border-[#B8DCC8] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#B8DCC8] text-[#1B432E] flex items-center justify-center">
              <Check size={20} />
            </div>
            <h4 className="font-semibold text-sm text-[#1B432E]">ได้รับข้อความของคุณแล้วนะ</h4>
            <p className="text-xs text-[#2A5A3D] max-w-sm mx-auto">
              เจ้าหน้าที่ผู้เชี่ยวชาญจะติดต่อกลับตามช่องทางที่คุณระบุอย่างรวดเร็วและปลอดภัยที่สุด ระหว่างนี้อย่าลืมดูแลตัวเองนะ 🌱
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setFormData({ contact: "", topic: "", message: "" });
              }}
              className="text-xs text-[#1B432E] underline pt-2"
            >
              ส่งข้อความอื่นเพิ่มเติม
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  ช่องทางติดต่อกลับ (อีเมล / เบอร์โทร / Line ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น email@example.com หรือ 08X-XXX-XXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  เรื่องที่ต้องการปรึกษา (ระบุสั้น ๆ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น เรื่องเรียน, ความเครียด, ปัญหาครอบครัว"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#555]">
                ข้อความที่คุณอยากบอกเล่า
              </label>
              <textarea
                required
                rows={4}
                placeholder="เล่าสิ่งที่คุณกำลังเผชิญให้เราฟังได้เลย..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <Send size={14} />
              <span>ส่งข้อความขอคำปรึกษา</span>
            </button>
          </form>
        )}
      </div>

      {/* Counselor & Faculty Advisor Portal Shortcut */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3A3A3A] flex items-center gap-1.5">
              <span>🎓</span>
              <span>สำหรับอาจารย์ที่ปรึกษาและเจ้าหน้าที่ศูนย์สุขภาวะนิสิต มมส.</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAEBEE] text-[#8C1D2F] border border-[#F3D1D8]">
              <span>🔒 ต้องใช้รหัสผ่าน</span>
            </span>
          </div>
          <p className="text-[#7A7A7A]">
            ระบบติดตามดูแลสุขภาวะนิสิต (MSU Student Care Tracker) ข้อมูลชั้นความลับทางการแพทย์ ต้องยืนยันรหัสผ่านก่อนเข้าถึง
          </p>
        </div>
        <Link
          href="/counselor"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-[#B8DCC8] hover:bg-[#E2F2E9] text-[#1B432E] font-medium transition-all shadow-2xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <span>เข้าสู่ระบบดูแลนิสิต</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
