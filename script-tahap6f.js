let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN DATA KEWANGAN (Local Storage) 🔥
const senaraiData = [
    { barang: "Komputer", ikon: "💻", kos: 1500, jual: 2000, status: "untung" },
    { barang: "Telefon", ikon: "📱", kos: 1200, jual: 900, status: "rugi" },
    { barang: "Basikal", ikon: "🚲", kos: 300, jual: 450, status: "untung" },
    { barang: "Jam Tangan", ikon: "⌚", kos: 500, jual: 350, status: "rugi" }
];

let indeksSemasa = localStorage.getItem("indexKewangan6F");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiData.length;
}
localStorage.setItem("indexKewangan6F", indeksSemasa);

let dataSemasa = senaraiData[indeksSemasa];

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
    let ikonBarang = document.getElementById("ikon-barang");
    let teksKos = document.getElementById("teks-kos");
    let teksJual = document.getElementById("teks-jual");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Paparkan data ke monitor
    if(ikonBarang) ikonBarang.innerHTML = dataSemasa.ikon;
    if(teksKos) teksKos.innerHTML = `RM ${dataSemasa.kos}`;
    
    await tunggu(800); 
    
    if(teksJual) teksJual.innerHTML = `RM ${dataSemasa.jual}`;
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Laporan jualan ${dataSemasa.barang} dikesan. Menilai status...`;
    }
    
    if (dataSemasa.status === "untung") {
        cakapPekerja(`Lihat skrin! Kos RM${dataSemasa.kos}, tapi kita jual RM${dataSemasa.jual}. Jika jual lebih besar, ia mesti UNTUNG!`, 5000);
    } else {
        cakapPekerja(`Aduhai, kos RM${dataSemasa.kos}, tapi terpaksa jual RM${dataSemasa.jual} je. Jika jual lebih kecil, ia pasti RUGI!`, 5000);
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

async function laksanaArahanTahap6f() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let grafStatus = document.getElementById("graf-status");
    let monitor = document.getElementById("monitor-bursa");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Laporan dihantar. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX LOGIK: if(harga_jual>harga_kos){terminal.lapor_untung()}else{terminal.lapor_rugi()}
    let regexKewangan = /^if\(harga_jual>harga_kos\)\{terminal\.lapor_untung\(\)\}else\{terminal\.lapor_rugi\(\)\}$/;
    
    let padanan = input.match(regexKewangan);

    if (padanan) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Mengira perbezaan harga di bursa...";
            maklumBalas.style.borderLeftColor = "#2ecc71";
        }
        
        cakapPekerja("Menjalankan perbandingan harga_jual > harga_kos...", 2500);
        await tunggu(1500); 
        
        // SITUASI 1: JUAL > KOS (UNTUNG)
        if (dataSemasa.status === "untung") {
            cakapPekerja("Syarat BENAR! Harga Jual lebih tinggi. Melaporkan UNTUNG!", 3000);
            await tunggu(1000);
            
            if(grafStatus) {
                grafStatus.innerHTML = "UNTUNG 📈";
                grafStatus.classList.add("untung-aktif");
            }
            if(monitor) monitor.style.borderColor = "#2ecc71";
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Laporan Untung didaftarkan ke sistem.";
            mainBunyi(sfxBetul);
        } 
        // SITUASI 2: JUAL < KOS (RUGI - Masuk fungsi ELSE)
        else {
            cakapPekerja("Syarat PALSU! Harga Jual lebih rendah. Melompat ke ELSE: Melaporkan RUGI!", 3500);
            await tunggu(1500);
            
            if(grafStatus) {
                grafStatus.innerHTML = "RUGI 📉";
                grafStatus.classList.add("rugi-aktif");
            }
            if(monitor) monitor.style.borderColor = "#e74c3c";
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Laporan Rugi didaftarkan ke sistem.";
            mainBunyi(sfxBetul);
        }
        
        await tunggu(2000);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        let modalMenang = document.getElementById("modalKemenangan");
        if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");

    } 
    else {
        // PENILAIAN JIKA KOD MURDER (Salah pasang logik / Sintaks)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahLapor = input.match(/if\(harga_jual>harga_kos\)\{terminal\.lapor_rugi/);
            let salahSimbol = input.match(/if\(harga_jual<harga_kos/);
            
            if (salahLapor) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Jual lebih tinggi tapi anda lapor rugi?!";
                cakapPekerja("Ralat Kewangan! Kalau jual mahal dari kos, kita dapat UNTUNG!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik perniagaan terbalik! Jika (harga_jual > harga_kos), tindakan sepatutnya adalah lapor_untung().";
            } else if (salahSimbol) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Matematik: Sila gunakan simbol > (Lebih Besar).";
                cakapPekerja("Sila ikut arahan panduan. Guna simbol > untuk semak untung.", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Sila bina syarat utama menggunakan pembanding lebih besar (>), iaitu if(harga_jual > harga_kos).";
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses susunan skrip.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau susunan ayat If-Else anda.";
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