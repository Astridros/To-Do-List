// js/utils.js

// Cuenta cuántas tareas NO están completadas
export function countPendientes(tareas = []) {
  return tareas.filter(t => !t.completada).length;
}

// Limpia espacios o nulos en la descripción de la tarea
export function normalizeDescripcion(texto) {
  return (texto ?? '').trim();
}
