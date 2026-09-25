"use client";

import { useState, useEffect } from "react";
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
  Send,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import { soundManager } from "@/utils/audio";

const GRADE_LEVELS = [
  "มัธยมศึกษาปีที่ 1 (ม.1)",
  "มัธยมศึกษาปีที่ 2 (ม.2)",
  "มัธยมศึกษาปีที่ 3 (ม.3)",
  "มัธยมศึกษาตอนปลาย (ม.4 - ม.6)",
  "ประถมศึกษาปีที่ 4 (ป.4)",
  "ประถมศึกษาปีที่ 5 (ป.5)",
  "ประถมศึกษาปีที่ 6 (ป.6)",
  "อื่น ๆ"
];

// ==============================================================
// 1. แบบประเมินความเครียด (ST-5) - อิงเอกสารทางการ กรมสุขภาพจิต
// ==============================================================
const QUESTIONS_ST5 = [
  { id: 1, question: "1. มีปัญหาการนอน นอนไม่หลับหรือนอนมาก" },
  { id: 2, question: "2. มีสมาธิน้อยลง" },
  { id: 3, question: "3. หงุดหงิด / กระวนกระวาย / ว้าวุ่นใจ" },
  { id: 4, question: "4. รู้สึกเบื่อ เซ็ง" },
  { id: 5, question: "5. ไม่อยากพบปะผู้คน" },
];

const OPTIONS_ST5 = [
  { label: "เป็นน้อยมากหรือแทบไม่มี", sub: "0 คะแนน", score: 0 },
  { label: "เป็นบางครั้ง", sub: "1 คะแนน", score: 1 },
  { label: "เป็นบ่อยครั้ง", sub: "2 คะแนน", score: 2 },
  { label: "เป็นประจำ", sub: "3 คะแนน", score: 3 },
];

// แปลผลและคำแนะนำ ST-5 อิงตามเอกสารทางการ
const getST5Guidance = (score) => {
  let level = "";
  let range = "";
  let severity = "low";
  let color = "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]";

  if (score <= 4) {
    level = "ความเครียดน้อย";
    range = "0 – 4 คะแนน";
    severity = "low";
    color = "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]";
  } else if (score <= 7) {
    level = "ความเครียดปานกลาง";
    range = "5 – 7 คะแนน";
    severity = "moderate";
    color = "bg-[#FDF7E5] border-[#F7E6B5] text-[#5C4D20]";
  } else if (score <= 9) {
    level = "ความเครียดมาก";
    range = "8 – 9 คะแนน";
    severity = "high";
    color = "bg-[#FAEBEE] border-[#F3D1D8] text-[#701E2D]";
  } else {
    level = "ความเครียดมากที่สุด";
    range = "10 – 15 คะแนน";
    severity = "severe";
    color = "bg-[#F5E6E8] border-[#EAA8B4] text-[#8C1D2F]";
  }

  // คำแนะนำตามเอกสารเป๊ะๆ
  let adviceTitle = "";
  let adviceItems = [];

  if (score <= 7) {
    adviceTitle = "คำแนะนำ คะแนนน้อยถึงปานกลาง (0-7 คะแนน):";
    adviceItems = [
      "1. ออกกำลังกายสม่ำเสมอ",
      "2. นอนหลับพักผ่อนให้เพียงพอ",
      "3. ทำกิจกรรมที่ชอบ เช่น ฟังเพลง ดูหนัง หรือฝึกการหายใจลึกๆ",
    ];
  } else {
    adviceTitle = "คำแนะนำ คะแนนมากถึงมากที่สุด (8-15 คะแนน):";
    adviceItems = [
      "1. พูดคุยระบายความรู้สึกกับคนที่ไว้ใจ",
      "2. หลีกเลี่ยงสารกระตุ้นหรือสิ่งเสพติด",
      "3. โทรปรึกษา สายด่วนสุขภาพจิต 1323 (โทรฟรีตลอด 24 ชั่วโมง) หรือไปพบแพทย์ที่สถานพยาบาลใกล้บ้าน",
    ];
  }

  return { level, range, severity, color, adviceTitle, adviceItems };
};

// ==============================================================
// 2. แบบคัดกรองเบื้องต้น (2Q) - อิงเอกสารทางการ กรมสุขภาพจิต
// ==============================================================
const QUESTIONS_2Q = [
  {
    id: 1,
    question: "1. ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่",
  },
  {
    id: 2,
    question: "2. ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่",
  },
];

// แปลผล 2Q อิงตามเอกสารทางการ
const get2QGuidance = (answers) => {
  const values = Object.values(answers);
  const score = values.filter(Boolean).length;
  if (score === 0) {
    return {
      score,
      scoreText: 'คะแนนรวม 0 คะแนน (ตอบ "ไม่มี" ทั้ง 2 ข้อ)',
      interpretation: "ปกติ ไม่มีความเสี่ยงต่อภาวะซึมเศร้าในขณะนี้",
      hasRisk: false,
      advice: "สุขภาพใจยังคงอยู่ในเกณฑ์ปกติ (หากไม่ถึงเกณฑ์ทำต่อของ 2Q ให้แนะนำผ่านผลของ ST-5)",
    };
  } else {
    return {
      score,
      scoreText: 'คะแนนรวม 1 คะแนนขึ้นไป (ตอบ "มี" ข้อใดข้อหนึ่งหรือทั้ง 2 ข้อ)',
      interpretation: "เป็นผู้มีความเสี่ยงหรือมีแนวโน้มภาวะซึมเศร้า",
      hasRisk: true,
      advice: "ให้ท่านประเมินแนวโน้มเชิงลึกภาวะซึมเศร้าต่อ โดยการทำแบบประเมิน 9Q (9 คำถาม)",
    };
  }
};

// ==============================================================
// 3. แบบสำรวจภาวะซึมเศร้า (9Q) - อิงเอกสารทางการ กรมสุขภาพจิต
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

