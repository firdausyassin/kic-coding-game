let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 
let airSedangPenuh = false;
let isPaused = false; 

// VARIABLES UNTUK SISTEM MASA DAN AIR
let intervalAirNaik;
let parasAirTangki = 10;   // Mula dengan 10%
let bakiMasaBanjir = 10;   // 10 Saat sebelum banjir bermula HANYA SELEPAS AIR PENUH
let intervalBanjir;

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

window.onload = function() {
    cakap(`Air mula dipam! Bersedia untuk menaip kod apabila air penuh nanti!`, 5500); 
    mulakanKenaikanAir();
}

// FUNGSI UTAMA KAWAL AIR MENGISI & PECUTAN PAIP TALI GAJAH
function mulakanKenaikanAir() {
    let airTangki = document.getElementById("isipadu-air");
    let aliranAir = document.getElementById("aliran-air");
    let skrinPenderia = document.getElementById("status-isipadu");
    let hintPenderia = document.getElementById("hint-penderia");
    let teksAnimasi = document.getElementById("teksAnimasi");

    // Interval di set pada 100ms. 
    // Tambah 0.16 setiap 100ms = mengambil masa genap 50 saat untuk sampai ke 90%
    intervalAirNaik = setInterval(() => {
        if (isPaused || adakahTamat) return; // BEKU SEMUA jika Panduan Misi Dibuka

        parasAirTangki += 0.16; // Kelajuan air naik perlahan (50 Saat)
        airTangki.style.height = parasAirTangki + "%";

        // 🔥 TALI GAJAH LOGIC: Paip memendek ikut kadar air secara jitu 🔥
        // Formula matematik untuk pastikan paip sentiasa sentuh permukaan air
        let panjangPaip = 280 - (parasAirTangki * 1.6);
        if (panjangPaip < 15) panjangPaip = 15; // Had minimum
        aliranAir.style.height = panjangPaip + "px";

        // APABILA AIR CECAH 90% (GARISAN AMARAN / PENUH)
        if (parasAirTangki >= 90 && !airSedangPenuh) {
            airSedangPenuh = true;
            clearInterval(intervalAirNaik); // Air berhenti naik buat sementara waktu di paras 90%
            
            skrinPenderia.innerHTML = "PENUH";
            skrinPenderia.classList.add("status-penuh");
            hintPenderia.innerHTML = `isipadu == "penuh"`;
            hintPenderia.style.color = "#e74c3c";
            
            teksAnimasi.innerHTML = `Status: Amaran! Isipadu maksimum. Masa: ${bakiMasaBanjir}s`;
            teksAnimasi.style.borderColor = "#e74c3c";
            
            cakap("Cepat! Air dah penuh! Taip kod tutup paip sekarang!", 5000);
            
            // TIMER 10 SAAT HANYA BERMULA DISINI
            mulakanTimerKecemasan();
        }
    }, 100); 
}

// FUNGSI MASA KECEMASAN (10 Saat Countdown)
function mulakanTimerKecemasan() {
    let teksAnimasi = document.getElementById("teksAnimasi");

    intervalBanjir = setInterval(() => {
        if (isPaused || adakahTamat) return; // BEKU MASA JIKA BUKA PANDUAN
        
        bakiMasaBanjir--;
        teksAnimasi.innerHTML = `Status: AMARAN BANJIR! Masa: ${bakiMasaBanjir}s`;
        
        if (bakiMasaBanjir <= 0) {
            clearInterval(intervalBanjir);
            gagalSebabLimpah();
        }
    }, 1000); 
}

