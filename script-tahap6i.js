let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN DATA CUACA (Local Storage) 🔥
const senaraiCuaca = [
    { jenis: "hujan", ikon: "🌧️", warna: "biru", animasi: "animasi-hujan" },
    { jenis: "panas", ikon: "☀️", warna: "oren", animasi: "animasi-panas" }
];

let indeksSemasa = localStorage.getItem("indexCuaca6I");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiCuaca.length;
}
localStorage.setItem("indexCuaca6I", indeksSemasa);

let cuacaSemasa = senaraiCuaca[indeksSemasa];

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
    let ikonCuaca = document.getElementById("ikon-cuaca");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Paparkan ikon cuaca
    if(ikonCuaca) {
        ikonCuaca.innerHTML = cuacaSemasa.ikon;
        ikonCuaca.classList.add(cuacaSemasa.animasi);
    }
    
    await tunggu(1000); // Masa radar mengimbas
    
    if(skrinStatus) {
        skrinStatus.innerHTML = `"${cuacaSemasa.jenis}"`;
        skrinStatus.style.color = cuacaSemasa.jenis === "hujan" ? "#3498db" : "#e67e22";
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Cuaca ${cuacaSemasa.jenis.toUpperCase()} dikesan. Menunggu input carta...`;
    }
    
    if (cuacaSemasa.jenis === "hujan") {
        cakapPekerja("Hujan lebat! Carta perlukan palang Biru. Sila tulis kod untuk merekodkannya.", 4000);
    } else {
        cakapPekerja("Cuaca sangat Panas! Carta perlukan palang Oren. Arahkan sistem merekodnya.", 4000);
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

async function laksanaArahanTahap6i() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let palangData = document.getElementById("palang-data");
    let labelX = document.getElementById("label-x");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Proses rekod selesai. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // DUA JENIS LOGIK YANG SAH (Pelajar boleh mula dengan if hujan ATAU if panas)
    let regexHujan = /^if\(cuaca=="hujan"\)\{carta\.tambah_biru\(\)\}else\{carta\.tambah_oren\(\)\}$/;
    let regexPanas = /^if\(cuaca=="panas"\)\{carta\.tambah_oren\(\)\}else\{carta\.tambah_biru\(\)\}$/;

    let kodBerasaskanHujan = input.match(regexHujan);
    let kodBerasaskanPanas = input.match(regexPanas);

    if (kodBerasaskanHujan || kodBerasaskanPanas) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Menghantar parameter ke carta palang...";
            maklumBalas.style.borderLeftColor = "#3498db";
        }
        
        cakapPekerja("Memproses data cuaca untuk visualisasi...", 2000);
        await tunggu(1500); 
        
        // SITUASI 1: HUJAN (Biru)
        if (cuacaSemasa.jenis === "hujan") {
            cakapPekerja("Sistem merekodkan cuaca Hujan. Palang BIRU diaktifkan!", 2500);
            await tunggu(1000);
            
            if(palangData) {
                palangData.classList.add("palang-biru");
                palangData.style.height = "90%";
            }
            if(labelX) labelX.innerHTML = "Hujan";
            
            mainBunyi(sfxBetul);
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Data Hujan direkod dalam carta.";
            
            berjaya();
        } 
        // SITUASI 2: PANAS (Oren - LOMPAT KE ELSE/IF)
        else {
            cakapPekerja("Sistem merekodkan cuaca Panas. Palang OREN diaktifkan!", 2500);
            await tunggu(1000);
            
            if(palangData) {
                palangData.classList.add("palang-oren");
                palangData.style.height = "60%"; // Ketinggian berbeza sikit untuk variasi
            }
            if(labelX) labelX.innerHTML = "Panas";
            
            mainBunyi(sfxBetul);
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Data Panas direkod dalam carta.";
            
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
        // PENILAIAN JIKA KOD MURDER (Salah warna / Salah sintaks)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahWarnaHujan = input.match(/if\(cuaca=="hujan"\)\{carta\.tambah_oren/);
            let salahWarnaPanas = input.match(/if\(cuaca=="panas"\)\{carta\.tambah_biru/);
            
            if (salahWarnaHujan || salahWarnaPanas) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda memaparkan warna yang salah untuk cuaca tersebut!";
                cakapPekerja("Aduhai! Kalau hujan mesti warna biru, kalau panas warna oren. Jangan terbalik!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik data carta anda terbalik! Hujan diwakili oleh carta.tambah_biru(), manakala cuaca yang tidak hujan (panas) diwakili oleh carta.tambah_oren().";
                
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: KORUPSI DATA CARTA!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses logik matematik anda.", 3000);
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