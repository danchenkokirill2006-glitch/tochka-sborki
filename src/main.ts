import { makeBaseObjects, makeReferenceObjects } from './task-layouts'
import './style.css'
import { mountAiChat } from './ai-chat'
let disposeHero: (() => void) | undefined
let heroGeneration = 0
import { toBlob } from 'html-to-image'
import { evaluateProject, projects, starterFor, exerciseSpecs, ASSIGNMENT_VERSION, type Evaluation } from './assignments'
import { allTaskMaterialSources, materialFor, taskMaterials, type TaskMaterial } from './task-assets'
import { UI_ICON_SVGS, uiIcon } from './ui-icons'

const LOGO_SIGN_SRC = new URL('./assets/logo-sign-color.png', import.meta.url).href


function injectIconOverrides() {
  if (document.getElementById('ui-icon-overrides')) return
  const style = document.createElement('style')
  style.id = 'ui-icon-overrides'
  style.textContent = `
    .ui-icon{width:18px!important;height:18px!important;display:block!important;flex:0 0 18px!important;overflow:visible!important;color:currentColor!important;fill:none!important;stroke:currentColor!important}
    .nav-item .ui-icon{width:16px!important;height:16px!important;flex-basis:16px!important}
    .primary-button .ui-icon,.secondary-button .ui-icon,.outline-button .ui-icon,.task-row-action .ui-icon,.feature-arrow .ui-icon{width:16px!important;height:16px!important;flex-basis:16px!important}
    .theory-icon span,.task-row-icon,.skill-icon{font-size:0!important;display:grid!important;place-items:center!important}
    .theory-icon::before,.theory-icon::after,.task-row-icon::before,.task-row-icon::after,.skill-icon::before,.skill-icon::after{content:none!important;display:none!important;background:none!important}
    .theory-icon,.task-row-icon,.skill-icon{background-image:none!important}
    .theory-icon .ui-icon,.task-row-icon .ui-icon,.skill-icon .ui-icon{width:24px!important;height:24px!important;flex-basis:24px!important}
    .assistant-orb .ui-icon{width:30px!important;height:30px!important}
    .ai-spark .ui-icon,.hint-mark .ui-icon{width:18px!important;height:18px!important}
    .history-buttons .ui-icon{width:18px!important;height:18px!important}
    .modal-close .ui-icon{width:16px!important;height:16px!important}
    .theme-icon .ui-icon{width:15px!important;height:15px!important}
    .brand-logo{width:44px!important;height:44px!important;display:grid!important;place-items:center!important;overflow:visible!important}
    .brand-logo img{width:44px!important;height:44px!important;object-fit:contain!important;filter:none!important}
    .editor-wordmark{width:44px!important;height:44px!important;object-fit:contain!important;filter:none!important}
    .hero-wordmark{width:min(420px,82%)!important;height:auto!important;max-height:110px!important;object-fit:contain!important;object-position:left center!important;display:block!important;margin:0 0 26px!important}
  `
  document.head.appendChild(style)
}

type Screen = 'home' | 'courses' | 'tasks' | 'assistant' | 'progress' | 'profile' | 'editor'
type Task = {
  id: string
  number: string
  title: string
  description: string
  level: 'Базовый' | 'Средний' | 'Продвинутый'
  time: string
  score: number
  accent: string
  icon: string
  theory: string[]
  brief: string
  steps: string[]
}

type EditorObject = {
  id: string
  type: 'text' | 'photo' | 'date' | 'shape'
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity?: number
  text?: string
  fontSize?: number
  fontWeight?: number
  fontFamily?: string
  color?: string
  background?: string
  radius?: number
  imageSrc?: string
  fit?: 'cover' | 'contain'
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  assetId?: string
  materialKind?: TaskMaterial['kind']
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right'
}

const tasks: Task[] = [
  {
    id: 'composition',
    number: '01',
    title: 'Композиция',
    description: 'Создайте афишу выставки «Город форм».',
    level: 'Базовый',
    time: '10 мин',
    score: 0,
    accent: 'lime',
    icon: 'composition',
    theory: ['Композиция — это система организации элементов в пределах формата. Она отвечает за то, куда сначала падает взгляд, как он движется по макету и ощущается ли работа цельной.', 'Начинайте с главного элемента: определите визуальный центр и его роль. Затем добавляйте второстепенные массы, выстраивая между ними понятные интервалы.', 'Балансируйте крупные и мелкие формы, чередуйте плотные и свободные зоны, не бойтесь оставлять пустое пространство.', 'Используйте сетку как опору, но проверяйте композицию целиком: если убрать цвет и детали, структура всё равно должна оставаться читаемой.', 'Проверьте три вещи: главный акцент, равновесие масс и маршрут движения взгляда.'],
    brief: 'Соберите плакат из нескольких разноразмерных масс так, чтобы взгляд двигался от главного объекта к второстепенным без случайных провалов.',
    steps: ['Создайте один явный визуальный центр и минимум три второстепенные массы.', 'Настройте интервалы и баланс, не выравнивая всё механически по центру.', 'Проверьте макет в уменьшенном виде: композиция должна читаться без деталей.'],
  },
  {
    id: 'hierarchy',
    number: '02',
    title: 'Иерархия',
    description: 'Создайте афишу мастер-класса по типографике.',
    level: 'Базовый',
    time: '12 мин',
    score: 0,
    accent: 'violet',
    icon: 'hierarchy',
    theory: ['Иерархия задаёт порядок чтения: зритель должен быстро понять, что здесь главное, что поясняет смысл и что является второстепенной деталью.', 'Главный акцент усиливают размер, контраст, положение, насыщенность и свободное пространство вокруг элемента.', 'Не делайте все элементы одинаково заметными: один уровень должен доминировать, остальные — поддерживать его.', 'Полезно проверить макет в уменьшенном виде или издалека: если заголовок, изображение и действие невозможно различить по приоритету, иерархию стоит пересобрать.', 'Хорошая иерархия экономит внимание и делает сложную информацию понятной.'],
    brief: 'Постройте макет с тремя уровнями важности: главный заголовок, поясняющий блок и второстепенные детали.',
    steps: ['Создайте три уровня текста и задайте им заметно разный визуальный вес.', 'Добавьте изображение или форму, но не позволяйте им спорить с главным заголовком.', 'Проверьте порядок чтения за 3 секунды — сначала должно считываться главное.'],
  },
  {
    id: 'balance',
    number: '03',
    title: 'Баланс',
    description: 'Создайте постер концерта «Ночь музыки».',
    level: 'Средний',
    time: '15 мин',
    score: 0,
    accent: 'orange',
    icon: 'balance',
    theory: ['Баланс — это ощущение устойчивости композиции, когда ни одна часть макета случайно не перетягивает внимание.', 'Большой элемент может уравновешиваться группой небольших элементов, контрастом, направлением или большим объёмом пустого пространства.', 'Симметрия — только один из способов добиться баланса. Асимметричная композиция часто выглядит живее и динамичнее.', 'Проверяйте визуальный вес, а не количество объектов: один тёмный или контрастный объект может весить больше нескольких светлых.', 'Если композиция кажется «падающей», попробуйте изменить размер, положение или расстояние между ключевыми массами.'],
    brief: 'Создайте асимметричную композицию и добейтесь ощущения устойчивости без зеркальной симметрии.',
    steps: ['Разместите одну крупную тяжёлую массу вне центра.', 'Уравновесьте её группой меньших элементов и пустым пространством.', 'Проверьте, не тянет ли один контрастный объект композицию в сторону.'],
  },
  {
    id: 'rhythm',
    number: '04',
    title: 'Ритм',
    description: 'Создайте афишу фестиваля «Ритм города».',
    level: 'Средний',
    time: '15 мин',
    score: 0,
    accent: 'blue',
    icon: 'rhythm',
    theory: ['Ритм появляется через повторение, чередование и изменение элементов. Он помогает связать отдельные объекты в единую визуальную последовательность.', 'Повторяйте форму, размер, цвет или интервал, а затем постепенно меняйте один параметр, чтобы создать движение.', 'Равномерный ритм создаёт спокойствие, а ускорение, пауза или неожиданный акцент делают композицию выразительнее.', 'Следите за интервалами: одинаковые расстояния создают систему, а осознанное нарушение системы — точку внимания.', 'Ритм особенно полезен в карточках, интерфейсах и сериях слайдов, где нужно ощущение единого набора.'],
    brief: 'Постройте визуальную последовательность из повторяющихся элементов и сознательно сломайте её в одной точке.',
    steps: ['Создайте серию из минимум пяти повторяющихся форм.', 'Изменяйте один параметр: размер, интервал, направление или цвет.', 'Сделайте один осознанный акцент, который завершает ритмический ряд.'],
  },
  {
    id: 'color',
    number: '05',
    title: 'Цвет',
    description: 'Создайте постер летнего эко-маркета.',
    level: 'Продвинутый',
    time: '18 мин',
    score: 0,
    accent: 'pink',
    icon: 'color',
    theory: ['Цвет помогает выделять смысловые связи, создавать настроение и управлять вниманием. Он работает не только как украшение, но и как часть визуальной структуры.', 'Контраст может быть цветовым, светлотным, по насыщенности или температуре. Сильнее всего обычно работает сочетание нескольких контрастов в одной точке.', 'Сначала определите роль цвета: фон, основной цвет, акцент и нейтральные оттенки. Это помогает не превратить макет в набор случайных пятен.', 'Проверяйте светлотный контраст отдельно от оттенка: если макет теряет структуру в чёрно-белом виде, цвет не сможет полностью её спасти.', 'Ограниченная палитра чаще делает учебную композицию чище и помогает акцентному цвету действительно работать.'],
    brief: 'Соберите палитру из нейтрального фона, основного цвета и одного акцентного цвета. Контраст должен работать на смысл.',
    steps: ['Выберите три роли цвета: фон, основной и акцент.', 'Создайте минимум четыре цветовых пятна разного визуального веса.', 'Проверьте светлотный контраст в чёрно-белом виде.'],
  },
  {
    id: 'grid',
    number: '06',
    title: 'Модульная сетка',
    description: 'Создайте информационный постер Design Day.',
    level: 'Продвинутый',
    time: '20 мин',
    score: 0,
    accent: 'cyan',
    icon: 'grid',
    theory: ['Модульная сетка задаёт правила размещения элементов: колонки, поля, интервалы и базовые линии. Благодаря этому макет легче собирать и масштабировать.', 'Сначала определите формат и поля, затем количество колонок и рабочий интервал. После этого привязывайте основные блоки к модулям.', 'Сетка помогает сохранить единый ритм и особенно полезна в сериях экранов, карточек и многостраничных материалов.', 'Не нужно механически помещать каждый объект в ячейку: осознанный выход за сетку может стать сильным акцентом.', 'После сборки проверьте повторяющиеся линии и интервалы — именно они создают ощущение профессиональной структуры.'],
    brief: 'Соберите многоэлементный плакат на модульной сетке: поля, колонки, интервалы и несколько блоков должны работать как единая система.',
    steps: ['Включите сетку и определите поля и рабочие колонки.', 'Привяжите крупные блоки к разным модулям, сохраняя единые интервалы.', 'Осознанно нарушьте сетку одним акцентом и проверьте, что система всё ещё читается.'],
  },
]

let screen: Screen = 'home'
let selectedTask = tasks[0]
let mobileEditorView: 'canvas' | 'add' | 'properties' | 'layers' = 'canvas'
let briefOpen = true
let selectedId: string | null = null
let showGrid = false
let viewScale = 0
let viewX = 0
let viewY = 0
let autoFit = true
let handTool = false
let spaceHeld = false
let paletteTarget: 'background' | 'text' | 'fill' = 'background'
let lastMaterialDropAt = 0
let checkBusy = false
let workspaceObserver: ResizeObserver | undefined
let exportBusy = false
let panMomentumFrame = 0
let history: string[] = []
let historyIndex = -1
let toastTimer: number | undefined
let draftSaveTimer: number | undefined
let historyCommitTimer: number | undefined
let draftSaveStatus: 'saved' | 'saving' | 'error' = 'saved'
let storageErrorNotified = false
const USERS_STORAGE_KEY = 'tochka-sborki:users:v1'
const CURRENT_USER_KEY = 'tochka-sborki:current-user:v1'
const DRAFT_PREFIX = 'tochka-sborki:draft:v2:'
const BRIEF_DISMISSED_PREFIX = 'tochka-sborki:brief-dismissed:v1:'
const LEGACY_PROFILE_STORAGE_KEY = 'tochka-sborki:profile'
const LEGACY_THEME_STORAGE_KEY = 'tochka-sborki:theme:v3'
const LEGACY_SUBSCRIPTION_STORAGE_KEY = 'tochka-sborki:subscription:v1'

const FEATURE_IMAGES = {
  composition: new URL('./assets/composition.png', import.meta.url).href,
  color: new URL('./assets/color.png', import.meta.url).href,
  typography: new URL('./assets/typography.png', import.meta.url).href,
  ai: new URL('./assets/ai.png', import.meta.url).href,
  interactive: new URL('./assets/interactive.png', import.meta.url).href,
  progress: new URL('./assets/progress.png', import.meta.url).href,
}
const HERO_SCULPTURE_SRC = new URL('./assets/hero-sculpture.png', import.meta.url).href

type ProfileData = { name: string; role: string; photo: string }
type UserAccount = {
  id: string
  createdAt: string
  profile: ProfileData
  scores: Record<string, number>
  scoreVersion?: number
  previousScores?: Record<string, number>
  theme: 'dark' | 'light'
  subscriptionActive: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value))
const PROFILE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const PROFILE_IMAGE_MAX_BYTES = 8_000_000
const PROFILE_IMAGE_MAX_DATA = 2_500_000

function safeStorageGet(key: string) {
  try { return window.localStorage.getItem(key) } catch { return null }
}

function safeStorageSet(key: string, value: string) {
  try { window.localStorage.setItem(key, value); return true } catch { return false }
}

function safeImageData(value: unknown, maxLength = PROFILE_IMAGE_MAX_DATA): value is string {
  return typeof value === 'string' && value.length <= maxLength && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)
}

function cleanProfile(value: unknown, fallbackName = 'Новый пользователь'): ProfileData {
  const source = isRecord(value) ? value : {}
  const name = typeof source.name === 'string' ? source.name.trim().slice(0, 48) : ''
  const role = typeof source.role === 'string' ? source.role.trim().slice(0, 80) : ''
  return {
    name: name || fallbackName,
    role: role || 'Дизайнер в процессе',
    photo: safeImageData(source.photo) ? source.photo : '',
  }
}

function cleanScores(value: unknown) {
  const source = isRecord(value) ? value : {}
  return Object.fromEntries(tasks.map(task => {
    const score = Number(source[task.id])
    return [task.id, Number.isFinite(score) ? clamp(Math.round(score), 0, 100) : 0]
  }))
}

let currentUserId = ''
let users: Record<string, UserAccount> = {}
let profile: ProfileData = { name: 'Кирилл', role: 'Дизайнер в процессе', photo: '' }
let theme: 'dark' | 'light' = 'dark'
let subscriptionActive = false

function makeUserId() {
  try { return crypto.randomUUID() } catch { return `user-${Date.now()}-${Math.random().toString(16).slice(2)}` }
}

function createUser(seed?: Partial<UserAccount>): UserAccount {
  const nextProfile = cleanProfile(seed?.profile, seed?.id ? 'Новый пользователь' : 'Новый пользователь')
  return {
    id: typeof seed?.id === 'string' && /^[\w-]{1,80}$/.test(seed.id) ? seed.id : makeUserId(),
    createdAt: seed?.createdAt || new Date().toISOString(),
    profile: nextProfile,
    scores: seed?.scoreVersion === ASSIGNMENT_VERSION ? cleanScores(seed.scores) : cleanScores({}),
    previousScores: seed?.scoreVersion === ASSIGNMENT_VERSION ? cleanScores(seed.previousScores) : cleanScores(seed?.scores),
    scoreVersion: ASSIGNMENT_VERSION,
    theme: seed?.theme === 'light' ? 'light' : 'dark',
    subscriptionActive: Boolean(seed?.subscriptionActive),
  }
}

function persistUsers() {
  const usersSaved = safeStorageSet(USERS_STORAGE_KEY, JSON.stringify(users))
  const currentSaved = safeStorageSet(CURRENT_USER_KEY, currentUserId)
  return usersSaved && currentSaved
}

function activateUser(account: UserAccount) {
  if (account.scoreVersion !== ASSIGNMENT_VERSION) { account.previousScores = {...account.scores}; account.scores = {}; account.scoreVersion = ASSIGNMENT_VERSION }
  currentUserId = account.id
  users[currentUserId] = account
  profile = { ...account.profile }
  theme = account.theme
  subscriptionActive = account.subscriptionActive
  tasks.forEach(task => { task.score = account.scores[task.id] || 0 })
  persistUsers()
}

