"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Feather, Heart, Wind, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-16">
      {/* ==============================================================
          HERO SECTION
         ============================================================== */}
      <section className="text-center space-y-8 pt-4 sm:pt-8">
        {/* Soft Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-[#E2F2E9] text-[#245238] font-medium border border-[#B8DCC8]"
        >
          <span>🍃</span>
          <span>jaidee (ใจดี) — ใจดีกับตัวเอง... ในวันที่โลกใจร้าย</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4 max-w-xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#3A3A3A] tracking-tight leading-tight">
            วันนี้เป็นยังไงบ้าง?
          </h1>
          <p className="text-base sm:text-lg text-[#6A6A6A] leading-relaxed">
            ไม่ต้องเก็บทุกอย่างไว้คนเดียว<br />
            อารมณ์เปรียบเสมือนใบไม้ เมื่อถึงเวลาก็จะร่วงหล่นและพัดผ่านไป
          </p>
        </motion.div>

        {/* ==============================================================
            VISUAL ILLUSTRATION: Paper -> Breeze -> Falling Leaves
           ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-md mx-auto h-36 flex items-center justify-center select-none"
        >
          {/* Subtle soft glow aura */}
          <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#B8DCC8]/30 via-[#C7DDF2]/30 to-[#F7E6B5]/25 filter blur-2xl pointer-events-none" />

          {/* Interactive visual cycle */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 z-10">
            {/* Step 1: Paper note */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-4, -2, -4] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8DFC9] shadow-sm flex items-center justify-center text-2xl">
                📝
              </div>
              <span className="text-[11px] text-[#888]">เขียนระบาย</span>
            </motion.div>

            {/* Step 2: Gentle Wind breeze */}
            <motion.div
              animate={{ x: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-[#98B8A0] flex flex-col items-center gap-1"
            >
              <span className="text-xl">〰️🍃〰️</span>
              <span className="text-[10px] text-[#A5A5A5]">สายลมหอบพา</span>
            </motion.div>

            {/* Step 3: Falling leaves drifting */}
            <motion.div
              animate={{ y: [0, 6, 0], rotate: [8, 16, 8] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] shadow-sm flex items-center justify-center text-2xl">
                🍂
              </div>
              <span className="text-[11px] text-[#2F6B4A] font-medium">ร่วงหล่นสู่ความสงบ</span>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link
            href="/release"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1A442D] font-medium text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
          >
            <span>✍️ ปล่อยความรู้สึก</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/assessment"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FAEBEE] hover:bg-[#F3D1D8] text-[#8C243B] font-medium text-base border border-[#F3D1D8] shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>🌱 เช็กสุขภาพใจ</span>
          </Link>
        </motion.div>
      </section>

      {/* ==============================================================
          4 CORE FEATURE CARDS
         ============================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-[#3A3A3A]">
            พื้นที่สำหรับการพักใจ
          </h2>
          <p className="text-xs text-[#8A8A8A]">
            ปล่อยให้อารมณ์ได้ร่วงหล่น และกลับมาอยู่กับลมหายใจ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: ปล่อยความรู้สึก */}
          <Link
            href="/release"
            className="group p-6 rounded-2xl bg-white border border-[#EFEAE1] hover:border-[#B8DCC8] shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E2F2E9] text-[#245238] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🍃
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-[#333] group-hover:text-[#245238] transition-colors flex items-center gap-1.5">
                <span>ปล่อยความรู้สึก</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E2F2E9] text-[#245238]">
                  ฟีเจอร์เด่น
                </span>
              </h3>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                เขียนสิ่งที่อยู่ในใจ แล้วปล่อยให้ข้อความฉีกสลายและร่วงหล่นดั่งใบไม้ในสายลม ไม่มีการบันทึกข้อความ
              </p>
            </div>
          </Link>

          {/* Card 2: เช็กอารมณ์ */}
          <Link
            href="/mood"
            className="group p-6 rounded-2xl bg-white border border-[#EFEAE1] hover:border-[#F7E6B5] shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FDF7E5] text-[#5C4D20] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-[#333] group-hover:text-[#5C4D20] transition-colors">
                เช็กอารมณ์ประจำวัน
              </h3>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                สำรวจว่าวันนี้รู้สึกอย่างไร รับคำแนะนำสั้น ๆ เพื่อช่วยปรับอารมณ์ให้เบาสบายขึ้น
              </p>
            </div>
          </Link>

          {/* Card 3: ฝึกหายใจ */}
          <Link
            href="/breathe"
            className="group p-6 rounded-2xl bg-white border border-[#EFEAE1] hover:border-[#C7DDF2] shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EBF3FA] text-[#204E78] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🌬️
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-[#333] group-hover:text-[#204E78] transition-colors">
                ฝึกหายใจผ่อนคลาย
              </h3>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                กำหนดลมหายใจเข้า-ออกตามจังหวะวงกลม ช่วยลดความกังวลและคืนความสงบสู่ร่างกาย
              </p>
            </div>
          </Link>

          {/* Card 4: ประเมินสุขภาพจิต */}
          <Link
            href="/assessment"
            className="group p-6 rounded-2xl bg-white border border-[#EFEAE1] hover:border-[#F3D1D8] shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FAEBEE] text-[#632734] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🧠
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-[#333] group-hover:text-[#632734] transition-colors">
                ลองเช็กใจกันหน่อย
              </h3>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                แบบสำรวจสุขภาพใจตามเกณฑ์มาตรฐาน (2Q / 9Q / 8Q) เพื่อสังเกตสภาวะอารมณ์และดูแลตนเองอย่างปลอดภัย
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==============================================================
          SAFETY & PRIVACY CALLOUT
         ============================================================== */}
      <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E2F2E9] text-[#245238] flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm sm:text-base text-[#333]">
              พื้นที่ปลอดภัยและเป็นส่วนตัว 100%
            </h4>
            <p className="text-xs text-[#7A7A7A]">
              ไม่มีการบันทึกข้อความระบาย ไม่มีการส่งต่อไปยัง AI ภายนอก และไม่ต้องสมัครสมาชิก
            </p>
          </div>
        </div>

        <Link
          href="/privacy"
          className="shrink-0 px-4 py-2 rounded-xl bg-[#FFFDF8] border border-[#E0DACB] hover:border-[#B8DCC8] text-xs font-medium text-[#555] hover:text-[#111] transition-all"
        >
          อ่านนโยบายความเป็นส่วนตัว
        </Link>
      </section>
    </div>
  );
}
