import React from "react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface FlightFiltersProps {
  statusFilter: string;
  destinationFilter: string;
  onStatusChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const FlightFilters: React.FC<FlightFiltersProps> = ({ 
  statusFilter, 
  destinationFilter, 
  onStatusChange, 
  onDestinationChange, 
  onSearch, 
  onClear 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Filter className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Filter Flights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={statusFilter} onValueChange={onStatusChange} placeholder="All statuses">
            <SelectTrigger>
              <SelectValue>All statuses</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="boarding">Boarding</SelectItem>
              <SelectItem value="departed">Departed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Destination</label>
          <Input
            placeholder="Enter destination..."
            value={destinationFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDestinationChange(e.target.value)}
            className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-end">
          <Button
            onClick={onSearch}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClear}
            className="h-12 px-6 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default FlightFilters;