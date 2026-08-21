"use client";

import { FileText, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { InputMode } from "@/app/types";

type InputModeToggleProps = {
  value: InputMode;
  onChange: (value: InputMode) => void;
  disabled?: boolean;
};

const options: Array<{
  value: InputMode;
  Icon: typeof Link2;
}> = [
  { value: "url", Icon: Link2 },
  { value: "text", Icon: FileText },
];

export function InputModeToggle({
  value,
  onChange,
  disabled,
}: InputModeToggleProps) {
  const t = useTranslations("Create.inputMode");

  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-full border border-white/70 bg-white/82 p-1 shadow-sm backdrop-blur"
      role="radiogroup"
      aria-label={t("aria")}
    >
      {options.map(({ value: optionValue, Icon }) => {
        const active = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(optionValue)}
            className={`flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
              active
                ? "bg-ink text-white shadow-sm"
                : "text-ink/68 hover:bg-mist disabled:hover:bg-transparent"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{t(optionValue)}</span>
          </button>
        );
      })}
    </div>
  );
}
