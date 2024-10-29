// Variabel global untuk melacak indeks event yang sedang diedit
let currentEditIndex = null;

// Fungsi untuk menambah event baru atau memperbarui event yang diedit di localStorage dan memperbarui tabel
function tambahProduk() {
  const nama = document.getElementById("nama").value.trim();
  const deskripsi = document.getElementById("deskripsi").value.trim();
  const gambar = document.getElementById("gambar").files[0];

  // Validasi input
  if (!nama || !deskripsi || (!gambar && currentEditIndex === null)) {
    alert("Harap lengkapi semua data!");
    return;
  }

  let events = JSON.parse(localStorage.getItem("events")) || [];

  if (currentEditIndex !== null) {
    // Mode edit: update event yang sudah ada
    const eventToUpdate = events[currentEditIndex];

    eventToUpdate.nama = nama;
    eventToUpdate.deskripsi = deskripsi;

    if (gambar) {
      const reader = new FileReader();
      reader.onload = function (e) {
        eventToUpdate.gambar = e.target.result;
        simpanData(events);
        alert("Event diperbarui!");
      };
      reader.readAsDataURL(gambar);
    } else {
      simpanData(events);
      alert("Event diperbarui!");
    }
  } else {
    // Mode tambah: tambahkan event baru
    const reader = new FileReader();
    reader.onload = function (e) {
      const newEvent = {
        nama,
        deskripsi,
        gambar: e.target.result,
      };
      events.push(newEvent);
      simpanData(events);
      alert("Event ditambahkan!");
    };
    reader.readAsDataURL(gambar);
  }

  bersihkanForm();
}

// Fungsi untuk menyimpan data di localStorage dan memperbarui tabel
function simpanData(events) {
  localStorage.setItem("events", JSON.stringify(events));
  perbaruiTabel(events);
}

// Fungsi untuk memperbarui tabel dengan data dari localStorage
function perbaruiTabel(events) {
  const display = document.getElementById("display");
  display.innerHTML = "";

  events.forEach((event, index) => {
    display.innerHTML += `
  <tr>
    <td>${index + 1}</td>
    <td>${event.nama}</td>
    <td>${event.deskripsi}</td>
    <td>
      <button class="btn btn-warning m-1" onclick="editEvent(${index})">Edit</button>
      <button class="btn btn-danger m-1" onclick="hapusEvent(${index})">Delete</button>
    </td>
  </tr>
`;
  });
}

// Fungsi untuk mengisi form dengan data event yang akan diedit
function editEvent(index) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const event = events[index];

  document.getElementById("nama").value = event.nama;
  document.getElementById("deskripsi").value = event.deskripsi;
  currentEditIndex = index;

  // Ubah tombol tambah menjadi "Update Event" saat dalam mode edit
  document.getElementById("tambahEventButton").textContent = "Update Event";
}

// Fungsi untuk menghapus event berdasarkan indeks
function hapusEvent(index) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.splice(index, 1);
  simpanData(events);
  alert("Event dihapus!");
}

// Fungsi untuk membersihkan form dan reset mode edit
function bersihkanForm() {
  document.getElementById("nama").value = "";
  document.getElementById("deskripsi").value = "";
  document.getElementById("gambar").value = "";
  currentEditIndex = null;

  // Kembalikan tombol ke "Tambah Event" setelah selesai edit atau dibersihkan
  document.getElementById("tambahEventButton").textContent = "Tambah Event";
}

// Fungsi untuk logout (dummy function)
function logout() {
  if (confirm("Apakah anda ingin Logout?")) {
    window.location.href = "login.html";
  }
}

// Fungsi untuk kembali ke halaman tampilkan event
function kembali() {
  window.location.href = "index.html";
}

// Fungsi untuk menampilkan events di halaman tampilkan.html
function tampilkanEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const eventCards = document.getElementById("eventCards");

  if (!eventCards) return;

  eventCards.innerHTML = "";
  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="card">
        <img src="${event.gambar}" class="card-img-top" alt="Gambar Event">
        <div class="card-body">
          <h5 class="card-title">${event.nama}</h5>
          <p class="card-text">${event.deskripsi}</p>
        </div>
      </div>
    `;
    eventCards.appendChild(card);
  });
}

// Saat halaman dimuat, perbarui tabel dengan data dari localStorage
window.onload = function () {
  const events = JSON.parse(localStorage.getItem("events")) || [];

  if (document.getElementById("display")) {
    perbaruiTabel(events);
  }

  if (document.getElementById("eventCards")) {
    tampilkanEvents();
  }
};

// Fungsi untuk mencari events berdasarkan nama atau deskripsi
function searchEvents() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const filteredEvents = events.filter(
    (event) =>
      event.nama.toLowerCase().includes(searchTerm) ||
      event.deskripsi.toLowerCase().includes(searchTerm)
  );

  const eventCards = document.getElementById("eventCards");
  if (!eventCards) return;

  eventCards.innerHTML = "";
  filteredEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="card">
        <img src="${event.gambar}" class="card-img-top" alt="Gambar Event">
        <div class="card-body">
          <h5 class="card-title">${event.nama}</h5>
          <p class="card-text">${event.deskripsi}</p>
        </div>
      </div>
    `;
    eventCards.appendChild(card);
  });
}

// Fungsi untuk menangani login
function loginUser(event) {
  event.preventDefault(); // Mencegah pengiriman formulir secara default

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Validasi dasar (Anda bisa menambahkan pemeriksaan yang lebih spesifik di sini)
  if (username === "" || password === "") {
    alert("Silakan masukkan username dan password.");
    return false;
  }

  // Simulasi login (ganti dengan logika otentikasi yang sebenarnya)
  if (username === "admin" && password === "admin123") {
    alert("Login berhasil!");
    // Alihkan ke halaman berikutnya, misalnya dashboard
    window.location.href = "index.html";
  } else {
    alert("Username atau password salah!");
  }
  return false; // Mencegah pengiriman formulir
}
