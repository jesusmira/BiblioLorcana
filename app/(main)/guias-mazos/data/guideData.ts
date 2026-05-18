import {
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ComponentType, SVGProps } from "react";
import guideDataJson from "./guideData.json";

type IconName =
  | "FireIcon"
  | "SparklesIcon"
  | "BoltIcon"
  | "CurrencyDollarIcon"
  | "ShieldCheckIcon";

const ICON_MAP: Record<IconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
};

export interface InkEntry {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
  color: string;
  description: string;
}

export const INKS: InkEntry[] = guideDataJson.inks.map((ink) => ({
  icon: ICON_MAP[ink.icon as IconName],
  name: ink.name,
  color: ink.color,
  description: ink.description,
}));

export const TIPS: string[] = guideDataJson.tips;

export const INK_NAMES_ES: Record<string, string> = guideDataJson.inkNamesEs;

export function getInkSpanish(ink: string): string {
  return INK_NAMES_ES[ink] ?? ink;
}

export const FALLBACK_CARD_IMAGE = guideDataJson.fallbackCardImage;
