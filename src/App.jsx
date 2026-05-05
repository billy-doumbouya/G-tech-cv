// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Suspense, lazy, useEffect } from "react";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { ProtectedRoute, NotFoundPage } from "@/components/ProtectedRoute";

// ── Lazy pages ────────────────────────────────────────────
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const TemplatesPage = lazy(() => import("@/pages/TemplatesPage"));
const EditorPage = lazy(() => import("@/pages/EditorPage"));
const PaymentPage = lazy(() => import("@/pages/PaymentPage"));
const PaymentsPage = lazy(() => import("@/pages/PaymentsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const SuccessPage = lazy(() => import("@/pages/SuccessPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AdminUsersPage = lazy(() => import("@/pages/AdminUsersPage"));
const AdminPaymentsPage = lazy(() => import("@/pages/AdminPaymentsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));

// ── Page loader ───────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
        className="w-10 h-10 rounded-full"
        style={{ border: "3px solid #dbe5ff", borderTopColor: "#1e2ef5" }}
      />
    </div>
  );
}

// ── Session initializer ───────────────────────────────────
// Vérifie la session MongoDB au démarrage (cookie httpOnly)
function SessionInit() {
  const checkSession = useAuthStore((s) => s.checkSession);
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  return null;
}

// ── App ───────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <SessionInit />

      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            borderRadius: "14px",
            fontSize: "14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ─────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* ── Utilisateur authentifié ─────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Admin ────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute adminOnly>
                <AdminPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Alias /admin/cvs → dashboard admin */}
          <Route
            path="/admin/cvs"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* ── Fallbacks ─────────────────────────────────── */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
