const apiKey = "004c7616c5862f8c4a3a317fb1e1a723";

// Función para cargar datos de un div
function cargarElemento(div) {
  const id = div.getAttribute("data-id");
  const tipo = div.getAttribute("data-type") || "tv";
  const baseUrl = `https://api.themoviedb.org/3/${tipo}/${id}`;

  fetch(`${baseUrl}?api_key=${apiKey}&language=es-ES`)
    .then(res => res.json())
    .then(data => {
      const poster = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
      const titulo = tipo === "movie" ? data.title : data.name;
      const año = (tipo === "movie" ? data.release_date : data.first_air_date)?.slice(0, 4) || "Año no disponible";

      div.innerHTML = `
        <div class="puntuacion">${data.vote_average?.toFixed(1) || 'N/A'}</div>
        <img src="${poster}" alt="${titulo}" />
        <h4>${titulo}</h4>
        <p>${año}</p>
      `;
    })
    .catch(err => {
      div.innerHTML = "<p>Error al cargar contenido</p>";
      console.error("Error TMDB:", err);
    });
}

// Cargar elementos iniciales
document.querySelectorAll(".media-item").forEach(cargarElemento);

// Selector de tipo: muestra solo las secciones del tipo seleccionado
document.querySelectorAll(".tipo").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tipo").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tipoSeleccionado = btn.getAttribute("data-type");

    document.querySelectorAll("section.categoria").forEach(section => {
      section.style.display = section.getAttribute("data-type") === tipoSeleccionado ? "block" : "none";
    });

    document.getElementById("searchResults").style.display = "none"; // Ocultar búsqueda si cambio tipo
  });
});

// Buscador
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const tipo = document.querySelector(".tipo.active").getAttribute("data-type");
  const url = `https://api.themoviedb.org/3/search/${tipo}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es-ES`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("resultsContainer");
      container.innerHTML = "";

      if (data.results.length === 0) {
        container.innerHTML = "<p style='color:white;'>No se encontraron resultados para esa búsqueda.</p>";
      } else {
        data.results.forEach(item => {
          const div = document.createElement("div");
          div.classList.add("media-item");
          const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "";
          const titulo = tipo === "movie" ? item.title : item.name;
          const año = (tipo === "movie" ? item.release_date : item.first_air_date)?.slice(0, 4) || "Año no disponible";

          div.innerHTML = `
            <div class="puntuacion">${item.vote_average?.toFixed(1) || 'N/A'}</div>
            <img src="${poster}" alt="${titulo}" />
            <h4>${titulo}</h4>
            <p>${año}</p>
          `;
          container.appendChild(div);
        });
      }

      // Mostrar sección resultados, ocultar secciones normales
      document.querySelectorAll("section.categoria").forEach(section => {
        section.style.display = "none";
      });
      document.getElementById("searchResults").style.display = "block";
    })
    .catch(err => {
      console.error("Error en búsqueda:", err);
    });
});