function loadUserBase() {
  try {
    const storedUsers: unknown = JSON.parse(safeStorageGet(USERS_STORAGE_KEY) || '{}')
    users = {}
    if (isRecord(storedUsers)) {
      Object.entries(storedUsers).forEach(([key, value]) => {
        if (!isRecord(value)) return
        const account = createUser({
          id: typeof value.id === 'string' ? value.id : key,
          createdAt: typeof value.createdAt === 'string' ? value.createdAt : undefined,
          profile: cleanProfile(value.profile),
          scores: cleanScores(value.scores),
          scoreVersion: typeof value.scoreVersion === 'number' ? value.scoreVersion : undefined,
          previousScores: cleanScores(value.previousScores),
          theme: value.theme === 'light' ? 'light' : 'dark',
          subscriptionActive: Boolean(value.subscriptionActive),
        })
        if (account.id === key) users[key] = account
      })
    }
  } catch { users = {} }
  const savedCurrent = safeStorageGet(CURRENT_USER_KEY) || ''
  if (savedCurrent && users[savedCurrent]) { activateUser(users[savedCurrent]); return }

  let legacyProfile: Partial<ProfileData> = {}
  let legacyTheme: 'dark' | 'light' = 'dark'
  let legacySubscription = false
  try {
    const value: unknown = JSON.parse(safeStorageGet(LEGACY_PROFILE_STORAGE_KEY) || '{}')
    if (isRecord(value)) legacyProfile = cleanProfile(value)
  } catch {}
  const savedTheme = safeStorageGet(LEGACY_THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') legacyTheme = savedTheme
  legacySubscription = safeStorageGet(LEGACY_SUBSCRIPTION_STORAGE_KEY) === 'active'
  const account = createUser({
    profile: cleanProfile({ name: 'Кирилл', role: 'Дизайнер в процессе', photo: '', ...legacyProfile }, 'Кирилл'),
    theme: legacyTheme,
    subscriptionActive: legacySubscription,
  })
  activateUser(account)
}

function saveUserBase() {
  const account = users[currentUserId]
  if (!account) return false
  account.profile = { ...profile }
  account.theme = theme
  account.subscriptionActive = subscriptionActive
  account.scores = Object.fromEntries(tasks.map(task => [task.id, task.score]))
  return persistUsers()
}

function saveProfile() { return saveUserBase() }
function saveTheme() { return saveUserBase() }
function saveScores() { return saveUserBase() }
function saveSubscription() { return saveUserBase() }
function applyTheme() {
  document.documentElement.dataset.theme = theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f2f7' : '#101110')
}
function loadScores() { tasks.forEach(task => { task.score = users[currentUserId]?.scores?.[task.id] || 0 }) }

const app = document.querySelector<HTMLDivElement>('#app')!

function showRuntimeFallback() {
  const root = app || document.body
  root.innerHTML = `<main class="fatal-state" role="alert"><span class="card-kicker">ТОЧКА СБОРКИ</span><h1>Не получилось открыть экран</h1><p>Ваши сохранённые макеты остаются в браузере. Обновите страницу и попробуйте ещё раз.</p><button type="button" class="primary-button" data-reload>Обновить страницу</button></main>`
}

window.addEventListener('error', () => showRuntimeFallback())
window.addEventListener('unhandledrejection', () => showRuntimeFallback())
document.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('[data-reload]')) window.location.reload()
})

loadUserBase()
loadScores()
applyTheme()

const TASK_BACKGROUNDS: Record<string, string> = {
  composition:'#f0ede6', hierarchy:'#f2efe9', balance:'#141720', rhythm:'#efe9dd', color:'#f4f1e8', grid:'#f4f3ef',
}

const makeInitialObjects = () => makeReferenceObjects(selectedTask.id)
let posterBackground = '#f2f0e9'
let objects: EditorObject[] = starterFor(selectedTask.id, makeInitialObjects())

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char] ?? char))
}

function normalizeEditorObject(value: unknown, index: number): EditorObject | null {
  if (!isRecord(value) || !['text', 'photo', 'date', 'shape'].includes(String(value.type))) return null
  const type = value.type as EditorObject['type']
  const id = typeof value.id === 'string' && /^[\w-]{1,80}$/.test(value.id) ? value.id : `restored-${type}-${index}`
  const number = (key: string, fallback: number, min: number, max: number) => {
    const candidate = Number(value[key])
    return Number.isFinite(candidate) ? clamp(candidate, min, max) : fallback
  }
  const color = (key: string, fallback: string) => typeof value[key] === 'string' && /^#[0-9a-f]{6}$/i.test(value[key] as string) ? value[key] as string : fallback
  const bundledImage = typeof value.imageSrc === 'string' && allTaskMaterialSources.has(value.imageSrc) ? value.imageSrc : undefined
  const photo = safeImageData(value.imageSrc, 3_500_000) ? value.imageSrc : bundledImage
  const fonts = ['Manrope', 'Inter', 'Arial', 'Georgia', 'Courier New']
  return {
    id,
    type,
    name: typeof value.name === 'string' ? value.name.slice(0, 80) : type === 'photo' ? 'Фотография' : type === 'shape' ? 'Форма' : 'Текст',
    x: number('x', 0, -10_000, 10_000),
    y: number('y', 0, -10_000, 10_000),
    width: number('width', 180, 1, 4_000),
    height: number('height', 80, 1, 4_000),
    rotation: number('rotation', 0, -3_600, 3_600),
    opacity: number('opacity', 1, 0.1, 1),
    text: typeof value.text === 'string' ? value.text.slice(0, 4_000) : '',
    fontSize: number('fontSize', 24, 8, 300),
    fontWeight: number('fontWeight', 700, 100, 900),
    fontFamily: typeof value.fontFamily === 'string' && fonts.includes(value.fontFamily) ? value.fontFamily : 'Manrope',
    color: color('color', '#111111'),
    background: color('background', type === 'shape' ? '#8b5cf6' : '#d9d9d3'),
    radius: number('radius', 0, 0, 1_500),
    imageSrc: photo,
    fit: value.fit === 'contain' ? 'contain' : 'cover',
    imagePosition: ['center','top','bottom','left','right'].includes(String(value.imagePosition)) ? value.imagePosition as EditorObject['imagePosition'] : 'center',
    assetId: typeof value.assetId === 'string' && /^[\w-]{1,80}$/.test(value.assetId) ? value.assetId : undefined,
    materialKind: ['photo','graphic','logo'].includes(String(value.materialKind)) ? value.materialKind as TaskMaterial['kind'] : undefined,
    lineHeight: number('lineHeight', 1, 0.7, 2.5),
    letterSpacing: number('letterSpacing', 0, -10, 30),
    textAlign: ['left','center','right'].includes(String(value.textAlign)) ? value.textAlign as EditorObject['textAlign'] : 'left',
  }
}

function updateDraftStatus() {
  const status = app?.querySelector<HTMLElement>('[data-save-status]')
  if (!status) return
  const labels = { saved: 'СОХРАНЕНО', saving: 'СОХРАНЯЕМ…', error: 'НЕ СОХРАНЕНО' }
  const label = status.querySelector<HTMLElement>('[data-save-label]')
  if (label) label.textContent = labels[draftSaveStatus]
  status.dataset.state = draftSaveStatus
}

function legacyDraftKey(taskId = selectedTask.id) { return `${DRAFT_PREFIX}${currentUserId}:${taskId}` }
function draftKey(taskId = selectedTask.id) { return `${legacyDraftKey(taskId)}:v${ASSIGNMENT_VERSION}` }
function briefDismissedKey(taskId = selectedTask.id) { return `${BRIEF_DISMISSED_PREFIX}${currentUserId}:${taskId}:v${ASSIGNMENT_VERSION}` }

function hasDraft(taskId: string) {
  return Boolean(safeStorageGet(draftKey(taskId)))
}

function saveDraft() {
  window.clearTimeout(draftSaveTimer)
  const saved = safeStorageSet(draftKey(), JSON.stringify({version:2, assignmentVersion:ASSIGNMENT_VERSION, objects, background:posterBackground, updatedAt:Date.now()}))
  draftSaveStatus = saved ? 'saved' : 'error'
  updateDraftStatus()
  if (!saved && !storageErrorNotified) {
    storageErrorNotified = true
    notify('Не удалось сохранить макет. Скачайте PNG, чтобы не потерять работу')
  }
}

function scheduleDraftSave() {
  draftSaveStatus = 'saving'
  updateDraftStatus()
  window.clearTimeout(draftSaveTimer)
  draftSaveTimer = window.setTimeout(saveDraft, 250)
}

function loadDraft(legacy = false) {
  try {
    const raw = safeStorageGet(legacy ? legacyDraftKey() : draftKey())
    if (!raw) return false
    const saved: unknown = JSON.parse(raw)
    if (!isRecord(saved) || saved.version !== 2 || !Array.isArray(saved.objects)) return false
    objects = saved.objects.map((value,index) => {
      if(isRecord(value)&&typeof value.assetId==='string'&&!safeImageData(value.imageSrc,3_500_000)) { const asset=materialFor(selectedTask.id,value.assetId);if(asset)value={...value,imageSrc:asset.src} }
      return normalizeEditorObject(value,index)
    }).filter((item): item is EditorObject => item !== null)
    const legacyPhoto=taskMaterials[selectedTask.id]?.find(item=>item.kind==='photo')
    if(legacyPhoto){
      for(const item of objects){
        if(item.type!=='photo'||item.imageSrc)continue
        item.imageSrc=legacyPhoto.src;item.assetId=legacyPhoto.id;item.materialKind='photo';item.fit=legacyPhoto.fit;item.name=item.name==='Фотография'?legacyPhoto.name:item.name
      }
    }
    posterBackground = typeof saved.background === 'string' && /^#[0-9a-f]{6}$/i.test(saved.background) ? saved.background : '#f2f0e9'
    return true
  } catch { return false }
}

function snapshot() {
  return JSON.stringify({ objects, background: posterBackground })
}

function restoreSnapshot(value: string) {
  try {
    const saved: unknown = JSON.parse(value)
    const savedObjects = Array.isArray(saved) ? saved : isRecord(saved) ? saved.objects : null
    if (!Array.isArray(savedObjects)) return
    objects = savedObjects.map(normalizeEditorObject).filter((item): item is EditorObject => item !== null)
    if (!Array.isArray(saved) && isRecord(saved)) posterBackground = typeof saved.background === 'string' && /^#[0-9a-f]{6}$/i.test(saved.background) ? saved.background : '#f2f0e9'
  } catch { return }
  selectedId = null
  saveDraft()
  render()
}

function saveHistory() {
  window.clearTimeout(historyCommitTimer)
  historyCommitTimer = undefined
  const value = snapshot()
  if (history[historyIndex] === value) return
  history = history.slice(0, historyIndex + 1)
  history.push(value)
  if (history.length > 80) history.shift()
  historyIndex = history.length - 1
  if (screen === 'editor') saveDraft()
  const undoButton = app.querySelector<HTMLButtonElement>('[data-action="undo"]')
  const redoButton = app.querySelector<HTMLButtonElement>('[data-action="redo"]')
  if (undoButton) undoButton.disabled = historyIndex <= 0
  if (redoButton) redoButton.disabled = historyIndex >= history.length - 1
  updateEditorControlState()
}

function scheduleHistoryCommit() {
  window.clearTimeout(historyCommitTimer)
  historyCommitTimer = window.setTimeout(saveHistory, 280)
}

function undo() {
  if (historyCommitTimer) saveHistory()
  if (historyIndex <= 0) return
  historyIndex -= 1
  restoreSnapshot(history[historyIndex])
  notify('Действие отменено')
}

function redo() {
  if (historyCommitTimer) saveHistory()
  if (historyIndex >= history.length - 1) return
  historyIndex += 1
  restoreSnapshot(history[historyIndex])
  notify('Действие возвращено')
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function selectedObject() {
  return objects.find((object) => object.id === selectedId) ?? null
}

function selectObject(id: string | null) {
  selectedId = id
  // Selection is rendered in-place so the canvas does not recreate DOM nodes
  // while a touch/pointer interaction is in progress. Remove handles from
  // every previously selected object before adding them to the new one.
  app.querySelectorAll<HTMLElement>('[data-object]').forEach((node) => {
    const isSelected = node.dataset.object === id
    node.classList.toggle('selected', isSelected)
    node.setAttribute('aria-pressed', String(isSelected))
    if (!isSelected) node.querySelectorAll('[data-resize]').forEach((handle) => handle.remove())
    else if (!node.querySelector('[data-resize]')) { node.insertAdjacentHTML('beforeend', renderHandles()); node.querySelectorAll<HTMLElement>('[data-resize]').forEach(bindResizeHandle) }
  })
  app.querySelectorAll<HTMLElement>('[data-select]').forEach((node) => {
    node.classList.toggle('selected', node.dataset.select === id)
    node.setAttribute('aria-selected', String(node.dataset.select === id))
  })
  refreshPropertiesPanel()
  updateEditorControlState()
}

function updateEditorControlState() {
  const index = objects.findIndex(item => item.id === selectedId)
  const disabled = index < 0
  const setDisabled = (action: string, value: boolean) => {
    const button = app.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)
    if (button) button.disabled = value
  }
  setDisabled('duplicate', disabled)
  setDisabled('delete', disabled)
  setDisabled('center', disabled)
  setDisabled('undo', historyIndex <= 0)
  setDisabled('redo', historyIndex >= history.length - 1)
}

function refreshPropertiesPanel() {
  const host = app.querySelector<HTMLElement>('[data-properties-host]')
  if (!host) return
  const object = selectedObject()
  const panel = host.closest<HTMLElement>('.right-panel')
  panel?.classList.toggle('has-selection', Boolean(object))
  panel?.classList.toggle('is-empty', !object)
  host.innerHTML = object ? renderProperties(object) : renderEmptyProperties()
  bindPropertyControls()
  updatePropertyInputs()
}

function duplicateSelected() {
  const object = selectedObject()
  if (!object) return
  const copy: EditorObject = {
    ...object,
    id: `${object.id}-${Date.now()}`,
    name: `${object.name} копия`,
    x: object.x + 24,
    y: object.y + 24,
  }
  objects.push(copy)
  selectedId = copy.id
  saveHistory()
  render()
  notify('Элемент дублирован')
}

function deleteSelected() {
  if (!selectedId) return
  objects = objects.filter((object) => object.id !== selectedId)
  selectedId = null
  saveHistory()
  render()
  notify('Элемент удалён')
}

function centerSelected() {
  const object = selectedObject()
  const poster = document.querySelector<HTMLElement>('.poster')
  if (!object || !poster) return
  object.x = Math.max(0, (poster.clientWidth - object.width) / 2)
  object.y = Math.max(0, (poster.clientHeight - object.height) / 2)
  saveHistory()
  render()
  notify('Элемент выровнен по центру')
}

function addObject(type: EditorObject['type']) {
  const presets: Record<EditorObject['type'], Omit<EditorObject, 'id'>> = {
    text: {
      type: 'text',
      name: 'Текст',
      x: 90,
      y: 120,
      width: 260,
      height: 72,
      text: 'НОВЫЙ ТЕКСТ',
      fontSize: 34,
      fontWeight: 800,
      color: '#111111',
      rotation: 0,
    },
    photo: {
      type: 'photo',
      name: 'Фотография',
      x: 130,
      y: 190,
      width: 260,
      height: 210,
      background: '#deded8',
      radius: 4,
      rotation: 0,
    },
    date: {
      type: 'date',
      name: 'Дата',
      x: 100,
      y: 500,
      width: 150,
      height: 34,
      text: '01 / 09 / 2026',
      fontSize: 16,
      fontWeight: 650,
      color: '#111111',
      rotation: 0,
    },
    shape: {
      type: 'shape',
      name: 'Форма',
      x: 160,
      y: 150,
      width: 120,
      height: 120,
      background: '#8b5cf6',
      radius: 999,
      rotation: 0,
    },
  }

  const objectId = `${type}-${Date.now()}`
  const defaultPhoto = type === 'photo' ? taskMaterials[selectedTask.id]?.find(item => item.kind === 'photo') : undefined
  const object = (defaultPhoto ? {
    ...presets.photo, id:objectId, name:defaultPhoto.name, imageSrc:defaultPhoto.src, assetId:defaultPhoto.id,
    materialKind:defaultPhoto.kind, fit:defaultPhoto.fit, radius:defaultPhoto.radius ?? 0,
  } : { ...presets[type], id:objectId }) as EditorObject

  objects.push(object)
  selectedId = object.id
  mobileEditorView = 'canvas'
  saveHistory()
  render()
  notify(`${object.name} добавлен`)
}

function insertMaterial(material:TaskMaterial,dropX?:number,dropY?:number) {
  const width=Math.min(material.width,580),height=Math.min(material.height,760)
  let x=dropX === undefined ? 42 : dropX-width/2
  let y=dropY === undefined ? 132 : dropY-height/2
  x=clamp(x,24,660-width-24);y=clamp(y,24,930-height-24)
  if(dropX === undefined){
    const candidates=[{x:42,y:152},{x:380,y:170},{x:48,y:545},{x:410,y:615},{x:214,y:355},{x:354,y:450}]
    const overlapScore=(cx:number,cy:number)=>objects.reduce((sum,item)=>sum+Math.max(0,Math.min(cx+width,item.x+item.width)-Math.max(cx,item.x))*Math.max(0,Math.min(cy+height,item.y+item.height)-Math.max(cy,item.y)),0)
    const place=candidates.map(point=>({x:clamp(point.x,24,660-width-24),y:clamp(point.y,24,930-height-24)})).sort((a,b)=>overlapScore(a.x,a.y)-overlapScore(b.x,b.y))[0]
    x=place.x;y=place.y
  }
  const object:EditorObject={id:`material-${material.id}-${Date.now()}`,type:'photo',name:material.name,x,y,width,height,rotation:0,opacity:1,background:material.kind==='photo'?'#e6e2da':'transparent',radius:material.radius??0,imageSrc:material.src,fit:material.fit,imagePosition:'center',assetId:material.id,materialKind:material.kind}
  objects.push(object);selectedId=object.id;mobileEditorView='canvas';saveHistory();render();notify(`${material.name} добавлен на макет`)
}

function addBriefCopy(index:number) {
  const copy=projects[selectedTask.id]?.requiredCopy[index]
  if(!copy)return
  const long=copy.length>36
  const object:EditorObject={id:`copy-${selectedTask.id}-${Date.now()}`,type:'text',name:copy.slice(0,42),text:copy,x:48,y:180,width:long?440:310,height:long?64:40,rotation:0,fontSize:long?20:24,fontWeight:copy===projects[selectedTask.id].headline?850:650,fontFamily:'Manrope',color:selectedTask.id==='balance'?'#f4f0e9':'#222126',lineHeight:1.12,letterSpacing:0,textAlign:'left'}
  objects.push(object);selectedId=object.id;mobileEditorView='canvas';saveHistory();render();notify('Строка из брифа добавлена')
}

