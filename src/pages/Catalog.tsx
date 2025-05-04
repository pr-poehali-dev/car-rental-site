
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

// Расширенный список автомобилей для каталога
const carsData = [
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
    fuel: "Бензин"
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
    fuel: "Дизель"
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
    fuel: "Бензин"
  },
  {
    id: 4,
    name: "Volkswagen Golf",
    category: "Хэтчбек",
    price: 1800,
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=2071",
    description: "Компактный городской автомобиль с отличной динамикой и экономичностью",
    features: ["Механическая КПП", "Климат-контроль", "Apple CarPlay"],
    rating: 4.5,
    year: 2021,
    transmission: "Механика",
    fuel: "Бензин"
  },
  {
    id: 5,
    name: "Audi Q7",
    category: "Внедорожник",
    price: 6000,
    image: "https://images.unsplash.com/photo-1614026480418-bd11dbb2f5db?q=80&w=2070",
    description: "Просторный и мощный внедорожник премиум-класса для семейных поездок",
    features: ["7 мест", "Полный привод", "Адаптивная подвеска"],
    rating: 4.9,
    year: 2023,
    transmission: "Автомат",
    fuel: "Дизель"
  },
  {
    id: 6,
    name: "Kia Rio",
    category: "Седан",
    price: 1200,
    image: "https://images.unsplash.com/photo-1570733577524-3a047079e80d?q=80&w=2070",
    description: "Экономичный и надежный автомобиль для города",
    features: ["Кондиционер", "USB-порты", "Экономичный расход"],
    rating: 4.3,
    year: 2021,
    transmission: "Механика",
    fuel: "Бензин"
  }
];

// Типы данных
interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  rating: number;
  year: number;
  transmission: string;
  fuel: string;
}

const Catalog = () => {
  // Состояния для фильтров
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [cars, setCars] = useState<Car[]>(carsData);

  // Категории автомобилей для фильтра
  const categories = ["Седан", "Внедорожник", "Хэтчбек", "Бизнес-класс"];

  // Обработчик изменения фильтров
  const applyFilters = () => {
    let filteredCars = [...carsData];
    
    // Фильтр по поисковому запросу
    if (searchTerm) {
      filteredCars = filteredCars.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по категории
    if (categoryFilter !== "all") {
      filteredCars = filteredCars.filter(car => car.category === categoryFilter);
    }
    
    // Фильтр по цене
    filteredCars = filteredCars.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );
    
    // Сортировка
    switch (sortBy) {
      case "price-asc":
        filteredCars.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredCars.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredCars.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredCars.sort((a, b) => b.year - a.year);
        break;
      default:
        // По умолчанию - рекомендуемые
        break;
    }
    
    setCars(filteredCars);
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriceRange([0, 10000]);
    setSortBy("recommended");
    setCars(carsData);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Каталог автомобилей</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Сайдбар с фильтрами */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Фильтры</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Сбросить
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Поиск */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Поиск</Label>
                  <div className="relative">
                    <Input
                      placeholder="Название автомобиля..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Icon 
                      name="Search" 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      size={16} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Категория */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Категория</Label>
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                {/* Диапазон цен */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm font-medium">Цена (₽/день)</Label>
                    <span className="text-sm text-gray-500">
                      {priceRange[0]} ₽ - {priceRange[1]} ₽
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                </div>
                
                <Separator />
                
                {/* Трансмиссия */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Трансмиссия</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="automatic" />
                      <label htmlFor="automatic" className="ml-2 text-sm">
                        Автоматическая
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="manual" />
                      <label htmlFor="manual" className="ml-2 text-sm">
                        Механическая
                      </label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Кнопка применения фильтров */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={applyFilters}
                >
                  Применить фильтры
                </Button>
              </div>
            </div>
          </div>
          
          {/* Каталог автомобилей */}
          <div className="lg:col-span-3">
            {/* Панель сортировки и информации о результатах */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600">{cars.length} автомобилей найдено</p>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Сортировать:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Рекомендуемые" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Рекомендуемые</SelectItem>
                    <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
                    <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                    <SelectItem value="newest">Сначала новые</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Сетка автомобилей */}
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Icon name="FileQuestion" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Автомобили не найдены</h3>
                <p className="text-gray-500 mb-6">Попробуйте изменить параметры фильтров</p>
                <Button variant="outline" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
            
            {/* Пагинация */}
            {cars.length > 0 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="w-9 h-9">
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-9 h-9 bg-blue-50 border-blue-200">
                    1
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-9 h-9">
                    2
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-9 h-9">
                    3
                  </Button>
                  
                  <span className="text-gray-500">...</span>
                  
                  <Button variant="outline" size="sm" className="w-9 h-9">
                    10
                  </Button>
                  
                  <Button variant="outline" size="icon" className="w-9 h-9">
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
