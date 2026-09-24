"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Wind, Feather, Sparkles, Heart, Calendar, RotateCcw, ShieldCheck } from "lucide-react";
import { soundManager } from "@/utils/audio";

const MOODS = [
  {
    id: "great",
    emoji: "😊",
    label: "ดีมาก",
    color: "bg-[#E2F2E9]",
    borderColor: "border-[#B8DCC8]",
    textColor: "text-[#245238]",
    message: "ยินดีด้วยนะ! วันนี้เป็นวันที่ยอดเยี่ยม ขอให้รอยยิ้มนี้อยู่กับคุณไปตลอดทั้งวัน 🌱",
    actions: [
      { href: "/release", label: "บันทึกเรื่องดี ๆ เก็บไว้", icon: Feather, color: "bg-[#B8DCC8] text-[#1B432E]" },
      { href: "/breathe", label: "ฝึกหายใจให้ใจสงบ", icon: Wind, color: "bg-[#EBF3FA] text-[#245282]" },
    ]
  },
  {
    id: "good",
    emoji: "🙂",
    label: "ดี",
    color: "bg-[#FDF7E5]",
    borderColor: "border-[#F7E6B5]",
    textColor: "text-[#5C4D20]",
    message: "ดีใจที่วันนี้ของคุณราบรื่น มีเรื่องเล็ก ๆ ที่ทำให้ยิ้มได้ก็มีความสุขแล้วนะ 🌼",
    actions: [
      { href: "/release", label: "เขียนขอบคุณเรื่องเล็ก ๆ", icon: Feather, color: "bg-[#B8DCC8] text-[#1B432E]" },
      { href: "/breathe", label: "ผ่อนคลายสัก 2 นาที", icon: Wind, color: "bg-[#EBF3FA] text-[#245282]" },
    ]
  },
  {
    id: "neutral",
    emoji: "😐",
    label: "เฉย ๆ",
    color: "bg-[#F0F4F8]",
    borderColor: "border-[#C7DDF2]",
    textColor: "text-[#2C4A6F]",
    message: "วันเรียบ ๆ ธรรมดา ๆ แบบนี้ก็ดีไม่น้อยเลย ให้เวลาตัวเองได้พักนิ่ง ๆ บ้างนะ ☁️",
    actions: [
      { href: "/breathe", label: "ฝึกหายใจปรับสมดุล", icon: Wind, color: "bg-[#C7DDF2] text-[#1B3E68]" },
      { href: "/release", label: "เขียนทบทวนสิ่งที่คิด", icon: Feather, color: "bg-[#E2F2E9] text-[#245238]" },
      { href: "/assessment", label: "ลองเช็กใจตัวเอง", icon: Sparkles, color: "bg-[#FAEBEE] text-[#632734]" },
    ]
  },
  {
    id: "down",
    emoji: "😔",
    label: "ไม่ค่อยดี",
    color: "bg-[#FAEBEE]",
    borderColor: "border-[#F3D1D8]",
    textColor: "text-[#632734]",
    message: "ขอบคุณที่ซื่อสัตย์กับความรู้สึกตัวเองนะ เหนื่อยหน่อยใช่ไหม... ให้ jaidee (ใจดี) อยู่เป็นเพื่อนนะ 🍃",
    actions: [
      { href: "/release", label: "✍️ ระบายความรู้สึกแล้วปล่อยมันไป", icon: Feather, color: "bg-[#B8DCC8] text-[#1B432E]" },
      { href: "/breathe", label: "🌬️ ฝึกหายใจคลายอึดอัด", icon: Wind, color: "bg-[#EBF3FA] text-[#245282]" },
      { href: "/assessment", label: "🧠 ประเมินสุขภาพจิตเบื้องต้น", icon: Sparkles, color: "bg-[#FAEBEE] text-[#632734]" },
    ]
  },
  {
    id: "terrible",
    emoji: "😢",
    label: "แย่มาก",
    color: "bg-[#F5E6E8]",
    borderColor: "border-[#EAA8B4]",
    textColor: "text-[#701E2D]",
    message: "กอดใจตัวเองแน่น ๆ นะ คุณเก่งมากแล้วที่ผ่านวันนี้มาได้ ไม่เป็นไรเลยถ้าจะร้องไห้หรือรู้สึกอ่อนแอ 🤍",
    actions: [
      { href: "/release", label: "✍️ เขียนระบายสิ่งที่อยู่ในใจ", icon: Feather, color: "bg-[#B8DCC8] text-[#1B432E]" },
      { href: "/breathe", label: "🌬️ หายใจช้า ๆ พักใจสักครู่", icon: Wind, color: "bg-[#EBF3FA] text-[#245282]" },
      { href: "/help", label: "☎ อยากคุยกับใครสักคนไหม?", icon: Heart, color: "bg-[#FED7D7] text-[#9B1C1C]" },
    ]
  },
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  // Load local history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jaidee_mood_history");
      if (saved) {
        setMoodHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage access", e);
    }
  }, []);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    soundManager.playHealingChime(mood.id === "great" ? 587.33 : mood.id === "good" ? 528 : 440);

    // Save strictly to local device
    try {
      const today = new Date().toISOString().split("T")[0];
      const newEntry = { date: today, moodId: mood.id, label: mood.label, emoji: mood.emoji };
      const filtered = moodHistory.filter((entry) => entry.date !== today);
      const updated = [newEntry, ...filtered].slice(0, 7);
      setMoodHistory(updated);
      localStorage.setItem("jaidee_mood_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Save mood error", e);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-140px)] flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FDF7E5] text-[#635322] font-medium border border-[#F7E6B5]">
          <Heart size={13} className="text-[#E08736]" />
          <span>เช็กอารมณ์ประจำวัน</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          วันนี้รู้สึกยังไงบ้าง?
        </h1>
        <p className="text-sm text-[#7A7A7A] max-w-sm mx-auto">
          ซื่อสัตย์กับใจตัวเองได้เสมอ ไม่มีอารมณ์ไหนที่ผิดเลยนะ
        </p>
      </div>

      {/* Mood Selector Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-md mb-8">
        {MOODS.map((m) => {
          const isSelected = selectedMood?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMood(m)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all active:scale-95 ${
                isSelected
                  ? `${m.color} ${m.borderColor} shadow-md scale-105 ring-2 ring-offset-2 ring-[#B8DCC8]`
                  : "bg-white/80 border-[#EFEAE1] hover:bg-[#FFFDF8] hover:border-[#DCD5C5] shadow-xs"
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1.5 transition-transform hover:scale-110">
                {m.emoji}
              </span>
              <span className={`text-xs font-medium ${isSelected ? m.textColor : "text-[#666]"}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Response Card */}
      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-md rounded-2xl p-6 border shadow-sm space-y-5 ${selectedMood.color} ${selectedMood.borderColor}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedMood.emoji}</span>
              <div>
                <p className="text-xs text-[#666]">วันนี้คุณรู้สึก</p>
                <h3 className={`text-lg font-semibold ${selectedMood.textColor}`}>
                  {selectedMood.label}
                </h3>
              </div>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed ${selectedMood.textColor}`}>
              {selectedMood.message}
            </p>

            {/* Smart Next Actions */}
            <div className="space-y-2 pt-2 border-t border-black/5">
              <p className="text-xs text-[#7A7A7A] font-medium">สิ่งที่คุณสามารถทำต่อได้ตอนนี้:</p>
              <div className="flex flex-col gap-2">
                {selectedMood.actions.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <Link
                      key={idx}
                      href={act.href}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs hover:opacity-90 active:scale-[0.98] ${act.color}`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={15} />
                        <span>{act.label}</span>
                      </span>
                      <span>→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Mood History Summary */}
      {moodHistory.length > 0 && (
        <div className="w-full max-w-md mt-10 pt-6 border-t border-[#EFEAE1]/70">
          <div className="flex items-center justify-between text-xs text-[#7A7A7A] mb-3">
            <span className="flex items-center gap-1.5 font-medium text-[#555]">
              <Calendar size={13} />
              <span>บันทึกอารมณ์ของคุณ (ส่วนตัวในเครื่อง)</span>
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("jaidee_mood_history");
                setMoodHistory([]);
              }}
              className="text-[11px] text-[#A0A0A0] hover:text-[#555] flex items-center gap-1"
              title="ล้างประวัติอารมณ์ในเครื่อง"
            >
              <RotateCcw size={11} />
              <span>ล้าง</span>
            </button>
          </div>

          <div className="flex items-center justify-start gap-2 overflow-x-auto py-1">
            {moodHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white/70 border border-[#EFEAE1] rounded-xl px-2.5 py-1.5 text-center min-w-[50px] shadow-xs"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-[10px] text-[#888] mt-0.5">
                  {item.date ? item.date.slice(5) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#9A9A9A] mt-6">
        <ShieldCheck size={13} className="text-[#4E8B67]" />
        <span>ข้อมูลอารมณ์นี้บันทึกไว้ใน Browser ของคุณเท่านั้น ไม่ส่งไปที่ใดทั้งสิ้น</span>
      </div>
    </div>
  );
}
