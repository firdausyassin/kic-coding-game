let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 
let kayuDikesan = false;
let isPaused = false; 

// VARIABLES UNTUK SISTEM MASA (25 SAAT)
let bakiMasaKecemasan = 25; 
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

document.addEventListener("DOMContentLoaded", async function() {
    let kayu = document.getElementById("kayu-balak");
    let skrinPenderia = document.getElementById("status-ciri");
    let hintPenderia = document.getElementById("hint-penderia");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let ruangAnimasi = document.getElementById("ruangAnimasi");

    cakap(`Bersedia! Kayu balak sedang masuk ke lorong pemotong.`, 4000); 
    
    await tunggu(1000);

    // Gerakkan kayu tepat ke tengah mesin (bawah laser)
    if(kayu) kayu.style.left = "50%";
    
    await tunggu(2000); // Tunggu sampai kayu dikesan radar dan sampai tengah

    // KEPUTUSAN IMBASAN RADAR (KAYU BERHENTI TEPAT DI TENGAH)
    kayuDikesan = true;
    
    // Hentikan putaran penggelek supaya nampak lojik mesin berhenti
    if(ruangAnimasi) ruangAnimasi.classList.add("conveyor-berhenti");
    
    if(skrinPenderia) {
        skrinPenderia.innerHTML = "1m";
        skrinPenderia.classList.add("status-aktif");
    }
    if(hintPenderia) {
        hintPenderia.innerHTML = `ukuran == "???"`;
        hintPenderia.style.color = "#f1c40f";
    }
    if(teksAnimasi) {
        teksAnimasi.innerHTML = `AMARAN: Saiz dikesan. Menunggu input... Baki: ${bakiMasaKecemasan}s`;
        teksAnimasi.style.borderColor = "#f1c40f";
    }
    
    cakap("Penderia kesan panjangnya 1 meter! Tukar nilai kepada sentimeter (cm) dalam kod arahan!", 6000);
    
    // MULA TIMER KECEMASAN
    mulakanTimerKecemasan();
});

