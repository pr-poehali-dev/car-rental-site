
import { toast } from "@/components/ui/use-toast";

// Базовый URL для API
const API_BASE_URL = "https://api.autopro.ru/v1";

// Типы данных для API
export interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  rating?: number;
  year: number;
  transmission: string;
  fuel: string;
  engine?: string;
  drive?: string;
  consumption?: string;
  seats?: number;
  color?: string;
  location?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Общая функция для выполнения API-запросов
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Добавляем заголовки по умолчанию
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    // В реальном проекте здесь может быть добавление авторизационных токенов
    // headers.Authorization = `Bearer ${getAuthToken()}`;
    
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Если статус не OK, выбрасываем ошибку
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return { 
      data: data.data || data, 
      success: true 
    };
  } catch (error) {
    console.error("API Error:", error);
    
    // Показываем уведомление об ошибке
    toast({
      title: "Ошибка API",
      description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
      variant: "destructive"
    });
    
    // Возвращаем объект с информацией об ошибке
    return {
      data: {} as T,
      success: false,
      message: error instanceof Error ? error.message : "Произошла неизвестная ошибка"
    };
  }
}

// API функции для работы с автомобилями
export const carsApi = {
  // Получение списка всех автомобилей
  async getAllCars(): Promise<ApiResponse<Car[]>> {
    return fetchApi<Car[]>("/cars");
  },

  // Получение автомобиля по ID
  async getCarById(id: number): Promise<ApiResponse<Car>> {
    return fetchApi<Car>(`/cars/${id}`);
  },

  // Создание нового автомобиля
  async createCar(car: Omit<Car, "id">): Promise<ApiResponse<Car>> {
    return fetchApi<Car>("/cars", {
      method: "POST",
      body: JSON.stringify(car)
    });
  },

  // Обновление автомобиля
  async updateCar(id: number, car: Partial<Car>): Promise<ApiResponse<Car>> {
    return fetchApi<Car>(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(car)
    });
  },

  // Удаление автомобиля
  async deleteCar(id: number): Promise<ApiResponse<void>> {
    return fetchApi<void>(`/cars/${id}`, {
      method: "DELETE"
    });
  }
};

// Моковые данные для разработки (когда API еще не готов)
export const mockCarsData: Car[] = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Седан",
    price: 2500,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070",
    description: "Комфортный седан для ежедневных поездок и бизнеса",
    features: ["Автоматическая КПП", "Климат-контроль", "Круиз-контроль"],
    rating: 4.8,
    year: 2022,
    transmission: "Автомат",
    fuel: "Бензин",
    engine: "2.5 л, 181 л.с.",
    drive: "Передний",
    isAvailable: true,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-04-20T14:15:00Z"
  },
  {
    id: 2,
    name: "BMW X5",
    category: "Внедорожник",
    price: 5000,
    image: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=2071",
    description: "Премиальный внедорожник для комфортных путешествий",
    features: ["Полный привод", "Панорамная крыша", "Премиум аудиосистема"],
    rating: 4.9,
    year: 2023,
    transmission: "Автомат",
    fuel: "Дизель",
    engine: "3.0 л, 249 л.с.",
    drive: "Полный",
    isAvailable: true,
    createdAt: "2023-02-10T10:45:00Z",
    updatedAt: "2023-05-05T09:20:00Z"
  },
  {
    id: 3,
    name: "Mercedes-Benz E-Class",
    category: "Бизнес-класс",
    price: 4500,
    image: "https://images.unsplash.com/photo-1549925862-990918131467?q=80&w=2070",
    description: "Элегантный автомобиль бизнес-класса с высоким уровнем комфорта",
    features: ["Кожаный салон", "Система помощи водителю", "Беспроводная зарядка"],
    rating: 4.7,
    year: 2022,
    transmission: "Автомат",
    fuel: "Бензин",
    engine: "2.0 л, 197 л.с.",
    drive: "Задний",
    isAvailable: false,
    createdAt: "2023-03-05T12:30:00Z",
    updatedAt: "2023-06-18T16:40:00Z"
  }
];

// Функция для эмуляции запросов к API на время разработки
export async function fetchMockApi<T>(data: T, delay = 500): Promise<ApiResponse<T>> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data,
        success: true
      });
    }, delay);
  });
}
