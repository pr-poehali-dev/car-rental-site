
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useSettings, SystemSettings } from "@/context/SettingsContext";
import { toast } from "@/components/ui/use-toast";

const SystemSettings = () => {
  const { settings, updateSettings, loading } = useSettings();
  
  // Состояние для отслеживания изменений настроек
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // Обработчик изменения полей формы
  const handleChange = (
    key: keyof SystemSettings,
    value: string | boolean
  ) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };
  
  // Функция сохранения настроек
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const success = await updateSettings(formData);
      if (success) {
        toast({
          title: "Настройки сохранены",
          description: "Изменения успешно применены",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <span className="ml-3">Загрузка настроек...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Настройки системы</h2>
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          {isSaving ? (
            <Icon name="Loader2" className="animate-spin" size={18} />
          ) : (
            <Icon name="Save" size={18} />
          )}
          Сохранить изменения
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="regional">Региональные</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="branding">Брендинг</TabsTrigger>
        </TabsList>

        {/* Вкладка общих настроек */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>
                Настройте основные параметры сервиса проката автомобилей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Описание сайта</Label>
                  <Input
                    id="siteDescription"
                    value={formData.siteDescription}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Контактный email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Телефон поддержки</Label>
                  <Input
                    id="supportPhone"
                    value={formData.supportPhone}
                    onChange={(e) => handleChange("supportPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка региональных настроек */}
        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Региональные настройки</CardTitle>
              <CardDescription>
                Настройки локализации и региональных форматов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Выберите валюту" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₽">Рубль (₽)</SelectItem>
                      <SelectItem value="$">Доллар ($)</SelectItem>
                      <SelectItem value="€">Евро (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="locale">Локаль</Label>
                  <Select
                    value={formData.locale}
                    onValueChange={(value) => handleChange("locale", value)}
                  >
                    <SelectTrigger id="locale">
                      <SelectValue placeholder="Выберите локаль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru-RU">Русский (ru-RU)</SelectItem>
                      <SelectItem value="en-US">Английский (en-US)</SelectItem>
                      <SelectItem value="de-DE">Немецкий (de-DE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Выберите часовой пояс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/Kaliningrad">Калининград (UTC+2)</SelectItem>
                      <SelectItem value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</SelectItem>
                      <SelectItem value="Asia/Vladivostok">Владивосток (UTC+10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка настроек уведомлений */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>
                Управление системой оповещений для клиентов и администраторов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email-уведомления</Label>
                    <p className="text-sm text-gray-500">
                      Отправлять уведомления по электронной почте
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleChange("emailNotifications", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS-уведомления</Label>
                    <p className="text-sm text-gray-500">
                      Отправлять уведомления по SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleChange("smsNotifications", checked)
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnNewBooking">Новые бронирования</Label>
                    <p className="text-sm text-gray-500">
                      Уведомлять администраторов о новых бронированиях
                    </p>
                  </div>
                  <Switch
                    id="notifyOnNewBooking"
                    checked={formData.notifyOnNewBooking}
                    onCheckedChange={(checked) =>
                      handleChange("notifyOnNewBooking", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnCancellation">Отмена бронирований</Label>
                    <p className="text-sm text-gray-500">
                      Уведомлять об отмене бронирований
                    </p>
                  </div>
                  <Switch
                    id="notifyOnCancellation"
                    checked={formData.notifyOnCancellation}
                    onCheckedChange={(checked) =>
                      handleChange("notifyOnCancellation", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка настроек брендинга */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Настройки брендинга</CardTitle>
              <CardDescription>
                Настройка внешнего вида и стиля сайта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Основной цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange("primaryColor", e.target.value)}
                      className="flex-1"
                    />
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Дополнительный цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange("secondaryColor", e.target.value)}
                      className="flex-1"
                    />
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Логотип (URL)</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleChange("logo", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon (URL)</Label>
                  <Input
                    id="favicon"
                    value={formData.favicon}
                    onChange={(e) => handleChange("favicon", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