function applyPaletteColor(color:string) {
  if(!/^#[0-9a-f]{6}$/i.test(color))return
  const object=selectedObject()
  if(paletteTarget==='background'){
    posterBackground=color
    const poster=app.querySelector<HTMLElement>('[data-poster]')
    poster?.style.setProperty('--poster-bg',color)
    const control=app.querySelector<HTMLInputElement>('[data-poster-bg]')
    if(control)control.value=color
  }else if(paletteTarget==='text'){
    if(!object||(object.type!=='text'&&object.type!=='date')){notify('Сначала выберите текстовый слой');return}
    object.color=color
    const text=app.querySelector<HTMLElement>(`[data-object="${object.id}"] .object-text`)
    if(text)text.style.color=color
    const control=app.querySelector<HTMLInputElement>('[data-prop="color"]')
    if(control)control.value=color
  }else{
    if(!object||(object.type!=='shape'&&object.type!=='photo')){notify('Сначала выберите фигуру или изображение');return}
    object.background=color
    const graphic=app.querySelector<HTMLElement>(`[data-object="${object.id}"] .photo-placeholder, [data-object="${object.id}"] .shape-content`)
    if(graphic)graphic.style.background=color
    const control=app.querySelector<HTMLInputElement>('[data-prop="background"]')
    if(control)control.value=color
  }
  saveHistory();scheduleDraftSave()
}

function notify(message: string) {
  const existing = document.querySelector('.toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.setAttribute('role', 'status')
  toast.setAttribute('aria-live', 'polite')
  toast.setAttribute('aria-atomic', 'true')
  const dot = document.createElement('span')
  dot.className = 'toast-dot'
  dot.setAttribute('aria-hidden', 'true')
  const label = document.createElement('span')
  label.textContent = message
  toast.replaceChildren(dot, label)
  document.body.appendChild(toast)

  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.classList.add('toast-hide')
    window.setTimeout(() => toast.remove(), 250)
  }, 1800)
}

function goHome() {
  if (screen === 'editor') saveDraft()
  screen = 'home'
  selectedId = null
  render()
}

function openTask(task: Task) {
  selectedTask = task
  mobileEditorView = 'canvas'
  briefOpen = safeStorageGet(briefDismissedKey(task.id)) !== 'closed'
  screen = 'editor'
  posterBackground = TASK_BACKGROUNDS[task.id] ?? '#f2f0e9'
  objects = starterFor(task.id, makeInitialObjects())
  loadDraft()
  selectedId = null
  showGrid = task.id === 'grid'
  paletteTarget = 'background'
  viewScale = 0
  autoFit = true
  handTool = false
  history = []
  historyIndex = -1
  saveHistory()
  render()
}

function render() {
  disposeHero?.(); disposeHero = undefined
  document.body.classList.toggle('editor-open', screen === 'editor')
  const generation = ++heroGeneration
  workspaceObserver?.disconnect()
  const views: Record<Exclude<Screen, 'editor'>, () => string> = {
    home: renderHome,
    courses: renderCourses,
    tasks: renderTasks,
    assistant: renderAssistant,
    progress: renderProgress,
    profile: renderProfile,
  }
  app.innerHTML = screen === 'editor' ? renderEditor() : views[screen]()
  const main = app.querySelector('main')
  if (main) main.id = 'main-content'
  bindEvents()
  const heroHost = app.querySelector<HTMLElement>('[data-hero-scene]')
  if (heroHost) void import('./hero3d').then(({mountHeroScene}) => {
    if (generation === heroGeneration && heroHost.isConnected) disposeHero = mountHeroScene(heroHost)
  }).catch(() => { /* Static fallback remains visible. */ })
  if (screen === 'editor') fitTextBoxes()
  requestAnimationFrame(() => {
    app.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
  })
}

function renderNav(active: Exclude<Screen, 'editor'>) {
  const items: Array<[Exclude<Screen, 'editor'>, string, string, keyof typeof UI_ICON_SVGS]> = [
    ['home', 'Главная', 'Главная', 'home'],
    ['courses', 'Курсы', 'Курсы', 'courses'],
    ['tasks', 'Задания', 'Задания', 'tasks'],
    ['assistant', 'ИИ-помощник', 'ИИ', 'assistant'],
    ['progress', 'Прогресс', 'Прогресс', 'progress'],
  ]
  return `<nav class="main-nav" aria-label="Основная навигация">${items.map(([id, label, shortLabel, icon]) => `<button class="nav-item ${active === id ? 'active' : ''}" data-screen="${id}" aria-label="${label}" ${active === id ? 'aria-current="page"' : ''}><span class="nav-icon" aria-hidden="true">${uiIcon(icon)}</span><span class="nav-label">${label}</span><span class="nav-short" aria-hidden="true">${shortLabel}</span></button>`).join('')}<button class="nav-item nav-chat-trigger" type="button" data-open-ai-chat aria-label="Открыть чат с ИИ"><span class="nav-icon" aria-hidden="true">${uiIcon('sparkles')}</span><span class="nav-label">Чат с ИИ</span><span class="nav-short" aria-hidden="true">Чат</span></button></nav>`
}

function renderPageHeader(kicker: string, title: string, description: string, active: Exclude<Screen, 'editor'>) {
  return `
    <header class="topbar">
      <button class="brand" data-screen="home" aria-label="На главную">
        <span class="brand-logo" aria-hidden="true"><img src="${LOGO_SIGN_SRC}" alt="" width="38" height="38"></span><span class="brand-wordmark">Точка сборки</span>
      </button>
      ${renderNav(active)}
      <div class="topbar-right"><button class="subscription-button" data-action="subscription"><span>PRO</span> Подписка</button><button class="theme-toggle" data-action="theme" aria-label="Включить ${theme === 'light' ? 'тёмную' : 'светлую'} тему"><span class="theme-icon" aria-hidden="true">${uiIcon(theme === 'light' ? 'sun' : 'moon')}</span><span class="theme-label">${theme === 'light' ? 'Тёмная' : 'Светлая'}</span></button><button class="avatar avatar-button" data-screen="profile" aria-label="Личный кабинет">${profile.photo ? `<img src="${profile.photo}" alt="">` : escapeHtml(profile.name.trim().slice(0,1).toLocaleUpperCase('ru') || 'К')}</button></div>
    </header>
    <div class="content-heading reveal">
      <div><div class="eyebrow"><span>${kicker}</span> ОБУЧАЮЩАЯ СРЕДА</div><h1>${title}</h1><p>${description}</p></div>
    </div>`
}

function renderHome() {
  return `
    <main class="shell home-shell">
      <header class="topbar">
        <button class="brand" data-screen="home" aria-label="На главную">
          <span class="brand-logo" aria-hidden="true"><img src="${LOGO_SIGN_SRC}" alt="" width="38" height="38"></span><span class="brand-wordmark">Точка сборки</span>
        </button>
        ${renderNav('home')}
        <div class="topbar-right"><button class="subscription-button" data-action="subscription"><span>PRO</span> Подписка</button><button class="theme-toggle" data-action="theme" aria-label="Включить ${theme === 'light' ? 'тёмную' : 'светлую'} тему"><span class="theme-icon" aria-hidden="true">${uiIcon(theme === 'light' ? 'sun' : 'moon')}</span><span class="theme-label">${theme === 'light' ? 'Тёмная' : 'Светлая'}</span></button><button class="avatar avatar-button" data-screen="profile" aria-label="Личный кабинет">${profile.photo ? `<img src="${profile.photo}" alt="">` : escapeHtml(profile.name.trim().slice(0,1).toLocaleUpperCase('ru') || 'К')}</button></div>
      </header>

      <section class="hero">
        <div class="hero-copy reveal">
          <div class="eyebrow"><span>01</span> ОБУЧЕНИЕ ЧЕРЕЗ ПРАКТИКУ</div>
          <h1>Учись видеть.<br><em class="create-word" aria-label="Создавай."><span aria-hidden="true" style="--letter:0">С</span><span aria-hidden="true" style="--letter:1">о</span><span aria-hidden="true" style="--letter:2">з</span><span aria-hidden="true" style="--letter:3">д</span><span aria-hidden="true" style="--letter:4">а</span><span aria-hidden="true" style="--letter:5">в</span><span aria-hidden="true" style="--letter:6">а</span><span aria-hidden="true" style="--letter:7">й</span><span aria-hidden="true" style="--letter:8">.</span></em></h1>
          <p>Осваивай графический дизайн в интерактивном редакторе: собирай композиции, пробуй цвет и типографику, развивай собственный визуальный язык.</p>
          <div class="hero-actions">
            <button class="primary-button" data-action="start-first">НАЧАТЬ ОБУЧЕНИЕ ${uiIcon('forward')}</button>
            <button class="ghost-button" data-action="scroll-tasks">СМОТРЕТЬ ЗАДАНИЯ</button>
          </div>
          <div class="hero-topics" aria-label="Темы обучения">
            <span>КОМПОЗИЦИЯ</span>
            <span>ЦВЕТ</span>
            <span>ТИПОГРАФИКА</span>
          </div>
        </div>

        <div class="hero-visual" data-hero-scene>
          <span class="hero-orbit hero-orbit-a" aria-hidden="true"></span>
          <span class="hero-orbit hero-orbit-b" aria-hidden="true"></span>
          <img class="hero-sculpture" src="${HERO_SCULPTURE_SRC}" alt="" aria-hidden="true">
        </div>
      </section>

      <section class="progress-strip reveal">
        <div><span class="muted-label">ТЕКУЩИЙ ПРОГРЕСС</span><strong>${tasks.filter((task) => task.score > 0).length} / ${tasks.length}</strong></div>
        <div class="progress-line"><i style="width: ${Math.round(tasks.filter((task) => task.score > 0).length / tasks.length * 100)}%"></i></div>
        <div><span class="muted-label">СРЕДНИЙ РЕЗУЛЬТАТ</span><strong>${Math.round(tasks.filter((task) => task.score > 0).reduce((sum, task) => sum + task.score, 0) / Math.max(1, tasks.filter((task) => task.score > 0).length))}</strong></div>
        <div><span class="muted-label">УРОВЕНЬ</span><strong>${tasks.filter((task) => task.score > 0).length >= 4 ? 'ПРОДВИНУТЫЙ' : tasks.filter((task) => task.score > 0).length >= 2 ? 'СРЕДНИЙ' : 'БАЗОВЫЙ'}</strong></div>
      </section>

      <section class="tasks-section" id="tasks">
        <div class="section-heading">
          <div>
            <div class="eyebrow"><span>02</span> ПУТЬ ОБУЧЕНИЯ</div>
            <h2>Выберите задачу</h2>
          </div>
          <div class="section-side">06 МОДУЛЕЙ<br>01 → 06</div>
        </div>

        <div class="feature-grid">
          ${renderFeatureCard('composition', 'Композиция', 'Научись выстраивать гармоничные макеты.', 'courses', '01')}
          ${renderFeatureCard('color', 'Цвет', 'Работа с цветом и настроением композиции.', 'courses', '02')}
          ${renderFeatureCard('typography', 'Типографика', 'Сила шрифта в визуальной иерархии.', 'courses', '03')}
          ${renderFeatureCard('ai', 'Разбор работы', 'Проверяй плакаты по учебным критериям без ИИ.', 'assistant', '04')}
          ${renderFeatureCard('interactive', 'Интерактивные задания', 'Собирай плакаты в редакторе, удобном для сенсорного экрана.', 'tasks', '05')}
          ${renderFeatureCard('progress', 'Прогресс', 'Следи за своим развитием и результатами.', 'progress', '06')}
        </div>
      </section>

      <footer class="home-footer">
        <span>ТОЧКА СБОРКИ / v0.2</span>
        <span>DESIGN EDUCATION SYSTEM</span>
        <span>2026</span>
      </footer>
    </main>
  `
}


function renderCourses() {
  return `<main class="shell inner-shell">${renderPageHeader('02', 'Учись понимать.', 'Сначала разберите принцип, затем попробуйте его на рабочем поле. Теория теперь открывается отдельным полноценным материалом.', 'courses')}
    <section class="course-intro reveal">
      <div><span class="card-kicker">6 МОДУЛЕЙ / ТЕОРИЯ</span><h2>От принципа — к решению.</h2></div>
      <p>В каждом модуле: объяснение, ключевые приёмы, мини-чеклист и переход к практике.</p>
    </section>
    <section class="content-grid theory-grid">
      ${tasks.map((task, index) => `<article class="theory-card reveal" style="--delay:${index * 55}ms">
        <div class="theory-icon icon-${task.id}"><span>${uiIcon(task.icon as keyof typeof UI_ICON_SVGS)}</span><small>${task.number}</small></div>
        <div class="theory-content"><div class="card-kicker">${task.number} / ${task.level}</div><h2>${task.title}</h2><p>${task.theory.slice(0, 2).join(" ")}</p><div class="theory-tags"><span>ПРИНЦИП</span><span>${task.time}</span></div><button class="outline-button" data-task-theory="${task.id}">ОТКРЫТЬ ТЕОРИЮ ${uiIcon('forward')}</button></div>
      </article>`).join('')}
    </section>
  </main>`
}

function renderTasks() {
  return `<main class="shell inner-shell">${renderPageHeader('03', 'Собирай на практике.', 'Выбирайте задачу, продолжайте начатое и сравнивайте свои результаты.', 'tasks')}
    <section class="task-list-page">
      <div class="task-filter-row"><div class="filter-pills" role="group" aria-label="Фильтр заданий"><button class="active" data-filter="all" aria-pressed="true">Все</button><button data-filter="Базовый" aria-pressed="false">Базовый</button><button data-filter="Средний" aria-pressed="false">Средний</button><button data-filter="Продвинутый" aria-pressed="false">Продвинутый</button></div><span class="list-counter" aria-live="polite">${tasks.length} МОДУЛЕЙ</span></div>
      <details class="curriculum-note"><summary><span>Как устроен практикум</span><small>6 проектов · задания с проверкой</small></summary><p>В каждом исходнике есть учебная проблема. Для зачёта нужны обязательные сведения, читаемость, приём задания и переработка минимум трёх элементов. Прежние макеты можно открыть в редакторе.</p>${Object.values(users[currentUserId]?.previousScores??{}).some(value=>value>0)?`<div class="previous-results"><strong>Результаты прежней версии требуют повторной проверки</strong><ul>${tasks.filter(task=>(users[currentUserId]?.previousScores?.[task.id]??0)>0).map(task=>`<li>${task.title}: ${users[currentUserId].previousScores![task.id]} / 100</li>`).join('')}</ul></div>`:''}</details><div class="task-list">${tasks.map(task => { const preview = taskMaterials[task.id]?.find(item => item.kind === 'photo') ?? taskMaterials[task.id]?.[0]; return `<article class="task-row-card reveal" data-level="${task.level}"><div class="task-row-preview">${preview ? `<img src="${escapeHtml(preview.src)}" alt="" loading="lazy" width="116" height="96">` : uiIcon(task.icon as keyof typeof UI_ICON_SVGS)}<span>${task.number}</span></div><div class="task-row-main"><div class="task-row-number">${task.number}</div><div><h2>${projects[task.id].headline}</h2><p>${task.title} · ${projects[task.id].focus}</p><div class="task-meta"><span>${task.level}</span><span>${task.time}</span></div></div></div><div class="task-result"><span>РЕЗУЛЬТАТ</span><strong>${task.score || '—'}</strong></div><button class="task-row-action" data-task="${task.id}">${task.score || hasDraft(task.id) ? 'ПРОДОЛЖИТЬ' : 'НАЧАТЬ'} ${uiIcon('forward')}</button></article>` }).join('')}</div>
    </section>
  </main>`
}

function renderAssistant() {
  const completed = tasks.filter(task => task.score > 0)
  const latest = completed[completed.length - 1]
  return `<main class="shell inner-shell">${renderPageHeader('04', 'Взгляд со стороны.', 'Обсудите идею с ИИ-наставником или получите визуальный разбор своей работы в редакторе.', 'assistant')}
    <section class="assistant-layout reveal">
      <article class="assistant-main">
        <div class="assistant-orb">${uiIcon('sparkles')}</div>
        <div class="card-kicker">ИИ-НАСТАВНИК / ПРАКТИКА ДИЗАЙНА</div>
        <h2>Понятные критерии.<br><em>Конкретный следующий шаг.</em></h2>
        <p>Нужна подсказка по цвету, шрифтам или композиции? Задайте вопрос в чате. Для разбора готового макета нажмите «Проверить» в редакторе: ИИ рассмотрит изображение и предложит конкретные правки. Зачёт определяется условиями задания и работает независимо от ИИ.</p>
        <div class="assistant-actions">
          <button class="primary-button" data-screen="tasks">ОТКРЫТЬ ЗАДАНИЯ ${uiIcon('forward')}</button>
          <button class="ghost-button" data-open-ai-chat>СПРОСИТЬ ИИ ${uiIcon('sparkles')}</button>
        </div>
      </article>
      <aside class="assistant-side">
        <div class="assistant-status"><span></span> ${latest ? `ПОСЛЕДНИЙ РЕЗУЛЬТАТ ${latest.score}/100` : '20 ВОПРОСОВ И 8 ИИ-РАЗБОРОВ В ДЕНЬ'}</div>
        <div class="assistant-item"><strong>01</strong><div><b>Найти проблему</b><small>Иерархия, баланс, ритм, интервалы и выравнивание.</small></div></div>
        <div class="assistant-item"><strong>02</strong><div><b>Объяснить принцип</b><small>Почему конкретный приём влияет на восприятие макета.</small></div></div>
        <div class="assistant-item"><strong>03</strong><div><b>Предложить следующий ход</b><small>Что изменить первым, чтобы не переделывать всё сразу.</small></div></div>
        <div class="assistant-mini-grid"><button data-task="hierarchy"><span>${uiIcon('hierarchy')}</span><b>Проверить иерархию</b></button><button data-task="balance"><span>${uiIcon('balance')}</span><b>Проверить баланс</b></button><button data-task="rhythm"><span>${uiIcon('repeat')}</span><b>Найти ритм</b></button><button data-task="grid"><span>${uiIcon('grid')}</span><b>Проверить сетку</b></button></div>
      </aside>
    </section>
    <section class="assistant-bottom reveal">
      <div><span class="card-kicker">КАК РАБОТАЕТ</span><h2>4 шага до разбора</h2></div>
      <div class="assistant-steps"><div><span>01</span><b>Собери</b><small>работу на доске</small></div><div><span>02</span><b>Проверь</b><small>основные принципы</small></div><div><span>03</span><b>Разбери</b><small>сильные и слабые места</small></div><div><span>04</span><b>Исправь</b><small>один главный конфликт</small></div></div>
    </section>
  </main>`
}

