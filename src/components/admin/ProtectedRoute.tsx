
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "manager" | "customer";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Если проверка авторизации еще идет, показываем лоадер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль и роль пользователя не соответствует, перенаправляем
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Если все проверки пройдены, отображаем защищенный контент
  return <>{children}</>;
};

export default ProtectedRoute;
