import React, { useState, useEffect } from "react";
import { LiquidNavBar } from "./components/LiquidNavBar";
import { OnboardingStart } from "./components/OnboardingStart";
import { OnboardingUserType } from "./components/OnboardingUserType";
import { OnboardingProfile } from "./components/OnboardingProfile";
import { OnboardingChildren } from "./components/OnboardingChildren";
import { OnboardingTutorial } from "./components/OnboardingTutorial";
import { OnboardingNotifications } from "./components/OnboardingNotifications";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";
import { SessionModal } from "./components/SessionModal";
import { ReadingCompass } from "./components/ReadingCompass";
import { ReadingRatioSettings } from "./components/ReadingRatioSettings";
import {
  ActivityManagement,
  Activity,
} from "./components/ActivityManagement";
import {
  GoalManagement,
  Goal,
} from "./components/GoalManagement";
import { AvatarSelection } from "./components/AvatarSelection";
import { ReadingTimer } from "./components/ReadingTimer";
import { ProfileEdit } from "./components/ProfileEdit";
import { NotificationSettings } from "./components/NotificationSettings";
import { PrivacyPlaceholder } from "./components/PrivacyPlaceholder";
import { SupportPlaceholder } from "./components/SupportPlaceholder";
import { AffiliateMarketingPopup } from "./components/AffiliateMarketingPopup";
import { BookRecommendationPopup } from "./components/BookRecommendationPopup";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

interface Profile {
  id: string;
  name: string;
  emoji?: string;
  avatar?: string;
}

interface ParentProfile {
  name: string;
  email?: string;
}

type OnboardingStep =
  | "start"
  | "userType"
  | "profile"
  | "children"
  | "tutorial"
  | "notifications"
  | "complete";
type AppTab = "dashboard" | "add" | "settings";
type SettingsView =
  | "main"
  | "ratio"
  | "activities"
  | "goals"
  | "profileEdit"
  | "notifications"
  | "privacy"
  | "support";

