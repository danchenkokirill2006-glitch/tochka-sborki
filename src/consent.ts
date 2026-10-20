export type ConsentChoice = 'accepted' | 'essential'

const choiceKey = 'tochka-sborki:storage-choice:v1'

function readChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(choiceKey)
    return value === 'accepted' || value === 'essential' ? value : null
  } catch { return null }
}

let choice = readChoice()
let panel: HTMLElement | null = null

export function getConsentChoice() { return choice }

export function openConsentSettings() {
  if (!panel) return
  panel.hidden = false
  const checkbox = panel.querySelector<HTMLInputElement>('[data-consent-storage]')
  const accept = panel.querySelector<HTMLButtonElement>('[data-consent-accept]')
  if (checkbox && accept) {
    checkbox.checked = choice === 'accepted'
    accept.disabled = !checkbox.checked
    checkbox.focus({ preventScroll: true })
  }
}

export function mountConsent(onChange: (next: ConsentChoice) => void) {
  if (panel) return
  panel = document.createElement('section')
  panel.className = 'consent-panel'
  panel.setAttribute('aria-label', 'Настройки cookies и сохранения данных')
  panel.innerHTML = `
    <div class="consent-copy">
      <span class="consent-kicker">ВАШИ ДАННЫЕ · ВАШ ВЫБОР</span>
      <h2>Cookies и прогресс</h2>
      <p>Технический cookie нужен для лимита ИИ. Прогресс, макеты и настройки можно сохранять на этом устройстве только с вашего разрешения. Рекламных cookies нет.</p>
      <div class="consent-links"><a href="#/cookies">О cookies</a><a href="#/privacy">Политика данных</a></div>
    </div>
    <div class="consent-actions">
      <label class="consent-check"><input type="checkbox" data-consent-storage><span>Разрешаю сохранять прогресс, настройки и историю чата в браузере</span></label>
      <div class="consent-buttons"><button type="button" class="consent-essential" data-consent-essential>Только необходимые</button><button type="button" class="consent-accept" data-consent-accept disabled>Принять и сохранять</button></div>
    </div>`
  panel.hidden = choice !== null
  document.body.append(panel)

  const checkbox = panel.querySelector<HTMLInputElement>('[data-consent-storage]')!
  const accept = panel.querySelector<HTMLButtonElement>('[data-consent-accept]')!
  checkbox.addEventListener('change', () => { accept.disabled = !checkbox.checked })

  function select(next: ConsentChoice) {
    choice = next
    try { window.localStorage.setItem(choiceKey, next) } catch { /* The choice still applies during this visit. */ }
    panel!.hidden = true
    onChange(next)
  }

  panel.querySelector('[data-consent-essential]')!.addEventListener('click', () => select('essential'))
  accept.addEventListener('click', () => { if (checkbox.checked) select('accepted') })
}
