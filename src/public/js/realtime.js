// src/public/js/realtime.js
const socket = io();

// Función para "escapar" texto antes de inyectar en el DOM
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Renderizar lista de productos
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

// Escuchar evento 'productos' desde el servidor
socket.on('productos', (productos) => {
  renderProducts(productos);
});

// Manejar formulario para crear producto (envía por socket)
const form = document.getElementById('formProducto');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const product = {
      title: formData.get('title'),
      price: Number(formData.get('price')),
      description: formData.get('description') || ''
    };
    socket.emit('nuevoProducto', product);
    form.reset();
  });
}

// Delegación para botones "Eliminar"
document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn-delete')) {
    const id = e.target.dataset.id;
    socket.emit('eliminarProducto', id);
  }
});
