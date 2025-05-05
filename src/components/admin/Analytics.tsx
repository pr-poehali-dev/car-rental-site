
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { mockBookingsData, Car, Booking, fetchMockApi } from "@/lib/api";

// Определение интерфейса для статистических данных
interface AnalyticsData {
  bookingsByMonth: { name: string; value: number }[];
  incomeByMonth: { name: string; value: number }[];
  carUsageData: { name: string; value: number }[];
  popularCars: { name: string; value: number }[];
  bookingStatuses: { name: string; value: number }[];
}

// Компонент аналитики для админ-панели
const Analytics = () => {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#D88884"];

  // Загрузка данных аналитики при изменении периода
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь будет API-запрос к серверу
        // const response = await analyticsApi.getStatistics(period);
        
        // Эмуляция получения данных аналитики
        // Генерация тестовых данных в зависимости от выбранного периода
        const response = await fetchMockApi(generateMockAnalyticsData(period), 800);
        
        if (response.success) {
          setAnalyticsData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные аналитики",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [period]);

  // Функция для генерации тестовых данных аналитики
  const generateMockAnalyticsData = (selectedPeriod: string): AnalyticsData => {
    // Названия месяцев для отображения на графиках
    const monthNames = ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"];
    
    // Количество периодов для отображения в зависимости от выбранного периода
    let periods = 12;
    let periodNames = [...monthNames];
    
    if (selectedPeriod === "quarter") {
      periods = 4;
      periodNames = ["I кв.", "II кв.", "III кв.", "IV кв."];
    } else if (selectedPeriod === "month") {
      periods = 30;
      periodNames = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    }
    
    // Генерация данных о бронированиях по периодам
    const bookingsByMonth = Array.from({ length: periods }, (_, i) => ({
      name: periodNames[i % periodNames.length],
      value: Math.floor(Math.random() * 20) + 5,
    }));
    
    // Генерация данных о доходе по периодам
    const incomeByMonth = Array.from({ length: periods }, (_, i) => ({
      name: periodNames[i % periodNames.length],
      value: Math.floor(Math.random() * 500000) + 100000,
    }));
    
    // Генерация данных об использовании автомобилей
    const carUsageData = [
      { name: "В использовании", value: Math.floor(Math.random() * 10) + 15 },
      { name: "Свободны", value: Math.floor(Math.random() * 10) + 5 },
      { name: "На обслуживании", value: Math.floor(Math.random() * 5) + 1 },
    ];
    
    // Генерация данных о популярности автомобилей
    const popularCars = [
      { name: "Toyota Camry", value: Math.floor(Math.random() * 30) + 20 },
      { name: "BMW X5", value: Math.floor(Math.random() * 20) + 15 },
      { name: "Mercedes E-Class", value: Math.floor(Math.random() * 15) + 10 },
      { name: "Audi A6", value: Math.floor(Math.random() * 10) + 5 },
      { name: "Hyundai Sonata", value: Math.floor(Math.random() * 8) + 3 },
    ];
    
    // Генерация данных о статусах бронирований
    const bookingStatuses = [
      { name: "Подтверждено", value: Math.floor(Math.random() * 30) + 40 },
      { name: "Ожидает", value: Math.floor(Math.random() * 10) + 10 },
      { name: "Отменено", value: Math.floor(Math.random() * 10) + 5 },
      { name: "Завершено", value: Math.floor(Math.random() * 30) + 20 },
    ];
    
    return {
      bookingsByMonth,
      incomeByMonth,
      carUsageData,
      popularCars,
      bookingStatuses,
    };
  };

  // Форматирование значений для tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Отображение состояния загрузки
  if (loading || !analyticsData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Загрузка данных аналитики...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Аналитика бизнеса</h2>
        <div className="flex items-center gap-4">
          <Select 
            value={period} 
            onValueChange={(value) => setPeriod(value as "month" | "quarter" | "year")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">За 30 дней</SelectItem>
              <SelectItem value="quarter">Поквартально</SelectItem>
              <SelectItem value="year">За год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Icon name="Download" size={16} />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Общий доход</CardTitle>
            <CardDescription>За выбранный период</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(analyticsData.incomeByMonth.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <div className="text-sm text-green-500 flex items-center mt-1">
              <Icon name="TrendingUp" size={16} className="mr-1" />
              +12% по сравнению с прошлым периодом
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Всего бронирований</CardTitle>
            <CardDescription>За выбранный период</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData.bookingsByMonth.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <div className="text-sm text-green-500 flex items-center mt-1">
              <Icon name="TrendingUp" size={16} className="mr-1" />
              +8% по сравнению с прошлым периодом
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Средняя загрузка</CardTitle>
            <CardDescription>Автомобилей в автопарке</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(
                (analyticsData.carUsageData.find(item => item.name === "В использовании")?.value || 0) /
                analyticsData.carUsageData.reduce((sum, item) => sum + item.value, 0) * 100
              )}%
            </div>
            <div className="text-sm text-amber-500 flex items-center mt-1">
              <Icon name="MinusCircle" size={16} className="mr-1" />
              -2% по сравнению с прошлым периодом
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="income">Доход</TabsTrigger>
          <TabsTrigger value="cars">Автомобили</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика бронирований</CardTitle>
              <CardDescription>Количество бронирований по периодам</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.bookingsByMonth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Бронирования" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статусы бронирований</CardTitle>
              <CardDescription>Распределение бронирований по статусам</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.bookingStatuses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.bookingStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} брон.`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Динамика дохода</CardTitle>
              <CardDescription>Доход компании по периодам</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.incomeByMonth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), "Доход"]} />
                  <Legend />
                  <Bar dataKey="value" name="Доход" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Популярные автомобили</CardTitle>
              <CardDescription>Количество бронирований по моделям</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analyticsData.popularCars}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Бронирования" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Использование автопарка</CardTitle>
              <CardDescription>Текущий статус автомобилей</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.carUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.carUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} авто`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
