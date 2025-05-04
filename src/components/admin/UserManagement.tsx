
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { User, mockUsersData, fetchMockApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Схема валидации для формы пользователя
const userFormSchema = z.object({
  email: z.string().email("Введите корректный email"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "customer"], {
    required_error: "Выберите роль пользователя",
  }),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов").optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Дополнительные моковые пользователи
const additionalMockUsers: User[] = [
  {
    id: 3,
    email: "customer1@autopro.ru",
    name: "Иванов Иван",
    phone: "+7 (999) 555-11-22",
    role: "customer",
    createdAt: "2023-02-10T00:00:00Z",
    lastLogin: "2023-05-02T12:30:00Z"
  },
  {
    id: 4,
    email: "customer2@autopro.ru",
    name: "Петрова Елена",
    phone: "+7 (999) 333-44-55",
    role: "customer",
    createdAt: "2023-03-15T00:00:00Z",
    lastLogin: "2023-05-01T09:15:00Z"
  },
  {
    id: 5,
    email: "manager2@autopro.ru",
    name: "Сидоров Алексей",
    phone: "+7 (999) 888-77-66",
    role: "manager",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    createdAt: "2023-01-20T00:00:00Z",
    lastLogin: "2023-04-29T14:45:00Z"
  }
];

// Объединяем всех пользователей для имитации данных
const allMockUsers = [...mockUsersData, ...additionalMockUsers];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Инициализация формы
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      role: "customer",
    },
  });

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь будет вызов API
        // const response = await usersApi.getAllUsers();
        
        const response = await fetchMockApi(allMockUsers, 800);
        
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список пользователей",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Фильтрация пользователей по роли и поиску
  const filteredUsers = users.filter((user) => {
    const matchesRole = activeTab === "all" || user.role === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    
    return matchesRole && matchesSearch;
  });

  // Открыть диалог для добавления нового пользователя
  const handleAddUser = () => {
    form.reset({
      email: "",
      name: "",
      phone: "",
      role: "customer",
      password: "",
    });
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  // Открыть диалог для редактирования пользователя
  const handleEditUser = (user: User) => {
    form.reset({
      email: user.email,
      name: user.name,
      phone: user.phone || "",
      role: user.role,
      password: "", // Пустой пароль при редактировании
    });
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // Обработка отправки формы
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Обновление существующего пользователя
        // В реальном проекте: await usersApi.updateUser(selectedUser.id, data);
        await fetchMockApi(null, 500);
        
        // Обновляем список пользователей
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, ...data } : user
        ));
        
        toast({
          title: "Успешно",
          description: "Данные пользователя обновлены",
        });
      } else {
        // Создание нового пользователя
        // В реальном проекте: await usersApi.createUser(data);
        await fetchMockApi(null, 500);
        
        // Добавляем нового пользователя в список
        const newUser: User = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...data,
          createdAt: new Date().toISOString(),
        };
        
        setUsers([...users, newUser]);
        
        toast({
          title: "Успешно",
          description: "Пользователь успешно создан",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("User form submission error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные пользователя",
        variant: "destructive",
      });
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        // В реальном проекте: await usersApi.deleteUser(userId);
        await fetchMockApi(null, 500);
        
        // Удаляем пользователя из списка
        setUsers(users.filter(user => user.id !== userId));
        
        toast({
          title: "Успешно",
          description: "Пользователь успешно удален",
        });
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить пользователя",
          variant: "destructive",
        });
      }
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <span className="ml-3">Загрузка пользователей...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление пользователями</h2>
        <Button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Icon name="UserPlus" size={18} />
          Добавить пользователя
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Всего пользователей</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Icon name="Users" className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Администраторы</p>
                <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Icon name="ShieldCheck" className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Менеджеры</p>
                <p className="text-3xl font-bold">{users.filter(u => u.role === 'manager').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Icon name="UserCog" className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Клиенты</p>
                <p className="text-3xl font-bold">{users.filter(u => u.role === 'customer').length}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Icon name="User" className="text-amber-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="admin">Администраторы</TabsTrigger>
            <TabsTrigger value="manager">Менеджеры</TabsTrigger>
            <TabsTrigger value="customer">Клиенты</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Пользователь</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Телефон</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Роль</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Дата регистрации</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-gray-900">{user.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "manager"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {user.role === "admin"
                          ? "Администратор"
                          : user.role === "manager"
                          ? "Менеджер"
                          : "Клиент"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditUser(user)}
                        >
                          <Icon name="Edit" size={16} className="text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "admin" && users.filter(u => u.role === "admin").length <= 1}
                        >
                          <Icon name="Trash2" size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Icon name="SearchX" size={36} className="mx-auto mb-4 text-gray-400" />
                    <p>Пользователи не найдены</p>
                    {searchQuery && (
                      <p className="mt-2">
                        Попробуйте изменить параметры поиска
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Диалог добавления/редактирования пользователя */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Редактировать пользователя" : "Добавить пользователя"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="user@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Иван Иванов" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+7 (999) 123-45-67" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Роль</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="manager">Менеджер</SelectItem>
                        <SelectItem value="customer">Клиент</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedUser ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder={selectedUser ? "••••••" : "Минимум 6 символов"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
