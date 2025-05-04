
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface CarProps {
  car: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    features: string[];
    rating?: number;
    year?: number;
    transmission?: string;
    fuel?: string;
  };
}

const CarCard = ({ car }: CarProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {car.rating && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
            <Icon name="Star" className="text-yellow-500 mr-1" size={14} />
            <span className="font-medium text-sm">{car.rating}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{car.name}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {car.category}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">{car.description}</p>
        
        {(car.year || car.transmission || car.fuel) && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {car.year && (
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Calendar" size={14} className="mr-1 text-blue-500" />
                <span>{car.year}</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Cog" size={14} className="mr-1 text-blue-500" />
                <span>{car.transmission === "Автомат" ? "АКПП" : "МКПП"}</span>
              </div>
            )}
            {car.fuel && (
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Fuel" size={14} className="mr-1 text-blue-500" />
                <span>{car.fuel}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-2">
          <ul className="space-y-1">
            {car.features.slice(0, 3).map((feature, index) => (
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
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link to={`/car/${car.id}`}>
              Подробнее
            </Link>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Забронировать
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
