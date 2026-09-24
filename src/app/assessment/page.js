"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Feather,
  Wind,
  Sparkles,
  Info,
  Building2,
  Hospital,
  Send,
  Check
} from "lucide-react";
import { soundManager } from "@/utils/audio";

const MSU_FACULTIES = [
  "คณะวิทยาการสารสนเทศ",
  "คณะแพทยศาสตร์",
  "คณะพยาบาลศาสตร์",
  "คณะเภสัชศาสตร์",
  "คณะสาธารณสุขศาสตร์",
  "คณะมนุษยศาสตร์และสังคมศาสตร์",
  "คณะศึกษาศาสตร์",
  "คณะการบัญชีและการจัดการ",
  "คณะการท่องเที่ยวและการโรงแรม",
  "คณะวิทยาศาสตร์",
  "คณะเทคโนโลยี",
  "คณะวิศวกรรมศาสตร์",
  "คณะสถาปัตยกรรมศาสตร์ ผังเมืองและนฤมิตศิลป์",
  "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์",
  "คณะศิลปกรรมศาสตร์และวัฒนธรรมศาสตร์",
  "วิทยาลัยการเมืองการปกครอง",
  "วิทยาลัยดุริยางคศิลป์",
  "คณะนิติศาสตร์",
  "โรงเรียนสาธิตมหาวิทยาลัยมหาสารคาม",
  "อื่น ๆ / บุคคลทั่วไป"
];

// ==============================================================
// 1. แบบคัดกรองเบื้องต้น (2Q) - ภาษาเข้าใจง่าย อบอุ่น เป็นมิตร
// ==============================================================
const QUESTIONS_2Q = [
  {
    id: 1,
    question: "1. ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้ รู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวังบ้างไหม?",
  },
  {
    id: 2,
    question: "2. ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้ รู้สึกเบื่อ ทำอะไรก็ไม่ค่อยเพลิดเพลินเหมือนเคยไหม?",
  },
];

// ==============================================================
// 2. แบบสำรวจภาวะซึมเศร้า (9Q) - ถ้อยคำนุ่มนวล ไม่ตัดสิน
// ==============================================================
const QUESTIONS_9Q = [
  { id: 1, question: "1. เบื่อ ไม่สนใจ ไม่อยากทำอะไร" },
  { id: 2, question: "2. ไม่สบายใจ รู้สึกซึมเศร้า หรือท้อแท้" },
  { id: 3, question: "3. หลับยาก หลับ ๆ ตื่น ๆ หรือนอนมากเกินไป" },
  { id: 4, question: "4. เหนื่อยง่าย ไม่ค่อยมีพลังหรือเรี่ยวแรง" },
  { id: 5, question: "5. เบื่ออาหาร หรือรู้สึกอยากกินมากเกินปกติ" },
  { id: 6, question: "6. รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้คนอื่นผิดหวัง" },
  { id: 7, question: "7. สมาธิไม่ค่อยดีเวลาทำสิ่งต่าง ๆ เช่น ดูคลิป อ่านหนังสือ หรือทำงาน" },
  { id: 8, question: "8. พูดช้า ทำอะไรช้าลงจนคนอื่นสังเกตได้ หรือกระสับกระส่ายจนอยู่ไม่นิ่ง" },
  { id: 9, question: "9. คิดทำร้ายตนเอง หรือคิดว่าไม่อยากอยู่ต่อคงจะดีกว่า", isCritical: true },
];

const OPTIONS_9Q = [
  { label: "ไม่มีเลย", sub: "0 คะแนน", score: 0 },
  { label: "มีบางวัน", sub: "1-7 วัน (1 คะแนน)", score: 1 },
  { label: "มีบ่อยครั้ง", sub: "> 7 วัน (2 คะแนน)", score: 2 },
  { label: "มีแทบทุกวัน", sub: "3 คะแนน", score: 3 },
];

// ==============================================================
// 3. แบบสำรวจความปลอดภัยและดูแลใจตนเอง (8Q)
// * ปรับคำศัพท์: ไม่ใช้คำว่า "ฆ่าตัวตาย" -> ใช้ "ทำร้ายตัวเอง" และ "ความปลอดภัยของตนเอง"
// ==============================================================
const QUESTIONS_8Q = [
  { 
    id: 1, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "1. มีความคิดอยากจากไป หรือคิดว่าถ้าไม่อยู่ตรงนี้คงจะดีกว่า", 
    scoreYes: 1 
  },
  { 
    id: 2, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "2. รู้สึกอยากทำร้ายตัวเอง หรือทำให้ตัวเองบาดเจ็บ", 
    scoreYes: 2 
  },
  { 
    id: 3, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "3. มีความคิดเกี่ยวกับการทำร้ายตัวเองให้ถึงแก่ชีวิต", 
    hasSub: true,
    scoreYes: 6,
    subQuestion: "คุณสามารถควบคุมความคิดที่อยากทำร้ายตัวเองนั้นได้หรือไม่ หรือบอกได้ไหมว่าจะไม่ทำตามความคิดนั้นในตอนนี้",
    subOptionCan: { label: "ควบคุมได้ (0 คะแนน)", score: 0 },
    subOptionCannot: { label: "ควบคุมไม่ได้ (8 คะแนน)", score: 8 }
  },
  { 
    id: 4, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "4. มีแผนการหรือวิธีที่จะทำร้ายตัวเองอยู่ในใจ", 
    scoreYes: 8 
  },
  { 
    id: 5, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "5. ได้เตรียมการที่จะทำร้ายตนเอง โดยตั้งใจจะให้เกิดอันตรายถึงชีวิตจริง ๆ", 
    scoreYes: 9 
  },
  { 
    id: 6, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "6. ได้ทำให้ตนเองบาดเจ็บ แต่ไม่ได้ตั้งใจให้ถึงแก่ชีวิต", 
    scoreYes: 4 
  },
  { 
    id: 7, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "7. ได้พยายามทำร้ายตนเองโดยตั้งใจให้ถึงแก่ชีวิต", 
    scoreYes: 10 
  },
  { 
    id: 8, 
    period: "ตลอดชีวิตที่ผ่านมา", 
    question: "8. ตลอดชีวิตที่ผ่านมา คุณเคยพยายามทำร้ายตนเองมาก่อนหรือไม่", 
    scoreYes: 4 
  },
];

