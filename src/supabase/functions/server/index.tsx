import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface User {
  id: string;
  createdAt: string;
  userType: "oneChild" | "multipleChildren" | "adult";
}

interface Profile {
  id: string;
  userId: string;
  name: string;
  emoji?: string;
  avatar?: string;
  currentRank: string;
  totalReadingMinutes: number;
  totalScreenMinutes: number;
  createdAt: string;
  updatedAt: string;
}

interface ReadingSession {
  id: string;
  profileId: string;
  duration: number;
  startedAt: string;
  completedAt: string;
  note?: string;
  compassValidated: boolean;
}

interface Activity {
  id: string;
  profileId: string;
  name: string;
  emoji: string;
  ratio: number;
  includeInReading: boolean;
  createdAt: string;
}

interface Goal {
  id: string;
  profileId: string;
  title: string;
  emoji: string;
  targetMinutes: number;
  currentMinutes: number;
  period: "daily" | "weekly" | "monthly";
  createdAt: string;
  completed: boolean;
}

interface CompassValidation {
  id: string;
  profileId: string;
  sessionId: string;
  photoUrl?: string;
  questions: Array<{ question: string; answer: string }>;
  validatedAt: string;
}

interface ProfileSettings {
  profileId: string;
  readingRatio: number;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
}

interface ProfileStats {
  profileId: string;
  totalReadingMinutes: number;
  totalScreenMinutes: number;
  currentStreak: number;
  longestStreak: number;
  sessionsCompleted: number;
  compassValidations: number;
  currentRank: string;
  nextRank: string;
  minutesToNextRank: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function calculateRank(totalMinutes: number): { current: string; next: string; minutesToNext: number } {
  const ranks = [
    { emoji: "🐛", name: "Bücherwürmchen", minutes: 0 },
    { emoji: "🐌", name: "Leseschnecke", minutes: 60 },
    { emoji: "🦗", name: "Lesefreund", minutes: 180 },
    { emoji: "🐝", name: "Lesebiene", minutes: 360 },
    { emoji: "🦋", name: "Buchfalter", minutes: 600 },
    { emoji: "🦅", name: "Leseadler", minutes: 1200 },
    { emoji: "🦉", name: "Büchereule", minutes: 2400 },
    { emoji: "🐉", name: "Lesedrache", minutes: 4800 },
    { emoji: "👑", name: "Lesekönig", minutes: 9600 },
  ];

  let currentRank = ranks[0];
  let nextRank = ranks[1];

  for (let i = 0; i < ranks.length; i++) {
    if (totalMinutes >= ranks[i].minutes) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || ranks[i];
    }
  }

  const minutesToNext = nextRank.minutes - totalMinutes;

  return {
    current: currentRank.emoji,
    next: nextRank.emoji,
    minutesToNext: Math.max(0, minutesToNext),
  };
}

