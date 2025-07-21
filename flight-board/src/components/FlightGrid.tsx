import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FlightCard from "./FlightCard";
import { Flight } from "../features/flights/types";
import { Plane, Search } from "lucide-react";

interface FlightGridProps {
  flights: Flight[];
  onDeleteFlight: (id: string | number) => void;
  isLoading: boolean;
}

const FlightGrid: React.FC<FlightGridProps> = ({ flights, onDeleteFlight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No flights match your current filters. Try adjusting your search criteria or add a new flight.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {flights.map((flight, index) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onDelete={onDeleteFlight}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlightGrid;