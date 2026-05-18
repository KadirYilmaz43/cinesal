// URL'den id ve tip al
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
const tip = params.get('tip') || 'film';

// İçeriği bul
const icerik = tip === 'dizi'
    ? diziler.find(d => d.id === id)
    : filmler.find(f => f.id === id);

// İçerik yoksa sayfayı durdur
if (!icerik) {
    document.querySelector('.detay-section').innerHTML =
        '<p style="text-align:center;padding:60px;color:#aaa">İçerik bulunamadı.</p>';

    throw new Error('İçerik bulunamadı');
}

// Trailer linkleri
const trailerler = {
    film: {
        1: "https://www.youtube.com/embed/zSWdZVtXT7E",
        2: "https://www.youtube.com/embed/EXeTwQWrcwY",
        3: "https://www.youtube.com/embed/YoHD9XEInc0",
        4: "https://www.youtube.com/embed/owK1qxDselE",
        5: "https://www.youtube.com/embed/vKQi3bBA1y8",
        6: "https://www.youtube.com/embed/5xH0HfJHsaY"
    },
    dizi: {
        1: "https://www.youtube.com/embed/HhesaQXLuRY",
        2: "https://www.youtube.com/embed/bjqS8of7v34",
        3: "https://www.youtube.com/embed/b9EkMc79ZSU",
        4: "https://www.youtube.com/embed/rrwycJ08PSA",
        5: "https://www.youtube.com/embed/s9APLXM9Ei8",
        6: "https://www.youtube.com/embed/oVzVdvGIC7U"
    }
};

// Aktif kullanıcı ve kullanıcıya özel sepet key'i
const aktifEmail = localStorage.getItem('aktifKullanici');
const sepetKey = aktifEmail ? 'sepet_' + aktifEmail : null;

// Sayfayı doldur
document.getElementById('detayBaslik').textContent = icerik.baslik;
document.getElementById('detayGorsel').src = icerik.gorsel;
document.getElementById('detayGorsel').alt = icerik.baslik;
document.getElementById('detayAciklama').textContent = icerik.aciklama;
document.getElementById('detayFiyat').textContent = icerik.fiyat + ' ₺';
document.getElementById('detayTrailer').src = trailerler[tip]?.[id] || '';

// Meta bilgi
const meta = tip === 'dizi'
    ? `${icerik.yil} • ${icerik.tur} • ${icerik.sezon} Sezon`
    : `${icerik.yil} • ${icerik.tur} • ${icerik.sure}`;

document.getElementById('detayMeta').textContent = meta;

// Badges
document.getElementById('detayBadges').innerHTML = `
    <span class="badge badge-red">HD</span>
    <span class="badge">IMDB ${icerik.puan}</span>
`;

// Sayfa açılınca satın alınmış mı kontrol et
satinalinmisMiKontrolEt();

function satinalinmisMiKontrolEt() {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return;

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) return;

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) {
        kullanici.satinanlar = [];
        localStorage.setItem('kullanici_' + email, JSON.stringify(kullanici));
    }

    const satinAlindi = kullanici.satinanlar.some(
        item => item.id === id && item.tip === tip
    );

    if (satinAlindi) {
    document.querySelector('.detay-butonlar').innerHTML = `
        <button type="button" class="btn-primary" onclick="icerigiIzle()">
            ▶ İzle
        </button>
    `;

    document.getElementById('detayFiyat').style.display = 'none';
    }
}

// Listeye ekle
function listeyeEkle() {
    const email = localStorage.getItem('aktifKullanici');
    const mesaj = document.getElementById('detayMesaj');

    if (!email) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Listeye eklemek için giriş yapmalısın!';
        return;
    }

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Kullanıcı bilgisi bulunamadı!';
        return;
    }

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.listem)) {
        kullanici.listem = [];
    }

    const zatenVar = kullanici.listem.some(
        item => item.id === id && item.tip === tip
    );

    if (zatenVar) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Bu içerik zaten listende!';
        return;
    }

    kullanici.listem.push({
        id: icerik.id,
        tip: tip,
        baslik: icerik.baslik,
        gorsel: icerik.gorsel,
        puan: icerik.puan,
        yil: icerik.yil,
        tur: icerik.tur,
        fiyat: icerik.fiyat
    });

    localStorage.setItem('kullanici_' + email, JSON.stringify(kullanici));

    mesaj.className = 'form-mesaj basari';
    mesaj.textContent = 'Listene eklendi! ✓';
}

