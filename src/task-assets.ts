export type MaterialKind = 'photo' | 'graphic' | 'logo'
export type TaskMaterial = {
  id: string
  name: string
  kind: MaterialKind
  src: string
  fit: 'cover' | 'contain'
  width: number
  height: number
  radius?: number
}

const material = (id: string, name: string, kind: MaterialKind, src: string, width: number, height: number, fit: 'cover' | 'contain' = 'contain', radius = 0): TaskMaterial => ({ id, name, kind, src, width, height, fit, radius })

export const taskMaterials: Record<string, TaskMaterial[]> = {
  composition: [
    material('exhibition-photo', 'Павильон из стекла', 'photo', new URL('./assets/tasks/composition/photo.jpg', import.meta.url).href, 430, 440, 'cover', 4),
    material('stone-arch', 'Арка из травертина', 'graphic', new URL('./assets/tasks/composition/arch.png', import.meta.url).href, 230, 230),
    material('metal-ribbon', 'Металлическая лента', 'graphic', new URL('./assets/tasks/composition/metal-ribbon.png', import.meta.url).href, 250, 160),
    material('prism-glass', 'Призма из стекла', 'graphic', new URL('./assets/tasks/composition/glass.png', import.meta.url).href, 210, 170),
    material('stone-relief', 'Архитектурный рельеф', 'graphic', new URL('./assets/tasks/composition/relief.png', import.meta.url).href, 190, 190),
    material('contour-logo', 'Галерея «Контур»', 'logo', new URL('./assets/tasks/composition/logo.svg', import.meta.url).href, 230, 56),
  ],
  hierarchy: [
    material('designer-photo', 'Портрет арт-директора', 'photo', new URL('./assets/tasks/hierarchy/photo.jpg', import.meta.url).href, 320, 410, 'cover', 3),
    material('portrait-woman', 'Портрет · тёмный жакет', 'graphic', new URL('./assets/tasks/hierarchy/portrait-woman.png', import.meta.url).href, 190, 240),
    material('portrait-ginger', 'Портрет · светлый фон', 'graphic', new URL('./assets/tasks/hierarchy/portrait-ginger.png', import.meta.url).href, 190, 240),
    material('portrait-director', 'Портрет · арт-директор', 'graphic', new URL('./assets/tasks/hierarchy/portrait-director.png', import.meta.url).href, 190, 240),
    material('portrait-designer', 'Портрет · дизайнер', 'graphic', new URL('./assets/tasks/hierarchy/portrait-designer.png', import.meta.url).href, 190, 240),
    material('type-specimen', 'Типографический образец', 'graphic', new URL('./assets/tasks/hierarchy/type-specimen.svg', import.meta.url).href, 190, 140),
    material('forma-logo', 'Forma Studio', 'logo', new URL('./assets/tasks/hierarchy/logo.svg', import.meta.url).href, 210, 52),
  ],
  balance: [
    material('night-stage', 'Ночная сцена', 'photo', new URL('./assets/tasks/balance/photo.jpg', import.meta.url).href, 430, 470, 'cover', 2),
    material('audio-cable', 'Аудиокабель', 'graphic', new URL('./assets/tasks/balance/audio-cable.png', import.meta.url).href, 270, 155),
    material('spotlight', 'Театральный прожектор', 'graphic', new URL('./assets/tasks/balance/spotlight.png', import.meta.url).href, 220, 220),
    material('foil', 'Хромированная фольга', 'graphic', new URL('./assets/tasks/balance/foil.png', import.meta.url).href, 230, 170),
    material('smoke', 'Синий сценический дым', 'graphic', new URL('./assets/tasks/balance/smoke.png', import.meta.url).href, 245, 190),
    material('scene-logo', 'Сцена 12', 'logo', new URL('./assets/tasks/balance/logo.svg', import.meta.url).href, 205, 50),
  ],
  rhythm: [
    material('city-festival-photo', 'Фестиваль в парке', 'photo', new URL('./assets/tasks/rhythm/photo.jpg', import.meta.url).href, 440, 310, 'cover', 2),
    material('rhythm-arrow', 'Стрелка · трафарет', 'graphic', new URL('./assets/tasks/rhythm/arrow.svg', import.meta.url).href, 235, 118),
    material('rhythm-ribbon', 'Лента · красный раппорт', 'graphic', new URL('./assets/tasks/rhythm/ribbon.svg', import.meta.url).href, 250, 110),
    material('rhythm-steps', 'Ступени · серия', 'graphic', new URL('./assets/tasks/rhythm/steps.svg', import.meta.url).href, 160, 130),
    material('rhythm-sun', 'Солнечный знак', 'graphic', new URL('./assets/tasks/rhythm/sunburst.svg', import.meta.url).href, 140, 140),
    material('rhythm-logo', 'Ритм города', 'logo', new URL('./assets/tasks/rhythm/logo.svg', import.meta.url).href, 220, 52),
  ],
  color: [
    material('market-photo', 'Летний маркет', 'photo', new URL('./assets/tasks/color/photo.jpg', import.meta.url).href, 390, 380, 'cover', 3),
    material('basil-pot', 'Базилик в глиняном горшке', 'graphic', new URL('./assets/tasks/color/basil.png', import.meta.url).href, 190, 205),
    material('marigold-flower', 'Бархатцы', 'graphic', new URL('./assets/tasks/color/marigold.png', import.meta.url).href, 175, 210),
    material('lemons', 'Лимоны и листья', 'graphic', new URL('./assets/tasks/color/lemons.png', import.meta.url).href, 190, 170),
    material('ceramic-jar', 'Керамическая бутылка', 'graphic', new URL('./assets/tasks/color/ceramic.png', import.meta.url).href, 175, 200),
    material('summer-logo', 'Лето Market', 'logo', new URL('./assets/tasks/color/logo.svg', import.meta.url).href, 200, 50),
  ],
  grid: [
    material('design-conference-photo', 'Конференция · зал', 'photo', new URL('./assets/tasks/grid/photo.jpg', import.meta.url).href, 430, 320, 'cover', 2),
    material('speaker-woman', 'Спикер · Анна', 'graphic', new URL('./assets/tasks/grid/speaker-woman.png', import.meta.url).href, 175, 210),
    material('speaker-man', 'Спикер · Максим', 'graphic', new URL('./assets/tasks/grid/speaker-man.png', import.meta.url).href, 175, 210),
    material('camera-detail', 'Камера репортажа', 'graphic', new URL('./assets/tasks/grid/camera.png', import.meta.url).href, 210, 145),
    material('metal-sculpture', 'Объект · металл', 'graphic', new URL('./assets/tasks/grid/sculpture.png', import.meta.url).href, 180, 210),
    material('design-day-logo', 'Design Day 2027', 'logo', new URL('./assets/tasks/grid/logo.svg', import.meta.url).href, 220, 52),
  ],
}

export const allTaskMaterialSources = new Set(Object.values(taskMaterials).flat().map(item => item.src))

export function materialFor(taskId: string, materialId: string) {
  return taskMaterials[taskId]?.find(item => item.id === materialId)
}
