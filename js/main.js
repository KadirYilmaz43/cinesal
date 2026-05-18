// Satın alınmış mı kontrol et
function satinAlinmisMi(id, tip) {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return false;

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) return false;

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) return false;

    return kullanici.satinanlar.some(
        item => item.id === id && item.tip === tip
    );
}

// Kart fiyat / satın alındı yazısı
function kartDurumYazisi(id, tip, fiyat) {
    if (satinAlinmisMi(id, tip)) {
        return `<p class="kart-fiyat satin-alindi-yazi">✓ Satın Alındı</p>`;
    }

    return `<p class="kart-fiyat">${fiyat} ₺</p>`;
}

// Film kartlarını oluştur
function filmKartlariniGoster() {
    const grid = document.getElementById('filmKartlari');
    if (!grid) return;

    grid.innerHTML = '';

    filmler.forEach(film => {
        const kart = document.createElement('div');
        kart.className = 'kart';

        kart.innerHTML = `
            <a href="detay.html?id=${film.id}&tip=film">
                <img src="${film.gorsel}" alt="${film.baslik}">
                <div class="kart-bilgi">
                    <span class="kart-puan">⭐ ${film.puan}</span>
                    <h3 class="kart-baslik">${film.baslik}</h3>
                    <p class="kart-meta">${film.yil} • ${film.tur}</p>
                    ${kartDurumYazisi(film.id, 'film', film.fiyat)}
                </div>
            </a>
        `;

        grid.appendChild(kart);
    });
}

// Dizi kartlarını oluştur
function diziKartlariniGoster() {
    const grid = document.getElementById('diziKartlari');
    if (!grid) return;

    grid.innerHTML = '';

    diziler.forEach(dizi => {
        const kart = document.createElement('div');
        kart.className = 'kart';

        kart.innerHTML = `
            <a href="detay.html?id=${dizi.id}&tip=dizi">
                <img src="${dizi.gorsel}" alt="${dizi.baslik}">
                <div class="kart-bilgi">
                    <span class="kart-puan">⭐ ${dizi.puan}</span>
                    <h3 class="kart-baslik">${dizi.baslik}</h3>
                    <p class="kart-meta">${dizi.yil} • ${dizi.tur}</p>
                    <p class="kart-meta">${dizi.sezon} Sezon</p>
                    ${kartDurumYazisi(dizi.id, 'dizi', dizi.fiyat)}
                </div>
            </a>
        `;

        grid.appendChild(kart);
    });
}

// Dropdown aç/kapat
function dropdownToggle(e) {
    e.stopPropagation();

    const dropdown = document.querySelector('.nav-dropdown');

    if (dropdown) {
        dropdown.classList.toggle('acik');
    }
}

// Çıkış yap
function cikisYap() {
    localStorage.removeItem('aktifKullanici');
    window.location.href = 'index.html';
}

// Navbar kullanıcı durumu
function navbarGuncelle() {
    const email = localStorage.getItem('aktifKullanici');
    const navActions = document.querySelector('.nav-actions');

    if (!navActions) return;

    if (email) {
        const kullaniciData = localStorage.getItem('kullanici_' + email);

        if (!kullaniciData) {
            localStorage.removeItem('aktifKullanici');
            window.location.href = 'giris.html';
            return;
        }

        const kullanici = JSON.parse(kullaniciData);

        navActions.innerHTML = `
            <div class="nav-profil">
                <span class="nav-kullanici">👤 ${kullanici.ad}</span>
                <div class="nav-dropdown">
                    <a href="profil.html">Profilim</a>
                    <a href="listem.html">Listem</a>
                    <a href="#" onclick="cikisYap()">Çıkış Yap</a>
                </div>
            </div>
        `;

        document
            .querySelector('.nav-kullanici')
            .addEventListener('click', dropdownToggle);
    } else {
        navActions.innerHTML = `
            <a href="giris.html" class="btn-giris">Giriş Yap</a>
        `;
    }
}

// Dışarı tıklayınca dropdown kapat
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-profil')) {
        const dropdown = document.querySelector('.nav-dropdown');

        if (dropdown) {
            dropdown.classList.remove('acik');
        }
    }
});

// Sayfa yüklenince çalıştır
filmKartlariniGoster();
diziKartlariniGoster();
navbarGuncelle();