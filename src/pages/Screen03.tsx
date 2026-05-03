import { useState } from "react";
import { useLocation } from "wouter";

export default function Screen03() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState("");
  const [, navigate] = useLocation();

  const canContinue =
    gender !== null &&
    age.trim() !== "" &&
    Number(age) >= 13 &&
    Number(age) <= 80;

  const handleContinue = () => {
    if (!canContinue) return;
    localStorage.setItem("onboarding_gender", gender!);
    localStorage.setItem("onboarding_age", age);
    navigate("/body-stats");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 pt-8"
      style={{
        background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)",
      }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Tell us about yourself
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Helps us calculate your exact calorie needs
        </p>

        <div className="mb-8">
          <p className="font-bold text-gray-700 mb-4">I am</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setGender("male")}
              className={`flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all active:scale-95 ${
                gender === "male"
                  ? "border-blue-400 bg-blue-100 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-blue-200"
              }`}
            >
              <span className="text-4xl mb-3">👨</span>
              <span className={`font-bold text-base ${
                gender === "male" ? "text-blue-600" : "text-gray-500"
              }`}>
                Male
              </span>
              {gender === "male" && (
                <span className="mt-2 text-blue-500 text-xs font-semibold">
                  ✓ Selected
                </span>
              )}
            </button>

            <button
              onClick={() => setGender("female")}
              className={`flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all active:scale-95 ${
                gender === "female"
                  ? "border-pink-400 bg-pink-100 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-pink-200"
              }`}
            >
              <span className="text-4xl mb-3">👩</span>
              <span className={`font-bold text-base ${
                gender === "female" ? "text-pink-600" : "text-gray-500"
              }`}>
                Female
              </span>
              {gender === "female" && (
                <span className="mt-2 text-pink-500 text-xs font-semibold">
                  ✓ Selected
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-bold text-gray-700 mb-3">My age</p>
          <div className={`flex items-center border-2 rounded-2xl px-5 py-4 transition-colors ${
            age && canContinue
              ? "border-teal-400 bg-teal-50"
              : "border-gray-200 bg-gray-50 focus-within:border-teal-200"
          }`}>
            <input
              type="number"
              placeholder="e.g. 22"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="13"
              max="80"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300 text-2xl font-bold"
            />
            <span className="text-gray-400 text-sm font-medium">years old</span>
          </div>
          {age && (Number(age) < 13 || Number(age) > 80) && (
            <p className="text-red-400 text-xs mt-2 ml-1">
              Please enter a valid age between 13 and 80
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-bold text-base transition-all ${
            canContinue
              ? "bg-teal-400 hover:bg-teal-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>

        {!canContinue && (
          <p className="text-center text-xs text-gray-300 mt-3">
            {!gender
              ? "Select your gender to continue"
              : "Enter a valid age to continue"}
          </p>
        )}
      </div>
    </div>
  );
}
