import { useLocation } from "wouter";

export default function Screen01() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-green-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6">
        <img
          src="/assets/goku_main.png"
          alt="Goku"
          style={{ width: 190, height: "auto", objectFit: "contain", flexShrink: 0 }}
        />
        <p className="text-center text-xl font-bold text-gray-900 leading-snug">
          Transform your body, your vibe, and your confidence and increase your aura.
        </p>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate("/goal")}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-full text-base transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
              <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45z"/>
            </svg>
            Continue with WA
          </button>
          <button
            onClick={() => navigate("/goal")}
            className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-full text-base transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full flex items-center justify-center gap-3 border-2 border-purple-200 text-gray-800 font-medium py-4 rounded-full text-base hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Continue with Email
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-600 font-medium py-4 rounded-full text-base hover:bg-purple-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}
