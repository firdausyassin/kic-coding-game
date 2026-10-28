let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const nilaiAsas = 100;
const nilaiSasaran = 500;

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

async function laksanaArahanTahap4e() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let zonTangga = document.getElementById("zon-tangga");
    let dino = document.getElementById("watak-dino");
    let awanDialog = document.getElementById("dialogDino");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Eksperimen tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    // RegEx Tangkap: ulang(jumlah){nombor.tambah(pola)}
    let padananLoop = input.match(/^ulang\((\d+)\)\{nombor\.tambah\((\d+)\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        let nilaiTambah = parseInt(padananLoop[2]);
        
        if (kaliUlang === 0 || nilaiTambah === 0) {
            maklumBalas.innerHTML = "Ralat Geometri: Gelung sifar tidak menghasilkan sebarang pola menaik!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Eh? Tak bina apa-apa ke?", 2500);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Membina blok dengan pola tambah ${nilaiTambah} sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Limit Animasi Pembinaan
        let limitBina = kaliUlang;
        if(limitBina > 6) limitBina = 6; // Maksimum 6 blok je keluar elak skrin sempit

        let nomborSemasa = nilaiAsas;
        
        // ==========================================
        // FASA 1: ANIMASI BINA BLOK TANGGA
        // ==========================================
        cakap("Tunggu sekejap, sistem tengah bina laluan!", 2000);
        await tunggu(1000);

        for (let i = 1; i <= limitBina; i++) {
            nomborSemasa += nilaiTambah;
            
            // Pengiraan tinggi CSS: Asas = 40px. Tambah ~40px bagi setiap 100 nilai.
            let tinggiTambahan = (nilaiTambah / 100) * 40; 
            let tinggiAsasBlokSebelumnya = 40 + ((i - 1) * tinggiTambahan);
            let tinggiBaru = tinggiAsasBlokSebelumnya + tinggiTambahan;

            let blok = document.createElement("div");
            blok.className = "blok-batu blok-baru";
            blok.style.height = `${tinggiBaru}px`;
            blok.innerHTML = nomborSemasa;
            
            zonTangga.appendChild(blok);
            
            setTimeout(() => {
                blok.classList.add("bina-naik");
                mainBunyi(sfxBetul); 
            }, 50);

            teksAnimasi.innerHTML = `Status: Membina pola tangga ke-${i} (Nilai: ${nomborSemasa})`;
            await tunggu(400);
        }

        await tunggu(1000);

        // ==========================================
        // FASA 2: ANIMASI DINOSAUR MELOMPAT
        // ==========================================
        cakap("Aum! Daging! Aku datang!", 1500);
        
        let tinggiDinoCSS = 0;
        let lariTepiCSS = 0;

        for (let i = 1; i <= limitBina; i++) {
            // Setiap lompatan, dino naik y dan gerak x
            let lompatY = (nilaiTambah / 100) * 40; 
            let lompatX = 60; // Tepi 60px (lebar blok)
            
            tinggiDinoCSS -= lompatY; 
            lariTepiCSS += lompatX;

            dino.style.transform = `translate(${lariTepiCSS}px, ${tinggiDinoCSS}px)`;
            mainBunyi(sfxBetul); // Bunyi lompat
            
            await tunggu(500);
        }

        // ==========================================
        // KEPUTUSAN EKSPERIMEN POLA
        // ==========================================
        let jumlahKeseluruhan = nilaiAsas + (kaliUlang * nilaiTambah);

        if (jumlahKeseluruhan === nilaiSasaran && kaliUlang === 4 && nilaiTambah === 100) {
            // TEPAT! (ulang 4 kali tambah 100 -> 500)
            adakahTamat = true;
            
            // LOMPATAN AKHIR KE ATAS TEBING (Sebab tebing dah rapat)
            cakap("Sikit lagi... HAP!", 1000);
            lariTepiCSS += 60; // Gerak ke depan masuk tebing (ketinggian kekal sama 500)
            dino.style.transform = `translate(${lariTepiCSS}px, ${tinggiDinoCSS}px)`;
            mainBunyi(sfxBetul);
            
            await tunggu(400); // Tunggu mendarat atas tebing

            // Ngap daging!
            document.getElementById("daging-sasaran").style.display = "none";
            document.getElementById("ikonDino").innerHTML = "🦖🍖";
            awanDialog.classList.add("dialog-kiri"); // Pusing dialog sebab dah tepi skrin
            
            maklumBalas.innerHTML = "Berjaya: Pola menaik Matematik dibina dengan sempurna!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Dinosaur mencapai puncak di titik 500!`;
            
            mainBunyi(sfxMenang);
            cakap("Nyam nyam! Berbaloi aku panjat!", 3000);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } 
        else if (jumlahKeseluruhan > nilaiSasaran) {
            // TERLAJAK TINGGI ATAU LEBIH LOOP
            adakahTamat = true;
            
            // Set property untuk CSS keyframes jatuh tergolek
            dino.style.setProperty('--x-akhir', `${lariTepiCSS}px`);
            dino.style.setProperty('--y-akhir', `${tinggiDinoCSS}px`);
            dino.classList.add("jatuh-tergolek");
            
            maklumBalas.innerHTML = `Gagal: Nilai akhir tangga adalah ${jumlahKeseluruhan}. Tebing hanya setinggi 500!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Tangga terlalu tinggi! Dinosaur hilang keseimbangan dan jatuh!";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🤕☄️";
                document.getElementById("tajuk-kalah").innerHTML = "Terlajak Pola!";
                document.getElementById("pesan-kalah").innerHTML = `Arahan anda mencipta pola sehingga ke nombor <strong>${jumlahKeseluruhan}</strong>. Dinosaur terlajak dari tebing yang berada pada paras 500 lalu jatuh tergolek. Semak semula bilangan *Loop* dan *Nilai* anda!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        else {
            // TAK SAMPAI (Cth: ulang 2 kali, atau pola tambah 50)
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Nilai akhir tangga cuma mencapai ${jumlahKeseluruhan}.`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Tangga terlalu rendah. Dinosaur tidak dapat menggapai daging.";
            mainBunyi(sfxSalah);
            cakap("Aduhh... tinggi lagi ni. Tak sampai!", 3000);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🦖❓";
                document.getElementById("tajuk-kalah").innerHTML = "Belum Sampai!";
                document.getElementById("pesan-kalah").innerHTML = `Tangga terakhir anda berhenti pada nombor <strong>${jumlahKeseluruhan}</strong>. Daging tersebut terletak pada paras 500. Pastikan pengulangan anda cukup dan polanya ditambah dengan tepat!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){nombor.tambah(pola)}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogDino");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}