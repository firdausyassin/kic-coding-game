let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const posisiLalat = 10; 

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function laksanaArahanTahap4c() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let katak = document.getElementById("katak-sifir");
    let lalat = document.getElementById("objek-lalat");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    let padananLoop = input.match(/^ulang\((\d+)\)\{katak\.lompat\((\d+)\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        let nilaiLompatan = parseInt(padananLoop[2]);
        
        if (kaliUlang === 0 || nilaiLompatan === 0) {
            maklumBalas.innerHTML = "Ralat: Nilai sifar tidak menghasilkan sebarang pergerakan matematik!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Croak! Tak bergerak pun aku...", 3500, "kiri");
            return;
        }

        if (nilaiLompatan !== 2) {
            maklumBalas.innerHTML = "Ralat Gejala: Katak ini hanya mahir melompat dengan gandaan 2 (Sifir 2)!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap(`Aku tak pandai lompat ${nilaiLompatan} la, aku pandai lompat 2 tapak je! 🐸`, 3500, "kiri");
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Loop diaktifkan. Melompat ${nilaiLompatan} langkah sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        
        let kedudukanSemasa = 0; 
        
        let limitLoop = kaliUlang;
        if(limitLoop > 8) limitLoop = 8; 

        cakap("1, 2, LOMPAT!", 2000, "kiri");
        await tunggu(1000);

        for (let i = 1; i <= limitLoop; i++) {
            
            kedudukanSemasa += nilaiLompatan;
            
            let posPeratus = 0;
            if (kedudukanSemasa > 0) {
                posPeratus = (kedudukanSemasa / 10) * 85 + 5; 
            }
            
            katak.classList.add("animasi-lompat");
            katak.style.left = `${posPeratus}%`;
            mainBunyi(sfxBetul); 
            
            teksAnimasi.innerHTML = `Status: Lompatan ke-${i}. Posisi sekarang: ${kedudukanSemasa}`;
            
            await tunggu(400); 
            katak.classList.remove("animasi-lompat"); 
            await tunggu(200); 
            
            if (kedudukanSemasa > 10) {
                break; 
            }
        }

        await tunggu(500);

        let jumlahKeseluruhan = kaliUlang * nilaiLompatan;
        
        // Pilihan Kiri/Kanan untuk dialog tamat permainan
        let posisiAkhirDialog = (kedudukanSemasa >= 5) ? "kanan" : "kiri";

        if (jumlahKeseluruhan === posisiLalat) {
            // TEPAT! 
            adakahTamat = true;
            lalat.style.display = "none"; 
            
            maklumBalas.innerHTML = "Berjaya: Koordinat pendaraban sejajar dengan posisi lalat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Katak mendarat di posisi ${jumlahKeseluruhan}. Lalat ditangkap!`;
            
            document.getElementById("ikonKatak").innerHTML = "🐸😍"; // Tukar emoji kat sini
            mainBunyi(sfxMenang);
            
            cakap("Nyam nyam! Sedapnya sifir 2! 🪰", 4500, "kanan"); 
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 3000);

        } 
        else if (jumlahKeseluruhan > posisiLalat) {
            // TERLAJAK! 
            adakahTamat = true;
            
            katak.classList.add("jatuh-air");
            document.getElementById("percikan").classList.add("buat-percikan");
            
            maklumBalas.innerHTML = `Gagal: Anda melompat ke posisi ${jumlahKeseluruhan}. Lalat berada di posisi 10!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Katak terlajak lompat dan tenggelam ke dalam kolam!";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "💦🐸💦";
                document.getElementById("tajuk-kalah").innerHTML = "Terlajak Lompat!";
                document.getElementById("pesan-kalah").innerHTML = `Arahan anda: <strong>${kaliUlang} x ${nilaiLompatan} = ${jumlahKeseluruhan}</strong>. Katak terlajak dari posisi lalat (10) lalu terlepas ke dalam air! Kurangkan jumlah Loop anda.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        else {
            // TAK SAMPAI!
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Anda melompat ke posisi ${jumlahKeseluruhan}. Masih jauh dari sasaran (10)!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Tenaga gelung tamat. Katak tidak sampai ke sasaran.";
            mainBunyi(sfxSalah);
            
            cakap("Kroak... Mana lalatnya? Aku tak nampak pun!", 4000, posisiAkhirDialog);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐸❓";
                document.getElementById("tajuk-kalah").innerHTML = "Belum Sampai!";
                document.getElementById("pesan-kalah").innerHTML = `Arahan anda: <strong>${kaliUlang} x ${nilaiLompatan} = ${jumlahKeseluruhan}</strong>. Katak terhenti separuh jalan. Tambahkan jumlah pengulangan anda untuk mencapai nombor 10!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format berlapis -> <code>ulang(jumlah){katak.lompat(gandaan)}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa, posisi) {
    let kotakDialog = document.getElementById("dialogSistem");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        
        kotakDialog.classList.remove("dialog-kiri", "dialog-kanan");
        kotakDialog.classList.add(posisi === "kanan" ? "dialog-kanan" : "dialog-kiri");
        
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}