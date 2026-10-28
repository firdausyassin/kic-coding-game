let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

// Pangkalan Data Haiwan (RAWAK)
// Dah tambah Monyet (4 kaki - KBAT) & baiki ralat 'suara'
const senaraiHaiwan = [
    { nama: "Zirafah", ikon: "🦒", kaki: 4, awal: "Saya ada 4 kaki. Bolehkah saya masuk ke dalam kandang tu?", suara: "Terima kasih! Yeay dapat makan daun! 🍃" },
    { nama: "Monyet", ikon: "🐒", kaki: 4, awal: "Uuk uuk! Tangan saya ni sebenarnya kira kaki juga tau. Bagi saya masuk!", suara: "Uuk uuk! Nak cari pisang! 🍌" },
    { nama: "Burung Unta", ikon: "🦤", kaki: 2, awal: "Kwak! Kaki saya cuma 2. Boleh saya masuk?", suara: "Terima kasih! Lari pecut dulu! 🪶" },
    { nama: "Ayam Belanda", ikon: "🦃", kaki: 2, awal: "Gobble gobble! Kaki saya 2 je. Nak masuk!", suara: "Gobble! Makanan sedap! 🌽" }
];

const sasaranHaiwan = senaraiHaiwan[Math.floor(Math.random() * senaraiHaiwan.length)];

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    let laser = document.getElementById("laser-imbasan");
    let teksAnimasi = document.getElementById("teksAnimasi");

    // Kemaskini Visual Dinamik
    document.getElementById("nama-spesies").innerHTML = sasaranHaiwan.nama;
    document.getElementById("kaki-spesies").innerHTML = `Kaki = ${sasaranHaiwan.kaki}`;
    document.getElementById("ikonHaiwan").innerHTML = sasaranHaiwan.ikon;
    document.getElementById("hint-penderia").innerHTML = `haiwan.kaki == ${sasaranHaiwan.kaki}`;

    // Fasa 1: Tunjuk laser scan
    laser.classList.add("laser-aktif");
    
    await tunggu(2000); // Masa imbas
    
    // Fasa 2: Laser hilang, laporan keluar
    laser.classList.remove("laser-aktif");
    teksAnimasi.innerHTML = `Status: Ciri fizikal disahkan. Menunggu logik pelepasan pintu kandang.`;
    
    setTimeout(() => { 
        cakap(sasaranHaiwan.awal, 5000); 
    }, 500);
}

async function laksanaArahanTahap5f() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let haiwan = document.getElementById("kotak-haiwan");
    let pagar = document.getElementById("pagar-kandang");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    // RegEx Tangkap: if(haiwan.kaki==4){masuk_kandang()} atau ==2
    let padananIf = input.match(/^if\(haiwan\.kaki==([0-9]+)\)\{masuk_kandang\(\)\}$/);
    
    // Semakan Ralat Umum Dulu (Kalau budak letak = satu je)
    let cekRalatSamaDengan = input.match(/^if\(haiwan\.kaki=([0-9]+)\)/);

    if (padananIf) {
        let jumlahKakiDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (jumlahKakiDitaip === sasaranHaiwan.kaki.toString()) {
            
            // KEPUTUSAN TEPAT
            maklumBalas.innerHTML = "Sistem: Logik pengelasan sah! Pagar utama dibuka.";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Akses Dibenarkan. Mengangkat pagar...`;
            teksAnimasi.style.borderColor = "#0be881";
            
            mainBunyi(sfxBetul);
            
            // Fasa 1: Pagar Naik Terbuka
            pagar.classList.add("pagar-buka");
            await tunggu(1500);
            
            // Fasa 2: Haiwan Jalan Masuk & Lompat Sikit
            teksAnimasi.innerHTML = `Status: ${sasaranHaiwan.nama} bergerak memasuki habitat.`;
            haiwan.style.left = "80%";
            haiwan.style.transform = "translateY(-20px)"; // Lompat happy
            await tunggu(300);
            haiwan.style.transform = "translateY(0px)";
            
            // PANGGIL KEMBALI TEKS SUARA (RALAT UNDEFINED TELAH DIBAIKI)
            cakap(sasaranHaiwan.suara, 3000);
            
            await tunggu(1700); // Tunggu dia habis jalan

            adakahTamat = true;
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } else {
            // SALAH TULIS BILANGAN KAKI
            adakahTamat = true;
            maklumBalas.innerHTML = "Gagal: Syarat fizikal ditolak!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Akses Ditolak! Ralat pengenalpastian spesies.";
            teksAnimasi.style.borderColor = "#ff5e57";
            
            mainBunyi(sfxSalah);

            cakap(`Eh, baca betul-betul! Kaki saya ${sasaranHaiwan.kaki} la! Kenapa kod tu tulis ${jumlahKakiDitaip}? 🤨`, 4000);

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🦓❌";
                document.getElementById("tajuk-kalah").innerHTML = "Ralat Pengelasan!";
                document.getElementById("pesan-kalah").innerHTML = `Anda telah meletakkan syarat <strong>haiwan.kaki == ${jumlahKakiDitaip}</strong>. Sila rujuk kembali skrin Penderia, haiwan tersebut sah-sah mempunyai ${sasaranHaiwan.kaki} kaki!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (cekRalatSamaDengan) {
        // RALAT SINTAKS: Letak 1 '=' sahaja
        maklumBalas.innerHTML = "Ralat Sintaks: Pengesahan logik memerlukan simbol '==' ganda!";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        
        teksAnimasi.innerHTML = "Status: Ralat! Sistem menolak struktur kod yang salah.";
        cakap("Saya tak boleh masuk kalau kod pintu rosak! 😭", 3000);
        
        setTimeout(() => {
            document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            document.getElementById("ikon-kalah").innerHTML = "💻❌";
            document.getElementById("tajuk-kalah").innerHTML = "Ralat Sama Dengan!";
            document.getElementById("pesan-kalah").innerHTML = `Dalam dunia pengekodan, satu '=' digunakan untuk memberi nilai, manakala dua <strong>'=='</strong> digunakan untuk MENYEMAK nilai. Anda mesti menggunakan <strong>haiwan.kaki == ${sasaranHaiwan.kaki}</strong> untuk membuat syarat!`;
        }, 3000);

    } else if (input !== "") {
        maklumBalas.innerHTML = `Ralat Sintaks: Sila ikut format -> <code>if(haiwan.kaki==${sasaranHaiwan.kaki}){masuk_kandang()}</code>`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogHaiwan");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}