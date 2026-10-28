let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    await tunggu(800); 
    cakapSistem("AMARAN: Anda memasuki kawasan larangan. Pengimbas bio metrik mendapati status anda adalah 'Penceroboh'. Hancurkan!", 5000);
}

async function laksanaArahanTahap8c() {
    let inputKotor = document.getElementById("arahanInput").value;
    // Bersihkan spasi untuk pencarian Regex yang mudah, TAPI convert ke lowerCase dulu untuk selamat
    let input = inputKotor.toLowerCase().replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let ejen = document.getElementById("ejen-robot");
    let paparanID = document.getElementById("id-paparan");
    let jaringLaser = document.getElementById("jaring-laser");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // 🔥 REGEX: Semak adakah budak overwrite status kepada pekerja, dan hantar ke sistem.imbas 🔥
    // Membaca: status="pekerja" TAPI terima juga single quotes ('pekerja')
    let cekOverwrite = input.match(/status=["']pekerja["']/);
    
    // Semak kalau dia cuba hack tapi typo ejaan pekerja atau tak letak pengikat kata (" ")
    let cekTanpaQuotes = input.match(/status=pekerja/);
    
    // Membaca panggilan fungsi: sistem.imbas(status)
    let cekImbas = input.match(/sistem\.imbas\(status\)/);

    if (cekOverwrite && cekImbas) {
        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        // 1. KEMASKINI UI MAKLUM BALAS
        maklumBalas.innerHTML = "Penggodaman Memori Berjaya: Data status 'penceroboh' telah diganti dengan 'pekerja'.";
        maklumBalas.style.color = "#2ecc71";
        maklumBalas.style.borderLeftColor = "#2ecc71";
        
        teksAnimasi.innerHTML = "Status: Menghantar data palsu kepada Pengimbas Utama...";
        teksAnimasi.style.background = "rgba(0,0,0,0.8)";
        teksAnimasi.style.color = "#00f3ff";
        teksAnimasi.style.border = "2px solid #00f3ff";
        
        // 2. KEMASKINI ID PAPARAN ROBOT
        cakapSistem("Berjaya menimpa memori asal! Menghantar ID Pekerja kepada sistem keselamatan.", 3000);
        await tunggu(1000);
        
        paparanID.innerHTML = "PEKERJA";
        paparanID.classList.add("id-lulus"); // Tukar hijau
        
        await tunggu(1500);

        // 3. PENGIMBAS TERIMA DATA DAN PADAM LASER
        teksAnimasi.innerHTML = "Pengimbas Utama: ID Pekerja Disahkan. Akses Dibenarkan.";
        teksAnimasi.style.color = "#2ecc71";
        teksAnimasi.style.borderColor = "#2ecc71";
        
        jaringLaser.classList.add("laser-selamat"); // Laser hijau/hilang
        mainBunyi(sfxBetul);
        cakapSistem("Pintu dibuka. Silakan masuk, tuan.", 3000);

        await tunggu(1000);

        // 4. ROBOT LALU
        ejen.classList.add("melepasi-pintu");
        
        await tunggu(2500);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        document.getElementById("modalKemenangan").className = "modal-tunjuk";

    } 
    // JIKA DIA LUPA QUOTATION MARKS (Tanda petik " ")
    else if (cekTanpaQuotes) {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Teks (String): Nilai 'pekerja' adalah teks. Anda WAJIB meletakkannya di dalam tanda petik (<code>\"pekerja\"</code>)!";
        cakapSistem("Ralat sintaks penggodaman. Teks mesti dikelilingi oleh tanda petik (quotes)!", 3500);
    }
    // JIKA GAGAL SEPENUHNYA
    else {
        adakahSibuk = true;
        mainBunyi(sfxSalah);
        
        maklumBalas.innerHTML = "Penggodaman Gagal: Anda masih memegang ID 'Penceroboh'.";
        
        // Laser bunuh robot
        cakapSistem("PENCEROBOH DIKESAN! MELANCARKAN PROTOKOL PEMBUNUHAN!", 3500);
        jaringLaser.classList.add("laser-maut"); // Laser jadi merah tebal
        
        await tunggu(800);
        
        ejen.innerHTML = "💥"; // Meletup
        paparanID.style.display = "none";
        ejen.classList.add("rentung");
        
        teksAnimasi.innerHTML = "Sistem Keselamatan: Subjek berjaya dihapuskan.";
        
        await tunggu(1000);
        adakahSibuk = false;
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogSistem");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}