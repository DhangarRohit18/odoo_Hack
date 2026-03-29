import React, { Suspense, useEffect, useState, createContext, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// Create a context for PWA installation
const PWAContext = createContext<{ deferredPrompt: any, handleInstallClick: () => void }>({
  deferredPrompt: null,
  handleInstallClick: () => {}
});

export const usePWA = () => useContext(PWAContext);

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/employee/Dashboard'));
const SubmitExpense = React.lazy(() => import('@/pages/employee/SubmitExpense'));
const ExpenseHistory = React.lazy(() => import('@/pages/employee/ExpenseHistory'));
const ManagerApprovals = React.lazy(() => import('@/pages/manager/Approvals'));
const AdminPanel = React.lazy(() => import('@/pages/admin/AdminPanel'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Signup = React.lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = React.lazy(() => import('@/pages/auth/ForgotPassword'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true; 
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const router = createBrowserRouter([
  { path: "/login", element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense> },
  { path: "/signup", element: <Suspense fallback={<LoadingFallback />}><Signup /></Suspense> },
  { path: "/forgot-password", element: <Suspense fallback={<LoadingFallback />}><ForgotPassword /></Suspense> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
               <Suspense fallback={<LoadingFallback />}>
                 <Outlet />
               </Suspense>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    ),
    children: [
       { path: "dashboard", element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense> },
       { path: "submit-expense", element: <Suspense fallback={<LoadingFallback />}><SubmitExpense /></Suspense> },
       { path: "history", element: <Suspense fallback={<LoadingFallback />}><ExpenseHistory /></Suspense> },
       { path: "approvals", element: <Suspense fallback={<LoadingFallback />}><ManagerApprovals /></Suspense> },
       { path: "admin", element: <Suspense fallback={<LoadingFallback />}><AdminPanel /></Suspense> },
       { index: true, element: <Navigate to="/dashboard" replace /> },
    ]
  }
]);

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
        setShowInstallGuide(true);
    }
  };

  return (
    <PWAContext.Provider value={{ deferredPrompt, handleInstallClick }}>
      {isOffline && (
        <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm text-center flex items-center justify-center font-medium sticky top-0 z-50">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          You are offline. Data will sync automatically when connection is restored.
        </div>
      )}

      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-300 transform">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
              </div>
              <div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">Add to Home Screen</h3>
                 <p className="mt-3 text-gray-500 font-medium">For the best experience, install the app on your device.</p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-4 border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100">1</div>
                    <p className="text-sm font-semibold text-gray-700">Tap the <span className="text-indigo-600">Share icon</span> at the bottom of the screen.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100">2</div>
                    <p className="text-sm font-semibold text-gray-700">Scroll down and tap <span className="text-indigo-600">"Add to Home Screen"</span>.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100">3</div>
                    <p className="text-sm font-semibold text-gray-700">Tap <span className="text-indigo-600">Add</span> to install shortcut.</p>
                 </div>
              </div>

              <div className="pt-2">
                 <div className="relative flex items-center gap-4 px-4 py-3 bg-indigo-600/5 rounded-2xl border border-indigo-600/10">
                    <div className="text-indigo-600">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                       </svg>
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Android Direct Download</p>
                       <a 
                         href="/app-debug.apk" 
                         download 
                         className="text-sm font-bold text-gray-900 hover:underline"
                       >
                         Download APK File
                       </a>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
              >
                Got it!
              </button>
           </div>
        </div>
      )}

      <RouterProvider router={router} />
    </PWAContext.Provider>
  );
}

export default App;