// Sepete ekle
function sepeteEkle() {
    const email = localStorage.getItem('aktifKullanici');
    const mesaj = document.getElementById('detayMesaj');

    if (!email) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Satın almak için giriş yapmalısın!';
        return;
    }

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Kullanıcı bilgisi bulunamadı!';
        return;
    }

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) {
        kullanici.satinanlar = [];
    }

    // Daha önce satın alınmış mı?
    const dahaOnceSatinAlindi = kullanici.satinanlar.some(
        item => item.id === id && item.tip === tip
    );

    if (dahaOnceSatinAlindi) {
        mesaj.className = 'form-mesaj basari';
        mesaj.textContent = '✓ Bu içeriği zaten satın aldın!';
        return;
    }

    // Kullanıcıya özel sepet
    const kullaniciSepetKey = 'sepet_' + email;
    const sepet = JSON.parse(localStorage.getItem(kullaniciSepetKey) || '[]');

    const zatenSepette = sepet.some(
        item => item.id === id && item.tip === tip
    );

    if (zatenSepette) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Bu içerik zaten sepetinde!';
        miniSepetGoster();
        return;
    }

    sepet.push({
        id: icerik.id,
        tip: tip,
        baslik: icerik.baslik,
        gorsel: icerik.gorsel,
        fiyat: icerik.fiyat
    });

    localStorage.setItem(kullaniciSepetKey, JSON.stringify(sepet));

    // Eski sistemden kalan genel sepeti temizle
    localStorage.removeItem('sepet');

    mesaj.className = 'form-mesaj basari';
    mesaj.textContent = 'Sepete eklendi! ✓';

    miniSepetGoster();
}

// Mini sepeti göster
function miniSepetGoster() {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return;

    const kullaniciSepetKey = 'sepet_' + email;
    const sepet = JSON.parse(localStorage.getItem(kullaniciSepetKey) || '[]');

    const icerikEl = document.getElementById('miniSepetIcerik');
    const toplam = document.getElementById('miniSepetToplam');

    icerikEl.innerHTML = '';

    let toplamFiyat = 0;

    if (sepet.length === 0) {
        icerikEl.innerHTML =
            '<p style="color:#aaa;text-align:center;padding:20px">Sepetiniz boş</p>';
    } else {
        sepet.forEach((urun, index) => {
            toplamFiyat += Number(urun.fiyat);

            const div = document.createElement('div');
            div.className = 'mini-sepet-urun';

            div.innerHTML = `
                <img src="${urun.gorsel}" alt="${urun.baslik}">

                <div class="mini-sepet-urun-bilgi">
                    <h4>${urun.baslik}</h4>
                    <p>${urun.fiyat} ₺</p>
                </div>

                <button class="mini-sepet-urun-sil" onclick="sepettenCikar(${index})">
                    ✕
                </button>
            `;

            icerikEl.appendChild(div);
        });
    }

    toplam.textContent = toplamFiyat.toFixed(2) + ' ₺';

    document.getElementById('miniSepet').classList.add('acik');
    document.getElementById('sepetOverlay').classList.add('acik');
}

// Mini sepeti kapat
function miniSepetKapat() {
    document.getElementById('miniSepet').classList.remove('acik');
    document.getElementById('sepetOverlay').classList.remove('acik');
}

// Sepetten çıkar
function sepettenCikar(index) {
    const email = localStorage.getItem('aktifKullanici');

    if (!email) return;

    const kullaniciSepetKey = 'sepet_' + email;
    const sepet = JSON.parse(localStorage.getItem(kullaniciSepetKey) || '[]');

    sepet.splice(index, 1);

    localStorage.setItem(kullaniciSepetKey, JSON.stringify(sepet));

    // Eski sistemden kalan genel sepeti temizle
    localStorage.removeItem('sepet');

    miniSepetGoster();
}

function icerigiIzle() {
    window.location.href = `izle.html?id=${id}&tip=${tip}`;
}