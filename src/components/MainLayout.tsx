
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-2xl text-blue-700 flex items-center">
              <Icon name="Car" className="mr-2" />
              АвтоПрокат
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="font-medium text-gray-900 hover:text-blue-600">Главная</Link>
              <Link to="/catalog" className="font-medium text-gray-600 hover:text-blue-600">Каталог</Link>
              <Link to="/about" className="font-medium text-gray-600 hover:text-blue-600">О нас</Link>
              <Link to="/contacts" className="font-medium text-gray-600 hover:text-blue-600">Контакты</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-600 hover:text-blue-600 relative">
                <Icon name="ShoppingCart" size={24} />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </span>
              </Link>
              
              <Button variant="outline" className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50">
                Войти
              </Button>
              
              <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700">
                Регистрация
              </Button>
              
              <button className="md:hidden text-gray-600">
                <Icon name="Menu" size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">АвтоПрокат</h3>
              <p className="text-gray-400">
                Лучший сервис аренды автомобилей в России. Работаем с 2010 года.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Информация</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">О компании</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Условия аренды</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">Частые вопросы</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Автомобили</h4>
              <ul className="space-y-2">
                <li><Link to="/catalog?category=economy" className="text-gray-400 hover:text-white">Эконом-класс</Link></li>
                <li><Link to="/catalog?category=business" className="text-gray-400 hover:text-white">Бизнес-класс</Link></li>
                <li><Link to="/catalog?category=premium" className="text-gray-400 hover:text-white">Премиум-класс</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  г. Москва, ул. Примерная, 123
                </li>
                <li className="flex items-center text-gray-400">
                  <Icon name="Phone" size={16} className="mr-2" />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center text-gray-400">
                  <Icon name="Mail" size={16} className="mr-2" />
                  info@autopro.ru
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} АвтоПрокат. Все права защищены.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon name="Twitter" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
