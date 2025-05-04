
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { authApi, mockLogin, LoginCredentials } from "@/lib/api";

// Схема валидации формы авторизации
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Отправка формы авторизации
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // В реальном проекте будет вызов API
      // const response = await authApi.login(data);
      
      // Эмуляция авторизации для разработки
      const response = await mockLogin(data.email, data.password);
      
      if (response.success) {
        toast({
          title: "Успешная авторизация",
          description: `Добро пожаловать, ${response.data.user.name}!`,
        });
        
        // Перенаправление на административную панель
        navigate("/admin");
      } else {
        toast({
          title: "Ошибка авторизации",
          description: response.message || "Неверный email или пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при авторизации",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Административная панель
            </CardTitle>
            <CardDescription className="text-center">
              Введите свои учетные данные для входа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@autopro.ru" 
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
                  <p><strong>Тестовые данные для входа:</strong></p>
                  <p>Email: admin@autopro.ru</p>
                  <p>Пароль: admin123</p>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">
                        <Icon name="Loader2" size={16} />
                      </span>
                      Вход...
                    </>
                  ) : "Войти"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Вернуться на сайт
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
