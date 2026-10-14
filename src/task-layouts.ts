import type { DesignObject } from './assignments'
import { materialFor } from './task-assets'

function textLayer(id:string,name:string,text:string,x:number,y:number,width:number,height:number,fontSize:number,color:string,fontWeight=650,extra:Partial<DesignObject>={}): DesignObject {
  return {id,type:'text',name,text,x,y,width,height,fontSize,fontWeight,color,fontFamily:'Manrope',lineHeight:1,letterSpacing:0,textAlign:'left',rotation:0,...extra}
}

function materialLayer(taskId:string,assetId:string,id:string,name:string,x:number,y:number,width?:number,height?:number,extra:Partial<DesignObject>={}): DesignObject {
  const item=materialFor(taskId,assetId)
  if(!item) throw new Error(`Missing task material: ${taskId}/${assetId}`)
  return {id,type:'photo',name,x,y,width:width??item.width,height:height??item.height,rotation:0,opacity:1,background:'#f2f0e9',radius:item.radius??0,imageSrc:item.src,fit:item.fit,assetId:item.id,materialKind:item.kind,...extra}
}

export const makeBaseObjects = (taskId: string): DesignObject[] => {
  switch (taskId) {
    case 'composition': return [
      materialLayer('composition','exhibition-photo','c-photo','Архитектура выставки',48,270,564,385,{fit:'cover'}),
      materialLayer('composition','stone-arch','c-arch','Арка из травертина',310,358,248,230),
      materialLayer('composition','prism-glass','c-prism','Стеклянная призма',54,424,188,142),
      materialLayer('composition','metal-ribbon','c-metal','Металлическая лента',383,550,190,115),
      textLayer('c-title','Название выставки','ГОРОД ФОРМ',48,73,555,105,67,'#20201e',850,{letterSpacing:-3}),
      textLayer('c-sub','Формат выставки','Выставка современной графики',52,184,510,42,20,'#35332f',600),
      textLayer('c-date','Даты','18–30 октября',50,690,265,40,25,'#242320',800),
      textLayer('c-place','Площадка','Галерея «Контур»',50,746,310,30,19,'#242320',700),
      textLayer('c-address','Адрес','пр. Ленина, 42',50,782,270,25,15,'#5d5952',550),
      materialLayer('composition','contour-logo','c-logo','Логотип галереи',370,838,232,55),
      textLayer('c-free','Вход','Вход свободный',50,840,230,28,16,'#35332f',700),
    ]
    case 'hierarchy': return [
      materialLayer('hierarchy','designer-photo','h-photo','Портрет арт-директора',326,222,286,377,{fit:'cover'}),
      materialLayer('hierarchy','portrait-woman','h-portrait','Портрет · вариант',383,448,171,184),
      materialLayer('hierarchy','type-specimen','h-specimen','Типографический образец',56,569,180,130),
      textLayer('h-kicker','Серия','FORMA STUDIO  /  OPEN CLASS',50,48,550,22,11,'#655f58',700,{letterSpacing:1.5}),
      textLayer('h-title','Тема мастер-класса','ТИПОГРАФИКА\nБЕЗ ХАОСА',46,91,565,120,51,'#171719',850,{lineHeight:.9,letterSpacing:-2}),
      textLayer('h-sub','Формат','Практический мастер-класс',50,219,282,60,18,'#514b47',700),
      textLayer('h-name','Спикер','Анна Власова',50,346,270,48,28,'#171719',800),
      textLayer('h-role','Должность','арт-директор Forma Studio',52,392,276,47,15,'#514b47',600),
      textLayer('h-date','Дата','24 октября',50,743,230,32,20,'#171719',800),
      textLayer('h-time','Время','19:00',50,777,120,28,16,'#514b47',650),
      textLayer('h-venue','Место','Точка кипения\nпр. Социалистический, 68',50,822,320,55,14,'#33302e',650),
      materialLayer('hierarchy','forma-logo','h-logo','Логотип Forma Studio',397,831,210,50),
      textLayer('h-free','Участие','Регистрация бесплатная',392,780,220,28,13,'#655f58',650),
    ]
    case 'balance': return [
      materialLayer('balance','night-stage','b-photo','Ночная сцена',55,140,386,470,{fit:'cover'}),
      materialLayer('balance','smoke','b-smoke','Сценический дым',298,190,300,190),
      materialLayer('balance','foil','b-chrome','Хромированная фольга',335,400,251,160),
      materialLayer('balance','spotlight','b-light','Прожектор',421,93,170,170),
      materialLayer('balance','audio-cable','b-cable','Аудиокабель',69,544,254,145),
      textLayer('b-kicker','Жанр','ELECTRONIC  /  HOUSE  /  AMBIENT',54,49,555,23,11,'#c5c1cc',700,{letterSpacing:1.2}),
      textLayer('b-title','Название концерта','НОЧЬ\nМУЗЫКИ',54,75,460,118,58,'#f7f1ea',850,{lineHeight:.86,letterSpacing:-2}),
      textLayer('b-djs','Артисты','RADIUS / NEON /\nKOSMO / AURA',350,602,255,62,17,'#f2ede7',800,{lineHeight:1.15}),
      textLayer('b-date','Дата и время','31 октября  /  22:00',55,740,320,30,18,'#f5d394',800),
      textLayer('b-venue','Площадка','Сцена 12',55,780,235,30,20,'#f6f1eb',700),
      materialLayer('balance','scene-logo','b-logo','Логотип Сцены 12',390,829,220,52),
    ]
    case 'rhythm': return [
      materialLayer('rhythm','city-festival-photo','r-photo','Фестиваль в парке',42,198,576,342,{fit:'cover'}),
      materialLayer('rhythm','rhythm-ribbon','r-ribbon','Лента фестиваля',205,325,344,146),
      materialLayer('rhythm','rhythm-arrow','r-arrow','Стрелка',44,550,190,96),
      materialLayer('rhythm','rhythm-steps','r-steps','Ритмические ступени',470,555,132,106),
      materialLayer('rhythm','rhythm-sun','r-sun','Солнечный знак',517,125,88,88),
      materialLayer('rhythm','rhythm-logo','r-logo','Знак фестиваля',431,51,190,48),
      textLayer('r-title','Название фестиваля','РИТМ\nГОРОДА',43,58,380,120,57,'#202a22',850,{lineHeight:.88,letterSpacing:-2}),
      textLayer('r-date','Даты фестиваля','12–13 июля',47,680,260,38,25,'#202a22',800),
      textLayer('r-place','Площадка','Парк Центральный',49,722,300,28,17,'#353c32',650),
      textLayer('r-program','Программа','Музыка  /  Дизайн\nМаркет  /  Стрит-арт',49,770,350,62,18,'#353c32',650,{lineHeight:1.3}),
      textLayer('r-edition','Идентификатор','01 — 04   /   ГОРОД В ДВИЖЕНИИ',426,854,200,20,9,'#787263',650,{letterSpacing:1}),
    ]
    case 'color': return [
      materialLayer('color','market-photo','m-photo','Натюрморт маркета',46,242,568,360,{fit:'cover'}),
      materialLayer('color','basil-pot','m-basil','Базилик',55,405,181,195),
      materialLayer('color','marigold-flower','m-flower','Бархатцы',445,300,162,200),
      materialLayer('color','lemons','m-lemons','Лимоны',271,507,191,150),
      materialLayer('color','ceramic-jar','m-ceramic','Керамика',460,586,145,176),
      textLayer('m-kicker','Формат','ЛОКАЛЬНОЕ · СЕЗОННОЕ · ЖИВОЕ',48,48,555,22,10,'#52604c',750,{letterSpacing:1.4}),
      textLayer('m-title','Название маркета','ЛЕТНИЙ\nМАРКЕТ',45,79,445,130,58,'#263d2b',850,{lineHeight:.9,letterSpacing:-2}),
      materialLayer('color','summer-logo','m-logo','Логотип Лето Market',414,142,190,48),
      textLayer('m-dates','Даты и часы','20–21 июля  ·  11:00–20:00',49,650,430,34,21,'#263d2b',800),
      textLayer('m-program','Категории','Локальные бренды  /  Еда\nРастения  /  Музыка',50,700,390,58,15,'#374234',650,{lineHeight:1.35}),
      textLayer('m-place','Место','Парк «Изумрудный»',50,833,340,30,18,'#263d2b',700),
    ]
    default: return [
      materialLayer('grid','design-conference-photo','g-photo','Зал конференции',44,130,565,286,{fit:'cover'}),
      materialLayer('grid','speaker-woman','g-speaker-a','Спикер · портрет 01',393,314,145,178),
      materialLayer('grid','speaker-man','g-speaker-b','Спикер · портрет 02',483,364,131,160),
      materialLayer('grid','metal-sculpture','g-sculpture','Металлический объект',50,433,145,173),
      materialLayer('grid','design-day-logo','g-logo','Знак Design Day',423,51,192,48),
      textLayer('g-kicker','Город','БАРНАУЛ  /  25 АПРЕЛЯ',48,51,340,23,11,'#4c5360',750,{letterSpacing:1.2}),
      textLayer('g-title','Название конференции','DESIGN DAY\n2027',44,72,440,105,44,'#14213d',850,{lineHeight:.9,letterSpacing:-2}),
      textLayer('g-intro','Описание','Конференция о дизайне, технологиях\nи визуальной культуре',48,429,352,48,14,'#2c3340',600,{lineHeight:1.25}),
      textLayer('g-schedule-title','Заголовок расписания','ПРОГРАММА',48,500,200,26,12,'#14213d',850,{letterSpacing:1}),
      textLayer('g-schedule-a','Расписание · 11:00','11:00 · Digital product design',48,543,340,27,13,'#222b3e',700),
      textLayer('g-schedule-b','Расписание · 13:00','13:00 · New visual culture',48,581,340,27,13,'#222b3e',700),
      textLayer('g-schedule-c','Расписание · 15:00','15:00 · AI and design',48,619,340,27,13,'#222b3e',700),
      textLayer('g-schedule-d','Расписание · 17:00','17:00 · Карьера дизайнера',48,657,340,27,13,'#222b3e',700),
      textLayer('g-venue','Место','Молодёжный центр',49,742,260,29,17,'#14213d',750),
      textLayer('g-site','Сайт конференции','design-day.ru',49,779,210,25,13,'#495366',650),
      materialLayer('grid','camera-detail','g-camera','Камера репортажа',403,699,177,122),
    ]
  }
}

