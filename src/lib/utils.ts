import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * - clsx: Handles conditional class merging
 * - tailwind-merge: Ensures Tailwind classes don't conflict
 */
export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}