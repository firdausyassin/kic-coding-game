let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogMesin;
let isPaused = false;

// 🔥 SISTEM GILIRAN HAIWAN (Local Storage) 🔥
const senaraiHaiwan = ["zirafah", "harimau"];
let indeksSemasa = localStorage.getItem("indexHaiwan6B");

if (indeksSemasa === null) {
    indeksSemasa = 0; // Bermula dengan zirafah secara default
} else {
    // Tambah 1, jika lebih dari senarai kembali ke 0 (selang seli)
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiHaiwan.length;
}
localStorage.setItem("indexHaiwan6B", indeksSemasa);

let haiwanSemasa = senaraiHaiwan[indeksSemasa];

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

// 🔥 TUKAR KE DOMContentLoaded 🔥
document.addEventListener("DOMContentLoaded", async function() {
    let kotakHaiwan = document.getElementById("kotak-haiwan");
    let ikonHaiwan = document.getElementById("ikon-haiwan");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    if (haiwanSemasa === "harimau") {
        if(ikonHaiwan) ikonHaiwan.innerHTML = "🐅"; 
        if(teksStatus) teksStatus.innerHTML = "Status: Seekor Harimau lapar (Karnivor) sedang menunggu makanan.";
    } else {
        if(ikonHaiwan) ikonHaiwan.innerHTML = "🦒";
        if(teksStatus) teksStatus.innerHTML = "Status: Seekor Zirafah lapar (Herbivor) sedang menunggu makanan.";
    }
    
    if(kotakHaiwan) kotakHaiwan.style.left = "40%";
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

async function laksanaArahanTahap6b() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let ikonHaiwan = document.getElementById("ikon-haiwan");
    let makananJatuh = document.getElementById("makanan-jatuh");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Haiwan dah kenyang! Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // DUA JENIS LOGIK YANG SAH DAN SEMPURNA
    let regexKarnivor = /^if\(haiwan=="harimau"\)\{zoo\.beri_daging\(\)\}else\{zoo\.beri_daun\(\)\}$/;
    let regexHerbivor = /^if\(haiwan=="zirafah"\)\{zoo\.beri_daun\(\)\}else\{zoo\.beri_daging\(\)\}$/;

    let kodBerasaskanHarimau = input.match(regexKarnivor);
    let kodBerasaskanZirafah = input.match(regexHerbivor);

    if (kodBerasaskanHarimau || kodBerasaskanZirafah) {
        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem AI Diterima. Mengimbas syarat logik (IF) kod anda...";
            maklumBalas.style.borderLeftColor = "#f39c12";
        }
        
        cakapMesin("Memproses syarat kod anda dengan realiti...", 2500);
        await tunggu(1500); 
        
        // SITUASI 1: KOD HARIMAU
        if (kodBerasaskanHarimau) {
            if (haiwanSemasa === "harimau") {
                cakapMesin("Syarat BENAR! Haiwan ini adalah Harimau. Menurunkan Daging (Tindakan IF).", 3000);
                if(makananJatuh) makananJatuh.innerHTML = "🥩";
            } else {
                cakapMesin("Syarat PALSU! Haiwan ini BUKAN Harimau. Sistem melompat ke tindakan ELSE! Menurunkan Daun.", 4000);
                if(makananJatuh) makananJatuh.innerHTML = "🌿";
            }
        } 
        // SITUASI 2: KOD ZIRAFAH
        else if (kodBerasaskanZirafah) {
            if (haiwanSemasa === "zirafah") {
                cakapMesin("Syarat BENAR! Haiwan ini adalah Zirafah. Menurunkan Daun (Tindakan IF).", 3000);
                if(makananJatuh) makananJatuh.innerHTML = "🌿";
            } else {
                cakapMesin("Syarat PALSU! Haiwan ini BUKAN Zirafah. Sistem melompat ke tindakan ELSE! Menurunkan Daging.", 4000);
                if(makananJatuh) makananJatuh.innerHTML = "🥩";
            }
        }
        
        await tunggu(2500); 
        
        if(makananJatuh) makananJatuh.classList.add("makanan-gugur"); 
        mainBunyi(sfxBetul);
        
        await tunggu(800); 
        if(makananJatuh) makananJatuh.style.opacity = "0"; 
        
        if(ikonHaiwan) ikonHaiwan.classList.add("gembira");
        
        if (haiwanSemasa === "harimau") {
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Harimau berpuas hati mendapat Daging dari sistem Else/If!";
        } else {
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Zirafah berpuas hati mendapat Daun dari sistem Else/If!";
        }
        
        await tunggu(1500);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        let modalMenang = document.getElementById("modalKemenangan");
        if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");

    } 
    else {
        // PENILAIAN JIKA KOD MURDER (Salah diet / Sintaks hancur)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahHarimauMakanDaun = input.match(/if\(haiwan=="harimau"\)\{zoo\.beri_daun/);
            let salahZirafahMakanDaging = input.match(/if\(haiwan=="zirafah"\)\{zoo\.beri_daging/);
            
            if (salahHarimauMakanDaun || salahZirafahMakanDaging) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda nak bunuh haiwan ni ke?! Diet terbalik!";
                cakapMesin("Ralat! Walaupun awak guna Else, pastikan padanan diet logik!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Anda telah memberikan diet yang merbahaya kepada haiwan! Pastikan tindakan IF dan ELSE tidak diterbalikkan.";
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapMesin("Sistem gagal memahami logik anda.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau susunan ayat If-Else anda.";
            }
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan struktur if-else, kurungan <code>{}</code> dan ejaan tepat.";
            cakapMesin("Struktur kod if-else tidak lengkap.", 3000);
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

function cakapMesin(mesej, masa) {
    let kotakDialog = document.getElementById("dialogMesin");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogMesin); 
        pemasaDialogMesin = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}