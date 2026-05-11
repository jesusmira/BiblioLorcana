import Image from "next/image";
import { clsx } from "clsx";

export type ResourceType = "strength" | "willpower" | "lore" | "cost" | "exert" | "ink";

interface ResourceIconProps {
  type: ResourceType;
  className?: string;
  size?: number;
  variant?: "color" | "mono";
}

const resourceImages: Record<ResourceType, string> = {
  strength: "/images/Strength_B&W.png",
  willpower: "/images/Willpower_B&W.png",
  lore: "/images/Lore_B&W.png",
  cost: "/images/Cost_B&W.png",
  exert: "/images/Exert_B&W.png",
  ink: "/images/Ink_B&W.png",
};

export const RESOURCE_CODES: Record<string, ResourceType> = {
  "{S}": "strength",
  "{W}": "willpower",
  "{L}": "lore",
  "{E}": "exert",
  "{I}": "cost",
  "{C}": "cost",
};

export function ResourceIcon({ type, className = "", size = 20 }: ResourceIconProps) {
  const src = resourceImages[type];

  return (
    <span className={clsx("inline-block", className)} style={{ 
      width: size, 
      height: size, 
      backgroundColor: "currentColor",
      WebkitMaskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
      maskImage: `url(${src})`,
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain"
    }} />
  );
}

export default ResourceIcon;
