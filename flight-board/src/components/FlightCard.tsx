
import React from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Trash2, Plane, Clock, MapPin, Hash, X } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Flight } from "../features/flights/types";

interface FlightCardProps {
  flight: Flight;
  onDelete: (id: number) => void;
  index: number;
}

type StatusKey = Flight["status"];

const statusConfig: Record<StatusKey, {
  color: string;
  icon: React.ElementType;
  bgColor: string;
}> = {
  scheduled: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
    bgColor: "bg-gradient-to-r from-blue-50 to-blue-100"
  },
  boarding: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Plane,
    bgColor: "bg-gradient-to-r from-green-50 to-green-100"
  },
  departed: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Plane,
    bgColor: "bg-gradient-to-r from-gray-50 to-gray-100"
  },
  delayed: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    bgColor: "bg-gradient-to-r from-amber-50 to-amber-100"
  },
  cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: X,
    bgColor: "bg-gradient-to-r from-red-50 to-red-100"
  }
};

export default function FlightCard({ flight, onDelete, index }: FlightCardProps) {
  const config = statusConfig[flight.status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300"
    >
      <div className={`h-1 ${config.bgColor.split(' ')[0]} ${config.bgColor.split(' ')[1]} ${config.bgColor.split(' ')[2]}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900">{flight.flight_number}</h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{flight.destination}</p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(flight.id)}
              className="w-10 h-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Departure</p>
            <p className="text-sm font-semibold text-gray-900">
              {format(new Date(flight.departure_time), "MMM d, h:mm a")}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gate</p>
            <p className="text-sm font-semibold text-gray-900">{flight.gate}</p>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={flight.status}
        >
          <Badge className={`${config.color} border font-medium px-3 py-1 flex items-center gap-2 w-fit`}>
            <StatusIcon className="w-3 h-3" />
            {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  );
}
