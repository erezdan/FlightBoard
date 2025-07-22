import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, Plane } from "lucide-react";
import { motion } from "framer-motion";

import FlightFilters from "../components/FlightFilters";
import FlightGrid from "../components/FlightGrid";
import AddFlightModal from "../components/AddFlightModal";
import Toast, { ToastData } from "../components/Toast";

import { useFlights, useAddFlight, useDeleteFlight } from "../features/flights/useFlights";
import { Flight } from "../features/flights/types";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  setStatus,
  setDestination,
  resetFilters,
} from "../features/flights/flightsUiSlice";

const FlightBoardPage: React.FC = () => {
  const dispatch = useDispatch();

  // Filters from Redux
  const statusFilter = useSelector((state: RootState) => state.flightsUi.status);
  const destinationFilter = useSelector((state: RootState) => state.flightsUi.destination);

  // Server data (flights) and loading state via React Query
  const { data: flights = [], isLoading } = useFlights(statusFilter, destinationFilter);
  const { mutateAsync: addFlight } = useAddFlight();
  const { mutateAsync: deleteFlight } = useDeleteFlight();

  // UI local state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  type FlightFormData = {
    flight_number: string;
    destination: string;
    departure_time: string;
    gate: string;
    status: string;
  };

  // Add flight via React Query
  const handleAddFlight = async (formData: FlightFormData) => {
    setIsSubmitting(true);
    try {
      await addFlight({
        flight_number: formData.flight_number,
        destination: formData.destination,
        departure_time: formData.departure_time,
        gate: formData.gate,
        status: formData.status as Flight["status"], // cast to union type
      });
      setIsModalOpen(false);
      showToast(
        "success",
        "Flight added successfully!",
        `${formData.flight_number} to ${formData.destination} has been added.`
      );
    } catch (error) {
      showToast(
        "error",
        "Failed to add flight",
        "Please check your input and try again."
      );
    }
    setIsSubmitting(false);
  };

  // Delete flight via React Query
  const handleDeleteFlight = async (id: number) => {
    try {
      await deleteFlight(Number(id));
      showToast("success", "Flight deleted", "The flight has been removed from the board.");
    } catch (error) {
      showToast("error", "Failed to delete flight", "Please try again.");
    }
  };

  // Trigger filtering and show results info
  const handleSearch = () => {
    showToast(
      "info",
      "Filters applied",
      `Found ${flights.length} flight${flights.length !== 1 ? "s" : ""} matching your criteria.`
    );
  };

  // Clear filters to show all
  const handleClearFilters = () => {
    dispatch(resetFilters());
    showToast("info", "Filters cleared", "Showing all flights.");
  };

  // Show toast message
  const showToast = (
    type: ToastData["type"],
    message: string,
    description: string | null = null
  ) => {
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
              <p className="text-gray-500 mt-2">
                Real-time flight management dashboard
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          onStatusChange={(value) => dispatch(setStatus(value))}
          onDestinationChange={(value) => dispatch(setDestination(value))}
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
                {isLoading && flights.length === 0
                  ? "Loading..."
                  : `Showing ${flights.length} of ${flights.length} flights`}
              </p>
            </div>
          </div>

          <FlightGrid
            flights={flights}
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

export default FlightBoardPage;
