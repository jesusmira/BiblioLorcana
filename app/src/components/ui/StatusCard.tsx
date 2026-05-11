"use client";

interface StatusCardProps {
  title: string;
  message: string;
  className?: string;
}

export default function StatusCard({ title, message, className }: StatusCardProps) {
  return (
    <div className={`${className} cursor-default`}>
      <h3 className="font-[var(--font-title)] text-[1.1rem]">{title}</h3>
      <p className="text-[var(--muted)]">{message}</p>
    </div>
  );
}
