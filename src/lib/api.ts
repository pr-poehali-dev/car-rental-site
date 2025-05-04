
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

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: "admin" | "manager" | "customer";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Booking {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "canceled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
  car?: Car;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Функция для сохранения токена в localStorage
export function saveAuthToken(token: string, expiresAt: number): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_expires', expiresAt.toString());
}

// Функция для получения токена из localStorage
export function getAuthToken(): string | null {
  const token = localStorage.getItem('auth_token');
  const expires = localStorage.getItem('auth_expires');
  
  if (!token || !expires) {
    return null;
  }
  
  // Проверяем, не истек ли токен
  if (Date.now() > parseInt(expires)) {
    // Токен истек, удаляем его
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires');
    return null;
  }
  
  return token;
}

// Функция для удаления токена при выходе
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_expires');
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
    // Добавляем авторизационный токен, если он есть
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Если статус не OK, выбрасываем ошибку
    if (!response.ok) {
      // Если ошибка 401 - неавторизован, удаляем токен
      if (response.status === 401) {
        removeAuthToken();
      }
      
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

// API функции для работы с пользователями
export const usersApi = {
  // Получение списка всех пользователей
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return fetchApi<User[]>("/users");
  },

  // Получение пользователя по ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return fetchApi<User>(`/users/${id}`);
  },

  // Создание нового пользователя (регистрация)
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<ApiResponse<User>> {
    return fetchApi<User>("/users", {
      method: "POST",
      body: JSON.stringify(user)
    });
  },

  // Обновление пользователя
  async updateUser(id: number, user: Partial<User>): Promise<ApiResponse<User>> {
    return fetchApi<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user)
    });
  },

  // Удаление пользователя
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return fetchApi<void>(`/users/${id}`, {
      method: "DELETE"
    });
  }
};

// API функции для работы с бронированиями
export const bookingsApi = {
  // Получение списка всех бронирований
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return fetchApi<Booking[]>("/bookings");
  },

  // Получение бронирования по ID
  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>(`/bookings/${id}`);
  },

  // Получение бронирований конкретного пользователя
  async getBookingsByUser(userId: number): Promise<ApiResponse<Booking[]>> {
    return fetchApi<Booking[]>(`/users/${userId}/bookings`);
  },

  // Получение бронирований конкретного автомобиля
  async getBookingsByCar(carId: number): Promise<ApiResponse<Booking[]>> {
    return fetchApi<Booking[]>(`/cars/${carId}/bookings`);
  },

  // Создание нового бронирования
  async createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(booking)
    });
  },

  // Обновление бронирования (изменение статуса)
  async updateBooking(id: number, booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(booking)
    });
  },

  // Отмена бронирования
  async cancelBooking(id: number): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>(`/bookings/${id}/cancel`, {
      method: "POST"
    });
  }
};

// API функции для авторизации
export const authApi = {
  // Авторизация пользователя
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    
    if (response.success && response.data.token) {
      // Сохраняем токен в localStorage
      saveAuthToken(response.data.token, response.data.expiresAt);
    }
    
    return response;
  },

  // Выход пользователя
  async logout(): Promise<ApiResponse<void>> {
    const response = await fetchApi<void>("/auth/logout", {
      method: "POST"
    });
    
    // Удаляем токен из localStorage
    removeAuthToken();
    
    return response;
  },

  // Проверка авторизации пользователя
  async checkAuth(): Promise<ApiResponse<User>> {
    return fetchApi<User>("/auth/me");
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

// Моковые пользователи
export const mockUsersData: User[] = [
  {
    id: 1,
    email: "admin@autopro.ru",
    name: "Администратор",
    phone: "+7 (999) 123-45-67",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: "2023-05-04T10:30:00Z"
  },
  {
    id: 2,
    email: "manager@autopro.ru",
    name: "Менеджер",
    phone: "+7 (999) 765-43-21",
    role: "manager",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    createdAt: "2023-01-05T00:00:00Z",
    lastLogin: "2023-05-03T15:20:00Z"
  }
];

// Моковые данные бронирований
export const mockBookingsData: Booking[] = [
  {
    id: 1,
    carId: 1,
    userId: 2,
    startDate: "2023-05-10T10:00:00Z",
    endDate: "2023-05-15T10:00:00Z",
    totalPrice: 12500,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-05-01T14:30:00Z",
    updatedAt: "2023-05-02T09:15:00Z"
  },
  {
    id: 2,
    carId: 3,
    userId: 2,
    startDate: "2023-06-01T10:00:00Z",
    endDate: "2023-06-05T10:00:00Z",
    totalPrice: 18000,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2023-05-03T11:20:00Z",
    updatedAt: "2023-05-03T11:20:00Z"
  }
];

// Функция для эмуляции авторизации
export async function mockLogin(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  // Проверяем учетные данные
  const admin = mockUsersData[0];
  const manager = mockUsersData[1];
  
  if (email === admin.email && password === "admin123") {
    return {
      success: true,
      data: {
        user: admin,
        token: "mock_admin_token_12345",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // токен действителен 24 часа
      }
    };
  } else if (email === manager.email && password === "manager123") {
    return {
      success: true,
      data: {
        user: manager,
        token: "mock_manager_token_12345",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      }
    };
  } else {
    return {
      success: false,
      data: {} as AuthResponse,
      message: "Неверный email или пароль"
    };
  }
}

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
