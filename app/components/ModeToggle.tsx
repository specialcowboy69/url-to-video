"use client";

import { ImageIcon, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaMode } from "@/app/types";

type ModeToggleProps = {
  value: MediaMode;
  onChange: (value: MediaMode) => void;
  disabled?: boolean;
};

const options: Array<{
  value: MediaMode;
  Icon: typeof Video;
}> = [
  { value: "videos", Icon: Video },
  { value: "images", Icon: ImageIcon },
];

export function ModeToggle({ value, onChange, disabled }: ModeToggleProps) {
  const t = useTranslations("Create.mode");

  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-full border border-ink/10 bg-white p-1 shadow-sm"
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
                ? "bg-ink text-white"
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
