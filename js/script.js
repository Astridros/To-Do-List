const input = document.getElementById("agregar");
const btnAgregar = document.getElementById("btn-agregar");
const lista = document.querySelector("ul");
const btnLimpiar = document.getElementById("btn-limpiar");
const contador = document.getElementById("contador-tareas");
const btnTodos = document.getElementById("filtro-todos");
const btnPendientes = document.getElementById("filtro-pendientes");
const btnCompletadas = document.getElementById("filtro-completadas");

let tareas = [];

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

document.addEventListener("DOMContentLoaded", () => {
  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas = tareasGuardadas.filter(tarea => tarea.descripcion && tarea.descripcion.trim() !== "");
  tareas.forEach(tarea => renderTarea(tarea));
  guardarTareas(); 
  actualizarContador();
});

function agregarTarea() {
  const descripcionTarea = input.value.trim();
  if (!descripcionTarea) {
  alert("Ingresa una tarea primero.");
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

btnAgregar.addEventListener("click", agregarTarea);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") agregarTarea();
});

// Funcion para añadir la tarea con el elemneto li
function renderTarea(tarea) {
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

// Eliminar tarea
function eliminarTarea(e) {
  const tareaElemento = e.target.parentNode.parentNode;
  const id = parseInt(tareaElemento.dataset.id);
  tareas = tareas.filter(tarea => tarea.id !== id);
  guardarTareas();
  tareaElemento.remove();
  actualizarContador();
}

// Editar tarea
function editarTarea(e) {
  const tareaElemento = e.target.parentNode.parentNode;
  const id = parseInt(tareaElemento.dataset.id);
  const tarea = tareas.find(tarea => tarea.id === id);
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
      alert("La tarea no puede quedar vacía.");
    }
  }
}

// Contador
function actualizarContador() {
  const pendientes = tareas.filter(tarea => !tarea.completada).length;
  contador.textContent = pendientes;
}

btnLimpiar.addEventListener("click", () => {
  tareas = tareas.filter(tarea => !tarea.completada);
  document.querySelectorAll(".tarea.completada").forEach(completada => completada.remove());
  guardarTareas();
  actualizarContador();
});

// Filtros
btnTodos.addEventListener("click", () => mostrarTareas("todos"));
btnPendientes.addEventListener("click", () => mostrarTareas("pendientes"));
btnCompletadas.addEventListener("click", () => mostrarTareas("completadas"));

function mostrarTareas(filtro) {
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

  document.querySelectorAll(".btn-filtro").forEach(boton => boton.classList.remove("activo"));
  if (filtro === "todos") btnTodos.classList.add("activo");
  if (filtro === "pendientes") btnPendientes.classList.add("activo");
  if (filtro === "completadas") btnCompletadas.classList.add("activo");

  actualizarContador();
}
