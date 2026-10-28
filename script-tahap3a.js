// MEMORI SISTEM TAHAP 3A (Lompat Mutlak)
let adakahTamat = false;
let adakahSibuk = false;
let jumlahSasaran = 5;   

// KOORDINAT PIXEL BARU:
// Tebing = 160px. Buaya berenang di 70px.
const posLompat = [
    { bottom: "160px", left: "3%" },   // Pos 0: Tebing Kiri (Start)
    { bottom: "110px", left: "19%" },  // Pos 1: Pijak Buaya 1
    { bottom: "110px", left: "31%" },  // Pos 2: Pijak Buaya 2
    { bottom: "110px", left: "43%" },  // Pos 3: Pijak Buaya 3
    { bottom: "110px", left: "55%" },  // Pos 4: Pijak Buaya 4
    { bottom: "160px", left: "75%" },  // Pos 5: Pulau Tengah (MENANG)
    { bottom: "50px",  left: "93%" }   // Pos 6: Terlajak masuk Sungai Belakang (KALAH)
];

let pemasaDialog;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara oleh browser."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function laksanaArahanTahap3() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let rusa = document.getElementById("rusa");
    let ikon = document.getElementById("ikonRusa");
    let epalAtasPokok = document.getElementById("epal");
    let buayaRahsia = document.getElementById("buaya-rahsia");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }
    
    if (adakahSibuk) return;

    // TUKAR NAMA FUNGSI KEPADA RUSA
    let padananLompat = input.match(/^rusa\.lompat\((\d+)\)$/);

    if (padananLompat) {
        let jumlahLompatan = parseInt(padananLompat[1]);
        
        if (jumlahLompatan === 0) {
            maklumBalas.innerHTML = "Ralat Logik: Jika diletakkan nilai 0, Sang Rusa takkan bergerak ke mana-mana!";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            mainBunyi(sfxSalah);
            cakap("Dah kalau sifar (0), baik aku sambung makan rumput kat sini!", 3000);
            return;
        }

        adakahTamat = true; // Kunci terminal
        adakahSibuk = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = `Sistem: Memproses lompatan sejauh ${jumlahLompatan} koordinat...`;
        maklumBalas.style.borderLeftColor = "#3498db";
        cakap("Baiklah, aku lompat " + jumlahLompatan + " langkah terus!", 2000);

        // Hadkan lompatan supaya tak terbang keluar skrin terus (Maksimum jatuh ke posisi 6)
        let targetIndex = Math.min(jumlahLompatan, 6);

        // 🔥 ANIMASI LOMPAT PARABOLIK (Melengkung) 🔥
        rusa.style.left = posLompat[targetIndex].left;
        rusa.style.bottom = posLompat[targetIndex].bottom;
        rusa.classList.add("lompatan-arc"); 
        
        await tunggu(800); // Tunggu sampai darat
        rusa.classList.remove("lompatan-arc");

        // ===================================
        // KES 1: LOMPATAN TAK CUKUP (DIMAKAN BUAYA)
        // ===================================
        if (jumlahLompatan < jumlahSasaran) {
            
            rusa.classList.add("jatuh-air");
            rusa.style.bottom = "50px"; // Rusa ditarik masuk air
            ikon.innerHTML = "😵"; 
            teksAnimasi.innerHTML = "Status: Ngapp! Rusa dibaham sang bedal!";
            
            maklumBalas.innerHTML = `Gagal! Anda letak nombor ${jumlahLompatan}. Ini Lompatan Mutlak, anda tak boleh berhenti separuh jalan!`;
            maklumBalas.style.borderLeftColor = "#e74c3c"; 
            mainBunyi(sfxSalah);
            
            cakap("Tidaaaakk! Buaya tipuuu!", 3000);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐊";
                document.getElementById("tajuk-kalah").innerHTML = "Ngappp! Dimakan Buaya!";
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan angka ${jumlahLompatan}, bermakna Sang Rusa berhenti rehat di atas belakang buaya dan menjadi santapannya! Sila kira keseluruhan buaya yang ada.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        
        // ===================================
        // KES 2: LOMPATAN TEPAT 5 (MENANG)
        // ===================================
        else if (jumlahLompatan === jumlahSasaran) {
            
            teksAnimasi.innerHTML = "Status: Rusa berjaya mendarat di pulau dengan selamat!";
            maklumBalas.innerHTML = "Berjaya: Logik lompatan mutlak dieksekusi dengan sempurna.";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxBetul);

            await tunggu(500);

            // Epal jatuh ke Rusa! (Tiada lagi bug rusa terbang ke langit)
            epalAtasPokok.style.bottom = "180px"; 
            epalAtasPokok.style.left = "78%"; 
            
            await tunggu(500);
            
            epalAtasPokok.style.opacity = "0"; 
            ikon.innerHTML = "🦌🍎"; // Rusa makan epal
            cakap("Nyum nyum! Misi berjaya!", 5000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        
        // ===================================
        // KES 3: LOMPATAN TERLAJAK (JATUH SUNGAI KEDUA)
        // ===================================
        else {
            
            rusa.classList.add("jatuh-air");
            ikon.innerHTML = "😵"; 
            teksAnimasi.innerHTML = "Status: Rusa terlajak melompat dan jatuh ke sungai kedua!";
            maklumBalas.innerHTML = `Gagal: Anda melompat ${jumlahLompatan} langkah. Rusa terlajak dari pulau!`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            
            cakap("Aduh! Kuat sangat lompat, dah terlajak masuk sungai!", 3000);
            mainBunyi(sfxSalah);

            // 🔥 BUAYA RAHSIA MUNCUL DARI BAWAH AIR! 🔥
            await tunggu(500);
            buayaRahsia.classList.add("muncul-buaya");
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐊🌊";
                document.getElementById("tajuk-kalah").innerHTML = "Terlajak & Dibaham!";
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan nilai ${jumlahLompatan}. Daya yang kuat menyebabkan Rusa melompat melepasi pulau dan jatuh ke dalam sungai kedua. Buaya rahsia sedang menunggunya di situ!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }

    } 
    else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format ejaan adalah <code>rusa.lompat(jumlah)</code>.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogRusa");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}