// ============================================================================
// USER ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/user", async (c) => {
  try {
    const body = await c.req.json();
    const { userType } = body;

    if (!userType || !["oneChild", "multipleChildren", "adult"].includes(userType)) {
      return c.json({ error: "Invalid userType" }, 400);
    }

    const userId = generateId("user");
    const user: User = {
      id: userId,
      createdAt: new Date().toISOString(),
      userType,
    };

    await kv.set(`user:${userId}`, user);
    await kv.set(`profiles:${userId}`, []);

    console.log(`User created: ${userId}, type: ${userType}`);
    return c.json({ user }, 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

app.get("/make-server-e4c1b088/user/:id", async (c) => {
  try {
    const userId = c.req.param("id");
    const user = await kv.get<User>(`user:${userId}`);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// ============================================================================
// PROFILE ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/profile", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, name, emoji, avatar } = body;

    if (!userId || !name) {
      return c.json({ error: "userId and name are required" }, 400);
    }

    const profileId = generateId("profile");
    const profile: Profile = {
      id: profileId,
      userId,
      name,
      emoji: emoji || "🐛",
      avatar,
      currentRank: "🐛",
      totalReadingMinutes: 0,
      totalScreenMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`profile:${profileId}`, profile);

    // Add to user's profile list
    const profileIds = (await kv.get<string[]>(`profiles:${userId}`)) || [];
    profileIds.push(profileId);
    await kv.set(`profiles:${userId}`, profileIds);

    // Initialize empty arrays for profile data
    await kv.set(`sessions:${profileId}`, []);
    await kv.set(`activities:${profileId}`, []);
    await kv.set(`goals:${profileId}`, []);
    await kv.set(`compass:${profileId}`, []);

    // Initialize settings
    const settings: ProfileSettings = {
      profileId,
      readingRatio: 1,
      notificationsEnabled: false,
      theme: "light",
    };
    await kv.set(`settings:${profileId}`, settings);

    console.log(`Profile created: ${profileId} for user: ${userId}`);
    return c.json({ profile }, 201);
  } catch (error) {
    console.error("Error creating profile:", error);
    return c.json({ error: "Failed to create profile" }, 500);
  }
});

app.get("/make-server-e4c1b088/profiles/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profileIds = (await kv.get<string[]>(`profiles:${userId}`)) || [];

    const profiles: Profile[] = [];
    for (const profileId of profileIds) {
      const profile = await kv.get<Profile>(`profile:${profileId}`);
      if (profile) {
        profiles.push(profile);
      }
    }

    return c.json({ profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return c.json({ error: "Failed to fetch profiles" }, 500);
  }
});

app.get("/make-server-e4c1b088/profile/:id", async (c) => {
  try {
    const profileId = c.req.param("id");
    const profile = await kv.get<Profile>(`profile:${profileId}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

app.put("/make-server-e4c1b088/profile/:id", async (c) => {
  try {
    const profileId = c.req.param("id");
    const body = await c.req.json();
    const { name, emoji, avatar } = body;

    const profile = await kv.get<Profile>(`profile:${profileId}`);
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const updatedProfile: Profile = {
      ...profile,
      name: name || profile.name,
      emoji: emoji !== undefined ? emoji : profile.emoji,
      avatar: avatar !== undefined ? avatar : profile.avatar,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`profile:${profileId}`, updatedProfile);

    console.log(`Profile updated: ${profileId}`);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ============================================================================
// READING SESSION ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/session", async (c) => {
  try {
    const body = await c.req.json();
    const { profileId, duration, startedAt, note } = body;

    if (!profileId || !duration) {
      return c.json({ error: "profileId and duration are required" }, 400);
    }

    const sessionId = generateId("session");
    const session: ReadingSession = {
      id: sessionId,
      profileId,
      duration,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      note,
      compassValidated: false,
    };

    await kv.set(`session:${sessionId}`, session);

    // Add to profile's session list
    const sessionIds = (await kv.get<string[]>(`sessions:${profileId}`)) || [];
    sessionIds.push(sessionId);
    await kv.set(`sessions:${profileId}`, sessionIds);

    // Update profile stats
    const profile = await kv.get<Profile>(`profile:${profileId}`);
    if (profile) {
      const settings = await kv.get<ProfileSettings>(`settings:${profileId}`);
      const ratio = settings?.readingRatio || 1;
      const earnedScreenTime = duration * ratio;

      profile.totalReadingMinutes += duration;
      profile.totalScreenMinutes += earnedScreenTime;

      // Update rank
      const rankInfo = calculateRank(profile.totalReadingMinutes);
      profile.currentRank = rankInfo.current;
      profile.updatedAt = new Date().toISOString();

      await kv.set(`profile:${profileId}`, profile);
    }

    console.log(`Session created: ${sessionId} for profile: ${profileId}, duration: ${duration}min`);
    return c.json({ session }, 201);
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ error: "Failed to create session" }, 500);
  }
});

app.get("/make-server-e4c1b088/sessions/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const sessionIds = (await kv.get<string[]>(`sessions:${profileId}`)) || [];

    const sessions: ReadingSession[] = [];
    for (const sessionId of sessionIds) {
      const session = await kv.get<ReadingSession>(`session:${sessionId}`);
      if (session) {
        sessions.push(session);
      }
    }

    // Sort by completion date, newest first
    sessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    return c.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: "Failed to fetch sessions" }, 500);
  }
});

// ============================================================================
// ACTIVITY ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/activity", async (c) => {
  try {
    const body = await c.req.json();
    const { profileId, name, emoji, ratio, includeInReading } = body;

    if (!profileId || !name || ratio === undefined) {
      return c.json({ error: "profileId, name, and ratio are required" }, 400);
    }

    const activityId = generateId("activity");
    const activity: Activity = {
      id: activityId,
      profileId,
      name,
      emoji: emoji || "⭐",
      ratio,
      includeInReading: includeInReading || false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`activity:${activityId}`, activity);

    // Add to profile's activity list
    const activityIds = (await kv.get<string[]>(`activities:${profileId}`)) || [];
    activityIds.push(activityId);
    await kv.set(`activities:${profileId}`, activityIds);

    console.log(`Activity created: ${activityId} for profile: ${profileId}`);
    return c.json({ activity }, 201);
  } catch (error) {
    console.error("Error creating activity:", error);
    return c.json({ error: "Failed to create activity" }, 500);
  }
});

app.get("/make-server-e4c1b088/activities/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const activityIds = (await kv.get<string[]>(`activities:${profileId}`)) || [];

    const activities: Activity[] = [];
    for (const activityId of activityIds) {
      const activity = await kv.get<Activity>(`activity:${activityId}`);
      if (activity) {
        activities.push(activity);
      }
    }

    return c.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

app.put("/make-server-e4c1b088/activity/:id", async (c) => {
  try {
    const activityId = c.req.param("id");
    const body = await c.req.json();

    const activity = await kv.get<Activity>(`activity:${activityId}`);
    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    const updatedActivity: Activity = {
      ...activity,
      ...body,
    };

    await kv.set(`activity:${activityId}`, updatedActivity);

    console.log(`Activity updated: ${activityId}`);
    return c.json({ activity: updatedActivity });
  } catch (error) {
    console.error("Error updating activity:", error);
    return c.json({ error: "Failed to update activity" }, 500);
  }
});

app.delete("/make-server-e4c1b088/activity/:id", async (c) => {
  try {
    const activityId = c.req.param("id");
    const activity = await kv.get<Activity>(`activity:${activityId}`);

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    // Remove from profile's activity list
    const activityIds = (await kv.get<string[]>(`activities:${activity.profileId}`)) || [];
    const updatedIds = activityIds.filter((id) => id !== activityId);
    await kv.set(`activities:${activity.profileId}`, updatedIds);

    await kv.del(`activity:${activityId}`);

    console.log(`Activity deleted: ${activityId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return c.json({ error: "Failed to delete activity" }, 500);
  }
});

// ============================================================================
// GOAL ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/goal", async (c) => {
  try {
    const body = await c.req.json();
    const { profileId, title, emoji, targetMinutes, period } = body;

    if (!profileId || !title || !targetMinutes || !period) {
      return c.json({ error: "profileId, title, targetMinutes, and period are required" }, 400);
    }

    const goalId = generateId("goal");
    const goal: Goal = {
      id: goalId,
      profileId,
      title,
      emoji: emoji || "🎯",
      targetMinutes,
      currentMinutes: 0,
      period,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    await kv.set(`goal:${goalId}`, goal);

    // Add to profile's goal list
    const goalIds = (await kv.get<string[]>(`goals:${profileId}`)) || [];
    goalIds.push(goalId);
    await kv.set(`goals:${profileId}`, goalIds);

    console.log(`Goal created: ${goalId} for profile: ${profileId}`);
    return c.json({ goal }, 201);
  } catch (error) {
    console.error("Error creating goal:", error);
    return c.json({ error: "Failed to create goal" }, 500);
  }
});

app.get("/make-server-e4c1b088/goals/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const goalIds = (await kv.get<string[]>(`goals:${profileId}`)) || [];

    const goals: Goal[] = [];
    for (const goalId of goalIds) {
      const goal = await kv.get<Goal>(`goal:${goalId}`);
      if (goal) {
        goals.push(goal);
      }
    }

    return c.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return c.json({ error: "Failed to fetch goals" }, 500);
  }
});

app.put("/make-server-e4c1b088/goal/:id", async (c) => {
  try {
    const goalId = c.req.param("id");
    const body = await c.req.json();

    const goal = await kv.get<Goal>(`goal:${goalId}`);
    if (!goal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    const updatedGoal: Goal = {
      ...goal,
      ...body,
    };

    await kv.set(`goal:${goalId}`, updatedGoal);

    console.log(`Goal updated: ${goalId}`);
    return c.json({ goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    return c.json({ error: "Failed to update goal" }, 500);
  }
});

app.delete("/make-server-e4c1b088/goal/:id", async (c) => {
  try {
    const goalId = c.req.param("id");
    const goal = await kv.get<Goal>(`goal:${goalId}`);

    if (!goal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    // Remove from profile's goal list
    const goalIds = (await kv.get<string[]>(`goals:${goal.profileId}`)) || [];
    const updatedIds = goalIds.filter((id) => id !== goalId);
    await kv.set(`goals:${goal.profileId}`, updatedIds);

    await kv.del(`goal:${goalId}`);

    console.log(`Goal deleted: ${goalId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return c.json({ error: "Failed to delete goal" }, 500);
  }
});

// ============================================================================
// READING COMPASS ROUTES
// ============================================================================

app.post("/make-server-e4c1b088/compass", async (c) => {
  try {
    const body = await c.req.json();
    const { profileId, sessionId, photoUrl, questions } = body;

    if (!profileId || !sessionId || !questions) {
      return c.json({ error: "profileId, sessionId, and questions are required" }, 400);
    }

    const compassId = generateId("compass");
    const validation: CompassValidation = {
      id: compassId,
      profileId,
      sessionId,
      photoUrl,
      questions,
      validatedAt: new Date().toISOString(),
    };

    await kv.set(`compass:${compassId}`, validation);

    // Add to profile's compass list
    const compassIds = (await kv.get<string[]>(`compass:${profileId}`)) || [];
    compassIds.push(compassId);
    await kv.set(`compass:${profileId}`, compassIds);

    // Mark session as validated
    const session = await kv.get<ReadingSession>(`session:${sessionId}`);
    if (session) {
      session.compassValidated = true;
      await kv.set(`session:${sessionId}`, session);
    }

    console.log(`Compass validation created: ${compassId} for session: ${sessionId}`);
    return c.json({ validation }, 201);
  } catch (error) {
    console.error("Error creating compass validation:", error);
    return c.json({ error: "Failed to create compass validation" }, 500);
  }
});

app.get("/make-server-e4c1b088/compass/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const compassIds = (await kv.get<string[]>(`compass:${profileId}`)) || [];

    const validations: CompassValidation[] = [];
    for (const compassId of compassIds) {
      const validation = await kv.get<CompassValidation>(`compass:${compassId}`);
      if (validation) {
        validations.push(validation);
      }
    }

    // Sort by validation date, newest first
    validations.sort((a, b) => new Date(b.validatedAt).getTime() - new Date(a.validatedAt).getTime());

    return c.json({ validations });
  } catch (error) {
    console.error("Error fetching compass validations:", error);
    return c.json({ error: "Failed to fetch compass validations" }, 500);
  }
});

// ============================================================================
// SETTINGS ROUTES
// ============================================================================

app.get("/make-server-e4c1b088/settings/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const settings = await kv.get<ProfileSettings>(`settings:${profileId}`);

    if (!settings) {
      return c.json({ error: "Settings not found" }, 404);
    }

    return c.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

app.put("/make-server-e4c1b088/settings/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const body = await c.req.json();

    const settings = await kv.get<ProfileSettings>(`settings:${profileId}`);
    if (!settings) {
      return c.json({ error: "Settings not found" }, 404);
    }

    const updatedSettings: ProfileSettings = {
      ...settings,
      ...body,
    };

    await kv.set(`settings:${profileId}`, updatedSettings);

    console.log(`Settings updated for profile: ${profileId}`);
    return c.json({ settings: updatedSettings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

// ============================================================================
// STATISTICS ROUTES
// ============================================================================

app.get("/make-server-e4c1b088/stats/:profileId", async (c) => {
  try {
    const profileId = c.req.param("profileId");
    const profile = await kv.get<Profile>(`profile:${profileId}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const sessionIds = (await kv.get<string[]>(`sessions:${profileId}`)) || [];
    const compassIds = (await kv.get<string[]>(`compass:${profileId}`)) || [];

    const rankInfo = calculateRank(profile.totalReadingMinutes);

    const stats: ProfileStats = {
      profileId,
      totalReadingMinutes: profile.totalReadingMinutes,
      totalScreenMinutes: profile.totalScreenMinutes,
      currentStreak: 0, // TODO: Calculate based on sessions
      longestStreak: 0, // TODO: Calculate based on sessions
      sessionsCompleted: sessionIds.length,
      compassValidations: compassIds.length,
      currentRank: rankInfo.current,
      nextRank: rankInfo.next,
      minutesToNextRank: rankInfo.minutesToNext,
    };

    return c.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// ============================================================================
// OCR COMPREHENSION - GENERATE QUESTIONS FROM TEXT
// ============================================================================

interface GenerateQuestionsRequest {
  text: string;
  difficulty?: string;
  targetAge?: string;
}

interface Question {
  question: string;
  answer: string;
}

interface RateLimitInfo {
  remainingHour: number;
  remainingDay: number;
}

app.post("/make-server-e4c1b088/generate-questions", async (c) => {
  try {
    // 1. Get profileId from request body (no auth required for prototype)
    const body = (await c.req.json()) as GenerateQuestionsRequest & { profileId?: string };
    const profileId = body.profileId || 'guest';

    // 2. Rate Limiting - 5 pro Stunde, 20 pro Tag (per profileId)
    const now = new Date();
    const currentHour = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    const currentDay = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const hourKey = `ocr_limit_hour:${profileId}:${currentHour}`;
    const dayKey = `ocr_limit_day:${profileId}:${currentDay}`;

    const hourCount = (await kv.get<number>(hourKey)) || 0;
    const dayCount = (await kv.get<number>(dayKey)) || 0;

    if (hourCount >= 5) {
      return c.json(
        {
          error:
            "Stündliches Limit erreicht (5/5). Versuch es in der nächsten Stunde nochmal!",
          remainingHour: 0,
          remainingDay: Math.max(0, 20 - dayCount),
        },
        429
      );
    }

    if (dayCount >= 20) {
      return c.json(
        {
          error: "Tageslimit erreicht (20/20). Komm morgen wieder!",
          remainingHour: 0,
          remainingDay: 0,
        },
        429
      );
    }

    // 3. Input Validation
    const { text, difficulty = "mittel", targetAge = "Grundschule" } = body;

    if (!text || typeof text !== "string") {
      return c.json({ error: "Kein Text bereitgestellt" }, 400);
    }

    const cleanText = text.trim();

    if (cleanText.length < 10) {
      return c.json(
        { error: "Text zu kurz (mindestens 10 Zeichen erforderlich)" },
        400
      );
    }

    if (cleanText.length > 2000) {
      return c.json(
        { error: "Text zu lang (maximal 2000 Zeichen erlaubt)" },
        400
      );
    }

    // 4. Build Prompt für OpenRouter
    const prompt = buildPromptForQuestions(cleanText, difficulty, targetAge);

    // 5. OpenRouter API Call with Fallback Models
    console.log("🤖 Rufe OpenRouter API auf...");

    const openRouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterApiKey) {
      console.error("❌ OPENROUTER_API_KEY nicht gesetzt!");
      return c.json(
        { error: "Service-Konfiguration fehlt. Bitte kontaktiere den Support." },
        500
      );
    }

    // Liste von verfügbaren Models mit Fallback
    // Verwende kostenlose und zuverlässige Models von OpenRouter
    const models = [
      "mistralai/mistral-7b-instruct:free",     // Kostenlos, zuverlässig, gut für deutsche Texte
      "meta-llama/llama-3.2-3b-instruct:free",  // Kostenlos, schnell
      "google/gemma-2-9b-it:free",              // Kostenlos, gute Qualität
      "qwen/qwen-2-7b-instruct:free"            // Backup
    ];

    let aiData: any = null;
    let lastError: string = "";

    // Versuche Models nacheinander
    for (const model of models) {
      console.log(`📡 Versuche Model: ${model}`);

      try {
        const payload = {
          model: model,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 0.9,
        };

        const openRouterResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://lessscreen.app",
              "X-Title": "LessScreen"
            },
            body: JSON.stringify(payload),
          }
        );

        console.log(`📊 ${model} Response Status: ${openRouterResponse.status}`);

        if (openRouterResponse.ok) {
          aiData = await openRouterResponse.json();
          console.log(`✅ Erfolgreiche Antwort von ${model}`);
          console.log(`📄 Response Preview:`, JSON.stringify(aiData).substring(0, 300));
          break; // Erfolg! Verlasse die Schleife
        }

        // Fehlerbehandlung für verschiedene Status-Codes
        const errorText = await openRouterResponse.text();
        lastError = `Model: ${model}, Status: ${openRouterResponse.status}, Error: ${errorText.substring(0, 100)}`;
        
        console.error(`❌ ${model} Error ${openRouterResponse.status}:`, errorText.substring(0, 300));

        if (openRouterResponse.status === 503) {
          console.warn(`⏳ ${model} nicht verfügbar (503). Versuche nächstes Model...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 Sekunde Wartezeit
          continue; // Versuche nächstes Model
        }

        if (openRouterResponse.status === 404) {
          console.warn(`❌ ${model} nicht gefunden (404). Model existiert nicht.`);
          continue; // Versuche nächstes Model
        }

        if (openRouterResponse.status === 401 || openRouterResponse.status === 403) {
          console.error(`❌ API-Key Problem bei ${model}! Überprüfe OPENROUTER_API_KEY.`);
          // Versuche trotzdem nächstes Model
          continue;
        }
        
        if (openRouterResponse.status === 400) {
          console.error(`❌ ${model} Bad Request (400). Möglicherweise inkompatibler Prompt/Parameter.`);
          continue;
        }

        if (openRouterResponse.status === 429) {
          console.error(`❌ ${model} Rate Limit erreicht (429). Versuche nächstes Model...`);
          continue;
        }

        console.warn(`⚠️ ${model} fehler: ${openRouterResponse.status}. Versuche nächstes Model...`);
      } catch (fetchError) {
        console.error(`❌ Fehler beim Abruf von ${model}:`, fetchError);
        lastError = String(fetchError);
        continue; // Versuche nächstes Model
      }
    }

    // Wenn OpenRouter fehlgeschlagen ist, versuche HuggingFace Inference Providers als Fallback
    if (!aiData) {
      console.warn("⚠️ Alle OpenRouter Models fehlgeschlagen. Versuche HuggingFace Fallback...");
      
      const huggingfaceApiKey = Deno.env.get("HUGGINGFACE_API_KEY");
      
      if (huggingfaceApiKey) {
        console.log("🤗 HuggingFace API-Key gefunden. Versuche Inference Providers API...");
        
        // Kostenlose HuggingFace Models
        const hfModels = [
          "mistralai/Mistral-7B-Instruct-v0.2",
          "meta-llama/Llama-3.2-3B-Instruct",
          "microsoft/Phi-3-mini-4k-instruct"
        ];
        
        for (const hfModel of hfModels) {
          console.log(`🤗 Versuche HuggingFace Model: ${hfModel}`);
          
          try {
            const hfPayload = {
              model: hfModel,
              messages: [
                {
                  role: "user",
                  content: prompt
                }
              ],
              max_tokens: 800,
              temperature: 0.7,
            };
            
            // Neue Inference Providers API (ab Nov 2025 erforderlich)
            const hfResponse = await fetch(
              `https://router.huggingface.co/hf-inference/v1/chat/completions`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${huggingfaceApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(hfPayload),
              }
            );
            
            console.log(`📊 HuggingFace ${hfModel} Response Status: ${hfResponse.status}`);
            
            if (hfResponse.ok) {
              aiData = await hfResponse.json();
              console.log(`✅ Erfolgreiche Antwort von HuggingFace ${hfModel}`);
              console.log(`📄 HF Response Preview:`, JSON.stringify(aiData).substring(0, 300));
              break; // Erfolg!
            }
            
            const hfErrorText = await hfResponse.text();
            console.error(`❌ HuggingFace ${hfModel} Error ${hfResponse.status}:`, hfErrorText.substring(0, 300));
            
            // Warte kurz vor nächstem Versuch
            if (hfResponse.status === 503) {
              console.warn(`⏳ ${hfModel} lädt... Warte 2 Sekunden...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            continue; // Nächstes Model
          } catch (hfError) {
            console.error(`❌ HuggingFace ${hfModel} Fehler:`, hfError);
            continue;
          }
        }
        
        if (aiData) {
          console.log("✅ HuggingFace Fallback erfolgreich!");
        } else {
          console.warn("⚠️ Auch HuggingFace Models fehlgeschlagen.");
        }
      } else {
        console.warn("⚠️ HUGGINGFACE_API_KEY nicht gesetzt. Überspringe HuggingFace Fallback.");
      }
    }
    
    // Wenn auch HuggingFace fehlgeschlagen ist, verwende lokale Fallback-Fragen
    if (!aiData) {
      console.error("❌ Alle KI-Services fehlgeschlagen (OpenRouter + HuggingFace)!");
      console.error("📋 Getestete OpenRouter Models:", JSON.stringify(models, null, 2));
      console.error("🔍 Letzter OpenRouter Fehler:", lastError);
      console.error("🔑 OpenRouter API-Key vorhanden:", openRouterApiKey ? `Ja (${openRouterApiKey.substring(0, 10)}...)` : "Nein");
      console.error("🔑 HuggingFace API-Key vorhanden:", Deno.env.get("HUGGINGFACE_API_KEY") ? "Ja" : "Nein");
      
      // Analysiere den Fehler
      const isAuthError = lastError.includes("401") || lastError.includes("User not found");
      const errorReason = isAuthError 
        ? "API-Keys ungültig oder nicht verifiziert" 
        : "KI-Services vorübergehend nicht verfügbar";
      
      console.log("⚠️ VERWENDE INTELLIGENTEN LOKALEN FALLBACK-MODUS");
      console.log("💡 Grund:", errorReason);
      console.log("✨ Diese Fragen basieren auf dem erkannten Text und funktionieren offline.");
      
      const fallbackQuestions = generateFallbackQuestions(cleanText, difficulty, targetAge);
      
      const rateLimitInfo: RateLimitInfo = {
        remainingHour: 4 - hourCount,
        remainingDay: 19 - dayCount,
      };

      console.log(
        `✅ ${fallbackQuestions.length} Lokale Fallback-Fragen generiert für Profile ${profileId}. Remaining: ${rateLimitInfo.remainingHour}/5 (Stunde), ${rateLimitInfo.remainingDay}/20 (Tag)`
      );

      // Bestimme die richtige Warnung basierend auf dem Fehler
      const userFriendlyWarning = isAuthError
        ? "Demo-Modus aktiv: API-Keys müssen konfiguriert werden. Fragen werden lokal generiert."
        : "Demo-Modus aktiv: KI-Services vorübergehend nicht verfügbar. Fragen werden lokal generiert.";

      return c.json({
        questions: fallbackQuestions,
        ...rateLimitInfo,
        isFallback: true, // Kennzeichne als Fallback
        isDemoMode: true, // Neues Flag für Demo-Modus
        warning: userFriendlyWarning,
        debugInfo: {
          modelsAttempted: models.length,
          reason: isAuthError ? "API_KEYS_INVALID" : "ALL_SERVICES_UNAVAILABLE",
          hint: isAuthError 
            ? "Erstelle API-Keys auf openrouter.ai oder huggingface.co"
            : "Versuche es später erneut"
        }
      });
    }

    // 6. Parse Questions from Response
    let questions: Question[];
    try {
      questions = parseQuestionsFromOpenRouterResponse(aiData);
    } catch (parseError) {
      console.error("Fehler beim Parsen der Fragen:", parseError);
      return c.json(
        {
          error:
            "Fragengenerierung hat kein gültiges Format zurückgegeben. Bitte versuche es erneut.",
        },
        500
      );
    }

    // 7. Increment Rate Limits
    await kv.set(hourKey, hourCount + 1, { ex: 3600 }); // 1 hour TTL
    await kv.set(dayKey, dayCount + 1, { ex: 86400 }); // 24 hours TTL

    // 8. Return Questions with Rate Limit Info
    const rateLimitInfo: RateLimitInfo = {
      remainingHour: 4 - hourCount,
      remainingDay: 19 - dayCount,
    };

    console.log(
      `✅ ${questions.length} Fragen generiert für Profile ${profileId}. Remaining: ${rateLimitInfo.remainingHour}/5 (Stunde), ${rateLimitInfo.remainingDay}/20 (Tag)`
    );

    return c.json({
      questions,
      ...rateLimitInfo,
    });
  } catch (error) {
    console.error("❌ Fehler bei generate-questions:", error);
    return c.json(
      {
        error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
      },
      500
    );
  }
});

/**
 * Generiert Fallback-Fragen wenn KI nicht verfügbar ist
 * Für Prototyp-Testing - erlaubt App zu testen ohne funktionierende KI
 * 
 * Diese Funktion erstellt einfache, regelbasierte Fragen mit konkreten Antworten
 * basierend auf dem gelesenen Text.
 */
function generateFallbackQuestions(
  text: string,
  difficulty: string,
  targetAge: string
): Question[] {
  // Bereinige und analysiere den Text
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = cleanedText.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;
  
  // Extrahiere Schlüsselinformationen
  const firstSentence = sentences[0]?.trim() || cleanedText.substring(0, 100);
  const midSentence = sentences[Math.floor(sentences.length / 2)]?.trim() || cleanedText.substring(100, 200);
  const lastSentence = sentences[sentences.length - 1]?.trim() || cleanedText.substring(cleanedText.length - 100);
  
  // Finde längere Wörter (potenzielle Schlüsselwörter)
  const keyWords = words
    .filter(w => w.length > 5)
    .filter((w, i, arr) => arr.indexOf(w) === i) // Unique
    .slice(0, 5);
  
  // Generiere kontextuelle Fragen mit echten Antworten
  const questions: Question[] = [];
  
  // Frage 1: Hauptthema basierend auf Textanfang
  questions.push({
    question: "Worum geht es in diesem Text?",
    answer: `Der Text handelt von: ${firstSentence}. ${keyWords.length > 0 ? 'Wichtige Begriffe sind: ' + keyWords.slice(0, 3).join(', ') + '.' : ''}`
  });
  
  // Frage 2: Details aus der Mitte des Textes
  if (sentences.length > 1) {
    questions.push({
      question: "Welche wichtigen Informationen werden genannt?",
      answer: `Im Text steht: "${midSentence}". Der Text enthält insgesamt ${wordCount} Wörter und ${sentences.length} Sätze.`
    });
  } else {
    questions.push({
      question: "Was sind die wichtigsten Informationen im Text?",
      answer: `Der Text beschreibt: ${cleanedText.substring(0, 150)}${cleanedText.length > 150 ? '...' : ''}`
    });
  }
  
  // Frage 3: Schlussfolgerung oder Textende
  if (sentences.length > 2) {
    questions.push({
      question: "Wie endet der Text bzw. was ist die Schlussfolgerung?",
      answer: `Am Ende heißt es: "${lastSentence}"`
    });
  } else {
    // Alternative: Zählfrage
    questions.push({
      question: "Wie viele Wörter hat der gelesene Text ungefähr?",
      answer: `Der Text hat ${wordCount} Wörter.${keyWords.length > 0 ? ' Einige wichtige Begriffe sind: ' + keyWords.join(', ') + '.' : ''}`
    });
  }
  
  return questions;
}

/**
 * Baut den Prompt für die Fragengenerierung (OpenRouter)
 * Optimiert für gute deutsche Verständnisfragen
 */
function buildPromptForQuestions(
  text: string,
  difficulty: string,
  targetAge: string
): string {
  return `Du bist ein erfahrener Lehrer und erstellst Verständnisfragen auf Deutsch für Kinder.

**Zielgruppe:** ${targetAge}
**Schwierigkeitsgrad:** ${difficulty}

**Gelesener Text:**
"${text.substring(0, 500)}"

**Aufgabe:**
Erstelle genau 3 altersgerechte Verständnisfragen mit Antworten basierend auf dem Text.

**Wichtige Regeln:**
- Die Fragen müssen sich direkt auf den gelesenen Text beziehen
- Die Antworten müssen kurz und klar sein (1-2 Sätze)
- Verwende einfache, kindgerechte Sprache
- Stelle verschiedene Fragetypen (Was, Wer, Warum, Wie)

**Antwortformat:**
Antworte NUR mit einem JSON-Array in diesem exakten Format, ohne jegliche zusätzliche Erklärungen oder Markdown:

[
  {"question": "Erste Frage?", "answer": "Erste Antwort."},
  {"question": "Zweite Frage?", "answer": "Zweite Antwort."},
  {"question": "Dritte Frage?", "answer": "Dritte Antwort."}
]`;
}

/**
 * Parst die Fragen aus der OpenRouter Response
 */
function parseQuestionsFromOpenRouterResponse(aiData: any): Question[] {
  console.log("📋 Parsing OpenRouter Response Type:", typeof aiData, "Has choices:", !!aiData?.choices);
  
  let generatedText = "";
  
  // OpenRouter gibt Antworten im OpenAI-kompatiblen Format zurück
  if (aiData?.choices && Array.isArray(aiData.choices) && aiData.choices.length > 0) {
    const firstChoice = aiData.choices[0];
    generatedText = firstChoice.message?.content || firstChoice.text || "";
  } else if (typeof aiData === 'string') {
    // Fallback: Direkt ein String
    generatedText = aiData;
  } else {
    console.error("Unerwartetes OpenRouter Response Format:", JSON.stringify(aiData).substring(0, 300));
    throw new Error("Keine Daten von OpenRouter erhalten");
  }

  console.log("📝 Generated Text Preview:", generatedText.substring(0, 300));

  // Bereinige den Text von Markdown-Code-Blöcken falls vorhanden
  let cleanedText = generatedText.trim();
  
  // Entferne ```json ... ``` falls vorhanden
  cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Extrahiere JSON aus der Antwort - suche nach JSON-Array
  const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("Kein JSON-Array gefunden in:", generatedText.substring(0, 500));
    
    // Versuche alternatives Format zu parsen (manchmal gibt API Zeilen-getrennte Objekte zurück)
    const alternativeMatch = generatedText.match(/\{[\s\S]*\}/);
    if (alternativeMatch) {
      console.log("⚠️ Versuche alternatives JSON-Format zu parsen");
      try {
        const parsed = JSON.parse(alternativeMatch[0]);
        // Wenn es ein einzelnes Objekt ist, konvertiere zu Array
        return parseAndValidateQuestions([parsed]);
      } catch (e) {
        console.error("Alternatives Format auch fehlgeschlagen:", e);
      }
    }
    
    throw new Error("Kein gültiges JSON in der Antwort gefunden");
  }

  let questions: Question[];
  try {
    questions = JSON.parse(jsonMatch[0]) as Question[];
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    console.error("Problematic JSON:", jsonMatch[0].substring(0, 500));
    throw new Error("Ungültiges JSON-Format in der Antwort");
  }

  return parseAndValidateQuestions(questions);
}

/**
 * Validiert und normalisiert die geparsten Fragen
 */
function parseAndValidateQuestions(questions: any): Question[] {
  // Validierung
  if (!Array.isArray(questions)) {
    console.error("Geparste Daten sind kein Array:", typeof questions);
    throw new Error("Geparste Daten sind kein Array");
  }

  console.log(`✅ ${questions.length} Fragen geparst`);

  if (questions.length !== 3) {
    console.warn(
      `Erwartete 3 Fragen, erhielt ${questions.length}. Nehme erste 3 oder fülle auf.`
    );

    // Wenn mehr als 3, nehme nur erste 3
    if (questions.length > 3) {
      questions = questions.slice(0, 3);
    }

    // Wenn weniger als 3, fülle mit Platzhaltern auf
    while (questions.length < 3) {
      questions.push({
        question: "Was hast du aus dem Text gelernt?",
        answer: "Bitte lies den Text nochmal durch und überlege, was wichtig war.",
      });
    }
  }

  // Validiere jede Frage
  return questions.map((q, index) => {
    if (!q.question || !q.answer) {
      console.warn(`Frage ${index + 1} unvollständig:`, q);
      return {
        question: `Frage ${index + 1}: Was ist wichtig in diesem Text?`,
        answer: "Bitte lies den Text aufmerksam durch.",
      };
    }

    return {
      question: String(q.question).trim(),
      answer: String(q.answer).trim(),
    };
  });
}

// ============================================================================
// GET RATE LIMITS - Check remaining scans
// ============================================================================

app.get("/make-server-e4c1b088/rate-limits/:profileId", async (c) => {
  try {
    // Get profileId from URL parameter (no auth required for prototype)
    const profileId = c.req.param("profileId") || 'guest';

    const now = new Date();
    const currentHour = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    const currentDay = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const hourKey = `ocr_limit_hour:${profileId}:${currentHour}`;
    const dayKey = `ocr_limit_day:${profileId}:${currentDay}`;

    const hourCount = (await kv.get<number>(hourKey)) || 0;
    const dayCount = (await kv.get<number>(dayKey)) || 0;

    return c.json({
      remainingHour: Math.max(0, 5 - hourCount),
      remainingDay: Math.max(0, 20 - dayCount),
      usedHour: hourCount,
      usedDay: dayCount,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Rate Limits:", error);
    return c.json({ error: "Fehler beim Abrufen der Limits" }, 500);
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/make-server-e4c1b088/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================================================
// TEST OPENROUTER CONNECTION
// ============================================================================

app.get("/make-server-e4c1b088/test-openrouter", async (c) => {
  try {
    const openRouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!openRouterApiKey) {
      return c.json({
        success: false,
        apiKeyPresent: false,
        error: "OPENROUTER_API_KEY nicht gesetzt",
        hint: "Bitte API-Key in Supabase Environment Variables setzen"
      }, 500);
    }

    // Teste mit einem einfachen Prompt
    const testPrompt = "Antworte auf Deutsch: Sage Hallo und erkläre kurz was OpenRouter ist.";
    
    // Teste alle verfügbaren kostenlosen Models
    const testModels = [
      "mistralai/mistral-7b-instruct:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemma-2-9b-it:free",
      "qwen/qwen-2-7b-instruct:free"
    ];

    const results = [];
    
    for (const testModel of testModels) {
      console.log(`🧪 Teste Model: ${testModel}`);

      try {
        const payload = {
          model: testModel,
          messages: [
            {
              role: "user",
              content: testPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        };
        
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://lessscreen.app",
              "X-Title": "LessScreen"
            },
            body: JSON.stringify(payload),
          }
        );

        const responseText = await response.text();
        let previewText = responseText;
        
        // Extrahiere die Antwort wenn erfolgreich
        if (response.ok) {
          try {
            const jsonData = JSON.parse(responseText);
            if (jsonData.choices?.[0]?.message?.content) {
              previewText = jsonData.choices[0].message.content;
            }
          } catch (e) {
            // Falls JSON Parsing fehlschlägt, verwende den rohen Text
          }
        }
        
        results.push({
          model: testModel,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          preview: previewText.substring(0, 150)
        });

        console.log(`${response.ok ? '✅' : '❌'} ${testModel}: Status ${response.status}`);
        
        // Teste alle Models, nicht früh beenden
      } catch (error) {
        console.error(`❌ ${testModel} Network Error:`, error);
        results.push({
          model: testModel,
          status: 0,
          statusText: "Network Error",
          success: false,
          error: String(error).substring(0, 300)
        });
      }
    }

    const anySuccess = results.some(r => r.success);
    
    return c.json({
      success: anySuccess,
      apiKeyPresent: true,
      apiKeyPrefix: openRouterApiKey.substring(0, 8) + "...",
      modelsTesTested: results.length,
      results: results,
      message: anySuccess
        ? "✅ Mindestens ein OpenRouter Model funktioniert!" 
        : `❌ Alle ${results.length} Models fehlgeschlagen`
    });
  } catch (error) {
    console.error("Test-OpenRouter Fehler:", error);
    return c.json({
      success: false,
      apiKeyPresent: false,
      error: String(error),
      message: "❌ Test fehlgeschlagen"
    }, 500);
  }
});

Deno.serve(app.fetch);
