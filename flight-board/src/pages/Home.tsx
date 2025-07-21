import React, { useState, useEffect } from "react";
import Flight from "../Entities/Flight.json";
import { Button } from "../components/ui/button";
import { Plus, Plane } from "lucide-react";
import { motion } from "framer-motion";

import FlightFilters from "../components/FlightFilters";
import FlightGrid from "../components/FlightGrid";
import AddFlightModal from "../components/AddFlightModal";
import Toast, { ToastData } from "../components/Toast";
import { Flight as FlightType } from "../components/FlightCard";

const Home: React.FC = () => {
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("");

  useEffect(() => {
    loadFlights();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [flights, statusFilter, destinationFilter]);

  const loadFlights = async () => {
    setIsLoading(true);
    try {
      const data = await (Flight as any).list("-departure_time");
      setFlights(data);
    } catch (error) {
      showToast("error", "Failed to load flights", "Please try refreshing the page.");
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = flights;

    if (statusFilter !== "all") {
      filtered = filtered.filter(flight => flight.status === statusFilter);
    }

    if (destinationFilter.trim()) {
      filtered = filtered.filter(flight => 
        flight.destination.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    setFilteredFlights(filtered);
  };

  const handleAddFlight = async (flightData: any) => {
    setIsSubmitting(true);
    try {
      await (Flight as any).create(flightData);
      await loadFlights();
      setIsModalOpen(false);
      showToast("success", "Flight added successfully!", `${flightData.flight_number} to ${flightData.destination} has been added.`);
    } catch (error) {
      showToast("error", "Failed to add flight", "Please check your input and try again.");
    }
    setIsSubmitting(false);
  };

  const handleDeleteFlight = async (flightId: string | number) => {
    try {
      await (Flight as any).delete(flightId);
      await loadFlights();
      showToast("success", "Flight deleted", "The flight has been removed from the board.");
    } catch (error) {
      showToast("error", "Failed to delete flight", "Please try again.");
    }
  };

  const handleSearch = () => {
    applyFilters();
    showToast("info", "Filters applied", `Found ${filteredFlights.length} flight${filteredFlights.length !== 1 ? 's' : ''} matching your criteria.`);
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setDestinationFilter("");
    showToast("info", "Filters cleared", "Showing all flights.");
  };

  const showToast = (type: ToastData["type"], message: string, description: string | null = null) => {
    setToast({ type, message, description: description || undefined });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Flight Board
              </h1>
              <p className="text-gray-500 mt-2">Real-time flight management dashboard</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            >
              <Plus className="w-5 h-5 mr-3" />
              Add New Flight
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <FlightFilters
          statusFilter={statusFilter}
          destinationFilter={destinationFilter}
          onStatusChange={setStatusFilter}
          onDestinationChange={setDestinationFilter}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        {/* Flight Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Active Flights</h2>
              <p className="text-gray-500">
                {isLoading ? "Loading..." : `Showing ${filteredFlights.length} of ${flights.length} flights`}
              </p>
            </div>
          </div>
          
          <FlightGrid
            flights={filteredFlights}
            onDeleteFlight={handleDeleteFlight}
            isLoading={isLoading}
          />
        </motion.div>
      </div>

      {/* Add Flight Modal */}
      <AddFlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFlight}
        isSubmitting={isSubmitting}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Home;