export default function AssessmentPage() {
  const [stage, setStage] = useState("intro");

  // State 2Q
  const [answers2Q, setAnswers2Q] = useState({});
  const [index2Q, setIndex2Q] = useState(0);

  // State 9Q
  const [answers9Q, setAnswers9Q] = useState({});
  const [index9Q, setIndex9Q] = useState(0);

  // State 8Q
  const [answers8Q, setAnswers8Q] = useState({});
  const [index8Q, setIndex8Q] = useState(0);
  const [subQ3Open, setSubQ3Open] = useState(false);

  // MSU Follow-up Sync State
  const [msuFollowupOpen, setMsuFollowupOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [consultTopic, setConsultTopic] = useState("ขอรับคำปรึกษาความเครียด/สุขภาพใจ");
  const [faculty, setFaculty] = useState(MSU_FACULTIES[0]);
  const [contact, setContact] = useState("");
  const [preferredTime, setPreferredTime] = useState("ช่วงหลังเลิกเรียน (16:30 - 19:00 น.)");
  const [consentGiven, setConsentGiven] = useState(false);
  const [submittingFollowup, setSubmittingFollowup] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Restart All
  const handleRestart = () => {
    setStage("intro");
    setAnswers2Q({});
    setIndex2Q(0);
    setAnswers9Q({});
    setIndex9Q(0);
    setAnswers8Q({});
    setIndex8Q(0);
    setSubQ3Open(false);
    setMsuFollowupOpen(false);
    setSubmittedTicket(null);
  };

  // Submit follow-up care sync to university counselors
  const handleFollowupSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim() || !contact.trim() || !consentGiven) return;
    setSubmittingFollowup(true);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          name: studentName.trim(),
          email: studentEmail.trim(),
          topic: consultTopic.trim(),
          faculty,
          contact: contact.trim(),
          preferredTime,
          consent: consentGiven,
          score9Q: totalScore9Q,
          score8Q: totalScore8Q,
          severity9Q: result9Q.severity,
          severity8Q: result8Q.severity,
          answers2Q,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedTicket(data.ticketId);
        soundManager.playHealingChime(528);
      }
    } catch (e) {
      console.error("Follow-up submit error:", e);
    } finally {
      setSubmittingFollowup(false);
    }
  };

  // -------------------------------------------------------------
  // 2Q Handler
  // -------------------------------------------------------------
  const handleSelect2Q = (hasSymptom) => {
    const updated = { ...answers2Q, [index2Q]: hasSymptom };
    setAnswers2Q(updated);
    soundManager.playHealingChime(480 + index2Q * 50);

    if (index2Q < QUESTIONS_2Q.length - 1) {
      setIndex2Q(index2Q + 1);
    } else {
      setStage("2Q_result");
    }
  };

  const is2QHasRisk = Object.values(answers2Q).some((v) => v === true);

  // -------------------------------------------------------------
  // 9Q Handler
  // -------------------------------------------------------------
  const handleSelect9Q = (score) => {
    const updated = { ...answers9Q, [index9Q]: score };
    setAnswers9Q(updated);
    soundManager.playHealingChime(440 + index9Q * 25);

    if (index9Q < QUESTIONS_9Q.length - 1) {
      setIndex9Q(index9Q + 1);
    } else {
      const total9Q = Object.values(updated).reduce((a, b) => a + b, 0);
      if (total9Q >= 7) {
        // คะแนน 9Q >= 7 ชวนประเมิน 8Q เพื่อดูแลความปลอดภัย
        setStage("8Q");
        setIndex8Q(0);
      } else {
        setStage("summary");
      }
    }
  };

  const totalScore9Q = Object.values(answers9Q).reduce((a, b) => a + b, 0);

  // คำแนะนำอย่างเป็นทางการตามแนวทางเวชปฏิบัติ กรมสุขภาพจิต (9Q)
  const get9QInterpretation = (score) => {
    if (score < 7) {
      return {
        level: "ไม่มีอาการของโรคซึมเศร้า หรือมีอาการน้อยมาก (ปกติ)",
        range: "น้อยกว่า 7 คะแนน",
        severity: "normal",
        color: "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]",
        desc: "อารมณ์ของคุณช่วงนี้ยังอยู่ในเกณฑ์ที่จัดการได้ดี ให้เวลากับสิ่งเล็ก ๆ ที่ทำให้มีความสุขต่อไปนะ 🌱",
        clinicalAdvice: "ดูแลสุขภาวะทางใจตนเองตามปกติ พักผ่อนให้เพียงพอ ทำกิจกรรมผ่อนคลายความเครียด และออกกำลังกายสม่ำเสมอ",
        actionPlan: "แนะนำประเมินซ้ำทุก 6 เดือน หรือเมื่อมีเหตุการณ์หรือความตึงเครียดกระทบจิตใจ",
        followUpTimeline: "ประเมินซ้ำตามรอบปกติ (6 เดือน)",
      };
    } else if (score <= 12) {
      return {
        level: "มีอาการของโรคซึมเศร้า ระดับน้อย (Mild)",
        range: "7 - 12 คะแนน",
        severity: "mild",
        color: "bg-[#FDF7E5] border-[#F7E6B5] text-[#5C4D20]",
        desc: "คุณอาจมีความเหนื่อยล้าหรือเรื่องกวนใจสะสมอยู่ ลองหาเวลาพักผ่อน ระบายความรู้สึกออกมา หรือฝึกหายใจช้า ๆ ดูนะ",
        clinicalAdvice: "แนะนำการให้คำปรึกษาเบื้องต้น (Supportive Counseling) การจัดการอารมณ์ และสุขศึกษาการนอนหลับและการคลายเครียด",
        actionPlan: "ควรได้รับการดูแลและติดตามประเมินซ้ำด้วยแบบ 9Q ภายใน 2 สัปดาห์ หากคะแนนยังไม่ลดลง ควรปรึกษานักจิตวิทยาหรืออาจารย์ที่ปรึกษา",
        followUpTimeline: "นัดติดตามอาการซ้ำภายใน 2 สัปดาห์",
      };
    } else if (score <= 18) {
      return {
        level: "มีอาการของโรคซึมเศร้า ระดับปานกลาง (Moderate)",
        range: "13 - 18 คะแนน",
        severity: "moderate",
        color: "bg-[#FAEBEE] border-[#F3D1D8] text-[#701E2D]",
        desc: "ความรู้สึกในใจกำลังส่งผลกระทบต่อการใช้ชีวิต คุณไม่จำเป็นต้องทนรับไว้คนเดียว การพูดคุยกับผู้เชี่ยวชาญจะช่วยให้เบาสบายขึ้นมากนะ",
        clinicalAdvice: "จำเป็นต้องประเมินแบบ 8Q เพื่อสำรวจความปลอดภัยต่อตนเอง และควรได้รับคำปรึกษาเชิงลึกจากนักจิตวิทยา/อาจารย์ที่ปรึกษา หรือแพทย์ เพื่อพิจารณาการบำบัดรักษาทางจิตใจ",
        actionPlan: "แนะนำติดต่อศูนย์สุขภาวะนิสิต มมส. หรือ รพ.สุทธาเวช เพื่อรับการดูแลและติดตามอาการอย่างใกล้ชิด",
        followUpTimeline: "นัดติดตามอาการทุก 1 - 2 สัปดาห์",
      };
    } else {
      return {
        level: "มีอาการของโรคซึมเศร้า ระดับรุนแรง (Severe)",
        range: "19 คะแนนขึ้นไป",
        severity: "severe",
        color: "bg-[#F5E6E8] border-[#EAA8B4] text-[#8C1D2F]",
        desc: "ใจของคุณกำลังเหนื่อยล้ามากจริง ๆ กอดใจตัวเองแน่น ๆ นะ มีคนที่พร้อมรับฟังและอยากอยู่เคียงข้างคุณเสมอ 🤍",
        clinicalAdvice: "ต้องประเมินแบบ 8Q ทันที และจำเป็นต้องส่งต่อพบแพทย์/จิตแพทย์ โรงพยาบาล เพื่อรับการตรวจวินิจฉัยและวางแผนรักษาทางการแพทย์อย่างปลอดภัย",
        actionPlan: "ประสานส่งต่อพบแพทย์ รพ.สุทธาเวช คณะแพทยศาสตร์ มมส. หรือโรงพยาบาลใกล้เคียงอย่างเร่งด่วน โดยมีผู้ดูแลใกล้ชิด",
        followUpTimeline: "ส่งต่อรับการรักษาทันที / ติดตามอาการใกล้ชิด",
      };
    }
  };

  // -------------------------------------------------------------
  // 8Q Handler (ดูแลความปลอดภัย ไม่ทำร้ายตัวเอง)
  // -------------------------------------------------------------
  const handleSelect8Q = (isYes) => {
    const q = QUESTIONS_8Q[index8Q];
    if (q.id === 3 && isYes) {
      setSubQ3Open(true);
      return;
    }
    const score = isYes ? q.scoreYes : 0;
    saveAndNext8Q(score);
  };

  const handleSubQ3Answer = (cannotControl) => {
    const score = cannotControl ? 6 + 8 : 6;
    setSubQ3Open(false);
    saveAndNext8Q(score);
  };

  const saveAndNext8Q = (score) => {
    const updated = { ...answers8Q, [index8Q]: score };
    setAnswers8Q(updated);
    soundManager.playHealingChime(420 + index8Q * 30);

    if (index8Q < QUESTIONS_8Q.length - 1) {
      setIndex8Q(index8Q + 1);
    } else {
      setStage("summary");
    }
  };

  const totalScore8Q = Object.values(answers8Q).reduce((a, b) => a + b, 0);

  // คำแนะนำอย่างเป็นทางการตามแนวทางเวชปฏิบัติ กรมสุขภาพจิต (8Q)
  const get8QInterpretation = (score) => {
    if (score === 0) {
      return {
        level: "ปลอดภัย ไม่มีแนวโน้มทำร้ายตัวเองในปัจจุบัน",
        range: "0 คะแนน",
        severity: "none",
        color: "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]",
        isUrgent: false,
        clinicalAdvice: "ดูแลสุขภาวะทางใจตามระดับคะแนนของแบบ 9Q อย่างต่อเนื่อง",
        actionPlan: "สังเกตความรู้สึกของตนเอง และสามารถกลับมาประเมินซ้ำได้เมื่อเผชิญสถานการณ์ตึงเครียด",
      };
    } else if (score <= 8) {
      return {
        level: "มีแนวโน้มที่จะทำร้ายตัวเอง ระดับน้อย (Mild)",
        range: "1 - 8 คะแนน",
        severity: "mild",
        color: "bg-[#FDF7E5] border-[#F7E6B5] text-[#5C4D20]",
        isUrgent: false,
        clinicalAdvice: "สร้างสัมพันธภาพ ให้กำลังใจ รับฟังด้วยความเข้าอกเข้าใจโดยไม่ตัดสิน เฝ้าระวังไม่ให้เกิดปัจจัยกระตุ้นความเครียด",
        actionPlan: "แนะนำให้คนใกล้ชิด/อาจารย์ที่ปรึกษาช่วยรับฟังดูแล และติดตามประเมินซ้ำใน 1-2 สัปดาห์",
      };
    } else if (score <= 16) {
      return {
        level: "มีแนวโน้มที่จะทำร้ายตัวเอง ระดับปานกลาง (Moderate) ⚠️",
        range: "9 - 16 คะแนน",
        severity: "moderate",
        color: "bg-[#FAEBEE] border-[#F3D1D8] text-[#701E2D]",
        isUrgent: true,
        clinicalAdvice: "ต้องเฝ้าระวังอย่างใกล้ชิด คัดกรองและเก็บสิ่งของที่อาจเกิดอันตรายรอบตัว ไม่ควรอยู่คนเดียวตามลำพัง",
        actionPlan: "ประสานศูนย์สุขภาวะนิสิต มมส. หรืออาจารย์ที่ปรึกษาเพื่อจัดหาผู้ดูแล และนัดพบแพทย์/นักจิตวิทยาเพื่อวางแผนดูแลความปลอดภัยอย่างต่อเนื่อง",
      };
    } else {
      return {
        level: "มีความเสี่ยงต่อการทำร้ายตัวเอง ระดับที่ต้องการการดูแลด่วน (Severe) 🚨",
        range: "17 คะแนนขึ้นไป",
        severity: "severe",
        color: "bg-[#8C1D2F] border-[#6D1221] text-white",
        isUrgent: true,
        clinicalAdvice: "ภาวะฉุกเฉินทางสุขภาพจิต (Medical Emergency) ต้องได้รับการดูแลคุ้มครองความปลอดภัยทันที ห้ามปล่อยให้อยู่คนเดียวเด็ดขาด",
        actionPlan: "นำส่งห้องฉุกเฉิน รพ.สุทธาเวช คณะแพทยศาสตร์ มมส. (โทร 043-021-021) หรือโทร 1669 / สายด่วน 1323 ทันทีตลอด 24 ชั่วโมง",
      };
    }
  };

  const result9Q = get9QInterpretation(totalScore9Q);
  const result8Q = get8QInterpretation(totalScore8Q);
  const hasDone9Q = Object.keys(answers9Q).length > 0;
  const hasDone8Q = Object.keys(answers8Q).length > 0;
  const isUrgent = result8Q.isUrgent || result9Q.severity === "severe";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 min-h-[calc(100vh-140px)] flex flex-col items-center justify-center">
      {/* ==============================================================
          MINIMAL HEADER WITH REFINED LOGO BADGE
         ============================================================== */}
      <div className="text-center space-y-3 mb-6 w-full flex flex-col items-center">
        {/* Subtle, elegant Ministry Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-white/90 border border-[#E8DFC9] shadow-2xs text-[#4A4A4A] backdrop-blur-xs">
          <Image
            src="/Seal_of_the_Department_of_Mental_health.svg"
            alt="ตราสัญลักษณ์กรมสุขภาพจิต"
            width={20}
            height={20}
            className="w-4.5 h-4.5 object-contain"
            priority
          />
          <span className="font-medium text-[#2F6B4A]">
            อิงเกณฑ์มาตรฐาน กรมสุขภาพจิต (2Q / 9Q / 8Q)
          </span>
        </div>

        {/* Warm title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          ลองเช็กใจกันหน่อย 🌱
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7A7A] max-w-md mx-auto leading-relaxed">
          พื้นที่ปลอดภัยสำหรับหยุดฟังเสียงในใจ สังเกตความเหนื่อยล้า ภาวะซึมเศร้า และความปลอดภัยต่อตนเองอย่างอ่อนโยน
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ==============================================================
            STAGE: INTRO (Clean, Minimal, Non-Intimidating)
           ============================================================== */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-[#333] flex items-center gap-2">
                <span>3 ขั้นตอนในการสังเกตใจตนเอง:</span>
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F0ECE1] flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E2F2E9] text-[#1B432E] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                    🌱
                  </span>
                  <div>
                    <p className="font-medium text-[#333]">
                      1. เช็กความรู้สึกเบื้องต้น (2Q)
                    </p>
                    <p className="text-[#888] text-xs mt-0.5 leading-relaxed">
                      คำถามสั้น ๆ 2 ข้อ เพื่อสังเกตความรู้สึกเศร้าหรือหมดพลังในรอบ 2 สัปดาห์
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F0ECE1] flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FDF7E5] text-[#5C4D20] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                    🌼
                  </span>
                  <div>
                    <p className="font-medium text-[#333]">
                      2. สำรวจภาวะซึมเศร้า (9Q)
                    </p>
                    <p className="text-[#888] text-xs mt-0.5 leading-relaxed">
                      หากมีความเหนื่อยล้าสะสม จะช่วยให้เข้าใจระดับความตึงเครียดที่กำลังเผชิญ
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F0ECE1] flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAEBEE] text-[#701E2D] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                    🤍
                  </span>
                  <div>
                    <p className="font-medium text-[#333]">
                      3. ดูแลความปลอดภัยของใจ (8Q)
                    </p>
                    <p className="text-[#888] text-xs mt-0.5 leading-relaxed">
                      สำรวจความรู้สึกอยากทำร้ายตัวเอง เพื่อให้ได้รับการช่วยเหลือและโอบกอดอย่างทันท่วงที
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ข้อแนะนำก่อนเริ่มทำแบบประเมิน */}
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-2">
              <h3 className="font-semibold text-xs sm:text-sm text-[#3A3A3A] flex items-center gap-1.5">
                <span>💡</span>
                <span>ข้อแนะนำก่อนเริ่มทำแบบประเมิน:</span>
              </h3>
              <ul className="text-xs text-[#666] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#88C09E] mt-0.5 font-bold">•</span>
                  <span>ตอบตามความรู้สึกจริงของคุณในช่วง <strong>2 สัปดาห์ที่ผ่านมา</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#88C09E] mt-0.5 font-bold">•</span>
                  <span><strong>ไม่มีคำตอบที่ถูกหรือผิด</strong> ทุกความรู้สึกของคุณมีความสำคัญ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#88C09E] mt-0.5 font-bold">•</span>
                  <span>ข้อมูลทั้งหมดทำงานในเบราว์เซอร์ของคุณอย่างปลอดภัย <strong>100%</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0ECE1]">
              <button
                onClick={() => setStage("2Q")}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>เริ่มเช็กใจตัวเอง</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setStage("9Q");
                  setIndex9Q(0);
                }}
                className="text-xs text-[#8A8A8A] hover:text-[#333] underline"
              >
                ทำแบบสำรวจ 9Q โดยตรง
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 2Q (2 คำถามเบื้องต้น)
           ============================================================== */}
        {stage === "2Q" && (
          <motion.div
            key={`2Q-${index2Q}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
              <span className="font-medium text-[#245238] bg-[#E2F2E9] px-2.5 py-0.5 rounded-full">
                เช็กใจเบื้องต้น (2Q)
              </span>
              <span>ข้อ {index2Q + 1} จาก 2</span>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-[#2D3748] leading-relaxed pt-2">
              {QUESTIONS_2Q[index2Q].question}
            </h2>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => handleSelect2Q(false)}
                className="p-4 rounded-2xl border border-[#EFEAE1] hover:border-[#B8DCC8] hover:bg-[#E2F2E9]/40 text-center font-medium text-sm sm:text-base text-[#4A4A4A] transition-all active:scale-[0.98] cursor-pointer"
              >
                ไม่มี
              </button>
              <button
                onClick={() => handleSelect2Q(true)}
                className="p-4 rounded-2xl border border-[#F3D1D8] hover:border-[#EAA8B4] hover:bg-[#FAEBEE]/60 text-center font-medium text-sm sm:text-base text-[#8C243B] transition-all active:scale-[0.98] cursor-pointer"
              >
                มี
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 2Q RESULT
           ============================================================== */}
        {stage === "2Q_result" && (
          <motion.div
            key="2Q_result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            <div className="text-xs text-[#8A8A8A] font-semibold uppercase tracking-wider">
              ผลการคัดกรองเบื้องต้น (2Q)
            </div>

            {!is2QHasRisk ? (
              <div className="p-6 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] text-[#245238] space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <CheckCircle2 size={22} />
                  <span>สุขภาพใจยังคงสดใสดี 🌱</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-[#2C6244]">
                  จากการสังเกตเบื้องต้น ไม่พบสัญญาณของภาวะซึมเศร้า ใจของคุณยังคงมีสมดุลที่ดี
                </p>
                <p className="text-xs text-[#3E7D5A]">
                  อย่าลืมใจดีกับตัวเอง และคอยสังเกตความรู้สึกของตัวเองเรื่อย ๆ นะ
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#FAEBEE] border border-[#F3D1D8] text-[#701E2D] space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-lg text-[#8C1D2F]">
                  <AlertTriangle size={22} />
                  <span>พบความเหนื่อยล้าหรือมีความรู้สึกเศร้าสะสม</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-[#8C1D2F]">
                  คุณอาจกำลังเผชิญกับเรื่องที่ทำให้รู้สึกหนักอึ้งในใจ ชวนมาทำความเข้าใจระดับความรู้สึกนี้เพิ่มเติมกันนะ
                </p>
                <div className="p-2.5 bg-white/80 rounded-xl border border-[#EAA8B4] text-xs font-medium text-[#8C1D2F] inline-block">
                  👉 แนะนำให้ทำแบบประเมิน 9Q ต่อเพื่อเข้าใจตัวเองชัดเจนขึ้น
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#EFEAE1]">
              {is2QHasRisk ? (
                <button
                  onClick={() => {
                    setStage("9Q");
                    setIndex9Q(0);
                  }}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>ทำแบบสำรวจ 9Q ต่อ</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-between">
                  <Link
                    href="/"
                    className="px-6 py-2.5 rounded-full bg-[#B8DCC8] text-[#1B432E] text-xs sm:text-sm font-medium hover:bg-[#A3CEB5]"
                  >
                    กลับหน้าหลัก
                  </Link>

                  <button
                    onClick={() => {
                      setStage("9Q");
                      setIndex9Q(0);
                    }}
                    className="text-xs text-[#7A7A7A] hover:text-[#333] underline"
                  >
                    ต้องการสำรวจต่อด้วยแบบ 9Q
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 9Q (แบบสำรวจ 9 ข้อ)
           ============================================================== */}
        {stage === "9Q" && (
          <motion.div
            key={`9Q-${index9Q}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
              <span className="font-medium text-[#701E2D] bg-[#FAEBEE] px-2.5 py-0.5 rounded-full">
                สำรวจภาวะซึมเศร้า (9Q)
              </span>
              <span>ข้อ {index9Q + 1} จาก 9</span>
            </div>

            {/* Subtle progress bar */}
            <div className="w-full bg-[#EFEAE1]/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D97706] h-full transition-all duration-300"
                style={{ width: `${((index9Q + 1) / 9) * 100}%` }}
              />
            </div>

            <div className="space-y-1 pt-1">
              <p className="text-xs text-[#8A8A8A]">
                ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้ คุณมีความรู้สึกเหล่านี้บ่อยแค่ไหน?
              </p>
              <h2 className="text-base sm:text-lg font-medium text-[#2D3748] leading-relaxed">
                {QUESTIONS_9Q[index9Q].question}
              </h2>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {OPTIONS_9Q.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect9Q(opt.score)}
                  className="p-3.5 rounded-2xl border border-[#EFEAE1] hover:border-[#D97706] hover:bg-[#FDF7E5]/50 text-left transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#333]">{opt.label}</div>
                    <div className="text-[11px] text-[#888]">{opt.sub}</div>
                  </div>
                  <span className="text-xs text-[#D97706] font-mono opacity-0 group-hover:opacity-100">
                    เลือก →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 8Q (สำรวจการดูแลความปลอดภัย ไม่ทำร้ายตัวเอง)
           ============================================================== */}
        {stage === "8Q" && (
          <motion.div
            key={`8Q-${index8Q}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#F3D1D8] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#8C1D2F] bg-[#FAEBEE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Heart size={13} className="text-[#C53030]" />
                <span>สำรวจความปลอดภัยและดูแลใจตนเอง (8Q)</span>
              </span>
              <span className="text-[#888]">ข้อ {index8Q + 1} จาก 8</span>
            </div>

            <div className="inline-block text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFFDF8] border border-[#E8DFC9] text-[#7A7A7A]">
              ระยะเวลา: <strong>{QUESTIONS_8Q[index8Q].period}</strong>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-[#701E2D] leading-relaxed">
              {QUESTIONS_8Q[index8Q].question}
            </h2>

            {/* Sub Question modal for Question 3 */}
            {subQ3Open ? (
              <div className="p-4 rounded-2xl bg-[#FAEBEE] border border-[#EAA8B4] space-y-3 animate-in fade-in duration-200">
                <p className="text-xs sm:text-sm font-medium text-[#701E2D] leading-relaxed">
                  {QUESTIONS_8Q[2].subQuestion}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleSubQ3Answer(false)}
                    className="p-3 rounded-xl bg-white border border-[#EFEAE1] hover:border-[#B8DCC8] hover:bg-[#E2F2E9]/50 text-center font-medium text-xs sm:text-sm text-[#444] cursor-pointer"
                  >
                    ควบคุมได้ (0 คะแนน)
                  </button>
                  <button
                    onClick={() => handleSubQ3Answer(true)}
                    className="p-3 rounded-xl bg-[#C53030] text-white hover:bg-[#9B1C1C] text-center font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
                  >
                    ควบคุมไม่ได้ (8 คะแนน)
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSelect8Q(false)}
                  className="p-4 rounded-2xl border border-[#EFEAE1] hover:bg-[#E2F2E9]/40 text-center font-medium text-sm sm:text-base text-[#444] transition-all active:scale-[0.98] cursor-pointer"
                >
                  ไม่มี
                </button>
                <button
                  onClick={() => handleSelect8Q(true)}
                  className="p-4 rounded-2xl border border-[#F3D1D8] bg-[#FAEBEE]/40 hover:bg-[#FAEBEE] text-center font-semibold text-sm sm:text-base text-[#C53030] transition-all active:scale-[0.98] cursor-pointer"
                >
                  มี
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: SUMMARY (Minimal, Compassionate, Safe)
           ============================================================== */}
        {stage === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            {/* 1. URGENT CALLOUT (Empathetic, Caring, Clear Hotline) */}
            {hasDone8Q && totalScore8Q >= 17 && (
              <div className="bg-[#FFF5F5] border-2 border-[#E53E3E] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#E53E3E] text-white shrink-0 mt-0.5">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg text-[#9B1C1C]">
                      ใจของคุณกำลังส่งสัญญาณเตือนอย่างมาก เราอยู่ตรงนี้นะ 🤍
                    </h3>
                    <p className="text-xs sm:text-sm text-[#742A2A] leading-relaxed">
                      ตามเกณฑ์มาตรฐาน ท่านมีความเสี่ยงต่อการทำร้ายตัวเองในระดับที่ต้องการการดูแลอย่างใกล้ชิด คุณไม่ต้องแบกรับเรื่องนี้คนเดียว กรุณาติดต่อคนใกล้ชิด หรือให้ผู้เชี่ยวชาญ/แพทย์คอยรับฟังและดูแลคุณอย่างปลอดภัยทันที
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href="tel:1323"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#E53E3E] hover:bg-[#C53030] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                  >
                    <PhoneCall size={16} />
                    <span>โทรสายด่วนสุขภาพจิต 1323 (โทรฟรี 24 ชม.)</span>
                  </a>
                  <a
                    href="tel:021136789"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#2D3748] hover:bg-[#1A202C] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                  >
                    <PhoneCall size={16} />
                    <span>โทรสะมาริตันส์ 02-113-6789</span>
                  </a>
                </div>
              </div>
            )}

            {/* Subtle Seal Header */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-[#E8DFC9] text-xs">
              <div className="flex items-center gap-2 text-[#555]">
                <Image
                  src="/Seal_of_the_Department_of_Mental_health.svg"
                  alt="กรมสุขภาพจิต"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
                <span>สรุปผลการสำรวจสุขภาพใจ (เกณฑ์มาตรฐาน กรมสุขภาพจิต)</span>
              </div>
              <span className="text-[10px] text-[#245238] bg-[#E2F2E9] px-2 py-0.5 rounded-full font-medium">
                ปลอดภัย 100%
              </span>
            </div>

            {/* 2. 9Q Evaluation Summary */}
            {hasDone9Q && (
              <div className={`rounded-3xl p-6 border shadow-xs space-y-4 ${result9Q.color}`}>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-xs font-semibold">
                    ระดับภาวะซึมเศร้า (9Q)
                  </span>
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/80 border border-black/5">
                    คะแนน: {totalScore9Q} ({result9Q.range})
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold">
                    {result9Q.level}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    {result9Q.desc}
                  </p>
                </div>

                {/* Official DMH Clinical Recommendation Box */}
                <div className="p-3.5 rounded-2xl bg-white/70 border border-black/5 space-y-2 text-xs">
                  <div className="font-semibold flex items-center gap-1.5 opacity-90">
                    <span>📋</span>
                    <span>คำแนะนำและแนวทางปฏิบัติ (อิงเกณฑ์กรมสุขภาพจิต):</span>
                  </div>
                  <div className="space-y-1 leading-relaxed opacity-90">
                    <p>• <strong>คำแนะนำ:</strong> {result9Q.clinicalAdvice}</p>
                    <p>• <strong>สิ่งที่ควรทำ:</strong> {result9Q.actionPlan}</p>
                    <p>• <strong>การนัดติดตามอาการ:</strong> <span className="font-medium underline">{result9Q.followUpTimeline}</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 8Q Evaluation Summary (ความเสี่ยงต่อการทำร้ายตนเอง) */}
            {hasDone8Q && (
              <div className={`rounded-3xl p-6 border shadow-xs space-y-4 ${result8Q.color}`}>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-xs font-semibold">
                    ความปลอดภัยต่อตนเอง (8Q)
                  </span>
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/80 border border-black/5 text-[#333]">
                    คะแนน: {totalScore8Q} ({result8Q.range})
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold">
                    {result8Q.level}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    {result8Q.isUrgent
                      ? "อย่าลังเลที่จะขอความช่วยเหลือ มีคนที่พร้อมรับฟังคุณอยู่เสมอ 🤍"
                      : "ขอให้คุณโอบกอดและใจดีกับตัวเองในทุก ๆ วันนะ 🌱"}
                  </p>
                </div>

                {/* Official DMH Safety Guidance Box */}
                <div className="p-3.5 rounded-2xl bg-white/80 border border-black/5 space-y-2 text-xs text-[#333]">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>แนวทางการดูแลความปลอดภัยและการส่งต่อ (กรมสุขภาพจิต):</span>
                  </div>
                  <div className="space-y-1 leading-relaxed text-[#555]">
                    <p>• <strong>การดูแล:</strong> {result8Q.clinicalAdvice}</p>
                    <p>• <strong>ข้อปฏิบัติ:</strong> {result8Q.actionPlan}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                MSU STUDENT CARE: USER DECISION & FOLLOW-UP SYNC
                (อิงข้อแนะนำอาจารย์ มหาวิทยาลัยมหาสารคาม MSU)
               ============================================================== */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-[#B8DCC8] shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E2F2E9] text-[#1B432E]">
                    <Building2 size={12} />
                    <span>มหาวิทยาลัยมหาสารคาม (MSU Care Sync)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#333]">
                    ช่องทางการเข้าถึงและซิงก์ข้อมูลดูแลต่อเนื่อง (มมส.)
                  </h3>
                  <p className="text-xs text-[#7A7A7A] leading-relaxed">
                    คุณสามารถ <strong>ตัดสินใจได้ด้วยตนเอง</strong> ว่าต้องการซิงก์ผลประเมินเพื่อให้นักจิตวิทยา/อาจารย์ที่ปรึกษาจากศูนย์สุขภาวะนิสิต มมส. หรือ รพ.สุทธาเวช ติดต่อกลับเพื่อติดตามอาการหรือไม่
                  </p>
                </div>
              </div>

              {/* Constraint Clarification Notice (ข้อจำกัดการเก็บข้อมูลผู้เข้าใช้ เพื่อติดตามอาการต่อไปได้) */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E2F2E9] text-[#1B432E] shrink-0 mt-0.5">
                  <Info size={16} />
                </div>
                <div className="space-y-1 text-xs text-[#666]">
                  <p className="font-semibold text-[#333]">
                    💡 ข้อชี้แจงข้อจำกัดและการเก็บข้อมูล (ตามข้อแนะนำอาจารย์ มมส.):
                  </p>
                  <p className="leading-relaxed">
                    • <strong>การระบายความรู้สึก (ปล่อยความรู้สึก):</strong> เป็น Zero-Data 100% สลายหายไปทันที ไม่มีการบันทึกใด ๆ<br />
                    • <strong>การติดตามอาการสุขภาพจิต (Follow-up Care):</strong> จะจัดเก็บข้อมูล <u>เฉพาะเมื่อท่านยินยอม</u> โดยเก็บรหัสนิสิตและคะแนนประเมินลงในระบบ เพื่อให้อาจารย์ที่ปรึกษาและศูนย์สุขภาวะนิสิต มมส. สามารถนำไป <strong>ติดตามอาการซ้ำและบันทึกความคืบหน้าการดูแล</strong> ต่อไปได้อย่างปลอดภัย
                  </p>
                </div>
              </div>

              {submittedTicket ? (
                /* Success Feedback */
                <div className="p-5 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] text-[#1B432E] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <CheckCircle2 size={20} className="text-[#2F6B4A]" />
                    <span>ซิงก์ข้อมูลและบันทึกเพื่อการติดตามอาการเรียบร้อยแล้ว</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#2C6244]">
                    รหัสเคสติดตามอาการของคุณคือ: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-[#B8DCC8] text-sm">{submittedTicket}</strong>
                    <br />อาจารย์ที่ปรึกษาและเจ้าหน้าที่ศูนย์สุขภาวะนิสิต กองกิจการนิสิต มมส. จะติดต่อกลับตามช่องทางที่คุณระบุอย่างเป็นความลับและปลอดภัย
                  </p>
                  
                  {/* MSU Contacts */}
                  <div className="pt-2 border-t border-[#B8DCC8]/60 text-xs space-y-1">
                    <p className="font-semibold text-[#1B432E]">ช่องทางติดต่อโดยตรงของมหาวิทยาลัยมหาสารคาม:</p>
                    <p>• <strong>ศูนย์สุขภาวะนิสิต กองกิจการนิสิต มมส.</strong>: อาคารพัฒนานิสิต (โทร 043-754388 หรือสายตรง มมส.)</p>
                    <p>• <strong>โรงพยาบาลสุทธาเวช คณะแพทยศาสตร์ มมส.</strong>: แผนกจิตเวช/ฉุกเฉิน (โทร 043-021-021)</p>
                  </div>
                </div>
              ) : !msuFollowupOpen ? (
                /* Choice Buttons (User Decisions) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Choice 1: Request MSU Follow-up */}
                  <button
                    onClick={() => setMsuFollowupOpen(true)}
                    className="p-4 rounded-2xl border-2 border-[#B8DCC8] bg-[#F7FCF9] hover:bg-[#E2F2E9] text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1B432E]">
                      <Hospital size={16} />
                      <span>ขอรับการติดตามอาการจาก มมส. (แนะนำ)</span>
                    </div>
                    <p className="text-[11px] text-[#666] mt-1 leading-relaxed">
                      ยินยอมให้ศูนย์สุขภาวะนิสิต มมส. หรือ รพ.สุทธาเวช ติดต่อกลับเพื่อคอยรับฟัง ให้คำปรึกษา และดูแลต่อเนื่อง
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#2F6B4A] font-medium mt-2 group-hover:translate-x-1 transition-transform">
                      <span>กรอกข้อมูลเพื่อซิงก์ผล</span>
                      <span>→</span>
                    </span>
                  </button>

                  {/* Choice 2: Keep 100% Private */}
                  <div className="p-4 rounded-2xl border border-[#EFEAE1] bg-[#FFFDF8] text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#555]">
                      <ShieldAlert size={16} className="text-[#88C09E]" />
                      <span>รักษาความเป็นส่วนตัว (ไม่ส่งต่อ)</span>
                    </div>
                    <p className="text-[11px] text-[#888] mt-1 leading-relaxed">
                      ผลการประเมินนี้จะอยู่เฉพาะในเบราว์เซอร์ของคุณ ไม่มีการส่งข้อมูลใด ๆ ออกจากเครื่อง สามารถใช้ฟีเจอร์ผ่อนคลายใน BaiMai ได้อย่างสบายใจ
                    </p>
                  </div>
                </div>
              ) : (
                /* Form for MSU Student Follow-up Care */
                <form onSubmit={handleFollowupSubmit} className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        รหัสนิสิต มมส. <span className="text-[#E53E3E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น 650112XXXXX"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        ชื่อ หรือ ชื่อเล่น (ระบุหรือไม่ก็ได้)
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น ใบไม้ หรือ ไม่ระบุชื่อ"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        คณะที่สังกัดใน มมส. <span className="text-[#E53E3E]">*</span>
                      </label>
                      <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs text-[#333] focus:outline-none focus:border-[#779988]"
                      >
                        {MSU_FACULTIES.map((fac, i) => (
                          <option key={i} value={fac}>{fac}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        เบอร์โทร หรือ Line ID สำหรับติดต่อกลับ <span className="text-[#E53E3E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น 08X-XXX-XXXX หรือ Line: student_msu"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        อีเมลนิสิต (ทางเลือก)
                      </label>
                      <input
                        type="email"
                        placeholder="เช่น 650112xxxxx@msu.ac.th"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#444]">
                        เรื่องที่ต้องการปรึกษา
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น เรื่องเรียน, ความเครียด, สุขภาพจิต"
                        value={consultTopic}
                        onChange={(e) => setConsultTopic(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#444]">
                      ช่วงเวลาที่สะดวกให้เจ้าหน้าที่ติดต่อกลับ
                    </label>
                    <input
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="เช่น ช่วงหลังเลิกเรียน 16:30 น. หรือ วันเสาร์-อาทิตย์"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#E8DFC9] flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="msu-consent"
                      required
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 accent-[#2F6B4A]"
                    />
                    <label htmlFor="msu-consent" className="text-xs text-[#555] leading-relaxed cursor-pointer select-none">
                      ข้าพเจ้ายินยอมให้ศูนย์สุขภาวะนิสิต กองกิจการนิสิต มหาวิทยาลัยมหาสารคาม และ/หรือ โรงพยาบาลสุทธาเวช คณะแพทยศาสตร์ บันทึกผลประเมินและติดต่อกลับเพื่อ <strong>ติดตามอาการและให้การดูแลอย่างต่อเนื่อง</strong>
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setMsuFollowupOpen(false)}
                      className="text-xs text-[#888] hover:text-[#444] px-2 py-1"
                    >
                      ยกเลิก
                    </button>

                    <button
                      type="submit"
                      disabled={submittingFollowup || !consentGiven}
                      className="px-6 py-2.5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>{submittingFollowup ? "กำลังส่งข้อมูล..." : "ยินยอมส่งต่อข้อมูลเพื่อติดตามอาการ"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Actions in BaiMai */}
            <div className="bg-white/90 rounded-3xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
              <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider">
                สิ่งที่คุณสามารถทำต่อได้ใน BaiMai:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <Link
                  href="/release"
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#E2F2E9] hover:bg-[#D0EBDC] text-xs font-medium text-[#1B432E] transition-all"
                >
                  <Feather size={14} />
                  <span>🍃 ปล่อยความรู้สึก</span>
                </Link>

                <Link
                  href="/breathe"
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#EBF3FA] hover:bg-[#DCE9F7] text-xs font-medium text-[#204E78] transition-all"
                >
                  <Wind size={14} />
                  <span>🌬️ ฝึกหายใจผ่อนคลาย</span>
                </Link>

                <Link
                  href="/help"
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#FAEBEE] hover:bg-[#F5D8DE] text-xs font-medium text-[#8C243B] transition-all"
                >
                  <PhoneCall size={14} />
                  <span>☎ ขอคำปรึกษา / สายด่วน</span>
                </Link>
              </div>
            </div>

            {/* Restart Button */}
            <div className="text-center pt-2">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors py-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>สำรวจใจอีกครั้ง</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
