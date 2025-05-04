
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, User, fetchMockApi, mockUsersData } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // В реальном проекте здесь будет вызов API
        // const response = await authApi.checkAuth();
        
        // Эмуляция проверки авторизации
        const token = localStorage.getItem('auth_token');
        const expires = localStorage.getItem('auth_expires');
        
        if (token && expires && Date.now() < parseInt(expires)) {
          // Эмулируем получение данных пользователя
          const admin = mockUsersData[0];
          setUser(admin);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция авторизации
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // В реальном проекте здесь будет вызов API
      // const response = await authApi.login({ email, password });
      
      // Эмуляция авторизации
      if (email === mockUsersData[0].email && password === "admin123") {
        const admin = mockUsersData[0];
        setUser(admin);
        
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 часа
        localStorage.setItem('auth_token', 'mock_admin_token');
        localStorage.setItem('auth_expires', expiresAt.toString());
        
        return true;
      } else if (email === mockUsersData[1].email && password === "manager123") {
        const manager = mockUsersData[1];
        setUser(manager);
        
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 часа
        localStorage.setItem('auth_token', 'mock_manager_token');
        localStorage.setItem('auth_expires', expiresAt.toString());
        
        return true;
      }
      
      toast({
        title: "Ошибка авторизации",
        description: "Неверный email или пароль",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить вход",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = async (): Promise<void> => {
    try {
      // В реальном проекте здесь будет вызов API
      // await authApi.logout();
      
      // Очищаем данные авторизации
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires');
      setUser(null);
      
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
