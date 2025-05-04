
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CarProps {
  car: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    features: string[];
  };
}

const CarCard = ({ car }: CarProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{car.name}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {car.category}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">{car.description}</p>
        <div className="mt-2">
          <ul className="space-y-1">
            {car.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 flex justify-between items-center">
        <div className="font-bold text-lg">
          {car.price} ₽<span className="text-sm text-gray-500 font-normal">/день</span>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Забронировать
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
