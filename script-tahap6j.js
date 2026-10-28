let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN CAMPURAN (Local Storage) 🔥
const senaraiCampuran = [
    { jenis: "pasir", status: "Tidak Larut", warnaAir: "rgba(139, 69, 19, 0.4)" }, // Air keruh sikit
    { jenis: "garam", status: "Larut Sebati", warnaAir: "rgba(236, 240, 241, 0.6)" } // Air keputihan
];

let indeksSemasa = localStorage.getItem("indexCampuran6J");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiCampuran.length;
}
localStorage.setItem("indexCampuran6J", indeksSemasa);

let campuranSemasa = senaraiCampuran[indeksSemasa];

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
    let cecair = document.getElementById("cecair-campuran");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Set warna air mengikut bahan
    if(cecair) cecair.style.background = campuranSemasa.warnaAir;
    
    // Jana zarah pasir jika bahan adalah pasir
    if (campuranSemasa.jenis === "pasir" && cecair) {
        for(let i=0; i<30; i++) {
            let zarah = document.createElement("div");
            zarah.className = "pasir";
            zarah.style.left = Math.floor(Math.random() * 90) + "%";
            zarah.style.bottom = Math.floor(Math.random() * 20) + "px"; // Berlegar di bawah
            zarah.style.opacity = "1";
            cecair.appendChild(zarah);
        }
    }
    
    await tunggu(1000); 
    
    if(skrinStatus) {
        skrinStatus.innerHTML = `"${campuranSemasa.jenis}"`;
        skrinStatus.style.color = campuranSemasa.jenis === "pasir" ? "#e67e22" : "#ecf0f1";
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Campuran ${campuranSemasa.jenis.toUpperCase()} dikesan. Menunggu kaedah...`;
    }
    
    if (campuranSemasa.jenis === "pasir") {
        cakapPekerja("Ini campuran Pasir. Ia tidak larut dan mendap di bawah. Kaedah apa paling sesuai? (Tapis/Sejat)", 4500);
    } else {
        cakapPekerja("Ini campuran Garam. Ia larut dan sebati dalam air. Garam tak boleh ditapis! Guna kaedah lain.", 4500);
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

async function laksanaArahanTahap6j() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let cecair = document.getElementById("cecair-campuran");
    let corong = document.getElementById("corong-turas");
    let api = document.getElementById("api-bunsen");
    let buih = document.getElementById("buih");
    let garamKristal = document.getElementById("sisa-garam");
    let zarahPasir = document.querySelectorAll(".pasir");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Eksperimen tamat. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // DUA JENIS LOGIK YANG SAH
    let regexPasir = /^if\(bahan=="pasir"\)\{makmal\.tapis\(\)\}else\{makmal\.sejat\(\)\}$/;
    let regexGaram = /^if\(bahan=="garam"\)\{makmal\.sejat\(\)\}else\{makmal\.tapis\(\)\}$/;

    let kodBerasaskanPasir = input.match(regexPasir);
    let kodBerasaskanGaram = input.match(regexGaram);

    if (kodBerasaskanPasir || kodBerasaskanGaram) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Memulakan protokol pengasingan...";
            maklumBalas.style.borderLeftColor = "#1abc9c";
        }
        
        cakapPekerja("Menyemak kelarutan bahan dalam bikar...", 2000);
        await tunggu(1500); 
        
        // SITUASI 1: PASIR (MENAPIS)
        if (campuranSemasa.jenis === "pasir") {
            cakapPekerja("Syarat disahkan! Pasir tidak larut. Kaedah MENAPIS dimulakan.", 3000);
            await tunggu(1000);
            
            // Animasi Menapis
            if(corong) corong.classList.add("turas-aktif");
            mainBunyi(sfxBetul);
            
            await tunggu(1500);
            
            // Pasir hilang (naik ke corong secara ilusi), air jadi jernih
            zarahPasir.forEach(p => p.style.opacity = "0");
            if(cecair) cecair.style.background = "rgba(52, 152, 219, 0.5)"; // Air jernih balik
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Berjaya! Zarah pasir diasingkan melalui penapis.";
            
            berjaya();
        } 
        // SITUASI 2: GARAM (MENYEJAT)
        else {
            cakapPekerja("Syarat disahkan! Garam larut sebati. Kaedah MENYEJAT dimulakan.", 3000);
            await tunggu(1000);
            
            // Animasi Menyejat
            if(api) api.classList.add("api-aktif");
            mainBunyi(sfxBetul);
            
            await tunggu(1000);
            if(buih) buih.classList.add("buih-aktif"); // Mendidih
            
            // Air berkurang ke 0
            if(cecair) cecair.style.height = "0";
            
            await tunggu(2000);
            if(buih) buih.classList.remove("buih-aktif");
            if(api) api.classList.remove("api-aktif");
            
            // Kristal Garam muncul
            if(garamKristal) garamKristal.style.opacity = "1";
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Berjaya! Cecair tersejat, sisa garam tertinggal.";
            
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
        // PENILAIAN JIKA KOD MURDER (Salah kaedah)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahTapisGaram = input.match(/if\(bahan=="garam"\)\{makmal\.tapis/);
            let salahSejatPasir = input.match(/if\(bahan=="pasir"\)\{makmal\.sejat/);
            
            if (salahTapisGaram || salahSejatPasir) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Kaedah sains yang salah untuk bahan ini!";
                cakapPekerja("Ehh! Garam tak boleh ditapis, dan sejatkan air berserta pasir adalah buang masa!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik eksperimen anda terbalik! Ingat, bahan tidak larut (pasir) diasingkan dengan cara menapis (tapis), bahan larut (garam) diasingkan dengan cara menyejat (sejat).";
                
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: EKSPERIMEN GAGAL!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses arahan makmal.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau ejaan arahan (contoh: makmal.sejat()).";
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