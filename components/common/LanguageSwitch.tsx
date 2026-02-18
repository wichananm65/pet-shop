import useTranslator from "@/hooks/useTranslator"
import { cn } from "@/lib/utils"

export function LanguageSwitch() {
  const { lang, setLang } = useTranslator()

  const toggle = () => setLang(lang === "th" ? "en" : "th")
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div
      role="switch"
      tabIndex={0}
      aria-checked={lang === "th"}
      onKeyDown={onKeyDown}
      onClick={toggle}
      className="relative flex h-8 w-16 items-center rounded-full bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      {/* Sliding pill with drop shadow */}
      <div
        className={cn(
          "absolute h-7 w-8 rounded-full bg-orange-500 shadow-md transition-all duration-200",
          lang === "th" 
            ? "left-0.5" 
            : "left-[calc(100%-2.125rem)]"
        )}
      />
      
      {/* TH Label */}
      <span
        className={cn(
          "z-10 flex-1 text-center text-xs font-bold transition-colors duration-200",
          lang === "th" ? "text-white" : "text-orange-500"
        )}
      >
        TH
      </span>
      
      {/* EN Label */}
      <span
        className={cn(
          "z-10 flex-1 text-center text-xs font-bold transition-colors duration-200",
          lang === "en" ? "text-white" : "text-orange-500"
        )}
      >
        EN
      </span>
    </div>
  )
}