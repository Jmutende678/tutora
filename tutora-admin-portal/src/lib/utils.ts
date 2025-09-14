import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent animation classes
export const animations = {
  fadeIn: "animate-in fade-in duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300", 
  scaleIn: "animate-in zoom-in-95 duration-200",
  hover: "transition-all duration-200 hover:scale-105"
}

// Consistent shadow classes
export const shadows = {
  card: "shadow-sm hover:shadow-lg transition-shadow duration-200",
  button: "hover:shadow-lg hover:shadow-blue-500/25",
  feature: "shadow-lg shadow-blue-500/10"
}

// Consistent border radius
export const radius = {
  sm: "rounded-lg",
  md: "rounded-xl", 
  lg: "rounded-2xl",
  full: "rounded-full"
}