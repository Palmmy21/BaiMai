import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/utils/supabase";

const dataFilePath = path.join(process.cwd(), "data", "followups.json");

// Helper to read data safely from local file
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

// Helper to write data safely to local file
function writeFollowUps(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing follow-up data:", error);
    return false;
  }
}

// Helper to map Supabase snake_case row to app camelCase model
function mapFromSupabase(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    grade: row.grade,
    school: row.school,
    contact: row.contact,
    topic: row.topic,
    preferredTime: row.preferred_time,
    score9Q: row.score_9q,
    score8Q: row.score_8q,
    severity9Q: row.severity_9q,
    severity8Q: row.severity_8q,
    answers2Q: row.answers_2q || {},
    status: row.status || "pending",
    counselorNotes: row.counselor_notes || [],
    lastFollowUp: row.last_follow_up,
  };
}

// Security: Fixed caregiver passcode & secure session token
const FIXED_COUNSELOR_PASSCODE = (process.env.COUNSELOR_PASSCODE || "baimai2026").trim();
const SECURE_SESSION_TOKEN = "jaidee_care_session_secure";
const VALID_AUTH_TOKENS = [SECURE_SESSION_TOKEN, "baimai_care_session_secure", FIXED_COUNSELOR_PASSCODE];

// In-memory brute-force rate limiter for caregiver login (persists across Next.js reloads)
const failedLoginMap = globalThis.__jaidee_failed_logins || (globalThis.__jaidee_failed_logins = new Map());
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

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
          message: "ไม่ได้รับอนุญาต: พื้นที่ข้อมูลชั้นความลับ กรุณายืนยันรหัสผ่านพี่ ๆ ผู้ดูแล ใจดี (JaiDee Care)" 
        }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // 1. Try querying Supabase
    if (supabase) {
      try {
        let query = supabase.from("followups").select("*").order("created_at", { ascending: false });
        if (studentId) {
          query = query.or(`id.eq.${studentId},name.ilike.%${studentId}%`);
        }
        const { data, error } = await query;
        if (!error && data) {
          return NextResponse.json({ success: true, data: data.map(mapFromSupabase), source: "supabase" });
        }
        if (error) {
          console.warn("Supabase query warning:", error.message);
        }
      } catch (err) {
        console.error("Supabase GET error, falling back to local file:", err);
      }
    }

    // 2. Fallback to local file
    const list = readFollowUps();
    if (studentId) {
      const studentRecords = list.filter((item) => item.studentId === studentId || item.id === studentId);
      return NextResponse.json({ success: true, data: studentRecords, source: "local" });
    }

    return NextResponse.json({ success: true, data: list, source: "local" });
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
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "client-ip";

      const now = Date.now();
      const clientRecord = failedLoginMap.get(clientIp);

      // Check if locked out
      if (clientRecord && clientRecord.lockUntil > now) {
        const remainingSec = Math.ceil((clientRecord.lockUntil - now) / 1000);
        return NextResponse.json(
          {
            success: false,
            message: `ใส่รหัสผ่านผิดเกินกำหนด ระบบถูกระงับชั่วคราวเพื่อความปลอดภัย กรุณารออีก ${remainingSec} วินาที`,
            isLocked: true,
            cooldownSeconds: remainingSec,
          },
          { status: 429 }
        );
      }

      const { passcode } = body;
      const cleanPass = passcode?.trim();
      const isMatch = Boolean(cleanPass && cleanPass === FIXED_COUNSELOR_PASSCODE);

      if (isMatch) {
        // Reset failed attempts on success
        failedLoginMap.delete(clientIp);
        return NextResponse.json({
          success: true,
          token: SECURE_SESSION_TOKEN,
          message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับพี่ ๆ ผู้ดูแล ใจดี (JaiDee Care) 🌱",
        });
      }

      // Record failed attempt
      let prevAttempts = 0;
      if (clientRecord) {
        if (clientRecord.lockUntil > 0 && clientRecord.lockUntil <= now) {
          prevAttempts = 0; // Lockout expired, reset counter
        } else {
          prevAttempts = clientRecord.count || 0;
        }
      }
      const newAttempts = prevAttempts + 1;
      const willLock = newAttempts >= MAX_FAILED_ATTEMPTS;
      const lockUntil = willLock ? now + LOCKOUT_DURATION_MS : 0;

      failedLoginMap.set(clientIp, { count: newAttempts, lockUntil });

      const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - newAttempts);
      const message = willLock
        ? `คุณใส่รหัสผ่านผิดติดต่อกันครบ ${MAX_FAILED_ATTEMPTS} ครั้งแล้ว ระบบถูกระงับชั่วคราว 60 วินาทีเพื่อความปลอดภัย`
        : remainingAttempts > 0
          ? `รหัสผ่านไม่ถูกต้อง (หากลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ JaiDee Care — เหลือโอกาสอีก ${remainingAttempts} ครั้ง)`
          : `รหัสผ่านไม่ถูกต้อง ระบบกำลังระงับการเข้าสู่ระบบชั่วคราว`;

      return NextResponse.json(
        {
          success: false,
          message,
          isLocked: willLock,
          cooldownSeconds: willLock ? 60 : 0,
          remainingAttempts,
        },
        { status: willLock ? 429 : 401 }
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
      scoreST5,
      severityST5,
    } = body;

    const studentIdentifier = studentId?.trim() || name?.trim();
    if (!studentIdentifier || !contact?.trim() || !consent) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อหรือชื่อเล่น ช่องทางติดต่อ และกดยินยอมให้พี่ ๆ ดูแลนะ" },
        { status: 400 }
      );
    }

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
      score9Q: Number(score9Q ?? 0),
      score8Q: Number(score8Q ?? 0),
      severity9Q: severity9Q || "normal",
      severity8Q: severity8Q || "none",
      scoreST5: scoreST5 !== undefined ? Number(scoreST5) : null,
      severityST5: severityST5 || null,
      answers2Q: answers2Q || {},
      status: "pending", // pending | contacted | in_counseling | completed
      counselorNotes: [],
      lastFollowUp: null,
    };

    // 2.1 Insert into Supabase
    if (supabase) {
      try {
        const { error: sbError } = await supabase.from("followups").insert({
          id: ticketId,
          name: newEntry.name,
          grade: newEntry.grade,
          school: newEntry.school,
          contact: newEntry.contact,
          topic: newEntry.topic,
          preferred_time: newEntry.preferredTime,
          score_9q: newEntry.score9Q,
          score_8q: newEntry.score8Q,
          severity_9q: newEntry.severity9Q,
          severity_8q: newEntry.severity8Q,
          answers_2q: newEntry.answers2Q,
          status: "pending",
          counselor_notes: [],
        });
        if (sbError) {
          console.warn("Supabase insert warning:", sbError.message);
        }
      } catch (err) {
        console.error("Supabase insert exception:", err);
      }
    }

    // 2.2 Always update local file for backup/offline redundancy
    const list = readFollowUps();
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

