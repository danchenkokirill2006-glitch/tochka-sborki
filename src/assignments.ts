export type DesignObject = {
  id: string
  type: 'text' | 'photo' | 'date' | 'shape'
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  text?: string
  fontSize?: number
  fontWeight?: number
  fontFamily?: string
  color?: string
  background?: string
  imageSrc?: string
  radius?: number
  opacity?: number
  fit?: 'cover' | 'contain'
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  assetId?: string
  materialKind?: 'photo' | 'graphic' | 'logo'
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right'
}

export type Project = {
  client: string
  deliverable: string
  audience: string
  headline: string
  date: string
  venue: string
  focus: string
  guidance: string[]
  objective: string
  requiredCopy: string[]
  constraints: string[]
  palette?: string[]
}

export const projects: Record<string, Project> = {
  composition: {
    client: 'Галерея современного искусства «Контур»',
    deliverable: 'Афиша выставки «Город форм» · A3, вертикально',
    audience: 'Горожане, студенты и молодые дизайнеры',
    headline: 'ГОРОД ФОРМ', date: '18–30 октября', venue: 'Галерея «Контур»',
    focus: 'Одна ясная доминанта, выразительный масштаб и воздух вокруг неё',
    objective: 'Собрать музейную афишу выставки современной графики. Архитектурный образ ведёт взгляд, типографика сообщает, что и где происходит.',
    requiredCopy: ['ГОРОД ФОРМ', 'Выставка современной графики', '18–30 октября', 'Галерея «Контур»', 'пр. Ленина, 42', 'Вход свободный'],
    constraints: ['Сохраните вертикальный формат и поля не меньше 24 px.', 'У афиши одна главная точка внимания.', 'Не перекрывайте фотографию текстом без причины.'],
    guidance: ['Выберите доминанту: архитектурная фотография или крупный заголовок.', 'Поддержите её двумя-тремя визуальными массами, не делая их равными по весу.', 'Оставьте чистое поле для даты и адреса; проверьте порядок чтения в миниатюре.'],
  },
  hierarchy: {
    client: 'Школа визуальных коммуникаций Forma Studio',
    deliverable: 'Афиша мастер-класса «Типографика без хаоса» · A3',
    audience: 'Начинающие дизайнеры и студенты творческих направлений',
    headline: 'ТИПОГРАФИКА БЕЗ ХАОСА', date: '24 октября · 19:00', venue: 'Точка кипения',
    focus: 'Не менее четырёх уровней: тема, формат, спикер, детали',
    objective: 'Сделать из насыщенного набора информации приглашение, которое понятно с первого взгляда и не превращается в одинаково громкий список.',
    requiredCopy: ['ТИПОГРАФИКА БЕЗ ХАОСА', 'Практический мастер-класс', 'Анна Власова', 'арт-директор Forma Studio', '24 октября', '19:00', 'Точка кипения', 'пр. Социалистический, 68', 'Регистрация бесплатная'],
    constraints: ['Постройте минимум четыре уровня типографической важности.', 'Сохраните читаемыми дату, время и место.', 'Не используйте более двух гарнитур одновременно.'],
    guidance: ['Поставьте тему выше формата, а спикера выше служебной информации.', 'Дайте дате и времени отдельный компактный блок.', 'Проверьте афишу на маленьком размере: сначала должно читаться название.'],
  },
  balance: {
    client: 'Концертная площадка «Сцена 12»',
    deliverable: 'Ночной постер электронного концерта · A3',
    audience: 'Любители электронной музыки 18–35 лет',
    headline: 'НОЧЬ МУЗЫКИ', date: '31 октября · 22:00', venue: 'Сцена 12',
    focus: 'Асимметрия и равновесие визуального веса без зеркальной симметрии',
    objective: 'Собрать выразительный постер клубной ночи: крупный световой или фотографический акцент уравновешивается типографикой и свободным тёмным пространством.',
    requiredCopy: ['НОЧЬ МУЗЫКИ', 'RADIUS / NEON / KOSMO / AURA', '31 октября', '22:00', 'Сцена 12', 'Electronic / House / Ambient'],
    constraints: ['Оставьте тёмные зоны для спокойного чтения.', 'Не используйте больше двух акцентных оттенков.', 'Не закрывайте лицо артиста и дату.'],
    guidance: ['Сместите главную фотографию или световой объект в сторону.', 'Ответьте на крупную массу компактной группой имён или световым пятном.', 'Оцените устойчивость по общему весу, а не числу объектов.'],
  },
  rhythm: {
    client: 'Городской фестиваль «Ритм города»',
    deliverable: 'Фестивальный постер · два дня программы · A3',
    audience: 'Молодая городская аудитория и гости парка',
    headline: 'РИТМ ГОРОДА', date: '12–13 июля', venue: 'Парк Центральный',
    focus: 'Повтор, интервал, чередование и одно осознанное нарушение ритма',
    objective: 'Создать ощущение движения и насыщенной городской программы через повторяющиеся графические мотивы и фотографию фестиваля.',
    requiredCopy: ['РИТМ ГОРОДА', '12–13 июля', 'Парк Центральный', 'Музыка', 'Дизайн', 'Маркет', 'Стрит-арт'],
    constraints: ['Используйте один повторяющийся мотив как связующую систему.', 'Сделайте один заметный сбой ритма.', 'Сохраните дату и название площадки читаемыми.'],
    guidance: ['Выберите шаг повторения: форма, цвет, направление или интервалы.', 'Повторите один мотив 5–6 раз с одинаковым интервалом. Затем измените один элемент и сравните результат.', 'Нарушьте последовательность один раз, чтобы создать акцент.'],
  },
  color: {
    client: 'Местные производители и парк «Изумрудный»',
    deliverable: 'Афиша летнего маркета · A3',
    audience: 'Семьи, горожане и любители локальных продуктов',
    headline: 'ЛЕТНИЙ МАРКЕТ', date: '20–21 июля · 11:00–20:00', venue: 'Парк «Изумрудный»',
    focus: 'Ограниченная палитра, роли оттенков и достаточный светлотный контраст',
    objective: 'Собрать тёплый летний постер, в котором растения, продукты и ремесленные материалы складываются в спокойную цельную палитру.',
    requiredCopy: ['ЛЕТНИЙ МАРКЕТ', '20–21 июля', '11:00–20:00', 'Локальные бренды', 'Еда', 'Растения', 'Музыка', 'Парк «Изумрудный»'],
    constraints: ['Основные цвета: #F4F1E8, #263D2B, #E8A83E, #D7694D, #161616.', 'Оставьте не более четырёх цветов активными одновременно.', 'Важный текст должен контрастировать с подложкой.'],
    palette: ['#F4F1E8', '#263D2B', '#E8A83E', '#D7694D', '#161616'],
    guidance: ['Назначьте каждой краске роль: фон, текст, акцент или поддержка.', 'Начните с двух основных цветов и одного акцента. Фотография необязательна: цвет может работать через типографику и формы.', 'Проверьте контраст текста на каждом выбранном фоне.'],
  },
  grid: {
    client: 'Сообщество дизайнеров Барнаула',
    deliverable: 'Информационный постер конференции Design Day 2027 · A3',
    audience: 'Дизайнеры, студенты, специалисты цифровых продуктов',
    headline: 'DESIGN DAY 2027', date: '25 апреля', venue: 'Молодёжный центр',
    focus: 'Модульная сетка 6 × 8, единые поля и ясная структура расписания',
    objective: 'Сверстать насыщенную афишу события с несколькими спикерами и расписанием. Все блоки читаются как одна информационная система.',
    requiredCopy: ['DESIGN DAY 2027', 'Конференция о дизайне, технологиях и визуальной культуре', '11:00 · Digital product design', '13:00 · New visual culture', '15:00 · AI and design', '17:00 · Карьера дизайнера', '25 апреля', 'Барнаул', 'Молодёжный центр', 'design-day.ru'],
    constraints: ['Формат сетки — 6 × 8 модулей.', 'Сохраните минимум 24 px безопасного поля.', 'Все четыре пункта расписания должны различаться и читаться.'],
    guidance: ['Включите сетку и сначала задайте поля и колонки.', 'Разместите заголовок, фотографии спикеров и программу по общей системе.', 'Разрешите одному акценту выйти из сетки, сохранив общий порядок.'],
  },
}

