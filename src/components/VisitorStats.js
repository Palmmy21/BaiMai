"use client";

import { useState, useEffect } from "react";
import { Eye, TrendingUp, Sparkles, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function VisitorStats() {
  const [stats, setStats] = useState({
    totalVisits: null,
    todayVisits: null,
    uniqueVisitors: null,
    activeNow: 1,
    loaded: false,
  });

  useEffect(() => {
    let isMounted = true;

    // Persistent anonymous visitor ID stored per browser
    let visitorId = "";
    try {
      visitorId = localStorage.getItem("jaidee_analytics_vid");
      if (!visitorId) {
        visitorId = `u_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
        localStorage.setItem("jaidee_analytics_vid", visitorId);
      }
    } catch {
      visitorId = `u_${Date.now()}`;
    }

    // Function to record visit or ping active presence
    const sendAnalytics = async (action = "visit") => {
      try {
        const res = await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            visitorId,
            path: window.location.pathname,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            setStats({
              totalVisits: data.totalVisits,
              todayVisits: data.todayVisits,
              uniqueVisitors: data.uniqueVisitors,
              activeNow: Math.max(1, data.activeNow || 1),
              loaded: true,
            });
          }
        }
      } catch (e) {
        console.warn("Analytics error:", e);
      }
    };

    // 1. Immediately record real page visit on mount
    sendAnalytics("visit");

    // 2. Periodic heartbeat ping every 20 seconds to maintain real active session
    const pingInterval = setInterval(() => {
      sendAnalytics("ping");
    }, 20000);

    // 3. React to tab visibility (user comes back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendAnalytics("ping");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(pingInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "—";
    return new Intl.NumberFormat("th-TH").format(num);
  };

  return (
    <section className="w-full rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-[#EFEAE1] p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#E2F2E9]/40 via-[#FDF7E5]/30 to-transparent rounded-full filter blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE1] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E2F2E9] text-[#245238] border border-[#B8DCC8]">
                <Activity size={12} className="text-[#2F6B4A]" />
                <span>สถิติการเข้าถึงเว็บ</span>
              </span>
              <span className="text-xs text-[#2E7D32] font-medium flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>ข้อมูลจริงเรียลไทม์ 100%</span>
              </span>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-[#333]">
              ร่วมดูแลใจไปด้วยกัน
            </h3>
            <p className="text-xs text-[#7A7A7A]">
              ตรวจจับการเปิดหน้าเว็บจริง นับจำนวนการเข้าใช้งานจริงแบบสด ๆ ในระบบ
            </p>
          </div>

          {/* Live Online Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF3FA] border border-[#C7DDF2] text-xs font-medium text-[#204E78] shadow-2xs self-start sm:self-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3182CE] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B6CB0]"></span>
            </span>
            <span>ออนไลน์ขณะนี้</span>
            <span className="font-semibold text-[#1A365D] px-2 py-0.5 bg-white rounded-full shadow-2xs">
              {stats.loaded ? stats.activeNow : "1"}
            </span>
            <span>คน</span>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Total Visits */}
          <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#EFEAE1] hover:border-[#B8DCC8] shadow-2xs transition-all flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-[#E2F2E9] text-[#245238] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Eye size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#2A2A2A] tracking-tight">
                {stats.loaded ? formatNumber(stats.totalVisits) : (
                  <span className="animate-pulse text-[#A0A0A0]">...</span>
                )}
              </div>
              <p className="text-xs font-medium text-[#555]">เข้าชมทั้งหมด</p>
              <p className="text-[10px] text-[#8A8A8A]">ครั้งที่เปิดดูหน้าเว็บจริง</p>
            </div>
          </div>

          {/* Card 2: Today Visits */}
          <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#EFEAE1] hover:border-[#F7E6B5] shadow-2xs transition-all flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-[#FDF7E5] text-[#5C4D20] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#2A2A2A] tracking-tight">
                {stats.loaded ? formatNumber(stats.todayVisits) : (
                  <span className="animate-pulse text-[#A0A0A0]">...</span>
                )}
              </div>
              <p className="text-xs font-medium text-[#555]">เข้าชมวันนี้</p>
              <p className="text-[10px] text-[#8A8A8A]">จำนวนครั้งในวันนี้จริง</p>
            </div>
          </div>

          {/* Card 3: Active Presence / Real-time live */}
          <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#EFEAE1] hover:border-[#F3D1D8] shadow-2xs transition-all flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-[#FAEBEE] text-[#632734] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#632734] tracking-tight flex items-center gap-1.5">
                <span>{stats.loaded ? stats.activeNow : "1"}</span>
                <span className="text-xs font-normal text-[#8A8A8A]">เครื่อง</span>
              </div>
              <p className="text-xs font-medium text-[#555]">กำลังเปิดใช้งานสด</p>
              <p className="text-[10px] text-[#2F6B4A]">ตรวจจับจากเบราว์เซอร์จริง 🌱</p>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="flex items-center gap-2 text-[11px] text-[#8A8A8A] pt-1">
          <ShieldCheck size={14} className="text-[#3E8659] shrink-0" />
          <span>
            สถิตินี้บันทึกจากทราฟฟิกจริงทุกครั้งที่มีการเปิดหน้าเว็บ ไม่มีการแต่งตัวเลข และเคารพความเป็นส่วนตัว 100%
          </span>
        </div>
      </div>
    </section>
  );
}