// KAWALAN BUKA/TUTUP PANDUAN (MOD PAUSE GLOBAL)
function bukaInfo() { 
    isPaused = true; 
    document.getElementById("ruangAnimasi").classList.add("paused"); 
    document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    isPaused = false; 
    document.getElementById("ruangAnimasi").classList.remove("paused"); 
    document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanTahap5g() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let injap = document.getElementById("injap-paip");
    let aliranAir = document.getElementById("aliran-air");
    let pekerja = document.getElementById("kotak-pekerja");
    
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

    if(!airSedangPenuh) {
        maklumBalas.innerHTML = "Amaran: Penderia belum mengesan tahap penuh. Sila tunggu.";
        maklumBalas.style.borderLeftColor = "#f1c40f";
        cakap("Sabar! Air belum sampai tahap maksimum lagi.", 3000);
        return;
    }

    let padananIf = input.match(/^if\(isipadu=="([a-z]+)"\)\{tutup_paip\(\)\}$/);
    let cekRalatTeks = input.match(/^if\(isipadu==([a-z]+)\)/);

    if (padananIf) {
        let isipaduDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (isipaduDitaip === "penuh") {
            
            adakahTamat = true;
            clearInterval(intervalBanjir);

            maklumBalas.innerHTML = "Sistem: Logik penilaian sah! Injap mekanikal ditutup.";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Injap dikunci. Bekalan air selamat.`;
            teksAnimasi.style.borderColor = "#0be881";
            
            mainBunyi(sfxBetul);
            
            // Fasa 1: Tutup injap (Bertukar Merah & Melintang automatik dari CSS)
            injap.classList.add("injap-tutup");
            await tunggu(300);
            aliranAir.style.display = "none";
            document.getElementById("status-isipadu").classList.remove("status-penuh");
            document.getElementById("status-isipadu").style.color = "#0be881";
            
            await tunggu(1000);
            
            pekerja.style.transition = "transform 0.3s ease-out";
            pekerja.style.transform = "translateY(-30px)"; 
            await tunggu(300);
            pekerja.style.transform = "translateY(0px)";
            
            cakap(`Fuh! Jari awak menaip memang laju! Menyelamatkan keadaan! 😅`, 4000);
            
            await tunggu(1500); 

            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } else {
            maklumBalas.innerHTML = "Gagal: Penilaian tahap ditolak!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);

            cakap(`Eh, baca betul-betul! Skrin tu tulis "penuh", kenapa awak tulis "${isipaduDitaip}"? 🤨`, 3000);
            adakahSibuk = false; 
        }

    } else if (cekRalatTeks) {
        maklumBalas.innerHTML = "Ralat Sintaks: Nilai perkataan memerlukan Tanda Petik Ganda (\" \")!";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        
        cakap("Eh! Sistem tak dapat baca perkataan tu kalau tak ada tanda petik (\" \")!", 3000);
        adakahSibuk = false;

    } else if (input !== "") {
        maklumBalas.innerHTML = `Ralat Sintaks: Sila ikut format -> <code>if(isipadu=="penuh"){tutup_paip()}</code>`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        adakahSibuk = false;
    }

    document.getElementById("arahanInput").value = "";
}

async function gagalSebabLimpah() {
    adakahTamat = true;
    let sfxSalah = document.getElementById("bunyiSalah");
    let airTangki = document.getElementById("isipadu-air");
    let limpahan = document.getElementById("limpahan");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    airTangki.style.transition = "height 0.5s linear";
    airTangki.style.height = "105%"; 
    await tunggu(500);
    limpahan.style.display = "block";

    mainBunyi(sfxSalah);
    teksAnimasi.innerHTML = "Status: BENCANA! Air telah melimpah keluar!";
    teksAnimasi.style.borderColor = "#ff5e57";
    cakap("Alamak!! Tangki dah banjir! Kena menaip lebih pantas lepas ni! 😭", 4000);
    
    document.getElementById("maklumBalas").innerHTML = "Sistem Tergendala: Had isipadu maksimum dilanggar.";
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
        document.getElementById("ikon-kalah").innerHTML = "🌊💥";
        document.getElementById("tajuk-kalah").innerHTML = "Tangki Banjir!";
        document.getElementById("pesan-kalah").innerHTML = `Anda terlalu lambat! Apabila status bertukar menjadi "PENUH", pastikan anda fokus dan menaip kod arahan dengan pantas!`;
    }, 3500);
}

// FUNGSI DIALOG PEKERJA
function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPekerja");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}