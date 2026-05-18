// Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
const email = localStorage.getItem('aktifKullanici');
if (!email) {
    window.location.href = 'giris.html';
}

// Kullanıcı bilgilerini getir
const kullaniciData = localStorage.getItem('kullanici_' + email);
const kullanici = JSON.parse(kullaniciData);

// Sayfaya yaz
document.getElementById('profilAd').textContent = kullanici.ad;
document.getElementById('profilEmail').textContent = kullanici.email;
document.getElementById('bilgiAd').textContent = kullanici.ad;
document.getElementById('bilgiEmail').textContent = kullanici.email;
document.getElementById('listeAdet').textContent = kullanici.listem.length + ' içerik';
document.getElementById('satinanAdet').textContent = kullanici.satinanlar.length + ' içerik';

// Satın alınanları göster
if (kullanici.satinanlar.length > 0) {
    const satinanlarDiv = document.createElement('div');
    satinanlarDiv.className = 'profil-kart';
    satinanlarDiv.style.marginTop = '20px';
    
    let html = '<h3>Satın Alınanlar</h3>';
    kullanici.satinanlar.forEach(urun => {
        html += `
            <div class="profil-satir">
                <span>${urun.baslik}</span>
                <span style="color:#4caf50">✓ Satın Alındı</span>
            </div>
        `;
    });
    
    satinanlarDiv.innerHTML = html;
    document.querySelector('.profil-grid').appendChild(satinanlarDiv);
}