function renderProgress() {
  const completed = tasks.filter(t => t.score > 0).length
  const average = Math.round(tasks.filter(t => t.score > 0).reduce((sum, t) => sum + t.score, 0) / Math.max(1, completed))
  return `<main class="shell inner-shell">${renderPageHeader('05', 'Прогресс.', 'Следите за тем, какие принципы уже освоены и где ещё можно усилить навык.', 'progress')}
    <section class="progress-dashboard reveal"><article class="progress-card profile-progress"><div class="progress-avatar">${profile.photo ? `<img src="${profile.photo}" alt="">` : escapeHtml(profile.name.trim().slice(0,1).toLocaleUpperCase('ru') || 'К')}</div><div><span class="card-kicker">ОБУЧАЮЩИЙСЯ</span><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.role)}</p></div><div class="progress-big">${Math.round(completed / tasks.length * 100)}<small>%</small></div></article><article class="progress-card average-progress"><span class="card-kicker">СРЕДНИЙ РЕЗУЛЬТАТ</span><strong>${average}</strong><div class="big-progress-line"><i style="width:${average}%"></i></div><p>${completed} из ${tasks.length} модулей имеют результат.</p></article></section>
    <section class="skills-grid reveal">${tasks.map(task => `<article class="skill-card"><div class="skill-icon accent-${task.accent}">${uiIcon(task.icon as keyof typeof UI_ICON_SVGS)}</div><div><b>${task.title}</b><span>${task.score ? `${task.score} / 100` : 'Ещё не начато'}</span></div><div class="skill-bar"><i style="width:${task.score || 0}%"></i></div></article>`).join('')}</section>
  </main>`
}

function renderProfile() {
  return `<main class="shell inner-shell profile-shell">${renderPageHeader('06', 'Личный кабинет.', 'Ваш профиль, фотография и личные настройки обучения.', 'profile')}
    <section class="profile-layout reveal">
      <article class="profile-hero-card">
        <div class="profile-photo-wrap">
          <div class="profile-photo" data-profile-photo>${profile.photo ? `<img src="${profile.photo}" alt="Фото профиля">` : `<span>${escapeHtml(profile.name.trim().slice(0,1).toLocaleUpperCase('ru') || 'К')}</span>`}</div>
          <label class="profile-upload"><input type="file" data-profile-file accept="image/png,image/jpeg,image/webp"><span>ЗАГРУЗИТЬ ФОТО</span></label>
        </div>
        <div class="profile-main">
          <div class="card-kicker">ОБУЧАЮЩИЙСЯ / ПРОФИЛЬ</div>
          <label class="profile-field"><span>ИМЯ</span><input type="text" data-profile-name maxlength="48" autocomplete="name" value="${escapeHtml(profile.name)}"></label>
          <label class="profile-field"><span>ОПИСАНИЕ</span><input type="text" data-profile-role maxlength="80" value="${escapeHtml(profile.role)}"></label>
          <button class="primary-button" data-action="save-profile">СОХРАНИТЬ ПРОФИЛЬ ${uiIcon('forward')}</button>
        </div>
      </article>
      <aside class="profile-settings">
        <div class="card-kicker">НАСТРОЙКИ</div>
        <h2>Светлая тема</h2>
        <p>Интерфейс переключается между светлой и тёмной темой. Выбранное состояние сохраняется.</p>
        <button class="theme-preview-button" data-action="theme"><span class="theme-preview-icon">${uiIcon(theme === 'light' ? 'sun' : 'moon')}</span><strong>${theme === 'light' ? 'Сейчас включена светлая' : 'Сейчас включена тёмная'}</strong><span class="theme-preview-change">СМЕНИТЬ ${uiIcon('forward')}</span></button>
        <div class="subscription-card ${subscriptionActive ? 'active' : ''}">
          <div><div class="card-kicker">ДОСТУП</div><h3>${subscriptionActive ? 'PRO активна' : 'Базовый доступ'}</h3><p>Все задания, редактор, сохранение плакатов и проверка по критериям доступны бесплатно. PRO пока демонстрационный режим.</p></div>
          <button class="outline-button" data-action="subscription">${subscriptionActive ? 'УПРАВЛЕНИЕ' : 'ПОДКЛЮЧИТЬ PRO'} <span>${uiIcon('forward')}</span></button>
        </div>
        <div class="profile-account-row"><div><span>ID АККАУНТА</span><code>${currentUserId}</code></div><button class="outline-button" data-action="new-user">НОВЫЙ ПОЛЬЗОВАТЕЛЬ <span>${uiIcon('add')}</span></button></div>
        <div class="profile-stat-grid">
          <div><span>МОДУЛИ</span><strong>${tasks.length}</strong></div>
          <div><span>РЕЗУЛЬТАТЫ</span><strong>${tasks.filter(t => t.score > 0).length}</strong></div>
          <div><span>УРОВЕНЬ</span><strong>${tasks.filter(t => t.score > 0).length >= 4 ? 'ПРО' : tasks.filter(t => t.score > 0).length >= 2 ? 'СРЕДНИЙ' : 'БАЗОВЫЙ'}</strong></div>
        </div>
      </aside>
    </section>
  </main>`
}

function renderFeatureCard(imageKey: keyof typeof FEATURE_IMAGES, title: string, description: string, target: Exclude<Screen, 'editor'>, number: string) {
  return `
    <article class="feature-card reveal">
      <button class="feature-card-link" data-screen="${target}" aria-label="Открыть ${title}">
        <div class="feature-card-visual">
          <img src="${FEATURE_IMAGES[imageKey]}" alt="" loading="lazy">
          <span class="feature-number">${number}</span>
        </div>
        <div class="feature-card-copy">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <span class="feature-arrow">${uiIcon('forward')}</span>
      </button>
    </article>
  `
}

function renderMaterialLibrary() {
  const items = taskMaterials[selectedTask.id] ?? []
  const project = projects[selectedTask.id]
  return `
    <section class="material-library" aria-label="Материалы задания">
      <div class="library-heading"><span>МАТЕРИАЛЫ</span><small>${String(items.length).padStart(2,'0')}</small></div>
      <div class="material-filters" role="group" aria-label="Тип материала">
        <button class="active" data-material-filter="all" aria-pressed="true">Все</button><button data-material-filter="photo" aria-pressed="false">Фото</button><button data-material-filter="graphic" aria-pressed="false">Графика</button><button data-material-filter="logo" aria-pressed="false">Знаки</button>
      </div>
      <div class="material-grid" data-material-grid>
        ${items.map(item => `<button type="button" class="material-card" draggable="true" data-material-id="${escapeHtml(item.id)}" data-material-kind="${item.kind}" title="Добавить: ${escapeHtml(item.name)}">
          <span class="material-preview ${item.kind === 'logo' ? 'is-logo' : ''}"><img src="${escapeHtml(item.src)}" alt="" loading="lazy" style="object-fit:${item.fit}"></span>
          <span class="material-name">${escapeHtml(item.name)}</span><small>${item.kind === 'photo' ? 'ФОТО' : item.kind === 'logo' ? 'ЗНАК' : 'ГРАФИКА'}</small>
        </button>`).join('')}
      </div>
      ${project.palette ? `<div class="project-palette"><div class="library-heading"><span>ПАЛИТРА</span><small>до 4 цветов</small></div>
        <div class="palette-targets"><button class="active" data-palette-target="background">Фон</button><button data-palette-target="text">Текст</button><button data-palette-target="fill">Фигура</button></div>
        <div class="palette-swatches">${project.palette.map(color => `<button type="button" class="palette-swatch" data-palette-color="${color}" style="--swatch:${color}" aria-label="Цвет ${color}" title="${color}"></button>`).join('')}</div>
      </div>` : ''}
      <details class="copy-library"><summary>Текст из брифа <span>${project.requiredCopy.length}</span></summary><div class="copy-snippets">${project.requiredCopy.map((copy,index) => `<button type="button" data-add-copy="${index}"><span>${escapeHtml(copy)}</span><i>＋</i></button>`).join('')}</div></details>
    </section>
  `
}

function renderEditor() {
  const object = selectedObject()
  const project = projects[selectedTask.id]
  const selectedIndex = objects.findIndex(item => item.id === selectedId)
  return `
    <main class="shell editor-shell" data-mobile-view="${mobileEditorView}">
      <header class="editor-topbar">
        <div class="editor-brand">
          <img class="editor-wordmark" src="${LOGO_SIGN_SRC}" alt="Точка сборки">
          <button class="icon-button back-button" data-action="home" aria-label="Назад">${uiIcon('back')}</button>
          <div>
            <div class="brand-title">ТОЧКА СБОРКИ</div>
            <div class="editor-breadcrumb">ЗАДАНИЕ ${selectedTask.number} / ${selectedTask.title.toUpperCase()}</div>
          </div>
        </div>
        <div class="editor-top-actions">
          <div class="task-progress-mini" aria-label="Выполнено заданий"><strong>${String(tasks.filter(task => task.score > 0).length).padStart(2,'0')} / ${String(tasks.length).padStart(2,'0')}</strong></div>
          <button class="secondary-button" data-action="export" aria-label="Скачать постер в PNG">PNG ${uiIcon('forward')}</button>
          <button class="primary-button" data-action="check">Проверить ${uiIcon('forward')}</button>
        </div>
      </header>

      <nav class="mobile-editor-tabs" aria-label="Панели редактора" role="tablist">
        <button type="button" role="tab" data-mobile-view="canvas" aria-selected="${mobileEditorView === 'canvas'}">Холст</button>
        <button type="button" role="tab" data-mobile-view="add" aria-selected="${mobileEditorView === 'add'}">Добавить</button>
        <button type="button" role="tab" data-mobile-view="properties" aria-selected="${mobileEditorView === 'properties'}">Свойства</button>
        <button type="button" role="tab" data-mobile-view="layers" aria-selected="${mobileEditorView === 'layers'}">Слои <span>${objects.length}</span></button>
        <button type="button" class="mobile-editor-chat" data-open-ai-chat aria-label="Открыть чат с ИИ">${uiIcon('sparkles')}<span>ИИ</span></button>
      </nav>

      <div class="editor-layout">
        <aside class="left-panel panel">
          <div class="panel-label">ДОБАВИТЬ</div>
          <div class="element-buttons">
            <button data-add="text"><span class="element-icon">${uiIcon('text')}</span>Текст</button>
            <button data-add="photo"><span class="element-icon">${uiIcon('photo')}</span>Фото</button>
            <button data-add="date"><span class="element-icon">${uiIcon('date')}</span>Дата</button>
            <button data-add="shape"><span class="element-icon">${uiIcon('shape')}</span>Форма</button>
          </div>
          <details class="materials-drawer" open><summary>Материалы задания <span>${taskMaterials[selectedTask.id]?.length ?? 0}</span></summary>${renderMaterialLibrary()}</details>

          <div class="panel-divider"></div>
          <div class="panel-label">ИНСТРУМЕНТЫ</div>
          <div class="tool-buttons">
            <button class="${showGrid ? 'active' : ''}" data-action="grid" title="Сетка"><span>${uiIcon('grid')}</span>Сетка</button>
            <button data-action="center" aria-label="Центрировать объект" title="Центрировать" ${selectedIndex < 0 ? 'disabled' : ''}><span>${uiIcon('center')}</span>Центр</button>
            <button data-action="duplicate" title="Дублировать" ${selectedIndex < 0 ? 'disabled' : ''}><span>${uiIcon('duplicate')}</span>Копия</button>
            <button data-action="delete" title="Удалить" ${selectedIndex < 0 ? 'disabled' : ''}><span>${uiIcon('delete')}</span>Удалить</button>
          </div>

          <div class="panel-divider"></div>
          <div class="tool-section-row">
            <div class="panel-label">ШАГИ</div>
            <div class="history-buttons">
              <button data-action="undo" aria-label="Отменить" title="Отменить · Ctrl+Z" ${historyIndex <= 0 ? 'disabled' : ''}>↶</button>
              <button data-action="redo" aria-label="Повторить" title="Повторить · Ctrl+Shift+Z" ${historyIndex >= history.length - 1 ? 'disabled' : ''}>↷</button>
            </div>
          </div>
          <details class="shortcut-guide"><summary>Сочетания клавиш</summary><dl><dt>Ctrl / ⌘ Z</dt><dd>Отменить</dd><dt>Ctrl Shift Z / Ctrl Y</dt><dd>Повторить</dd><dt>Ctrl C / X / V</dt><dd>Копировать / вырезать / вставить слой</dd><dt>Ctrl D / J</dt><dd>Дублировать</dd><dt>Ctrl S / E</dt><dd>Сохранить / PNG</dd><dt>Ctrl [ / ]</dt><dd>Порядок слоёв · Shift: до края</dd><dt>V / H · Пробел</dt><dd>Выбор / рука · временная рука</dd><dt>T / R</dt><dd>Текст / форма</dd><dt>Стрелки · Shift</dt><dd>Сдвиг на 1 / 10 px</dd><dt>Ctrl + / − / 0 / 1</dt><dd>Масштаб / вписать / 100%</dd><dt>Shift при повороте</dt><dd>Шаг 15°</dd><dt>Shift при размере</dt><dd>Сохранить пропорции</dd></dl></details>
          ${safeStorageGet(legacyDraftKey()) ? '<button class="reset-task-button" data-action="restore-legacy">Открыть прежнюю работу</button>' : ''}
          <button class="reset-task-button" data-action="reset-task">Новый исходный макет</button>
        </aside>

        <section class="workspace">
          <div class="workspace-toolbar">
            <div class="workspace-heading">
              <div>
                <span class="workspace-title">МАКЕТ</span>
                <span class="workspace-subtitle">ПЛАКАТ · ${selectedTask.title.toUpperCase()}</span>
              </div>
              <button class="brief-toggle" data-action="toggle-brief" aria-controls="task-brief-panel" aria-expanded="${briefOpen}">
                ${uiIcon('document')}<span>Задание</span>
              </button>
            </div>
            <label class="poster-background-control">ФОН <input type="color" data-poster-bg value="${posterBackground}" aria-label="Цвет фона плаката"></label>
            <div class="viewport-tools" aria-label="Управление рабочей областью">
              <button data-action="hand" aria-label="Перемещение рабочей области" aria-pressed="${handTool}" title="Рука · или удерживайте пробел">✥</button>
              <button data-action="zoom-out" aria-label="Уменьшить масштаб">−</button>
              <output data-zoom-label aria-live="polite" aria-label="Масштаб рабочей области">100%</output>
              <button data-action="zoom-in" aria-label="Увеличить масштаб">+</button>
              <button data-action="fit" title="Показать плакат целиком">Вписать</button>
            </div>
          </div>

          <aside class="task-brief ${briefOpen ? '' : 'is-collapsed'}" id="task-brief-panel" data-brief-panel aria-label="Задание" tabindex="-1">
            <button class="brief-close" data-action="toggle-brief" aria-label="Свернуть задание" title="Свернуть">${uiIcon('close')}</button>
            <div class="task-brief-kicker">${project.client}</div>
            <h2>${project.deliverable}</h2>
            <p>${escapeHtml(project.objective)}</p>
            <div class="brief-facts">
              <div><span>Аудитория</span><b>${project.audience}</b></div>
              <div><span>Ключевой фокус</span><b>${escapeHtml(project.focus)}</b></div>
              <div><span>Обязательный текст</span><b>${project.requiredCopy.map(escapeHtml).join(' · ')}</b></div>
              <div><span>Ограничения</span><b>${project.constraints.map(escapeHtml).join(' · ')}</b></div>
            </div>
            <section class="exercise-challenge"><h3>Ваша задача</h3><p>${escapeHtml(exerciseSpecs[selectedTask.id].problem)}</p><h3>Условия зачёта</h3><ul>${exerciseSpecs[selectedTask.id].acceptance.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><details><summary>Два возможных направления</summary><ul>${exerciseSpecs[selectedTask.id].directions.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></details></section>
            <details class="brief-guidance"><summary>Что сделать самостоятельно</summary><ol>${project.guidance.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p>Автопроверка оценивает формальные признаки. Художественный выбор остаётся за вами; удачных решений может быть несколько.</p></details>
          </aside>

          <div class="canvas-stage" data-stage tabindex="0" aria-label="Рабочая область. Пробел и перетаскивание для перемещения, Ctrl и колесо для масштаба.">
            <div class="poster ${showGrid ? 'show-grid' : ''}" data-poster style="--poster-bg:${posterBackground}">
              ${objects.map(renderObject).join('')}
            </div>
          </div>

          <div class="workspace-bottom">
            <span class="save-status" data-save-status data-state="${draftSaveStatus}" role="status" aria-live="polite"><i class="live-dot"></i><span data-save-label>${draftSaveStatus === 'saving' ? 'СОХРАНЯЕМ…' : draftSaveStatus === 'error' ? 'НЕ СОХРАНЕНО' : 'СОХРАНЕНО'}</span></span>
            <span>660 × 930</span>
          </div>
        </section>

        <aside class="right-panel panel ${object ? 'has-selection' : 'is-empty'}">
          <section class="inspector-dock"><div class="panel-label">СВОЙСТВА</div>
          <div data-properties-host="true">${object ? renderProperties(object) : renderEmptyProperties()}</div>

          <div class="panel-divider"></div>
          </section><section class="layers-dock"><div class="panel-label layer-heading">СЛОИ <span class="layer-count">${String(objects.length).padStart(2, '0')}</span></div>
          <div class="layers" data-layers role="listbox" aria-label="Слои макета">
            ${[...objects].reverse().map((item) => `
              <div class="layer-row ${item.id === selectedId ? 'selected' : ''}" data-layer-id="${escapeHtml(item.id)}" data-select="${escapeHtml(item.id)}" role="option" aria-selected="${item.id === selectedId}" tabindex="0">
                <button class="layer-grip" type="button" draggable="true" data-layer-grip="${escapeHtml(item.id)}" aria-label="Перетащить слой: ${escapeHtml(item.name)}" title="Перетащить слой">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5" cy="4" r="1.1"/><circle cx="11" cy="4" r="1.1"/><circle cx="5" cy="8" r="1.1"/><circle cx="11" cy="8" r="1.1"/><circle cx="5" cy="12" r="1.1"/><circle cx="11" cy="12" r="1.1"/></svg>
                </button>
                <span class="layer-thumbnail" aria-hidden="true">${item.type === 'photo' && item.imageSrc ? '<img src="'+escapeHtml(item.imageSrc)+'" alt="">' : item.type === 'shape' ? '<i style="background:'+item.background+';border-radius:'+Math.min(item.radius??0,12)+'px"></i>' : 'T'}</span>
                <span class="layer-name">${escapeHtml(item.name)}</span>
                <span class="layer-type">${item.type === 'photo' ? 'Фото' : item.type === 'shape' ? 'Форма' : 'Текст'}</span>
              </div>
            `).join('')}
          </div>

          </section><div class="ai-preview">
            <div class="ai-head"><span>ОБРАТНАЯ СВЯЗЬ</span><span class="ai-spark">${uiIcon('sparkles')}</span></div>
            <p>Критерии и разбор появятся после проверки.</p>
          </div>
        </aside>
      </div>
    </main>
  `
}

