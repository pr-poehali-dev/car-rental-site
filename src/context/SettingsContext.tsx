
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

// Типы для настроек системы
export interface SystemSettings {
  // Общие настройки
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  
  // Региональные настройки
  currency: string;
  locale: string;
  timezone: string;
  
  // Настройки уведомлений
  emailNotifications: boolean;
  smsNotifications: boolean;
  notifyOnNewBooking: boolean;
  notifyOnCancellation: boolean;
  
  // Настройки брендинга
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  favicon: string;
}

// Начальные значения настроек
const defaultSettings: SystemSettings = {
  // Общие настройки
  siteName: "АвтоПрокат",
  siteDescription: "Сервис аренды автомобилей",
  contactEmail: "info@autopro.ru",
  supportPhone: "+7 (800) 555-35-35",
  
  // Региональные настройки
  currency: "₽",
  locale: "ru-RU",
  timezone: "Europe/Moscow",
  
  // Настройки уведомлений
  emailNotifications: true,
  smsNotifications: false,
  notifyOnNewBooking: true,
  notifyOnCancellation: true,
  
  // Настройки брендинга
  primaryColor: "#3b82f6",
  secondaryColor: "#6366f1",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
};

// Интерфейс контекста настроек
interface SettingsContextProps {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<boolean>;
  loading: boolean;
}

// Создаем контекст
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Провайдер контекста
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Загрузка сохраненных настроек при инициализации
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь должен быть вызов API
        // const response = await settingsApi.getSettings();
        
        // Для демонстрации загружаем из localStorage
        const savedSettings = localStorage.getItem('system_settings');
        
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Функция для обновления настроек
  const updateSettings = async (newSettings: Partial<SystemSettings>): Promise<boolean> => {
    try {
      // Объединяем текущие настройки с новыми
      const updatedSettings = { ...settings, ...newSettings };
      
      // В реальном проекте здесь должен быть вызов API
      // await settingsApi.updateSettings(updatedSettings);
      
      // Для демонстрации сохраняем в localStorage
      localStorage.setItem('system_settings', JSON.stringify(updatedSettings));
      
      // Обновляем состояние
      setSettings(updatedSettings);
      
      toast({
        title: "Успешно",
        description: "Настройки системы обновлены",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки системы",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Хук для использования контекста настроек
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
