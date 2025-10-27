import React from "react";
import { motion } from "motion/react";
import { ProfileSwitcher } from "./ProfileSwitcher";
import { Logo } from "./Logo";
import {
  ChevronRight,
  ChevronDown,
  Trophy,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "./ActivityManagement";
import { Goal } from "./GoalManagement";

interface Profile {
  id: string;
  name: string;
  emoji?: string;
  avatar?: string;
}

interface DashboardProps {
  profiles: Profile[];
  currentProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  activities: Activity[];
  goals: Goal[];
  onOpenAffiliatePopup?: () => void;
  onOpenReadingCompass?: () => void;
  onOpenActivityManagement?: () => void;
}

// Rang-System basierend auf Lesestunden
interface Rank {
  title: string;
  emoji: string;
  minHours: number;
  maxHours: number;
  color: string;
  avatars: string[];
}

export const RANKS: Rank[] = [
  {
    title: "Bücherwürmchen",
    emoji: "🐛",
    minHours: 0,
    maxHours: 10,
    color: "#10B981",
    avatars: ["🐛", "🪲", "🐌", "🦗", "🐜", "🪰"],
  },
  {
    title: "Leseratte",
    emoji: "🐭",
    minHours: 10,
    maxHours: 25,
    color: "#F59E0B",
    avatars: ["🐭", "🐹", "🐿️", "🦫", "🐇", "🐰"],
  },
  {
    title: "Leseeule",
    emoji: "🦉",
    minHours: 25,
    maxHours: 50,
    color: "#8B5CF6",
    avatars: ["🦉", "🦅", "🦆", "🦜", "🐦", "🕊️"],
  },
  {
    title: "Bücherwurm",
    emoji: "🪱",
    minHours: 50,
    maxHours: 100,
    color: "#EC4899",
    avatars: ["🪱", "🐛", "🦋", "🐞", "🐝", "🦗"],
  },
  {
    title: "Lesezauberer",
    emoji: "🧙",
    minHours: 100,
    maxHours: 200,
    color: "#6366F1",
    avatars: ["🧙", "🧙‍♀️", "🧙‍♂️", "🪄", "⭐", "✨"],
  },
  {
    title: "Geschichtenmeister",
    emoji: "🏆",
    minHours: 200,
    maxHours: Infinity,
    color: "#EAB308",
    avatars: ["🏆", "👑", "🎖️", "🥇", "🌟", "💎"],
  },
];

export const getRankInfo = (totalHours: number) => {
  const currentRank =
    RANKS.find(
      (rank) =>
        totalHours >= rank.minHours &&
        totalHours < rank.maxHours,
    ) || RANKS[RANKS.length - 1];

  const currentIndex = RANKS.findIndex(
    (r) => r.title === currentRank.title,
  );
  const nextRank =
    currentIndex < RANKS.length - 1
      ? RANKS[currentIndex + 1]
      : null;

  const progressToNextRank = nextRank
    ? ((totalHours - currentRank.minHours) /
        (nextRank.minHours - currentRank.minHours)) *
      100
    : 100;

  return {
    currentRank,
    nextRank,
    progressToNextRank: Math.min(progressToNextRank, 100),
  };
};

export function Dashboard({
  profiles,
  currentProfile,
  onProfileChange,
  activities,
  goals,
  onOpenAffiliatePopup,
  onOpenReadingCompass,
  onOpenActivityManagement,
}: DashboardProps) {
  // TODO: In Zukunft aus Backend/LocalStorage laden
  // Für jetzt: Neue User starten mit 0 Minuten (echte User Experience)
  const baseReadingMinutes = 0; // Wird nach ersten Sessions > 0
  
  // Separate activities für Charts
  const separateActivities = activities.filter(
    (a) => a.showSeparately,
  );
  const combinedActivities = activities.filter(
    (a) => !a.showSeparately,
  );

  // Activity data - wird sich in Zukunft aus echten Sessions füllen
  // Für Demo-Zwecke: Wenn keine Sessions existieren, verwende die Activity-Definition als Demo-Wert
  const activityData = separateActivities.map(
    (activity) => {
      // Demo-Logik: Verwende activityMinutes als "bereits absolviert" für Demo
      // In Production würden diese aus echten Sessions kommen
      const demoMinutes = activity.activityMinutes; // z.B. 60 Min Fußball = 60 Min im Chart
      const demoWeekly = [
        Math.round(demoMinutes * 0.15), // Mo: 15%
        Math.round(demoMinutes * 0.2),  // Di: 20%
        Math.round(demoMinutes * 0.1),  // Mi: 10%
        Math.round(demoMinutes * 0.25), // Do: 25%
        Math.round(demoMinutes * 0.15), // Fr: 15%
        Math.round(demoMinutes * 0.1),  // Sa: 10%
        Math.round(demoMinutes * 0.05), // So: 5%
      ];
      
      return {
        ...activity,
        weeklyMinutes: demoWeekly,
        totalMinutes: demoMinutes, // Für Demo: Zeige was die Aktivität wert ist
      };
    },
  );

  // Kombinierte Aktivitäten (showSeparately=false) werden zur Lesezeit addiert
  const combinedActivityData = combinedActivities.map(
    (activity) => {
      // Demo-Logik: Auch kombinierte Aktivitäten bekommen Demo-Werte
      const demoMinutes = activity.activityMinutes;
      const demoWeekly = [
        Math.round(demoMinutes * 0.15),
        Math.round(demoMinutes * 0.2),
        Math.round(demoMinutes * 0.1),
        Math.round(demoMinutes * 0.25),
        Math.round(demoMinutes * 0.15),
        Math.round(demoMinutes * 0.1),
        Math.round(demoMinutes * 0.05),
      ];
      
      return {
        ...activity,
        weeklyMinutes: demoWeekly,
        totalMinutes: demoMinutes,
      };
    },
  );
  
  // Kombinierte Aktivitäten werden zur Lesezeit addiert
  const combinedActivityMinutes = combinedActivityData.reduce(
    (sum, act) => sum + act.totalMinutes,
    0,
  );

  // Gesamte Lesezeit = Basis-Lesezeit + kombinierte Aktivitäten
  const totalReadingMinutes = baseReadingMinutes + combinedActivityMinutes;
  const totalReadingHours = totalReadingMinutes / 60;

  // Berechne Rang-Informationen
  const rankInfo = getRankInfo(totalReadingHours);

  // Nutze gewählten Avatar oder Default
  const displayAvatar =
    currentProfile.avatar || rankInfo.currentRank.emoji;

  // Bildschirmzeit-Berechnung
  // Basis: Lesezeit verdient Bildschirmzeit (1:1 Ratio)
  let earnedScreenMinutes = totalReadingMinutes; // Basis von Lesezeit
  
  // Addiere Bildschirmzeit von ALLEN Aktivitäten (separate UND kombinierte)
  // Jede Aktivität hat ein eigenes Verhältnis (activityMinutes → screenMinutes)
  [...activityData, ...combinedActivityData].forEach((activity) => {
    // Berechne verdiente Bildschirmzeit basierend auf Aktivitäts-Verhältnis
    // z.B. 60 Min Fußball = 30 Min Bildschirmzeit (bei 2:1 Ratio)
    const ratio = activity.activityMinutes / activity.screenMinutes;
    const earnedFromActivity = activity.totalMinutes / ratio;
    earnedScreenMinutes += earnedFromActivity;
  });
  
  const earnedScreenHours = earnedScreenMinutes / 60;

  // Hauptziel: Aktives Ziel oder Default
  const activeGoal = goals.find((g) => g.isActive);
  const weeklyGoalMinutes = activeGoal?.targetMinutes || 420;
  const currentWeekMinutes = 0; // Wird nach Sessions aktualisiert

  // Goal Progress basierend auf Typ
  const goalProgressMinutes =
    activeGoal?.type === "combined"
      ? currentWeekMinutes +
        activityData.reduce(
          (sum, act) => sum + act.totalMinutes,
          0,
        )
      : currentWeekMinutes;

  const goalProgress =
    (goalProgressMinutes / weeklyGoalMinutes) * 100;

  const stats = {
    totalReadingMinutes,
    totalReadingHours: Math.round(totalReadingHours * 10) / 10,
    earnedScreenMinutes,
    earnedScreenHours: Math.round(earnedScreenHours * 10) / 10,
    goalProgress: Math.round(goalProgress),
    rankProgress: Math.round(rankInfo.progressToNextRank),
    weeklyData: [
      {
        day: "Mo",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[0],
          }),
          {},
        ),
      },
      {
        day: "Di",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[1],
          }),
          {},
        ),
      },
      {
        day: "Mi",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[2],
          }),
          {},
        ),
      },
      {
        day: "Do",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[3],
          }),
          {},
        ),
      },
      {
        day: "Fr",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[4],
          }),
          {},
        ),
      },
      {
        day: "Sa",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[5],
          }),
          {},
        ),
      },
      {
        day: "So",
        reading: 0,
        ...activityData.reduce(
          (acc, act, idx) => ({
            ...acc,
            [`activity${idx}`]: act.weeklyMinutes[6],
          }),
          {},
        ),
      },
    ],
  };

  // Donut chart data - Dynamisch basierend auf Aktivitäten
  const donutData = [
    {
      name: "Lesezeit",
      value: totalReadingMinutes > 0 ? totalReadingMinutes : 30, // Default 30 für leeres Chart
      color: "#8B5CF6",
      emoji: "📚",
    },
    // Separate Aktivitäten werden als eigene Slices angezeigt
    ...activityData.map((act) => ({
      name: act.name,
      value: act.totalMinutes, // Verwende tatsächliche/Demo-Minuten
      color: act.color,
      emoji: act.emoji,
    })),
    // Goal und Rank nur wenn vorhanden/relevant
    ...(activeGoal
      ? [
          {
            name: activeGoal.name,
            value: Math.max(
              stats.goalProgress > 100 ? 20 : stats.goalProgress * 0.2,
              5
            ), // Minimum 5 für Sichtbarkeit
            color: "#EF4444",
            emoji: activeGoal.emoji || "🎯",
          },
        ]
      : []),
    {
      name: "Nächster Rang",
      value: Math.max(stats.rankProgress * 0.2, 5), // Minimum 5 für Sichtbarkeit
      color: "#F472B6",
      emoji: "🏆",
    },
  ];

  // Berechne Rest für den Donut
  const totalValue = donutData.reduce(
    (acc, item) => acc + item.value,
    0,
  );
  if (totalValue < 100) {
    donutData.push({
      name: "Rest",
      value: 100 - totalValue,
      color: "#E5E7EB",
    });
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Compact Header Card */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-b-[32px] px-6 pt-12 pb-8 shadow-lg overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-md mx-auto relative z-10">
          {/* LessScreen Logo - Top Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-0 right-0 z-20"
          >
            <Logo className="w-12 h-12 drop-shadow-lg" />
          </motion.div>

          {/* Profile Switcher - Compact Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            {profiles.length > 1 ? (
              <div className="w-64">
                <ProfileSwitcher
                  profiles={profiles}
                  currentProfile={currentProfile}
                  onProfileChange={onProfileChange}
                  rankEmoji={rankInfo.currentRank.emoji}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-lg">
                    {rankInfo.currentRank.emoji}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm">
                    {currentProfile.name}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {rankInfo.currentRank.title}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Hero Avatar Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Animated Avatar Ring - Larger */}
            <div className="relative mb-6">
              {/* Enhanced Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-full blur-3xl scale-125 animate-pulse"></div>
              <div className="absolute inset-0 bg-yellow-200/20 rounded-full blur-2xl scale-110"></div>

              {/* Progress Ring - Larger */}
              <svg
                className="w-48 h-48 -rotate-90"
                viewBox="0 0 180 180"
              >
                {/* Background Circle */}
                <circle
                  cx="90"
                  cy="90"
                  r="82"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="5"
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#F59E0B"
                      stopOpacity="1"
                    />
                    <stop
                      offset="50%"
                      stopColor="#FCD34D"
                      stopOpacity="1"
                    />
                    <stop
                      offset="100%"
                      stopColor="#FBBF24"
                      stopOpacity="1"
                    />
                  </linearGradient>
                </defs>
                {/* Progress Circle with Gradient */}
                <motion.circle
                  cx="90"
                  cy="90"
                  r="82"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 82}`}
                  initial={{
                    strokeDashoffset: 2 * Math.PI * 82,
                  }}
                  animate={{
                    strokeDashoffset:
                      2 *
                      Math.PI *
                      82 *
                      (1 - rankInfo.progressToNextRank / 100),
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                  style={{
                    filter:
                      "drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))",
                  }}
                />
              </svg>

              {/* Avatar - Larger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-[0_12px_48px_rgba(0,0,0,0.2)]">
                  <span className="text-7xl">
                    {rankInfo.currentRank.emoji}
                  </span>
                </div>
              </div>

              {/* Enhanced Sparkle Decorations */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <Sparkles className="absolute top-2 right-4 w-5 h-5 text-yellow-200/80" />
                <Sparkles className="absolute bottom-4 left-2 w-4 h-4 text-yellow-200/70" />
                <Sparkles className="absolute top-1/3 left-0 w-3 h-3 text-white/60" />
                <Sparkles className="absolute bottom-1/3 right-0 w-3 h-3 text-white/60" />
              </motion.div>

              {/* Floating Trophy for next rank */}
              {rankInfo.nextRank && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    bounce: 0.5,
                  }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-2 shadow-lg border-2 border-white"
                >
                  <span className="text-xl">
                    {rankInfo.nextRank.emoji}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Progress Badge - Under Avatar */}
            {rankInfo.nextRank && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-white/25 via-white/20 to-white/25 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/40 mb-6 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/40">
                    <p className="text-white tabular-nums">
                      <span className="text-sm">Noch</span>{" "}
                      <span className="font-semibold text-base">
                        {rankInfo.nextRank.minHours -
                          totalReadingHours}
                      </span>
                      <span className="text-xs ml-0.5">h</span>
                    </p>
                  </div>
                  <p className="text-white/90 text-sm">
                    bis {rankInfo.nextRank.title}
                  </p>
                  <div className="bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full p-1.5 shadow-md">
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Stats Pills - Larger & More Prominent */}
            <div className="flex items-center gap-4">
              {/* Bildschirmzeit */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-white/30 via-white/25 to-white/20 backdrop-blur-md rounded-[20px] px-5 py-3 border border-white/40 flex items-center gap-3 shadow-lg"
              >
                <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-white/80 text-[10px] leading-none mb-1 uppercase tracking-wide">
                    Bildschirmzeit
                  </p>
                  <p className="text-white leading-none">
                    {stats.earnedScreenHours}h
                  </p>
                </div>
              </motion.div>

              {/* Bücher */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-white/30 via-white/25 to-white/20 backdrop-blur-md rounded-[20px] px-5 py-3 border border-white/40 flex items-center gap-3 shadow-lg"
              >
                <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-white/80 text-[10px] leading-none mb-1 uppercase tracking-wide">
                    Bücher
                  </p>
                  <p className="text-white leading-none">0</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 mt-6 space-y-4">
        {/* Demo Mode Info Banner - Zeige wenn Aktivitäten existieren */}
        {(activityData.length > 0 || combinedActivityData.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] p-4 border-2 border-blue-200 flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-[12px] flex items-center justify-center flex-shrink-0">
              <span className="text-xl">ℹ️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-blue-900 mb-1">
                Demo-Modus: Aktivitäten
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Die Aktivitäten zeigen Demo-Daten. Nach echten Lese-Sessions werden hier die tatsächlichen Werte angezeigt.
                {combinedActivityData.length > 0 && (
                  <span className="block mt-1">
                    <span className="text-accent font-medium">📚 Kombinierte Aktivitäten</span> werden zur Lesezeit addiert!
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* Goal Info Banner */}
        {!activeGoal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[20px] p-4 border border-primary/20 flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[12px] flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <h4 className="text-foreground mb-1">
                Kein Ziel definiert
              </h4>
              <p className="text-xs text-muted-foreground">
                Erstelle dein erstes Ziel in den Einstellungen,
                um deinen Fortschritt zu tracken!
              </p>
            </div>
          </motion.div>
        )}

        {/* Weekly Bar Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm">
                Wöchentliche Aktivitäten
              </p>
              <h3 className="text-foreground mt-1">
                {stats.weeklyData.reduce((acc, d) => {
                  let total = d.reading;
                  activityData.forEach((_, idx) => {
                    total +=
                      (d[
                        `activity${idx}` as keyof typeof d
                      ] as number) || 0;
                  });
                  return acc + total;
                }, 0)}{" "}
                Min
              </h3>
            </div>
            {onOpenReadingCompass && (
              <button 
                onClick={onOpenActivityManagement}
                className="text-primary transition-transform active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.weeklyData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Bar
                dataKey="reading"
                stackId="a"
                radius={
                  activityData.length === 0
                    ? [12, 12, 0, 0]
                    : [0, 0, 0, 0]
                }
                fill="#8B5CF6"
              />
              {activityData.map((activity, idx) => (
                <Bar
                  key={activity.id}
                  dataKey={`activity${idx}`}
                  stackId="a"
                  radius={
                    idx === activityData.length - 1
                      ? [12, 12, 0, 0]
                      : [0, 0, 0, 0]
                  }
                  fill={activity.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>

          {/* Legende */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[12px] p-2.5 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-md" />
              <p className="text-xs text-foreground flex items-center gap-1">
                <span className="text-sm">📚</span> Lesezeit
              </p>
            </div>
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="bg-muted rounded-[12px] p-2.5 flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded-full shadow-md flex-shrink-0"
                  style={{ backgroundColor: activity.color }}
                />
                <p className="text-xs text-foreground truncate">
                  <span className="text-sm">
                    {activity.emoji}
                  </span>{" "}
                  {activity.name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Donut Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
        >
          <p className="text-muted-foreground text-sm mb-6">
            FORTSCHRITT
          </p>

          {/* Donut Chart */}
          <div className="relative flex items-center justify-center mb-6">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={10}
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">📖</span>
              </div>
              <h2 className="text-foreground">
                {stats.totalReadingHours}
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                Stunden
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[16px] p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-[12px] flex items-center justify-center shadow-lg">
                  <span className="text-xl">📚</span>
                </div>
                <p className="text-sm text-foreground">
                  Lesezeit
                </p>
              </div>
              <p className="text-foreground">
                {stats.totalReadingHours} Std
              </p>
            </div>
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="bg-muted rounded-[16px] p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center shadow-md"
                    style={{
                      backgroundColor: activity.color,
                      opacity: 0.9,
                    }}
                  >
                    <span className="text-xl filter brightness-150">
                      {activity.emoji}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {activity.name}
                  </p>
                </div>
                <p className="text-foreground">
                  {(activity.totalMinutes / 60).toFixed(1)} Std
                </p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-[#EF4444]/10 to-[#EF4444]/5 rounded-[16px] p-3.5 flex items-center justify-between border border-[#EF4444]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-[12px] flex items-center justify-center shadow-lg">
                  <span className="text-xl">
                    {activeGoal?.emoji || "🎯"}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {activeGoal?.name || "Hauptziel"}
                </p>
              </div>
              <p className="text-foreground">
                {stats.goalProgress.toFixed(0)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {/* Bücher-Reise: Gelesene Bücher + Empfehlungen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
        >
          {/* Gelesene Bücher Sektion */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/10 rounded-[12px] flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <h4 className="text-foreground text-sm">
                    Deine Lese-Reise
                  </h4>
                  <p className="text-muted-foreground text-[10px]">
                    0 Bücher gelesen
                  </p>
                </div>
              </div>
              <button className="text-[#14B8A6] text-xs hover:underline">
                Alle
              </button>
            </div>

            {/* Horizontales Scroll für Bücher */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[].map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex-shrink-0 w-20 bg-gradient-to-br from-[#14B8A6]/10 to-[#0891B2]/5 rounded-[14px] p-3 border border-[#14B8A6]/20"
                >
                  <div className="text-2xl mb-1 text-center">
                    {book.emoji}
                  </div>
                  <p className="text-[9px] text-foreground text-center leading-tight mb-0.5 truncate">
                    {book.title}
                  </p>
                  <p className="text-[8px] text-muted-foreground text-center">
                    {book.pages} S.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Verbindungslinie */}
          <div className="relative h-8 flex items-center justify-center mb-4">
            <div className="absolute w-0.5 h-full bg-gradient-to-b from-[#14B8A6]/40 via-[#8B5CF6]/40 to-[#F472B6]/40 rounded-full"></div>
            <div className="relative bg-card px-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            </div>
          </div>

          {/* Empfehlung */}
          <div className="bg-gradient-to-br from-[#8B5CF6]/10 via-[#F472B6]/5 to-[#8B5CF6]/10 rounded-[16px] p-4 border border-[#8B5CF6]/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#F472B6] rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
                <span className="text-2xl">🎭</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-foreground mb-0.5">
                  Der Grüffelo
                </h4>
                <p className="text-muted-foreground text-[10px] mb-2">
                  von Julia Donaldson · 32 Seiten
                </p>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="text-[9px]">🦁</span>
                    <span className="text-[9px] text-foreground/80">
                      Wegen Löwenherz
                    </span>
                  </div>
                </div>
                <p className="text-foreground/70 text-[11px] leading-relaxed">
                  Mutige Tiergeschichten wie du sie liebst!
                  Perfekt nach deinem letzten Abenteuer.
                </p>
              </div>
            </div>

            <motion.button
              onClick={onOpenAffiliatePopup}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] text-white py-2.5 rounded-full shadow-[0_4px_16px_rgba(139,92,246,0.25)] text-xs w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Jetzt entdecken
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}