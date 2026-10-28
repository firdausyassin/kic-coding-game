let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 
let subjekDikesan = false;
let isPaused = false; 

// VARIABLES UNTUK SISTEM MASA (30 SAAT)
let bakiMasaKecemasan = 30; 
let intervalMasa;

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
    let subjek = document.getElementById("subjek-tumbuhan");
    let cahaya = document.getElementById("cahaya-pengimbas");
    let skrinPenderia = document.getElementById("status-ciri");
    let hintPenderia = document.getElementById("hint-penderia");
    let teksAnimasi = document.getElementById("teksAnimasi");

    cakap(`Sedia! Tumbuhan akan lalu di atas mesin. Kita perlu klasifikasikannya!`, 4000); 
    
    await tunggu(1000);

    // Bawa tumbuhan ke tengah (bawah pengimbas)
    subjek.style.left = "42%";
    
    await tunggu(3000); // Tunggu sampai subjek betul-betul bawah scanner

    // Aktifkan Pengimbas
    cahaya.style.height = "160px";
    
    await tunggu(1000);

    // KEPUTUSAN IMBASAN
    subjekDikesan = true;
    cahaya.style.height = "0"; // Padam laser
    
    skrinPenderia.innerHTML = "SPORA";
    skrinPenderia.classList.add("status-aktif");
    hintPenderia.innerHTML = `ciri == "spora"`;
    hintPenderia.style.color = "#f1c40f";
    
    teksAnimasi.innerHTML = `Paku Pakis dikesan! Baki Masa: ${bakiMasaKecemasan}s`;
    teksAnimasi.style.borderColor = "#f1c40f";
    
    cakap("Paku Pakis membiak guna Spora! Taip arahan untuk sahkan sebelum terlambat!", 5000);
    
    // MULA TIMER 30 SAAT
    mulakanTimerKecemasan();
}

function mulakanTimerKecemasan() {
    let teksAnimasi = document.getElementById("teksAnimasi");

    intervalMasa = setInterval(() => {
        if (isPaused || adakahTamat) return; // BEKU MASA JIKA BUKA PANDUAN
        
        bakiMasaKecemasan--;
        teksAnimasi.innerHTML = `Status: Sila taip arahan! Baki Masa: ${bakiMasaKecemasan}s`;
        
        if (bakiMasaKecemasan <= 5) {
            teksAnimasi.innerHTML = `AMARAN: Akan dilupuskan! Masa: ${bakiMasaKecemasan}s`;
            teksAnimasi.style.borderColor = "#e74c3c";
            teksAnimasi.style.color = "#e74c3c";
        }
        
        if (bakiMasaKecemasan <= 0) {
            clearInterval(intervalMasa);
            gagalSebabMasa();
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

async function laksanaArahanTahap5h() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let subjek = document.getElementById("subjek-tumbuhan");
    let zonSpora = document.getElementById("zon-spora");
    
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

    if(!subjekDikesan) {
        maklumBalas.innerHTML = "Amaran: Penderia belum selesai mengimbas. Sila tunggu.";
        maklumBalas.style.borderLeftColor = "#f1c40f";
        cakap("Sabar! Biar mesin habis imbas dahulu.", 3000);
        return;
    }

    // RegEx Tangkap: if(ciri=="spora"){sahkan_spora()}
    let padananIf = input.match(/^if\(ciri=="([a-z]+)"\)\{sahkan_spora\(\)\}$/);
    let cekRalatTeks = input.match(/^if\(ciri==([a-z]+)\)/);

    if (padananIf) {
        let ciriDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (ciriDitaip === "spora") {
            
            // MENANG!
            adakahTamat = true;
            clearInterval(intervalMasa); // Hentikan masa

            maklumBalas.innerHTML = "Sistem: Klasifikasi Spora sah! Memindahkan subjek...";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Pemindahan berjaya.`;
            teksAnimasi.style.borderColor = "#0be881";
            teksAnimasi.style.color = "#2c3e50";
            
            mainBunyi(sfxBetul);
            
            // Animasi masuk zon
            zonSpora.style.opacity = "1";
            subjek.style.transition = "all 1s ease-in-out";
            subjek.style.left = "70%";
            subjek.style.bottom = "100px";
            subjek.style.transform = "scale(0.6)";
            
            await tunggu(1000);
            
            cakap(`Bagus! Paku Pakis memang membiak melalui Spora! 🌱`, 4000);
            
            await tunggu(1500); 

            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } else {
            // SALAH CIRI
            maklumBalas.innerHTML = "Gagal: Klasifikasi ditolak!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);

            cakap(`Eh, skrin tu tulis "spora", kenapa awak tulis "${ciriDitaip}"? 🤨`, 3000);
            adakahSibuk = false; 
        }

    } else if (cekRalatTeks) {
        maklumBalas.innerHTML = "Ralat Sintaks: Nilai pembolehubah memerlukan Tanda Petik Ganda (\" \")!";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        
        cakap("Awas! Perkataan spora perlukan tanda petik (\" \") di kiri dan kanan!", 3000);
        adakahSibuk = false;

    } else if (input !== "") {
        maklumBalas.innerHTML = `Ralat Sintaks: Sila ikut format -> <code>if(ciri=="spora"){sahkan_spora()}</code>`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        adakahSibuk = false;
    }

    document.getElementById("arahanInput").value = "";
}

async function gagalSebabMasa() {
    adakahTamat = true;
    let sfxSalah = document.getElementById("bunyiSalah");
    let subjek = document.getElementById("subjek-tumbuhan");
    
    // Animasi Jatuh Hujung Conveyor
    subjek.style.transition = "all 1.5s ease-in";
    subjek.style.left = "110%"; // Terus jalan sampai hilang
    
    mainBunyi(sfxSalah);
    document.getElementById("teksAnimasi").innerHTML = "Status: GAGAL! Subjek telah terlupus!";
    
    cakap("Alamak!! Subjek dah terlepas masuk tong sampah sebab awak lambat menaip! 😭", 4000);
    
    document.getElementById("maklumBalas").innerHTML = "Sistem Tergendala: Kelewatan tindak balas pengesahan.";
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 2500);
}

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