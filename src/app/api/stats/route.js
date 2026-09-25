import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const statsFilePath = path.join(process.cwd(), "data", "stats.json");

// In-memory map to track active visitors within the last 45 seconds
const activeVisitorsMap = globalThis.__jaidee_active_visitors || (globalThis.__jaidee_active_visitors = new Map());
const ACTIVE_TIMEOUT_MS = 45 * 1000; // 45 seconds window for live online detection

function getTodayString() {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function readStats() {
  try {
    if (!fs.existsSync(statsFilePath)) {
      const initial = {
        totalVisits: 1,
        dailyVisits: { [getTodayString()]: 1 },
        uniqueVisitorIds: [],
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(statsFilePath, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(statsFilePath, "utf-8");
    const parsed = JSON.parse(content || "{}");
    return parsed;
  } catch (err) {
    console.error("Error reading stats:", err);
    return { totalVisits: 1, dailyVisits: {}, uniqueVisitorIds: [] };
  }
}

function writeStats(data) {
  try {
    fs.writeFileSync(statsFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing stats:", err);
    return false;
  }
}

function getActiveCount() {
  const now = Date.now();
  for (const [key, timestamp] of activeVisitorsMap.entries()) {
    if (now - timestamp > ACTIVE_TIMEOUT_MS) {
      activeVisitorsMap.delete(key);
    }
  }
  return Math.max(1, activeVisitorsMap.size);
}

// GET: Retrieve current real visitor statistics
export async function GET(request) {
  try {
    const stats = readStats();
    const today = getTodayString();
    const todayVisits = stats.dailyVisits?.[today] || 1;
    const uniqueCount = Math.max(1, (stats.uniqueVisitorIds || []).length);
    const activeNow = getActiveCount();

    return NextResponse.json({
      success: true,
      totalVisits: Number(stats.totalVisits) || 1,
      todayVisits: Number(todayVisits) || 1,
      uniqueVisitors: uniqueCount,
      activeNow: activeNow,
      updatedAt: stats.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST: Detect & Record a genuine page visit or live heartbeat
export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // Empty body
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "visitor";
    const visitorId = body.visitorId || clientIp;

    // Record presence in active map
    activeVisitorsMap.set(visitorId, Date.now());

    const stats = readStats();
    const today = getTodayString();

    if (!stats.dailyVisits) stats.dailyVisits = {};
    if (!Array.isArray(stats.uniqueVisitorIds)) stats.uniqueVisitorIds = [];

    const isPingOnly = body.action === "ping" || body.isHeartbeat === true;

    // If it's a real page visit
    if (!isPingOnly) {
      stats.totalVisits = (Number(stats.totalVisits) || 0) + 1;
      stats.dailyVisits[today] = (Number(stats.dailyVisits[today]) || 0) + 1;

      // Unique visitor registration
      if (visitorId && !stats.uniqueVisitorIds.includes(visitorId)) {
        stats.uniqueVisitorIds.push(visitorId);
        if (stats.uniqueVisitorIds.length > 5000) {
          stats.uniqueVisitorIds.shift();
        }
      }

      stats.updatedAt = new Date().toISOString();
      writeStats(stats);
    }

    const todayVisits = stats.dailyVisits[today] || 1;
    const uniqueCount = Math.max(1, stats.uniqueVisitorIds.length);
    const activeNow = getActiveCount();

    return NextResponse.json({
      success: true,
      totalVisits: Number(stats.totalVisits) || 1,
      todayVisits: Number(todayVisits) || 1,
      uniqueVisitors: uniqueCount,
      activeNow: activeNow,
      updatedAt: stats.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
