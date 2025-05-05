
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";

// Схема валидации для формы запроса сброса пароля
const requestResetSchema = z.object({
  email: z.string().email("Введите корректный email")
});

// Схема валидации для формы установки нового пароля
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string().min(6, "Подтверждение пароля должно содержать минимум 6 символов")
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

type RequestResetValues = z.infer<typeof requestResetSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const PasswordReset = () => {
  // Состояние для отслеживания текущего шага процесса сброса пароля
  const [step, setStep] = useState<"request" | "code" | "reset" | "success">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы для запроса сброса пароля
  const requestForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: ""
    }
  });

  // Инициализация формы для установки нового пароля
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // Обработчик отправки формы запроса сброса пароля
  const onRequestReset = async (data: RequestResetValues) => {
    setIsSubmitting(true);
    try {
      // В реальном проекте здесь будет вызов API
      // await authApi.requestPasswordReset(data.email);
      
      // Эмуляция успешного запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail(data.email);
      setStep("code");
      toast({
        title: "Код отправлен",
        description: "Проверьте вашу электронную почту для получения кода подтверждения",
      });
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить запрос на сброс пароля",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик отправки кода подтверждения
  const onVerifyCode = async () => {
    if (!code || code.length < 6) {
      toast({
        title: "Ошибка",
        description: "Введите корректный код подтверждения",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // В реальном проекте здесь будет вызов API
      // await authApi.verifyResetCode(email, code);
      
      // Эмуляция успешной проверки кода
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep("reset");
    } catch (error) {
      console.error("Code verification failed:", error);
      toast({
        title: "Ошибка",
        description: "Неверный код подтверждения",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик отправки формы сброса пароля
  const onResetPassword = async (data: ResetPasswordValues) => {
    setIsSubmitting(true);
    try {
      // В реальном проекте здесь будет вызов API
      // await authApi.resetPassword(email, code, data.password);
      
      // Эмуляция успешного сброса пароля
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep("success");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сбросить пароль",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Отображение шага запроса сброса пароля
  const renderRequestStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Восстановление пароля</CardTitle>
        <CardDescription>
          Введите ваш email для получения инструкций по сбросу пароля
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...requestForm}>
          <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-4">
            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />}
              Отправить инструкции
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Вспомнили пароль?{" "}
          <Link to="/admin/login" className="text-blue-600 hover:underline">
            Вернуться к входу
          </Link>
        </div>
      </CardFooter>
    </Card>
  );

  // Отображение шага ввода кода подтверждения
  const renderCodeStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Введите код подтверждения</CardTitle>
        <CardDescription>
          Мы отправили код на адрес {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Код подтверждения</Label>
            <Input 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код"
              maxLength={6}
            />
          </div>
          <Button 
            onClick={onVerifyCode} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />}
            Подтвердить
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-gray-500 text-center">
          Не получили код?{" "}
          <button 
            onClick={() => {
              requestForm.handleSubmit(onRequestReset)();
            }}
            className="text-blue-600 hover:underline"
          >
            Отправить повторно
          </button>
        </div>
        <button 
          onClick={() => setStep("request")}
          className="text-sm text-gray-500 hover:underline"
        >
          Изменить email
        </button>
      </CardFooter>
    </Card>
  );

  // Отображение шага установки нового пароля
  const renderResetStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Создайте новый пароль</CardTitle>
        <CardDescription>
          Придумайте надежный пароль для вашей учетной записи
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />}
              Сменить пароль
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  // Отображение шага успешного сброса пароля
  const renderSuccessStep = () => (
    <Card>
      <CardHeader>
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="Check" className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-center">Пароль успешно изменен</CardTitle>
        <CardDescription className="text-center">
          Ваш пароль был успешно изменен. Теперь вы можете войти в свою учетную запись с новым паролем.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link to="/admin/login">
          <Button>Вернуться к входу</Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4">
      <div className="w-full max-w-md">
        {step === "request" && renderRequestStep()}
        {step === "code" && renderCodeStep()}
        {step === "reset" && renderResetStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
};

// Компонент Label для формы ввода кода
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </div>
);

export default PasswordReset;
