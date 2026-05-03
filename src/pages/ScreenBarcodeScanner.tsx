import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export default function ScreenBarcodeScanner() {
  const [, navigate] = useLocation();
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfNotified();
  }, []);

  const checkIfNotified = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("feature_interests")
      .select("id")
      .eq("user_id", user.id)
      .eq("feature_name", "barcode_scanner")

    if (data && data.length > 0) setNotified(true);
    setLoading(false);
  };

  const handleNotify = async () => {
    if (loading || notified) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { error } = await supabase.from("feature_interests").insert({
      user_id: user.id,
      feature_name: "barcode_scanner",
    });

    if (!error) setNotified(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <p className="font-bold text-gray-900 text-base">Barcode Scanner</p>
        </div>

        {/* What It Does */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-2xl p-4">
            <p className="font-bold text-gray-900 text-sm mb-3">
              📦 How it works
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">1️⃣</span>
                <p className="text-gray-600 text-sm">
                  Scan the barcode on any packaged food — biscuits, protein bars, juices, anything.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">2️⃣</span>
                <p className="text-gray-600 text-sm">
                  App instantly pulls full nutrition info from our food database.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">3️⃣</span>
                <p className="text-gray-600 text-sm">
                  Macros and calories added to your daily log. No guessing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fake Barcode Viewfinder */}
        <div className="px-4 mb-4">
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden" style={{ height: 280 }}>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1 opacity-20">
                  {Array(20).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-sm"
                      style={{ width: i % 3 === 0 ? 4 : 2, height: 60 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute left-8 right-8 h-0.5 bg-blue-400/50 top-1/2" />

            <div className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <span className="text-3xl mb-2">🔒</span>
              <p className="text-white font-bold text-lg">Coming Soon</p>
              <p className="text-white/60 text-xs mt-1">Barcode scanning is in development</p>
            </div>
          </div>
        </div>

        {/* Notify Button */}
        <div className="px-4">
          <button
            onClick={handleNotify}
            disabled={loading || notified}
            className={`
              w-full py-4 rounded-full font-bold text-sm transition-all
              ${notified ? "bg-green-500 text-white" : loading ? "opacity-60 text-gray-800" : "animate-pulse text-gray-800"}
            `}
            style={!notified && !loading ? { background: "linear-gradient(90deg, #e5d87a, #c9b84a)" } : {}}
          >
            {notified
              ? "✓ We'll notify you when it's ready"
              : loading
              ? "Checking..."
              : "Notify me when it arrives"}
          </button>

          {notified && (
            <p className="text-center text-gray-400 text-xs mt-3">
              You're on the list. We'll let you know first.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
