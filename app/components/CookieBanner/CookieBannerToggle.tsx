"use client";

interface CookieBannerToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function CookieBannerToggle({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieBannerToggleProps) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className="cookie-option">
      <div className="cookie-option-info">
        <p className="font-medium text-[var(--ink)]">{label}</p>
        <p className="text-sm text-[var(--muted)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        className={buildToggleClassName(checked, disabled)}
      >
        <span className={buildThumbClassName(checked)} />
      </button>
    </div>
  );
}

function buildToggleClassName(checked: boolean, disabled: boolean): string {
  const base = "cookie-toggle";
  const on = checked ? " cookie-toggle-on" : "";
  const disabledClass = disabled ? " cookie-toggle-disabled" : "";
  return base + on + disabledClass;
}

function buildThumbClassName(checked: boolean): string {
  return "cookie-toggle-thumb" + (checked ? " cookie-toggle-thumb-on" : "");
}