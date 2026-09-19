document.addEventListener('DOMContentLoaded', () => {
  // Tema
  initTheme();

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Filtros
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      setFilter(button.dataset.filter);
    });
  });

  // Añadir / editar
  document.getElementById('typeEvento')
    .addEventListener('click', () => setType('evento'));

  document.getElementById('typeEntrega')
    .addEventListener('click', () => setType('entrega'));

  document.getElementById('addBtn')
    .addEventListener('click', openAddSheet);

  document.getElementById('cancelBtn')
    .addEventListener('click', () => {
      editOverlay.classList.remove('open');
    });

  editOverlay.addEventListener('click', closeOverlayOnBackdrop);

  document.getElementById('saveBtn')
    .addEventListener('click', saveCurrentItem);

  // Detalle
  detailOverlay.addEventListener('click', closeOverlayOnBackdrop);

  document.getElementById('detailEditBtn')
    .addEventListener('click', editCurrentDetail);

  document.getElementById('detailDoneBtn')
    .addEventListener('click', toggleDelivered);

  document.getElementById('detailDeleteBtn')
    .addEventListener('click', deleteCurrentItem);

  // Datos iniciales
  items = loadItems();
  render();
});
