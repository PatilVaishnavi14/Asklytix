import { useState, useRef, useEffect } from 'react'
import { TreePine, Moon, Sun, Sparkles, CircleDot, ChevronDown, Check, Palette } from 'lucide-react'

export const THEMES = [
  {
    id: 'emerald',
    name: 'Emerald Forest',
    tagline: 'Deep pine & neon emerald',
    color: '#10b981',
    accentBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    dotBg: 'bg-emerald-500',
    icon: TreePine,
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    tagline: 'Cosmic deep blue & cyan glow',
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    dotBg: 'bg-sky-400',
    icon: Moon,
  },
  {
    id: 'obsidian',
    name: 'Obsidian OLED',
    tagline: 'Pure black & minimal cyan',
    color: '#22d3ee',
    accentBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    dotBg: 'bg-cyan-400',
    icon: CircleDot,
  },
  {
    id: 'violet',
    name: 'Cosmic Violet',
    tagline: 'Cyberpunk purple & magenta',
    color: '#c084fc',
    accentBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    dotBg: 'bg-purple-400',
    icon: Sparkles,
  },
  {
    id: 'light',
    name: 'Slate Light',
    tagline: 'Clean slate-white dashboard',
    color: '#3b82f6',
    accentBg: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
    dotBg: 'bg-blue-500',
    icon: Sun,
  },
]

export default function ThemeSelector({ currentTheme = 'emerald', onSelectTheme, compact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0]
  const ActiveIcon = activeThemeObj.icon

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm hover:border-slate-600"
        title="Change application theme"
      >
        <span className={`w-2 h-2 rounded-full ${activeThemeObj.dotBg} shadow-sm animate-pulse`} />
        <ActiveIcon size={14} style={{ color: activeThemeObj.color }} />
        {!compact && <span className="font-semibold tracking-wide hidden sm:inline">{activeThemeObj.name}</span>}
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Palette size={13} />
              <span>Select Theme</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">{THEMES.length} styles</span>
          </div>

          <div className="space-y-1">
            {THEMES.map((theme) => {
              const Icon = theme.icon
              const isSelected = theme.id === currentTheme
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border border-slate-600 text-slate-100 font-semibold shadow-inner'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${theme.color}15`,
                        borderColor: `${theme.color}40`,
                        color: theme.color,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium truncate">{theme.name}</span>
                        {theme.id === 'emerald' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal truncate">{theme.tagline}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={14} style={{ color: theme.color }} className="shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
