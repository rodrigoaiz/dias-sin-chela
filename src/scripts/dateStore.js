// dateStore.js
// Helper para leer/escribir la fecha de última chela en localStorage

const LS_KEY = 'dias-sin-chela:last-beer-date';
const FALLBACK_DATE = '2026-01-13'; // fecha del dueño, se usa si no hay nada guardado

/**
 * Retorna la fecha de última chela como objeto Date.
 * Si el usuario no ha configurado la suya, usa el fallback.
 */
export function getStartDate() {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    return new Date(stored + 'T00:00:00');
  }
  return new Date(FALLBACK_DATE + 'T00:00:00');
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
