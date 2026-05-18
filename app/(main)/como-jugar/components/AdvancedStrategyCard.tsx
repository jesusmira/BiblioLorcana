"use client";

import {
  BeakerIcon,
  ForwardIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

type IconId = "beaker" | "forward" | "shield" | "users";

interface AdvancedStrategyCardProps {
  iconId: IconId;
  title: string;
  desc: string;
  color: string;
}

const ICONS: Record<IconId, React.ReactNode> = {
  beaker: <BeakerIcon className="h-6 w-6" />,
  forward: <ForwardIcon className="h-6 w-6" />,
  shield: <ShieldCheckIcon className="h-6 w-6" />,
  users: <UsersIcon className="h-6 w-6" />,
};

export function AdvancedStrategyCard({
  iconId,
  title,
  desc,
  color,
}: AdvancedStrategyCardProps) {
  return (
    <div
      className={`flex gap-6 rounded-[24px] border p-8 transition hover:scale-[1.01] ${color}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[var(--foreground)]">
        {ICONS[iconId]}
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-xl uppercase tracking-wider">{title}</h3>
        <p className="text-sm opacity-80 leading-relaxed text-[var(--foreground)]">
          {desc}
        </p>
      </div>
    </div>
  );
}
