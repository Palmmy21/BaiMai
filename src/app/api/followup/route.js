import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "followups.json");

// Helper to read data safely
function readFollowUps() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const content = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading follow-up data:", error);
    return [];
  }
}

// Helper to write data safely
function writeFollowUps(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing follow-up data:", error);
    return false;
  }
}

const VALID_AUTH_TOKENS = [
  "baimai_care_session",
  "baimai2026",
  "baimai",
  "baimai@care",
  "msu_counselor_verified_session",
  "msu2026",
  process.env.COUNSELOR_PASSCODE,
].filter(Boolean);

// Check if request is authorized
function isAuthorized(request) {
  const token = request.headers.get("x-counselor-auth");
  return Boolean(token && VALID_AUTH_TOKENS.includes(token));
}

// GET: Retrieve follow-up list (Requires Caregiver Authorization)
export async function GET(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ไม่ได้รับอนุญาต: พื้นที่ข้อมูลชั้นความลับ กรุณายืนยันรหัสผ่านพี่ ๆ ผู้ดูแล BaiMai" 
        }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const list = readFollowUps();

    if (studentId) {
      const studentRecords = list.filter((item) => item.studentId === studentId || item.id === studentId);
      return NextResponse.json({ success: true, data: studentRecords });
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Student assessment submission OR Caregiver authentication
export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Caregiver Authentication Action
    if (body.action === "login") {
      const { passcode } = body;
      const cleanPass = passcode?.trim();
      const isValid = VALID_AUTH_TOKENS.includes(cleanPass);

      if (isValid) {
        return NextResponse.json({
          success: true,
          token: "baimai_care_session",
          message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับพี่ ๆ ผู้ดูแล BaiMai 🌱",
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          message: "รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านพี่ ๆ ผู้ดูแล BaiMai" 
        }, 
        { status: 401 }
      );
    }

    // 2. Middle School Student Follow-up Care Submission
    const {
      studentId,
      name,
      grade,
      school,
      faculty,
      contact,
      email,
      topic,
      preferredTime,
      consent,
      score9Q,
      score8Q,
      severity9Q,
      severity8Q,
      answers2Q,
    } = body;

    const studentIdentifier = studentId?.trim() || name?.trim();
    if (!studentIdentifier || !contact?.trim() || !consent) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อหรือชื่อเล่น ช่องทางติดต่อ และกดยินยอมให้พี่ ๆ ดูแลนะ" },
        { status: 400 }
      );
    }

    const list = readFollowUps();
    const ticketId = `BAIMAI-CARE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: ticketId,
      createdAt: new Date().toISOString(),
      studentId: studentId?.trim() || `STUDENT-${Math.floor(100 + Math.random() * 900)}`,
      name: name?.trim() || "น้องไม่ประสงค์บอกชื่อ",
      grade: grade?.trim() || faculty?.trim() || "มัธยมศึกษาตอนต้น",
      school: school?.trim() || "ไม่ระบุโรงเรียน",
      faculty: grade?.trim() || faculty?.trim() || "มัธยมศึกษาตอนต้น",
      contact: contact.trim(),
      email: email?.trim() || "",
      topic: topic?.trim() || "อยากคุยและปรึกษาความรู้สึกกับพี่ ๆ",
      preferredTime: preferredTime?.trim() || "ช่วงหลังเลิกเรียน 16:00 น. เป็นต้นไป",
      score9Q: score9Q ?? 0,
      score8Q: score8Q ?? 0,
      severity9Q: severity9Q || "normal",
      severity8Q: severity8Q || "none",
      answers2Q: answers2Q || {},
      status: "pending", // pending | contacted | in_counseling | completed
      counselorNotes: [],
      lastFollowUp: null,
    };

    list.unshift(newEntry);
    writeFollowUps(list);

    return NextResponse.json({
      success: true,
      ticketId,
      message: "ส่งข้อมูลถึงพี่ ๆ ผู้ดูแล BaiMai เรียบร้อยแล้วนะ พี่ ๆ จะติดต่อกลับไปอย่างอบอุ่นและปลอดภัยแน่นอน 🌱",
      data: newEntry,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Counselor / Teacher updates follow-up tracking status & notes
export async function PATCH(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ไม่ได้รับอนุญาต: ต้องยืนยันรหัสผ่านพี่ ๆ ผู้ดูแล BaiMai ก่อนแก้ไขข้อมูล" 
        }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, note, counselorName } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ticket id" }, { status: 400 });
    }

    const list = readFollowUps();
    const index = list.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    if (status) list[index].status = status;
    if (note) {
      list[index].counselorNotes.push({
        date: new Date().toISOString(),
        author: counselorName || "พี่ ๆ ผู้ดูแล BaiMai",
        text: note,
      });
      list[index].lastFollowUp = new Date().toISOString();
    }

    writeFollowUps(list);
    return NextResponse.json({ success: true, data: list[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
