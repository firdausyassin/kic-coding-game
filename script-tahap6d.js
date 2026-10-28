let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN SOALAN MATH (Local Storage) 🔥
const senaraiSoalan = [
    { nombor: 42, sa: 2, bawah: 40, atas: 50, jawapan: "bawah" },
    { nombor: 48, sa: 8, bawah: 40, atas: 50, jawapan: "atas" },
    { nombor: 73, sa: 3, bawah: 70, atas: 80, jawapan: "bawah" },
    { nombor: 75, sa: 5, bawah: 70, atas: 80, jawapan: "atas" }
];

let indeksSemasa = localStorage.getItem("indexMath6D");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiSoalan.length;
}
localStorage.setItem("indexMath6D", indeksSemasa);

let soalanSemasa = senaraiSoalan[indeksSemasa];

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem bunyi audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", async function() {
    let blokNombor = document.getElementById("blok-nombor");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    let labelKiri = document.getElementById("label-kiri");
    let labelKanan = document.getElementById("label-kanan");
    
    await tunggu(500); 
    
    // Setup UI mengikut soalan semasa
    if(blokNombor) blokNombor.innerHTML = soalanSemasa.nombor;
    if(labelKiri) labelKiri.innerHTML = soalanSemasa.bawah;
    if(labelKanan) labelKanan.innerHTML = soalanSemasa.atas;
    
    await tunggu(1000); 
    
    if(skrinStatus) {
        skrinStatus.innerHTML = soalanSemasa.sa;
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Nombor ${soalanSemasa.nombor} dikesan. Menilai digit sa...`;
    }
    
    if (soalanSemasa.jawapan === "bawah") {
        cakapPekerja(`Nilai sa adalah ${soalanSemasa.sa}. Ia kurang daripada 5! Mesin mesti membundar ke bawah.`, 4000);
    } else {
        cakapPekerja(`Nilai sa adalah ${soalanSemasa.sa}. Ia 5 atau lebih! Mesin mesti membundar ke atas.`, 4000);
    }
});

// KAWALAN BUKA/TUTUP PANDUAN
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

async function laksanaArahanTahap6d() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let mesinRobot = document.getElementById("mesin-robot");
    let blokNombor = document.getElementById("blok-nombor");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Ujian selesai. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX UNTUK IF-ELSE (Kalis spasi)
    let regexBundar = /^if\(sa<5\)\{mesin\.bundar_bawah\(\)\}else\{mesin\.bundar_atas\(\)\}$/;
    let padanan = input.match(regexBundar);

    if (padanan) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Menggerakkan lengan mesin robot...";
            maklumBalas.style.borderLeftColor = "#9b59b6";
        }
        
        cakapPekerja("Menyemak nilai sa pada algoritma...", 2500);
        await tunggu(1500); 
        
        // SITUASI 1: BUNDAR BAWAH (< 5)
        if (soalanSemasa.jawapan === "bawah") {
            cakapPekerja("Syarat IF ditepati! Nilai sa kurang dari 5. Lengan bergerak ke tiub kiri.", 3000);
            await tunggu(1000);
            
            // Animasi Bergerak ke Kiri
            if(mesinRobot) mesinRobot.style.left = "23%";
            mainBunyi(sfxBetul);
            
            await tunggu(1500);
            
            // Blok Jatuh
            if(blokNombor) blokNombor.classList.add("blok-jatuh");
            if(teksAnimasi) teksAnimasi.innerHTML = `Status: Tepat! Nombor dibundarkan kepada ${soalanSemasa.bawah}.`;
            
            berjaya();
        } 
        // SITUASI 2: BUNDAR ATAS (>= 5)
        else {
            cakapPekerja("Syarat IF palsu! Nilai sa adalah 5 atau lebih. Melompat ke fungsi ELSE (Tiub kanan).", 4000);
            await tunggu(1000);
            
            // Animasi Bergerak ke Kanan
            if(mesinRobot) mesinRobot.style.left = "77%";
            mainBunyi(sfxBetul);
            
            await tunggu(1500);
            
            // Blok Jatuh
            if(blokNombor) blokNombor.classList.add("blok-jatuh");
            if(teksAnimasi) teksAnimasi.innerHTML = `Status: Tepat! Nombor dibundarkan kepada ${soalanSemasa.atas}.`;
            
            berjaya();
        }
        
        async function berjaya() {
            await tunggu(1000);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }

    } 
    else {
        // PENILAIAN JIKA KOD MURDER (Salah pasang logik)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahTerbalik = input.match(/if\(sa<5\)\{mesin\.bundar_atas/);
            
            if (salahTerbalik) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Jika sa kurang dari 5, kena bundar bawah, bukan atas!";
                cakapPekerja("Ralat! Awak menterbalikkan hukum pembundaran Matematik!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik pembundaran anda terbalik! Jika nilai sa kurang daripada 5, ia wajib dibundar ke bawah.";
                
                // Letupan Ralat (Teks Animasi)
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: SISTEM JAMMED!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal membaca susunan arahan.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau ejaan arahan (contoh: mesin.bundar_bawah).";
            }
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan struktur if-else, kurungan <code>{}</code> dan syarat <code>(sa<5)</code> tepat.";
            cakapPekerja("Struktur kod if-else tidak lengkap.", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Anda belum melengkapkan struktur If-Else yang betul. Rujuk Panduan Misi!";
        }
        
        if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";

        setTimeout(() => {
            adakahTamat = true;
            let modalKalah = document.getElementById("modalKalah");
            if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
        }, 3000);
    }
}

function cakapPekerja(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPekerja");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}