const studioGuidance: Record<string,string[]> = {
  composition: ['Сделайте два варианта: в первом взгляд ведёт заголовок, во втором — изображение. Меняйте масштаб и расположение, сохраняя весь текст.', 'Посмотрите на каждый вариант в масштабе 25%. Название, даты и место должны находиться без поиска.', 'Выберите один вариант. Уберите элемент, без которого идея остаётся понятной. Сохраните итоговую афишу.'],
  hierarchy: ['Выстройте порядок чтения: тема → формат → спикер → дата и место. Не делайте все строки жирными.', 'Ограничьтесь одной гарнитурой и тремя основными размерами. Длинную должность разбейте по смыслу.', 'Уменьшите макет. За три секунды должны считываться тема и дата; остальные сведения — при внимательном чтении.'],
  balance: ['Переместите фотографию к одному краю. На противоположной стороне соберите имена артистов в компактную группу.', 'Сравните визуальный вес: яркое небольшое пятно может уравновесить большое тёмное. Центрировать все элементы не требуется.', 'Проверьте название и время на тёмном фоне. Оставьте пустой участок, чтобы афиша не превратилась в сплошной шум.'],
  rhythm: ['Соберите ряд из пяти или шести одинаковых модулей. Сначала выровняйте интервалы, затем измените один модуль.', 'Повторите выбранный шаг в типографике: программа и даты должны поддерживать ритм, а не спорить с ним.', 'Сравните ровный повтор и вариант с одним сбоем. Выберите тот, в котором акцент помогает найти важную информацию.'],
  color: ['Выберите три цвета из палитры: светлый фон, тёмный текст и один акцент. Остальные пока не используйте.', 'Сделайте второй вариант с другим акцентом. Сравните настроение, не меняя расположение объектов.', 'Оставьте более убедительный вариант. Проверьте мелкий текст: цвет не должен быть единственным способом выделить дату.'],
  grid: ['Включите сетку. Привяжите название, изображение, описание и программу к общим вертикалям.', 'Выберите один интервал для строк программы. Время и название доклада должны образовать повторяемую структуру.', 'Скройте сетку и проверьте порядок чтения. Если выравнивание распадается без линий, исправьте края блоков.'],
}
Object.entries(studioGuidance).forEach(([id,guidance]) => { projects[id].guidance=guidance })
export function starterFor(_id: string, source: DesignObject[]): DesignObject[] {
  // Keep the assignment-specific authored starter intact; draft normalization handles older saved projects.
  return source.map(item => ({ ...item }))
}

