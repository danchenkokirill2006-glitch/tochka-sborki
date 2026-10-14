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
export const ASSIGNMENT_VERSION = 4
export const exerciseSpecs: Record<string, {problem:string; acceptance:string[]; directions:string[]}> = {
  composition: {problem:'В исходнике фотография и заголовок слишком малы: у афиши нет доминанты. Соберите выразительный первый план и спокойный информационный блок.',acceptance:['Название не мельче 40 px; оно или изображение становится доминантой.', 'Главная визуальная масса минимум в 1,5 раза крупнее следующей.', 'Переработаны минимум три элемента; весь обязательный текст читается.'],directions:['Крупная архитектурная фотография и компактная типографика.', 'Крупный заголовок и небольшая фотография как смысловой акцент.']},
  hierarchy: {problem:'Все текстовые блоки набраны почти одинаково. Превратите список сведений в приглашение с понятным порядком чтения.',acceptance:['Четыре различимых размера текста с разницей от 3 px; максимум две гарнитуры.', 'Тема минимум в 1,35 раза крупнее следующего уровня.', 'Тема, спикер, дата и адрес читаются без пересечений.'],directions:['Тема → имя спикера → формат → детали.', 'Тема → дата → спикер → служебная информация.']},
  balance: {problem:'Основная фотография стоит по центру. Постройте асимметричный постер и уравновесьте её группой текста с противоположной стороны.',acceptance:['Центр главного изображения смещён минимум на 65 px от оси.', 'Противовес расположен на другой стороне, а не рядом с изображением.', 'Название и дата остаются читаемыми; текст не лежит на фотографии.'],directions:['Изображение слева, имена артистов справа.', 'Изображение справа, типографическая группа слева.']},
  rhythm: {problem:'В ряду сбиты интервалы, размеры и акценты. Сначала создайте устойчивый повтор, затем нарушьте его ровно один раз.',acceptance:['Пять или шесть прямоугольных модулей в одном ряду или колонке.', 'Равные интервалы с допуском 10 px; одинаковые размеры с допуском 4 px.', 'Ровно один модуль отличается цветом; дата и место не перекрыты.'],directions:['Горизонтальная полоса с одним цветовым акцентом.', 'Вертикальная колонка повторов рядом с программой.']},
  color: {problem:'Текст и декоративная линия используют несогласованные цвета, дата теряется на светлом фоне. Соберите палитру с понятными ролями.',acceptance:['От двух до четырёх цветов из предложенной палитры, включая фон.', 'Мелкий текст: контраст от 4,5:1; крупный: от 3:1.', 'Изменены минимум три текстовых или графических элемента; цвета фотографии не учитываются.'],directions:['Светлый фон, зелёный текст и охристый акцент.', 'Тёмно-зелёный фон, светлый текст и тёплый акцент.']},
  grid: {problem:'Расписание и служебные блоки сдвинуты относительно общей сетки. Приведите макет к единой системе колонок и интервалов.',acceptance:['Сетка 6 × 8 внутри полей 24 px; шаг колонки 102 px.', 'Не менее 80% блоков начинаются на линиях сетки с допуском 6 px.', 'Четыре строки программы имеют общий левый край и равный шаг с допуском 8 px.'],directions:['Программа одной колонкой; изображение на несколько модулей.', 'Общая вертикаль для программы, отдельная колонка для места и контактов.']},
}
projects.hierarchy.constraints=['Постройте четыре уровня размера текста.', 'Используйте не более двух гарнитур.', 'Сохраните все сведения о событии.']
projects.hierarchy.guidance=['Выделите тему самым крупным размером.', 'Выберите ещё три размера для спикера, формата и деталей; между соседними размерами оставьте минимум 3 px.', 'Проверьте дату и адрес в уменьшенной афише, уберите наложения.']
projects.rhythm.guidance=['Выровняйте пять или шесть модулей в ряд либо колонку.', 'Задайте одинаковые размеры и интервалы. Выделите один модуль другим цветом.', 'Согласуйте расположение программы с повтором, сохранив все сведения.']
projects.rhythm.constraints=['Пять или шесть одинаковых по размеру модулей.', 'Ровно один цветовой акцент в ряду.', 'Равный интервал между модулями.']
projects.grid.guidance=['Включите сетку внутри полей 24 px. Начала колонок: 24, 126, 228, 330, 432, 534 px.', 'Выровняйте начала блоков, затем задайте одинаковый вертикальный шаг четырём строкам программы.', 'Скройте сетку и проверьте читаемость. Ширина блоков может занимать несколько колонок.']
projects.grid.constraints=['Поля 24 px, сетка 6 × 8 внутри них.', 'Общий левый край и равные интервалы строк программы.', 'Текст не перекрывает другие строки и фотографии.']

