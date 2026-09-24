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
  "msu_counselor_verified_session",
  "msu2026",
  "MSU2026",
  "MSU@Care2026",
  process.env.COUNSELOR_PASSCODE,
].filter(Boolean);

// Check if request is authorized
function isAuthorized(request) {
  const token = request.headers.get("x-counselor-auth");
  return Boolean(token && VALID_AUTH_TOKENS.includes(token));
}

// GET: Retrieve follow-up list (Requires Counselor Authorization)
export async function GET(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ไม่ได้รับอนุญาต: พื้นที่ข้อมูลชั้นความลับ กรุณายืนยันรหัสผ่านอาจารย์/ผู้ให้คำปรึกษา มมส." 
        }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const list = readFollowUps();

    if (studentId) {
      const studentRecords = list.filter((item) => item.studentId === studentId);
      return NextResponse.json({ success: true, data: studentRecords });
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Student assessment submission OR Counselor authentication
export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Counselor Authentication Action
    if (body.action === "login") {
      const { passcode } = body;
      const cleanPass = passcode?.trim();
      const isValid = VALID_AUTH_TOKENS.includes(cleanPass);

      if (isValid) {
        return NextResponse.json({
          success: true,
          token: "msu_counselor_verified_session",
          message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับอาจารย์/ผู้ให้คำปรึกษา มมส.",
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          message: "รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านประจำศูนย์สุขภาวะนิสิต มมส." 
        },
        { status: 401 }
      );
    }

    // 2. Student Follow-up Care Submission
    const {
      studentId,
      name,
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

    if (!studentId || !contact || !consent) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุรหัสนิสิต ข้อมูลติดต่อ และกดยินยอมให้ติดตามอาการ" },
        { status: 400 }
      );
    }

    const list = readFollowUps();
    const ticketId = `MSU-CARE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: ticketId,
      createdAt: new Date().toISOString(),
      studentId: studentId.trim(),
      name: name?.trim() || "ไม่ประสงค์ระบุชื่อ",
      faculty: faculty?.trim() || "ไม่ระบุคณะ",
      contact: contact.trim(),
      email: email?.trim() || "",
      topic: topic?.trim() || "ขอรับคำปรึกษาทั่วไป",
      preferredTime: preferredTime?.trim() || "ทุกช่วงเวลาที่สะดวก",
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
      message: "บันทึกข้อมูลเพื่อการดูแลและติดตามอาการต่อเนื่องสำเร็จ",
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
          message: "ไม่ได้รับอนุญาต: ต้องยืนยันรหัสผ่านอาจารย์/ผู้ให้คำปรึกษา มมส. ก่อนแก้ไขข้อมูล" 
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
        author: counselorName || "เจ้าหน้าที่ศูนย์สุขภาวะ มมส.",
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
