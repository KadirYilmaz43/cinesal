// Giriş kontrolü
const email = localStorage.getItem('aktifKullanici');
if (!email) {
    window.location.href = 'giris.html';
}

const kullaniciData = localStorage.getItem('kullanici_' + email);
const kullanici = JSON.parse(kullaniciData);

// Listeyi göster
function listemiGoster() {
    const grid = document.getElementById('listemGrid');
    const bosMesaj = document.getElementById('bosListeMesaj');

    if (kullanici.listem.length === 0) {
        bosMesaj.classList.remove('gizli');
        return;
    }

    kullanici.listem.forEach(icerik => {
        const kart = document.createElement('div');
        kart.className = 'kart';
        kart.innerHTML = `
            <a href="detay.html?id=${icerik.id}&tip=${icerik.tip}">
                <img src="${icerik.gorsel}" alt="${icerik.baslik}">
                <div class="kart-bilgi">
                    <span class="kart-puan">⭐ ${icerik.puan}</span>
                    <h3 class="kart-baslik">${icerik.baslik}</h3>
                    <p class="kart-meta">${icerik.yil} • ${icerik.tur}</p>
                    <p class="kart-fiyat">${icerik.fiyat} ₺</p>
                </div>
            </a>
            <button class="btn-listeden-cikar" onclick="listeCikar(${icerik.id}, '${icerik.tip}')">
                ✕ Listeden Çıkar
            </button>
        `;
        grid.appendChild(kart);
    });
}

// Listeden çıkar
function listeCikar(id, tip) {
    kullanici.listem = kullanici.listem.filter(
        i => !(i.id === id && i.tip === tip)
    );
    localStorage.setItem('kullanici_' + email, JSON.stringify(kullanici));
    window.location.reload();
}

listemiGoster();