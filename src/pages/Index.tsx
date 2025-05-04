
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CarCard from "@/components/CarCard";
import MainLayout from "@/components/MainLayout";

const cars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Седан",
    price: 2500,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070",
    description: "Комфортный седан для ежедневных поездок и бизнеса",
    features: ["Автоматическая КПП", "Климат-контроль", "Круиз-контроль"]
  },
  {
    id: 2,
    name: "BMW X5",
    category: "Внедорожник",
    price: 5000,
    image: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=2071",
    description: "Премиальный внедорожник для комфортных путешествий",
    features: ["Полный привод", "Панорамная крыша", "Премиум аудиосистема"]
  },
  {
    id: 3,
    name: "Mercedes-Benz E-Class",
    category: "Бизнес-класс",
    price: 4500,
    image: "https://images.unsplash.com/photo-1549925862-990918131467?q=80&w=2070",
    description: "Элегантный автомобиль бизнес-класса с высоким уровнем комфорта",
    features: ["Кожаный салон", "Система помощи водителю", "Беспроводная зарядка"]
  }
];

const Index = () => {
  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Аренда автомобилей в России</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Широкий выбор автомобилей для любых задач — от экономичных седанов до премиальных внедорожников
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Забронировать сейчас
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Посмотреть каталог
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Популярные автомобили</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Показать все автомобили
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Преимущества аренды у нас</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">🚗</div>
              <h3 className="text-xl font-bold mb-2">Разнообразный автопарк</h3>
              <p className="text-gray-600">Более 50 моделей автомобилей различных классов и комплектаций</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">💰</div>
              <h3 className="text-xl font-bold mb-2">Прозрачные цены</h3>
              <p className="text-gray-600">Никаких скрытых платежей и доплат при оформлении аренды</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">🛠️</div>
              <h3 className="text-xl font-bold mb-2">Техническая поддержка</h3>
              <p className="text-gray-600">Круглосуточная помощь на дороге во всех регионах</p>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