function renderObject(object: EditorObject) {
  const selected = object.id === selectedId
  const style = `left:${object.x}px;top:${object.y}px;width:${object.width}px;height:${object.height}px;transform:rotate(${object.rotation ?? 0}deg);`
  let content = ''

  if (object.type === 'text' || object.type === 'date') {
    content = `<div class="object-text" style="font-size:${object.fontSize}px;font-weight:${object.fontWeight};font-family:${escapeHtml(object.fontFamily ?? 'Manrope')};color:${object.color};--object-line-height:${object.lineHeight ?? 1};--object-letter-spacing:${object.letterSpacing ?? 0}px;--object-align:${object.textAlign ?? 'left'}">${escapeHtml(object.text ?? '').replace(/\n/g, '<br>')}</div>`
  } else if (object.type === 'photo') {
    const positions = {center:'50% 50%',top:'50% 0%',bottom:'50% 100%',left:'0% 50%',right:'100% 50%'}
    content = `<div class="photo-placeholder ${object.imageSrc ? 'has-image' : 'is-empty'}" style="background:${object.materialKind === 'graphic' || object.materialKind === 'logo' ? 'transparent' : object.background ?? '#d9d9d3'};border-radius:${object.radius ?? 0}px">${object.imageSrc ? `<img src="${escapeHtml(object.imageSrc)}" alt="${escapeHtml(object.name)}" draggable="false" style="object-fit:${object.fit ?? 'cover'};object-position:${positions[object.imagePosition ?? 'center']}">` : '<span>ДОБАВЬТЕ МАТЕРИАЛ</span><small>Выберите исходник слева</small>'}</div>`
  } else {
    content = `<div class="shape-content" style="background:${object.background ?? '#8b5cf6'};border-radius:${object.radius ?? 999}px"></div>`
  }

  return `
    <div class="editor-object type-${object.type} ${selected ? 'selected' : ''}" data-object="${escapeHtml(object.id)}" role="button" tabindex="0" aria-pressed="${selected}" aria-label="${escapeHtml(`${object.name}, ${object.type === 'text' || object.type === 'date' ? 'текст' : object.type === 'photo' ? 'изображение' : 'форма'}`)}" style="${style}opacity:${object.opacity ?? 1}">
      ${content}
      ${selected ? renderHandles() : ''}
    </div>
  `
}

function renderHandles() {
  return `
    <span class="resize-handle nw" data-resize="nw"></span>
    <span class="resize-handle n" data-resize="n"></span>
    <span class="resize-handle ne" data-resize="ne"></span>
    <span class="resize-handle e" data-resize="e"></span>
    <span class="resize-handle se" data-resize="se"></span>
    <span class="resize-handle s" data-resize="s"></span>
    <span class="resize-handle sw" data-resize="sw"></span>
    <span class="resize-handle w" data-resize="w"></span><span class="resize-handle rotate" data-resize="rotate" title="Поворот · Shift: шаг 15°"></span>
  `
}

function renderProperties(object: EditorObject) {
  const common = `
    <div class="field-grid">
      <label class="field"><span>X</span><input type="number" data-prop="x" value="${Math.round(object.x)}"></label>
      <label class="field"><span>Y</span><input type="number" data-prop="y" value="${Math.round(object.y)}"></label>
    </div>
    <div class="field-grid">
      <label class="field"><span>ШИРИНА</span><input type="number" data-prop="width" value="${Math.round(object.width)}"></label>
      <label class="field"><span>ВЫСОТА</span><input type="number" data-prop="height" value="${Math.round(object.height)}"></label>
    </div>
    <label class="field"><span>ПОВОРОТ</span><input type="number" data-prop="rotation" value="${Math.round(object.rotation)}"></label>
  `

  if (object.type === 'text' || object.type === 'date') {
    return `
      <div class="property-title"><span class="selected-dot"></span>${escapeHtml(object.name)}</div>
      <label class="field">
        <span>ТЕКСТ</span>
        <textarea data-prop="text" rows="3">${escapeHtml(object.text ?? '')}</textarea>
      </label>
      <div class="field-grid">
        <label class="field"><span>РАЗМЕР</span><input type="number" data-prop="fontSize" min="8" max="180" value="${object.fontSize ?? 24}"></label>
        <label class="field"><span>НАСЫЩЕННОСТЬ</span><input type="number" data-prop="fontWeight" min="100" max="900" step="100" value="${object.fontWeight ?? 700}"></label>
      </div>
      <div class="field-grid">
        <label class="field"><span>ШРИФТ</span><select data-prop="fontFamily">
          ${['Manrope','Inter','Arial','Georgia','Courier New'].map(font => `<option value="${font}" ${object.fontFamily === font ? 'selected' : ''}>${font}</option>`).join('')}
        </select></label>
        <label class="field"><span>ЦВЕТ</span><input class="color-input" type="color" data-prop="color" value="${object.color ?? '#111111'}"></label>
      </div>
      <div class="field-grid">
        <label class="field"><span>ИНТЕРЛИНЬЯЖ</span><input type="number" data-prop="lineHeight" min="0.7" max="2.5" step="0.05" value="${object.lineHeight ?? 1}"></label>
        <label class="field"><span>ТРЕКИНГ</span><input type="number" data-prop="letterSpacing" min="-10" max="30" step="0.5" value="${object.letterSpacing ?? 0}"></label>
      </div>
      <label class="field"><span>ВЫРАВНИВАНИЕ</span><select data-prop="textAlign">${(['left','center','right'] as const).map(align => `<option value="${align}" ${object.textAlign === align ? 'selected' : ''}>${align === 'left' ? 'По левому краю' : align === 'center' ? 'По центру' : 'По правому краю'}</option>`).join('')}</select></label>
      ${common}
    `
  }

  if (object.type === 'shape') {
    return `
      <div class="property-title"><span class="selected-dot"></span>${escapeHtml(object.name)}</div>
      <div class="field-grid">
        <label class="field"><span>ЗАЛИВКА</span><input class="color-input" type="color" data-prop="background" value="${object.background ?? '#8b5cf6'}"></label>
        <label class="field"><span>СКРУГЛЕНИЕ</span><input type="number" data-prop="radius" min="0" max="999" value="${object.radius ?? 0}"></label>
      </div>
      ${common}
    `
  }

  return `
    <div class="property-title"><span class="selected-dot"></span>${escapeHtml(object.name)}</div>
    <div class="asset-property-note">${object.materialKind === 'logo' ? 'Векторный знак' : object.materialKind === 'graphic' ? 'Прозрачная графика' : object.assetId ? 'Исходник задания' : 'Своё изображение'}</div>
    <label class="field photo-upload"><span>ЗАМЕНИТЬ ИЗОБРАЖЕНИЕ</span><input class="visually-hidden" type="file" data-photo-file accept="image/png,image/jpeg,image/webp"><span class="upload-button">＋ Выбрать файл</span><small>PNG, JPG или WebP до 10 МБ · файл сжимается для сохранения</small></label>
    <div class="field-grid">
      <label class="field"><span>СКРУГЛЕНИЕ</span><input type="number" data-prop="radius" min="0" max="999" value="${object.radius ?? 0}"></label>
      <label class="field"><span>ПРОЗРАЧНОСТЬ</span><input type="number" data-prop="opacity" min="10" max="100" value="${Math.round((object.opacity ?? 1) * 100)}"></label>
    </div>
    <div class="field-grid">
      <label class="field"><span>ВПИСЫВАНИЕ</span><select data-prop="fit"><option value="cover" ${(object.fit ?? 'cover') === 'cover' ? 'selected' : ''}>Заполнить рамку</option><option value="contain" ${object.fit === 'contain' ? 'selected' : ''}>Показать целиком</option></select></label>
      <label class="field"><span>КАДРИРОВАНИЕ</span><select data-prop="imagePosition">${(['center','top','bottom','left','right'] as const).map(position => `<option value="${position}" ${(object.imagePosition ?? 'center') === position ? 'selected' : ''}>${position === 'center' ? 'Центр' : position === 'top' ? 'Верх' : position === 'bottom' ? 'Низ' : position === 'left' ? 'Слева' : 'Справа'}</option>`).join('')}</select></label>
    </div>
    ${common}
  `
}

function renderEmptyProperties() {
  return `
    <div class="empty-properties">
      <div class="empty-icon">${uiIcon('add')}</div>
      <strong>ЭЛЕМЕНТ НЕ ВЫБРАН</strong>
      <p>Выберите объект на рабочем поле, чтобы изменить его свойства.</p>
    </div>
  `
}

function bindResizeHandle(handle: HTMLElement) {
  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    event.stopPropagation()
    const parent = handle.closest<HTMLElement>('[data-object]')
    const object = objects.find((item) => item.id === parent?.dataset.object)
    if (!object || !parent) return
    selectObject(object.id)
    if (handle.dataset.resize === 'rotate') bindRotation(event, object, parent)
    else bindResize(event, object, handle.dataset.resize ?? 'se', parent)
    updatePropertyInputs()
  })
}

function fitTextBoxes() {
  let changed = false
  app.querySelectorAll<HTMLElement>('[data-object]').forEach(element => {
    const text = element.querySelector<HTMLElement>('.object-text')
    const object = objects.find(item => item.id === element.dataset.object)
    if (!text || !object) return
    const height = Math.ceil(text.scrollHeight)
    if (height > object.height + 1) {
      object.height = height
      element.style.height = height + 'px'
      changed = true
    }
  })
  if (changed) { saveDraft(); updatePropertyInputs() }
}
app.addEventListener('input', () => { if (screen === 'editor') fitTextBoxes() })
document.fonts.ready.then(() => { if (screen === 'editor') fitTextBoxes() })

function updateWorkspace() {
  const poster = app.querySelector<HTMLElement>('[data-poster]')
  if (poster) poster.style.setProperty('--inverse-zoom', String(1 / (viewScale || 1)))
  if (poster) poster.style.setProperty('transform', 'translate(' + viewX + 'px,' + viewY + 'px) scale(' + viewScale + ')', 'important')
  const label = app.querySelector('[data-zoom-label]')
  if (label) label.textContent = Math.round(viewScale * 100) + '%'
  app.querySelector('[data-stage]')?.classList.toggle('hand-active', handTool || spaceHeld)
  app.querySelector('[data-action="hand"]')?.setAttribute('aria-pressed', String(handTool))
}

function toggleTaskBrief() {
  briefOpen = !briefOpen
  if (!briefOpen) safeStorageSet(briefDismissedKey(), 'closed')
  app.querySelector<HTMLElement>('[data-brief-panel]')?.classList.toggle('is-collapsed', !briefOpen)
  app.querySelector<HTMLButtonElement>('.brief-toggle')?.setAttribute('aria-expanded', String(briefOpen))
  if (briefOpen) app.querySelector<HTMLElement>('[data-brief-panel]')?.focus()
}

function reorderLayers(fromId: string, targetId: string, afterTarget: boolean) {
  if (fromId === targetId) return
  const visualOrder = [...objects].reverse()
  const fromIndex = visualOrder.findIndex(item => item.id === fromId)
  if (fromIndex < 0 || !visualOrder.some(item => item.id === targetId)) return
  const [moved] = visualOrder.splice(fromIndex, 1)
  const targetIndex = visualOrder.findIndex(item => item.id === targetId)
  visualOrder.splice(targetIndex + (afterTarget ? 1 : 0), 0, moved)
  objects = visualOrder.reverse()
  selectedId = fromId
  saveHistory()
  render()
}

function bindLayerSorting() {
  const list = app.querySelector<HTMLElement>('[data-layers]')
  if (!list) return
  let nativeDragSourceId: string | null = null

  const clearNativeDrag = () => {
    nativeDragSourceId = null
    list.querySelectorAll('.is-dragging,.drop-before,.drop-after').forEach(row => row.classList.remove('is-dragging', 'drop-before', 'drop-after'))
  }

  list.addEventListener('dragover', event => {
    if (!nativeDragSourceId) return
    const targetRow = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-layer-id]')
    if (!targetRow || targetRow.dataset.layerId === nativeDragSourceId || !list.contains(targetRow)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    list.querySelectorAll('.drop-before,.drop-after').forEach(row => row.classList.remove('drop-before', 'drop-after'))
    const afterTarget = event.clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2
    targetRow.classList.add(afterTarget ? 'drop-after' : 'drop-before')
  })

  list.addEventListener('drop', event => {
    if (!nativeDragSourceId) return
    const targetRow = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-layer-id]')
    if (!targetRow || targetRow.dataset.layerId === nativeDragSourceId || !list.contains(targetRow)) return
    event.preventDefault()
    const afterTarget = event.clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2
    const sourceId = nativeDragSourceId
    clearNativeDrag()
    reorderLayers(sourceId, targetRow.dataset.layerId ?? '', afterTarget)
  })

  list.querySelectorAll<HTMLButtonElement>('[data-layer-grip]').forEach(handle => {
    handle.addEventListener('dragstart', event => {
      const sourceId = handle.dataset.layerGrip
      const sourceRow = handle.closest<HTMLElement>('[data-layer-id]')
      if (!sourceId || !sourceRow || !event.dataTransfer) { event.preventDefault(); return }
      event.stopPropagation()
      nativeDragSourceId = sourceId
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', sourceId)
      sourceRow.classList.add('is-dragging')
    })
    handle.addEventListener('dragend', clearNativeDrag)
    handle.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return
      if (event.button !== 0) return
      event.preventDefault()
      event.stopPropagation()
      const sourceId = handle.dataset.layerGrip
      const sourceRow = handle.closest<HTMLElement>('[data-layer-id]')
      if (!sourceId || !sourceRow) return
      selectObject(sourceId)

      let active = false
      let targetId: string | null = null
      let afterTarget = false
      const startY = event.clientY
      const updateDropTarget = (clientX: number, clientY: number) => {
        const hit = document.elementFromPoint(clientX, clientY) as HTMLElement | null
        const targetRow = hit?.closest<HTMLElement>('[data-layer-id]')
        list.querySelectorAll('.drop-before,.drop-after').forEach(row => row.classList.remove('drop-before', 'drop-after'))
        if (!targetRow || targetRow === sourceRow || !list.contains(targetRow)) {
          targetId = null
          return
        }
        targetId = targetRow.dataset.layerId ?? null
        afterTarget = clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2
        targetRow.classList.add(afterTarget ? 'drop-after' : 'drop-before')
      }
      const onMove = (moveEvent: PointerEvent) => {
        const distance = Math.abs(moveEvent.clientY - startY)
        if (!active && distance < 5) return
        active = true
        sourceRow.classList.add('is-dragging')
        updateDropTarget(moveEvent.clientX, moveEvent.clientY)
      }
      const onMouseMove = (moveEvent: MouseEvent) => onMove(moveEvent as PointerEvent)
      const cleanup = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onUp as (event: MouseEvent) => void)
        sourceRow.classList.remove('is-dragging')
        list.querySelectorAll('.drop-before,.drop-after').forEach(row => row.classList.remove('drop-before', 'drop-after'))
      }
      const onUp = (upEvent: PointerEvent) => {
        if (!active && Math.abs(upEvent.clientY - startY) >= 5) active = true
        if (active) updateDropTarget(upEvent.clientX, upEvent.clientY)
        const shouldReorder = active && targetId
        cleanup()
        if (shouldReorder && targetId) reorderLayers(sourceId, targetId, afterTarget)
      }
      const onCancel = () => cleanup()
      window.addEventListener('pointermove', onMove, { passive: false })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onCancel)
      window.addEventListener('mousemove', onMouseMove, { passive: false })
      window.addEventListener('mouseup', onUp as (event: MouseEvent) => void)
      try { handle.setPointerCapture(event.pointerId) } catch {}
    })
    handle.addEventListener('click', event => event.stopPropagation())
    handle.addEventListener('keydown', event => {
      if (!event.altKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return
      event.preventDefault()
      const sourceId = handle.dataset.layerGrip
      const visualOrder = [...objects].reverse()
      const index = visualOrder.findIndex(item => item.id === sourceId)
      const target = visualOrder[index + (event.key === 'ArrowUp' ? -1 : 1)]
      if (sourceId && target) reorderLayers(sourceId, target.id, event.key === 'ArrowDown')
    })
  })
}

