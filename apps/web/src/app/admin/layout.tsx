import { ReactNode } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
