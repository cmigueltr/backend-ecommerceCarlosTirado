const socket = io();

// Escapar texto
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Renderizar productos
function renderProducts(products) {
  const lista = document.getElementById('listaProductos');
  if (!lista) return;
  lista.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `
      <strong>${escapeHtml(p.title)}</strong> — $${p.price}
      <button class="btn-delete" data-id="${p.id}">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

// Escuchar productos desde servidor
socket.on('productos', (productos) => {
  renderProducts(productos);
});

// Mostrar errores del servidor
socket.on('error', (msg) => {
  alert(msg);
});

// Agregar producto desde formulario
const form = document.getElementById('formProducto');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const price = Number(form.price.value);
    const description = form.description.value.trim();

    if (!title || isNaN(price) || price <= 0) {
      alert('Debe ingresar un título y un precio válido.');
      return;
    }

    const product = { title, price, description };
    socket.emit('nuevoProducto', product);
    form.reset();
  });
}

// Eliminar producto con delegación
document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn-delete')) {
    const id = e.target.dataset.id;
    if (!id) return;
    socket.emit('eliminarProducto', id);
  }
});