// PATCH: Counselor updates follow-up tracking status & notes
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

    // 1. Try updating in Supabase
    if (supabase) {
      try {
        const { data: currentRows } = await supabase.from("followups").select("*").eq("id", id).limit(1);
        if (currentRows && currentRows.length > 0) {
          const row = currentRows[0];
          const updatedNotes = Array.isArray(row.counselor_notes) ? [...row.counselor_notes] : [];
          if (note) {
            updatedNotes.push({
              date: new Date().toISOString(),
              author: counselorName || "พี่ ๆ ผู้ดูแล ใจดี",
              text: note,
            });
          }
          const updatePayload = {
            ...(status ? { status } : {}),
            ...(note ? { counselor_notes: updatedNotes, last_follow_up: new Date().toISOString() } : {}),
          };
          const { data: updatedData, error: updateError } = await supabase
            .from("followups")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

          if (!updateError && updatedData) {
            // Also sync local
            const list = readFollowUps();
            const idx = list.findIndex((item) => item.id === id);
            if (idx !== -1) {
              if (status) list[idx].status = status;
              if (note) {
                list[idx].counselorNotes.push({
                  date: new Date().toISOString(),
                  author: counselorName || "พี่ ๆ ผู้ดูแล ใจดี",
                  text: note,
                });
                list[idx].lastFollowUp = new Date().toISOString();
              }
              writeFollowUps(list);
            }
            return NextResponse.json({ success: true, data: mapFromSupabase(updatedData), source: "supabase" });
          }
        }
      } catch (err) {
        console.error("Supabase PATCH error, falling back to local file:", err);
      }
    }

    // 2. Fallback local update
    const list = readFollowUps();
    const index = list.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    if (status) list[index].status = status;
    if (note) {
      list[index].counselorNotes.push({
        date: new Date().toISOString(),
        author: counselorName || "พี่ ๆ ผู้ดูแล ใจดี",
        text: note,
      });
      list[index].lastFollowUp = new Date().toISOString();
    }

    writeFollowUps(list);
    return NextResponse.json({ success: true, data: list[index], source: "local" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Delete a follow-up case (Requires Caregiver Authorization)
export async function DELETE(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ไม่ได้รับอนุญาต: ต้องยืนยันรหัสผ่านพี่ ๆ ผู้ดูแล ใจดี (JaiDee Care) ก่อนลบข้อมูล" 
        }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ticket id" }, { status: 400 });
    }

    // 1. Delete from Supabase
    if (supabase) {
      try {
        const { error: sbError } = await supabase.from("followups").delete().eq("id", id);
        if (sbError) {
          console.warn("Supabase delete warning:", sbError.message);
        }
      } catch (err) {
        console.error("Supabase DELETE exception:", err);
      }
    }

    // 2. Delete from local backup file
    const list = readFollowUps();
    const filteredList = list.filter((item) => item.id !== id);
    writeFollowUps(filteredList);

    return NextResponse.json({
      success: true,
      message: `ลบเคส ${id} เรียบร้อยแล้ว`,
      deletedId: id,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

