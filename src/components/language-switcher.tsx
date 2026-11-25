import { useI18n, type Lang } from "@/i18n";

const options: { lang: Lang; label: string; name: string }[] = [
  { lang: "en", label: "EN", name: "English" },
  { lang: "so", label: "SO", name: "Soomaali" },
];

/** EN | SO toggle. The choice is saved in localStorage (see src/i18n/index.tsx). */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t.meta.switchLabel}>
      {options.map((o) => (
        <button
          key={o.lang}
          type="button"
          lang={o.lang}
          title={o.name}
          aria-label={o.name}
          aria-pressed={lang === o.lang}
          onClick={() => setLang(o.lang)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
