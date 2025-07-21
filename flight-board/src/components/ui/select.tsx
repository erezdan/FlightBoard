// src/components/ui/select.jsx
import React from "react";

interface SelectProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export function Select({
  value,
  onValueChange,
  children,
  className = "",
  placeholder,
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={`appearance-none w-full bg-gray-900 border border-white/30 text-white px-4 py-2 pr-10 rounded-md text-sm ${className}`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>

      {/* חץ SVG בצד ימין */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return <option {...props}>{children}</option>;
}

interface SelectChildrenProps {
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectChildrenProps> = ({ children }) => <>{children}</>;
export const SelectContent: React.FC<SelectChildrenProps> = ({ children }) => <>{children}</>;
export const SelectValue: React.FC<SelectChildrenProps> = ({ children }) => <>{children}</>;
