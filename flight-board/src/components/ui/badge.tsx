import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, icon, className = "" }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 px-3 py-1 border text-xs font-semibold rounded-full " +
        className
      }
    >
      {children}
      {icon && <span className="text-base">{icon}</span>}
    </span>
  );
} 