/** Deliberately unfinished exercises, not completed posters offered for submission. */
export function starterFor(id: string, source: DesignObject[]): DesignObject[] {
  const result=source.map(item=>({...item}))
  const change=(key:string,patch:Partial<DesignObject>)=>{const item=result.find(item=>item.id===key);if(item)Object.assign(item,patch)}
  if(id==='composition') {
    change('c-title',{fontSize:30,width:290,height:75,letterSpacing:0})
    change('c-photo',{x:238,y:380,width:180,height:150})
    change('c-sub',{x:95,y:257,width:500})
    change('c-date',{x:173,y:706})
  }
  if(id==='hierarchy') result.filter(item=>item.type==='text').forEach(item=>{item.fontSize=18;item.fontWeight=600;item.letterSpacing=0;item.lineHeight=1.2})
  if(id==='balance') {change('b-photo',{x:156,y:330,width:348,height:357});change('b-djs',{x:80,y:550,width:330,height:80,fontSize:17,text:'RADIUS / NEON /\nKOSMO / AURA'});change('b-date',{x:145})}
  if(id==='rhythm') result.filter(item=>item.id.startsWith('r-beat-')).forEach((item,i)=>Object.assign(item,{x:[48,139,249,337,440,554][i],width:[48,68,55,62,38,50][i],height:22,y:290,background:['#202a22','#e1623b','#202a22','#e1623b','#202a22','#202a22'][i]}))
  if(id==='color') {change('m-title',{color:'#69567d'});change('m-dates',{color:'#d5c8ac'});change('m-rule',{background:'#d7694d'});change('m-program',{color:'#374234'})}
  if(id==='grid') {change('g-schedule-a',{x:67,y:636});change('g-schedule-b',{x:89,y:682});change('g-schedule-c',{x:53,y:720});change('g-schedule-d',{x:103,y:773});change('g-intro',{x:61});change('g-venue',{x:73})}
  return result
}

