import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, vi } from "vitest";


async function waitForSelector(selector, timeout = 3000) {
  const t0 = Date.now();
  while (!document.querySelector(selector)) {
    if (Date.now() - t0 > timeout) {
      throw new Error(`Elemento no encontrado: ${selector}`);
    }
    await new Promise(r => setTimeout(r, 10));
  }
  return document.querySelector(selector);
}

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

describe("To-Do List (pruebas de integración)", () => {
  beforeEach(async () => {
    document.documentElement.innerHTML = html.toString();

   
    localStorage.clear();

    
    vi.resetModules();

    await import("../js/script.js");

    document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
    await new Promise(r => setTimeout(r, 0));
  });

  it("agrega una tarea y actualiza el contador", async () => {
    const input = document.getElementById("agregar");
    const boton = document.getElementById("btn-agregar");
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador-tareas");

    input.value = "Estudiar CI/CD";
    boton.click();

    await waitForSelector("li");
    expect(lista.children.length).toBe(1);
    expect(lista.textContent).toContain("Estudiar CI/CD");
    expect(contador.textContent).toBe("1");
  });

  it("marca una tarea como completada y actualiza el contador", async () => {
    const input = document.getElementById("agregar");
    const boton = document.getElementById("btn-agregar");
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador-tareas");

    input.value = "Probar";
    boton.click();

    const check = await waitForSelector("input[type='checkbox']");
    check.click();

    expect(lista.querySelector("li").classList.contains("completada")).toBe(true);
    expect(contador.textContent).toBe("0");
  });

  it("filtra correctamente pendientes y completadas", async () => {
    const input = document.getElementById("agregar");
    const boton = document.getElementById("btn-agregar");
    const lista = document.getElementById("lista-tareas");

    input.value = "Tarea A";
    boton.click();
    input.value = "Tarea B";
    boton.click();

    const primera = await waitForSelector("input[type='checkbox']");
    primera.click();

    document.getElementById("filtro-completadas").click();
    expect([...lista.children].every(li => li.classList.contains("completada"))).toBe(true);

    document.getElementById("filtro-pendientes").click();
    expect([...lista.children].every(li => !li.classList.contains("completada"))).toBe(true);

    document.getElementById("filtro-todos").click();
    expect(lista.children.length).toBe(2);
  });
});
