document.getElementById("showForm").addEventListener("click", showFunctionSheet);
document.getElementById("showRooms").addEventListener("click", showRooms);

function showFunctionSheet() {
  document.getElementById("app").innerHTML = `
    <section class="function-sheet">
      <h2>Crear Evento</h2>
      <form id="eventForm">
        <div class="form-group">
          <label for="eventName">Nombre del evento</label>
          <input type="text" id="eventName" name="eventName" placeholder="Ej: Conferencia de Ventas" />
        </div>

        <div class="form-group">
          <label for="setupStyle">Estilo de montaje</label>
          <select id="setupStyle" name="setupStyle">
            <option value="cabaret">Cabaret</option>
            <option value="teatro">Teatro</option>
            <option value="banquete">Banquete</option>
          </select>
        </div>

        <div class="form-group">
          <label for="notes">Notas adicionales</label>
          <textarea id="notes" name="notes" rows="4" placeholder="Detalles importantes..."></textarea>
        </div>

        <button type="submit" class="btn">Guardar Evento</button>
      </form>
    </section>
  `;
}




function showRooms() {
  document.getElementById("app").innerHTML = `
    <h2>Salas</h2>
    <p>Aquí se mostrarán las salas con sus tareas.</p>
  `;
}

document.getElementById("showTimeline")?.addEventListener("click", showTimeline);

let timelineEntries = [];

function showTimeline() {
  document.getElementById("app").innerHTML = `
    <section class="fb-timeline">
    <h2>Food and Beverage Timeline</h2>
      <table id="timelineTable">
  <thead>
    <tr>
      <th>Time</th>
      <th>Room</th>
      <th>F&B</th>
      <th></th>
    </tr>
  </thead>
        <tbody></tbody>
      </table>
      <button id="openModalBtn" class="btn">New task</button>

    <div id="timelineModal" class="modal hidden">
      <div class="modal-content">
        <span id="closeModalBtn" class="close">&times;</span>
      <form id="timelineForm">
        <div class="form-group">
          <label for="time">Time</label>
          <input type="time" id="time" required>
          <div class="preset-times" id="presetTimes"></div>
        </div>

        <div class="form-group">
  <label>Room</label>
  <div class="preset-rooms">
    <span class="room-tag" data-value="marker-suit-room">Marker Suit</span>
    <span class="room-tag" data-value="pfa-room">Pre Function Area</span>
    <span class="room-tag" data-value="carnac-room">The Carnac</span>
    <span class="room-tag" data-value="omer-room">The Omer</span>
    <span class="room-tag" data-value="hibernia-room">The Hibernia</span>
    <span class="room-tag" data-value="shannon-room">The Shannon</span>
  </div>
</div>


<div class="form-group">
<label for="details">Food and Beverage</label>
<input type="text" id="details" placeholder="Ej: Coffee Break" required>

<div class="preset-tags">
  <span class="tag">☕️ Coffee Break</span>
  <span class="tag">🥐  Pastries</span>
  <span class="tag">🍪  Cookies</span>
  <span class="tag">🍥  Scones</span>
  <span class="tag">💩  Brownies</span>
  <span class="tag">🥝  Fruit Skewers</span>
  <span class="tag">🍽️  LUNCH</span>
</div>
</div>

        <button type="submit" class="btn">Add</button>
      </form>
      </div>
</div>
    </section>

  `;

  // Modal
const modal = document.getElementById("timelineModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

openModalBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});


  const presetTimesContainer = document.getElementById("presetTimes");

function pad(n) {
  return n.toString().padStart(2, "0");
}

for (let h = 7; h <= 16; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hour = `${pad(h)}:${pad(m)}`;
    const btn = document.createElement("button");
    btn.className = "time-btn";
    btn.textContent = hour;
    btn.type = "button";
    btn.addEventListener("click", () => {
      document.getElementById("time").value = hour;
    });
    presetTimesContainer.appendChild(btn);
    if (h === 16 && m === 30) break; // última: 16:30
  }
}


  document.getElementById("timelineForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const time = document.getElementById("time").value;
    if (!selectedRoom) {
      alert("Por favor selecciona una sala.");
      return;
    }
    
    const room = selectedRoom;
    const roomLabel = document.querySelector(`.room-tag[data-value="${room}"]`).textContent;
    
    const details = document.getElementById("details").value;

    timelineEntries.push({ time, room, roomLabel, details });
    timelineEntries.sort((a, b) => a.time.localeCompare(b.time));
    renderTimeline();
    // Limpiar campos después de añadir
document.getElementById("time").value = "";
document.getElementById("details").value = "";

// Deseleccionar sala
document.querySelectorAll(".room-tag").forEach(t => t.classList.remove("active"));
selectedRoom = "";

// Cerrar modal
document.getElementById("timelineModal").classList.add("hidden");
  });

  let selectedRoom = "";

document.querySelectorAll(".preset-rooms .room-tag").forEach(tag => {
  tag.addEventListener("click", () => {
    // Si haces clic en el mismo activo → lo deseleccionas
    if (tag.classList.contains("active")) {
      tag.classList.remove("active");
      selectedRoom = "";
    } else {
      // Quitar selección anterior
      document.querySelectorAll(".room-tag").forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      selectedRoom = tag.getAttribute("data-value");
    }
  });
});

  // Activar presets
  document.querySelectorAll(".preset-tags .tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const input = document.getElementById("details");
      const current = input.value.trim();
      const newTag = tag.textContent;

      // Añade coma si ya hay texto
      input.value = current ? current + ", " + newTag : newTag;
    });
  });
}

function renderTimeline() {
  const tbody = document.querySelector("#timelineTable tbody");
  tbody.innerHTML = "";
  timelineEntries.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.time}</td>
      <td class="room-${entry.room}">${entry.roomLabel}</td>
      <td>${entry.details}</td>
    `;
    //row.classList.add("room-" + entry.room);
    tbody.appendChild(row);
  });
}

function renderTimeline() {
  const tbody = document.querySelector("#timelineTable tbody");
  tbody.innerHTML = "";

  timelineEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.time}</td>
      <td class="room-${entry.room}">${entry.roomLabel}</td>
      <td>${entry.details}</td>
      <td><button class="delete-btn" data-index="${index}">x</button></td>
    `;
    //row.classList.add("room-" + entry.room);
    tbody.appendChild(row);
  });

  // Activar los botones de borrar
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", e => {
      const index = e.target.getAttribute("data-index");
      timelineEntries.splice(index, 1);
      renderTimeline();
    });
  });
}






