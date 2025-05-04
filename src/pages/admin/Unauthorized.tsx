
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Если пользователь авторизован, перенаправляем на главную страницу админки
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="p-6 bg-red-50 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="ShieldAlert" size={40} className="text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Доступ запрещен</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">
            {user
              ? `У вас недостаточно прав для доступа к этому разделу. Ваша роль: ${
                  user.role === 'admin' ? 'Администратор' : 
                  user.role === 'manager' ? 'Менеджер' : 'Пользователь'
                }`
              : 'У вас недостаточно прав для доступа к этому разделу.'}
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-left mb-6">
            <h3 className="text-sm font-medium text-amber-800 flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={16} />
              Что делать?
            </h3>
            <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1">
              <li>Обратитесь к администратору для повышения уровня доступа</li>
              <li>Вернитесь на доступные вам страницы</li>
              <li>Выполните вход с учетной записью, имеющей нужные права</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Link to="/admin">
            <Button>Панель управления</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
