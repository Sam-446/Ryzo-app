import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Screen01 from "./pages/Screen01";
import Screen02 from "./pages/Screen02";
import Screen03 from "./pages/Screen03";
import Screen04 from "./pages/Screen04";
import Screen05 from "./pages/Screen05";
import Screen06 from "./pages/Screen06";
import Screen07 from "./pages/Screen07";
import Screen08 from "./pages/Screen08";
import Screen10 from "./pages/Screen10";
import Screen11 from "./pages/Screen11";
import Screen12 from "./pages/Screen12";
import Screen13 from "./pages/Screen13";
import Screen14 from "./pages/Screen14";
import Screen21 from "./pages/Screen21";
import Screen24 from "./pages/Screen24";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import NotFound from "./pages/not-found";
import ScreenBodyStats from "./pages/ScreenBodyStats";
import ScreenWeeklyPace from "./pages/ScreenWeeklyPace";
import ScreenFoodScanner from "./pages/ScreenFoodScanner";
import ScreenBarcodeScanner from "./pages/ScreenBarcodeScanner";
import ScreenSteps from "./pages/ScreenSteps";
import ScreenCoachGlow from "./pages/ScreenCoachGlow";

const queryClient = new QueryClient();

const PROTECTED_PATHS = [
  "/dashboard",
  "/dashboard-scroll",
  "/plan",
  "/progress",
  "/profile",
  "/scan-food",
  "/scan-barcode",
  "/steps",
  "/coach-glow",
];

const ONBOARDING_PATHS = [
  "/",
  "/goal",
  "/gender-age",
  "/body-stats",
  "/goal-weight",
  "/activity",
  "/weekly-pace",
  "/meal-routine",
  "/workout-time",
  "/barriers",
  "/plan-ready",
  "/congrats",
];

function Router() {
  const { isAuthenticated, loading, user } = useAuth();
  const [location, navigate] = useLocation();

  const isProtected = PROTECTED_PATHS.some((p) => location.startsWith(p));
  const isOnboarding = ONBOARDING_PATHS.some((p) => location === p);

  useEffect(() => {
    if (loading) return;

    // Not logged in trying to access protected page → send to login
    if (!isAuthenticated && isProtected) {
      navigate("/login");
      return;
    }

    // Logged in and on onboarding or root → check onboarding status then redirect
    if (isAuthenticated && isOnboarding) {
      import("./lib/supabase")
        .then(({ supabase }) =>
          supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("id", user!.id)
            .single()
        )
        .then(({ data }) => {
          if (data?.onboarding_complete) {
            navigate("/dashboard");
          }
          // else: stay on onboarding, user hasn't finished yet
        });
    }
  }, [loading, isAuthenticated, isProtected, isOnboarding, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-200 via-green-100 to-purple-200 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
          <img
            src="/assets/goku_main.png"
            alt="Goku"
            className="mx-auto mb-4"
            style={{ width: 80 }}
          />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (isProtected && !isAuthenticated) {
    return null;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginScreen} />
      <Route path="/signup" component={SignupScreen} />

      <Route path="/" component={Screen01} />
      <Route path="/goal" component={Screen02} />
      <Route path="/gender-age" component={Screen03} />
      <Route path="/body-stats" component={ScreenBodyStats} />
      <Route path="/goal-weight" component={Screen04} />
      <Route path="/activity" component={Screen05} />
      <Route path="/weekly-pace" component={ScreenWeeklyPace} />
      <Route path="/meal-routine" component={Screen06} />
      <Route path="/workout-time" component={Screen08} />
      <Route path="/barriers" component={Screen07} />
      <Route path="/plan-ready" component={Screen10} />
      <Route path="/congrats" component={Screen11} />

      <Route path="/dashboard" component={Screen12} />
      <Route path="/dashboard-scroll" component={Screen13} />
      <Route path="/plan" component={Screen14} />
      <Route path="/progress" component={Screen21} />
      <Route path="/profile" component={Screen24} />

      <Route path="/scan-food" component={ScreenFoodScanner} />
      <Route path="/scan-barcode" component={ScreenBarcodeScanner} />
      <Route path="/steps" component={ScreenSteps} />
      <Route path="/coach-glow" component={ScreenCoachGlow} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base="/">
        <AuthProvider>
          <Router />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
