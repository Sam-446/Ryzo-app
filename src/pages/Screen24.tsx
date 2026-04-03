import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "../components/BottomNav";
import { userProfile } from "../data/userProfile";
import { useAuth } from "../context/AuthContext";

const save = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
const load = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export default function Screen24() {
  const [, navigate] = useLocation();
  const { signOut, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(() => load("profile_userProfile", userProfile));
  const [showPlanMessage, setShowPlanMessage] = useState(false);

  useEffect(() => { save("profile_userProfile", editedProfile); }, [editedProfile]);

  const handleEditChange = (field: string, value: any) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <div className="h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-[#f5f0eb] flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4">

          {/* ── Profile header card ── */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/goku_main.png" alt="Goku" style={{ width: 52, height: "auto", objectFit: "contain" }} />
                <div>
                  <p className="font-bold text-gray-900 text-base">{userProfile.name}</p>
                  <p className="text-gray-400 text-sm">Keep vibing!</p>
                </div>
              </div>
              <button className="text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Stats card ── */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            {!isEditing ? (
              <>
                <div className="flex justify-end mb-2">
                  <div>
                    <p className="text-gray-400 text-xs text-right">Current Weight:</p>
                    <p className="font-bold text-gray-900 text-lg text-right">{editedProfile.currentWeight} {editedProfile.weightUnit}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Height:</p>
                      <p className="font-bold text-gray-900 text-base">{editedProfile.height} {editedProfile.heightUnit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Goal Weight:</p>
                      <p className="font-bold text-gray-900 text-base">{editedProfile.goalWeight} {editedProfile.weightUnit}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <p className="text-gray-800 font-bold text-sm mb-1">Current Plan:</p>
                  <p className="text-orange-500 font-bold text-sm mb-2">{editedProfile.dietType}</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-gray-700"
                    style={{ background: "#f5d563" }}>
                    🍱 {editedProfile.mealsPerDay} meals/day
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <p className="text-gray-700 text-xs mb-1">Current Weight ({editedProfile.weightUnit})</p>
                  <input
                    type="number"
                    value={editedProfile.currentWeight}
                    onChange={(e) => handleEditChange("currentWeight", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="mb-3">
                  <p className="text-gray-700 text-xs mb-1">Height ({editedProfile.heightUnit})</p>
                  <input
                    type="number"
                    value={editedProfile.height}
                    onChange={(e) => handleEditChange("height", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="mb-3">
                  <p className="text-gray-700 text-xs mb-1">Goal Weight ({editedProfile.weightUnit})</p>
                  <input
                    type="number"
                    value={editedProfile.goalWeight}
                    onChange={(e) => handleEditChange("goalWeight", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </>
            )}

            <button
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full text-sm transition-colors"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* ── Edit Plan ── */}
          <button
            onClick={() => setShowPlanMessage(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full text-sm transition-colors mb-4"
          >
            Edit Plan
          </button>

          {isAuthenticated && (
            <button
              onClick={async () => { await signOut(); navigate("/login"); }}
              className="w-full border-2 border-red-200 text-red-500 font-bold py-3 rounded-full text-sm transition-colors hover:bg-red-50 mb-4"
            >
              Log Out
            </button>
          )}

          {showPlanMessage && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm">
                <p className="text-gray-900 font-bold text-base mb-2">Edit Plan</p>
                <p className="text-gray-600 text-sm mb-4">Plan customization coming soon. You can retake the onboarding quiz to change your plan.</p>
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
