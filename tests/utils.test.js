// tests/utils.test.js
import { describe, it, expect } from 'vitest';
import { countPendientes, normalizeDescripcion } from '../js/utils.js';

describe('Funciones utilitarias', () => {
  it('countPendientes cuenta solo las tareas no completadas', () => {
    const tareas = [
      { id: 1, completada: false },
      { id: 2, completada: true },
      { id: 3, completada: false }
    ];
    expect(countPendientes(tareas)).toBe(2);
  });

  it('normalizeDescripcion recorta texto y controla nulos', () => {
    expect(normalizeDescripcion('  hola  ')).toBe('hola');
    expect(normalizeDescripcion('')).toBe('');
    expect(normalizeDescripcion(null)).toBe('');
    expect(normalizeDescripcion(undefined)).toBe('');
  });
});
