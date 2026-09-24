"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Feather, Heart } from "lucide-react";
import Link from "next/link";
import { soundManager } from "@/utils/audio";

const TECHNIQUES = [
  {
    id: "box",
    name: "Box Breathing (4-4-4-4)",
    desc: "สมดุลและลดความเครียดทันที",
    steps: [
      { name: "หายใจเข้า", duration: 4, type: "inhale" },
      { name: "กลั้นหายใจ", duration: 4, type: "hold" },
      { name: "หายใจออก", duration: 4, type: "exhale" },
      { name: "พักนิ่ง ๆ", duration: 4, type: "hold-empty" },
    ]
  },
  {
    id: "relax",
    name: "4-7-8 Deep Calm",
    desc: "ผ่อนคลายลึกและช่วยให้นอนหลับง่ายขึ้น",
    steps: [
      { name: "หายใจเข้า", duration: 4, type: "inhale" },
      { name: "กลั้นหายใจ", duration: 7, type: "hold" },
      { name: "หายใจออกช้า ๆ", duration: 8, type: "exhale" },
    ]
  },
];

export default function BreathePage() {
  const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TECHNIQUES[0].steps[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const currentStep = selectedTech.steps[currentStepIndex];

  // Reset when technique changes
  const changeTechnique = (tech) => {
    setSelectedTech(tech);
    setIsActive(false);
    setCurrentStepIndex(0);
    setTimeLeft(tech.steps[0].duration);
  };

  const handleToggle = () => {
    if (!isActive) {
      soundManager.playBreathTone("inhale");
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setTimeLeft(selectedTech.steps[0].duration);
  };

  // Timer loop
  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Next step
            const nextIndex = (currentStepIndex + 1) % selectedTech.steps.length;
            const nextStep = selectedTech.steps[nextIndex];
            
            // Cycle count when looped
            if (nextIndex === 0) {
              setCyclesCompleted((c) => c + 1);
            }

            // Sound cue for step
            if (nextStep.type === "inhale") {
              soundManager.playBreathTone("inhale");
            } else if (nextStep.type === "exhale") {
              soundManager.playBreathTone("exhale");
            } else if (nextStep.type === "hold") {
              soundManager.playHealingChime(432);
            }

            setCurrentStepIndex(nextIndex);
            return nextStep.duration;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, selectedTech]);

  // Determine circle scale based on step type
  const getCircleScale = () => {
    if (!isActive) return 1;
    if (currentStep.type === "inhale") return 1.35;
    if (currentStep.type === "hold") return 1.35;
    if (currentStep.type === "exhale") return 0.85;
    return 0.85;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-140px)] flex flex-col items-center justify-between">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#EBF3FA] text-[#204E78] font-medium border border-[#C7DDF2]">
          <Wind size={13} className="text-[#3182CE]" />
          <span>ฝึกหายใจเพื่อผ่อนคลาย</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          ให้ลมหายใจดูแลคุณ
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7A7A] max-w-sm mx-auto">
          สูดลมหายใจตามจังหวะวงกลม ปล่อยให้ความกังวลค่อย ๆ ลอยผ่านไป
        </p>
      </div>

      {/* Technique Switcher Pills */}
      <div className="flex items-center justify-center gap-2 my-4">
        {TECHNIQUES.map((tech) => (
          <button
            key={tech.id}
            onClick={() => changeTechnique(tech)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedTech.id === tech.id
                ? "bg-[#C7DDF2] text-[#1B3E68] shadow-xs"
                : "bg-white/80 text-[#777] border border-[#EFEAE1] hover:bg-white"
            }`}
          >
            {tech.name}
          </button>
        ))}
      </div>

      {/* Animated Breathing Circle */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-6">
        {/* Soft Background Ripples */}
        <motion.div
          animate={{
            scale: isActive ? (currentStep.type === "inhale" || currentStep.type === "hold" ? 1.5 : 1.0) : 1.05,
            opacity: isActive ? 0.35 : 0.15,
          }}
          transition={{
            duration: currentStep.duration,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B8DCC8]/40 to-[#C7DDF2]/40 filter blur-xl"
        />

        {/* Main Breathing Circle */}
        <motion.div
          animate={{
            scale: getCircleScale(),
          }}
          transition={{
            duration: currentStep.duration,
            ease: currentStep.type === "hold" ? "linear" : "easeInOut",
          }}
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#E2F2E9] via-[#EBF3FA] to-[#FAEBEE] border-4 border-white/80 shadow-[0_12px_40px_rgba(184,220,200,0.35)] flex flex-col items-center justify-center text-center p-6 select-none"
        >
          <span className="text-3xl mb-1">
            {currentStep.type === "inhale"
              ? "🌱"
              : currentStep.type === "exhale"
              ? "💨"
              : "🫧"}
          </span>

          <span className="text-lg sm:text-xl font-medium text-[#2F4F4F]">
            {isActive ? currentStep.name : "พร้อมแล้วกดเริ่ม"}
          </span>

          {isActive ? (
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.2, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-light text-[#1F3A3A] mt-1 font-mono"
            >
              {timeLeft}
            </motion.span>
          ) : (
            <span className="text-xs text-[#7A7A7A] mt-2">
              4 วินาที
            </span>
          )}

          {isActive && (
            <span className="text-[11px] text-[#5C7A7A] mt-2 bg-white/60 px-2.5 py-0.5 rounded-full">
              รอบที่ {cyclesCompleted + 1}
            </span>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`px-7 py-3 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2 active:scale-95 ${
              isActive
                ? "bg-[#FAEBEE] text-[#701E2D] hover:bg-[#F5D8DE]"
                : "bg-[#B8DCC8] text-[#1B432E] hover:bg-[#A3CEB5]"
            }`}
          >
            {isActive ? (
              <>
                <Pause size={16} />
                <span>พักการฝึก</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>เริ่มฝึกหายใจ</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="เริ่มใหม่"
            className="p-3 rounded-full bg-white/80 border border-[#EFEAE1] text-[#777] hover:text-[#333] hover:bg-white transition-all shadow-xs active:scale-95"
            aria-label="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {cyclesCompleted >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-[#E2F2E9]/70 border border-[#B8DCC8] rounded-xl p-3 text-xs text-[#245238] space-y-1"
          >
            <p className="font-medium">คุณฝึกไปแล้ว {cyclesCompleted} รอบ เก่งมากเลยนะ 🌱</p>
            <p className="text-[11px] text-[#3D6B50]">
              รู้สึกผ่อนคลายขึ้นไหม? ลองไประบายสิ่งที่อยู่ในใจต่อได้นะ
            </p>
            <div className="pt-1">
              <Link
                href="/release"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1B432E] underline"
              >
                <span>✍️ ไปปล่อยความรู้สึก</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
