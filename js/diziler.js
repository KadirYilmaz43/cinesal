function diziSatinAlinmisMi(id) {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return false;

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) return false;

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) return false;

    return kullanici.satinanlar.some(
        item => item.id === id && item.tip === 'dizi'
    );
}

// Tüm dizileri göster
function dizileriGoster(liste) {
    const grid = document.getElementById('dizilerGrid');

    grid.innerHTML = '';

    liste.forEach(dizi => {
        const satinAlindi = diziSatinAlinmisMi(dizi.id);

        const fiyatAlani = satinAlindi
            ? `<p class="kart-fiyat satin-alindi-yazi">✓ Satın Alındı</p>`
            : `<p class="kart-fiyat">${dizi.fiyat} ₺</p>`;

        const kart = document.createElement('div');
        kart.className = 'kart';

        kart.innerHTML = `
            <a href="detay.html?id=${dizi.id}&tip=dizi">
                <img src="${dizi.gorsel}" alt="${dizi.baslik}">
                <div class="kart-bilgi">
                    <span class="kart-puan">⭐ ${dizi.puan}</span>
                    <h3 class="kart-baslik">${dizi.baslik}</h3>
                    <p class="kart-meta">${dizi.yil} • ${dizi.tur}</p>
                    <p class="kart-sure">${dizi.sezon} Sezon</p>
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
            dizileriGoster(diziler);
        } else {
            const filtered = diziler.filter(d => d.tur.includes(tur));
            dizileriGoster(filtered);
        }
    });
});

// Sayfa açılınca hepsini göster
dizileriGoster(diziler);