function fitWorkspace() {
  const stage = app.querySelector<HTMLElement>('[data-stage]')
  if (!stage) return
  cancelPanMomentum()
  autoFit = true
  viewScale = Math.max(.15, Math.min(1, (stage.clientWidth - 64) / 660, (stage.clientHeight - 64) / 930))
  viewX = (stage.clientWidth - 660 * viewScale) / 2
  viewY = (stage.clientHeight - 930 * viewScale) / 2
  updateWorkspace()
}

function zoomWorkspace(factor: number, x?: number, y?: number) {
  const stage = app.querySelector<HTMLElement>('[data-stage]')
  if (!stage) return
  cancelPanMomentum()
  const anchorX = x ?? stage.clientWidth / 2
  const anchorY = y ?? stage.clientHeight / 2
  const next = clamp(viewScale * factor, .15, 3)
  viewX = anchorX - (anchorX - viewX) * next / viewScale
  viewY = anchorY - (anchorY - viewY) * next / viewScale
  viewScale = next
  autoFit = false
  updateWorkspace()
}

function bindWorkspace() {
  const stage = app.querySelector<HTMLElement>('[data-stage]')
  if (!stage) return
  if (!viewScale || autoFit) fitWorkspace(); else updateWorkspace()
  workspaceObserver = new ResizeObserver(() => { if (autoFit) fitWorkspace() })
  workspaceObserver.observe(stage)
  stage.addEventListener('wheel', event => {
    event.preventDefault()
    if (event.ctrlKey || event.metaKey) {
      const rect = stage.getBoundingClientRect()
      zoomWorkspace(Math.exp(-event.deltaY * .003), event.clientX - rect.left, event.clientY - rect.top)
    } else {
      autoFit = false
      viewX -= event.shiftKey ? event.deltaY : event.deltaX
      viewY -= event.shiftKey ? 0 : event.deltaY
      updateWorkspace()
    }
  }, {passive:false})
  stage.addEventListener('pointerdown', event => {
    const target = event.target as HTMLElement
    if (!handTool && !spaceHeld && event.button !== 1 && target.closest('[data-object]')) return
    if (event.button !== 0 && event.button !== 1) return
    event.preventDefault()
    event.stopPropagation()
    cancelPanMomentum()
    stage.setPointerCapture(event.pointerId)
    const x = event.clientX, y = event.clientY, initialX = viewX, initialY = viewY
    const samples: Array<{ x: number; y: number; time: number }> = [{ x, y, time: performance.now() }]
    stage.classList.add('is-panning')
    const move = (current: PointerEvent) => {
      autoFit = false
      viewX = initialX + current.clientX - x
      viewY = initialY + current.clientY - y
      updateWorkspace()
      const time = performance.now()
      samples.push({ x: current.clientX, y: current.clientY, time })
      while (samples.length > 2 && time - samples[0].time > 100) samples.shift()
    }
    const stop = (endEvent: PointerEvent) => {
      stage.classList.remove('is-panning')
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerup', stop)
      stage.removeEventListener('pointercancel', stop)
      if (endEvent.type === 'pointercancel') {
        viewX = initialX
        viewY = initialY
        updateWorkspace()
        return
      }
      if (endEvent.type !== 'pointerup' || samples.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const first = samples[0]
      const last = samples[samples.length - 1]
      const elapsed = last.time - first.time
      if (elapsed < 8) return
      startPanMomentum(
        clamp((last.x - first.x) / elapsed, -1.5, 1.5),
        clamp((last.y - first.y) / elapsed, -1.5, 1.5),
      )
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerup', stop)
    stage.addEventListener('pointercancel', stop)
  }, true)
}

function cancelPanMomentum() {
  if (panMomentumFrame) cancelAnimationFrame(panMomentumFrame)
  panMomentumFrame = 0
}

function startPanMomentum(velocityX: number, velocityY: number) {
  cancelPanMomentum()
  if (Math.hypot(velocityX, velocityY) < .08) return
  let previousTime = performance.now()
  const tick = (time: number) => {
    const elapsed = Math.min(32, time - previousTime)
    previousTime = time
    viewX += velocityX * elapsed
    viewY += velocityY * elapsed
    const decay = Math.pow(.91, elapsed / 16)
    velocityX *= decay
    velocityY *= decay
    updateWorkspace()
    if (Math.hypot(velocityX, velocityY) < .025) {
      panMomentumFrame = 0
      return
    }
    panMomentumFrame = requestAnimationFrame(tick)
  }
  panMomentumFrame = requestAnimationFrame(tick)
}

let objectClipboard: EditorObject | null = null
document.addEventListener('keydown', event => {
  if (screen !== 'editor' || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  if (event.code === 'Space') { event.preventDefault(); spaceHeld = true; updateWorkspace(); return }
  if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ') { event.preventDefault(); event.shiftKey ? redo() : undo(); return }
  if ((event.ctrlKey || event.metaKey) && ['KeyD','KeyJ'].includes(event.code)) { event.preventDefault(); duplicateSelected(); return }
  const command = event.ctrlKey || event.metaKey
  if(command && event.code === 'KeyY') { event.preventDefault(); redo(); return }
  if(command && ['KeyC','KeyX','KeyV'].includes(event.code)) {
    event.preventDefault()
    if(event.code === 'KeyV') {
      if(objectClipboard) { const copy = {...objectClipboard,id:crypto.randomUUID(),x:objectClipboard.x+24,y:objectClipboard.y+24};objects.push(copy);selectedId=copy.id;objectClipboard={...copy};saveHistory();render() }
    } else { const item=selectedObject();if(item) {objectClipboard={...item};if(event.code==='KeyX') deleteSelected()} }
    return
  }
  if(command && event.code === 'KeyS') {event.preventDefault();saveDraft();notify('Макет сохранён');return}
  if(command && event.code === 'KeyE') {event.preventDefault();void exportPoster();return}
  if(command && ['Equal','Minus','Digit0','Digit1'].includes(event.code)) {event.preventDefault();if(event.code==='Digit0')fitWorkspace();else zoomWorkspace(event.code==='Digit1'?1/viewScale:event.code==='Equal'?1.2:1/1.2);return}
  if(command && ['BracketLeft','BracketRight'].includes(event.code)) {
    event.preventDefault();const index=objects.findIndex(item=>item.id===selectedId)
    if(index>=0) {const target=event.shiftKey?(event.code==='BracketLeft'?0:objects.length-1):clamp(index+(event.code==='BracketLeft'?-1:1),0,objects.length-1);const [item]=objects.splice(index,1);objects.splice(target,0,item);saveHistory();render()}
    return
  }
  if(!command && !event.altKey) {
    if(event.code==='KeyV'||event.code==='KeyH') {event.preventDefault();handTool=event.code==='KeyH';updateWorkspace();return}
    if(event.code==='KeyT'||event.code==='KeyR') {event.preventDefault();addObject(event.code==='KeyT'?'text':'shape');return}
  }
  if (event.key === 'Escape') { if(briefOpen)toggleTaskBrief();selectObject(null); return }
  if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); deleteSelected(); return }
  const object = selectedObject()
  if (!object || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return
  event.preventDefault()
  const step = event.shiftKey ? 10 : 1
  object.x += event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0
  object.y += event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0
  const element = Array.from(app.querySelectorAll<HTMLElement>('[data-object]')).find(node => node.dataset.object === object.id)
  if (element) { element.style.left = `${object.x}px`; element.style.top = `${object.y}px` }
  updatePropertyInputs()
  scheduleHistoryCommit()
  scheduleDraftSave()
})
document.addEventListener('keyup', event => { if (event.code === 'Space') { spaceHeld = false; updateWorkspace() } })
window.addEventListener('blur', () => { spaceHeld = false; updateWorkspace() })

function bindEvents() {
  if (screen === 'editor') bindWorkspace()
  app.querySelectorAll<HTMLButtonElement>('.mobile-editor-tabs [data-mobile-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.mobileView as typeof mobileEditorView | undefined
      if (!view) return
      mobileEditorView = view
      const editor = app.querySelector<HTMLElement>('.editor-shell')
      if (editor) editor.dataset.mobileView = view
      app.querySelectorAll<HTMLButtonElement>('.mobile-editor-tabs [data-mobile-view]').forEach((tab) => {
        tab.setAttribute('aria-selected', String(tab === button))
      })
      if (view === 'canvas') requestAnimationFrame(() => fitWorkspace())
    })
  })
  app.querySelectorAll<HTMLElement>('[data-screen]').forEach((element) => {
    element.addEventListener('click', () => {
      const target = element.dataset.screen as Exclude<Screen, 'editor'> | undefined
      if (!target) return
      if (screen === 'editor') saveDraft()
      screen = target
      selectedId = null
      render()
    })
  })

  app.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => {
    element.addEventListener('click', () => {
      const action = element.dataset.action
      if (action === 'home') goHome()
      if (action === 'start-first') openTask(tasks[0])
      if (action === 'scroll-tasks') document.querySelector('#tasks')?.scrollIntoView({ behavior: 'smooth' })
      if (action === 'grid') {
        showGrid = !showGrid
        const poster = document.querySelector<HTMLElement>('[data-poster]')
        poster?.classList.toggle('show-grid', showGrid)
        element.classList.toggle('active', showGrid)
      }
      if (action === 'undo') undo()
      if (action === 'redo') redo()
      if (action === 'duplicate') duplicateSelected()
      if (action === 'delete') deleteSelected()
      if (action === 'center') centerSelected()
      if (action === 'check') checkWork()
      if (action === 'export') void exportPoster()
      if (action === 'fit') fitWorkspace()
      if (action === 'zoom-in') zoomWorkspace(1.2)
      if (action === 'zoom-out') zoomWorkspace(1 / 1.2)
      if (action === 'hand') { handTool = !handTool; updateWorkspace() }
      if (action === 'toggle-brief') toggleTaskBrief()
      if (action === 'restore-legacy') { if(loadDraft(true)){selectedId=null;saveHistory();render();notify('Открыта копия прежней работы. Для зачёта действуют новые критерии')} }
      if (action === 'reset-task') {
        if (!window.confirm('Открыть обновлённый исходный макет? Замену можно отменить кнопкой «Отменить», пока редактор открыт.')) return
        posterBackground = TASK_BACKGROUNDS[selectedTask.id] ?? '#f2f0e9'
        objects = starterFor(selectedTask.id, makeInitialObjects())
        selectedId = null
        saveHistory()
        render()
      }
      if (action === 'subscription') showSubscriptionModal()
      if (action === 'new-user') {
        const account = createUser()
        users[account.id] = account
        activateUser(account)
        applyTheme()
        screen = 'profile'
        render()
        notify('Создан новый личный кабинет')
      }
      if (action === 'theme') {
        theme = theme === 'light' ? 'dark' : 'light'
        saveTheme()
        applyTheme()
        render()
      }
      if (action === 'save-profile') {
        const name = document.querySelector<HTMLInputElement>('[data-profile-name]')?.value.trim()
        const role = document.querySelector<HTMLInputElement>('[data-profile-role]')?.value.trim()
        if (!name) {
          notify('Введите имя, чтобы сохранить профиль')
          document.querySelector<HTMLInputElement>('[data-profile-name]')?.focus()
          return
        }
        profile.name = name.slice(0, 48)
        profile.role = (role || 'Дизайнер в процессе').slice(0, 80)
        const saved = saveProfile()
        render()
        notify(saved ? 'Профиль сохранён' : 'Профиль изменён, но браузер не смог его сохранить')
      }
    })
  })

  app.querySelectorAll<HTMLElement>('[data-profile-file]').forEach((element) => {
    element.addEventListener('change', () => {
      const input = element as HTMLInputElement
      const file = input.files?.[0]
      if (!file) return
      const ownerId = currentUserId
      if (!PROFILE_IMAGE_TYPES.has(file.type) || file.size > PROFILE_IMAGE_MAX_BYTES) {
        notify('Загрузите PNG, JPG или WebP размером до 8 МБ')
        input.value = ''
        return
      }
      void createImageBitmap(file).then(bitmap => {
        if (ownerId !== currentUserId) { bitmap.close(); return }
        const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(bitmap.width * scale))
        canvas.height = Math.max(1, Math.round(bitmap.height * scale))
        const context = canvas.getContext('2d')
        if (!context) { bitmap.close(); throw new Error('Canvas unavailable') }
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        bitmap.close()
        profile.photo = canvas.toDataURL('image/webp', .78)
        const saved = saveProfile()
        const image = document.createElement('img')
        image.src = profile.photo
        image.alt = 'Фото профиля'
        document.querySelector<HTMLElement>('[data-profile-photo]')?.replaceChildren(image)
        const avatarImage = image.cloneNode(true) as HTMLImageElement
        avatarImage.alt = ''
        document.querySelector<HTMLElement>('.avatar-button')?.replaceChildren(avatarImage)
        notify(saved ? 'Фото профиля обновлено' : 'Фото обновлено, но браузер не смог сохранить профиль')
      }).catch(() => notify('Не удалось открыть изображение профиля')).finally(() => { input.value = '' })
    })
  })

  app.querySelectorAll<HTMLElement>('[data-task-theory]').forEach((element) => {
    element.addEventListener('click', () => {
      const task = tasks.find((item) => item.id === element.dataset.taskTheory)
      if (task) showTheory(task)
    })
  })

  app.querySelectorAll<HTMLElement>('[data-filter]').forEach((element) => {
    element.addEventListener('click', () => {
      const filter = element.dataset.filter || 'all'
      app.querySelectorAll<HTMLElement>('[data-filter]').forEach((button) => {
        const active = button === element
        button.classList.toggle('active', active)
        button.setAttribute('aria-pressed', String(active))
      })
      app.querySelectorAll<HTMLElement>('.task-row-card').forEach((card) => {
        const level = card.dataset.level || ''
        card.style.display = filter === 'all' || level === filter ? '' : 'none'
      })
      const visible = Array.from(app.querySelectorAll<HTMLElement>('.task-row-card')).filter((card) => card.style.display !== 'none').length
      const counter = app.querySelector<HTMLElement>('.list-counter')
      if (counter) counter.textContent = `${visible} МОДУЛЕЙ`
    })
  })

  app.querySelectorAll<HTMLElement>('[data-task]').forEach((element) => {
    element.addEventListener('click', () => {
      const task = tasks.find((item) => item.id === element.dataset.task)
      if (task) openTask(task)
    })
  })

  app.querySelectorAll<HTMLElement>('[data-add]').forEach((element) => {
    element.addEventListener('click', () => addObject(element.dataset.add as EditorObject['type']))
  })

  app.querySelectorAll<HTMLElement>('[data-material-id]').forEach(element => {
    element.addEventListener('click', () => {
      if(Date.now()-lastMaterialDropAt<350)return
      const item=materialFor(selectedTask.id,element.dataset.materialId??'')
      if(item)insertMaterial(item)
    })
    element.addEventListener('dragstart',event=>{
      const item=materialFor(selectedTask.id,element.dataset.materialId??'')
      if(!item)return
      event.dataTransfer?.setData('application/x-tochka-material',item.id)
      event.dataTransfer?.setData('text/plain',item.id)
      if(event.dataTransfer)event.dataTransfer.effectAllowed='copy'
      element.classList.add('is-dragging')
    })
    element.addEventListener('dragend',()=>element.classList.remove('is-dragging'))
  })
  app.querySelectorAll<HTMLElement>('[data-material-filter]').forEach(element=>element.addEventListener('click',()=>{
    const filter=element.dataset.materialFilter??'all'
    app.querySelectorAll<HTMLElement>('[data-material-filter]').forEach(button=>{const active=button===element;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))})
    app.querySelectorAll<HTMLElement>('.material-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.materialKind!==filter})
  }))
  app.querySelectorAll<HTMLElement>('[data-add-copy]').forEach(element=>element.addEventListener('click',()=>addBriefCopy(Number(element.dataset.addCopy))))
  app.querySelectorAll<HTMLElement>('[data-palette-target]').forEach(element=>element.addEventListener('click',()=>{
    const target=element.dataset.paletteTarget
    if(target!=='background'&&target!=='text'&&target!=='fill')return
    paletteTarget=target
    app.querySelectorAll<HTMLElement>('[data-palette-target]').forEach(button=>button.classList.toggle('active',button===element))
  }))
  app.querySelectorAll<HTMLButtonElement>('[data-palette-color]').forEach(element=>element.addEventListener('click',()=>applyPaletteColor(element.dataset.paletteColor??'')))
  const posterDrop=app.querySelector<HTMLElement>('[data-poster]')
  posterDrop?.addEventListener('dragover',event=>{
    if(!event.dataTransfer?.types.includes('application/x-tochka-material'))return
    event.preventDefault()
    if(event.dataTransfer)event.dataTransfer.dropEffect='copy'
    posterDrop.classList.add('accepting-material')
  })
  posterDrop?.addEventListener('dragleave',event=>{if(!posterDrop.contains(event.relatedTarget as Node|null))posterDrop.classList.remove('accepting-material')})
  posterDrop?.addEventListener('drop',event=>{
    const id=event.dataTransfer?.getData('application/x-tochka-material')||event.dataTransfer?.getData('text/plain')
    const item=materialFor(selectedTask.id,id??'')
    if(!item)return
    event.preventDefault();lastMaterialDropAt=Date.now();posterDrop.classList.remove('accepting-material')
    const rect=posterDrop.getBoundingClientRect();const scaleX=rect.width/660;const scaleY=rect.height/930
    insertMaterial(item,(event.clientX-rect.left)/scaleX,(event.clientY-rect.top)/scaleY)
  })

  app.querySelector<HTMLInputElement>('[data-poster-bg]')?.addEventListener('input', (event) => {
    const value = (event.target as HTMLInputElement).value
    if (!/^#[0-9a-f]{6}$/i.test(value)) return
    posterBackground = value
    const poster = app.querySelector<HTMLElement>('[data-poster]')
    poster?.style.setProperty('--poster-bg', value)
    scheduleDraftSave()
  })
  app.querySelector('[data-poster-bg]')?.addEventListener('change', () => saveHistory())

  app.querySelectorAll<HTMLElement>('[data-select]').forEach((element) => {
    element.addEventListener('click', () => selectObject(element.dataset.select ?? null))
    if (element.classList.contains('layer-row')) {
      element.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        selectObject(element.dataset.select ?? null)
      })
    }
  })

  app.querySelectorAll<HTMLElement>('[data-object]').forEach((element) => {
    element.addEventListener('pointerdown', (event) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-resize]')) return
      const id = element.dataset.object
      const object = objects.find((item) => item.id === id)
      if (!object) return
      event.preventDefault()
      selectObject(object.id)
      bindDrag(event, object, element)
      updatePropertyInputs()
    })
    element.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      selectObject(element.dataset.object ?? null)
    })
  })

  app.querySelectorAll<HTMLElement>('[data-resize]').forEach(bindResizeHandle)
  bindPropertyControls()
  bindLayerSorting()
}

