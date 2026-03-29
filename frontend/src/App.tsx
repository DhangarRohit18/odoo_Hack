import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/employee/Dashboard';
import SubmitExpense from '@/pages/employee/SubmitExpense';
import ExpenseHistory from '@/pages/employee/ExpenseHistory';
import ManagerApprovals from '@/pages/manager/Approvals';
import AdminPanel from '@/pages/admin/AdminPanel';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true; 
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
               <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    ),
    children: [
       { path: "dashboard", element: <Dashboard /> },
       { path: "submit-expense", element: <SubmitExpense /> },
       { path: "history", element: <ExpenseHistory /> },
       { path: "approvals", element: <ManagerApprovals /> },
       { path: "admin", element: <AdminPanel /> },
       { index: true, element: <Navigate to="/dashboard" replace /> },
    ]
  }
]);

import { Outlet } from 'react-router-dom';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
