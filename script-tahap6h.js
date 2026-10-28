let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN HAIWAN (Local Storage) 🔥
const senaraiHaiwan = [
    { nama: "Katak", kategori: "amfibia", ikon: "🐸" },
    { nama: "Kucing", kategori: "darat", ikon: "🐈" }
];

let indeksSemasa = localStorage.getItem("indexSains6H");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiHaiwan.length;
}
localStorage.setItem("indexSains6H", indeksSemasa);

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

document.addEventListener("DOMContentLoaded", async function() {
    let haiwanUjian = document.getElementById("haiwan-ujian");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    let laserImbasan = document.getElementById("laser-imbasan");
    
    await tunggu(500); 
    
    if(haiwanUjian) haiwanUjian.innerHTML = haiwanSemasa.ikon;
    
    // Laser animasi turun
    if(laserImbasan) laserImbasan.style.opacity = "1";
    await tunggu(1000); 
    if(laserImbasan) laserImbasan.style.opacity = "0";
    
    if(skrinStatus) {
        skrinStatus.innerHTML = `"${haiwanSemasa.kategori}"`;
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: ${haiwanSemasa.nama} diimbas sebagai haiwan ${haiwanSemasa.kategori.toUpperCase()}.`;
    }
    
    if (haiwanSemasa.kategori === "amfibia") {
        cakapPekerja("Mesin kenal pasti Katak (Amfibia). Ia perlukan air! Arahkan ke pintu kolam.", 4000);
    } else {
        cakapPekerja("Mesin kenal pasti Kucing (Darat). Ia tak suka air! Arahkan ke pintu kandang.", 4000);
    }
});

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

async function laksanaArahanTahap6h() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let pintuKandang = document.getElementById("pintu-kandang");
    let pintuKolam = document.getElementById("pintu-kolam");
    let haiwanUjian = document.getElementById("haiwan-ujian");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Pemindahan selesai. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX UNTUK IF-ELSE AMFIBIA
    let regexAmfibia = /^if\(kategori=="amfibia"\)\{ekosistem\.buka_kolam\(\)\}else\{ekosistem\.buka_kandang\(\)\}$/;
    
    let padanan = input.match(regexAmfibia);

    if (padanan) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Memproses laluan habitat...";
            maklumBalas.style.borderLeftColor = "#00cec9";
        }
        
        cakapPekerja("Menyemak kategori spesies...", 2000);
        await tunggu(1500); 
        
        // SITUASI 1: AMFIBIA (KOLAM KANAN)
        if (haiwanSemasa.kategori === "amfibia") {
            cakapPekerja("Syarat IF ditepati! Ia Amfibia. Membuka pintu kolam air...", 3000);
            if(pintuKolam) pintuKolam.classList.add("pintu-terbuka");
            mainBunyi(sfxBetul);
            await tunggu(1000);
            
            // Animasi Haiwan Masuk Kanan
            if(haiwanUjian) {
                haiwanUjian.style.left = "85%";
                haiwanUjian.style.transform = "translateX(-50%) scale(0.6)";
            }
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Berjaya! Amfibia melompat masuk ke kolam.";
            
            berjaya();
        } 
        // SITUASI 2: BUKAN AMFIBIA / DARAT (KANDANG KIRI)
        else {
            cakapPekerja("Syarat IF palsu! Melompat ke kod ELSE. Membuka pintu kandang darat...", 3500);
            if(pintuKandang) pintuKandang.classList.add("pintu-terbuka");
            mainBunyi(sfxBetul);
            await tunggu(1000);
            
            // Animasi Haiwan Masuk Kiri
            if(haiwanUjian) {
                haiwanUjian.style.left = "15%";
                haiwanUjian.style.transform = "translateX(-50%) scale(0.6)";
            }
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Tepat! Haiwan didaratkan dengan selamat.";
            
            berjaya();
        }
        
        async function berjaya() {
            await tunggu(1500);
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
            let salahTerbalik = input.match(/if\(kategori=="amfibia"\)\{ekosistem\.buka_kandang/);
            
            if (salahTerbalik) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda menghantar Amfibia ke kandang dan haiwan darat ke kolam!";
                cakapPekerja("Bahaya! Amfibia perlukan kolam air, jangan terbalikkan habitat mereka!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik habitat anda terbalik! Jika kategori adalah 'amfibia', tindakan yang betul ialah buka_kolam().";
                
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: KEMALANGAN HABITAT!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses laluan ekosistem.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau ejaan arahan pembukaan pintu.";
            }
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan struktur if-else, kurungan <code>{}</code> dan ejaan tepat.";
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