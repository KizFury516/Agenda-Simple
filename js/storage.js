const STORAGE_KEY = 'agenda_items_v1';
const THEME_KEY = 'agenda_theme_v1';

function safeGet(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // El almacenamiento puede estar bloqueado o lleno.
  }
}

function loadItems() {
  const stored = safeGet(STORAGE_KEY);
  return Array.isArray(stored) ? stored : [];
}

function saveItems(items) {
  safeSet(STORAGE_KEY, items);
}