export default function App() {
  // Onboarding state
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("start");
  const [userType, setUserType] = useState<
    "oneChild" | "multipleChildren" | "adult" | null
  >(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] =
    useState<Profile | null>(null);

  // Parent profile (separate from children)
  const [parentProfile, setParentProfile] =
    useState<ParentProfile>({
      name: "Elternteil",
      email: undefined,
    });

  // App state
  const [activeTab, setActiveTab] =
    useState<AppTab>("dashboard");
  const [isSessionModalOpen, setIsSessionModalOpen] =
    useState(false);
  const [isReadingTimerOpen, setIsReadingTimerOpen] =
    useState(false);

  useEffect(() => {
    console.log(
      "⏱️ isReadingTimerOpen state changed:",
      isReadingTimerOpen,
    );
  }, [isReadingTimerOpen]);
  const [isReadingCompassOpen, setIsReadingCompassOpen] =
    useState(false);
  const [isAffiliatePopupOpen, setIsAffiliatePopupOpen] =
    useState(false);
  const [
    isBookRecommendationPopupOpen,
    setIsBookRecommendationPopupOpen,
  ] = useState(false);
  const [settingsView, setSettingsView] =
    useState<SettingsView>("main");

  // Activities state
  const [activities, setActivities] = useState<Activity[]>([]);

  // Goals state
  const [goals, setGoals] = useState<Goal[]>([]);

  // Onboarding handlers
  const handleUserTypeSelect = (
    type: "oneChild" | "multipleChildren" | "adult",
  ) => {
    setUserType(type);

    if (type === "multipleChildren") {
      // Skip single profile creation, go directly to children screen
      setOnboardingStep("children");
    } else {
      // Create single profile (child or adult)
      setOnboardingStep("profile");
    }
  };

  const handleProfileCreate = (name: string) => {
    const START_RANK_EMOJI = "🐛"; // Bücherwürmchen - Anfangs-Rang

    const newProfile: Profile = {
      id: userType === "adult" ? "adult-1" : "child-1",
      name,
      emoji:
        userType === "oneChild" ? START_RANK_EMOJI : undefined,
    };

    setProfiles([newProfile]);
    setCurrentProfile(newProfile);
    setOnboardingStep("tutorial");
  };

  const handleChildrenCreate = (
    children: { id: string; name: string }[],
  ) => {
    const START_RANK_AVATARS = [
      "🐛",
      "🪲",
      "🐌",
      "🦗",
      "🐜",
      "🪰",
    ]; // Bücherwürmchen-Avatare
    const childProfiles: Profile[] = children.map(
      (child, index) => ({
        id: child.id,
        name: child.name,
        emoji:
          START_RANK_AVATARS[index % START_RANK_AVATARS.length],
      }),
    );
    setProfiles(childProfiles);
    setCurrentProfile(childProfiles[0]); // Set first child as current
    setOnboardingStep("tutorial");
  };

  const handleSessionAdd = (duration: number, note: string) => {
    setIsSessionModalOpen(false);
    setIsReadingCompassOpen(true);
    toast.success(
      `Session gespeichert: ${duration} Minuten gelesen! 🎉`,
      {
        description: note || "Weiter so!",
      },
    );
  };

  const handleTimerComplete = (duration: number) => {
    console.log(
      "🔥 handleTimerComplete called! Duration:",
      duration,
    );
    console.trace("Stack trace:");
    setIsReadingTimerOpen(false);
    setIsReadingCompassOpen(true);
    toast.success(
      `Lesezeit abgeschlossen: ${duration} Minuten! 🎉`,
      {
        description: "Super gemacht!",
      },
    );
  };

  const handleBookCompleted = () => {
    setIsReadingCompassOpen(false);
    setIsBookRecommendationPopupOpen(true);
    toast.success("Buch beendet! 🏆", {
      description: "Schau dir unsere Empfehlungen an!",
    });
  };

  const handleTabChange = (tab: AppTab) => {
    console.log("🔄 handleTabChange called with tab:", tab);
    if (tab === "add") {
      console.log("✅ Opening Reading Timer...");
      setIsReadingTimerOpen(true);
    } else {
      console.log("📑 Switching to tab:", tab);
      setActiveTab(tab);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, avatar };
      const updatedProfiles = profiles.map((p) =>
        p.id === currentProfile.id ? updatedProfile : p,
      );
      setProfiles(updatedProfiles);
      setCurrentProfile(updatedProfile);
      setSettingsView("main");
      toast.success("Avatar aktualisiert! 🎉", {
        description: `Dein neuer Avatar: ${avatar}`,
      });
    }
  };

  // Render onboarding
  if (onboardingStep !== "complete") {
    return (
      <>
        {onboardingStep === "start" && (
          <OnboardingStart
            onNext={() => setOnboardingStep("userType")}
          />
        )}
        {onboardingStep === "userType" && (
          <OnboardingUserType onNext={handleUserTypeSelect} />
        )}
        {onboardingStep === "profile" &&
          userType &&
          userType !== "multipleChildren" && (
            <OnboardingProfile
              userType={userType}
              onNext={handleProfileCreate}
            />
          )}
        {onboardingStep === "children" && (
          <OnboardingChildren
            onComplete={handleChildrenCreate}
          />
        )}
        {onboardingStep === "tutorial" && (
          <OnboardingTutorial
            onComplete={() =>
              setOnboardingStep("notifications")
            }
          />
        )}
        {onboardingStep === "notifications" && (
          <OnboardingNotifications
            onComplete={() => setOnboardingStep("complete")}
            onSkip={() => setOnboardingStep("complete")}
          />
        )}
      </>
    );
  }

  // Render main app
  if (!currentProfile) return null;

  // Settings screens
  if (activeTab === "settings") {
    if (settingsView === "ratio") {
      return (
        <>
          <ReadingRatioSettings
            onBack={() => setSettingsView("main")}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "activities") {
      return (
        <>
          <ActivityManagement
            onBack={() => setSettingsView("main")}
            activities={activities}
            onActivitiesChange={setActivities}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "goals") {
      return (
        <>
          <GoalManagement
            onBack={() => setSettingsView("main")}
            goals={goals}
            onGoalsChange={setGoals}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "profileEdit") {
      return (
        <>
          <ProfileEdit
            currentName={parentProfile.name}
            currentEmail={parentProfile.email}
            onBack={() => setSettingsView("main")}
            onProfileUpdated={(name, email) => {
              setParentProfile({ name, email });
              setSettingsView("main");
            }}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "notifications") {
      return (
        <>
          <NotificationSettings
            onBack={() => setSettingsView("main")}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "privacy") {
      return (
        <>
          <PrivacyPlaceholder
            onBack={() => setSettingsView("main")}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    if (settingsView === "support") {
      return (
        <>
          <SupportPlaceholder
            onBack={() => setSettingsView("main")}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Toaster position="top-center" />
        </>
      );
    }

    return (
      <>
        <div className="relative min-h-screen">
          <Settings
            userName={parentProfile.name}
            onNavigateToRatio={() => setSettingsView("ratio")}
            onNavigateToActivities={() =>
              setSettingsView("activities")
            }
            onNavigateToGoals={() => setSettingsView("goals")}
            onNavigateToProfileEdit={() =>
              setSettingsView("profileEdit")
            }
            onNavigateToNotifications={() =>
              setSettingsView("notifications")
            }
            onNavigateToPrivacy={() =>
              setSettingsView("privacy")
            }
            onNavigateToSupport={() =>
              setSettingsView("support")
            }
            onNavigateToAffiliate={() =>
              setIsAffiliatePopupOpen(true)
            }
            onOpenReadingCompass={() => {
              console.log(
                "Opening Reading Compass from Settings...",
              );
              setIsReadingCompassOpen(true);
            }}
          />
          <LiquidNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Global Modals - Available from ALL tabs including Settings */}
        <ReadingTimer
          isOpen={isReadingTimerOpen}
          onClose={() => {
            console.log("❌ ReadingTimer onClose called!");
            console.trace("Stack trace:");
            setIsReadingTimerOpen(false);
          }}
          onComplete={handleTimerComplete}
          profileName={currentProfile.name}
        />

        <ReadingCompass
          isOpen={isReadingCompassOpen}
          onClose={() => setIsReadingCompassOpen(false)}
          profileName={currentProfile.name}
          profileId={currentProfile.id}
          onBookCompleted={handleBookCompleted}
        />

        <AffiliateMarketingPopup
          isOpen={isAffiliatePopupOpen}
          onClose={() => setIsAffiliatePopupOpen(false)}
        />

        <BookRecommendationPopup
          isOpen={isBookRecommendationPopupOpen}
          onClose={() =>
            setIsBookRecommendationPopupOpen(false)
          }
          profileName={currentProfile?.name || ""}
        />

        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-screen">
        {activeTab === "dashboard" && (
          <Dashboard
            profiles={profiles}
            currentProfile={currentProfile}
            onProfileChange={setCurrentProfile}
            activities={activities}
            goals={goals}
            onOpenAffiliatePopup={() =>
              setIsAffiliatePopupOpen(true)
            }
            onOpenReadingCompass={() =>
              setIsReadingCompassOpen(true)
            }
            onOpenActivityManagement={() => {
              setActiveTab("settings");
              setSettingsView("activities");
            }}
          />
        )}

        <LiquidNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Global Modals - Available from ALL tabs */}
      <ReadingTimer
        isOpen={isReadingTimerOpen}
        onClose={() => {
          console.log("❌ ReadingTimer onClose called!");
          console.trace("Stack trace:");
          setIsReadingTimerOpen(false);
        }}
        onComplete={handleTimerComplete}
        profileName={currentProfile.name}
      />

      <ReadingCompass
        isOpen={isReadingCompassOpen}
        onClose={() => setIsReadingCompassOpen(false)}
        profileName={currentProfile.name}
        profileId={currentProfile.id}
        onBookCompleted={handleBookCompleted}
      />

      <BookRecommendationPopup
        isOpen={isBookRecommendationPopupOpen}
        onClose={() => setIsBookRecommendationPopupOpen(false)}
        profileName={currentProfile.name}
      />

      <AffiliateMarketingPopup
        isOpen={isAffiliatePopupOpen}
        onClose={() => setIsAffiliatePopupOpen(false)}
      />

      <Toaster position="top-center" />
    </>
  );
}