// แปลผลและคำแนะนำ 9Q อิงตามเอกสารทางการ
const get9QGuidance = (score) => {
  if (score <= 6) {
    return {
      level: "ปกติ",
      range: "0 – 6 คะแนน",
      severity: "normal",
      color: "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]",
      adviceTitle: "คำแนะนำ (0-6 คะแนน: ปกติ):",
      adviceItems: [
        "อารมณ์ของคุณอยู่ในเกณฑ์ปกติ ดูแลสุขภาพใจ พักผ่อนให้เพียงพอ และสังเกตความรู้สึกของตนเองอย่างสม่ำเสมอ",
      ],
    };
  } else if (score <= 12) {
    return {
      level: "มีอาการซึมเศร้าระดับ น้อย",
      range: "7 – 12 คะแนน",
      severity: "mild",
      color: "bg-[#FDF7E5] border-[#F7E6B5] text-[#5C4D20]",
      adviceTitle: "คำแนะนำ ภาวะซึมเศร้าระดับรุนแรงน้อย:",
      adviceItems: [
        "ให้ท่านลองพูดคุยระบายความรู้สึกกับคนที่ท่านสบายใจ",
      ],
    };
  } else if (score <= 18) {
    return {
      level: "มีอาการซึมเศร้าระดับ ปานกลาง",
      range: "13 – 18 คะแนน",
      severity: "moderate",
      color: "bg-[#FAEBEE] border-[#F3D1D8] text-[#701E2D]",
      adviceTitle: "คำแนะนำ ภาวะซึมเศร้าระดับรุนแรงปานกลาง:",
      adviceItems: [
        "ให้ท่านพูดคุยระบายความรู้สึกกับคนที่ท่านสบายใจ การนวด การฟังเพลง การทำสมาธิ",
      ],
    };
  } else {
    return {
      level: "มีอาการซึมเศร้าระดับ มาก",
      range: "≥ 19 คะแนน",
      severity: "severe",
      color: "bg-[#F5E6E8] border-[#EAA8B4] text-[#8C1D2F]",
      adviceTitle: "คำแนะนำ ภาวะซึมเศร้าระดับรุนแรงมาก:",
      adviceItems: [
        "- ให้น้อง พูดคุยระบายความรู้สึกกับคนที่น้องสบายใจ หรือ การนวด การฟังเพลง และ การทำสมาธิ",
        "- หากน้อง ไม่สบายใจอย่างมาก สามารถปรึกษาผู้เชี่ยวชาญ สายด่วนสุขภาพจิต 1323 (โทรฟรีตลอด 24 ชั่วโมง) หรือไปพบแพทย์ที่สถานพยาบาลใกล้บ้าน",
      ],
    };
  }
};

// ==============================================================
// 4. แบบสำรวจ 8Q (ความเสี่ยงต่อตนเอง) - อิงเอกสารทางการ กรมสุขภาพจิต
// ==============================================================
const QUESTIONS_8Q = [
  { 
    id: 1, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "1. คิดอยากตาย หรือ คิดว่าตายไปจะดีกว่า", 
    scoreYes: 1 
  },
  { 
    id: 2, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "2. อยากทำร้ายตัวเอง หรือ ทำให้ตัวเองบาดเจ็บ", 
    scoreYes: 2 
  },
  { 
    id: 3, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "3. คิดเกี่ยวกับการฆ่าตัวตาย", 
    hasSub: true,
    scoreYes: 6,
    subQuestion: "(ถ้าตอบว่าคิดเกี่ยวกับการฆ่าตัวตายให้ถามต่อ) .... ท่านสามารถควบคุมความอยากฆ่าตัวตายที่ท่านคิดอยู่นั้นได้หรือไม่ หรือบอกได้ไหมว่าคงจะไม่ทำตามความคิดนั้นในขณะนี้",
    subOptionCan: { label: "ได้ (0 คะแนน)", score: 0 },
    subOptionCannot: { label: "ไม่ได้ (8 คะแนน)", score: 8 }
  },
  { 
    id: 4, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "4. มีแผนการที่จะฆ่าตัวตาย", 
    scoreYes: 8 
  },
  { 
    id: 5, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "5. ได้เตรียมการที่จะทำร้ายตนเองหรือเตรียมการจะฆ่าตัวตายโดยตั้งใจว่าจะให้ตายจริง ๆ", 
    scoreYes: 9 
  },
  { 
    id: 6, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "6. ได้ทำให้ตนเองบาดเจ็บแต่ไม่ได้ตั้งใจที่จะทำให้เสียชีวิต", 
    scoreYes: 4 
  },
  { 
    id: 7, 
    period: "ในช่วง 1 เดือนที่ผ่านมารวมวันนี้", 
    question: "7. ได้พยายามฆ่าตัวตายโดยคาดหวัง/ตั้งใจที่จะให้ตาย", 
    scoreYes: 10 
  },
  { 
    id: 8, 
    period: "ตลอดชีวิตที่ผ่านมา", 
    question: "8. ตลอดชีวิตที่ผ่านมา ท่านเคยพยายามฆ่าตัวตาย", 
    scoreYes: 4 
  },
];

// แปลผลและคำแนะนำ 8Q อิงตามเอกสารทางการ
const get8QGuidance = (score) => {
  if (score === 0) {
    return {
      level: "ปลอดภัย ไม่มีความเสี่ยง",
      range: "0 คะแนน",
      severity: "none",
      color: "bg-[#E2F2E9] border-[#B8DCC8] text-[#245238]",
      adviceTitle: "คำแนะนำด้านความปลอดภัย (0 คะแนน):",
      adviceItems: [
        "ปลอดภัย ไม่มีความคิดทำร้ายตนเองในขณะนี้ ให้ปฏิบัติตามคำแนะนำของแบบประเมิน 9Q",
      ],
    };
  } else if (score <= 8) {
    return {
      level: "กลุ่มเสี่ยงระดับน้อย (1–8 คะแนน)",
      range: "1 – 8 คะแนน",
      severity: "mild",
      color: "bg-[#FDF7E5] border-[#F7E6B5] text-[#5C4D20]",
      adviceTitle: "คำแนะนำ กลุ่มเสี่ยงระดับน้อย (1–8 คะแนน):",
      adviceItems: [
        "- ให้น้องฝึกผ่อนคลาย ผ่านกิจกรรม เช่น การดูหนัง ฟังเพลง การออกกำลังกาย",
        "- พูดคุยกับคนที่น้องสบายใจคุยด้วย ทั้งคุณครู คนที่บ้าน และเพื่อนๆ",
        "- หลีกเลี่ยงสารเสพติด เครื่องดื่มแอลกอฮอล์ หรือยาที่แพทย์ไม่ได้สั่ง",
      ],
    };
  } else if (score <= 16) {
    return {
      level: "กลุ่มเสี่ยงระดับปานกลาง (9–16 คะแนน)",
      range: "9 – 16 คะแนน",
      severity: "moderate",
      color: "bg-[#FAEBEE] border-[#F3D1D8] text-[#701E2D]",
      adviceTitle: "คำแนะนำ กลุ่มเสี่ยงระดับปานกลาง (9–16 คะแนน):",
      adviceItems: [
        "- ปรึกษาแพทย์ผู้เชี่ยวชาญ เพื่อพูดคุยและรับคำแนะนำที่ถูกต้อง ผ่านสายด่วนสุขภาพจิต 1323 หรือสถานพยาบาลใกล้บ้าน",
        "- ปรึกษาคนใกล้ชิดที่สบายใจ เพื่อช่วยสังเกตน้องและมีคนคอยช่วยรับฟังตลอด",
      ],
    };
  } else {
    return {
      level: "กลุ่มเสี่ยงระดับรุนแรง (≥ 17 คะแนน)",
      range: "≥ 17 คะแนน",
      severity: "severe",
      color: "bg-[#8C1D2F] border-[#6D1221] text-white",
      adviceTitle: "คำแนะนำ กลุ่มเสี่ยงระดับรุนแรง (≥ 17 คะแนน):",
      adviceItems: [
        "- ให้น้องเข้าพบแพทย์ทันที เพื่อการรักษาที่ทันเวลา เป็นสิ่งที่รักษาให้หายขาดได้",
        "- น้องไม่ได้อยู่ตัวคนเดียว ยังมีพี่ๆ ผู้เชี่ยวชาญ แพทย์ทุกท่าน พร้อมให้คำแนะนำ และรับฟังเสมอ",
      ],
    };
  }
};

