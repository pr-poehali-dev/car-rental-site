
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Car } from "@/lib/api";
import CarForm from "@/components/admin/CarForm";

interface CarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  car?: Car;
  onSuccess: () => void;
}

const CarEditModal = ({ isOpen, onClose, car, onSuccess }: CarEditModalProps) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {car ? `Редактирование: ${car.name}` : 'Добавление нового автомобиля'}
          </DialogTitle>
        </DialogHeader>
        <CarForm
          car={car}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CarEditModal;
