// dateStore.js
// Helper para leer/escribir la fecha de última chela en localStorage

const LS_KEY = 'dias-sin-chela:last-beer-date';
const MODE_KEY = 'dias-sin-chela:mode'; // 'mine' | 'dev'
export const DEV_DATE = '2026-01-13'; // fecha hardcodeada del creador

/**
 * Retorna la fecha de última chela como objeto Date.
 * Si está en modo 'dev', usa la fecha del creador.
 * Si el usuario no tiene fecha propia, usa la del dev como fallback.
 */
export function getStartDate() {
  const mode = getMode();
  if (mode === 'dev') {
    return new Date(DEV_DATE + 'T00:00:00');
  }
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    return new Date(stored + 'T00:00:00');
  }
  return new Date(DEV_DATE + 'T00:00:00');
}

/**
 * Retorna true si el usuario ya configuró su propia fecha.
 */
export function hasUserDate() {
  return localStorage.getItem(LS_KEY) !== null;
}

/**
 * Guarda la fecha de última chela del usuario (formato 'YYYY-MM-DD').
 */
export function setStartDate(dateString) {
  localStorage.setItem(LS_KEY, dateString);
}

/**
 * Borra la fecha guardada (reset).
 */
export function clearStartDate() {
  localStorage.removeItem(LS_KEY);
}

/**
 * Retorna el modo actual: 'mine' o 'dev'.
 */
export function getMode() {
  return localStorage.getItem(MODE_KEY) || 'mine';
}

/**
 * Cambia el modo de vista.
 */
export function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

/**
 * Calcula los días transcurridos desde una fecha.
 */
export function calcDays(startDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * Formatea una fecha como "13 enero 2026" en español.
 */
export function formatDate(date) {
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}
