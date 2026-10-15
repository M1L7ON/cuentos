// Filtra las historias por categoría
function filtrarCategoria(categoria) {
    const tarjetas = document.querySelectorAll(".historia");

    tarjetas.forEach(function(tarjeta) {
        if (categoria === "Todos" || tarjeta.dataset.tipo === categoria) {
            tarjeta.style.display = "";
        } else {
            tarjeta.style.display = "none";
        }
    });

    document.getElementById("busqueda").value = "";
    document.getElementById("mensaje").textContent =
        categoria === "Todos"
        ? "Mostrando todas las historias."
        : "Categoría seleccionada: " + categoria;

    document.getElementById("sin-resultados").hidden =
        document.querySelectorAll(".historia:not([style*='display: none'])").length > 0;

    document.getElementById("destacados").scrollIntoView({
        behavior: "smooth"
    });
}


// Filtra las historias por departamento
function filtrarDepartamento(departamento) {
    const tarjetas = document.querySelectorAll(".historia");

    tarjetas.forEach(function(tarjeta) {
        if (departamento === "Todos" ||
            tarjeta.dataset.departamento === departamento) {
            tarjeta.style.display = "";
        } else {
            tarjeta.style.display = "none";
        }
    });

    document.getElementById("busqueda").value = "";
    document.getElementById("mensaje").textContent =
        departamento === "Todos"
        ? "Mostrando todos los departamentos."
        : "Departamento seleccionado: " + departamento;

    document.getElementById("sin-resultados").hidden =
        document.querySelectorAll(".historia:not([style*='display: none'])").length > 0;

    document.getElementById("destacados").scrollIntoView({
        behavior: "smooth"
    });
}


// Busca historias en todas las páginas indicadas
function buscarHistorias() {
    const entrada = document.getElementById("busqueda");
    const mensaje = document.getElementById("mensaje");
    const resultados = document.getElementById("resultados-busqueda");

    if (!entrada || !mensaje || !resultados) return;

    const palabra = entrada.value.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    resultados.innerHTML = "";

    if (palabra === "") {
        mensaje.textContent = "Escribe un cuento, mito o leyenda para buscar.";
        return;
    }

    const paginaActual = window.location.pathname.split("/").pop() || "index.html";
    const paginasSeccion = ["1cuentos.html", "1mitos.html", "1leyendas.html"];
    let historias = indiceHistorias || [];

    // En las páginas de categoría, buscar solamente en esa categoría.
    if (paginasSeccion.includes(paginaActual) || paginaActual.startsWith("D")) {
        historias = historias.filter(h => h.pagina === paginaActual);
    }

    const encontradas = historias.filter(h => {
        const texto = (h.titulo + " " + h.texto + " " + h.departamento + " " + h.tipo)
            .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return texto.includes(palabra);
    });

    encontradas.forEach(h => {
        const enlace = document.createElement("a");
        enlace.className = "resultado-historia";
        enlace.textContent = h.titulo + (h.departamento ? " · " + h.departamento : "");
        enlace.href = h.pagina;
        resultados.appendChild(enlace);
    });

    mensaje.textContent = encontradas.length > 0
        ? "Resultados encontrados: " + encontradas.length
        : "No se encontraron historias con esa palabra.";
}

// Abre una ventana con información de la historia
function leerHistoria(titulo, descripcion) {
    document.getElementById("tituloHistoria").textContent = titulo;

    document.getElementById("textoHistoria").textContent =
        descripcion +
        " Este relato forma parte de la riqueza cultural que se transmite de generación en generación.";

    const ventana = new bootstrap.Modal(
        document.getElementById("ventanaHistoria")
    );

    ventana.show();
}


// Lleva al reproductor cuando se presiona Audiolibros
function mostrarAudio() {
    document.getElementById("audio").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("reproductor").focus();
}
// Iconos regionales para todas las tarjetas del repositorio
function colocarIconosRegionales() {
    const regiones = {
        "la paz": "🏔️", "oruro": "🏔️", "potosí": "🏔️", "potosi": "🏔️",
        "cochabamba": "🌿", "chuquisaca": "🌿", "tarija": "🌿",
        "santa cruz": "🌴", "beni": "🌴", "pando": "🌴"
    };

    document.querySelectorAll(".historia, .tarjeta, article").forEach(tarjeta => {
        const etiqueta = tarjeta.querySelector(".etiqueta");
        const icono = tarjeta.querySelector(".icono-imagen");
        if (!icono) return;

        // Primero busca el departamento indicado en la etiqueta de la tarjeta.
        let texto = etiqueta ? etiqueta.textContent.toLowerCase() : "";
        if (!texto) texto = tarjeta.textContent.toLowerCase();

        for (const departamento in regiones) {
            if (texto.includes(departamento)) {
                icono.textContent = regiones[departamento];
                break;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", colocarIconosRegionales);
