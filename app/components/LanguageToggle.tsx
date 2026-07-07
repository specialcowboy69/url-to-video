"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VideoLanguage } from "@/app/types";

type LanguageToggleProps = {
  value: VideoLanguage;
  onChange: (value: VideoLanguage) => void;
  disabled?: boolean;
};

const options: VideoLanguage[] = ["es", "en"];

export function LanguageToggle({
  value,
  onChange,
  disabled,
}: LanguageToggleProps) {
  const t = useTranslations("Create.language");

  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-full border border-ink/10 bg-white p-1 shadow-sm"
      role="radiogroup"
      aria-label={t("aria")}
    >
      {options.map((optionValue) => {
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
                ? "bg-ocean text-white"
                : "text-ink/68 hover:bg-mist disabled:hover:bg-transparent"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <Languages size={18} aria-hidden="true" />
            <span>{t(optionValue)}</span>
          </button>
        );
      })}
    </div>
  );
}
