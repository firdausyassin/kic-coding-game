let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN BAHAN (Local Storage) 🔥
const senaraiBahan = ["besi", "kayu"];
let indeksSemasa = localStorage.getItem("indexBahan6C");

if (indeksSemasa === null) {
    indeksSemasa = 0; // Bermula dengan besi
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiBahan.length;
}
localStorage.setItem("indexBahan6C", indeksSemasa);

let bahanSemasa = senaraiBahan[indeksSemasa];

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
    let objekUjian = document.getElementById("objek-ujian");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Objek dijatuhkan ke terminal ujian
    if(objekUjian) {
        objekUjian.innerHTML = bahanSemasa === "besi" ? "🔩" : "🪵";
        objekUjian.classList.add("objek-masuk");
    }
    
    await tunggu(1000); // Imbasan bahan
    
    if(skrinStatus) {
        skrinStatus.innerHTML = bahanSemasa.toUpperCase();
        skrinStatus.style.color = bahanSemasa === "besi" ? "#0be881" : "#f39c12";
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Material ${bahanSemasa.toUpperCase()} dikesan. Menunggu input...`;
    }
    
    if (bahanSemasa === "besi") {
        cakapPekerja("Mesin letak Besi (Konduktor). Pastikan litar disambung supaya mentol menyala!", 4000);
    } else {
        cakapPekerja("Mesin letak Kayu (Penebat). Pastikan litar diputuskan jika tidak mahu litar pintas!", 4000);
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

async function laksanaArahanTahap6c() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let mentolKaca = document.getElementById("mentol-kaca");
    let semuaWayar = document.querySelectorAll(".wayar");
    let percikan = document.getElementById("percikan");
    
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

    // DUA JENIS LOGIK YANG SAH (Pelajar boleh mula dari Besi atau Kayu)
    let regexBesiMula = /^if\(bahan=="besi"\)\{litar\.sambung\(\)\}else\{litar\.putus\(\)\}$/;
    let regexKayuMula = /^if\(bahan=="kayu"\)\{litar\.putus\(\)\}else\{litar\.sambung\(\)\}$/;

    let kodBerasaskanBesi = input.match(regexBesiMula);
    let kodBerasaskanKayu = input.match(regexKayuMula);

    if (kodBerasaskanBesi || kodBerasaskanKayu) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Menguji pengaliran arus elektrik...";
            maklumBalas.style.borderLeftColor = "#f1c40f";
        }
        
        cakapPekerja("Menghidupkan kuasa bateri untuk menguji litar...", 2500);
        await tunggu(1500); 
        
        // SITUASI 1: KOD BERASASKAN BESI
        if (kodBerasaskanBesi) {
            if (bahanSemasa === "besi") {
                cakapPekerja("Syarat BENAR (Besi)! Litar disambung...", 2000);
                await tunggu(1000);
                berjayaMenyala();
            } else {
                cakapPekerja("Syarat PALSU (Bukan Besi)! Melompat ke ELSE: Litar diputuskan.", 3000);
                await tunggu(1500);
                berjayaPutus();
            }
        } 
        // SITUASI 2: KOD BERASASKAN KAYU
        else if (kodBerasaskanKayu) {
            if (bahanSemasa === "kayu") {
                cakapPekerja("Syarat BENAR (Kayu)! Litar diputuskan...", 2000);
                await tunggu(1000);
                berjayaPutus();
            } else {
                cakapPekerja("Syarat PALSU (Bukan Kayu)! Melompat ke ELSE: Litar disambung.", 3000);
                await tunggu(1500);
                berjayaMenyala();
            }
        }
        
        // FUNGSI MENANG JIKA LITAR DISAMBUNG (BESI)
        async function berjayaMenyala() {
            semuaWayar.forEach(w => w.classList.add("wayar-aktif"));
            await tunggu(500);
            mentolKaca.classList.add("menyala");
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Arus mengalir. Mentol menyala!";
            
            await tunggu(1500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }
        
        // FUNGSI MENANG JIKA LITAR PUTUS (KAYU)
        async function berjayaPutus() {
            // Hanya separuh wayar aktif sampai ke terminal
            document.getElementById("wayar-bawah-kiri").classList.add("wayar-aktif");
            document.getElementById("wayar-kiri").classList.add("wayar-aktif");
            document.getElementById("wayar-atas").classList.add("wayar-aktif");
            
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Selamat! Penebat menghalang litar pintas.";
            
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
            let salahBesiPutus = input.match(/if\(bahan=="besi"\)\{litar\.putus/);
            let salahKayuSambung = input.match(/if\(bahan=="kayu"\)\{litar\.sambung/);
            
            if (salahBesiPutus || salahKayuSambung) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda menyambung litar pada kayu dan memutus pada besi!";
                cakapPekerja("Ralat! Awak menterbalikkan tindakan pengaliran arus elektrik!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik litar anda terbalik! Ingat, kayu adalah penebat (tidak mengalir arus), dan besi adalah konduktor.";
                
                // Letupan Percikan
                if(percikan) percikan.classList.add("meletup");
                if(teksAnimasi) teksAnimasi.innerHTML = "Status: LITAR PINTAS BERLAKU!";
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal membaca sambungan litar.", 3000);
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