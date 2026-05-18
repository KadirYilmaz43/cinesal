// SEKME GEÇİŞİ
document.getElementById('girisTab').addEventListener('click', () => {
    document.getElementById('girisForm').classList.remove('gizli');
    document.getElementById('kayitForm').classList.add('gizli');
    document.getElementById('girisTab').classList.add('aktif');
    document.getElementById('kayitTab').classList.remove('aktif');
});

document.getElementById('kayitTab').addEventListener('click', () => {
    document.getElementById('kayitForm').classList.remove('gizli');
    document.getElementById('girisForm').classList.add('gizli');
    document.getElementById('kayitTab').classList.add('aktif');
    document.getElementById('girisTab').classList.remove('aktif');
});

// KAYIT OL
function kayitOl() {
    const ad = document.getElementById('kayitAd').value.trim();
    const email = document.getElementById('kayitEmail').value.trim();
    const sifre = document.getElementById('kayitSifre').value;
    const sifreTekrar = document.getElementById('kayitSifreTekrar').value;
    const mesaj = document.getElementById('kayitMesaj');

    if (!ad || !email || !sifre || !sifreTekrar) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Lütfen tüm alanları doldur!';
        return;
    }

    if (sifre.length < 6) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Şifre en az 6 karakter olmalı!';
        return;
    }

    if (sifre !== sifreTekrar) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Şifreler eşleşmiyor!';
        return;
    }

    const mevcutKullanici = localStorage.getItem('kullanici_' + email);
    if (mevcutKullanici) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Bu e-posta zaten kayıtlı!';
        return;
    }

    const kullanici = { ad, email, sifre, listem: [], satinanlar: [] };
    localStorage.setItem('kullanici_' + email, JSON.stringify(kullanici));
    localStorage.setItem('aktifKullanici', email);

    mesaj.className = 'form-mesaj basari';
    mesaj.textContent = 'Kayıt başarılı! Yönlendiriliyorsunuz...';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// GİRİŞ YAP
function girisYap() {
    const email = document.getElementById('girisEmail').value.trim();
    const sifre = document.getElementById('girisSifre').value;
    const mesaj = document.getElementById('girisMesaj');

    if (!email || !sifre) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Lütfen tüm alanları doldur!';
        return;
    }

    const kullaniciData = localStorage.getItem('kullanici_' + email);
    if (!kullaniciData) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Bu e-posta ile kayıtlı hesap bulunamadı!';
        return;
    }

    const kullanici = JSON.parse(kullaniciData);
    if (kullanici.sifre !== sifre) {
        mesaj.className = 'form-mesaj hata';
        mesaj.textContent = 'Şifre yanlış!';
        return;
    }

    localStorage.setItem('aktifKullanici', email);

    mesaj.className = 'form-mesaj basari';
    mesaj.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}