export default function AssessmentPage() {
  // Stage state: "intro" | "ST5" | "2Q" | "2Q_to_9Q" | "9Q" | "9Q_to_8Q" | "8Q" | "final_result"
  const [stage, setStage] = useState("intro");
  // Flow mode: "full" (ST-5 -> 2Q -> 9Q -> 8Q) | "st5_only" | "depression_only"
  const [flowMode, setFlowMode] = useState("full");
  // Final assessment reached that determines the recommendation displayed
  // "ST5" | "9Q" | "8Q"
  const [finalAssessment, setFinalAssessment] = useState("ST5");

  // Tab mode on Intro: "full" | "st5" | "depression"
  const [introTab, setIntroTab] = useState("full");

  // State ST-5 (แบบประเมินความเครียด 5 ข้อ)
  const [answersST5, setAnswersST5] = useState({});
  const [indexST5, setIndexST5] = useState(0);

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

  // Accordion for viewing full official criteria in result screen
  const [showAllCriteria, setShowAllCriteria] = useState(false);

  // BaiMai Care Follow-up Sync State (สำหรับน้อง ๆ)
  const [careFollowupOpen, setCareFollowupOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[0]);
  const [school, setSchool] = useState("");
  const [contact, setContact] = useState("");
  const [consultTopic, setConsultTopic] = useState("ความเครียดเรื่องเรียน / สุขภาพใจ");
  const [preferredTime, setPreferredTime] = useState("ช่วงหลังเลิกเรียน (16:30 - 19:00 น.)");
  const [consentGiven, setConsentGiven] = useState(false);
  const [submittingFollowup, setSubmittingFollowup] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // URL query parameter support (?mode=st5, ?mode=full, ?mode=depression)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode") || params.get("type");
      if (mode === "st5" || mode === "stress") {
        setIntroTab("st5");
      } else if (mode === "depression" || mode === "2q" || mode === "9q") {
        setIntroTab("depression");
      } else {
        setIntroTab("full");
      }
    }
  }, []);

  // Restart All
  const handleRestart = () => {
    setStage("intro");
    setFlowMode("full");
    setFinalAssessment("ST5");
    setAnswersST5({});
    setIndexST5(0);
    setAnswers2Q({});
    setIndex2Q(0);
    setAnswers9Q({});
    setIndex9Q(0);
    setAnswers8Q({});
    setIndex8Q(0);
    setSubQ3Open(false);
    setCareFollowupOpen(false);
    setSubmittedTicket(null);
  };

  // -------------------------------------------------------------
  // ST-5 Handler (ประเมินความเครียด 5 ข้อ)
  // -------------------------------------------------------------
  const handleSelectST5 = (score) => {
    const updated = { ...answersST5, [indexST5]: score };
    setAnswersST5(updated);
    soundManager.playHealingChime(440 + indexST5 * 35);

    if (indexST5 < QUESTIONS_ST5.length - 1) {
      setIndexST5(indexST5 + 1);
    } else {
      // Finished ST-5!
      if (flowMode === "st5_only") {
        setFinalAssessment("ST5");
        setStage("final_result");
        soundManager.playHealingChime(587.33);
      } else {
        // Core flow: ST-5 followed by 2Q
        setStage("2Q");
        setIndex2Q(0);
        soundManager.playHealingChime(528);
      }
    }
  };

  const totalScoreST5 = Object.values(answersST5).reduce((a, b) => a + b, 0);
  const st5Guidance = getST5Guidance(totalScoreST5);

  // -------------------------------------------------------------
  // 2Q Handler (เช็กอารมณ์ 2 ข้อ)
  // -------------------------------------------------------------
  const handleSelect2Q = (hasSymptom) => {
    const updated = { ...answers2Q, [index2Q]: hasSymptom };
    setAnswers2Q(updated);
    soundManager.playHealingChime(480 + index2Q * 50);

    if (index2Q < QUESTIONS_2Q.length - 1) {
      setIndex2Q(index2Q + 1);
    } else {
      // 2Q completed!
      const hasRisk = Object.values(updated).some((v) => v === true);
      if (!hasRisk) {
        // ไม่ถึงเกณฑ์ทำต่อของ 2Q (ตอบ "ไม่มี" ทั้ง 2 ข้อ = 0 คะแนน)
        // ตามหมายเหตุ: "หาก ไม่ถึงเกณฑ์ทำต่อของ 2Q ให้แนะนำผ่านผลของ ST-5"
        setFinalAssessment("ST5");
        setStage("final_result");
        soundManager.playHealingChime(528);
      } else {
        // ถึงเกณฑ์ 2Q (ตอบ "มี" 1 ข้อขึ้นไป) -> ชวนประเมิน 9Q ต่อ
        setStage("2Q_to_9Q");
        soundManager.playHealingChime(440);
      }
    }
  };

  const q2Guidance = get2QGuidance(answers2Q);

  // -------------------------------------------------------------
  // 9Q Handler (ภาวะซึมเศร้า 9 ข้อ)
  // -------------------------------------------------------------
  const handleSelect9Q = (score) => {
    const updated = { ...answers9Q, [index9Q]: score };
    setAnswers9Q(updated);
    soundManager.playHealingChime(440 + index9Q * 25);

    if (index9Q < QUESTIONS_9Q.length - 1) {
      setIndex9Q(index9Q + 1);
    } else {
      const total9Q = Object.values(updated).reduce((a, b) => a + b, 0);
      const q9HarmScore = updated[8] || 0;
      if (total9Q >= 7 || q9HarmScore > 0) {
        // ถึงเกณฑ์ให้ทำ 8Q ต่อ
        setStage("9Q_to_8Q");
        soundManager.playHealingChime(440);
      } else {
        // 0-6 คะแนน: ปกติ ไม่ถึงเกณฑ์ทำต่อ 8Q -> สิ้นสุดที่ 9Q
        setFinalAssessment("9Q");
        setStage("final_result");
        soundManager.playHealingChime(528);
      }
    }
  };

  const totalScore9Q = Object.values(answers9Q).reduce((a, b) => a + b, 0);
  const q9Guidance = get9QGuidance(totalScore9Q);

  // -------------------------------------------------------------
  // 8Q Handler (ความเสี่ยงต่อตนเอง 8 ข้อ)
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
      // 8Q completed -> สิ้นสุดที่ 8Q
      setFinalAssessment("8Q");
      setStage("final_result");
      soundManager.playHealingChime(528);
    }
  };

  const totalScore8Q = Object.values(answers8Q).reduce((a, b) => a + b, 0);
  const q8Guidance = get8QGuidance(totalScore8Q);

  const hasDoneST5 = Object.keys(answersST5).length > 0;
  const hasDone2Q = Object.keys(answers2Q).length > 0;
  const hasDone9Q = Object.keys(answers9Q).length > 0;
  const hasDone8Q = Object.keys(answers8Q).length > 0;

  // Follow-up caregiver submit
  const handleFollowupSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !contact.trim() || !consentGiven) return;
    setSubmittingFollowup(true);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          grade: gradeLevel,
          school: school.trim(),
          topic: consultTopic.trim(),
          contact: contact.trim(),
          preferredTime,
          consent: consentGiven,
          score9Q: totalScore9Q,
          score8Q: totalScore8Q,
          severity9Q: q9Guidance.severity,
          severity8Q: q8Guidance.severity,
          scoreST5: totalScoreST5,
          severityST5: st5Guidance.severity,
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

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-6">
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
            อิงเกณฑ์มาตรฐาน กรมสุขภาพจิต (ST-5 / 2Q / 9Q / 8Q)
          </span>
        </div>

        {/* Warm title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3A3A3A] tracking-tight">
          ลองเช็กใจกันหน่อย 🌱
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7A7A] max-w-md mx-auto leading-relaxed">
          พื้นที่ปลอดภัยสำหรับหยุดฟังเสียงในใจ สังเกตความตึงเครียด ภาวะอารมณ์ และความปลอดภัยต่อตนเองอย่างอ่อนโยน
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ==============================================================
            STAGE: INTRO
           ============================================================== */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            {/* Tabs for choosing entry path */}
            <div className="flex p-1 rounded-2xl bg-[#F4EFE6] border border-[#E8DFC9] w-full text-xs">
              <button
                type="button"
                onClick={() => setIntroTab("full")}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  introTab === "full"
                    ? "bg-white text-[#245238] shadow-xs font-semibold"
                    : "text-[#666] hover:text-[#222]"
                }`}
              >
                <Sparkles size={13} className={introTab === "full" ? "text-[#2F6B4A]" : "text-[#888]"} />
                <span>ประเมินครบวงจร (ST-5 + 2Q)</span>
              </button>
              <button
                type="button"
                onClick={() => setIntroTab("st5")}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  introTab === "st5"
                    ? "bg-white text-[#245238] shadow-xs font-semibold"
                    : "text-[#666] hover:text-[#222]"
                }`}
              >
                <Zap size={13} className={introTab === "st5" ? "text-[#E08736]" : "text-[#888]"} />
                <span>วัดความเครียด (ST-5)</span>
              </button>
              <button
                type="button"
                onClick={() => setIntroTab("depression")}
                className={`flex-1 py-2 px-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  introTab === "depression"
                    ? "bg-white text-[#245238] shadow-xs font-semibold"
                    : "text-[#666] hover:text-[#222]"
                }`}
              >
                <Heart size={13} className={introTab === "depression" ? "text-[#8C243B]" : "text-[#888]"} />
                <span>สุขภาพใจ (2Q/9Q/8Q)</span>
              </button>
            </div>

            {/* TAB 1: FULL UNIFIED ASSESSMENT (ST-5 + 2Q -> 9Q -> 8Q) */}
            {introTab === "full" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E2F2E9] text-[#1B432E] border border-[#B8DCC8]">
                    <Sparkles size={12} className="text-[#2F6B4A]" />
                    <span>ลำดับขั้นตอนตามแนวทางมาตรฐาน กรมสุขภาพจิต</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2D3748]">
                    การประเมิน 2 แบบหลัก: ST-5 และ 2Q
                  </h2>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                    คุณจะได้สำรวจทั้งความเครียดและอารมณ์ความรู้สึก หากพบสัญญาณความเสี่ยง ระบบจะพาทำแบบประเมินเชิงลึกต่อ และ<strong>คำแนะนำจะแสดงตามผลประเมินชุดสุดท้ายที่คุณทำถึง</strong>
                  </p>
                </div>

                {/* Step Roadmap */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F0ECE1] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FDF7E5] text-[#855B14] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-[#333]">
                        1. แบบประเมินความเครียด (ST-5)
                      </p>
                      <p className="text-[#7A7A7A] text-xs mt-0.5">
                        คำถาม 5 ข้อ สำรวจอาการหรือความรู้สึกตึงเครียดในระยะ ๒ - ๔ สัปดาห์
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F0ECE1] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E2F2E9] text-[#1B432E] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-[#333]">
                        2. แบบคัดกรองเบื้องต้น (2Q)
                      </p>
                      <p className="text-[#7A7A7A] text-xs mt-0.5">
                        คำถาม 2 ข้อ เพื่อสังเกตความรู้สึกเศร้าหรือหมดพลังในรอบ 2 สัปดาห์
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAEBEE] text-[#8C243B] font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                      💡
                    </span>
                    <div className="text-xs text-[#555] leading-relaxed">
                      <p className="font-semibold text-[#333]">
                        หมายเหตุเกณฑ์การประเมินและคำแนะนำ:
                      </p>
                      <p className="mt-0.5">
                        • หาก 2Q ถึงเกณฑ์ จะเริ่มทำ <strong>9Q</strong> ต่อ<br />
                        • หาก 9Q ถึงเกณฑ์ จะทำ <strong>8Q</strong> ต่อ<br />
                        • <strong>คำแนะนำจะขึ้นของผลประเมินสุดท้าย</strong> (หากไม่ถึงเกณฑ์ทำต่อของ 2Q ให้แนะนำผ่านผลของ ST-5)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0ECE1]">
                  <button
                    onClick={() => {
                      setFlowMode("full");
                      setStage("ST5");
                      setIndexST5(0);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>เริ่มทำแบบประเมิน (ST-5 และ 2Q)</span>
                    <ArrowRight size={16} />
                  </button>

                  <span className="text-xs text-[#8A8A8A]">
                    ใช้เวลาประมาณ 1 - 2 นาที
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: ST-5 ONLY */}
            {introTab === "st5" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDF7E5] text-[#5C4D20] border border-[#F7E6B5]">
                    <Zap size={12} className="text-[#E08736]" />
                    <span>แบบประเมินความเครียด (ST-5)</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2D3748]">
                    แบบประเมินความเครียด (ST-5)
                  </h2>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed bg-[#FFFDF8] p-4 rounded-2xl border border-[#F0ECE1]">
                    ความเครียดเกิดขึ้นได้กับทุกคน สาเหตุที่ทำให้เกิดความเครียดมีหลายอย่าง เช่น รายได้ที่ไม่เพียงพอ หนี้สิน ภัยพิบัติต่างๆ ที่ทำให้เกิดความสูญเสีย ความเจ็บป่วย เป็นต้น ความเครียดมีทั้งประโยชน์และโทษ หากมากเกินไปจะเกิดผลเสียต่อร่างกายและจิตใจของท่านได้ ขอให้ท่านลองประเมินตนเองโดยให้คะแนน ๐ - ๓ ที่ตรงกับความรู้สึกของท่าน
                  </p>
                </div>

                {/* Score rating criteria from document */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#333] border-b border-[#F0ECE1] pb-1.5">
                    <span>เกณฑ์การให้คะแนน (0 - 3 คะแนน):</span>
                    <span className="text-[#888] font-normal">ระยะ ๒ - ๔ สัปดาห์</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] text-center">
                      <div className="font-bold text-[#245238]">คะแนน ๐</div>
                      <div className="text-[11px] text-[#555] mt-0.5">เป็นน้อยมากหรือแทบไม่มี</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] text-center">
                      <div className="font-bold text-[#5C4D20]">คะแนน ๑</div>
                      <div className="text-[11px] text-[#555] mt-0.5">เป็นบางครั้ง</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] text-center">
                      <div className="font-bold text-[#B45309]">คะแนน ๒</div>
                      <div className="text-[11px] text-[#555] mt-0.5">เป็นบ่อยครั้ง</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] text-center">
                      <div className="font-bold text-[#DC2626]">คะแนน ๓</div>
                      <div className="text-[11px] text-[#555] mt-0.5">เป็นประจำ</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0ECE1]">
                  <button
                    onClick={() => {
                      setFlowMode("st5_only");
                      setStage("ST5");
                      setIndexST5(0);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>ทำเฉพาะแบบประเมิน ST-5 (5 ข้อ)</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIntroTab("full")}
                    className="text-xs text-[#8A8A8A] hover:text-[#333] underline"
                  >
                    กลับไปทำแบบประเมินครบวงจร
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: DEPRESSION ONLY (2Q / 9Q / 8Q) */}
            {introTab === "depression" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAEBEE] text-[#8C243B] border border-[#F3D1D8]">
                    <Heart size={12} className="text-[#8C243B]" />
                    <span>แบบประเมินสุขภาพใจ (2Q / 9Q / 8Q)</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2D3748]">
                    แบบคัดกรองเบื้องต้นและสำรวจภาวะซึมเศร้า
                  </h2>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                    เริ่มด้วยคำถามสั้น ๆ 2 ข้อ (2Q) หากพบความเสี่ยงจะพาทำ 9Q และ 8Q ต่อตามลำดับ
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0ECE1]">
                  <button
                    onClick={() => {
                      setFlowMode("depression_only");
                      setStage("2Q");
                      setIndex2Q(0);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>เริ่มจากแบบคัดกรอง 2Q</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setFlowMode("depression_only");
                      setStage("9Q");
                      setIndex9Q(0);
                    }}
                    className="text-xs text-[#8A8A8A] hover:text-[#333] underline"
                  >
                    ทำแบบสำรวจ 9Q โดยตรง
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: ST-5 (แบบประเมินความเครียด 5 ข้อ ตามเอกสาร)
           ============================================================== */}
        {stage === "ST5" && (
          <motion.div
            key={`ST5-${indexST5}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
              <span className="font-medium text-[#245238] bg-[#E2F2E9] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap size={12} className="text-[#2F6B4A]" />
                <span>แบบประเมินความเครียด (ST-5)</span>
              </span>
              <span>ข้อ {indexST5 + 1} จาก 5</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#EFEAE1]/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2F6B4A] h-full transition-all duration-300"
                style={{ width: `${((indexST5 + 1) / 5) * 100}%` }}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="inline-block text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFFDF8] border border-[#E8DFC9] text-[#7A7A7A]">
                อาการหรือความรู้สึกที่เกิดในระยะ <strong>๒ - ๔ สัปดาห์</strong>
              </div>
              <h2 className="text-base sm:text-lg font-medium text-[#2D3748] leading-relaxed pt-1">
                {QUESTIONS_ST5[indexST5].question}
              </h2>
            </div>

            {/* 4 Choices from document */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {OPTIONS_ST5.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectST5(opt.score)}
                  className="p-4 rounded-2xl border border-[#EFEAE1] hover:border-[#2F6B4A] hover:bg-[#E2F2E9]/40 text-left transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#333]">{opt.label}</div>
                    <div className="text-[11px] text-[#888]">{opt.sub}</div>
                  </div>
                  <span className="text-xs text-[#2F6B4A] font-mono opacity-0 group-hover:opacity-100">
                    เลือก →
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation back */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1] text-xs">
              {indexST5 > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndexST5(indexST5 - 1)}
                  className="text-[#7A7A7A] hover:text-[#333] flex items-center gap-1 cursor-pointer py-1"
                >
                  <ArrowLeft size={13} />
                  <span>ย้อนกลับข้อก่อนหน้า</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleRestart}
                className="text-[#888] hover:text-[#333] py-1 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 2Q (แบบคัดกรองเบื้องต้น 2 ข้อ)
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
              <span className="font-medium text-[#245238] bg-[#E2F2E9] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Heart size={12} className="text-[#2F6B4A]" />
                <span>แบบคัดกรองเบื้องต้น (2Q)</span>
              </span>
              <span>ข้อ {index2Q + 1} จาก 2</span>
            </div>

            <div className="w-full bg-[#EFEAE1]/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2F6B4A] h-full transition-all duration-300"
                style={{ width: `${((index2Q + 1) / 2) * 100}%` }}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="inline-block text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFFDF8] border border-[#E8DFC9] text-[#7A7A7A]">
                ระยะเวลา: <strong>ในช่วง 2 สัปดาห์ที่ผ่านมารวมวันนี้</strong>
              </div>
              <h2 className="text-base sm:text-lg font-medium text-[#2D3748] leading-relaxed pt-1">
                {QUESTIONS_2Q[index2Q].question}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleSelect2Q(false)}
                className="p-4 rounded-2xl border border-[#EFEAE1] hover:border-[#B8DCC8] hover:bg-[#E2F2E9]/40 text-center font-medium text-sm sm:text-base text-[#4A4A4A] transition-all active:scale-[0.98] cursor-pointer"
              >
                ไม่มี (0 คะแนน)
              </button>
              <button
                onClick={() => handleSelect2Q(true)}
                className="p-4 rounded-2xl border border-[#F3D1D8] hover:border-[#EAA8B4] hover:bg-[#FAEBEE]/60 text-center font-medium text-sm sm:text-base text-[#8C243B] transition-all active:scale-[0.98] cursor-pointer"
              >
                มี (1 คะแนน)
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1] text-xs">
              {index2Q > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex2Q(index2Q - 1)}
                  className="text-[#7A7A7A] hover:text-[#333] flex items-center gap-1 cursor-pointer py-1"
                >
                  <ArrowLeft size={13} />
                  <span>ย้อนกลับข้อก่อนหน้า</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleRestart}
                className="text-[#888] hover:text-[#333] py-1 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 2Q TO 9Q TRANSITIONAL PROMPT (เมื่อ 2Q ถึงเกณฑ์)
           ============================================================== */}
        {stage === "2Q_to_9Q" && (
          <motion.div
            key="2Q_to_9Q"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#F3D1D8] shadow-xs space-y-6"
          >
            <div className="p-6 rounded-2xl bg-[#FAEBEE] border border-[#F3D1D8] text-[#701E2D] space-y-3">
              <div className="flex items-center gap-2 font-semibold text-lg text-[#8C1D2F]">
                <AlertTriangle size={22} />
                <span>ผลการคัดกรองเบื้องต้น (2Q)</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                <p>• <strong>เกณฑ์:</strong> {q2Guidance.scoreText}</p>
                <p>• <strong>แปลผล:</strong> <span className="font-semibold text-[#8C1D2F]">{q2Guidance.interpretation}</span></p>
                <p>• <strong>คำแนะนำตามเอกสาร:</strong> <span className="underline">{q2Guidance.advice}</span></p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
              เพื่อให้เข้าใจระดับความรู้สึกที่กำลังเผชิญอย่างชัดเจนและได้รับคำแนะนำที่ตรงจุด ขอชวนทำแบบสำรวจภาวะซึมเศร้า (9Q) ต่ออีก 9 ข้อสั้น ๆ นะครับ 🌱
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#F0ECE1]">
              <button
                onClick={() => {
                  setStage("9Q");
                  setIndex9Q(0);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>ทำแบบประเมิน 9Q ต่อ</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setFinalAssessment("ST5");
                  setStage("final_result");
                }}
                className="text-xs text-[#8A8A8A] hover:text-[#333] underline"
              >
                ดูคำแนะนำของ ST-5 เท่านี้ก่อน
              </button>
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

            <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1] text-xs">
              {index9Q > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex9Q(index9Q - 1)}
                  className="text-[#7A7A7A] hover:text-[#333] flex items-center gap-1 cursor-pointer py-1"
                >
                  <ArrowLeft size={13} />
                  <span>ย้อนกลับข้อก่อนหน้า</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleRestart}
                className="text-[#888] hover:text-[#333] py-1 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 9Q TO 8Q TRANSITIONAL PROMPT (เมื่อ 9Q ถึงเกณฑ์)
           ============================================================== */}
        {stage === "9Q_to_8Q" && (
          <motion.div
            key="9Q_to_8Q"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#F3D1D8] shadow-xs space-y-6"
          >
            <div className={`p-6 rounded-2xl border ${q9Guidance.color} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  ผลการประเมิน 9Q
                </span>
                <span className="text-base font-bold">
                  {totalScore9Q} / 27 คะแนน
                </span>
              </div>
              <h3 className="text-lg font-bold">
                {q9Guidance.level}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                ตามแนวทางมาตรฐาน เมื่อแบบ 9Q ถึงเกณฑ์ (มีอาการซึมเศร้า หรือมีความคิดอ่อนล้าต่อชีวิต) ขอชวนทำแบบสำรวจ 8Q สั้น ๆ เพื่อดูแลความปลอดภัยของใจและให้คำแนะนำที่โอบกอดคุณอย่างดีที่สุด
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#F0ECE1]">
              <button
                onClick={() => {
                  setStage("8Q");
                  setIndex8Q(0);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>ทำแบบสำรวจ 8Q ต่อ</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setFinalAssessment("9Q");
                  setStage("final_result");
                }}
                className="text-xs text-[#8A8A8A] hover:text-[#333] underline"
              >
                ดูคำแนะนำของ 9Q ทันที
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: 8Q (แบบสำรวจ 8 ข้อ ตามเอกสารทางการ)
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
                <span>แบบสำรวจ 8Q</span>
              </span>
              <span className="text-[#888]">ข้อ {index8Q + 1} จาก 8</span>
            </div>

            <div className="w-full bg-[#EFEAE1]/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C53030] h-full transition-all duration-300"
                style={{ width: `${((index8Q + 1) / 8) * 100}%` }}
              />
            </div>

            <div className="inline-block text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFFDF8] border border-[#E8DFC9] text-[#7A7A7A]">
              ระยะเวลา: <strong>{QUESTIONS_8Q[index8Q].period}</strong>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-[#701E2D] leading-relaxed">
              {QUESTIONS_8Q[index8Q].question}
            </h2>

            {/* Sub Question for Question 3 */}
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
                    ได้ (0 คะแนน)
                  </button>
                  <button
                    onClick={() => handleSubQ3Answer(true)}
                    className="p-3 rounded-xl bg-[#C53030] text-white hover:bg-[#9B1C1C] text-center font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
                  >
                    ไม่ได้ (8 คะแนน)
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSelect8Q(false)}
                  className="p-4 rounded-2xl border border-[#EFEAE1] hover:bg-[#E2F2E9]/40 text-center font-medium text-sm sm:text-base text-[#444] transition-all active:scale-[0.98] cursor-pointer"
                >
                  ไม่มี (0 คะแนน)
                </button>
                <button
                  onClick={() => handleSelect8Q(true)}
                  className="p-4 rounded-2xl border border-[#F3D1D8] bg-[#FAEBEE]/40 hover:bg-[#FAEBEE] text-center font-semibold text-sm sm:text-base text-[#C53030] transition-all active:scale-[0.98] cursor-pointer"
                >
                  มี ({QUESTIONS_8Q[index8Q].scoreYes} คะแนน)
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1] text-xs">
              {index8Q > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex8Q(index8Q - 1)}
                  className="text-[#7A7A7A] hover:text-[#333] flex items-center gap-1 cursor-pointer py-1"
                >
                  <ArrowLeft size={13} />
                  <span>ย้อนกลับข้อก่อนหน้า</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleRestart}
                className="text-[#888] hover:text-[#333] py-1 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            STAGE: FINAL RESULT (แสดงคำแนะนำตามผลประเมินสุดท้ายตามเอกสาร)
           ============================================================== */}
        {stage === "final_result" && (
          <motion.div
            key="final_result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            {/* Header info bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-[#E8DFC9] text-xs">
              <div className="flex items-center gap-2 text-[#555]">
                <Image
                  src="/Seal_of_the_Department_of_Mental_health.svg"
                  alt="กรมสุขภาพจิต"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium text-[#2F6B4A]">
                  ผลการประเมินและคำแนะนำสุขภาพใจ (อิงเอกสารทางการ กรมสุขภาพจิต)
                </span>
              </div>
              <span className="text-[10px] text-[#245238] bg-[#E2F2E9] px-2.5 py-0.5 rounded-full font-medium">
                ปลอดภัย 100%
              </span>
            </div>

            {/* 1. HERO GUIDANCE CARD (คำแนะนำของผลประเมินสุดท้าย ตามหมายเหตุเอกสาร) */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#EFEAE1] shadow-xs space-y-5">
              <div className="flex items-center justify-between text-xs text-[#8A8A8A] border-b border-[#F0ECE1] pb-3">
                <span className="font-semibold text-[#245238] bg-[#E2F2E9] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>
                    ผลประเมินชุดสุดท้าย: {finalAssessment === "ST5" ? "แบบประเมินความเครียด (ST-5)" : finalAssessment === "9Q" ? "แบบสำรวจภาวะซึมเศร้า (9Q)" : "แบบสำรวจความปลอดภัย (8Q)"}
                  </span>
                </span>
                <span className="text-[11px] text-[#7A7A7A]">คำแนะนำอิงตามเอกสาร</span>
              </div>

              {/* CARD FOR FINAL = ST5 */}
              {finalAssessment === "ST5" && (
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl border ${st5Guidance.color} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                        ระดับความเครียด (ST-5)
                      </span>
                      <span className="text-xl sm:text-2xl font-bold">
                        {totalScoreST5} / 15 คะแนน
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {st5Guidance.level} ({st5Guidance.range})
                    </h3>
                  </div>

                  {/* 2Q status note */}
                  {hasDone2Q && (
                    <div className="p-3 rounded-xl bg-[#E2F2E9]/60 border border-[#B8DCC8] text-xs text-[#245238] flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#2F6B4A] shrink-0" />
                      <span>
                        <strong>แบบคัดกรอง 2Q:</strong> {q2Guidance.scoreText} — {q2Guidance.interpretation} (คำแนะนำจึงแสดงผ่านผลของ ST-5 ตามหมายเหตุเอกสาร)
                      </span>
                    </div>
                  )}

                  {/* คำแนะนำตามเอกสารทางการ ST-5 */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-[#2F6B4A] flex items-center gap-1.5">
                      <FileText size={15} />
                      <span>{st5Guidance.adviceTitle}</span>
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm text-[#333] leading-relaxed">
                      {st5Guidance.adviceItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] flex items-start gap-2">
                          <span className="text-[#2F6B4A] font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CARD FOR FINAL = 9Q */}
              {finalAssessment === "9Q" && (
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl border ${q9Guidance.color} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                        ภาวะซึมเศร้า (9Q)
                      </span>
                      <span className="text-xl sm:text-2xl font-bold">
                        {totalScore9Q} / 27 คะแนน
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {q9Guidance.level} ({q9Guidance.range})
                    </h3>
                  </div>

                  {/* คำแนะนำตามเอกสารทางการ 9Q */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-[#701E2D] flex items-center gap-1.5">
                      <FileText size={15} />
                      <span>{q9Guidance.adviceTitle}</span>
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm text-[#333] leading-relaxed">
                      {q9Guidance.adviceItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] flex items-start gap-2">
                          <span className="text-[#8C243B] font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CARD FOR FINAL = 8Q */}
              {finalAssessment === "8Q" && (
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl border ${q8Guidance.color} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                        ความปลอดภัยต่อตนเอง (8Q)
                      </span>
                      <span className="text-xl sm:text-2xl font-bold">
                        {totalScore8Q} คะแนน
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {q8Guidance.level} ({q8Guidance.range})
                    </h3>
                  </div>

                  {/* คำแนะนำตามเอกสารทางการ 8Q */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-[#8C1D2F] flex items-center gap-1.5">
                      <FileText size={15} />
                      <span>{q8Guidance.adviceTitle}</span>
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm text-[#333] leading-relaxed">
                      {q8Guidance.adviceItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#EFEAE1] flex items-start gap-2">
                          <span className="text-[#C53030] font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. OVERVIEW OF ALL ASSESSMENTS COMPLETED */}
            <div className="bg-white/90 rounded-3xl p-6 border border-[#EFEAE1] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#444] flex items-center gap-1.5 uppercase tracking-wider">
                <span>📋</span>
                <span>สรุปผลการประเมินทุกชุดที่คุณทำ:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* ST-5 summary pill */}
                {hasDoneST5 && (
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    finalAssessment === "ST5" ? "ring-2 ring-[#B8DCC8] bg-white font-medium" : "bg-[#FFFDF8] border-[#EFEAE1]"
                  }`}>
                    <div>
                      <div className="text-[#666]">ST-5 (ความเครียด)</div>
                      <div className="font-bold text-[#333] mt-0.5">{st5Guidance.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#245238]">{totalScoreST5} / 15</div>
                      <div className="text-[10px] text-[#888]">{st5Guidance.range}</div>
                    </div>
                  </div>
                )}

                {/* 2Q summary pill */}
                {hasDone2Q && (
                  <div className="p-3.5 rounded-2xl border bg-[#FFFDF8] border-[#EFEAE1] flex items-center justify-between">
                    <div>
                      <div className="text-[#666]">2Q (คัดกรองเบื้องต้น)</div>
                      <div className="font-bold text-[#333] mt-0.5">{q2Guidance.interpretation}</div>
                    </div>
                    <div className="text-right font-bold text-[#245238]">
                      {q2Guidance.score} ข้อ
                    </div>
                  </div>
                )}

                {/* 9Q summary pill */}
                {hasDone9Q && (
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    finalAssessment === "9Q" ? "ring-2 ring-[#F7E6B5] bg-white font-medium" : "bg-[#FFFDF8] border-[#EFEAE1]"
                  }`}>
                    <div>
                      <div className="text-[#666]">9Q (ภาวะซึมเศร้า)</div>
                      <div className="font-bold text-[#333] mt-0.5">{q9Guidance.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#701E2D]">{totalScore9Q} / 27</div>
                      <div className="text-[10px] text-[#888]">{q9Guidance.range}</div>
                    </div>
                  </div>
                )}

                {/* 8Q summary pill */}
                {hasDone8Q && (
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    finalAssessment === "8Q" ? "ring-2 ring-[#F3D1D8] bg-white font-medium" : "bg-[#FFFDF8] border-[#EFEAE1]"
                  }`}>
                    <div>
                      <div className="text-[#666]">8Q (ความเสี่ยงต่อตนเอง)</div>
                      <div className="font-bold text-[#333] mt-0.5">{q8Guidance.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#8C1D2F]">{totalScore8Q} คะแนน</div>
                      <div className="text-[10px] text-[#888]">{q8Guidance.range}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. ACCORDION: OFFICIAL DOCUMENT CRITERIA TABLE */}
            <div className="rounded-3xl border border-[#E8DFC9] bg-[#FFFDF8] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAllCriteria(!showAllCriteria)}
                className="w-full p-4.5 text-left text-xs sm:text-sm font-semibold text-[#444] flex items-center justify-between hover:bg-[#F7EEDD]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#2F6B4A]" />
                  <span>ดูเกณฑ์การแปลผลตามเอกสารทางการทั้งหมด (ST-5, 2Q, 9Q, 8Q)</span>
                </div>
                {showAllCriteria ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showAllCriteria && (
                <div className="p-5 pt-0 space-y-4 border-t border-[#F0ECE1] text-xs">
                  {/* ST-5 Table */}
                  <div className="space-y-1.5 pt-3">
                    <p className="font-bold text-[#245238]">1. เกณฑ์แบบประเมินความเครียด (ST-5):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#245238]">0–4 คะแนน</div>
                        <div className="text-[11px] text-[#666]">น้อย</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#5C4D20]">5–7 คะแนน</div>
                        <div className="text-[11px] text-[#666]">ปานกลาง</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#B45309]">8–9 คะแนน</div>
                        <div className="text-[11px] text-[#666]">มาก</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#DC2626]">10–15 คะแนน</div>
                        <div className="text-[11px] text-[#666]">มากที่สุด</div>
                      </div>
                    </div>
                  </div>

                  {/* 2Q Table */}
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#245238]">2. เกณฑ์แบบคัดกรองเบื้องต้น (2Q):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div className="p-2.5 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#245238]">0 คะแนน (ตอบ &quot;ไม่มี&quot; ทั้ง 2 ข้อ)</div>
                        <div className="text-[11px] text-[#666]">ปกติ ไม่มีความเสี่ยงต่อภาวะซึมเศร้าในขณะนี้</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#8C1D2F]">1 คะแนนขึ้นไป (ตอบ &quot;มี&quot; ข้อใดข้อหนึ่งหรือทั้ง 2 ข้อ)</div>
                        <div className="text-[11px] text-[#666]">เป็นผู้มีความเสี่ยงหรือมีแนวโน้มภาวะซึมเศร้า (ทำ 9Q ต่อ)</div>
                      </div>
                    </div>
                  </div>

                  {/* 9Q Table */}
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#245238]">3. เกณฑ์แบบสำรวจภาวะซึมเศร้า (9Q):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#245238]">0–6 คะแนน</div>
                        <div className="text-[11px] text-[#666]">ปกติ</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#5C4D20]">7–12 คะแนน</div>
                        <div className="text-[11px] text-[#666]">น้อย</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#B45309]">13–18 คะแนน</div>
                        <div className="text-[11px] text-[#666]">ปานกลาง</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#DC2626]">≥ 19 คะแนน</div>
                        <div className="text-[11px] text-[#666]">มาก</div>
                      </div>
                    </div>
                  </div>

                  {/* 8Q Table */}
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#245238]">4. เกณฑ์แบบสำรวจความเสี่ยงต่อตนเอง (8Q):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-center">
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#5C4D20]">1–8 คะแนน</div>
                        <div className="text-[11px] text-[#666]">กลุ่มเสี่ยงระดับน้อย</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#B45309]">9–16 คะแนน</div>
                        <div className="text-[11px] text-[#666]">กลุ่มเสี่ยงระดับปานกลาง</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EFEAE1]">
                        <div className="font-bold text-[#DC2626]">≥ 17 คะแนน</div>
                        <div className="text-[11px] text-[#666]">กลุ่มเสี่ยงระดับรุนแรง</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. RECOMMENDED SELF-CARE ACTIONS */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#666]">สิ่งที่คุณสามารถทำต่อได้ใน jaidee:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  href="/breathe"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#EBF3FA] hover:bg-[#DCE9F7] text-xs font-medium text-[#204E78] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Wind size={15} />
                    <span>ฝึกหายใจผ่อนคลายความตึงเครียด</span>
                  </span>
                  <span>→</span>
                </Link>

                <Link
                  href="/release"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#E2F2E9] hover:bg-[#D0EBDC] text-xs font-medium text-[#1B432E] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Feather size={15} />
                    <span>เขียนระบายเรื่องหนักใจแล้วปล่อยทิ้ง</span>
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* 5. JAIDEE CARE FOLLOWUP (ฝากข้อความให้พี่ ๆ ผู้ดูแลติดต่อกลับ) */}
            {(totalScoreST5 >= 8 || totalScore9Q >= 7 || totalScore8Q >= 1 || careFollowupOpen) && (
              <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-[#F3D1D8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-[#8C1D2F] flex items-center gap-2">
                      <Heart size={16} className="text-[#C53030]" />
                      <span>ฝากข้อความให้พี่ ๆ ผู้ดูแล ใจดี (JaiDee Care) ติดต่อกลับ</span>
                    </h4>
                    <p className="text-xs text-[#7A7A7A]">
                      พื้นที่ปลอดภัยสำหรับเล่าความรู้สึก ข้อมูลนี้จะส่งถึงพี่ ๆ ผู้ดูแลเพื่อช่วยเหลือและอยู่เคียงข้างคุณ (ไม่บังคับ ปลอดภัย 100%)
                    </p>
                  </div>
                </div>

                {submittedTicket ? (
                  <div className="p-5 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] text-[#1B432E] space-y-2 text-center">
                    <CheckCircle2 size={28} className="mx-auto text-[#2F6B4A]" />
                    <h5 className="font-semibold text-sm">ส่งข้อมูลถึงพี่ ๆ เรียบร้อยแล้ว 🌱</h5>
                    <p className="text-xs text-[#2C6244] leading-relaxed">
                      รหัสเคสของคุณคือ: <strong>{submittedTicket}</strong> พี่ ๆ จะติดต่อกลับไปอย่างอบอุ่นตามช่วงเวลาที่คุณสะดวกนะ
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFollowupSubmit} className="space-y-3.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#444]">
                          ชื่อ หรือ ชื่อเล่น <span className="text-[#E53E3E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น น้องใจดี, น้องมิน"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#444]">
                          ระดับชั้น <span className="text-[#E53E3E]">*</span>
                        </label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs text-[#333] focus:outline-none focus:border-[#779988]"
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

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-medium text-[#444]">
                          เบอร์โทร หรือ Line ID สำหรับติดต่อกลับ <span className="text-[#E53E3E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น 08X-XXX-XXXX หรือ Line ID"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#E8DFC9] flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="final-care-consent"
                        required
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-0.5 accent-[#2F6B4A]"
                      />
                      <label htmlFor="final-care-consent" className="text-xs text-[#555] leading-relaxed cursor-pointer select-none">
                        ยินยอมให้ <strong>พี่ ๆ ผู้ดูแล ใจดี (JaiDee Care)</strong> บันทึกผลประเมินและติดต่อกลับอย่างเป็นกันเองและปลอดภัย
                      </label>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={submittingFollowup || !consentGiven}
                        className="px-6 py-2.5 rounded-full bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] font-medium text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Send size={14} />
                        <span>{submittingFollowup ? "กำลังส่ง..." : "ส่งข้อมูลให้พี่ ๆ ดูแลใจ"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 6. BOTTOM ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0ECE1]">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors py-1 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>ทำแบบประเมินอีกครั้ง</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href="tel:1323"
                  className="inline-flex items-center gap-1.5 text-xs text-[#DC2626] font-medium hover:underline"
                >
                  <PhoneCall size={13} />
                  <span>สายด่วนสุขภาพจิต 1323 (โทรฟรี)</span>
                </a>

                <Link
                  href="/"
                  className="px-5 py-2 rounded-full bg-[#E2F2E9] text-[#1B432E] text-xs font-medium hover:bg-[#D0EBDC]"
                >
                  กลับหน้าหลัก
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
