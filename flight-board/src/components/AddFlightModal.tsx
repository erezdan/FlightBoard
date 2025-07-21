import React, { useState } from "react";
import Dialog from "../components/ui/dialog";
import DialogContent from "../components/ui/dialogContent";
import DialogHeader from "../components/ui/dialogHeader";
import DialogTitle from "../components/ui/dialogTitle";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Label from "../components/ui/lable";
import { CalendarDays, Plus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// test

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FlightFormData) => Promise<void>;
  isSubmitting: boolean;
}

interface FlightFormData {
  flight_number: string;
  destination: string;
  departure_time: string;
  gate: string;
  status: string;
}

interface FormErrors {
  flight_number?: string;
  destination?: string;
  departure_time?: string;
  gate?: string;
}

export default function AddFlightModal({ isOpen, onClose, onSubmit, isSubmitting }: AddFlightModalProps) {
  const [formData, setFormData] = useState<FlightFormData>({
    flight_number: "",
    destination: "",
    departure_time: "",
    gate: "",
    status: "scheduled"
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.flight_number.trim()) {
      newErrors.flight_number = "Flight number is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }
    if (!formData.departure_time) {
      newErrors.departure_time = "Departure time is required";
    }
    if (!formData.gate.trim()) {
      newErrors.gate = "Gate is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
    
    // Reset form
    setFormData({
      flight_number: "",
      destination: "",
      departure_time: "",
      gate: "",
      status: "scheduled"
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof FlightFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Only clear error for fields that exist in FormErrors
    if (field !== 'status' && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Add New Flight</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Enter flight details below</p>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flight_number">
                  Flight Number *
                </Label>
                <Input
                  id="flight_number"
                  placeholder="e.g., AA123"
                  value={formData.flight_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("flight_number", e.target.value)}
                  className={`h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.flight_number ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                <AnimatePresence>
                  {errors.flight_number && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1 text-red-600 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.flight_number}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">
                  Destination *
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., New York"
                  value={formData.destination}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("destination", e.target.value)}
                  className={`h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.destination ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                <AnimatePresence>
                  {errors.destination && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1 text-red-600 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.destination}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure_time">
                Departure Time *
              </Label>
              <div className="relative">
                <Input
                  id="departure_time"
                  type="datetime-local"
                  value={formData.departure_time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("departure_time", e.target.value)}
                  className={`h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 ${
                    errors.departure_time ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                <CalendarDays className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              </div>
              <AnimatePresence>
                {errors.departure_time && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.departure_time}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gate">
                  Gate *
                </Label>
                <Input
                  id="gate"
                  placeholder="e.g., A12"
                  value={formData.gate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("gate", e.target.value)}
                  className={`h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.gate ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                <AnimatePresence>
                  {errors.gate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1 text-red-600 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.gate}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">
                  Initial Status
                </Label>
                <Select value={formData.status} onValueChange={(value: string) => handleInputChange("status", value)} placeholder="Select status">
                  <SelectTrigger>
                    <SelectValue>Choose status</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="boarding">Boarding</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Flight
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}