function mulakanTimerKecemasan() {
    let teksAnimasi = document.getElementById("teksAnimasi");

    intervalMasa = setInterval(() => {
        if (isPaused || adakahTamat) return; // BEKU MASA JIKA BUKA PANDUAN
        
        bakiMasaKecemasan--;
        if(teksAnimasi) teksAnimasi.innerHTML = `Status: Menunggu kod pemotong! Baki: ${bakiMasaKecemasan}s`;
        
        // KAYU DIBIARKAN BERHENTI DI TENGAH MENUNGGU POTONGAN
        
        if (bakiMasaKecemasan <= 5 && teksAnimasi) {
            teksAnimasi.innerHTML = `AMARAN: Akan dilupuskan jika tiada input! Masa: ${bakiMasaKecemasan}s`;
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

async function laksanaArahanTahap5j() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let beamLaser = document.getElementById("beam-laser");
    let kayuKiri = document.getElementById("kayu-kiri");
    let kayuKanan = document.getElementById("kayu-kanan");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Ralat: Operasi tamat. Sila muat semula (Refresh) halaman.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    if(!kayuDikesan) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Amaran: Penderia belum mengesan kayu. Sila tunggu.";
            maklumBalas.style.borderLeftColor = "#f1c40f";
        }
        cakap("Sabar! Tunggu kayu masuk radar dulu.", 3000);
        return;
    }

    // RegEx Tangkap nilai di dalam tanda petik
    let padananIf = input.match(/^if\(ukuran=="([a-z0-9]+)"\)\{potong_kayu\(\)\}$/);
    let cekRalatTeks = input.match(/^if\(ukuran==([a-z0-9]+)\)/);

    if (padananIf) {
        let nilaiDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (nilaiDitaip === "100cm") {
            
            // MENANG!
            adakahTamat = true;
            clearInterval(intervalMasa); // Hentikan masa

            if(maklumBalas) {
                maklumBalas.innerHTML = "Sistem: Penukaran unit disahkan! Laser dilepaskan.";
                maklumBalas.style.borderLeftColor = "#0be881";
            }
            if(teksAnimasi) {
                teksAnimasi.innerHTML = `Status: Pemotongan berjaya.`;
                teksAnimasi.style.borderColor = "#0be881";
                teksAnimasi.style.color = "#2c3e50";
            }
            
            mainBunyi(sfxBetul);
            
            // Fasa Animasi Menang - Tembak Laser
            if(beamLaser) beamLaser.style.height = "165px"; 
            
            await tunggu(300);
            
            // Kayu Terbelah Dua (Animasi CSS)
            if(kayuKiri) kayuKiri.classList.add("kayu-terbelah-kiri");
            if(kayuKanan) kayuKanan.classList.add("kayu-terbelah-kanan");
            
            await tunggu(300);
            
            // Tarik balik laser
            if(beamLaser) beamLaser.style.height = "0";
            
            await tunggu(1000);
            
            cakap(`Bagus! 1 Meter adalah bersamaan dengan 100 Sentimeter (cm). Bijak! 📏`, 4000);
            
            await tunggu(1500); 

            mainBunyi(sfxMenang);

            setTimeout(() => {
                let modalMenang = document.getElementById("modalKemenangan");
                if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
            }, 1000);

        } else {
            // SALAH UNIT / NILAI
            if(maklumBalas) {
                maklumBalas.innerHTML = "Gagal: Nilai ukuran tidak tepat!";
                maklumBalas.style.borderLeftColor = "#ff5e57";
            }
            mainBunyi(sfxSalah);

            if(nilaiDitaip === "1m") {
                cakap(`Sistem kita perlukan arahan dalam unit Sentimeter (cm), bukan Meter (m)!`, 3500);
            } else if (nilaiDitaip === "100") {
                cakap(`Tulis nombor dan unitnya sekali (cm) supaya sistem tak keliru!`, 3500);
            } else {
                cakap(`Eh, cuba kira betul-betul. 1 Meter bersamaan dengan berapa Sentimeter? Buka panduan!`, 3500);
            }
            adakahSibuk = false; 
        }

    } else if (cekRalatTeks) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Ralat Sintaks: Nilai pembolehubah memerlukan Tanda Petik Ganda (\" \")!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
        mainBunyi(sfxSalah);
        
        cakap("Awas! Nilai ukuran perlukan tanda petik (\" \") di kiri dan kanan!", 3000);
        adakahSibuk = false;

    } else if (input !== "") {
        if(maklumBalas) {
            maklumBalas.innerHTML = `Ralat Sintaks: Sila ikut format -> <code>if(ukuran=="100cm"){potong_kayu()}</code>`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
        mainBunyi(sfxSalah);
        adakahSibuk = false;
    }

    document.getElementById("arahanInput").value = "";
}

async function gagalSebabMasa() {
    adakahTamat = true;
    let sfxSalah = document.getElementById("bunyiSalah");
    let kayu = document.getElementById("kayu-balak");
    let ruangAnimasi = document.getElementById("ruangAnimasi");
    
    // Aktifkan balik conveyor jika masa tamat
    if(ruangAnimasi) ruangAnimasi.classList.remove("conveyor-berhenti");
    
    // Kayu terus berjalan masuk tong pelupusan
    if(kayu) {
        kayu.style.transition = "left 1.5s linear, transform 1s ease-in";
        kayu.style.left = "85%"; 
        setTimeout(() => { kayu.style.transform = "translateX(-50%) rotate(45deg) translateY(50px)"; }, 1000);
    }
    
    await tunggu(500);
    mainBunyi(sfxSalah);
    
    let teksAnimasi = document.getElementById("teksAnimasi");
    if(teksAnimasi) teksAnimasi.innerHTML = "Status: GAGAL! Kayu dibuang!";
    
    cakap("Alamak!! Mesin dah buang balak tu sebab awak lambat menaip kod! 😭", 4000);
    
    let maklumBalas = document.getElementById("maklumBalas");
    if(maklumBalas) {
        maklumBalas.innerHTML = "Sistem Tergendala: Kelewatan pemotongan balak.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }

    setTimeout(() => {
        let modalKalah = document.getElementById("modalKalah");
        if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
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