function bindPropertyControls() {
  app.querySelector<HTMLInputElement>('[data-photo-file]')?.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    const id = selectedId
    const taskId = selectedTask.id
    const targetObject = objects.find(item => item.id === id)
    if (!file || !id || !targetObject) return
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 10_000_000) {
      notify('Выберите PNG, JPG или WebP размером до 10 МБ')
      input.value = ''
      return
    }
    void createImageBitmap(file).then(bitmap => {
      if (selectedTask.id !== taskId || !objects.includes(targetObject) || targetObject.type !== 'photo') { bitmap.close(); return }
      const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      if (!context) { bitmap.close(); throw new Error('Canvas unavailable') }
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      bitmap.close()
      targetObject.imageSrc = canvas.toDataURL('image/webp', .82)
      targetObject.assetId = undefined
      targetObject.materialKind = 'photo'
      targetObject.fit = 'cover'
      targetObject.imagePosition = 'center'
      saveHistory()
      render()
      notify('Изображение добавлено в плакат')
    }).catch(() => notify('Не удалось открыть изображение')).finally(() => { input.value = '' })
  })
  app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-prop]').forEach((input) => {
    input.addEventListener('input', () => {
      const object = selectedObject()
      if (!object) return
      const prop = input.dataset.prop as keyof EditorObject

      if (prop === 'text') {
        if (object.type !== 'text' && object.type !== 'date') return
        object.text = input.value
        const objectEl = document.querySelector<HTMLElement>(`[data-object="${object.id}"] .object-text`)
        if (objectEl) objectEl.innerHTML = escapeHtml(input.value).replace(/\n/g, '<br>')
        scheduleDraftSave()
        return
      }

      if (prop === 'fontFamily') {
        if (object.type !== 'text' && object.type !== 'date') return
        object.fontFamily = input.value
        const text = document.querySelector<HTMLElement>(`[data-object="${object.id}"] .object-text`)
        if (text) text.style.fontFamily = object.fontFamily
        scheduleDraftSave()
        return
      }

      if (prop === 'textAlign') {
        if (object.type !== 'text' && object.type !== 'date') return
        object.textAlign = input.value as EditorObject['textAlign']
        const text = document.querySelector<HTMLElement>(`[data-object="${object.id}"] .object-text`)
        if (text) text.style.setProperty('--object-align', object.textAlign ?? 'left')
        scheduleDraftSave()
        return
      }

      if (prop === 'fit' || prop === 'imagePosition') {
        if (object.type !== 'photo') return
        if (prop === 'fit') object.fit = input.value === 'contain' ? 'contain' : 'cover'
        else object.imagePosition = ['center','top','bottom','left','right'].includes(input.value) ? input.value as EditorObject['imagePosition'] : 'center'
        const image = document.querySelector<HTMLImageElement>(`[data-object="${object.id}"] .photo-placeholder img`)
        if (image) {
          image.style.objectFit = object.fit ?? 'cover'
          image.style.objectPosition = ({center:'50% 50%',top:'50% 0%',bottom:'50% 100%',left:'0% 50%',right:'100% 50%'} as const)[object.imagePosition ?? 'center']
        }
        scheduleDraftSave()
        return
      }

      if (prop === 'color') {
        if (object.type !== 'text' && object.type !== 'date') return
        object.color = input.value
        const text = document.querySelector<HTMLElement>(`[data-object="${object.id}"] .object-text`)
        if (text) text.style.color = object.color
        scheduleDraftSave()
        return
      }

      if (prop === 'background') {
        if (object.type !== 'shape' && object.type !== 'photo') return
        object.background = input.value
        const objectEl = document.querySelector<HTMLElement>(`[data-object="${object.id}"]`)
        const graphic = objectEl?.querySelector<HTMLElement>('.shape-content, .photo-placeholder')
        if (graphic) graphic.style.background = object.background
        scheduleDraftSave()
        return
      }

      if (prop === 'radius') {
        if (object.type !== 'shape' && object.type !== 'photo') return
        const numericValue = Number(input.value)
        if (Number.isNaN(numericValue)) return
        object.radius = clamp(numericValue, 0, 999)
        const graphic = document.querySelector<HTMLElement>(`[data-object="${object.id}"] .shape-content, [data-object="${object.id}"] .photo-placeholder`)
        if (graphic) graphic.style.borderRadius = `${object.radius}px`
        scheduleDraftSave()
        return
      }

      if ((prop as string) === 'opacity') {
        if (object.type !== 'photo') return
        const numericValue = Number(input.value)
        if (Number.isNaN(numericValue)) return
        object.opacity = clamp(numericValue / 100, 0.1, 1)
        const objectEl = document.querySelector<HTMLElement>(`[data-object="${object.id}"]`)
        if (objectEl) objectEl.style.opacity = String(object.opacity)
        scheduleDraftSave()
        return
      }

      const numericValue = Number(input.value)
      if (!Number.isFinite(numericValue)) return
      const safeValue = prop === 'width' || prop === 'height' ? clamp(numericValue, 10, 4000) : prop === 'fontSize' ? clamp(numericValue, 8, 180) : prop === 'fontWeight' ? clamp(numericValue, 100, 900) : prop === 'lineHeight' ? clamp(numericValue,.7,2.5) : prop === 'letterSpacing' ? clamp(numericValue,-10,30) : numericValue
      ;(object as unknown as Record<string, unknown>)[prop] = safeValue
      const objectEl = document.querySelector<HTMLElement>(`[data-object="${object.id}"]`)
      if (!objectEl) return
      if (prop === 'opacity') objectEl.style.opacity = String(object.opacity ?? 1)
      objectEl.style.left = `${object.x}px`
      objectEl.style.top = `${object.y}px`
      objectEl.style.width = `${object.width}px`
      objectEl.style.height = `${object.height}px`
      objectEl.style.transform = `rotate(${object.rotation ?? 0}deg)`

      const text = objectEl.querySelector<HTMLElement>('.object-text')
      if (text) {
        text.style.fontSize = `${object.fontSize ?? 0}px`
        text.style.fontWeight = `${object.fontWeight ?? 0}`
        text.style.color = object.color ?? ''
        text.style.fontFamily = object.fontFamily ?? ''
        text.style.setProperty('--object-line-height',String(object.lineHeight??1))
        text.style.setProperty('--object-letter-spacing',`${object.letterSpacing??0}px`)
        text.style.setProperty('--object-align',object.textAlign??'left')
      }
      const graphic = objectEl.querySelector<HTMLElement>('.shape-content, .photo-placeholder')
      if (graphic && (object.type === 'shape' || object.type === 'photo')) {
        graphic.style.borderRadius = `${object.radius ?? 0}px`
        graphic.style.background = object.background ?? ''
      }
      scheduleDraftSave()
    })
    input.addEventListener('blur', () => saveHistory())
  })
}

function bindDrag(event: PointerEvent, object: EditorObject, element: HTMLElement) {
  if (event.button !== 0) return
  try { element.setPointerCapture(event.pointerId) } catch {}
  element.classList.add('dragging')
  const startX = event.clientX
  const startY = event.clientY
  const initialX = object.x
  const initialY = object.y
  let moved = false

  const move = (current: PointerEvent) => {
    const poster = document.querySelector<HTMLElement>('[data-poster]')
    const scale = poster ? poster.getBoundingClientRect().width / poster.clientWidth : 1
    const dx = (current.clientX - startX) / scale
    const dy = (current.clientY - startY) / scale
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true

    object.x = initialX + dx
    object.y = initialY + dy
    if(showGrid && !current.altKey) {
      const snapX=24+Math.round((object.x-24)/102)*102
      if(Math.abs(object.x-snapX)<=8/(viewScale||1))object.x=snapX
    }
    element.style.left = `${object.x}px`
    element.style.top = `${object.y}px`
  }

  const up = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== event.pointerId) return
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    element.classList.remove('dragging')
    if (endEvent.type === 'pointercancel') {
      object.x = initialX
      object.y = initialY
      element.style.left = `${initialX}px`
      element.style.top = `${initialY}px`
      return
    }
    if (moved) {
      saveHistory()
      updatePropertyInputs()
    }
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}


function bindRotation(event: PointerEvent, object: EditorObject, element: HTMLElement) {
  const rect = element.getBoundingClientRect(), cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2
  const initial = object.rotation ?? 0, start = Math.atan2(event.clientY-cy,event.clientX-cx)
  const move = (e: PointerEvent) => {
    if(e.pointerId !== event.pointerId) return
    const angle = initial + (Math.atan2(e.clientY-cy,e.clientX-cx)-start)*180/Math.PI
    object.rotation = e.shiftKey ? Math.round(angle/15)*15 : Math.round(angle)
    element.style.transform = `rotate(${object.rotation}deg)`
    updatePropertyInputs()
  }
  const up = (e: PointerEvent) => {
    if(e.pointerId !== event.pointerId) return
    window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)
    if(e.type === 'pointercancel') { object.rotation=initial; element.style.transform=`rotate(${initial}deg)` }
    else saveHistory()
    updatePropertyInputs()
  }
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)
}

function bindResize(event: PointerEvent, object: EditorObject, direction: string, element: HTMLElement) {
  const captureTarget = event.currentTarget instanceof HTMLElement ? event.currentTarget : element
  try { captureTarget.setPointerCapture(event.pointerId) } catch {}
  const startX = event.clientX
  const startY = event.clientY
  const initial = { x: object.x, y: object.y, width: object.width, height: object.height }
  let changed = false

  const move = (current: PointerEvent) => {
    if(current.pointerId !== event.pointerId) return
    const angle=(object.rotation??0)*Math.PI/180, cos=Math.cos(angle), sin=Math.sin(angle)
    const screenX=(current.clientX-startX)/(viewScale||1),screenY=(current.clientY-startY)/(viewScale||1)
    const dx=screenX*cos+screenY*sin,dy=-screenX*sin+screenY*cos

    let x = initial.x
    let y = initial.y
    let width = initial.width
    let height = initial.height

    if (direction.includes('e')) width = initial.width + dx
    if (direction.includes('s')) height = initial.height + dy
    if (direction.includes('w')) {
      width = initial.width - dx
      x = initial.x + dx
    }
    if (direction.includes('n')) {
      height = initial.height - dy
      y = initial.y + dy
    }

    const minSize = 30
    if (width < minSize) {
      if (direction.includes('w')) x = initial.x + initial.width - minSize
      width = minSize
    }
    if (height < minSize) {
      if (direction.includes('n')) y = initial.y + initial.height - minSize
      height = minSize
    }



    if(current.shiftKey && direction.length===2) {
      const ratio=initial.width/initial.height
      if(Math.abs(width-initial.width)>Math.abs(height-initial.height)*ratio)height=width/ratio
      else width=height*ratio
      if(direction.includes('w'))x=initial.x+initial.width-width
      if(direction.includes('n'))y=initial.y+initial.height-height
    }
    const localCx=x+width/2-(initial.x+initial.width/2),localCy=y+height/2-(initial.y+initial.height/2)
    x=initial.x+initial.width/2+localCx*cos-localCy*sin-width/2
    y=initial.y+initial.height/2+localCx*sin+localCy*cos-height/2
    if (width >= minSize && height >= minSize) {
      object.x = x
      object.y = y
      object.width = width
      object.height = height
      element.style.left = `${x}px`
      element.style.top = `${y}px`
      element.style.width = `${width}px`
      element.style.height = `${height}px`
      changed = true
    }
  }

  const up = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== event.pointerId) return
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    if (endEvent.type === 'pointercancel') {
      object.x = initial.x
      object.y = initial.y
      object.width = initial.width
      object.height = initial.height
      element.style.left = `${initial.x}px`
      element.style.top = `${initial.y}px`
      element.style.width = `${initial.width}px`
      element.style.height = `${initial.height}px`
      return
    }
    if (changed) {
      saveHistory()
      updatePropertyInputs()
    }
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}

function updatePropertyInputs() {
  const object = selectedObject()
  if (!object) return
  const values: Record<string, string | number> = {
    x: Math.round(object.x),
    y: Math.round(object.y),
    width: Math.round(object.width),
    height: Math.round(object.height),
    rotation: Math.round(object.rotation),
    fontSize: object.fontSize ?? 0,
    fontWeight: object.fontWeight ?? 0,
  }
  Object.entries(values).forEach(([key, value]) => {
    const input = document.querySelector<HTMLInputElement>(`[data-prop="${key}"]`)
    if (input) input.value = String(value)
  })
}

function showSubscriptionModal() {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay subscription-overlay'
  overlay.innerHTML = `
    <div class="subscription-modal">
      <button class="modal-close" data-close aria-label="Закрыть">${uiIcon('close')}</button>
      <div class="modal-kicker">ТОЧКА СБОРКИ / PRO</div>
      <h2>Собирай без<br><em>ограничений.</em></h2>
      <p class="modal-lead">Демонстрационная подписка. Платежей пока нет — активация работает локально и нужна для прототипа будущей системы доступа.</p>
      <div class="plan-grid">
        <article class="plan-card"><span>START</span><strong>Бесплатно</strong><p>Вся теория, шесть заданий, редактор, сохранение, PNG и проверка по критериям.</p><button class="ghost-button" data-close>ТЕКУЩИЙ ДОСТУП</button></article>
        <article class="plan-card plan-card-pro"><span>PRO</span><strong>Демо</strong><p>Прототип будущего расширенного доступа. Чат и ИИ-разбор доступны без подписки в пределах дневного лимита.</p><button class="primary-button" data-subscribe>ВКЛЮЧИТЬ ДЕМО ${uiIcon('forward')}</button></article>
      </div>
      <div class="subscription-note"><span>${uiIcon('check')}</span> Без реальной оплаты · <span>${uiIcon('check')}</span> Можно отключить в любой момент · <span>${uiIcon('check')}</span> Сейчас это mock-система</div>
    </div>`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('visible'))
  const close = () => { overlay.classList.remove('visible'); window.setTimeout(() => overlay.remove(), 220) }
  wireAccessibleDialog(overlay, overlay.querySelector<HTMLElement>('.subscription-modal')!, close)
  overlay.querySelector<HTMLElement>('[data-subscribe]')?.addEventListener('click', () => {
    subscriptionActive = true
    saveSubscription()
    close()
    render()
    notify('Демо PRO включено. Все учебные функции доступны и без него')
  })
}

const THEORY_EXPANDED: Record<string, {focus: string[]; mistakes: string[]; check: string[]}> = {
  composition: {
    focus: ['Сначала определите главный объект и его визуальный вес. Остальные элементы должны поддерживать, а не конкурировать с ним.', 'Работайте с масштабом: резкий перепад размеров помогает построить иерархию, но слишком много крупных элементов разрушает центр.', 'Пустое пространство — активная часть композиции. Оно задаёт темп, отделяет смысловые группы и помогает главному элементу «дышать».', 'Проверяйте композицию в уменьшенном масштабе: если структура не считывается за несколько секунд, детали её не спасут.'],
    mistakes: ['Несколько равнозначных центров внимания.', 'Случайные интервалы между объектами.', 'Попытка заполнить всё свободное место.', 'Выравнивание элементов без общей логики.'],
    check: ['Назовите главный объект одним словом.', 'Уберите один второстепенный элемент и сравните композицию.', 'Проверьте баланс крупных и малых масс.']
  },
  hierarchy: {
    focus: ['Иерархия строится через размер, насыщенность, контраст, положение и интервалы — не только через размер шрифта.', 'Первый уровень должен считываться мгновенно, второй — объяснять контекст, третий — давать детали.', 'Одинаково сильные элементы создают конкуренцию. Ослабляйте второстепенную информацию по одному или нескольким параметрам.', 'Проверяйте маршрут взгляда: зритель должен понимать, куда перейти после главного элемента.'],
    mistakes: ['Все заголовки одинакового веса.', 'Слишком много акцентных цветов.', 'Вторичная информация визуально сильнее основной.', 'Отсутствие явной точки входа.'],
    check: ['Прикройте часть макета: главный элемент всё ещё очевиден?', 'Опишите порядок чтения 1 → 2 → 3.', 'Снизьте насыщенность второстепенного блока и сравните.']
  },
  balance: {
    focus: ['Баланс — это не симметрия. Асимметричная композиция может быть устойчивой, если визуальный вес распределён осознанно.', 'Размер, плотность, контраст и положение ближе к краю усиливают ощущение веса.', 'Большую тяжёлую массу можно уравновесить несколькими малыми объектами, если они занимают стратегические позиции.', 'Оценивайте композицию целиком: отдельный объект может казаться лёгким, но в общей структуре стать доминирующим.'],
    mistakes: ['Механическое выравнивание по центру.', 'Слишком тяжёлая одна сторона.', 'Игнорирование края формата.', 'Баланс только по площади без учёта контраста.'],
    check: ['Прищурьтесь и оцените композицию пятнами.', 'Сравните левую и правую визуальную массу.', 'Проверьте, не «падает» ли композиция к краю.']
  },
  rhythm: {
    focus: ['Ритм появляется из повторения: одинаковых форм, интервалов, направлений или размеров.', 'Предсказуемость создаёт основу, а небольшое изменение удерживает внимание.', 'Ритм может ускоряться, замедляться или ломаться — изменение должно быть намеренным.', 'Повторяйте не обязательно сам объект, а его визуальное свойство: форму, угол, расстояние или масштаб.'],
    mistakes: ['Полностью одинаковая последовательность без акцента.', 'Случайные интервалы.', 'Слишком много изменений одновременно.', 'Нарушение ритма без смысловой причины.'],
    check: ['Найдите повторяющийся элемент.', 'Определите точку сбоя ритма.', 'Уберите один повтор и проверьте, сохраняется ли система.']
  },
  color: {
    focus: ['Сначала назначьте роли цветам: фон, основной, нейтральный и акцентный.', 'Контраст бывает по светлоте, температуре, насыщенности и самому оттенку.', 'Один сильный акцент обычно работает убедительнее, чем несколько конкурирующих акцентов.', 'Проверьте макет без цвета: если иерархия исчезает полностью, проблема может быть не в палитре, а в композиции.'],
    mistakes: ['Слишком много равнозначных цветов.', 'Акцент используется повсюду.', 'Недостаточный светлотный контраст.', 'Выбор цвета до определения структуры.'],
    check: ['Назовите главный акцент.', 'Сделайте изображение в оттенках серого.', 'Проверьте, остаётся ли читаемым главный текст.']
  },
  grid: {
    focus: ['Модульная сетка задаёт систему колонок, строк, полей и интервалов, внутри которой элементы получают предсказуемые отношения.', 'Не обязательно помещать каждый объект в одну ячейку: выход за сетку допустим, если он создаёт осознанный акцент.', 'Повторяющиеся интервалы помогают связать разнородные блоки в одну систему.', 'Сетка — это инструмент организации, а не видимый декоративный рисунок.'],
    mistakes: ['Случайная ширина колонок.', 'Разные интервалы без причины.', 'Попытка подогнать каждый объект под одну ячейку.', 'Проверка только отдельных блоков, а не всей системы.'],
    check: ['Найдите основные вертикали.', 'Сравните интервалы между блоками.', 'Проверьте один намеренный выход за сетку.']
  }
}