export type Criterion = { label: string; points: number; detail: string }
export type Evaluation = { score: number; passed: boolean; items: Criterion[]; next: string; strengths: string[]; recommendations: string[] }

const normalize = (value: string) => value.toLocaleUpperCase('ru').replace(/[«»"“”]/g, '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
const boundsInside = (item: DesignObject) => {
  const radians = (item.rotation * Math.PI) / 180
  const width = Math.abs(item.width * Math.cos(radians)) + Math.abs(item.height * Math.sin(radians))
  const height = Math.abs(item.width * Math.sin(radians)) + Math.abs(item.height * Math.cos(radians))
  const left = item.x + (item.width - width) / 2
  const top = item.y + (item.height - height) / 2
  return left >= 24 && top >= 24 && left + width <= 636 && top + height <= 906
}
const overlap = (a: DesignObject, b: DesignObject) => Math.max(0, Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)) * Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y))

function brightness(hex: string) {
  const raw = hex.replace('#','')
  if (!/^[0-9a-f]{6}$/i.test(raw)) return .5
  const rgb = [0,2,4].map(offset => parseInt(raw.slice(offset,offset+2),16)/255)
  const channels = rgb.map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4)
  return channels[0]*.2126 + channels[1]*.7152 + channels[2]*.0722
}

function taskCriterion(id: string, objects: DesignObject[], background: string): Criterion {
  const text = objects.filter(item => item.type === 'text' || item.type === 'date')
  const visuals = objects.filter(item => item.type === 'shape' || item.type === 'photo')
  switch (id) {
    case 'hierarchy': {
      const sizes = text.map(item => item.fontSize ?? 16).sort((a,b)=>b-a)
      const levels = new Set(sizes.map(size => Math.round(size / 8)))
      const clear = sizes.length >= 4 && sizes[0] / Math.max(1, sizes[1]) >= 1.35 && levels.size >= 3
      return { label:'Иерархия · 4 уровня', points: clear ? 20 : sizes.length >= 3 && levels.size >= 3 ? 14 : 7, detail: clear ? 'Тема, формат, спикер и детали различаются по визуальному весу.' : 'Разведите тему, формат, спикера и служебные детали по размеру, весу или контрасту.' }
    }
    case 'balance': {
      const largest = [...visuals].sort((a,b)=>b.width*b.height-a.width*a.height)[0]
      const offCenter = largest ? Math.abs(largest.x+largest.width/2-330) > 65 : false
      const counterweight = objects.some((item) => item !== largest && Math.abs(item.x+item.width/2-330) > 90)
      return { label:'Асимметричный баланс', points: offCenter && counterweight ? 20 : offCenter || counterweight ? 13 : 7, detail: offCenter && counterweight ? 'Крупная масса смещена, а контрастные детали удерживают равновесие.' : 'Сместите доминанту и уравновесьте её меньшей группой, направлением или свободным полем.' }
    }
    case 'rhythm': {
      const shapes = visuals.filter(item => item.type === 'shape' || item.imageSrc?.includes('rhythm'))
      const sizes = new Set(shapes.map(item => Math.round(item.width/20)))
      const positions = new Set(shapes.map(item => Math.round(item.x/24)))
      const variety = sizes.size >= 2 || positions.size >= 3
      return { label:'Ритм · повтор и сбой', points: shapes.length >= 5 && variety ? 20 : shapes.length >= 3 ? 14 : 7, detail: shapes.length >= 5 && variety ? 'Повтор считывается, элементы меняют масштаб или шаг.' : 'Соберите серию из пяти мотивов, выдержите интервал и один мотив измените.' }
    }
    case 'color': {
      const colors = new Set([background, ...objects.filter(item => item.type === 'shape').map(item => item.background), ...text.map(item => item.color)].filter((color):color is string=>typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color)))
      const palette = projects.color.palette ?? []
      const familiar = [...colors].every(color => palette.some(value => value.toLowerCase() === String(color).toLowerCase()))
      return { label:'Цветовая система', points: colors.size >= 2 && colors.size <= 4 && familiar ? 20 : colors.size >= 2 && colors.size <= 4 ? 15 : 7, detail: colors.size <= 4 && familiar ? 'Цвета взяты из заданной палитры и работают как система.' : 'Ограничьте палитру четырьмя оттенками и назначьте им отдельные роли.' }
    }
    case 'grid': {
      const aligned = objects.filter(item => [55,250,445].some(line => Math.abs(item.x-line) <= 16)).length
      const positions = new Set(objects.map(item => Math.round(item.x/24)))
      return { label:'Модульная сетка 6 × 8', points: aligned >= 6 ? 20 : aligned >= 4 || positions.size >= 4 ? 14 : 7, detail: aligned >= 6 ? 'Блоки держат несколько общих колонок и поля.' : 'Соберите блоки по трём и более общим колонкам с едиными полями.' }
    }
    default: {
      const largest = [...visuals].sort((a,b)=>b.width*b.height-a.width*a.height)[0]
      const focal = Boolean(largest && largest.width*largest.height >= 30000 && visuals.length >= 1)
      return { label:'Композиционный центр', points: focal ? 20 : visuals.length >= 2 ? 14 : 7, detail: focal ? 'Выстроена крупная доминанта и поддерживающие её визуальные массы.' : 'Выберите главную доминанту и поддержите её несколькими меньшими элементами.' }
    }
  }
}

