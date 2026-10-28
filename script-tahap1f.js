let objekDikumpul = 0; 
const sasaranObjek = 2; // Ada 2 bahan magnetik (Kunci & Klipkertas)
let arraySudahDitarik = [];
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

async function laksanaArahanTahap1f() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Eksperimen telah selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // Check format sintaks: magnet.tarik(objek)
    let padananSintaks = input.match(/^magnet\.tarik\(([a-z]+)\)$/);

    if (padananSintaks) {
        let sasaran = padananSintaks[1];
        let elemenSasaran = document.getElementById(sasaran);
        
        let senaraiSah = ["kunci", "kayu", "klipkertas", "plastik"];
        let bahanMagnetik = ["kunci", "klipkertas"];
        let bahanBukanMagnetik = ["kayu", "plastik"];

        // Ralat 1: Objek tidak wujud
        if (!senaraiSah.includes(sasaran)) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Objek: Komputer tidak menemui objek "${sasaran}" di atas meja!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            return;
        }

        // Ralat 2: Objek dah ditarik
        if (arraySudahDitarik.includes(sasaran)) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat: ${sasaran} sudah melekat pada kutub magnet! Pilih objek lain.`;
            maklumBalas.style.borderLeftColor = "#f1c40f";
            cakap("magnet", "Dah penuh kat sini!", 2000);
            return;
        }

        adakahSibuk = true;

        // KES 1: JIKA BAHAN MAGNETIK (BETUL)
        if (bahanMagnetik.includes(sasaran)) {
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Berjaya: Menarik ${sasaran} menggunakan daya magnetik...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            
            // Animasi Gelombang Magnetik kuat sikit
            let gelombang = document.getElementById("gelombang-magnet");
            gelombang.style.animationDuration = "0.5s";

            // 🔥 LOGIK KEDUDUKAN (KUTUB MAGNET) 🔥
            // Naikkan Z-index supaya dia 100% menindih di atas magnet
            elemenSasaran.style.zIndex = "15";

            if (sasaran === "kunci") {
                elemenSasaran.style.bottom = "265px"; // Tepat di kutub atas
                elemenSasaran.style.left = "23%"; 
                elemenSasaran.style.transform = "rotate(-40deg) scale(0.8)";
            } else if (sasaran === "klipkertas") {
                elemenSasaran.style.bottom = "210px"; // Tepat di kutub bawah
                elemenSasaran.style.left = "24.5%"; 
                elemenSasaran.style.transform = "rotate(-15deg) scale(0.8)";
            }
            
            await tunggu(600); 

            // Padam tulisan label lepas melekat (Biar ikon je tinggal lekat kat magnet)
            let label = elemenSasaran.querySelector('.label-nama');
            if(label) label.style.display = "none";

            gelombang.style.animationDuration = "2s"; // Normal balik

            arraySudahDitarik.push(sasaran);
            objekDikumpul++;
            
            // CEK JIKA MENANG
            if (objekDikumpul >= sasaranObjek) {
                adakahTamat = true;
                teksAnimasi.innerHTML = "Status: Semua bahan magnetik berjaya dipisahkan!";
                maklumBalas.innerHTML = "Sempurna: Eksperimen pemisahan bahan selesai!";
                
                await tunggu(1000);
                cakap("magnet", "Zappp! Kerja selesai! ⚡", 4000);
                mainBunyi(sfxMenang);
                
                setTimeout(() => {
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 2000);
            } else {
                teksAnimasi.innerHTML = `Status: Mencari baki bahan magnetik yang lain...`;
                maklumBalas.innerHTML = `Bagus! Teruskan mencari baki bahan magnetik.`;
                cakap("magnet", "Zap! Melekat!", 2000);
                adakahSibuk = false;
            }

        } 
        // KES 2: JIKA BAHAN BUKAN MAGNETIK (SALAH)
        else if (bahanBukanMagnetik.includes(sasaran)) {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#ff5e57";
            
            // Efek bergegar sikit kat objek yang tak boleh tarik
            elemenSasaran.style.transform = "translateX(-10px)";
            await tunggu(100);
            elemenSasaran.style.transform = "translateX(10px)";
            await tunggu(100);
            elemenSasaran.style.transform = "translateX(0)";

            maklumBalas.innerHTML = `Gagal: Magnet tidak memberi kesan kepada ${sasaran}.`;
            teksAnimasi.innerHTML = `Ralat Sains: ${sasaran} adalah bahan bukan magnetik!`;
            
            cakap("magnet", "Eh, tak lekat pun!", 3000);
            
            setTimeout(() => {
                let ikonKalah = (sasaran === "kayu") ? "🪵" : "🧴";
                document.getElementById("ikon-kalah").innerHTML = `${ikonKalah}❌`;
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan parameter '${sasaran}'. Namun, dari segi logik sains, magnet hanya menarik objek yang mengandungi besi, keluli, atau nikel. Kayu dan plastik tidak akan bertindak balas.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>magnet.tarik(objek)</code>.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(idPemanggil, mesej, masa) {
    let kotakDialog = document.getElementById("dialog-magnet");
    
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
        }, masa);
    }
}