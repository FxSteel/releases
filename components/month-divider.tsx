interface MonthDividerProps {
  monthDate: string;
  monthLabel: string | null;
  lang: string;
}

function formatMonthLabel(monthDate: string, lang: string): string {
  const date = new Date(monthDate);
  const localeMap: Record<string, string> = {
    ES: "es-ES",
    PT: "pt-BR",
    EN: "en-US",
  };
  const locale = localeMap[lang] || "en-US";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  return date.toLocaleDateString(locale, options);
}

export function MonthDivider({ monthDate, monthLabel, lang }: MonthDividerProps) {
  const displayLabel =
    monthLabel && monthLabel.trim()
      ? monthLabel
      : monthDate !== "unknown"
      ? formatMonthLabel(monthDate, lang)
      : "Unreleased";

  return (
    <div className="relative flex items-center my-10 first:mt-0">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative pr-4 bg-neutral-50">
        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
          {displayLabel}
        </span>
      </div>
    </div>
  );
}
