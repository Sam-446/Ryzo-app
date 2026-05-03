import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface ProfileData {
  name: string;
  age: number | null;
  gender: string;
  current_weight: number | null;
  weight_unit: string;
  height: number | null;
  height_unit: string;
  goal_weight: number | null;
  primary_goal: string;
  activity_level: string;
  diet_type: string;
  plan_type: string;
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss: "Lose Fat 🔥",
  lose_fat: "Lose Fat 🔥",
  "lose-fat": "Lose Fat 🔥",
  muscle_gain: "Gain Muscle 💪",
  gain_muscle: "Gain Muscle 💪",
  maintain: "Maintain Weight ⚖️",
};

export default function Screen24() {
  const [, navigate] = useLocation();
  const { signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editWeight, setEditWeight] = useState("");
  const [editGoalWeight, setEditGoalWeight] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPlanMessage, setShowPlanMessage] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, age, gender, current_weight, weight_unit, height, height_unit, goal_weight, primary_goal, activity_level, diet_type, plan_type")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        return;
      }

      setProfile({
        name:           data.name || "User",
        age:            data.age,
        gender:         data.gender || "male",
        current_weight: data.current_weight,
        weight_unit:    data.weight_unit || "kg",
        height:         data.height,
        height_unit:    data.height_unit || "cm",
        goal_weight:    data.goal_weight,
        primary_goal:   data.primary_goal || "maintain",
        activity_level: data.activity_level || "moderately_active",
        diet_type:      data.diet_type || "non_veg",
        plan_type:      data.plan_type || "free",
      });

      setEditWeight(String(data.current_weight || ""));
      setEditGoalWeight(String(data.goal_weight || ""));
      setEditHeight(String(data.height || ""));
    } catch (err) {
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        current_weight: parseFloat(editWeight) || profile.current_weight,
        goal_weight:    parseFloat(editGoalWeight) || profile.goal_weight,
        height:         parseFloat(editHeight) || profile.height,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        setProfile((prev) => prev ? { ...prev, ...updates } : prev);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  const goalLabel = profile ? (GOAL_LABELS[profile.primary_goal] || "Maintain Weight ⚖️") : "";
  const dietLabel = profile?.diet_type?.includes("veg") && !profile?.diet_type?.includes("non")
    ? "Vegetarian 🥗"
    : "Non-Vegetarian 🍗";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <p className="text-gray-500">Could not load profile</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-[#f5f0eb] flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4">

          {/* Header */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/goku_main.png"
                  alt="Goku"
                  style={{ width: 52, height: "auto", objectFit: "contain" }}
                />
                <div>
                  <p className="font-bold text-gray-900 text-base">{profile.name}</p>
                  <p className="text-gray-400 text-sm">Keep vibing! 🔥</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {profile.plan_type === "pro" ? (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">PRO</span>
                ) : (
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">Age</p>
                    <p className="font-bold text-gray-900 text-base">{profile.age || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Current Weight</p>
                    <p className="font-bold text-gray-900 text-base">
                      {profile.current_weight || "—"} {profile.weight_unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Height</p>
                    <p className="font-bold text-gray-900 text-base">
                      {profile.height || "—"} {profile.height_unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Goal Weight</p>
                    <p className="font-bold text-gray-900 text-base">
                      {profile.goal_weight || "—"} {profile.weight_unit}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-400 text-xs mb-1">Primary Goal</p>
                  <p className="text-orange-500 font-bold text-sm mb-2">{goalLabel}</p>

                  <p className="text-gray-400 text-xs mb-1">Diet Type</p>
                  <p className="text-gray-700 font-semibold text-sm mb-2">{dietLabel}</p>

                  <p className="text-gray-400 text-xs mb-1">Current Plan</p>
                  <p className="text-orange-500 font-bold text-sm">Aura Bro Split</p>
                </div>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-800 text-sm mb-3">Edit Your Stats</p>

                <div className="mb-3">
                  <p className="text-gray-500 text-xs mb-1">
                    Current Weight ({profile.weight_unit})
                  </p>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                    placeholder="e.g. 75"
                  />
                </div>

                <div className="mb-3">
                  <p className="text-gray-500 text-xs mb-1">
                    Height ({profile.height_unit})
                  </p>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                    placeholder="e.g. 175"
                  />
                </div>

                <div className="mb-3">
                  <p className="text-gray-500 text-xs mb-1">
                    Goal Weight ({profile.weight_unit})
                  </p>
                  <input
                    type="number"
                    value={editGoalWeight}
                    onChange={(e) => setEditGoalWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                    placeholder="e.g. 70"
                  />
                </div>
              </>
            )}

            <button
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
              disabled={saving}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full text-sm transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="w-full mt-2 border border-gray-300 text-gray-500 font-bold py-2.5 rounded-full text-sm"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Edit Plan */}
          <button
            onClick={() => setShowPlanMessage(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full text-sm transition-colors mb-3"
          >
            Edit Plan
          </button>

          {/* Upgrade to Pro */}
          {profile.plan_type !== "pro" && (
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full text-sm transition-colors mb-3">
              ⭐ Upgrade to Pro
            </button>
          )}

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="w-full border-2 border-red-200 text-red-500 font-bold py-3 rounded-full text-sm transition-colors hover:bg-red-50 mb-4"
          >
            Log Out
          </button>

          {/* Plan message modal */}
          {showPlanMessage && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                <p className="text-gray-900 font-bold text-base mb-2">Edit Plan</p>
                <p className="text-gray-600 text-sm mb-4">
                  Plan customization is a Pro feature. Upgrade to Pro to regenerate your plan anytime.
                </p>
                <button
                  onClick={() => setShowPlanMessage(false)}
                  className="w-full bg-orange-500 text-white font-bold py-2 rounded-full text-sm"
                >
                  Got it
                </button>
              </div>
            </div>
          )}

        </div>
        <BottomNav active="profile" />
      </div>
    </div>
  );
}
