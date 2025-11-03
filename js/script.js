import { countPendientes, normalizeDescripcion } from './utils.js';

let tareas = [];

function el(id) {
  return document.getElementById(id);
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function agregarTarea() {
  const input = el("agregar"); 
  const descripcionTarea = normalizeDescripcion(input.value);
  if (!descripcionTarea) {
    return;
  }

  const tareaNueva = {
    id: Date.now(),
    descripcion: descripcionTarea,
    completada: false
  };

  tareas.push(tareaNueva);
  guardarTareas();
  renderTarea(tareaNueva);
  input.value = "";
  actualizarContador();
}

function renderTarea(tarea) {
  const lista = el("lista-tareas");
  const liNuevo = document.createElement("li");
  liNuevo.classList.add("tarea");
  liNuevo.dataset.id = tarea.id;
  if (tarea.completada) liNuevo.classList.add("completada");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.classList.add("tarea-check");
  check.checked = tarea.completada;

  check.addEventListener("change", () => {
    tarea.completada = check.checked;
    guardarTareas();
    actualizarContador();
    liNuevo.classList.toggle("completada", check.checked);
  });

  const texto = document.createElement("p");
  texto.textContent = tarea.descripcion;

  const iconos = document.createElement("div");
  iconos.classList.add("iconos");

  const editar = document.createElement("i");
  editar.classList.add("bi", "bi-pencil-square", "icono-editar");
  editar.addEventListener("click", editarTarea);

  const eliminar = document.createElement("i");
  eliminar.classList.add("bi", "bi-trash3-fill", "icono-eliminar");
  eliminar.addEventListener("click", eliminarTarea);

  iconos.append(editar, eliminar);
  liNuevo.append(check, texto, iconos);
  lista.appendChild(liNuevo);
}

function eliminarTarea(e) {
  const tareaElemento = e.target.closest("li");
  const id = parseInt(tareaElemento.dataset.id);
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas();
  tareaElemento.remove();
  actualizarContador();
}

function editarTarea(e) {
  const tareaElemento = e.target.closest("li");
  const id = parseInt(tareaElemento.dataset.id);
  const tarea = tareas.find(t => t.id === id);
  const textoElemento = tareaElemento.querySelector("p");

  const inputEditar = document.createElement("input");
  inputEditar.type = "text";
  inputEditar.value = tarea.descripcion;
  inputEditar.classList.add("editar-input");

  tareaElemento.replaceChild(inputEditar, textoElemento);
  inputEditar.focus();

  inputEditar.addEventListener("blur", guardarEdicion);
  inputEditar.addEventListener("keypress", e => {
    if (e.key === "Enter") guardarEdicion();
  });

  function guardarEdicion() {
    const nuevoTexto = inputEditar.value.trim();
    if (nuevoTexto) {
      tarea.descripcion = nuevoTexto;
      guardarTareas();
      const nuevoTextoElemento = document.createElement("p");
      nuevoTextoElemento.textContent = nuevoTexto;
      tareaElemento.replaceChild(nuevoTextoElemento, inputEditar);
    } else {
    }
  }
}

function actualizarContador() {
  const contador = el("contador-tareas"); 
  const pendientes = countPendientes(tareas);
  contador.textContent = pendientes;
}

function mostrarTareas(filtro) {
  const lista = el("lista-tareas");
  const btnTodos = el("filtro-todos");
  const btnPendientes = el("filtro-pendientes");
  const btnCompletadas = el("filtro-completadas");

  lista.innerHTML = "";
  tareas.forEach(tarea => {
    if (
      filtro === "todos" ||
      (filtro === "pendientes" && !tarea.completada) ||
      (filtro === "completadas" && tarea.completada)
    ) {
      renderTarea(tarea);
    }
  });

  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
  if (filtro === "todos") btnTodos.classList.add("activo");
  if (filtro === "pendientes") btnPendientes.classList.add("activo");
  if (filtro === "completadas") btnCompletadas.classList.add("activo");

  actualizarContador();
}

function inicializarApp() {
  const input = el("agregar");
  const btnAgregar = el("btn-agregar");
  const lista = el("lista-tareas");
  const btnLimpiar = el("btn-limpiar");
  const btnTodos = el("filtro-todos");
  const btnPendientes = el("filtro-pendientes");
  const btnCompletadas = el("filtro-completadas");

  if (!input || !btnAgregar || !lista) {
    setTimeout(inicializarApp, 50);
    return;
  }

  if (!btnAgregar.dataset.listenerAdded) {
    btnAgregar.addEventListener("click", agregarTarea);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") agregarTarea();
    });

    btnLimpiar.addEventListener("click", () => {
      tareas = tareas.filter(t => !t.completada);
      document.querySelectorAll(".tarea.completada").forEach(c => c.remove());
      guardarTareas();
      actualizarContador();
    });

    btnTodos.addEventListener("click", () => mostrarTareas("todos"));
    btnPendientes.addEventListener("click", () => mostrarTareas("pendientes"));
    btnCompletadas.addEventListener("click", () => mostrarTareas("completadas"));
    btnAgregar.dataset.listenerAdded = "true";
  }

  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas = tareasGuardadas.filter(t => t.descripcion && t.descripcion.trim());
  tareas.forEach(t => renderTarea(t));
  guardarTareas();
  actualizarContador();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarApp);
} else {
  setTimeout(inicializarApp, 0);
}