function showTheory(task: Task) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay theory-overlay'
  overlay.innerHTML = `
    <div class="theory-modal">
      <button class="modal-close" data-close aria-label="Закрыть">${uiIcon('close')}</button>
      <div class="theory-modal-head">
        <div class="theory-modal-icon icon-${task.id}"><span>${uiIcon(task.icon as keyof typeof UI_ICON_SVGS)}</span></div>
        <div><div class="modal-kicker">${task.number} / ${task.level.toUpperCase()}</div><h2>${projects[task.id].headline}</h2><p>${task.title} · ${projects[task.id].focus}</p></div>
      </div>
      <div class="theory-body">
        <section><div class="theory-section-label">01 / ОСНОВА</div><p class="theory-lead">${task.theory[0]}</p><p class="theory-detail">${task.theory[1]}</p></section>
        <section><div class="theory-section-label">02 / ГЛУБЖЕ</div><ul>${(THEORY_EXPANDED[task.id]?.focus ?? task.theory.slice(2)).map(item => `<li>${item}</li>`).join('')}</ul></section>
        <section><div class="theory-section-label">03 / ТИПИЧНЫЕ ОШИБКИ</div><div class="theory-mistakes">${(THEORY_EXPANDED[task.id]?.mistakes ?? []).map((item, index) => `<div><span>0${index + 1}</span><p>${item}</p></div>`).join('')}</div></section>
        <section><div class="theory-section-label">04 / САМОПРОВЕРКА</div><ul class="theory-checklist">${(THEORY_EXPANDED[task.id]?.check ?? []).map(item => `<li>${item}</li>`).join('')}</ul></section>
        <section class="theory-check"><div><div class="theory-section-label">05 / ПЕРЕД ПРАКТИКОЙ</div><p>Уменьшите макет, уберите второстепенное и проверьте, считывается ли главный замысел за несколько секунд. Затем соберите собственное решение на рабочем поле.</p></div><button class="primary-button" data-start-theory="${task.id}">ПОПРОБОВАТЬ ${uiIcon('forward')}</button></section>
      </div>
    </div>`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('visible'))
  const close = () => { overlay.classList.remove('visible'); window.setTimeout(() => overlay.remove(), 220) }
  wireAccessibleDialog(overlay, overlay.querySelector<HTMLElement>('.theory-modal')!, close)
  overlay.querySelector<HTMLElement>('[data-start-theory]')?.addEventListener('click', () => { close(); openTask(task) })
}

function wireAccessibleDialog(overlay: HTMLElement, dialog: HTMLElement, onClose: () => void) {
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const title = dialog.querySelector<HTMLElement>('h1, h2, h3')
  if (title) {
    if (!title.id) title.id = `dialog-title-${Math.random().toString(36).slice(2, 9)}`
    dialog.setAttribute('aria-labelledby', title.id)
  }
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.tabIndex = -1
  let closing = false
  const close = () => {
    if (closing) return
    closing = true
    onClose()
    window.setTimeout(() => { if (opener?.isConnected) opener.focus() }, 240)
  }
  overlay.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target.closest('[data-close]') : null
    if (target && dialog.contains(target)) { event.preventDefault(); close(); return }
    if (event.target === overlay) close()
  })
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return }
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'))
      .filter(element => element.offsetWidth > 0 || element.offsetHeight > 0)
    if (!focusable.length) { event.preventDefault(); dialog.focus(); return }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus() }
  })
  requestAnimationFrame(() => (dialog.querySelector<HTMLElement>('[data-close]') ?? dialog).focus())
}

async function exportPoster() {
  if (exportBusy) return
  const poster = app.querySelector<HTMLElement>('[data-poster]')
  if (!poster) return
  exportBusy = true
  const button = app.querySelector<HTMLButtonElement>('[data-action="export"]')
  if (button) button.disabled = true
  notify('Готовим PNG…')
  let clone: HTMLElement | undefined
  let exportHost: HTMLElement | undefined
  try {
    await document.fonts.ready
    fitTextBoxes()
    clone = poster.cloneNode(true) as HTMLElement
    clone.classList.remove('show-grid')
    clone.classList.add('export-artboard')
    clone.querySelectorAll('.resize-handle, .poster-info').forEach(node => node.remove())
    clone.querySelectorAll('.selected').forEach(node => node.classList.remove('selected'))
    clone.style.setProperty('transform', 'none', 'important')
    clone.style.setProperty('position', 'relative', 'important')
    clone.style.setProperty('left', '0', 'important')
    clone.style.setProperty('top', '0', 'important')
    exportHost = document.createElement('div')
    exportHost.style.cssText = 'position:fixed;left:-10000px;top:0;width:660px;height:930px;pointer-events:none'
    exportHost.setAttribute('aria-hidden','true')
    exportHost.appendChild(clone)
    document.body.appendChild(exportHost)
    const blob = await toBlob(clone, {width:660, height:930, pixelRatio:2, backgroundColor:posterBackground,
      style:{position:'relative',left:'0',top:'0',transform:'none',boxShadow:'none',border:'none',borderRadius:'0'}})
    if (!blob) throw new Error('Empty image')
    const url = URL.createObjectURL(blob)
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay visible export-overlay'
    overlay.innerHTML = `<section class="export-preview" role="dialog" aria-modal="true" aria-label="Предпросмотр PNG">
      <button class="modal-close" data-close aria-label="Закрыть">${uiIcon('close')}</button>
      <div class="card-kicker">ГОТОВО К СОХРАНЕНИЮ</div><h2>Ваш плакат.</h2>
      <p>PNG · 1320 × 1860 px · объекты за краями обрезаны по формату.</p>
      <img src="${url}" alt="Готовый PNG плаката">
      <a class="primary-button" href="${url}" download="tochka-sborki-${selectedTask.id}.png">СКАЧАТЬ PNG ${uiIcon('forward')}</a>
    </section>`
    document.body.appendChild(overlay)
    const close = () => { overlay.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 30000) }
    wireAccessibleDialog(overlay, overlay.querySelector<HTMLElement>('.export-preview')!, close)
    overlay.querySelector<HTMLAnchorElement>('a')?.focus()
  } catch { notify('Не удалось подготовить PNG. Проверьте загруженные изображения и попробуйте ещё раз') }
  finally { exportHost?.remove(); clone?.remove(); exportBusy = false; if (button) button.disabled = false }
}

type AiReview = {summary:string;strengths:string[];recommendations:string[]}
type AiReviewState = 'ready' | 'not-configured' | 'unavailable' | 'limited' | 'source'

async function capturePosterForReview() {
  const poster=app.querySelector<HTMLElement>('[data-poster]')
  if(!poster)return null
  await document.fonts.ready
  const clone=poster.cloneNode(true) as HTMLElement
  clone.classList.remove('show-grid','accepting-material')
  clone.querySelectorAll('.resize-handle,.poster-info').forEach(node=>node.remove())
  clone.querySelectorAll('.selected').forEach(node=>node.classList.remove('selected'))
  clone.style.cssText+=';width:660px!important;height:930px!important;position:relative!important;left:0!important;top:0!important;transform:none!important;zoom:1!important;box-shadow:none!important;border:0!important;border-radius:0!important'
  const host=document.createElement('div')
  host.style.cssText='position:fixed;left:-10000px;top:0;width:660px;height:930px;pointer-events:none;overflow:hidden'
  host.setAttribute('aria-hidden','true');host.appendChild(clone);document.body.appendChild(host)
  try{return await toBlob(clone,{width:660,height:930,pixelRatio:1,backgroundColor:posterBackground,style:{position:'relative',left:'0',top:'0',transform:'none',boxShadow:'none',border:'none',borderRadius:'0'}})}
  finally{host.remove()}
}

async function blobToDataUrl(blob:Blob) {
  return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error('Image conversion failed'));reader.onerror=()=>reject(reader.error??new Error('Image conversion failed'));reader.readAsDataURL(blob)})
}

async function checkWork() {
  if(checkBusy)return
  checkBusy=true
  const button=app.querySelector<HTMLButtonElement>('[data-action="check"]')
  if(button){button.disabled=true;button.dataset.originalLabel=button.textContent??'';button.textContent='СМОТРИМ МАКЕТ…'}
  let previewUrl=''
  let aiReview:AiReview|null=null
  let aiState:AiReviewState='unavailable'
  let aiErrorNote=''
  try{
    const starter=starterFor(selectedTask.id,makeInitialObjects())
    const result=evaluateProject(selectedTask.id,objects,starter,posterBackground,[makeInitialObjects(),makeBaseObjects(selectedTask.id)])
    saveDraft()
    let blob:Blob|null=null
    try{blob=await capturePosterForReview();if(blob)previewUrl=URL.createObjectURL(blob)}catch{ /* local criteria still work if image rendering fails */ }
    if(blob&&result.unchanged){
      aiState='source'
    }else if(blob){
      try{
        const image=await blobToDataUrl(blob)
        const project=projects[selectedTask.id]
        const response=await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(50_000),body:JSON.stringify({taskId:selectedTask.id,brief:`${project.objective}\nФокус: ${project.focus}\nОбязательный текст: ${project.requiredCopy.join(' · ')}\nОграничения: ${project.constraints.join(' · ')}`,image})})
        const data=await response.json().catch(()=>({})) as {review?:Partial<AiReview>;error?:string;retryAfter?:number}
        if(data.error==='ai_not_configured'){aiState='not-configured'}
        else if(response.status===429){aiState='limited';aiErrorNote=data.error==='rate_limited'?`Следующий ИИ-разбор доступен через ${data.retryAfter||15} с. Проверка условий уже выполнена.`:data.error==='daily_limit'?'На сегодня использованы 8 ИИ-разборов. Проверка условий продолжает работать.':data.error==='daily_provider_limit'?'Бесплатная квота Cloudflare на сегодня исчерпана. ИИ снова заработает после её обновления. Проверка условий продолжает работать.':'ИИ-сервис занят. Проверка условий продолжает работать.'}
        else if(response.ok){if(data.review&&typeof data.review.summary==='string'){aiReview={summary:data.review.summary,strengths:Array.isArray(data.review.strengths)?data.review.strengths:[],recommendations:Array.isArray(data.review.recommendations)?data.review.recommendations:[]};aiState='ready'}}
        else aiState='unavailable'
      }catch{aiState='unavailable'}
    }
    if(result.passed&&result.score>selectedTask.score){selectedTask.score=result.score;saveScores()}
    showCheckModal(result,previewUrl,aiReview,aiState,aiErrorNote)
  }catch{
    if(previewUrl)URL.revokeObjectURL(previewUrl)
    notify('Не удалось завершить проверку. Макет сохранён — попробуйте ещё раз')
  }finally{
    checkBusy=false
    if(button){button.disabled=false;button.innerHTML=`Проверить ${uiIcon('forward')}`;delete button.dataset.originalLabel}
  }
}

function showCheckModal(result:Evaluation,previewUrl:string,aiReview:AiReview|null,aiState:AiReviewState,aiErrorNote='') {
  const overlay=document.createElement('div')
  overlay.className='modal-overlay result-overlay'
  const recommendations=aiReview?aiReview.recommendations:result.recommendations
  const strengths=aiReview?aiReview.strengths:result.strengths
  const aiLabel=aiState==='ready'?'ИИ-РАЗБОР ГОТОВ':aiState==='not-configured'?'ИИ НЕ ПОДКЛЮЧЁН':aiState==='source'?'ИИ-РАЗБОР ПОСЛЕ ПРАВОК':'ПРОВЕРКА ПО КРИТЕРИЯМ'
  const aiNote=aiErrorNote||(aiState==='not-configured'?'Доступна самостоятельная проверка по условиям задания. Развёрнутый ИИ-разбор пока не подключён.':aiState==='unavailable'?'ИИ-разбор временно недоступен. Проверка условий задания работает независимо от него.':aiState==='source'?'ИИ-разбор появится после самостоятельной переработки макета. Исходная версия не оценивается.':'Проверка по учебным критериям дополняет визуальный разбор.')
  overlay.innerHTML=`<section class="result-modal" aria-label="Результат работы">
    <header class="result-head"><div><div class="modal-kicker">ЗАДАНИЕ ${selectedTask.number} · ${escapeHtml(selectedTask.title.toUpperCase())}</div><h2>${result.passed?'Задание выполнено.':result.unchanged?'Это исходный макет.':'Задание пока не зачтено.'}</h2></div><button class="modal-close" data-close aria-label="Закрыть">${uiIcon('close')}</button></header>
    <div class="result-grid">
      <div class="result-poster-wrap">${previewUrl?`<img class="result-poster" src="${previewUrl}" alt="Предпросмотр готового макета">`:`<div class="result-poster-fallback">Предпросмотр макета недоступен</div>`}<a class="result-download" ${previewUrl?`href="${previewUrl}" download="tochka-sborki-${selectedTask.id}.png"`:'aria-disabled="true"'}>Скачать макет PNG ${uiIcon('forward')}</a></div>
      <div class="result-report"><div class="result-score-line"><div class="score-ring"><span>${result.unchanged?'—':result.score}</span><small>/100</small></div><div><div class="result-status ${result.passed?'is-pass':''}">${result.passed?'ЗАДАНИЕ ЗАЧТЕНО':'НЕ ЗАЧТЕНО'}</div><p>${result.passed?'Результат сохранён в прогрессе.':'В прогресс не засчитано. Выполните условия ниже и проверьте снова.'}</p></div></div>
        ${!result.passed?`<div class="submission-blockers"><strong>Что мешает зачёту</strong><ul>${result.blockers.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><p>${result.unchanged?'Исходник не получает итоговую оценку. Критерии ниже показывают, что предстоит сделать.':'Баллы показывают состояние макета. Пока обязательные условия не выполнены, итог ограничен 69 баллами.'}</p></div>`:''}
        <section class="result-section"><div class="result-section-title">ПРОВЕРКА УСЛОВИЙ ЗАДАНИЯ</div><div class="analysis-list">${result.items.map(item=>`<div class="analysis-row ${item.points===20?'good':'warn'}">${uiIcon(item.points===20?'check':'warning')}<strong>${escapeHtml(item.label)}</strong><b>${item.points}/20</b><small>${escapeHtml(item.detail)}</small></div>`).join('')}</div></section>
        <section class="result-section result-feedback"><div class="result-section-title"><span>${aiLabel}</span><span class="ai-spark">${uiIcon('sparkles')}</span></div>${aiReview?`<p class="ai-summary">${escapeHtml(aiReview.summary)}</p>`:`<p class="ai-status-note">${escapeHtml(aiNote)}</p>`}${strengths.length?`<div class="feedback-strengths"><b>Что уже работает</b>${strengths.slice(0,3).map(item=>`<span>${uiIcon('check')}${escapeHtml(item)}</span>`).join('')}</div>`:''}<div class="feedback-recommendations"><b>Следующие улучшения</b>${recommendations.slice(0,5).map((item,index)=>`<div><i>${String(index+1).padStart(2,'0')}</i><span>${escapeHtml(item)}</span></div>`).join('')}</div></section>
        <div class="result-actions"><button class="secondary-button" data-close>Продолжить в редакторе</button>${result.passed?`<button class="primary-button" data-finish>К заданиям ${uiIcon('forward')}</button>`:''}</div>
      </div>
    </div>
  </section>`
  document.body.appendChild(overlay)
  requestAnimationFrame(()=>overlay.classList.add('visible'))
  const dialog=overlay.querySelector<HTMLElement>('.result-modal')!
  wireAccessibleDialog(overlay,dialog,()=>{overlay.classList.remove('visible');window.setTimeout(()=>overlay.remove(),240);if(previewUrl)window.setTimeout(()=>URL.revokeObjectURL(previewUrl),30_000)})
  overlay.querySelector<HTMLElement>('[data-finish]')?.addEventListener('click',()=>{
    if(!result.passed)return
    overlay.classList.remove('visible');window.setTimeout(()=>overlay.remove(),240);if(previewUrl)window.setTimeout(()=>URL.revokeObjectURL(previewUrl),30_000)
    screen='tasks';selectedId=null;render()
  })
}

injectIconOverrides()
render()
mountAiChat()


