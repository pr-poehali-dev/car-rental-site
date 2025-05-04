
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

// Mock данные для страницы детальной информации
const carDetail = {
  id: 1,
  name: "BMW X5",
  category: "Внедорожник",
  price: 5000,
  rating: 4.8,
  reviewCount: 124,
  year: 2023,
  transmission: "Автоматическая",
  fuel: "Дизель",
  engine: "3.0 л, 249 л.с.",
  drive: "Полный",
  consumption: "8.5 л/100 км",
  seats: 5,
  color: "Черный металлик",
  location: "Москва, ул. Автомобильная, 15",
  description: "BMW X5 – это роскошный внедорожник с мощным двигателем и комфортабельным салоном. Автомобиль оснащен современными системами безопасности и помощи водителю, что делает управление максимально удобным и безопасным. Просторный салон, отделанный высококачественными материалами, обеспечивает комфорт для всех пассажиров. Полный привод и большой дорожный просвет позволяют уверенно чувствовать себя на любых дорогах.",
  features: [
    "Панорамная крыша",
    "Кожаный салон",
    "Подогрев сидений",
    "Вентиляция сидений",
    "Электрорегулировка сидений",
    "Адаптивный круиз-контроль",
    "Система кругового обзора",
    "Парковочный ассистент",
    "Премиальная аудиосистема",
    "Apple CarPlay / Android Auto",
    "Беспроводная зарядка смартфона",
    "Климат-контроль на 4 зоны"
  ],
  gallery: [
    "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=2071",
    "https://images.unsplash.com/photo-1535732820275-9ffd998cac22?q=80&w=2070",
    "https://images.unsplash.com/photo-1637610904926-baee932deef5?q=80&w=2070",
    "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?q=80&w=2070",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070"
  ],
  reviews: [
    {
      id: 1,
      author: "Алексей Петров",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "15 апреля 2023",
      rating: 5,
      text: "Отличный автомобиль! Брал на неделю для поездки в Санкт-Петербург. Расход топлива порадовал, комфорт на высшем уровне. Буду обращаться еще!"
    },
    {
      id: 2,
      author: "Елена Сидорова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "3 марта 2023",
      rating: 4,
      text: "Хороший автомобиль, но есть небольшие царапины на кузове. В целом осталась довольна арендой, машина мощная и комфортная."
    },
    {
      id: 3,
      author: "Иван Соколов",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      date: "17 февраля 2023",
      rating: 5,
      text: "Прекрасный автомобиль для путешествий. Комфортно разместились всей семьей, багажник вместительный. Отличная управляемость и динамика."
    }
  ]
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mainImage, setMainImage] = useState(carDetail.gallery[0]);
  const [isAvailable, setIsAvailable] = useState(true);

  // Рейтинги для статистики
  const ratingStats = [
    { rating: 5, percentage: 75 },
    { rating: 4, percentage: 18 },
    { rating: 3, percentage: 5 },
    { rating: 2, percentage: 1 },
    { rating: 1, percentage: 1 }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Главная</Link>
          <Icon name="ChevronRight" size={16} className="mx-2" />
          <Link to="/catalog" className="hover:text-blue-600">Каталог</Link>
          <Icon name="ChevronRight" size={16} className="mx-2" />
          <span className="text-gray-800">{carDetail.name}</span>
        </div>

        {/* Основная информация и галерея */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Галерея */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden h-80">
              <img 
                src={mainImage} 
                alt={carDetail.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {carDetail.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className={`h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    image === mainImage ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${carDetail.name} - фото ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{carDetail.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Icon name="Star" className="text-yellow-500 mr-1" size={18} />
                    <span className="text-gray-900 font-medium mr-1">{carDetail.rating}</span>
                    <span className="text-gray-500">({carDetail.reviewCount} отзывов)</span>
                  </div>
                  <Separator orientation="vertical" className="mx-3 h-5" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {carDetail.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{carDetail.price} ₽</div>
                <div className="text-gray-500 text-sm">за день</div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Основные характеристики */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Icon name="Calendar" className="text-gray-500 mr-3" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Год выпуска</div>
                  <div className="font-medium">{carDetail.year}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Icon name="Gauge" className="text-gray-500 mr-3" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Двигатель</div>
                  <div className="font-medium">{carDetail.engine}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Icon name="Fuel" className="text-gray-500 mr-3" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Топливо</div>
                  <div className="font-medium">{carDetail.fuel}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Icon name="Cog" className="text-gray-500 mr-3" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Трансмиссия</div>
                  <div className="font-medium">{carDetail.transmission}</div>
                </div>
              </div>
            </div>

            {/* Доступность */}
            <div className={`p-4 rounded-lg mb-6 ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center">
                <Icon 
                  name={isAvailable ? "Check" : "X"} 
                  className={`mr-3 ${isAvailable ? 'text-green-600' : 'text-red-600'}`} 
                  size={20} 
                />
                <div>
                  <div className={`font-medium ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                    {isAvailable ? 'Доступен для бронирования' : 'Недоступен в выбранные даты'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isAvailable 
                      ? 'Можно забронировать прямо сейчас' 
                      : 'Попробуйте выбрать другие даты'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Забронировать
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Icon name="Phone" className="mr-2" size={18} />
                Позвонить
              </Button>
            </div>
          </div>
        </div>

        {/* Детальная информация на вкладках */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="features">Характеристики</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Описание</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {carDetail.description}
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Местоположение</h3>
            <div className="flex items-center mb-6">
              <Icon name="MapPin" className="text-red-500 mr-3" size={20} />
              <span className="text-gray-700">{carDetail.location}</span>
            </div>
            
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Map" size={48} className="text-gray-400 mb-2 mx-auto" />
                <p className="text-gray-500">Карта местоположения</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Характеристики и оснащение</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Info" className="mr-2 text-blue-600" size={20} />
                  Основные характеристики
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Год выпуска:</span>
                    <span className="font-medium">{carDetail.year}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Двигатель:</span>
                    <span className="font-medium">{carDetail.engine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Топливо:</span>
                    <span className="font-medium">{carDetail.fuel}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Трансмиссия:</span>
                    <span className="font-medium">{carDetail.transmission}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Привод:</span>
                    <span className="font-medium">{carDetail.drive}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Расход топлива:</span>
                    <span className="font-medium">{carDetail.consumption}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Layers" className="mr-2 text-blue-600" size={20} />
                  Комплектация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {carDetail.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Icon name="Check" className="text-green-600 mr-2" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="md:w-1/3">
                <h2 className="text-2xl font-bold mb-4">Отзывы клиентов</h2>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900">{carDetail.rating}</div>
                  <div className="flex justify-center my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon 
                        key={star}
                        name="Star" 
                        className={star <= Math.round(carDetail.rating) ? "text-yellow-500" : "text-gray-300"} 
                        size={20} 
                      />
                    ))}
                  </div>
                  <div className="text-gray-500">На основе {carDetail.reviewCount} отзывов</div>
                </div>
                
                <div className="space-y-3">
                  {ratingStats.map((stat) => (
                    <div key={stat.rating} className="flex items-center">
                      <div className="w-16 text-gray-600 flex items-center">
                        <span>{stat.rating}</span>
                        <Icon name="Star" className="text-yellow-500 ml-1" size={14} />
                      </div>
                      <div className="flex-grow mx-2">
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                      <div className="w-10 text-right text-gray-600 text-sm">
                        {stat.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Последние отзывы</h3>
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    Написать отзыв
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {carDetail.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="mr-3">
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.author}</div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon 
                              key={star}
                              name="Star" 
                              className={star <= review.rating ? "text-yellow-500" : "text-gray-300"} 
                              size={16} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" className="text-gray-600">
                    Показать все отзывы
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Похожие автомобили */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Похожие автомобили</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Здесь должны быть карточки похожих автомобилей */}
            <div className="bg-gray-100 rounded-lg p-4 h-60 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Похожие автомобили будут здесь</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 h-60 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Похожие автомобили будут здесь</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 h-60 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Похожие автомобили будут здесь</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarDetail;
