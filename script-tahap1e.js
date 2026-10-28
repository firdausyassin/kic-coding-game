let tahapKitaran = 0; 
let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Urutan kod yang wajib ditaip oleh pengguna (Tikus digantikan katak)
const urutanRantaian = [
    "belalang.makan(daun)",
    "tikus.makan(belalang)",
    "ular.makan(tikus)",
    "helang.makan(ular)"
];

async function laksanaArahanTahap1e() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Ekosistem telah lengkap. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // Check format sintaks: objek.makan(objek)
    let padananSintaks = input.match(/^([a-z]+)\.makan\(([a-z]+)\)$/);

    if (padananSintaks) {
        let pemangsa = padananSintaks[1];
        let mangsa = padananSintaks[2];
        let kodSemasa = urutanRantaian[tahapKitaran]; // Kod yang sistem nak

        // KES 1: JIKA KOD TEPAT DENGAN URUTAN
        if (input === kodSemasa) {
            adakahSibuk = true;
            mainBunyi(sfxBetul);
            
            let elemenPemangsa = document.getElementById(pemangsa);
            let elemenMangsa = document.getElementById(mangsa);
            
            maklumBalas.innerHTML = `Berjaya: ${pemangsa} sedang memburu ${mangsa}...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            
            cakap(pemangsa, `Nyam nyam! Sedapnya ${mangsa}!`, 2500);

            // LOGIK ANIMASI: Ambil posisi koordinat mangsa
            let gayaMangsa = window.getComputedStyle(elemenMangsa);
            let leftMangsa = gayaMangsa.left;
            let ikonPemangsa = elemenPemangsa.querySelector('.ikon-haiwan');

            // 🔥 ANIMASI HELANG MENJUNAM (SUPER EPIC!) 🔥
            if (pemangsa === "helang") {
                // Fasa 1: Melilau slow-slow ke tepi skrin kanan
                elemenPemangsa.style.transition = "top 2s ease-in-out, left 2s ease-in-out";
                elemenPemangsa.style.top = "220px";
                elemenPemangsa.style.left = "88%";
                ikonPemangsa.style.transform = "scaleX(-1) rotate(-15deg)"; // Muka condong ke bawah sikit
                
                await tunggu(2000); // Tunggu helang sedia di tepi

                // Fasa 2: Memecut menjunam ke arah ular!
                elemenPemangsa.style.transition = "top 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
                elemenPemangsa.style.top = "calc(100% - 190px)"; // Turun ke level tanah
                elemenPemangsa.style.left = leftMangsa;
                ikonPemangsa.style.transform = "scaleX(-1) rotate(-45deg)"; // Dive mode!
                
                await tunggu(400); // Masa menjunam
            } 
            // Haiwan di darat berjalan biasa
            else {
                elemenPemangsa.style.transition = "left 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
                elemenPemangsa.style.left = leftMangsa;
                ikonPemangsa.style.transform = "scaleX(1)"; // Pusing muka memburu ke kanan
                await tunggu(600); // Masa berjalan
            }

            // Mangsa ghaib (dimakan)
            elemenMangsa.style.opacity = "0";
            elemenMangsa.style.transform = "scale(0)";

            // Pemangsa membesar sikit tanda kenyang
            if (pemangsa === "helang") {
                ikonPemangsa.style.transform = "scaleX(-1) scale(1.3)";
            } else {
                ikonPemangsa.style.transform = "scaleX(1) scale(1.3)";
            }
            
            await tunggu(500);

            // Kembali saiz normal
            if (pemangsa === "helang") {
                ikonPemangsa.style.transform = "scaleX(-1) scale(1)";
                
                // Helang terbang balik ke langit (Posisi Kemenangan)
                elemenPemangsa.style.transition = "top 1.5s ease-out, left 1.5s ease-out";
                elemenPemangsa.style.top = "90px";
                elemenPemangsa.style.left = "75%";
                ikonPemangsa.style.transform = "scaleX(-1)"; // Tegak balik
                await tunggu(1500);
            } else {
                ikonPemangsa.style.transform = "scaleX(1) scale(1)";
            }

            tahapKitaran++; // Bergerak ke fasa seterusnya
            
            // CEK JIKA MENANG
            if (tahapKitaran >= urutanRantaian.length) {
                adakahTamat = true;
                teksAnimasi.innerHTML = "Status: Helang kekal sebagai pemangsa puncak!";
                maklumBalas.innerHTML = "Sempurna: Kitaran Rantaian Makanan selesai!";
                
                await tunggu(1000);
                cakap("helang", "Aku raja di ekosistem ni! 🦅", 4000);
                mainBunyi(sfxMenang);
                
                setTimeout(() => {
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 2000);
            } else {
                // UPDATE TEKS UNTUK MINTA NEXT KOD
                let kodSeterusnya = urutanRantaian[tahapKitaran];
                teksAnimasi.innerHTML = `Status: ${pemangsa} sedang menanti pemangsanya...`;
                maklumBalas.innerHTML = `Apakah rantaian seterusnya?`;
                adakahSibuk = false;
            }

        } 
        // KES 2: SALAH URUTAN ATAU LOGIK MENGARUT
        else {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#ff5e57";
            
            let senaraiSah = ["daun", "belalang", "tikus", "ular", "helang"];
            if (!senaraiSah.includes(pemangsa) || !senaraiSah.includes(mangsa)) {
                maklumBalas.innerHTML = `Ralat Objek: Komputer tidak menemui parameter "${pemangsa}" atau "${mangsa}" dalam ekosistem ini!`;
                return;
            }

            if (pemangsa === "helang" && mangsa === "daun") {
                maklumBalas.innerHTML = "Ralat Logik: Helang tak makan daun lah! Taip mengikut urutan yang betul.";
            } else if (mangsa === pemangsa) {
                maklumBalas.innerHTML = `Ralat Kanibal: ${pemangsa} takkan makan diri sendiri!`;
            } else if (input === "daun.makan(belalang)") {
                maklumBalas.innerHTML = "Ralat Ekosistem: Daun tak makan belalang, belalang yang makan daun!";
            } else {
                maklumBalas.innerHTML = `Ralat Rantaian: Urutan salah! Adakah ${pemangsa} makan ${mangsa} pada tahap ini? Sila ikut urutan.`;
            }
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>pemangsa.makan(mangsa)</code>.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(idHaiwan, mesej, masa) {
    let namaDialog = "dialog-" + idHaiwan;
    let kotakDialog = document.getElementById(namaDialog);
    
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
        }, masa);
    }
}