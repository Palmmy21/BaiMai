"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  Search, 
  Filter, 
  PhoneCall, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  MessageSquarePlus, 
  FileText,
  Hospital,
  Building2,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Trash2
} from "lucide-react";

export default function CounselorPortalPage() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [counselorName, setCounselorName] = useState("พี่ ๆ ผู้ดูแล ใจดี");
  const [updating, setUpdating] = useState(false);

  // Authentication State
  const [authToken, setAuthToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Check saved session and active lockouts on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("jaidee_care_auth") || sessionStorage.getItem("baimai_care_auth");
      if (saved) {
        setAuthToken(saved);
        setIsAuthenticated(true);
        fetchFollowups(saved);
      }
      const lockUntil = Number(
        sessionStorage.getItem("jaidee_care_lockout_until") || 
        sessionStorage.getItem("baimai_care_lockout_until") || 
        0
      );
      const now = Date.now();
      if (lockUntil > now) {
        setCooldown(Math.ceil((lockUntil - now) / 1000));
      }
    }
    setCheckingAuth(false);
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("jaidee_care_lockout_until");
            sessionStorage.removeItem("baimai_care_lockout_until");
          }
          setAuthError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Fetch follow-ups with Authorization header
  const fetchFollowups = async (tokenOverride) => {
    const token = tokenOverride || authToken;
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/followup", {
        headers: { "x-counselor-auth": token }
      });
      const data = await res.json();
      if (res.status === 401) {
        handleLogout();
        setAuthError("เซสชันหมดอายุ กรุณาใส่รหัสผ่านใหม่อีกครั้ง");
        return;
      }
      if (data.success) {
        setFollowups(data.data || []);
      }
    } catch (e) {
      console.error("Error fetching follow-ups:", e);
    } finally {
      setLoading(false);
    }
  };

  // Login handler with brute-force defense
  const handleLogin = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || !passcode.trim()) return;
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", passcode: passcode.trim() }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("jaidee_care_auth", data.token);
          sessionStorage.setItem("baimai_care_auth", data.token);
          sessionStorage.removeItem("jaidee_care_lockout_until");
          sessionStorage.removeItem("baimai_care_lockout_until");
        }
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPasscode("");
        setFailedAttempts(0);
        setCooldown(0);
        fetchFollowups(data.token);
      } else {
        setPasscode(""); // Clear passcode for security
        if (data.isLocked && data.cooldownSeconds) {
          const lockUntil = Date.now() + data.cooldownSeconds * 1000;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("jaidee_care_lockout_until", lockUntil.toString());
            sessionStorage.setItem("baimai_care_lockout_until", lockUntil.toString());
          }
          setCooldown(data.cooldownSeconds);
          setAuthError(data.message || `ใส่รหัสผ่านผิดเกินกำหนด กรุณารอ ${data.cooldownSeconds} วินาที`);
        } else {
          setFailedAttempts((prev) => prev + 1);
          setAuthError(data.message || "รหัสผ่านไม่ถูกต้อง (หากลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ JaiDee Care)");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jaidee_care_auth");
      sessionStorage.removeItem("baimai_care_auth");
      sessionStorage.removeItem("msu_counselor_auth");
    }
    setAuthToken("");
    setIsAuthenticated(false);
    setFollowups([]);
    setSelectedCase(null);
    setAuthError("");
  };

  // Update status or add note with Authorization header
  const handleUpdateStatus = async (id, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/followup", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-counselor-auth": authToken
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (data.success) {
        fetchFollowups(authToken);
        if (selectedCase?.id === id) {
          setSelectedCase(data.data);
        }
      }
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedCase) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/followup", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-counselor-auth": authToken
        },
        body: JSON.stringify({
          id: selectedCase.id,
          note: noteText.trim(),
          counselorName: counselorName.trim(),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (data.success) {
        setNoteText("");
        setSelectedCase(data.data);
        fetchFollowups(authToken);
      }
    } catch (e) {
      console.error("Error adding note:", e);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCase = async (id) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลเคส "${id}"?\n(เมื่อลบแล้วข้อมูลจะถูกลบออกจากฐานข้อมูลอย่างถาวร)`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/followup?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-counselor-auth": authToken,
        },
      });
      const data = await res.json();
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (data.success) {
        setFollowups((prev) => prev.filter((item) => item.id !== id));
        if (selectedCase?.id === id) {
          setSelectedCase(null);
        }
      } else {
        alert(data.message || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อลบข้อมูล");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter list
  const filteredList = followups.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.school?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      filterSeverity === "all" ||
      (filterSeverity === "urgent" && (item.severity8Q === "severe" || item.severity8Q === "moderate")) ||
      (filterSeverity === "moderate" && item.severity9Q === "moderate") ||
      (filterSeverity === "mild" && item.severity9Q === "mild");

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // -------------------------------------------------------------
  // 1. Initial Checking Loading
  // -------------------------------------------------------------
  if (checkingAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full bg-[#E2F2E9] text-[#1B432E] flex items-center justify-center animate-spin">
          <RefreshCw size={18} />
        </div>
        <p className="text-xs text-[#888]">กำลังตรวจสอบสิทธิ์การเข้าถึงระบบ...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Authentication Gate: Passcode Protected Login Screen
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 min-h-[calc(100vh-160px)] flex flex-col justify-center animate-in fade-in duration-300">
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-sm space-y-6 text-center">
          {/* Lock Icon Emblem */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] flex items-center justify-center text-[#2F6B4A] shadow-2xs">
            <Lock size={26} />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E2F2E9] text-[#1B432E] border border-[#B8DCC8]">
              <ShieldCheck size={12} />
              <span>พื้นที่ดูแลน้อง ๆ (สำหรับพี่ ๆ ผู้ดูแล JaiDee Care)</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#333] pt-1">
              เข้าสู่ระบบดูแลน้อง ๆ JaiDee Care
            </h1>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              สำหรับพี่ ๆ ผู้ดูแล JaiDee Care กรุณาระบุรหัสผ่านเพื่อเข้าถึงข้อมูลการดูแลและติดตามถามไถ่สุขภาพใจของน้อง ๆ
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 rounded-xl bg-[#FFF5F5] border border-[#F3D1D8] text-xs text-[#C53030] text-left flex items-start gap-2 animate-in shake">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Passcode Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#555] flex items-center justify-between">
                <span>รหัสผ่านพี่ ๆ ผู้ดูแล / PIN</span>
                <span className="text-[10px] text-[#888] font-normal">JaiDee Caregiver Passcode</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  autoComplete="current-password"
                  disabled={cooldown > 0}
                  placeholder={cooldown > 0 ? `ระบบถูกระงับชั่วคราว (${cooldown}s)` : "กรอกรหัสผ่านพี่ ๆ ผู้ดูแล"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all ${
                    cooldown > 0
                      ? "bg-[#F7F7F7] border-[#E2E2E2] text-[#999] cursor-not-allowed"
                      : "border-[#E0DACB] bg-[#FFFDF8] focus:border-[#779988]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#444] transition-colors"
                  tabIndex={-1}
                  disabled={cooldown > 0}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Security Lockout Notice / Guidance */}
              {cooldown > 0 ? (
                <div className="p-2.5 rounded-xl bg-[#FFF8E6] border border-[#F0D59E] text-[11px] text-[#8B6508] flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0 text-[#B7791F]" />
                  <span>
                    ระงับการลองชั่วคราว กรุณารออีก <strong className="font-mono text-[#744210] font-bold">{cooldown}</strong> วินาที
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-[#8A8A8A] pt-0.5">
                  🛡️ ข้อมูลเฉพาะพี่ ๆ ผู้ดูแล ใจดี เพื่อความปลอดภัยของข้อมูลน้อง ๆ
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading || !passcode.trim() || cooldown > 0}
              className="w-full py-3 px-4 rounded-full bg-[#2D5A3F] hover:bg-[#224430] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? (
                <>
                  <Lock size={15} />
                  <span>ระบบถูกระงับชั่วคราว ({cooldown} วินาที)</span>
                </>
              ) : authLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>กำลังตรวจสอบรหัสผ่าน...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>ยืนยันรหัสผ่านเพื่อเข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy & Legal Notice */}
          <div className="pt-2 border-t border-[#F0ECE1] text-[11px] text-[#888] leading-relaxed">
            <p>
              🔒 <strong>คำเตือนด้านความปลอดภัย:</strong> ข้อมูลนี้ได้รับการคุ้มครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ห้ามบันทึก ส่งต่อ หรือเปิดเผยแก่ผู้ไม่มีส่วนเกี่ยวข้องโดยเด็ดขาด
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>กลับสู่หน้าหลัก jaidee (ใจดี)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. Authenticated Counselor Portal
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFEAE1] pb-6">
        <div className="space-y-1.5">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#333] transition-colors mb-1"
          >
            <ArrowLeft size={14} />
            <span>กลับสู่หน้าแบบประเมิน</span>
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src="/Seal_of_the_Department_of_Mental_health.svg"
              alt="กรมสุขภาพจิต"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#3A3A3A] tracking-tight">
                  ระบบดูแลน้อง ๆ JaiDee Care
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E2F2E9] text-[#1B432E] border border-[#B8DCC8]">
                  <ShieldCheck size={11} />
                  <span>พี่ ๆ ผู้ดูแลยืนยันสิทธิ์แล้ว</span>
                </span>
              </div>
              <p className="text-xs text-[#7A7A7A]">
                พื้นที่บันทึกและติดตามดูแลสุขภาวะใจสำหรับพี่ ๆ ผู้ดูแล JaiDee Care
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Refresh & Logout */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => fetchFollowups()}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E0DACB] hover:border-[#B8DCC8] text-xs font-medium text-[#444] flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-[#FFFDF8] border border-[#F3D1D8] hover:bg-[#FAEBEE] text-xs font-medium text-[#8C1D2F] flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="ออกจากระบบเพื่อความปลอดภัย"
          >
            <LogOut size={13} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EFEAE1] shadow-2xs space-y-1">
          <span className="text-xs text-[#8A8A8A]">น้อง ๆ ที่ขอรับการดูแล</span>
          <p className="text-2xl font-bold text-[#333]">{followups.length} คน</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#F3D1D8] shadow-2xs space-y-1">
          <span className="text-xs text-[#8C1D2F]">กลุ่มที่ต้องการการดูแลด่วน (8Q)</span>
          <p className="text-2xl font-bold text-[#C53030]">
            {followups.filter((f) => f.severity8Q === "severe" || f.severity8Q === "moderate").length} คน
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F7E6B5] shadow-2xs space-y-1">
          <span className="text-xs text-[#5C4D20]">รอการติดต่อกลับ (Pending)</span>
          <p className="text-2xl font-bold text-[#D97706]">
            {followups.filter((f) => f.status === "pending").length} คน
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#E2F2E9] border border-[#B8DCC8] shadow-2xs space-y-1">
          <span className="text-xs text-[#245238]">กำลังดูแลต่อเนื่อง / สบายใจขึ้น</span>
          <p className="text-2xl font-bold text-[#2F6B4A]">
            {followups.filter((f) => f.status === "in_counseling" || f.status === "completed").length} คน
          </p>
        </div>
      </div>

      {/* Main Content: List + Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Filter and Case List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#EFEAE1] shadow-2xs space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" />
              <input
                type="text"
                placeholder="ค้นหาชื่อน้อง, ระดับชั้น, โรงเรียน, หรือเลขเคส..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#888] flex items-center gap-1">
                <Filter size={12} />
                <span>ตัวกรอง:</span>
              </span>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E0DACB] bg-[#FFFDF8] text-xs text-[#444] focus:outline-none"
              >
                <option value="all">ทุกระดับความเสี่ยง</option>
                <option value="urgent">ต้องการการดูแลด่วน (8Q เสี่ยงสูง/ปานกลาง)</option>
                <option value="moderate">ซึมเศร้าปานกลาง (9Q)</option>
                <option value="mild">ซึมเศร้าเล็กน้อย (9Q)</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E0DACB] bg-[#FFFDF8] text-xs text-[#444] focus:outline-none"
              >
                <option value="all">ทุกสถานะการติดตาม</option>
                <option value="pending">รอการติดต่อกลับ</option>
                <option value="contacted">ติดต่อเบื้องต้นแล้ว</option>
                <option value="in_counseling">กำลังดูแลต่อเนื่อง</option>
                <option value="completed">ดูแลเสร็จสิ้น</option>
              </select>
            </div>
          </div>

          {/* List of Cases */}
          {loading ? (
            <div className="text-center py-12 text-xs text-[#8A8A8A] bg-white rounded-2xl border border-[#EFEAE1]">
              กำลังโหลดข้อมูลการดูแลน้อง ๆ...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#8A8A8A] bg-white rounded-2xl border border-[#EFEAE1] space-y-1">
              <p className="text-sm font-medium text-[#555]">ยังไม่มีข้อมูลที่ตรงกับตัวกรอง</p>
              <p className="text-xs text-[#999]">เมื่อน้อง ๆ ทำแบบประเมินและยินยอมให้พี่ ๆ ผู้ดูแลติดต่อกลับ ข้อมูลจะปรากฏที่นี่</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredList.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                const isUrgent = item.severity8Q === "severe" || item.severity8Q === "moderate";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCase(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FFFDF8] border-[#779988] shadow-sm ring-2 ring-[#B8DCC8]/50"
                        : isUrgent
                        ? "bg-[#FFF5F5]/70 border-[#F3D1D8] hover:bg-[#FFF5F5]"
                        : "bg-white border-[#EFEAE1] hover:bg-[#FFFDF8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-xs text-[#1B432E] bg-[#E2F2E9] px-2 py-0.5 rounded-md">
                            {item.grade || "มัธยม"}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-[#333]">
                            {item.name}
                          </span>
                          {item.school && (
                            <span className="text-[11px] text-[#777] bg-white px-2 py-0.5 rounded border border-[#E8DFC9]">
                              {item.school}
                            </span>
                          )}
                        </div>

                        {item.topic && (
                          <p className="text-xs text-[#555] line-clamp-1">
                            💬 หัวข้อ: {item.topic}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-[#666] pt-0.5">
                          <span>เบอร์/Line: <strong className="text-[#333]">{item.contact}</strong></span>
                          <span>•</span>
                          <span className="text-[#888]">{item.preferredTime}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isUrgent ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E53E3E] text-white flex items-center gap-1">
                            <AlertTriangle size={11} />
                            <span>เสี่ยงทำร้ายตนเอง ({item.score8Q})</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAEBEE] text-[#8C243B]">
                            9Q: {item.score9Q} คะแนน
                          </span>
                        )}

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.status === "pending"
                            ? "bg-[#FDF7E5] text-[#855B14] border border-[#F7E6B5]"
                            : item.status === "contacted"
                            ? "bg-[#EBF3FA] text-[#204E78]"
                            : item.status === "in_counseling"
                            ? "bg-[#E2F2E9] text-[#1B432E]"
                            : "bg-[#F0ECE1] text-[#666]"
                        }`}>
                          {item.status === "pending" ? "รอติดต่อกลับ" :
                           item.status === "contacted" ? "ติดต่อแล้ว" :
                           item.status === "in_counseling" ? "กำลังดูแลต่อเนื่อง" : "เสร็จสิ้น"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Case Detail & Counselor Notes (5 cols) */}
        <div className="lg:col-span-5">
          {selectedCase ? (
            <div className="bg-white rounded-3xl p-6 border border-[#EFEAE1] shadow-xs space-y-5 sticky top-20">
              <div className="flex items-start justify-between border-b border-[#EFEAE1] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#888]">{selectedCase.id}</span>
                  <h3 className="text-base font-bold text-[#333]">
                    {selectedCase.name}
                  </h3>
                  <p className="text-xs text-[#666]">
                    ระดับชั้น: {selectedCase.grade || "มัธยม"} {selectedCase.school ? `• ${selectedCase.school}` : ""}
                  </p>
                  {selectedCase.topic && (
                    <p className="text-xs text-[#2F6B4A] font-medium mt-0.5">
                      💬 หัวข้อที่อยากคุย: {selectedCase.topic}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right text-[11px] text-[#888]">
                    <p>บันทึกเมื่อ:</p>
                    <p className="font-mono">{new Date(selectedCase.createdAt).toLocaleDateString("th-TH")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCase(selectedCase.id)}
                    disabled={deletingId === selectedCase.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium text-[#C53030] hover:bg-[#FFF5F5] border border-[#F3D1D8] transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                    title="ลบข้อมูลเคสนี้ออกจากระบบ"
                  >
                    <Trash2 size={12} />
                    <span>{deletingId === selectedCase.id ? "กำลังลบ..." : "ลบเคสนี้"}</span>
                  </button>
                </div>
              </div>

              {/* Assessment Scores */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAEBEE]/50 border border-[#F3D1D8]">
                  <span className="text-[#8C243B] font-medium">คะแนนซึมเศร้า (9Q)</span>
                  <p className="text-lg font-bold text-[#701E2D]">{selectedCase.score9Q} คะแนน</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FFF5F5] border border-[#EAA8B4]">
                  <span className="text-[#9B1C1C] font-medium">ความเสี่ยงทำร้ายตนเอง (8Q)</span>
                  <p className="text-lg font-bold text-[#C53030]">{selectedCase.score8Q} คะแนน</p>
                </div>
              </div>

              {/* Contact and Follow-up Actions */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#666]">ช่องทางติดต่อ:</span>
                  <a
                    href={`tel:${selectedCase.contact}`}
                    className="font-bold text-[#245238] flex items-center gap-1 hover:underline"
                  >
                    <PhoneCall size={12} />
                    <span>{selectedCase.contact}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between text-[#666]">
                  <span>เวลาที่สะดวกให้ติดต่อ:</span>
                  <span className="text-[#333] font-medium">{selectedCase.preferredTime}</span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#555]">ปรับสถานะการดูแล:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, "contacted")}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      selectedCase.status === "contacted"
                        ? "bg-[#EBF3FA] border-[#C7DDF2] text-[#204E78] font-bold"
                        : "border-[#EFEAE1] hover:bg-[#F3EFE6] text-[#555]"
                    }`}
                  >
                    📞 ติดต่อแล้ว
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, "in_counseling")}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      selectedCase.status === "in_counseling"
                        ? "bg-[#E2F2E9] border-[#B8DCC8] text-[#1B432E] font-bold"
                        : "border-[#EFEAE1] hover:bg-[#F3EFE6] text-[#555]"
                    }`}
                  >
                    🌿 กำลังดูแล
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, "completed")}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      selectedCase.status === "completed"
                        ? "bg-[#F0ECE1] border-[#D0CAB7] text-[#333] font-bold"
                        : "border-[#EFEAE1] hover:bg-[#F3EFE6] text-[#555]"
                    }`}
                  >
                    ✅ สบายใจขึ้น
                  </button>
                </div>
              </div>

              {/* Counselor Progress Notes */}
              <div className="space-y-3 pt-2 border-t border-[#EFEAE1]">
                <h4 className="text-xs font-semibold text-[#333] flex items-center gap-1.5">
                  <FileText size={13} className="text-[#779988]" />
                  <span>บันทึกการพูดคุยและติดตามดูแลใจ:</span>
                </h4>

                {/* Previous notes */}
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {selectedCase.counselorNotes && selectedCase.counselorNotes.length > 0 ? (
                    selectedCase.counselorNotes.map((n, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#FBF9F5] border border-[#F0ECE1] text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-[#888]">
                          <span className="font-semibold text-[#555]">{n.author}</span>
                          <span className="font-mono">{new Date(n.date).toLocaleString("th-TH")}</span>
                        </div>
                        <p className="text-[#444] leading-relaxed">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#999] text-center py-3 bg-[#FBF9F5] rounded-xl">
                      ยังไม่มีบันทึกการติดตาม
                    </p>
                  )}
                </div>

                {/* Add new note form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    placeholder="พิมพ์บันทึกการพูดคุย / ถามไถ่อาการน้อง ๆ..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E0DACB] bg-[#FFFDF8] text-xs focus:outline-none focus:border-[#779988]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="ชื่อผู้บันทึก"
                      value={counselorName}
                      onChange={(e) => setCounselorName(e.target.value)}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg border border-[#E0DACB] bg-[#FFFDF8] text-[#555] w-1/2"
                    />
                    <button
                      type="submit"
                      disabled={!noteText.trim() || updating}
                      className="px-4 py-1.5 rounded-xl bg-[#B8DCC8] hover:bg-[#A3CEB5] text-[#1B432E] text-xs font-medium transition-all shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      เพิ่มบันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-3xl p-8 border border-[#EFEAE1] text-center space-y-2 text-[#888] text-xs">
              <Users size={32} className="mx-auto text-[#B8DCC8]" />
              <p className="font-medium text-[#555]">เลือกเคสน้อง ๆ เพื่อดูรายละเอียดและบันทึกติดตามอาการ</p>
              <p className="text-[11px] text-[#999]">
                พี่ ๆ ผู้ดูแลสามารถบันทึกผลการพูดคุย และติดตามดูแลสุขภาพใจของน้อง ๆ ได้ที่นี่
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
