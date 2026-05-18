const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
const tip = params.get('tip') || 'film';

const email = localStorage.getItem('aktifKullanici');

if (!email) {
    window.location.href = 'giris.html';
}

const kullaniciData = localStorage.getItem('kullanici_' + email);

if (!kullaniciData) {
    window.location.href = 'giris.html';
}

const kullanici = JSON.parse(kullaniciData);

if (!Array.isArray(kullanici.satinanlar)) {
    kullanici.satinanlar = [];
}

const satinAlindi = kullanici.satinanlar.some(
    item => item.id === id && item.tip === tip
);

if (!satinAlindi) {
    alert('Bu içeriği izlemek için önce satın almalısın!');
    window.location.href = `detay.html?id=${id}&tip=${tip}`;
}

const icerik = tip === 'dizi'
    ? diziler.find(d => d.id === id)
    : filmler.find(f => f.id === id);

if (!icerik) {
    document.querySelector('.izle-section').innerHTML =
        '<p style="text-align:center;padding:60px;color:#aaa">İçerik bulunamadı.</p>';

    throw new Error('İçerik bulunamadı');
}

// Sadece Interstellar için gerçek MP4
const videoDosyalari = {
    film: {
        1: "videos/interstellar.mp4"
    },
    dizi: {}
};

document.getElementById('izleBaslik').textContent = icerik.baslik;

document.getElementById('izleAltBaslik').textContent =
    tip === 'dizi'
        ? `${icerik.baslik} — ${icerik.sezon} Sezon`
        : `${icerik.baslik} — ${icerik.sure}`;

document.getElementById('izleAciklama').textContent = icerik.aciklama;

const videoAlani = document.getElementById('videoAlani');

const videoYolu = videoDosyalari[tip]?.[id];

if (videoYolu) {
    videoAlani.innerHTML = `
        <video controls autoplay class="video-player">
            <source src="${videoYolu}" type="video/mp4">
            Tarayıcınız video oynatmayı desteklemiyor.
        </video>
    `;
} else {
    videoAlani.innerHTML = `
        <div class="video-yok">
            <h2>Video Dosyası Bulunamadı</h2>
            <p>Bu içerik için henüz video dosyası eklenmemiş.</p>
            <a href="detay.html?id=${id}&tip=${tip}" class="btn-primary">Detaya Dön</a>
        </div>
    `;
}