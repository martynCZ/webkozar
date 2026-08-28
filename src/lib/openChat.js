// Otevření AI chatu odkudkoli přes CustomEvent (poslouchá LiveChatWidget).
// Držíme se vzoru z cookieConsent.js – žádný globální stav přes window.
export const OPEN_CHAT_EVENT = 'wk:open-chat';

/**
 * Otevře plovoucí AI chat. Volitelně do něj přidá uvítací zprávu bota
 * (např. výzvu k popisu projektu, když se chat otevírá z ceníku).
 * @param {string} [botMessage] text zprávy bota
 */
export function openChat(botMessage) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { botMessage } }));
}
