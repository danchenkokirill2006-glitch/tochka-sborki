import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ClipboardList,
  Contrast,
  Copy,
  House,
  Image,
  Layers,
  LayoutGrid,
  LocateFixed,
  Moon,
  Network,
  Palette,
  Plus,
  Redo2,
  Repeat2,
  RotateCcw,
  Scale,
  Send,
  Shapes,
  Sparkles,
  Square,
  Sun,
  Trash2,
  TriangleAlert,
  Type,
  Undo2,
  WandSparkles,
  X,
} from 'lucide'

const iconSet = {
  home: House,
  courses: BookOpen,
  tasks: ClipboardList,
  assistant: WandSparkles,
  sparkles: Sparkles,
  progress: ChartNoAxesCombined,
  analytics: ChartNoAxesCombined,
  albums: Layers,
  text: Type,
  contrast: Contrast,
  repeat: Repeat2,
  rhythm: Repeat2,
  color: Palette,
  'color-palette': Palette,
  grid: LayoutGrid,
  forward: ArrowRight,
  back: ArrowLeft,
  add: Plus,
  close: X,
  check: Check,
  warning: TriangleAlert,
  sun: Sun,
  moon: Moon,
  photo: Image,
  date: CalendarDays,
  shape: Shapes,
  center: LocateFixed,
  duplicate: Copy,
  delete: Trash2,
  historyBack: Undo2,
  historyForward: Redo2,
  undo: Undo2,
  redo: Redo2,
  composition: LayoutGrid,
  hierarchy: Network,
  balance: Scale,
  send: Send,
  stop: Square,
  refresh: RotateCcw,
  'ai-review': WandSparkles,
} as const

export const UI_ICON_SVGS = iconSet
export type UiIconName = keyof typeof iconSet

type IconNode = typeof House

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function attributeName(name: string): string {
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

export function uiIcon(name: UiIconName | string, className = 'ui-icon', label = ''): string {
  const icon = iconSet[name as UiIconName] ?? iconSet.forward
  const paths = (icon as IconNode).map(([tag, attributes]) => {
    const attrs = Object.entries(attributes)
      .map(([key, value]) => `${attributeName(key)}="${escapeAttribute(String(value))}"`)
      .join(' ')
    return `<${tag} ${attrs}/>`
  }).join('')
  const accessible = label
    ? `role="img" aria-label="${escapeAttribute(label)}"`
    : 'aria-hidden="true"'
  return `<svg class="${escapeAttribute(className)}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false" ${accessible}>${paths}</svg>`
}