export const makeReferenceObjects = (taskId: string): DesignObject[] => {
  const removed = new Set(['c-arch','c-prism','c-metal','h-portrait','h-specimen','b-smoke','b-chrome','b-light','b-cable','r-ribbon','r-steps','r-sun','m-basil','m-flower','m-lemons','m-ceramic','g-speaker-a','g-speaker-b','g-sculpture','g-camera'])
  const result = makeBaseObjects(taskId).filter(item => !removed.has(item.id))
  const layouts: Record<string,Partial<DesignObject>> = {
    'c-title':{text:'ГОРОД\nФОРМ',x:44,y:72,width:570,height:178,fontSize:88,lineHeight:.92,letterSpacing:-4},
    'c-sub':{x:48,y:267,fontSize:18,width:550,height:28},'c-photo':{x:48,y:327,width:564,height:340},
    'c-date':{y:709,fontSize:28},'c-place':{y:766},'c-address':{y:801},'c-logo':{x:428,y:842,width:184,height:44},'c-free':{y:849},
    'h-title':{x:46,y:95,fontSize:50,lineHeight:1,width:570,height:112},'h-photo':{x:330,y:307,width:282,height:370},
    'h-sub':{x:49,y:230,width:550,height:32,fontSize:17},'h-name':{x:48,y:370,width:260,height:74,text:'Анна\nВласова',fontSize:33,lineHeight:1.05},
    'h-role':{x:48,y:461,width:238,height:55,text:'арт-директор\nForma Studio',fontSize:16,lineHeight:1.3},'h-kicker':{fontSize:12,letterSpacing:.8},
    'b-title':{x:46,y:111,width:566,height:159,fontSize:76,lineHeight:.94},'b-photo':{x:48,y:324,width:348,height:357},
    'b-djs':{x:431,y:382,width:179,height:140,text:'RADIUS /\nNEON /\nKOSMO /\nAURA',fontSize:20,lineHeight:1.5},'b-kicker':{fontSize:12,letterSpacing:.7},'b-logo':{width:184,x:427},
    'r-photo':{x:48,y:346,width:564,height:251},'r-title':{x:44,y:111,width:570,height:153,fontSize:73,lineHeight:.94},
    'r-logo':{x:427,y:48,width:184,height:44},'r-arrow':{x:48,y:616,width:104,height:52},'r-date':{x:48,y:713},'r-place':{x:48,y:760},
    'r-program':{x:343,y:713,width:266,height:80,fontSize:17,lineHeight:1.5},'r-edition':{x:48,y:855,width:560,fontSize:12,letterSpacing:.5},
    'm-title':{x:44,y:101,width:550,height:132,fontSize:67,lineHeight:.94},'m-kicker':{fontSize:12,letterSpacing:.7},
    'm-photo':{x:48,y:295,width:564,height:336},'m-logo':{x:428,y:839,width:184,height:46},'m-dates':{x:48,y:689,width:564,fontSize:23},
    'm-program':{x:48,y:748,width:500,height:62,fontSize:17,lineHeight:1.45},'m-place':{x:48,y:851,width:355,fontSize:17},
    'g-title':{x:46,y:112,width:568,height:143,fontSize:67,lineHeight:.94},'g-photo':{x:48,y:291,width:564,height:199},
    'g-intro':{x:48,y:520,width:550,height:48,fontSize:16,lineHeight:1.3},'g-schedule-title':{y:596,fontSize:12},
    'g-schedule-a':{x:48,y:638,width:564,fontSize:17},'g-schedule-b':{x:48,y:677,width:564,fontSize:17},
    'g-schedule-c':{x:48,y:716,width:564,fontSize:17},'g-schedule-d':{x:48,y:755,width:564,fontSize:17},
    'g-venue':{x:48,y:839,width:340,fontSize:17},'g-site':{x:425,y:840,width:187,fontSize:14},'g-logo':{x:428,y:46,width:184,height:44},'g-kicker':{fontSize:12,letterSpacing:.6},
  }
  result.forEach(item=>Object.assign(item,layouts[item.id]??{}))
  const rule=(id:string,x:number,y:number,width:number,height:number,color:string):DesignObject=>({id,type:'shape',name:height<=5?'Линия разделения':'Ритмический модуль',x,y,width,height,rotation:0,background:color,radius:0})
  const rules:Record<string,DesignObject[]>={
    composition:[rule('c-rule',48,693,564,2,'#20201e')],hierarchy:[rule('h-rule',48,705,564,2,'#171719')],
    balance:[rule('b-accent',432,330,176,5,'#f5d394')],color:[rule('m-rule',48,657,564,3,'#263d2b')],
    grid:[rule('g-rule',48,812,564,2,'#14213d')],
    rhythm:Array.from({length:6},(_,i)=>rule('r-beat-'+i,48+i*96,290,68,i===4?34:14,i===4?'#e1623b':'#202a22')),
  }
  return [...(rules[taskId]??[]),...result]
}