export type Criterion = { label:string; points:number; detail:string }
export type Evaluation = {score:number;passed:boolean;items:Criterion[];next:string;strengths:string[];recommendations:string[];blockers:string[];unchanged:boolean}
const normalize=(value:string)=>value.toLocaleUpperCase('ru').replace(/[«»"“”]/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim()
const isText=(item:DesignObject)=>item.type==='text'||item.type==='date'
const visible=(item:DesignObject)=>(item.opacity??1)>=.5&&item.width>=8&&item.height>=8&&item.x+item.width>24&&item.y+item.height>24&&item.x<636&&item.y<906
const overlap=(a:DesignObject,b:DesignObject)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y))
const area=(item:DesignObject)=>Math.min(660,item.width)*Math.min(930,item.height)
const color=(value:string|undefined,fallback:string)=>String(value??fallback).toLowerCase()
function boundsInside(item:DesignObject) {
  const r=(item.rotation??0)*Math.PI/180,w=Math.abs(item.width*Math.cos(r))+Math.abs(item.height*Math.sin(r)),h=Math.abs(item.width*Math.sin(r))+Math.abs(item.height*Math.cos(r))
  const x=item.x+(item.width-w)/2,y=item.y+(item.height-h)/2
  return x>=23&&y>=23&&x+w<=637&&y+h<=907
}
function brightness(hex:string) {
  const raw=hex.replace('#','');if(!/^[0-9a-f]{6}$/i.test(raw))return .5
  const rgb=[0,2,4].map(i=>parseInt(raw.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4)
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722
}
const ratio=(a:string,b:string)=>{const x=brightness(a),y=brightness(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function differs(a:DesignObject,b:DesignObject) {
  if(a.type!==b.type)return true
  if(Math.abs(a.x-b.x)>18||Math.abs(a.y-b.y)>18||Math.abs((a.rotation??0)-(b.rotation??0))>4)return true
  if(isText(a))return normalize(a.text??'')!==normalize(b.text??'')||Math.abs((a.fontSize??24)-(b.fontSize??24))>3||Math.abs((a.fontWeight??700)-(b.fontWeight??700))>=150||color(a.color,'#111111')!==color(b.color,'#111111')||(a.fontFamily??'Manrope')!==(b.fontFamily??'Manrope')||Math.abs((a.letterSpacing??0)-(b.letterSpacing??0))>1.5
  return Math.abs(a.width-b.width)>18||Math.abs(a.height-b.height)>18||(a.type==='shape'&&color(a.background,'#8b5cf6')!==color(b.background,'#8b5cf6'))||(a.type==='photo'&&(a.assetId&&b.assetId?a.assetId!==b.assetId:a.imageSrc!==b.imageSrc))
}
/** IDs, layer names, default normalization and text auto-height are not creative changes. */
export function meaningfulChanges(objects:DesignObject[],initial:DesignObject[]) {
  const pool=[...initial];let changed=0
  for(const item of objects.filter(visible)) {
    let index=pool.findIndex(before=>!differs(item,before))
    if(index>=0){pool.splice(index,1);continue}
    index=pool.findIndex(before=>before.id===item.id)
    if(index<0)index=pool.findIndex(before=>before.type===item.type&&(isText(item)?normalize(before.text??'')===normalize(item.text??''):item.assetId?before.assetId===item.assetId:before.name===item.name))
    if(index>=0)pool.splice(index,1)
    changed++
  }
  // Removing a layer does not by itself demonstrate the target skill.
  return changed
}
function taskCriterion(id:string,objects:DesignObject[],background:string):Criterion {
  const text=objects.filter(isText),visuals=objects.filter(item=>!isText(item)&&item.materialKind!=='logo'&&area(item)>2500)
  const title=text.find(item=>normalize(item.text??'')===normalize(projects[id].headline))
  if(id==='hierarchy') {
    const sizes=[...new Set(text.map(item=>item.fontSize??16))].sort((a,b)=>b-a),levels=sizes.filter((v,i)=>i===0||sizes[i-1]-v>=3)
    const clear=!!title&&title.fontSize===sizes[0]&&sizes[0]/Math.max(1,sizes[1]??sizes[0])>=1.35&&levels.length>=4&&new Set(text.map(item=>item.fontFamily??'Manrope')).size<=2
    return {label:'Четыре уровня иерархии',points:clear?20:levels.length>=3?12:4,detail:clear?'Тема доминирует; четыре размера различаются, гарнитуры согласованы.':'Задайте четыре размера с разницей от 3 px. Тема — минимум в 1,35 раза крупнее следующего уровня; не более двух гарнитур.'}
  }
  if(id==='balance') {
    const main=[...visuals].sort((a,b)=>area(b)-area(a))[0],side=main?(main.x+main.width/2-330):0
    const opposite=objects.filter(item=>item!==main&&(item.x+item.width/2-330)*side<0&&Math.abs(item.x+item.width/2-330)>65&&area(item)>2500)
    const clear=Math.abs(side)>=65&&opposite.length>=2
    return {label:'Асимметрия и противовес',points:clear?20:Math.abs(side)>=65?12:4,detail:clear?'Основная масса смещена; на противоположной стороне есть группа-противовес.':'Сместите центр основного изображения минимум на 65 px и соберите минимум два заметных элемента с противоположной стороны.'}
  }
  if(id==='rhythm') {
    const shapes=objects.filter(item=>item.type==='shape'&&item.width>=16&&item.height>=12)
    const horizontal=shapes.length>1&&Math.max(...shapes.map(v=>v.y))-Math.min(...shapes.map(v=>v.y))<=8
    const vertical=shapes.length>1&&Math.max(...shapes.map(v=>v.x))-Math.min(...shapes.map(v=>v.x))<=8
    const ordered=[...shapes].sort((a,b)=>horizontal?a.x-b.x:a.y-b.y)
    const gaps=ordered.slice(1).map((v,i)=>horizontal?v.x-ordered[i].x-ordered[i].width:v.y-ordered[i].y-ordered[i].height)
    const equalSize=shapes.length>0&&Math.max(...shapes.map(v=>v.width))-Math.min(...shapes.map(v=>v.width))<=4&&Math.max(...shapes.map(v=>v.height))-Math.min(...shapes.map(v=>v.height))<=4
    const colors=new Map<string,number>();shapes.forEach(v=>colors.set(color(v.background,''),(colors.get(color(v.background,''))??0)+1))
    const accent=colors.size===2&&[...colors.values()].includes(1)
    const clear=shapes.length>=5&&shapes.length<=6&&(horizontal||vertical)&&equalSize&&gaps.every(v=>v>=4)&&Math.max(...gaps)-Math.min(...gaps)<=10&&accent
    return {label:'Повтор, интервал, акцент',points:clear?20:shapes.length>=5?10:4,detail:clear?'Равные модули и интервалы создают повтор; один цветовой акцент его нарушает.':'Выстройте 5–6 одинаковых модулей по одной оси, выровняйте промежутки и выделите ровно один модуль цветом.'}
  }
  if(id==='color') {
    const colors=new Set([background,...objects.filter(v=>v.type==='shape').map(v=>v.background??'#8b5cf6'),...text.map(v=>v.color??'#111111')].map(v=>v.toLowerCase()))
    const palette=projects.color.palette!.map(v=>v.toLowerCase()),unknown=[...colors].filter(v=>!palette.includes(v))
    const clear=colors.size>=2&&colors.size<=4&&!unknown.length
    return {label:'Роли цвета и палитра',points:clear?20:colors.size<=4?12:4,detail:clear?'В макете 2–4 цвета из палитры; контраст проверен отдельно.':`Используйте 2–4 цвета из палитры. Сейчас: ${colors.size}.${unknown.length?' Замените: '+unknown.join(', ')+'.':''}`}
  }
  if(id==='grid') {
    const aligned=objects.filter(v=>Array.from({length:6},(_,i)=>24+i*102).some(x=>Math.abs(v.x-x)<=6)).length
    const rows=text.filter(v=>/^(11:00|13:00|15:00|17:00)/.test((v.text??'').trim())).sort((a,b)=>a.y-b.y)
    const gaps=rows.slice(1).map((v,i)=>v.y-rows[i].y)
    const regular=rows.length===4&&Math.max(...rows.map(v=>v.x))-Math.min(...rows.map(v=>v.x))<=6&&Math.max(...gaps)-Math.min(...gaps)<=8&&gaps.every(v=>v>=28)
    const clear=aligned/Math.max(1,objects.length)>=.8&&regular
    return {label:'Колонки и расписание',points:clear?20:aligned/Math.max(1,objects.length)>=.5?12:4,detail:clear?'Не менее 80% блоков держат сетку; программа выровнена и имеет равный шаг.':`На сетке ${aligned} из ${objects.length} блоков. Используйте X: 24, 126, 228, 330, 432, 534; четыре строки программы — с общим краем и равным шагом.`}
  }
  const masses=[...visuals.map(area),...text.map(v=>(v.fontSize??16)**2*Math.min(16,(v.text??'').length))].sort((a,b)=>b-a)
  const clear=!!title&&(title.fontSize??0)>=40&&(masses[0]??0)>=30000&&(masses[0]??0)/Math.max(1,masses[1]??0)>=1.5
  return {label:'Доминанта и подчинение',points:clear?20:10,detail:clear?'Одна масса заметно крупнее остальных, заголовок поддерживает порядок чтения.':'Увеличьте название минимум до 40 px. Сделайте главную массу минимум в 1,5 раза крупнее следующей — изображением или типографикой.'}
}
export function evaluateProject(id:string,objects:DesignObject[],initial:DesignObject[],background:string,otherStarters:DesignObject[][]=[]):Evaluation {
  const project=projects[id]??projects.composition,active=objects.filter(visible),text=active.filter(isText)
  const readable=text.filter(v=>boundsInside(v)&&(v.fontSize??16)>=12)
  const copy=normalize(readable.map(v=>v.text??'').join(' ')),missing=project.requiredCopy.filter(value=>!copy.includes(normalize(value)))
  const outside=text.filter(v=>!boundsInside(v)),small=text.filter(v=>(v.fontSize??16)<12)
  const collisions=text.filter((v,i)=>text.slice(i+1).some(other=>overlap(v,other)>Math.min(area(v),area(other))*.15))
  const covered=text.filter(v=>objects.slice(objects.indexOf(v)+1).some(other=>visible(other)&&!isText(other)&&(other.type==='shape'||other.type==='photo'&&other.materialKind==='photo')&&overlap(v,other)>area(v)*.25))
  const photoText=text.filter(v=>objects.slice(0,objects.indexOf(v)).reverse().find(other=>!isText(other)&&visible(other)&&overlap(v,other)>area(v)*.5)?.type==='photo')
  const lowContrast=text.filter(v=>{const backing=objects.slice(0,objects.indexOf(v)).reverse().find(other=>other.type==='shape'&&(other.opacity??1)>=.95&&overlap(v,other)>=area(v)*.99);return ratio(v.color??'#111111',backing?.background??background)<((v.fontSize??16)>=24||((v.fontSize??16)>=18&&(v.fontWeight??400)>=700)?3:4.5)})
  const changed=Math.min(...[initial,...otherStarters].map(baseline=>meaningfulChanges(active,baseline)))
  const unchanged=changed===0,process=changed>=5?20:changed>=3?16:changed>0?6:0
  const info=Math.round(20*(project.requiredCopy.length-missing.length)/project.requiredCopy.length)
  const craft=Math.max(0,20-outside.length*5-small.length*4-collisions.length*5-lowContrast.length*4-covered.length*6-photoText.length*4)
  const special=taskCriterion(id,active,background)
  const emptyPhotos=active.filter(v=>v.type==='photo'&&!v.imageSrc),visual=emptyPhotos.length?8:active.length>=4?20:4
  const blockers=[...(unchanged?['Это исходный макет. Он не засчитывается.']:changed<3?['Переработайте минимум три элемента: одного сдвига или замены недостаточно.']:[]),...(missing.length?[`Добавьте читаемый текст: ${missing.join(' · ')}.`]:[]),...(craft<20?['Исправьте читаемость: '+[...new Set([...outside,...small,...collisions,...lowContrast,...covered,...photoText].map(item=>item.name))].join(', ')+'.']:[]),...(special.points<16?[special.detail]:[]),...(emptyPhotos.length?['Заполните или удалите пустые рамки изображений.']:[])]
  const items:Criterion[]=[{label:'Сведения о событии',points:info,detail:missing.length?`Не найдены в читаемой области: ${missing.join(' · ')}.`:'Все обязательные сведения присутствуют в пределах макета.'},{label:'Читаемость и поля',points:craft,detail:craft===20?'Текст в полях, без пересечений; контраст достаточен.':`Поля: ${outside.length}; мелкий текст: ${small.length}; пересечения: ${collisions.length}; контраст: ${lowContrast.length}; перекрытие: ${covered.length}; текст на фото: ${photoText.length}.`},special,{label:'Готовность макета',points:visual,detail:emptyPhotos.length?'Остались пустые рамки. Выберите материалы или удалите их.':'Материалы размещены. Художественное качество оценивайте по брифу и самопроверке.'},{label:'Самостоятельная переработка',points:process,detail:unchanged?'Исходник распознан. Изменения имён слоёв, загрузка и автоподгонка текста не считаются работой.':`От ближайшего исходника, включая прежние версии, существенно отличаются элементы: ${changed}. Для зачёта нужно минимум три и выполнение приёма задания.`}]
  const raw=items.reduce((sum,v)=>sum+v.points,0),passed=blockers.length===0&&raw>=80
  const score=passed?raw:Math.min(raw,unchanged?0:69)
  const recommendations=blockers.length?blockers:['Проверьте афишу в миниатюре: сначала тема, затем дата и место.', 'Сохраните PNG и объясните, почему выбранное решение подходит аудитории.']
  return {score,passed,items,blockers,unchanged,next:recommendations[0],strengths:items.filter(v=>v.points===20).map(v=>v.label),recommendations}
}
