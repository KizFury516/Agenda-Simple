let items = [];
let currentFilter = 'todo';
let editingId = null;
let newType = 'evento';
let detailId = null;

const editOverlay = document.getElementById('editOverlay');
const detailOverlay = document.getElementById('detailOverlay');

function formatDayLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const diff = Math.round((date - today) / 86400000);

  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';

  if (diff < 0) {
    return 'Pasado · ' + date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  }

  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function render() {
  const list = document.getElementById('list');

  const filtered = items
    .filter(item =>
      currentFilter === 'todo' ? true : item.tipo === currentFilter
    )
    .sort((a, b) =>
      (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
    );

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="5" width="18" height="16" rx="3"/>
          <path d="M8 3v4M16 3v4M3 10h18"/>
        </svg>
        <p class="title">Nada por aquí</p>
        <p>Pulsa el botón + para añadir tu primer evento o entrega.</p>
      </div>
    `;
    return;
  }

  const groups = {};

  filtered.forEach(item => {
    if (!groups[item.fecha]) {
      groups[item.fecha] = [];
    }

    groups[item.fecha].push(item);
  });

  let html = '';

  Object.keys(groups).sort().forEach(fecha => {
    html += `
      <div class="day-group">
        <p class="day-label">${formatDayLabel(fecha)}</p>
    `;

    groups[fecha].forEach(item => {
      const isEntrega = item.tipo === 'entrega';
      const doneClass = item.entregado ? 'done' : '';
      const metaText = isEntrega ? (item.asignatura || '') : (item.lugar || '');

      html += `
        <div class="item-card" data-id="${item.id}">
          <span class="item-dot ${item.tipo}"></span>

          <div class="item-body">
            <p class="item-title ${doneClass}">
              ${escapeHtml(item.titulo)}
            </p>

            <div class="item-meta">
              <span class="tag ${item.tipo}">
                ${isEntrega ? 'Entrega' : 'Evento'}
              </span>

              ${metaText
                ? '<span>' + escapeHtml(metaText) + '</span>'
                : ''
              }
            </div>
          </div>

          <span class="item-time">${item.hora || ''}</span>
        </div>
      `;
    });

    html += '</div>';
  });

  list.innerHTML = html;

  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

function setFilter(filter) {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });

  currentFilter = filter;
  render();
}

/* =========================
   Sección opcional desplegable
   ========================= */

function setOptionalSection(open) {
  const content = document.getElementById('optionalContent');
  const toggleBtn = document.getElementById('optionalToggleBtn');
  const label = document.getElementById('optionalToggleLabel');

  content.classList.toggle('open', open);
  toggleBtn.classList.toggle('open', open);
  label.textContent = open ? 'Ocultar detalles opcionales' : 'Añadir detalles opcionales';
}

function toggleOptionalSection() {
  const isOpen = document.getElementById('optionalContent').classList.contains('open');
  setOptionalSection(!isOpen);
}

/* =========================
   Validación de campos
   ========================= */

function clearFieldError(inputId, errorId) {
  document.getElementById(inputId).classList.remove('invalid');
  document.getElementById(errorId).parentElement.classList.remove('has-error');
}

function setFieldError(inputId, errorId) {
  document.getElementById(inputId).classList.add('invalid');
  document.getElementById(errorId).parentElement.classList.add('has-error');
}

function clearAllFieldErrors() {
  clearFieldError('inpTitulo', 'errorTitulo');
  clearFieldError('inpFecha', 'errorFecha');
}

/* =========================
   Añadir / editar
   ========================= */

function openAddSheet() {
  editingId = null;
  newType = 'evento';

  document.getElementById('sheetTitle').textContent = 'Nuevo elemento';

  setType('evento');
  clearAllFieldErrors();
  setOptionalSection(false);

  document.getElementById('inpTitulo').value = '';
  document.getElementById('inpFecha').value =
    new Date().toISOString().slice(0, 10);
  document.getElementById('inpHora').value = '';
  document.getElementById('inpLugar').value = '';
  document.getElementById('inpAsignatura').value = '';

  editOverlay.classList.add('open');
}

function openEditSheet(item) {
  editingId = item.id;
  newType = item.tipo;

  document.getElementById('sheetTitle').textContent = 'Editar elemento';

  setType(item.tipo);
  clearAllFieldErrors();

  document.getElementById('inpTitulo').value = item.titulo;
  document.getElementById('inpFecha').value = item.fecha;
  document.getElementById('inpHora').value = item.hora;
  document.getElementById('inpLugar').value = item.lugar || '';
  document.getElementById('inpAsignatura').value = item.asignatura || '';

  const hasOptionalValue =
    (item.tipo === 'entrega' && item.asignatura) ||
    (item.tipo === 'evento' && item.lugar);

  setOptionalSection(Boolean(hasOptionalValue));

  editOverlay.classList.add('open');
}

function setType(type) {
  newType = type;

  document.getElementById('typeEvento')
    .classList.toggle('active', type === 'evento');

  document.getElementById('typeEntrega')
    .classList.toggle('active', type === 'entrega');

  document.getElementById('fieldAsignatura').style.display =
    type === 'entrega' ? 'block' : 'none';

  document.getElementById('fieldLugar').style.display =
    type === 'evento' ? 'block' : 'none';

  document.getElementById('labelTitulo').textContent =
    type === 'entrega' ? 'Título del trabajo' : 'Título';

  document.getElementById('inpTitulo').placeholder =
    type === 'entrega'
      ? 'Ej. Trabajo final'
      : 'Ej. Reunión con tutor';
}

function saveCurrentItem() {
  const tituloInput = document.getElementById('inpTitulo');
  const fechaInput = document.getElementById('inpFecha');

  const titulo = tituloInput.value.trim();
  const fecha = fechaInput.value;
  const hora = document.getElementById('inpHora').value;

  clearAllFieldErrors();

  let hasError = false;

  if (!titulo) {
    setFieldError('inpTitulo', 'errorTitulo');
    hasError = true;
  }

  if (!fecha) {
    setFieldError('inpFecha', 'errorFecha');
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const lugar = document.getElementById('inpLugar').value.trim();
  const asignatura = document.getElementById('inpAsignatura').value.trim();

  if (editingId) {
    const index = items.findIndex(item => item.id === editingId);

    if (index > -1) {
      items[index] = {
        ...items[index],
        tipo: newType,
        titulo,
        fecha,
        hora,
        lugar,
        asignatura
      };
    }
  } else {
    items.push({
      id:
        'id_' +
        Date.now() +
        '_' +
        Math.random().toString(36).slice(2, 7),
      tipo: newType,
      titulo,
      fecha,
      hora,
      lugar,
      asignatura,
      entregado: false
    });
  }

  saveItems(items);
  editOverlay.classList.remove('open');
  render();
}

function openDetail(id) {
  const item = items.find(item => item.id === id);

  if (!item) return;

  detailId = id;

  document.getElementById('detailTitle').textContent = item.titulo;

  const isEntrega = item.tipo === 'entrega';

  let body =
    `<strong style="color:var(--text)">${isEntrega ? 'Entrega' : 'Evento'}</strong><br>`;

  body +=
    `${formatDayLabel(item.fecha)}${item.hora ? ' · ' + item.hora : ''}<br>`;

  if (isEntrega && item.asignatura) {
    body += `Asignatura: ${escapeHtml(item.asignatura)}<br>`;
  }

  if (!isEntrega && item.lugar) {
    body += `Lugar: ${escapeHtml(item.lugar)}<br>`;
  }

  if (isEntrega) {
    body += `Estado: ${item.entregado ? 'Entregado' : 'Pendiente'}`;
  }

  document.getElementById('detailBody').innerHTML = body;

  const doneBtn = document.getElementById('detailDoneBtn');

  doneBtn.style.display = isEntrega ? 'block' : 'none';
  doneBtn.textContent =
    item.entregado ? 'Marcar como pendiente' : 'Marcar entregado';

  detailOverlay.classList.add('open');
}

function toggleDelivered() {
  const index = items.findIndex(item => item.id === detailId);

  if (index === -1) return;

  items[index].entregado = !items[index].entregado;

  saveItems(items);
  detailOverlay.classList.remove('open');
  render();
}

function deleteCurrentItem() {
  if (!confirm('¿Eliminar este elemento?')) return;

  items = items.filter(item => item.id !== detailId);

  saveItems(items);
  detailOverlay.classList.remove('open');
  render();
}

function editCurrentDetail() {
  const item = items.find(item => item.id === detailId);

  detailOverlay.classList.remove('open');

  if (item) {
    openEditSheet(item);
  }
}

function closeOverlayOnBackdrop(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.classList.remove('open');
  }
}