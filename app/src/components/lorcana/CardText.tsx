import React from "react";
import { clsx } from "clsx";
import { RESOURCE_CODES, type ResourceType } from "./ResourceIcon";

interface ParsedTextProps {
  text: string;
  className?: string;
}

const resourceImages: Record<ResourceType, string> = {
  strength: "/images/Strength_B&W.png",
  willpower: "/images/Willpower_B&W.png",
  lore: "/images/Lore_B&W.png",
  cost: "/images/Cost_B&W.png",
  exert: "/images/Exert_B&W.png",
  ink: "/images/Ink_B&W.png",
};

function ResourceIconImage({
  type,
  className = "",
  size = 18,
}: {
  type: ResourceType;
  className?: string;
  size?: number;
}) {
  const src = resourceImages[type];

  return (
    <span
      className={clsx("inline-block", className)}
      style={{
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
        maskSize: "contain",
      }}
    />
  );
}

export function parseCardText(text: string): React.ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const regex = /\{[A-Z]?\}/g;
  let match = regex.exec(text);

  if (!match) {
    return text;
  }

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const code = match[0];
    const resourceType = RESOURCE_CODES[code];

    if (resourceType) {
      parts.push(
        <ResourceIconImage
          key={key++}
          type={resourceType}
          className="inline-block align-middle mx-0.5"
        />,
      );
    } else {
      parts.push(code);
    }

    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export function CardText({ text, className }: ParsedTextProps) {
  return <span className={className}>{parseCardText(text)}</span>;
}

export default CardText;
