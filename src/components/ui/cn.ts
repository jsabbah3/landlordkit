import clsx, { type ClassValue } from "clsx";

/** Tiny className combiner used across the UI kit. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
