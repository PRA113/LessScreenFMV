/**
 * API Client for LessScreen Backend
 * 
 * This module provides a clean interface for all backend API calls.
 * All API keys and sensitive data are handled server-side only.
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e4c1b088`;

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  createdAt: string;
  userType: "oneChild" | "multipleChildren" | "adult";
}

export interface Profile {
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

export interface ReadingSession {
  id: string;
  profileId: string;
  duration: number;
  startedAt: string;
  completedAt: string;
  note?: string;
  compassValidated: boolean;
}

export interface Activity {
  id: string;
  profileId: string;
  name: string;
  emoji: string;
  ratio: number;
  includeInReading: boolean;
  createdAt: string;
}

export interface Goal {
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

export interface CompassValidation {
  id: string;
  profileId: string;
  sessionId: string;
  photoUrl?: string;
  questions: Array<{ question: string; answer: string }>;
  validatedAt: string;
}

export interface ProfileSettings {
  profileId: string;
  readingRatio: number;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
}

export interface ProfileStats {
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
// HTTP CLIENT
// ============================================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API Error (${response.status}): ${errorData.error || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// ============================================================================
// USER API
// ============================================================================

export const userAPI = {
  async create(userType: "oneChild" | "multipleChildren" | "adult"): Promise<User> {
    const response = await apiRequest<{ user: User }>('/user', {
      method: 'POST',
      body: JSON.stringify({ userType }),
    });
    return response.user;
  },

  async get(userId: string): Promise<User> {
    const response = await apiRequest<{ user: User }>(`/user/${userId}`);
    return response.user;
  },
};

// ============================================================================
// PROFILE API
// ============================================================================

export const profileAPI = {
  async create(data: {
    userId: string;
    name: string;
    emoji?: string;
    avatar?: string;
  }): Promise<Profile> {
    const response = await apiRequest<{ profile: Profile }>('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.profile;
  },

  async getAll(userId: string): Promise<Profile[]> {
    const response = await apiRequest<{ profiles: Profile[] }>(`/profiles/${userId}`);
    return response.profiles;
  },

  async get(profileId: string): Promise<Profile> {
    const response = await apiRequest<{ profile: Profile }>(`/profile/${profileId}`);
    return response.profile;
  },

  async update(profileId: string, data: {
    name?: string;
    emoji?: string;
    avatar?: string;
  }): Promise<Profile> {
    const response = await apiRequest<{ profile: Profile }>(`/profile/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.profile;
  },
};

// ============================================================================
// SESSION API
// ============================================================================

export const sessionAPI = {
  async create(data: {
    profileId: string;
    duration: number;
    startedAt?: string;
    note?: string;
  }): Promise<ReadingSession> {
    const response = await apiRequest<{ session: ReadingSession }>('/session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.session;
  },

  async getAll(profileId: string): Promise<ReadingSession[]> {
    const response = await apiRequest<{ sessions: ReadingSession[] }>(`/sessions/${profileId}`);
    return response.sessions;
  },
};

// ============================================================================
// ACTIVITY API
// ============================================================================

export const activityAPI = {
  async create(data: {
    profileId: string;
    name: string;
    emoji: string;
    ratio: number;
    includeInReading: boolean;
  }): Promise<Activity> {
    const response = await apiRequest<{ activity: Activity }>('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.activity;
  },

  async getAll(profileId: string): Promise<Activity[]> {
    const response = await apiRequest<{ activities: Activity[] }>(`/activities/${profileId}`);
    return response.activities;
  },

  async update(activityId: string, data: Partial<Activity>): Promise<Activity> {
    const response = await apiRequest<{ activity: Activity }>(`/activity/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.activity;
  },

  async delete(activityId: string): Promise<void> {
    await apiRequest<{ success: boolean }>(`/activity/${activityId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// GOAL API
// ============================================================================

export const goalAPI = {
  async create(data: {
    profileId: string;
    title: string;
    emoji: string;
    targetMinutes: number;
    period: "daily" | "weekly" | "monthly";
  }): Promise<Goal> {
    const response = await apiRequest<{ goal: Goal }>('/goal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.goal;
  },

  async getAll(profileId: string): Promise<Goal[]> {
    const response = await apiRequest<{ goals: Goal[] }>(`/goals/${profileId}`);
    return response.goals;
  },

  async update(goalId: string, data: Partial<Goal>): Promise<Goal> {
    const response = await apiRequest<{ goal: Goal }>(`/goal/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.goal;
  },

  async delete(goalId: string): Promise<void> {
    await apiRequest<{ success: boolean }>(`/goal/${goalId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// COMPASS API
// ============================================================================

export const compassAPI = {
  async create(data: {
    profileId: string;
    sessionId: string;
    photoUrl?: string;
    questions: Array<{ question: string; answer: string }>;
  }): Promise<CompassValidation> {
    const response = await apiRequest<{ validation: CompassValidation }>('/compass', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.validation;
  },

  async getAll(profileId: string): Promise<CompassValidation[]> {
    const response = await apiRequest<{ validations: CompassValidation[] }>(`/compass/${profileId}`);
    return response.validations;
  },
};

// ============================================================================
// SETTINGS API
// ============================================================================

export const settingsAPI = {
  async get(profileId: string): Promise<ProfileSettings> {
    const response = await apiRequest<{ settings: ProfileSettings }>(`/settings/${profileId}`);
    return response.settings;
  },

  async update(profileId: string, data: Partial<ProfileSettings>): Promise<ProfileSettings> {
    const response = await apiRequest<{ settings: ProfileSettings }>(`/settings/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.settings;
  },
};

// ============================================================================
// STATS API
// ============================================================================

export const statsAPI = {
  async get(profileId: string): Promise<ProfileStats> {
    const response = await apiRequest<{ stats: ProfileStats }>(`/stats/${profileId}`);
    return response.stats;
  },
};

// ============================================================================
// OCR COMPREHENSION API
// ============================================================================

export interface Question {
  question: string;
  answer: string;
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  remainingHour: number;
  remainingDay: number;
  isLoading?: boolean;
}

export interface RateLimitsResponse {
  remainingHour: number;
  remainingDay: number;
  usedHour: number;
  usedDay: number;
}

export const ocrAPI = {
  /**
   * Generiert Verständnisfragen aus einem Text
   * Nutzt profileId für Rate Limiting (kein Auth nötig für Prototyp)
   */
  async generateQuestions(
    text: string,
    profileId: string,
    options?: {
      difficulty?: string;
      targetAge?: string;
    }
  ): Promise<GenerateQuestionsResponse> {
    const response = await apiRequest<GenerateQuestionsResponse>(
      '/generate-questions',
      {
        method: 'POST',
        body: JSON.stringify({
          text,
          profileId,
          difficulty: options?.difficulty || 'mittel',
          targetAge: options?.targetAge || 'Grundschule',
        }),
      }
    );
    return response;
  },

  /**
   * Prüft verbleibende Rate Limits
   */
  async getRateLimits(profileId: string): Promise<RateLimitsResponse> {
    const response = await apiRequest<RateLimitsResponse>(
      `/rate-limits/${profileId}`,
      {
        method: 'GET',
      }
    );
    return response;
  },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthAPI = {
  async check(): Promise<{ status: string; timestamp: string }> {
    return await apiRequest<{ status: string; timestamp: string }>('/health');
  },
};
