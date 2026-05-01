import { useEffect, useState } from "react";

import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardWalletDrawer from "../components/main-dashboard/DashboardWalletDrawer";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";

import useFinancialData from "../hooks/useFinancialData";
import { supabase } from "../lib/supabaseClient";

const BILLBOARD_ROTATION_MS = 7000;

function getAdaptiveDashboardScale() {
  if (typeof window === "undefined") return 1;

  const height = window.innerHeight || 0;

  if (height > 0 && height <= 640) return 0.92;
  if (height > 0 && height <= 700) return 0.95;

  return 1;
}

function normalizeBillboard(billboard) {
  if (!billboard) return null;

  const mediaUrl = billboard.media_url || "";
  const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(mediaUrl);

  return {
    ...billboard,
    video_url: billboard.video_url || (isVideo ? mediaUrl : ""),
    thumbnail_url: billboard.thumbnail_url || (!isVideo ? mediaUrl : ""),
    caption: billboard.caption || billboard.description || billboard.cta_text || "",
  };
}

export default function Dashboard() {
  const { wallets, expenses, budgets, savingsGoals, loading, saveBudget, addExpense } =
    useFinancialData();

  const [dashboardScale, setDashboardScale] = useState(getAdaptiveDashboardScale);
  const [activeBillboards, setActiveBillboards] = useState([]);
  const [activeBillboardIndex, setActiveBillboardIndex] = useState(0);

  const activeBillboard = activeBillboards[activeBillboardIndex] || null;

  useEffect(() => {
    let isMounted = true;

    const fetchActiveBillboards = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("dashboard_billboards")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Unable to load active dashboard billboards:", error.message);
          return;
        }

        if (isMounted) {
          setActiveBillboards((data || []).map(normalizeBillboard).filter(Boolean));
          setActiveBillboardIndex(0);
        }
      } catch (error) {
        console.warn("Unable to load active dashboard billboards:", error);
      }
    };

    fetchActiveBillboards();

    const channel = supabase
      ?.channel("dashboard-active-billboards")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dashboard_billboards",
        },
        fetchActiveBillboards
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (activeBillboards.length <= 1) return undefined;

    const rotationTimer = window.setInterval(() => {
      setActiveBillboardIndex((currentIndex) =>
        currentIndex >= activeBillboards.length - 1 ? 0 : currentIndex + 1
      );
    }, BILLBOARD_ROTATION_MS);

    return () => window.clearInterval(rotationTimer);
  }, [activeBillboards.length]);

  useEffect(() => {
    const updateDashboardScale = () => {
      setDashboardScale(getAdaptiveDashboardScale());
    };

    updateDashboardScale();
    window.addEventListener("resize", updateDashboardScale);
    window.addEventListener("orientationchange", updateDashboardScale);

    return () => {
      window.removeEventListener("resize", updateDashboardScale);
      window.removeEventListener("orientationchange", updateDashboardScale);
    };
  }, []);

  const handleBillboardClick = () => {
    if (activeBillboard?.cta_url) {
      window.location.href = activeBillboard.cta_url;
    }
  };

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalMoney = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

  const totalExpenses =
    expenses
      ?.filter((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === monthKey;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const budget = budgets || {};

  const emergencyGoal =
    savingsGoals?.find((g) => g.title?.toLowerCase().includes("emergency")) || null;

  const savings = {
    saved: savingsGoals?.reduce((s, g) => s + (g.saved_amount || 0), 0) || 0,
    target: savingsGoals?.reduce((s, g) => s + (g.target_amount || 0), 0) || 0,
  };

  const investments = { value: 0 };
  const debts = { total: 0 };

  const startClaraAiLongPress = () => {
    console.log("CLARA AI long press started");
  };

  const endClaraAiLongPress = () => {
    console.log("CLARA AI long press ended");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b10] text-white flex items-center justify-center">
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55 backdrop-blur-xl">
          Loading CLARA
        </div>
      </main>
    );
  }

  return (
    <ClaraPageShell compactHeader>
      <div className="flex min-h-[100dvh] flex-col gap-4 overflow-x-hidden overflow-y-auto pb-[calc(70px+env(safe-area-inset-bottom))] sm:h-auto sm:overflow-y-auto sm:pb-[calc(88px+env(safe-area-inset-bottom))]">
        <div
          className="flex min-h-0 origin-top flex-col gap-4"
          style={{
            transform: `scale(${dashboardScale})`,
            transformOrigin: "top center",
            willChange: dashboardScale === 1 ? "auto" : "transform",
          }}
        >
          <DashboardBillboard
            billboard={activeBillboard}
            onClick={handleBillboardClick}
          />

          <DashboardWalletDrawer wallets={wallets} />

          <DashboardFinancialCarousel
            budgetData={budget}
            emergencyFundData={{
              saved: emergencyGoal?.saved_amount || 0,
              target: emergencyGoal?.target_amount || 0,
            }}
            savingsData={savings}
            investmentData={investments}
            debtData={debts}
            onSaveBudget={saveBudget}
          />

          <DashboardMoneySummary
            moneyLeft={totalMoney - totalExpenses}
            totalExpenses={totalExpenses}
            handleQuickExpense={addExpense}
            startClaraAiLongPress={startClaraAiLongPress}
            endClaraAiLongPress={endClaraAiLongPress}
          />
        </div>
      </div>
    </ClaraPageShell>
  );
}
