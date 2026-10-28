// MEMORI SISTEM
let adaBatuDiParuh = false; 
let bilanganBatuDalamTempayan = 0;
const parasAirCukup = 3; 
let adakahTamat = false;

// KOORDINAT PENERBANGAN (Dikekalkan 100% Sama Macam Asal)
const posPokok = { bottom: "300px", left: "12%" };
const posBatu = [
    { bottom: "170px", left: "42%" }, // Menjunam ke Batu 1
    { bottom: "170px", left: "48%" }, // Menjunam ke Batu 2
    { bottom: "170px", left: "54%" }  // Menjunam ke Batu 3
];
const posAtasTempayan = { bottom: "280px", left: "75%" }; // Hover atas tempayan
const posMinum = { bottom: "250px", left: "72%" }; // Bertenggek di bibir tempayan

function laksanaArahan() {
    if (adakahTamat) return;

    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let gagak = document.getElementById("gagak");
    let batuDiParuh = document.getElementById("batu-paruh"); 
    let airDiParuh = document.getElementById("air-minum"); 
    let tempayan = document.getElementById("tempayan");
    let airTempayan = document.getElementById("air-tempayan"); 

    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    // 1. ARAHAN AMBIL BATU
    if (input === "gagak.ambil(batu)") {
        if (bilanganBatuDalamTempayan >= parasAirCukup) {
            maklumBalas.innerHTML = "Air dah membuak naik! Tak perlu batu lagi. Taip <code>gagak.minum(air)</code>";
            maklumBalas.style.borderLeftColor = "#f1c40f";
            if(sfxSalah) sfxSalah.play();
            return;
        }

        if (adaBatuDiParuh === false) {
            adaBatuDiParuh = true; 
            maklumBalas.innerHTML = "Berjaya! Gagak terbang mengambil batu.";
            maklumBalas.style.borderLeftColor = "#0be881"; 
            if(sfxBetul) sfxBetul.play();

            let indexBatu = bilanganBatuDalamTempayan;
            
            // Animasi tukar bottom & left
            gagak.style.bottom = posBatu[indexBatu].bottom;  
            gagak.style.left = posBatu[indexBatu].left; 
            cakap("Caw! Ambil batu...", 1500);
            
            setTimeout(() => {
                document.getElementById("batu" + (indexBatu + 1)).style.opacity = "0"; 
                batuDiParuh.style.opacity = "1"; 
                
                teksAnimasi.innerHTML = "Mengepit batu... Seterusnya taip <code>gagak.masuk(tempayan)</code>";
            }, 1000);

        } else {
            maklumBalas.innerHTML = "Gagak sudah pun memegang batu di paruhnya!";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            if(sfxSalah) sfxSalah.play();
            cakap("Paruh aku dah penuh ni!", 2000);
        }
    } 
    
    // 2. ARAHAN MASUKKAN BATU
    else if (input === "gagak.masuk(tempayan)") {
        if (adaBatuDiParuh === true) {
            adaBatuDiParuh = false; 
            bilanganBatuDalamTempayan++; 
            
            maklumBalas.innerHTML = `Plop! Batu masuk. Jumlah batu terkumpul: ${bilanganBatuDalamTempayan}/3`;
            maklumBalas.style.borderLeftColor = "#00f3ff";
            if(sfxBetul) sfxBetul.play();

            gagak.style.bottom = posAtasTempayan.bottom;  
            gagak.style.left = posAtasTempayan.left; 
            
            setTimeout(() => {
                batuDiParuh.style.opacity = "0"; 
                cakap("Plop! Masuk satu.", 1500);
                
                setTimeout(() => {
                    gagak.style.bottom = posPokok.bottom;
                    gagak.style.left = posPokok.left;
                }, 1000); 

                if (bilanganBatuDalamTempayan >= parasAirCukup) {
                    airTempayan.style.opacity = "1"; 
                    teksAnimasi.innerHTML = "Air dah penuh! 💦 Taip <code>gagak.minum(air)</code>";
                } else {
                    teksAnimasi.innerHTML = `Tempayan ada ${bilanganBatuDalamTempayan} batu. Ulang ambil batu.`;
                }
            }, 1000); 
            
        } else {
            maklumBalas.innerHTML = "Ralat: Gagak tiada batu untuk dimasukkan!";
            maklumBalas.style.borderLeftColor = "#e74c3c"; 
            if(sfxSalah) sfxSalah.play();
            cakap("Nak masukkan apa? Paruh aku kosong!", 2500);
        }
    }

    // 3. ARAHAN MINUM (MENANG)
    else if (input === "gagak.minum(air)") {
        if (bilanganBatuDalamTempayan >= parasAirCukup) {
            adakahTamat = true;
            maklumBalas.innerHTML = "TAHNIAH! Tahap 1 Selesai.";
            maklumBalas.style.borderLeftColor = "#0be881";
            
            gagak.style.bottom = posMinum.bottom;
            gagak.style.left = posMinum.left;
            
            setTimeout(() => {
                airDiParuh.style.opacity = "1"; 
                teksAnimasi.innerHTML = "🌟 Glup.. Glup.. Ahhh! Lega! 🌟";
                
                cakap("Fuhhh... Segar!", 3000);
                if(sfxMenang) sfxMenang.play();

                gagak.style.transform = "translateY(-15px) rotate(15deg)";
                setTimeout(() => gagak.style.transform = "translateY(0) rotate(0)", 300);
                setTimeout(() => gagak.style.transform = "translateY(-15px) rotate(15deg)", 600);
                setTimeout(() => gagak.style.transform = "translateY(0) rotate(0)", 900);

                setTimeout(() => {
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 2000); 
            }, 1000);
        } else {
            maklumBalas.innerHTML = "Ralat: Air masih terlalu rendah. Masukkan batu lagi.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            if(sfxSalah) sfxSalah.play();
            cakap("Paruh aku tak sampai air la...", 2000);
        }
    }

    // 4. JIKA ARAHAN SALAH SINTAKS
    else if (input !== "") {
        maklumBalas.innerHTML = `Ralat Sintaks: Arahan tidak dikenali. Rujuk Panduan Misi.`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        if(sfxSalah) sfxSalah.play();
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogGagak");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        // 🔥 CLASS ARAHAN DITUKAR SELARI DENGAN HTML 🔥
        kotakDialog.classList.add("buka-cakap-gagak");
        setTimeout(() => { kotakDialog.classList.remove("buka-cakap-gagak"); }, masa);
    }
}