function filmSatinAlinmisMi(id) {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return false;

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) return false;

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) return false;

    return kullanici.satinanlar.some(
        item => item.id === id && item.tip === 'film'
    );
}

// Tüm filmleri göster
function filmleriGoster(liste) {
    const grid = document.getElementById('filmlerGrid');

    grid.innerHTML = '';

    liste.forEach(film => {
        const satinAlindi = filmSatinAlinmisMi(film.id);

        const fiyatAlani = satinAlindi
            ? `<p class="kart-fiyat satin-alindi-yazi">✓ Satın Alındı</p>`
            : `<p class="kart-fiyat">${film.fiyat} ₺</p>`;

        const kart = document.createElement('div');
        kart.className = 'kart';

        kart.innerHTML = `
            <a href="detay.html?id=${film.id}&tip=film">
                <img src="${film.gorsel}" alt="${film.baslik}">
                <div class="kart-bilgi">
                    <span class="kart-puan">⭐ ${film.puan}</span>
                    <h3 class="kart-baslik">${film.baslik}</h3>
                    <p class="kart-meta">${film.yil} • ${film.tur}</p>
                    <p class="kart-sure">${film.sure}</p>
                    ${fiyatAlani}
                </div>
            </a>
        `;

        grid.appendChild(kart);
    });
}

// Filtre butonları
const filtreBtnler = document.querySelectorAll('.filtre-btn');

filtreBtnler.forEach(btn => {
    btn.addEventListener('click', () => {
        filtreBtnler.forEach(b => b.classList.remove('aktif'));
        btn.classList.add('aktif');

        const tur = btn.dataset.tur;

        if (tur === 'hepsi') {
            filmleriGoster(filmler);
        } else {
            const filtered = filmler.filter(f => f.tur === tur);
            filmleriGoster(filtered);
        }
    });
});

// Sayfa açılınca hepsini göster
filmleriGoster(filmler);