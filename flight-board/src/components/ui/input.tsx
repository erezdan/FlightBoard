import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"border rounded p-2 w-full " + (props.className || "")} />;
} 