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
    cakapSistem("Casis robot bersedia. Sila isytiharkan pembolehubah 'nama' dan 'umur' untuk memulakan proses but (booting).", 5000);
}

async function laksanaArahanTahap8a() {
    // Kita tak buang semua space kali ni sebab kita nak pastikan nama boleh ada jarak (e.g. "Robot Ali")
    let inputKotor = document.getElementById("arahanInput").value;
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let robot = document.getElementById("robot-utama");
    let hologram = document.getElementById("hologram-id");
    let paparanNama = document.getElementById("paparan-nama");
    let paparanUmur = document.getElementById("paparan-umur");
    let laser = document.getElementById("laser-scan");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // 🔥 REGEX PENGISYTIHARAN PEMBOLEHUBAH PYTHON-STYLE 🔥
    // Membaca: nama = "Teks" (boleh terima ' atau ")
    let regexNama = /nama\s*=\s*["']([^"']+)["']/i;
    // Membaca: umur = nombor
    let regexUmur = /umur\s*=\s*(\d+)/i;

    let padananNama = inputKotor.match(regexNama);
    let padananUmur = inputKotor.match(regexUmur);

    if (padananNama && padananUmur) {
        let namaDiekstrak = padananNama[1]; // Ambil nilai dalam kurungan kata
        let umurDiekstrak = parseInt(padananUmur[1]);

        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Pengkompilan Berjaya: Variabel nama dan umur disahkan!";
        maklumBalas.style.borderLeftColor = "#00ff88";
        
        teksAnimasi.innerHTML = "Status: Mengkompil data memori ke dalam casis robot...";
        
        // 1. ANIMASI LASER SCANNER
        laser.style.animation = "scanKamera 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
        cakapSistem("Mengekstrak data memori... Pengesahan struktur data sedang dijalankan.", 2000);
        
        await tunggu(1500);

        // 2. KEMASKINI DATA HOLOGRAM
        paparanNama.innerHTML = namaDiekstrak.toUpperCase();
        paparanUmur.innerHTML = umurDiekstrak;

        // 3. ROBOT HIDUP DAN HOLOGRAM MUNCUL
        teksAnimasi.innerHTML = "Status: Robot diaktifkan dengan jayanya!";
        mainBunyi(sfxBetul);
        
        robot.classList.add("robot-aktif");
        await tunggu(500);
        hologram.classList.add("tunjuk-hologram");
        
        await tunggu(1000);

        // 4. INTERAKSI DATA DINAMIK DARI PEMBOLEHUBAH
        cakapSistem(`But Sistem Selesai! Hai, nama saya adalah ${namaDiekstrak} dan saya diprogramkan untuk berfungsi selama ${umurDiekstrak} tahun.`, 5000);

        await tunggu(4000);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        document.getElementById("modalKemenangan").className = "modal-tunjuk";

    } else {
        mainBunyi(sfxSalah);
        
        // Diagnostik kerosakan kod yang ditaip oleh budak
        if (!padananNama && padananUmur) {
            maklumBalas.innerHTML = "Ralat: Pembolehubah <code>nama</code> tiada atau tidak lengkap. Pastikan ia diletakkan di dalam pengikat kata (<code>\" \"</code>).";
            cakapSistem("Saya tahu umur saya, tapi saya tak tahu nama saya! Sila semak pembolehubah nama.", 4000);
        } else if (padananNama && !padananUmur) {
            maklumBalas.innerHTML = "Ralat: Pembolehubah <code>umur</code> tiada atau salah format. Gunakan angka sahaja.";
            cakapSistem("Saya tahu nama saya, tapi berapakah umur saya? Sila semak pembolehubah umur.", 4000);
        } else {
            maklumBalas.innerHTML = "Ralat Memori: Kedua-dua pembolehubah <code>nama</code> dan <code>umur</code> tidak dijumpai atau ditaip dengan format yang salah.";
            cakapSistem("Sistem gagal mengesan data memori. Sila rujuk kembali format pengisytiharan pembolehubah.", 4000);
        }
        
        maklumBalas.style.borderLeftColor = "#e74c3c";
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