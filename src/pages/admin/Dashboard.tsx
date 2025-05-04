
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Car, mockCarsData, fetchMockApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("cars");

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь будет вызов API
        // const response = await carsApi.getAllCars();
        
        // Временное решение с моковыми данными
        const response = await fetchMockApi(mockCarsData, 800);
        
        if (response.success) {
          setCars(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список автомобилей",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Функция для удаления автомобиля
  const handleDeleteCar = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот автомобиль?")) {
      try {
        // В реальном проекте будет вызов API
        // await carsApi.deleteCar(id);
        
        // Эмуляция успешного удаления
        await fetchMockApi(undefined, 500);
        
        // Обновляем список автомобилей
        setCars(cars.filter(car => car.id !== id));
        
        toast({
          title: "Успешно",
          description: "Автомобиль успешно удален",
        });
      } catch (error) {
        console.error("Failed to delete car:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить автомобиль",
          variant: "destructive"
        });
      }
    }
  };

  // Функция для изменения статуса доступности
  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      // В реальном проекте будет вызов API
      // await carsApi.updateCar(id, { isAvailable: !currentStatus });
      
      // Эмуляция успешного обновления
      await fetchMockApi(undefined, 500);
      
      // Обновляем список автомобилей
      setCars(cars.map(car => 
        car.id === id ? { ...car, isAvailable: !currentStatus } : car
      ));
      
      toast({
        title: "Успешно",
        description: `Автомобиль ${!currentStatus ? "доступен" : "недоступен"} для бронирования`,
      });
    } catch (error) {
      console.error("Failed to update car availability:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус автомобиля",
        variant: "destructive"
      });
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
            <p className="text-gray-600">Управление автомобилями и бронированиями</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Icon name="ExternalLink" size={18} />
              Вернуться на сайт
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Всего автомобилей</p>
                <p className="text-3xl font-bold">{cars.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Icon name="Car" className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Доступные автомобили</p>
                <p className="text-3xl font-bold">{cars.filter(car => car.isAvailable).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Icon name="Check" className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Недоступные автомобили</p>
                <p className="text-3xl font-bold">{cars.filter(car => !car.isAvailable).length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Icon name="X" className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Активные бронирования</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Icon name="CalendarCheck" className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="cars">Автомобили</TabsTrigger>
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Управление автомобилями</h2>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Icon name="Plus" size={18} />
              Добавить автомобиль
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Автомобиль</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Категория</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Цена</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Год</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Статус</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-16 rounded overflow-hidden bg-gray-100">
                            <img 
                              src={car.image}
                              alt={car.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{car.name}</div>
                            <div className="text-sm text-gray-500">{car.transmission}, {car.fuel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {car.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {car.price} ₽<span className="text-sm text-gray-500">/день</span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {car.year}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={car.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {car.isAvailable ? "Доступен" : "Недоступен"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleAvailability(car.id, car.isAvailable || false)}
                          >
                            <Icon 
                              name={car.isAvailable ? "EyeOff" : "Eye"} 
                              size={16} 
                              className="text-gray-600"
                            />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Icon name="Edit" size={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteCar(car.id)}
                          >
                            <Icon name="Trash2" size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <Icon name="CalendarCheck" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Управление бронированиями</h3>
              <p className="text-gray-500">Этот раздел будет доступен в следующих обновлениях.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Управление пользователями</h3>
              <p className="text-gray-500">Этот раздел будет доступен в следующих обновлениях.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <Icon name="Settings" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Настройки системы</h3>
              <p className="text-gray-500">Этот раздел будет доступен в следующих обновлениях.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
