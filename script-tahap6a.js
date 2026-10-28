let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogStesen;
let isPaused = false;

// Penjanaan Objek Rawak Semasa Load
const senaraiObjek = ["meteor", "kapal"];
const objekSemasa = senaraiObjek[Math.floor(Math.random() * senaraiObjek.length)];

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem bunyi audio disekat sementara."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", function() {
    let elemenObjek = document.getElementById("objek-datang");
    let teksStatus = document.getElementById("teksAnimasi");
    
    if (objekSemasa === "meteor") {
        if(elemenObjek) elemenObjek.innerHTML = "☄️";
        if(teksStatus) {
            teksStatus.innerHTML = "Status: AMARAN! Objek METEOR dikesan di radar!";
            teksStatus.style.borderColor = "#e74c3c";
            teksStatus.style.color = "#e74c3c";
        }
    } else {
        if(elemenObjek) elemenObjek.innerHTML = "🚀";
        if(teksStatus) {
            teksStatus.innerHTML = "Status: Kapal kawan menghampiri. Meminta akses mendarat.";
        }
    }
});

// KAWALAN BUKA/TUTUP PANDUAN (MOD PAUSE GLOBAL)
function bukaInfo() { 
    isPaused = true; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.add("paused"); 
    if(modal) modal.classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    isPaused = false; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.remove("paused"); 
    if(modal) modal.classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanTahap6a() {
    // Membuang semua jenis 'space', tab, dan 'enter' (newline) dari textarea
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let objekDatang = document.getElementById("objek-datang");
    let pintuPerisai = document.getElementById("pintu-perisai");
    let tembakanLaser = document.getElementById("tembakan-laser");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Ancaman telah diuruskan. Sila Refresh radar.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX UNTUK IF-ELSE ASAL (Kalis spasi)
    let regexIfElse = /^if\(objek=="meteor"\)\{stesen\.tembak_laser\(\)\}else\{stesen\.buka_pintu\(\)\}$/;
    let padanan = input.match(regexIfElse);

    if (padanan) {
        
        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem AI Diterima. Melaksanakan protokol pertahanan...";
            maklumBalas.style.borderLeftColor = "#00f3ff";
        }
        
        cakapStesen("AI Diaktifkan. Mengesahkan identiti objek...", 2000);
        
        // Objek bergerak ke tengah skrin
        if(objekDatang) objekDatang.style.left = "45%"; 
        await tunggu(1500); // Masa objek bergerak
        
        // KES 1: OBJEK ADALAH METEOR
        if (objekSemasa === "meteor") {
            cakapStesen("Ancaman dikesan! Melancarkan laser!", 2000);
            await tunggu(500);
            
            // Tembak Laser
            if(tembakanLaser) tembakanLaser.style.width = "40%"; 
            mainBunyi(sfxBetul); 
            
            await tunggu(300);
            
            // Meteor Hancur
            if(objekDatang) {
                objekDatang.innerHTML = "💥";
                objekDatang.classList.add("hancur");
            }
            if(tembakanLaser) tembakanLaser.style.width = "0"; // Laser ditarik balik
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Ancaman meteor berjaya dimusnahkan!";
            
            await tunggu(1500);
            
            mainBunyi(sfxMenang);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        } 
        
        // KES 2: OBJEK ADALAH KAPAL KAWAN
        else {
            cakapStesen("Imbasan selesai. Kod kawan disahkan. Membuka perisai...", 2500);
            await tunggu(1000);
            
            // Buka Pintu
            if(pintuPerisai) pintuPerisai.classList.add("buka-perisai");
            mainBunyi(sfxBetul);
            
            await tunggu(800);
            
            // Kapal masuk ke stesen
            if(objekDatang) objekDatang.classList.add("mendarat");
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Kapal kawan berjaya dilabuhkan di hangar.";
            
            await tunggu(1500);
            
            mainBunyi(sfxMenang);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }

    } 
    else {
        // KALAU LOGIK SINTAKS SALAH
        mainBunyi(sfxSalah);
        adakahSibuk = true;

        if (input.includes("if") && input.includes("else")) {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Logik tindakan merisikokan stesen! Semak susunan if-else.";
            cakapStesen("Ralat! Kalau meteor datang buka pintu, hancurlah kita!", 3500);
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan kurungan <code>{}</code> dan ejaan <code>else</code> ditaip dengan betul.";
            cakapStesen("AI Gagal Membaca Kod. Sila baiki struktur sintaks anda.", 3000);
        }
        if(maklumBalas) maklumBalas.style.borderLeftColor = "#ff5e57";

        setTimeout(() => {
            adakahTamat = true;
            let modalKalah = document.getElementById("modalKalah");
            if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
        }, 2500);
    }
}

function cakapStesen(mesej, masa) {
    let kotakDialog = document.getElementById("dialogStesen");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogStesen); 
        pemasaDialogStesen = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}