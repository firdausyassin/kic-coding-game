let fasaEksperimen = 1; // 1: Perlukan Air, 2: Perlukan Suhu
let adakahTamat = false;
let adakahSibuk = false;

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

async function laksanaArahanTahap2e() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Pokok telah membesar sepenuhnya. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Pemeriksaan Khas (Anti-Ralat Budak)
    let cekTeksTanpaPetik = input.match(/^benih\.tambah\(([a-z]+),\d+\)$/);
    if (cekTeksTanpaPetik) {
        paparRalatPantas(sfxSalah, `Ralat Teks: Parameter pertama (${cekTeksTanpaPetik[1]}) mestilah berjenis String. Sila letak tanda petik <code>" "</code>!`);
        return;
    }

    let cekAngkaAdaPetik = input.match(/^benih\.tambah\((["'])[a-z]+\1,(["'])\d+\3\)$/);
    if (cekAngkaAdaPetik) {
        paparRalatPantas(sfxSalah, `Ralat Angka: Parameter kedua (Nombor) tidak perlukan tanda petik! Sila taip angka sahaja.`);
        return;
    }

    // RegEx Tepat: benih.tambah("teks", angka)
    let padananTepat = input.match(/^benih\.tambah\((["'])([a-z]+)\1,(\d+)\)$/);

    if (padananTepat) {
        let keperluan = padananTepat[2]; // air / suhu
        let nilaiAngka = parseInt(padananTepat[3]); // 5 / 30

        adakahSibuk = true;

        // FASA 1: AIR
        if (fasaEksperimen === 1) {
            if (keperluan === "air" && nilaiAngka === 5) {
                await prosesSiramAir(sfxBetul);
            } else if (keperluan === "suhu") {
                prosesKalah("Suhu Kering!", "Benih perlukan air terlebih dahulu sebelum suhu dipanaskan. Tanah terlalu kering!");
            } else if (keperluan === "air" && nilaiAngka !== 5) {
                prosesKalah("Sukatan Ralat!", `Benih memerlukan tepat 5 unit air. Anda berikan ${nilaiAngka} unit.`);
            } else {
                paparRalatPantas(sfxSalah, `Ralat: Keperluan "${keperluan}" tidak dikenalpasti oleh sistem makmal.`);
                adakahSibuk = false;
            }
        }
        // FASA 2: SUHU
        else if (fasaEksperimen === 2) {
            if (keperluan === "suhu" && nilaiAngka === 30) {
                await prosesCahayaMatahari(sfxBetul, sfxMenang);
            } else if (keperluan === "air") {
                paparRalatPantas(sfxSalah, "Benih sudah mendapat air yang cukup! Sila selaraskan suhu (30 darjah) pula.");
                adakahSibuk = false;
            } else if (keperluan === "suhu" && nilaiAngka !== 30) {
                prosesKalah("Suhu Melampau!", `Suhu ${nilaiAngka}°C tidak sesuai untuk percambahan benih. Suhu bilik yang sesuai ialah 30°C.`);
            } else {
                paparRalatPantas(sfxSalah, `Ralat: Keperluan "${keperluan}" tidak dikenalpasti.`);
                adakahSibuk = false;
            }
        }
    } 
    // JIKA FORMAT SALAH TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>benih.tambah(\"keperluan\", angka)</code> dengan koma di tengah.");
    }

    document.getElementById("arahanInput").value = "";
}

// ==========================================
// FUNGSI ANIMASI & PAPARAN
// ==========================================

async function prosesSiramAir(sfxBetul) {
    mainBunyi(sfxBetul);
    document.getElementById("maklumBalas").style.borderLeftColor = "#0be881";
    document.getElementById("maklumBalas").innerHTML = "Berjaya: Mengaktifkan pam air...";
    document.getElementById("teksAnimasi").innerHTML = "Status: Menyiram benih...";
    document.getElementById("nilai-air").innerHTML = "5";

    let penyiram = document.getElementById("penyiram");
    let titisan = document.getElementById("titisan-air");
    let tanaman = document.getElementById("tanaman");

    // Penyiram masuk
    penyiram.style.top = "15%";
    penyiram.style.left = "43%";
    penyiram.style.opacity = "1";
    await tunggu(800);
    
    // Penyiram condong & Titisan air keluar
    penyiram.style.transform = "rotate(-30deg)";
    await tunggu(300);
    
    // Animasi titis air (loop 3 kali)
    for(let i=0; i<3; i++) {
        titisan.style.opacity = "1";
        titisan.style.bottom = "180px";
        await tunggu(200);
        titisan.style.opacity = "0";
        titisan.style.bottom = "250px";
        await tunggu(200);
    }
    
    // Penyiram balik
    penyiram.style.transform = "rotate(0deg)";
    await tunggu(400);
    penyiram.style.opacity = "0";
    penyiram.style.top = "-100px";

    // Benih pecah pucuk
    mainBunyi(sfxBetul);
    tanaman.innerHTML = "🌱";
    tanaman.style.fontSize = "70px";
    tanaman.style.bottom = "175px"; // Timbul sikit dari pasu

    fasaEksperimen = 2;
    document.getElementById("maklumBalas").innerHTML = "Fasa 2: Hebat! Sekarang tetapkan suhu bilik kepada 30 darjah.";
    document.getElementById("teksAnimasi").innerHTML = "Status: Benih bercambah pucuk. Memerlukan suhu...";
    adakahSibuk = false;
}

async function prosesCahayaMatahari(sfxBetul, sfxMenang) {
    mainBunyi(sfxBetul);
    document.getElementById("maklumBalas").style.borderLeftColor = "#0be881";
    document.getElementById("maklumBalas").innerHTML = "Berjaya: Menyelaraskan haba...";
    document.getElementById("teksAnimasi").innerHTML = "Status: Suhu dinaikkan ke 30°C.";
    document.getElementById("nilai-suhu").innerHTML = "30";

    let matahari = document.getElementById("matahari");
    let tanaman = document.getElementById("tanaman");

    // Matahari terbit
    matahari.classList.add("matahari-terbit");
    await tunggu(1500);

    // Benih jadi pokok kecil
    tanaman.innerHTML = "🪴";
    tanaman.style.fontSize = "110px";
    tanaman.style.bottom = "180px";
    
    adakahTamat = true;
    document.getElementById("teksAnimasi").innerHTML = "Status: Pokok sihat dan mekar!";
    document.getElementById("maklumBalas").innerHTML = "Sempurna: Kitaran fotosintesis bermula!";
    
    await tunggu(1000);
    mainBunyi(sfxMenang);
    
    setTimeout(() => {
        document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
    }, 1500);
}

function paparRalatPantas(sfx, mesej) {
    mainBunyi(sfx);
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.style.borderLeftColor = "#ff5e57";
    maklumBalas.innerHTML = mesej;
}

function prosesKalah(tajuk, mesej) {
    mainBunyi(document.getElementById("bunyiSalah"));
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";
    document.getElementById("teksAnimasi").innerHTML = "Status: Eksperimen gagal.";
    
    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🥀❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 800);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }