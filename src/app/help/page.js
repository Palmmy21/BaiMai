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
  Sparkles,
  Smile,
  ArrowRight,
  ShieldAlert,
  Clock,
  Feather
} from "lucide-react";

const HOTLINES = [
  {
    name: "สายด่วนสุขภาพวัยรุ่นและเยาวชน (Lovecare)",
    number: "1663",
    tel: "tel:1663",
    desc: "บริการรับฟังและให้คำปรึกษาปัญหาความเครียด ความสัมพันธ์ เพื่อน ครอบครัว และสุขภาวะสำหรับน้อง ๆ วัยรุ่นและนักเรียนโดยเฉพาะ",
    tag: "เฉพาะวัยรุ่นและนักเรียน",
    tagColor: "bg-[#FDF7E5] text-[#5C4D20] border border-[#F7E6B5]",
    featured: true,
  },
  {
    name: "สายด่วนสุขภาพจิต กรมสุขภาพจิต",
    number: "1323",
    tel: "tel:1323",
    desc: "บริการให้คำปรึกษาปัญหาสุขภาพจิต ความเครียด และความวิตกกังวลโดยผู้เชี่ยวชาญ โทรฟรีตลอด 24 ชั่วโมง",
    tag: "โทรฟรี 24 ชม.",
    tagColor: "bg-[#E2F2E9] text-[#245238] border border-[#B8DCC8]",
    featured: true,
  },
  {
    name: "สมาคมสะมาริตันส์แห่งประเทศไทย",
    number: "02-113-6789",
    tel: "tel:021136789",
    desc: "บริการรับฟังด้วยใจเพื่อคลายทุกข์ โดยอาสาสมัครที่พร้อมรับฟังทุกเรื่องที่คุณอยากบอกเล่าโดยไม่ตัดสิน",
    tag: "รับฟังด้วยใจ",
    tagColor: "bg-[#EBF3FA] text-[#204E78] border border-[#C7DDF2]",
    featured: false,
  },
  {
    name: "สายด่วนกู้ชีพฉุกเฉิน",
    number: "1669",
    tel: "tel:1669",
    desc: "กรณีเกิดภาวะฉุกเฉินทางกายภาพหรือมีอันตรายต่อชีวิตเร่งด่วน โทรฟรีตลอด 24 ชั่วโมง",
    tag: "ฉุกเฉิน 24 ชม.",
    tagColor: "bg-[#FAEBEE] text-[#701E2D] border border-[#F3D1D8]",
    featured: false,
  },
];

export default function HelpPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    nickname: "", 
    grade: "มัธยมศึกษาปีที่ 1 (ม.1)", 
    contact: "", 
    topic: "", 
    message: "" 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim() || !formData.contact.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs bg-[#FAEBEE] text-[#701E2D] font-medium border border-[#F3D1D8]">
          <Heart size={13} className="text-[#E53E3E]" />
          <span>พื้นที่ปลอดภัยสำหรับน้อง ๆ</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          อยากคุยกับใครสักคนไหม? 🤍
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7A7A] max-w-lg mx-auto leading-relaxed">
          หากรู้สึกว่าสิ่งที่แบกไว้มันหนักเกินจะรับมือคนเดียว น้อง ๆ ไม่ต้องเก็บไว้ มีพี่ ๆ ผู้ดูแลและช่องทางที่พร้อมรับฟังโดยไม่ตัดสินคุณเสมอ
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-[#FFFDF8] border border-[#E8DFC9] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-xl bg-[#E2F2E9] text-[#245238] shrink-0 mt-0.5">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-[#555]">
          <p className="font-medium text-[#333]">
            การรักษาความลับและความปลอดภัยของน้อง ๆ
          </p>
          <p className="text-[#777] leading-relaxed text-xs">
            หน้า “ขอความช่วยเหลือ” นี้แยกออกจากฟังก์ชัน “ปล่อยความรู้สึก” อย่างชัดเจน การคุยกับพี่ ๆ ผู้ดูแลหรือโทรสายด่วนเป็นการตัดสินใจของน้องโดยตรง และไม่มีการเชื่อมโยงกับข้อความที่น้องกดปล่อยความรู้สึกใด ๆ ทั้งสิ้น
          </p>
        </div>
      </div>

      {/* Featured: BaiMai Care Team for Students */}
      <div className="rounded-3xl p-6 sm:p-7 border border-[#B8DCC8] bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E2F2E9] text-[#1B432E]">
              <Sparkles size={12} />
              <span>พี่ ๆ ผู้ดูแล ใจดี (JaiDee Care Team)</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#2D3748]">
              มีเรื่องไม่สบายใจ อยากให้พี่ ๆ ช่วยรับฟังไหม?
            </h2>
            <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
              ไม่ว่าจะเป็นเรื่องเพื่อนที่โรงเรียน การเรียน การบ้าน ความเครียด หรือปัญหาที่บ้าน หากไม่รู้จะหันไปคุยกับใคร สามารถฝากข้อความหรือทำแบบประเมินสุขภาพใจเพื่อให้พี่ ๆ ติดต่อกลับมาคุยด้วยได้นะ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/assessment"
            className="py-2.5 px-5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-xs active:scale-95"
          >
            <span>ทำแบบประเมินและให้พี่ ๆ ติดต่อกลับ</span>
            <ArrowRight size={14} />
          </Link>

          <a
            href="#message-form"
            className="py-2.5 px-5 rounded-full bg-[#FFFDF8] border border-[#E0DACB] hover:bg-[#F3EFE6] text-[#444] text-xs sm:text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle size={14} />
            <span>พิมพ์ฝากข้อความถึงพี่ ๆ</span>
          </a>
        </div>
      </div>

      {/* Hotline Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFEAE1] pb-2">
          <h2 className="text-base font-semibold text-[#3A3A3A] flex items-center gap-2">
            <span>📞 สายด่วนโทรฟรีและรับฟัง (สำหรับวัยรุ่นและเยาวชน)</span>
          </h2>
          <span className="text-xs text-[#888]">โทรได้ทุกวัน</span>
        </div>

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
      <div id="message-form" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF3FA] text-[#204E78]">
            <Smile size={12} />
            <span>พูดคุยกับพี่ ๆ ผู้ดูแล</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[#3A3A3A] flex items-center gap-2">
            <MessageCircle size={18} className="text-[#2B6CB0]" />
            <span>ฝากข้อความถึงพี่ ๆ ผู้ดูแล ใจดี</span>
          </h2>
          <p className="text-xs text-[#7A7A7A]">
            หากไม่สะดวกโทร สามารถพิมพ์ฝากข้อความหรือช่องทางติดต่อกลับ (เช่น Line ID หรือ เบอร์โทร) เพื่อให้พี่ ๆ ทักหาได้นะ
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-6 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#B8DCC8] text-[#1B432E] flex items-center justify-center">
              <Check size={20} />
            </div>
            <h4 className="font-semibold text-sm text-[#1B432E]">พี่ ๆ ได้รับข้อความของน้องแล้วนะ 🌱</h4>
            <p className="text-xs text-[#2A5A3D] max-w-sm mx-auto leading-relaxed">
              พี่ ๆ ผู้ดูแลจะติดต่อกลับตามช่องทางที่น้องระบุอย่างรวดเร็วและปลอดภัยที่สุด ระหว่างนี้พักผ่อนเยอะ ๆ อย่าลืมใจดีกับตัวเองนะ
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setFormData({ nickname: "", grade: "มัธยมศึกษาปีที่ 1 (ม.1)", contact: "", topic: "", message: "" });
              }}
              className="text-xs text-[#1B432E] underline pt-2 cursor-pointer"
            >
              ส่งข้อความอื่นเพิ่มเติม
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  ชื่อเล่นของน้อง (หรือนามสมมติ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น น้องใจดี"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  ระดับชั้น
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm text-[#333] focus:outline-none focus:border-[#779988]"
                >
                  <optgroup label="มัธยมศึกษา">
                    <option value="มัธยมศึกษาปีที่ 1 (ม.1)">มัธยมศึกษาปีที่ 1 (ม.1)</option>
                    <option value="มัธยมศึกษาปีที่ 2 (ม.2)">มัธยมศึกษาปีที่ 2 (ม.2)</option>
                    <option value="มัธยมศึกษาปีที่ 3 (ม.3)">มัธยมศึกษาปีที่ 3 (ม.3)</option>
                    <option value="มัธยมศึกษาตอนปลาย (ม.4 - ม.6)">มัธยมศึกษาตอนปลาย (ม.4 - ม.6)</option>
                  </optgroup>
                  <optgroup label="ประถมศึกษาตอนปลาย">
                    <option value="ประถมศึกษาปีที่ 4 (ป.4)">ประถมศึกษาปีที่ 4 (ป.4)</option>
                    <option value="ประถมศึกษาปีที่ 5 (ป.5)">ประถมศึกษาปีที่ 5 (ป.5)</option>
                    <option value="ประถมศึกษาปีที่ 6 (ป.6)">ประถมศึกษาปีที่ 6 (ป.6)</option>
                  </optgroup>
                  <option value="อื่น ๆ">อื่น ๆ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  ช่องทางให้พี่ ๆ ติดต่อกลับ (Line ID / เบอร์โทร / IG) <span className="text-[#E53E3E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Line: jaidee_friend หรือ 08X-XXX-XXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#555]">
                  เรื่องที่อยากปรึกษา
                </label>
                <input
                  type="text"
                  placeholder="เช่น เรื่องเพื่อน, เรื่องเรียน, ความเครียด, ที่บ้าน"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#555]">
                สิ่งที่น้องอยากเล่าให้พี่ ๆ ฟัง
              </label>
              <textarea
                required
                rows={4}
                placeholder="เล่าสิ่งที่กำลังเจอให้พี่ ๆ ฟังได้เลยนะ ไม่ต้องกังวลว่าจะมีใครมาตัดสิน..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs sm:text-sm focus:outline-none focus:border-[#779988]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Send size={14} />
              <span>ส่งข้อความหาพี่ ๆ ผู้ดูแล</span>
            </button>
          </form>
        )}
      </div>

      {/* Mentor Portal Shortcut */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3A3A3A] flex items-center gap-1.5">
              <span>🌱</span>
              <span>สำหรับพี่ ๆ ผู้ดูแล ใจดี (JaiDee Care)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAEBEE] text-[#8C1D2F] border border-[#F3D1D8]">
              <span>🔒 ต้องใช้รหัสผ่าน</span>
            </span>
          </div>
          <p className="text-[#7A7A7A]">
            ระบบติดตามดูแลน้อง ๆ (JaiDee Care Tracker) ข้อมูลชั้นความลับทางการดูแล ต้องยืนยันรหัสผ่านก่อนเข้าถึง
          </p>
        </div>
        <Link
          href="/counselor"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-[#B8DCC8] hover:bg-[#E2F2E9] text-[#1B432E] font-medium transition-all shadow-2xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <span>เข้าสู่ระบบดูแลน้อง ๆ</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
