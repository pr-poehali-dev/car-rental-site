
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car, carsApi, fetchMockApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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

// Схема валидации формы
const carFormSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  category: z.string().min(1, "Выберите категорию"),
  price: z.coerce.number().min(100, "Цена должна быть не менее 100"),
  year: z.coerce.number().min(1990, "Год выпуска должен быть не ранее 1990"),
  transmission: z.string().min(1, "Выберите тип трансмиссии"),
  fuel: z.string().min(1, "Выберите тип топлива"),
  engine: z.string().min(1, "Введите информацию о двигателе"),
  drive: z.string().optional(),
  consumption: z.string().optional(),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  image: z.string().url("Введите корректный URL изображения"),
  isAvailable: z.boolean().default(true),
  features: z.array(z.string()).min(1, "Добавьте хотя бы одну особенность")
});

type CarFormValues = z.infer<typeof carFormSchema>;

interface CarFormProps {
  car?: Car;
  onSuccess: () => void;
  onCancel: () => void;
}

const CarForm = ({ car, onSuccess, onCancel }: CarFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>(car?.features || []);
  const [newFeature, setNewFeature] = useState("");

  // Инициализация формы с данными автомобиля (если есть)
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car ? {
      ...car,
      features: car.features || []
    } : {
      name: "",
      category: "",
      price: 1000,
      year: new Date().getFullYear(),
      transmission: "",
      fuel: "",
      engine: "",
      drive: "",
      consumption: "",
      description: "",
      image: "",
      isAvailable: true,
      features: []
    }
  });

  // Обновление features при их изменении
  useEffect(() => {
    form.setValue("features", features);
  }, [features, form]);

  // Добавление новой особенности
  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  // Удаление особенности
  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  // Отправка формы
  const onSubmit = async (data: CarFormValues) => {
    setIsSubmitting(true);
    try {
      // В реальном приложении здесь будет вызов API
      if (car?.id) {
        // Обновление существующего автомобиля
        // await carsApi.updateCar(car.id, data);
        await fetchMockApi(null, 800);
      } else {
        // Создание нового автомобиля
        // await carsApi.createCar(data);
        await fetchMockApi(null, 800);
      }
      
      toast({
        title: "Успешно",
        description: car?.id 
          ? "Автомобиль успешно обновлен" 
          : "Новый автомобиль успешно добавлен",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting car form:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные автомобиля",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Основная информация</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название автомобиля</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: BMW X5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Седан">Седан</SelectItem>
                      <SelectItem value="Внедорожник">Внедорожник</SelectItem>
                      <SelectItem value="Хэтчбек">Хэтчбек</SelectItem>
                      <SelectItem value="Бизнес-класс">Бизнес-класс</SelectItem>
                      <SelectItem value="Кроссовер">Кроссовер</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (₽/день)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год выпуска</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Доступен для бронирования</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          {/* Технические характеристики */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Технические характеристики</h3>
            
            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Трансмиссия</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Автомат">Автоматическая</SelectItem>
                      <SelectItem value="Механика">Механическая</SelectItem>
                      <SelectItem value="Робот">Роботизированная</SelectItem>
                      <SelectItem value="Вариатор">Вариатор</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Топливо</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Бензин">Бензин</SelectItem>
                      <SelectItem value="Дизель">Дизель</SelectItem>
                      <SelectItem value="Гибрид">Гибрид</SelectItem>
                      <SelectItem value="Электро">Электро</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Двигатель</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: 2.0 л, 249 л.с." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="drive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Привод</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Передний">Передний</SelectItem>
                        <SelectItem value="Задний">Задний</SelectItem>
                        <SelectItem value="Полный">Полный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="consumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Расход (л/100 км)</FormLabel>
                    <FormControl>
                      <Input placeholder="Например: 8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Описание */}
        <div>
          <h3 className="text-lg font-medium mb-4">Описание</h3>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Подробное описание автомобиля..." 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        {/* Особенности */}
        <div>
          <h3 className="text-lg font-medium mb-4">Особенности и оснащение</h3>
          
          <div className="flex mb-4">
            <Input
              placeholder="Добавить особенность..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="mr-2"
            />
            <Button 
              type="button" 
              onClick={handleAddFeature}
              variant="outline"
              className="flex-shrink-0"
            >
              Добавить
            </Button>
          </div>
          
          {features.length > 0 ? (
            <div className="border rounded-md p-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(feature)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="X" size={16} className="text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-md text-gray-500">
              Добавьте особенности автомобиля
            </div>
          )}
          
          {form.formState.errors.features && (
            <p className="text-sm font-medium text-red-500 mt-2">
              {form.formState.errors.features.message}
            </p>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">
                  <Icon name="Loader2" size={16} />
                </span>
                Сохранение...
              </>
            ) : car?.id ? "Обновить автомобиль" : "Добавить автомобиль"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CarForm;
