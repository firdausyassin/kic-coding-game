let fasaTumbesaran = 1; // 1: Bayi, 2: Kanak, 3: Dewasa
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

async function laksanaArahanTahap1j() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Karakter sudah dewasa. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx yang memeriksa format: subjek.kataKerja("objek") atau subjek.kataKerja('objek')
    let padananSintaks = input.match(/^([a-z]+)\.([a-z]+)\((["'])([a-z]+)\3\)$/);

    if (padananSintaks) {
        let subjek = padananSintaks[1];
        let kataKerja = padananSintaks[2];
        let itemTeks = padananSintaks[4]; // Nilai dalam ""

        let subjekKini = fasaTumbesaran === 1 ? "bayi" : (fasaTumbesaran === 2 ? "kanak" : "dewasa");

        // VALIDASI 1: Subjek Salah (Contoh: panggil kanak masa masih bayi)
        if (subjek !== subjekKini) {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#ff5e57";
            if (subjek === "dewasa" || subjek === "kanak") {
                maklumBalas.innerHTML = `Ralat Logik: Karakter sekarang masih ${subjekKini}. Belum jadi ${subjek}!`;
            } else {
                maklumBalas.innerHTML = `Ralat Sistem: Karakter "${subjek}" tidak wujud pada fasa ini.`;
            }
            return;
        }

        // VALIDASI 2: Item wujud di atas meja?
        let senaraiSah = ["susu", "nasi", "kopi"];
        if (!senaraiSah.includes(itemTeks)) {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#ff5e57";
            maklumBalas.innerHTML = `Ralat Item: Komputer tidak menemui item "${itemTeks}" di atas meja!`;
            return;
        }

        // KES 1: JAWAPAN FASA 1 (BAYI)
        if (fasaTumbesaran === 1) {
            if (kataKerja === "minum" && itemTeks === "susu") {
                await prosesTumbesaran(subjek, kataKerja, itemTeks, "kanak", "👦", "Kanak-kanak sihat!", sfxBetul);
            } else if (itemTeks !== "susu") {
                paparRalatKalah("🍼❌", "Ralat Kesihatan!", "Bayi belum ada gigi untuk mengunyah makanan lain. Bayi hanya perlukan susu pada fasa ini!");
            } else if (kataKerja === "makan") {
                paparRalatBiasa(sfxSalah, `Ralat Sintaks: Susu itu untuk "minum", bukan untuk "makan"!`);
            }
        }
        // KES 2: JAWAPAN FASA 2 (KANAK)
        else if (fasaTumbesaran === 2) {
            if (kataKerja === "makan" && itemTeks === "nasi") {
                await prosesTumbesaran(subjek, kataKerja, itemTeks, "dewasa", "👨‍💼", "Dewasa yang bertanggungjawab!", sfxBetul);
            } else if (itemTeks === "kopi") {
                paparRalatKalah("☕❌", "Ralat Kesihatan!", "Kanak-kanak tidak digalakkan minum kopi kerana mengandungi kafein. Berikan makanan ruji untuk membesar.");
            } else if (itemTeks === "susu") {
                paparRalatBiasa(sfxSalah, `Ralat: Susu tadi telah pun habis diminum semasa bayi!`);
            } else if (kataKerja === "minum") {
                paparRalatBiasa(sfxSalah, `Ralat Sintaks: Nasi itu untuk "makan", bukan untuk "minum"!`);
            }
        }
        // KES 3: JAWAPAN FASA 3 (DEWASA)
        else if (fasaTumbesaran === 3) {
            if (kataKerja === "minum" && itemTeks === "kopi") {
                await prosesTumbesaranAkhir(subjek, itemTeks, sfxBetul, sfxMenang);
            } else if (kataKerja === "makan") {
                paparRalatBiasa(sfxSalah, `Ralat Sintaks: Kopi itu untuk "minum", bukan untuk "makan"!`);
            } else {
                paparRalatBiasa(sfxSalah, `Ralat: Item ${itemTeks} telah pun habis dimakan sebelum ini.`);
            }
        }

    } 
    // JIKA SALAH SYNTAX TERUK / TIADA QUOTES
    else {
        let cekTanpaQuotes = input.match(/^([a-z]+)\.([a-z]+)\(([a-z]+)\)$/);
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        
        if (cekTanpaQuotes) {
            maklumBalas.innerHTML = "Ralat Teks: Parameter barang mestilah berbentuk String! (Kurung dengan tanda petik <code>\" \"</code>)";
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>subjek.kataKerja(\"barang\")</code>.";
        }
    }

    document.getElementById("arahanInput").value = "";
}

// ==========================================
// FUNGSI ANIMASI & PAPARAN
// ==========================================

async function prosesTumbesaran(subjek, kataKerja, itemTeks, fasaSeterusnya, ikonBaru, mesejStatus, sfxBetul) {
    adakahSibuk = true;
    mainBunyi(sfxBetul);
    
    let maklumBalas = document.getElementById("maklumBalas");
    let elemenKarakter = document.getElementById("karakter-manusia");
    let ikonKarakter = document.getElementById("ikon-manusia");
    let labelKarakter = document.getElementById("label-manusia");
    let elemenItem = document.getElementById(itemTeks);
    
    maklumBalas.innerHTML = `Berjaya: ${subjek} sedang ${kataKerja} ${itemTeks}...`;
    maklumBalas.style.borderLeftColor = "#0be881";
    cakap("Nyam nyam! Sedap!", 2000);

    // Animasi item terbang ke mulut karakter
    elemenItem.style.zIndex = "20";
    elemenItem.style.bottom = "150px"; 
    elemenItem.style.left = "30%";
    elemenItem.style.transform = "scale(0.7) rotate(-20deg)";
    
    await tunggu(800);
    
    // Item Ghaib
    elemenItem.style.opacity = "0";
    elemenItem.style.transform = "scale(0)";
    
    // Karakter Lompat sikit
    elemenKarakter.style.bottom = "140px";
    await tunggu(300);
    elemenKarakter.style.bottom = "110px";

    // EFEK POOF TUKAR FASA
    let poof = document.getElementById("efek-poof");
    poof.classList.add("meletup");
    
    await tunggu(150); // Pertengahan letupan asap, tukar ikon
    ikonKarakter.innerHTML = ikonBaru;
    labelKarakter.innerHTML = fasaSeterusnya;
    
    // Besarkan sikit saiz karakter
    if (fasaSeterusnya === "kanak") {
        ikonKarakter.style.transform = "scale(1.3)";
    } else {
        ikonKarakter.style.transform = "scale(1.6)";
        elemenKarakter.style.bottom = "125px"; // Naikkan sikit base dia bila tinggi
    }

    await tunggu(150);
    poof.classList.remove("meletup");

    document.getElementById("teksAnimasi").innerHTML = `Status: ${mesejStatus}`;
    fasaTumbesaran++;
    adakahSibuk = false;
    maklumBalas.innerHTML = `Evolusi berjaya! Masukkan arahan fasa seterusnya.`;
}

async function prosesTumbesaranAkhir(subjek, itemTeks, sfxBetul, sfxMenang) {
    adakahSibuk = true;
    mainBunyi(sfxBetul);
    
    let maklumBalas = document.getElementById("maklumBalas");
    let elemenItem = document.getElementById(itemTeks);
    
    maklumBalas.innerHTML = `Berjaya: ${subjek} menikmati ${itemTeks}...`;
    maklumBalas.style.borderLeftColor = "#0be881";
    cakap("Fuh! Segar nak mula kerja!", 2500);

    // Animasi Kopi
    elemenItem.style.zIndex = "20";
    elemenItem.style.bottom = "180px"; 
    elemenItem.style.left = "32%";
    elemenItem.style.transform = "scale(0.8) rotate(-15deg)";
    
    await tunggu(800);
    elemenItem.style.opacity = "0";
    elemenItem.style.transform = "scale(0)";
    
    adakahTamat = true;
    document.getElementById("teksAnimasi").innerHTML = "Status: Semua kitaran tumbesaran manusia selesai!";
    maklumBalas.innerHTML = "Tamat: Sektor 1 kini dihabiskan sepenuhnya!";
    
    await tunggu(1000);
    mainBunyi(sfxMenang);
    
    setTimeout(() => {
        document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
    }, 1500);
}

function paparRalatBiasa(sfx, mesej) {
    mainBunyi(sfx);
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.style.borderLeftColor = "#ff5e57";
    maklumBalas.innerHTML = mesej;
}

function paparRalatKalah(ikon, tajuk, mesej) {
    mainBunyi(document.getElementById("bunyiSalah"));
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";
    document.getElementById("maklumBalas").innerHTML = `Gagal: ${tajuk}`;
    
    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = ikon;
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 800);
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogManusia");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
        }, masa);
    }
}