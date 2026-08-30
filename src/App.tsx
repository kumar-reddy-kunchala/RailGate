import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Sidebar } from "./components/Sidebar";
import { NotificationToast } from "./components/NotificationToast";

import { WelcomeScreen } from "./screens/WelcomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { FindLCScreen } from "./screens/FindLCScreen";
import { LCDetailsScreen } from "./screens/LCDetailsScreen";
import { ManagerDashboardScreen } from "./screens/ManagerDashboardScreen";
import { AdminDashboardScreen } from "./screens/AdminDashboardScreen";
import { AdminLCManagementScreen } from "./screens/AdminLCManagementScreen";
import { AdminManagersScreen } from "./screens/AdminManagersScreen";
import { AdminMappingScreen } from "./screens/AdminMappingScreen";
import { AdminFeedbackScreen } from "./screens/AdminFeedbackScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const MainRouter: React.FC = () => {
  const { currentScreen, user } = useAuth();

  const renderScreen = () => {
    // If not logged in, only allow WELCOME or LOGIN screens
    if (!user && currentScreen !== "WELCOME" && currentScreen !== "LOGIN") {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case "WELCOME":
        return <WelcomeScreen />;
      case "LOGIN":
        return <LoginScreen />;
      case "FIND_LC":
        return <FindLCScreen />;
      case "LC_DETAILS":
        return <LCDetailsScreen />;
      case "MY_LC":
        return <ManagerDashboardScreen />;
      case "ADMIN_DASHBOARD":
        return <AdminDashboardScreen />;
      case "ADMIN_LC":
        return <AdminLCManagementScreen />;
      case "ADMIN_MANAGERS":
        return <AdminManagersScreen />;
      case "ADMIN_MAPPING":
        return <AdminMappingScreen />;
      case "ADMIN_FEEDBACK":
        return <AdminFeedbackScreen />;
      case "PROFILE":
        return <ProfileScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  const isFullScreen = currentScreen === "LOGIN";
  const isAdminScreen = currentScreen.startsWith("ADMIN") && user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {!isFullScreen && <Header />}
      {isAdminScreen ? (
        <div className="flex flex-1">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div className="flex-1 min-w-0 bg-slate-50">{renderScreen()}</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">{renderScreen()}</div>
      )}
      <Footer />
      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

export default App;