export function evaluateProject(id: string, objects: DesignObject[], initial: DesignObject[], background: string): Evaluation {
  const project = projects[id] ?? projects.composition
  const textObjects = objects.filter(item => item.type === 'text' || item.type === 'date')
  const visualObjects = objects.filter(item => item.type === 'shape' || item.type === 'photo')
  const copy = normalize(textObjects.map(item => item.text ?? '').join(' '))
  const found = project.requiredCopy.filter(value => copy.includes(normalize(value)))
  const missing = project.requiredCopy.filter(value => !copy.includes(normalize(value)))
  const infoPoints = Math.round(20 * found.length / Math.max(1, project.requiredCopy.length))
  const outside = textObjects.filter(item => !boundsInside(item)).length
  const small = textObjects.filter(item => (item.fontSize ?? 16) < 12).length
  const textCollisions = textObjects.reduce((count, item, index) => count + (textObjects.slice(index+1).some(other => overlap(item,other) > Math.min(item.width*item.height,other.width*other.height)*.2) ? 1 : 0), 0)
  const lowContrast = textObjects.filter(item => {
    const foreground = brightness(item.color ?? '#111111')
        const index=objects.indexOf(item)
    const backingShape=objects.slice(0,index).reverse().find(candidate=>candidate.type==='shape' && candidate.x<=item.x && candidate.y<=item.y && candidate.x+candidate.width>=item.x+item.width && candidate.y+candidate.height>=item.y+item.height && (candidate.opacity??1)>=.95)
    const backing = brightness(backingShape?.background ?? background)
    return (Math.max(foreground,backing)+.05)/(Math.min(foreground,backing)+.05) < 3.2
  }).length
  const craftPoints = Math.max(0, 20 - outside*6 - small*3 - textCollisions*5 - lowContrast*2)
  const photos = objects.filter(item => item.type === 'photo' && Boolean(item.imageSrc)).length
  const usableVisuals = visualObjects.filter(item => item.width >= 20 && item.height >= 8 && item.x + item.width > 0 && item.y + item.height > 0 && item.x < 660 && item.y < 930).length
  const visualPoints = usableVisuals > 0 || textObjects.length >= 4 ? 20 : 8
  const baseline = new Map(initial.map(item => [item.id,item]))
  const changed = objects.filter(item => {
    const before = baseline.get(item.id)
    if (!before) return true
    return Math.abs(item.x-before.x) > 18 || Math.abs(item.y-before.y) > 18 || ((item.type === 'photo' || item.type === 'shape') && Math.abs(item.width-before.width) > 18) || ((item.type === 'photo' || item.type === 'shape') && Math.abs(item.height-before.height) > 18) || ((item.type === 'text' || item.type === 'date') && (item.text !== before.text || item.color !== before.color || Math.abs((item.fontSize??0)-(before.fontSize??0)) > 3 || item.fontFamily !== before.fontFamily || item.fontWeight !== before.fontWeight)) || (item.type === 'photo' && item.imageSrc !== before.imageSrc) || (item.type === 'shape' && item.background !== before.background) || Math.abs((item.rotation??0)-(before.rotation??0)) > 3
  }).length + initial.filter(item => !objects.some(current => current.id === item.id)).length
  const processPoints = changed >= 5 ? 20 : changed >= 3 ? 15 : changed >= 1 ? 10 : 4
  const specialized = taskCriterion(id,objects,background)
  const items = [
    {label:'Обязательная информация',points:infoPoints,detail:missing.length ? `Добавьте в макет: ${missing.slice(0,3).join(' · ')}${missing.length > 3 ? ' и ещё' : ''}.` : 'Все пункты брифа присутствуют.'},
    {label:'Читаемость и поля',points:craftPoints,detail:outside || small || textCollisions || lowContrast ? `За форматом: ${outside}; пересечения текста: ${textCollisions}; слабый контраст: ${lowContrast}.` : 'Текст находится в безопасных полях, контраст и порядок чтения сохранены.'},
    specialized,
    {label:'Визуальное решение',points:visualPoints,detail:photos ? 'Изображения присутствуют. Проверьте, что каждое поддерживает идею и не мешает чтению.' : 'Типографическое решение допустимо. Дополнительные изображения не обязательны.'},
    {label:'Авторская сборка',points:processPoints,detail:changed >= 3 ? `Вы заметно переработали ${changed} элементов исходного макета.` : 'Измените композицию и типографику исходного макета, чтобы найти собственное решение.'},
  ]
  const score = Math.round(items.reduce((sum,item)=>sum+item.points,0))
  const passed = score >= 70 && infoPoints >= 16 && craftPoints >= 10 && changed >= 1
  const strengths = items.filter(item => item.points >= 15).map(item => item.label)
  const recommendations = [
    ...(missing.length ? [`Добавьте ${missing.slice(0,2).join(' и ')} — зритель должен быстро получить всю информацию о событии.`] : []),
    ...(outside || textCollisions || lowContrast || small ? ['Проверьте поля и контраст: важная информация должна читаться в уменьшенной афише и при печати.'] : []),
    ...(specialized.points < 18 ? [specialized.detail] : []),
    ...(usableVisuals > 7 ? ['Проверьте, нужен ли каждый визуальный элемент: количество изображений не повышает оценку.'] : []),
    ...(changed < 5 ? ['Попробуйте ещё один вариант: переставьте главный визуал, измените масштаб заголовка и сравните маршрут взгляда.'] : []),
  ].slice(0,5)
  const next = recommendations[0] ?? (passed ? 'Сохраните PNG и подготовьте второй вариант с другим визуальным акцентом.' : 'Проверьте обязательные пункты брифа и критерии выше.')
  return { score, passed, items, next, strengths, recommendations }
}
