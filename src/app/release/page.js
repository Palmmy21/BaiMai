"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { soundManager } from "@/utils/audio";
import { Feather, RefreshCw, Home, Wind, ShieldCheck, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const PAPER_COLORS = [
  { id: "cream", name: "ครีมอบอุ่น", bg: "bg-[#FFFDF8]", border: "border-[#ECE5D8]", text: "text-[#3D3A34]" },
  { id: "green", name: "เขียวใบไม้", bg: "bg-[#EBF7F0]", border: "border-[#D0EBDC]", text: "text-[#264434]" },
  { id: "blue", name: "ฟ้าสายลม", bg: "bg-[#F0F6FC]", border: "border-[#D6E6F5]", text: "text-[#27405A]" },
  { id: "pink", name: "ชมพูกลีบดอก", bg: "bg-[#FCF1F3]", border: "border-[#F5D8DE]", text: "text-[#553037]" },
  { id: "yellow", name: "เหลืองใบไม้ร่วง", bg: "bg-[#FEFAEC]", border: "border-[#F6EDCD]", text: "text-[#524422]" },
];

// Leaf SVGs for realistic leaf fluttering animation
function LeafIcon({ color = "#88C09E", size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 26C6 26 8 18 16 12C24 6 27 5 27 5C27 5 26 8 20 16C14 24 6 26 6 26Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        d="M6 26C11 21 16 16 27 5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <path
        d="M12 20C14 19 16 19 18 20"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M17 15C19 14 21 14 23 15"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

// Particle items generated during leaf fall
const FALLING_LEAVES = [
  { id: 1, xStart: -60, xDrift: -140, yTarget: 180, rotate: 180, duration: 2.2, delay: 0, color: "#88C09E", size: 32 },
  { id: 2, xStart: 20, xDrift: 120, yTarget: 220, rotate: -220, duration: 2.4, delay: 0.1, color: "#B8DCC8", size: 26 },
  { id: 3, xStart: -20, xDrift: -80, yTarget: 260, rotate: 260, duration: 2.6, delay: 0.15, color: "#E0C070", size: 30 },
  { id: 4, xStart: 70, xDrift: 160, yTarget: 190, rotate: -190, duration: 2.1, delay: 0.05, color: "#EAA888", size: 24 },
  { id: 5, xStart: -90, xDrift: -180, yTarget: 240, rotate: 310, duration: 2.5, delay: 0.2, color: "#A8D8B9", size: 28 },
  { id: 6, xStart: 40, xDrift: 90, yTarget: -160, rotate: -150, duration: 2.3, delay: 0.12, color: "#85BA9B", size: 25 },
  { id: 7, xStart: -40, xDrift: -110, yTarget: -180, rotate: 210, duration: 2.4, delay: 0.25, color: "#F7D890", size: 34 },
  { id: 8, xStart: 90, xDrift: 200, yTarget: -140, rotate: -270, duration: 2.2, delay: 0.18, color: "#C5E3D0", size: 22 },
  { id: 9, xStart: 0, xDrift: 50, yTarget: 250, rotate: 160, duration: 2.7, delay: 0.3, color: "#DDA77B", size: 29 },
  { id: 10, xStart: -75, xDrift: -50, yTarget: 200, rotate: -200, duration: 2.5, delay: 0.22, color: "#92C5A5", size: 27 },
];

export default function ReleasePage() {
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState(PAPER_COLORS[0]);
  const [phase, setPhase] = useState("writing"); // "writing" | "tearing" | "floating" | "released"
  const [savedTextSnapshot, setSavedTextSnapshot] = useState("");
  const textareaRef = useRef(null);

  // Trigger fluttering leaf particles
  const triggerLeafConfetti = () => {
    const end = Date.now() + 1800;
    // Green and autumn leaf pastel tones
    const leafColors = ["#88C09E", "#B8DCC8", "#E2F2E9", "#E0C070", "#E8BA9B", "#F7E6B5"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 75,
        spread: 60,
        origin: { x: 0.25, y: 0.6 },
        colors: leafColors,
        shapes: ['circle'],
        scalar: 0.9,
        ticks: 240,
        gravity: 0.45,
        drift: 0.3,
      });
      confetti({
        particleCount: 4,
        angle: 105,
        spread: 60,
        origin: { x: 0.75, y: 0.6 },
        colors: leafColors,
        shapes: ['circle'],
        scalar: 0.9,
        ticks: 240,
        gravity: 0.45,
        drift: -0.3,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleRelease = () => {
    if (!text.trim() || phase !== "writing") return;

    setSavedTextSnapshot(text);
    
    // Phase 1 -> 2: Tearing paper
    setPhase("tearing");
    soundManager.playPaperTearSound();

    // Phase 2 -> 3: Dissolving into fluttering leaves
    setTimeout(() => {
      setPhase("floating");
      triggerLeafConfetti();
    }, 850);

    // Phase 3 -> 4: Release complete affirmation
    setTimeout(() => {
      // Clear message completely from memory
      setText("");
      setSavedTextSnapshot("");
      setPhase("released");
      soundManager.playHealingChime(528);
    }, 2600);
  };

  const handleReset = () => {
    setText("");
    setSavedTextSnapshot("");
    setPhase("writing");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-140px)] flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ==============================================================
            PHASE 1: WRITING
           ============================================================== */}
        {phase === "writing" && (
          <motion.div
            key="writing-box"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="w-full space-y-6"
          >
            {/* Header with Leaf Philosophy */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#E2F2E9] text-[#245238] font-medium border border-[#B8DCC8]">
                <span>🍃</span>
                <span>อารมณ์คือใบไม้ ที่สักวันจะร่วงหล่น</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
                วันนี้มีเรื่องอะไรอยู่ในใจบ้าง?
              </h1>
              <p className="text-sm text-[#7A7A7A] max-w-md mx-auto leading-relaxed">
                เขียนสิ่งที่อยากบอก ไม่ต้องเรียบเรียง ไม่ต้องกลัวใครเห็น<br className="hidden sm:inline" />
                เมื่อเขียนเสร็จแล้ว ลองปล่อยให้มันร่วงหล่นและปลิวไปตามสายลมดูนะ
              </p>
            </div>

            {/* Paper Color Palette Picker */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs text-[#8A8A8A] mr-1">สีกระดาษ:</span>
              {PAPER_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all ${c.bg} ${c.border} ${
                    selectedColor.id === c.id
                      ? "ring-2 ring-offset-2 ring-[#779988] scale-110 shadow-xs"
                      : "hover:scale-105 opacity-80"
                  }`}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>

            {/* Paper Container */}
            <div 
              className={`relative rounded-2xl p-6 sm:p-8 border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors duration-300 ${selectedColor.bg} ${selectedColor.border}`}
            >
              {/* Subtle aesthetic leaf pin */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#D5CDBD] shadow-xs flex items-center gap-1 text-[11px] text-[#6A6A6A]">
                <span>🍃</span>
                <span className="font-handwriting">พื้นที่ฝากความรู้สึก</span>
              </div>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 500))}
                placeholder="เขียนอะไรก็ได้ ไม่ต้องสวย ไม่ต้องถูก ไม่ต้องให้ใครเข้าใจ...&#10;&#10;เช่น วันนี้เหนื่อยจัง แบกอะไรไว้เยอะเกินไป อยากให้ใจได้เบาสบายลงบ้าง..."
                rows={7}
                className={`w-full bg-transparent resize-none border-none outline-none font-handwriting text-base sm:text-lg leading-relaxed ${selectedColor.text} placeholder:text-[#9A9A9A]/70`}
                maxLength={500}
                autoFocus
              />

              {/* Word count & Zero data note */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-black/5 text-xs text-[#8A8A8A]">
                <div className="flex items-center gap-1 text-[11px] text-[#888]">
                  <ShieldCheck size={13} className="text-[#4E8B67]" />
                  <span>ข้อความจะไม่ถูกบันทึก จะสลายไปเมื่อกดปล่อย</span>
                </div>
                <div className="font-mono">
                  {text.length} <span className="text-[#A5A5A5]">/ 500</span>
                </div>
              </div>
            </div>

            {/* Release CTA Button */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={handleRelease}
                disabled={!text.trim()}
                className={`group relative px-8 py-3.5 rounded-full font-medium text-base shadow-sm transition-all duration-300 flex items-center gap-2.5 ${
                  text.trim()
                    ? "bg-[#B8DCC8] text-[#1A442D] hover:bg-[#A3CEB5] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    : "bg-[#E6E0D5]/70 text-[#9C968A] cursor-not-allowed"
                }`}
              >
                <span>ปล่อยความรู้สึกให้ร่วงหล่น</span>
                <span className="text-xl transition-transform group-hover:rotate-45 duration-300">
                  🍃
                </span>
              </button>

              <span className="text-[12px] text-[#9A9A9A]">
                กดเพื่อให้ข้อความฉีกสลายและร่วงหล่นดั่งใบไม้ในสายลม
              </span>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            PHASE 2 & 3: TEARING & LEAF DISINTEGRATION ANIMATION
           ============================================================== */}
        {(phase === "tearing" || phase === "floating") && (
          <motion.div
            key="tearing-container"
            className="w-full max-w-lg min-h-[420px] flex flex-col items-center justify-center relative overflow-visible py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Visual paper tearing */}
            <div className="relative w-full h-[320px] flex items-center justify-center">
              
              {/* LEFT HALF OF PAPER */}
              <motion.div
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={
                  phase === "tearing"
                    ? {
                        x: -32,
                        y: 18,
                        rotate: -5,
                        opacity: 1,
                        transition: { duration: 0.8, ease: "easeInOut" }
                      }
                    : {
                        x: -95,
                        y: -130,
                        rotate: -20,
                        opacity: 0,
                        scale: 0.55,
                        filter: "blur(5px)",
                        transition: { duration: 1.6, ease: "easeOut" }
                      }
                }
                className={`absolute left-0 w-[53%] h-[280px] rounded-l-2xl p-6 ${selectedColor.bg} ${selectedColor.border} border-y border-l shadow-md overflow-hidden torn-left`}
              >
                <div className={`font-handwriting text-base sm:text-lg leading-relaxed ${selectedColor.text} select-none pointer-events-none`}>
                  {savedTextSnapshot.slice(0, Math.ceil(savedTextSnapshot.length / 2))}
                </div>
              </motion.div>

              {/* RIGHT HALF OF PAPER */}
              <motion.div
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={
                  phase === "tearing"
                    ? {
                        x: 32,
                        y: 22,
                        rotate: 6,
                        opacity: 1,
                        transition: { duration: 0.8, ease: "easeInOut" }
                      }
                    : {
                        x: 105,
                        y: -140,
                        rotate: 24,
                        opacity: 0,
                        scale: 0.55,
                        filter: "blur(5px)",
                        transition: { duration: 1.6, ease: "easeOut" }
                      }
                }
                className={`absolute right-0 w-[53%] h-[280px] rounded-r-2xl p-6 ${selectedColor.bg} ${selectedColor.border} border-y border-r shadow-md overflow-hidden torn-right`}
              >
                <div className={`font-handwriting text-base sm:text-lg leading-relaxed ${selectedColor.text} select-none pointer-events-none`}>
                  {savedTextSnapshot.slice(Math.ceil(savedTextSnapshot.length / 2))}
                </div>
              </motion.div>

              {/* SWIRLING & FALLING LEAVES (BaiMai Signature Animation) */}
              {phase === "floating" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {FALLING_LEAVES.map((leaf) => (
                    <motion.div
                      key={leaf.id}
                      initial={{
                        x: leaf.xStart,
                        y: 0,
                        opacity: 0.95,
                        scale: 0.6,
                        rotate: 0,
                      }}
                      animate={{
                        x: [
                          leaf.xStart,
                          leaf.xStart + leaf.xDrift * 0.4,
                          leaf.xStart + leaf.xDrift * 0.8,
                          leaf.xStart + leaf.xDrift
                        ],
                        y: [0, leaf.yTarget * 0.3, leaf.yTarget * 0.7, leaf.yTarget],
                        opacity: [0.95, 0.9, 0.6, 0],
                        scale: [0.6, 1.1, 0.9, 0.4],
                        rotate: [0, leaf.rotate * 0.4, leaf.rotate * 0.8, leaf.rotate],
                      }}
                      transition={{
                        duration: leaf.duration,
                        delay: leaf.delay,
                        ease: "easeInOut",
                      }}
                      className="absolute"
                    >
                      <LeafIcon color={leaf.color} size={leaf.size} />
                    </motion.div>
                  ))}

                  {/* Gentle Floating Text Words / Particles */}
                  {["🍃", "🍂", "🌿", "〰️", "✨", "🕊️"].map((item, i) => (
                    <motion.div
                      key={`symbol-${i}`}
                      initial={{
                        x: (Math.random() - 0.5) * 50,
                        y: 10,
                        opacity: 0.8,
                        scale: 0.8,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 240,
                        y: -180 - Math.random() * 100,
                        opacity: 0,
                        scale: 0,
                        rotate: (Math.random() - 0.5) * 120,
                      }}
                      transition={{
                        duration: 1.8 + i * 0.15,
                        ease: "easeOut",
                      }}
                      className="absolute text-xl"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="text-xs text-[#5A7A6A] mt-4 flex items-center gap-2 bg-[#E2F2E9]/70 px-3.5 py-1.5 rounded-full border border-[#B8DCC8]"
            >
              <span>🍃</span>
              <span>อารมณ์กำลังร่วงหล่นและปลิวไปตามสายลม...</span>
            </motion.div>
          </motion.div>
        )}

        {/* ==============================================================
            PHASE 4: HEALING AFFIRMATION
           ============================================================== */}
        {phase === "released" && (
          <motion.div
            key="released-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md text-center space-y-6 py-6"
          >
            {/* Glowing Leaf Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 14 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#E2F2E9] to-[#FFFDF8] border-2 border-[#B8DCC8] flex items-center justify-center text-3xl shadow-sm"
            >
              🍃
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D5A3F]">
                ปล่อยให้ร่วงหล่นไปแล้วนะ 🍃
              </h2>
              
              <div className="bg-[#FFFDF8] border border-[#E8DFC9] rounded-2xl p-4 shadow-2xs space-y-1.5">
                <p className="text-sm sm:text-base text-[#444] font-medium leading-relaxed font-handwriting">
                  “อารมณ์ก็เหมือนใบไม้... เมื่อถึงเวลา ก็จะร่วงหล่นและพัดผ่านไป”
                </p>
                <p className="text-xs text-[#7A7A7A]">
                  ไม่เป็นไรนะ วันนี้คุณทำดีที่สุดแล้ว 🤍
                </p>
              </div>

              <p className="text-xs text-[#8A8A8A] max-w-xs mx-auto leading-relaxed">
                ข้อความถูกสลายและลบออกจากระบบเรียบร้อยแล้ว<br />
                หายใจเข้าลึก ๆ แล้วปล่อยให้ใจได้เบาสบายนะ
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#B8DCC8] text-[#1B432E] hover:bg-[#A3CEB5] font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <RefreshCw size={15} />
                <span>เขียนอีกครั้ง</span>
              </button>

              <Link
                href="/breathe"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#EBF3FA] text-[#204E78] hover:bg-[#DCE9F7] font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Wind size={15} />
                <span>ไปฝึกหายใจต่อ</span>
              </Link>
            </div>

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors py-2"
              >
                <Home size={14} />
                <span>กลับหน้าหลัก</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
