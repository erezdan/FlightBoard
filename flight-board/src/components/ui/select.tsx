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
        className={`appearance-none w-full
                    bg-primary text-primary-foreground
                    hover:bg-primary/90
                    border border-primary
                    px-4 py-2 pr-10 rounded-md text-sm
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    transition-colors
                    disabled:opacity-50 disabled:pointer-events-none
                    ${className}`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      
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
