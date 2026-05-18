const email = localStorage.getItem('aktifKullanici');

if (!email) {
    window.location.href = 'giris.html';
}

const sepetKey = 'sepet_' + email;
let sepet = JSON.parse(localStorage.getItem(sepetKey) || '[]');

function sepetGoster() {
    const liste = document.getElementById('sepetListesi');
    const bosMesaj = document.getElementById('bosSepetMesaj');
    const odemeFormu = document.getElementById('odemeFormu');
    const ozet = document.getElementById('odemeSepetOzet');
    const toplam = document.getElementById('odemeToplam');

    if (!liste || !bosMesaj || !odemeFormu || !ozet || !toplam) return;

    liste.innerHTML = '';
    ozet.innerHTML = '';

    let toplamFiyat = 0;

    if (sepet.length === 0) {
        bosMesaj.classList.remove('gizli');
        odemeFormu.classList.add('gizli');
        toplam.textContent = '0 ₺';
        return;
    }

    bosMesaj.classList.add('gizli');
    odemeFormu.classList.remove('gizli');

    sepet.forEach((urun, index) => {
        const fiyat = Number(urun.fiyat) || 0;
        toplamFiyat += fiyat;

        const div = document.createElement('div');
        div.className = 'sepet-urun';

        div.innerHTML = `
            <img src="${urun.gorsel}" alt="${urun.baslik}">
            <div class="sepet-urun-bilgi">
                <h3>${urun.baslik}</h3>
                <p>${urun.tip === 'dizi' ? 'Dizi' : 'Film'}</p>
            </div>
            <div class="sepet-urun-fiyat">${fiyat.toFixed(2)} ₺</div>
            <button type="button" class="sepet-sil-btn" onclick="urunSil(${index})">✕</button>
        `;

        liste.appendChild(div);

        const ozetDiv = document.createElement('div');
        ozetDiv.className = 'ozet-satir';

        ozetDiv.innerHTML = `
            <span>${urun.baslik}</span>
            <span>${fiyat.toFixed(2)} ₺</span>
        `;

        ozet.appendChild(ozetDiv);
    });

    toplam.textContent = toplamFiyat.toFixed(2) + ' ₺';
}

function urunSil(index) {
    sepet.splice(index, 1);
    localStorage.setItem(sepetKey, JSON.stringify(sepet));
    sepetGoster();
}

function kartInputlariniHazirla() {
    const kartNoInput = document.getElementById('kartNo');
    const kartTarihInput = document.getElementById('kartTarih');
    const kartCvvInput = document.getElementById('kartCvv');

    if (kartNoInput) {
        kartNoInput.addEventListener('input', function (e) {
            let val = e.target.value.replace(/\D/g, '');
            val = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = val;
        });
    }

    if (kartTarihInput) {
        kartTarihInput.addEventListener('input', function (e) {
            let val = e.target.value.replace(/\D/g, '');

            if (val.length >= 2) {
                val = val.slice(0, 2) + '/' + val.slice(2, 4);
            }

            e.target.value = val;
        });
    }

    if (kartCvvInput) {
        kartCvvInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

function mesajGoster(tur, metin) {
    const mesaj = document.getElementById('odemeMesaj');

    if (!mesaj) return;

    mesaj.className = `form-mesaj ${tur}`;
    mesaj.textContent = metin;
}

function odemeYap(event) {
    if (event) {
        event.preventDefault();
    }

    const isim = document.getElementById('kartIsim').value.trim();
    const kartNo = document.getElementById('kartNo').value.trim();
    const tarih = document.getElementById('kartTarih').value.trim();
    const cvv = document.getElementById('kartCvv').value.trim();

    mesajGoster('', '');

    if (sepet.length === 0) {
        mesajGoster('hata', 'Sepet boş olduğu için ödeme yapılamaz!');
        return;
    }

    if (!isim || !kartNo || !tarih || !cvv) {
        mesajGoster('hata', 'Lütfen tüm ödeme bilgilerini doldurun!');
        return;
    }

    const temizKartNo = kartNo.replace(/\s/g, '');

    if (temizKartNo.length !== 16) {
        mesajGoster('hata', 'Kart numarası 16 haneli olmalı!');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(tarih)) {
        mesajGoster('hata', 'Son kullanma tarihi AA/YY formatında olmalı!');
        return;
    }

    if (cvv.length !== 3) {
        mesajGoster('hata', 'CVV 3 haneli olmalı!');
        return;
    }

    const kullaniciData = localStorage.getItem('kullanici_' + email);

    if (!kullaniciData) {
        mesajGoster('hata', 'Kullanıcı bulunamadı!');
        return;
    }

    const kullanici = JSON.parse(kullaniciData);

    if (!Array.isArray(kullanici.satinanlar)) {
        kullanici.satinanlar = [];
    }

    sepet.forEach(urun => {
        const zatenSatinAlinmis = kullanici.satinanlar.some(
            item => item.id === urun.id && item.tip === urun.tip
        );

        if (!zatenSatinAlinmis) {
            kullanici.satinanlar.push({
                id: urun.id,
                tip: urun.tip,
                baslik: urun.baslik,
                gorsel: urun.gorsel,
                fiyat: urun.fiyat
            });
        }
    });

    localStorage.setItem('kullanici_' + email, JSON.stringify(kullanici));

    sepet = [];
    localStorage.setItem(sepetKey, JSON.stringify(sepet));
    localStorage.removeItem('sepet');

    sepetGoster();

    const basariModal = document.getElementById('basariModal');

    if (basariModal) {
        basariModal.classList.remove('gizli');
    }
}

kartInputlariniHazirla();
sepetGoster();