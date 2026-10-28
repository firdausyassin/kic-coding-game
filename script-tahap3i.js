let adakahTamat = false;
let adakahSibuk = false;

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

// Fungsi pembantu untuk memaparkan warna
function getHexWarna(namaWarna) {
    if (namaWarna === "merah") return "rgba(231, 76, 60, 0.9)";
    if (namaWarna === "biru") return "rgba(52, 152, 219, 0.9)";
    if (namaWarna === "kuning") return "rgba(241, 196, 15, 0.9)";
    return "rgba(189, 195, 199, 0.9)"; // Warna kelabu kalau salah eja
}

async function laksanaArahanTahap3i() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Kelalang telah digunakan. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap: Kalau letak tanpa tanda petik
    let cekTinggalQuotes = input.match(/^bikar\.campur\(([a-z]+),([a-z]+)\)$/);
    if (cekTinggalQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Pembolehubah: Parameter dikesan sebagai entiti tanpa nilai. Gunakan tanda petik <code>" "</code> untuk menyatakan nama warna!`);
        return;
    }

    // RegEx Tangkap: Kalau letak angka
    let cekAdaNombor = input.match(/\d/);
    if (cekAdaNombor) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Pengecaman warna menggunakan huruf abjad (Teks), bukannya angka (Nombor)!`);
        return;
    }

    // REGEX TEPAT: bikar.campur("teks1", "teks2")
    let padananTepat = input.match(/^bikar\.campur\((["'])([a-z]+)\1,(["'])([a-z]+)\3\)$/);

    if (padananTepat) {
        let warna1 = padananTepat[2];
        let warna2 = padananTepat[4];

        // Semak sama ada warna dimasukkan wujud dalam senarai primer
        let senaraiPrimer = ["merah", "biru", "kuning"];
        if (!senaraiPrimer.includes(warna1) || !senaraiPrimer.includes(warna2)) {
            paparRalatPantas(sfxSalah, `Ralat Bahan: Sila pilih warna primer yang wujud di nota makmal sahaja (merah, biru, kuning).`);
            return;
        }

        adakahSibuk = true;
        let titisanKiri = document.getElementById("titisan-kiri");
        let titisanKanan = document.getElementById("titisan-kanan");
        let airBikar = document.getElementById("air-bikar");

        maklumBalas.innerHTML = `Mengepam cecair ${warna1} dan ${warna2} ke dalam kelalang...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Reaksi kimia bermula...";

        // Set warna titisan berdasarkan input
        titisanKiri.style.background = getHexWarna(warna1);
        titisanKanan.style.background = getHexWarna(warna2);

        // ==========================================
        // ANIMASI TITISAN JATUH
        // ==========================================
        mainBunyi(sfxBetul);
        titisanKiri.classList.add("jatuh-kiri");
        titisanKanan.classList.add("jatuh-kanan");
        
        await tunggu(1200); // Tunggu sampai air jatuh dan hilang dalam bikar

        // ==========================================
        // LOGIK SAINS (CAMPURAN WARNA)
        // ==========================================
        let kombinasi = [warna1, warna2].sort().join("-");
        
        if (kombinasi === "biru-merah") {
            // TEPAT! (Sasaran = UNGU)
            airBikar.style.background = "rgba(155, 89, 182, 0.9)"; // Ungu
            teksAnimasi.innerHTML = "Status: Reaksi berjaya (UNGU).";
            
            adakahTamat = true;
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Warna primer yang betul dipilih!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        else if (kombinasi === "kuning-merah") {
            // SALAH (Oren)
            airBikar.style.background = "rgba(230, 126, 34, 0.9)"; // Oren
            document.getElementById("ikon-kalah").innerHTML = "🟠❌";
            paparRalatKalah("Warna Jingga!", `Campuran ${warna1} dan ${warna2} menghasilkan warna Jingga (Oren), bukan Ungu.`);
        }
        else if (kombinasi === "biru-kuning") {
            // SALAH (Hijau)
            airBikar.style.background = "rgba(46, 204, 113, 0.9)"; // Hijau
            document.getElementById("ikon-kalah").innerHTML = "🟢❌";
            paparRalatKalah("Warna Hijau!", `Campuran ${warna1} dan ${warna2} menghasilkan warna Hijau, bukan Ungu.`);
        }
        else if (warna1 === warna2) {
            // SAMA WARNA
            airBikar.style.background = getHexWarna(warna1); // Warna kekal
            paparRalatKalah("Tiada Reaksi!", `Anda mencampurkan cecair yang sama. Warna tidak akan berubah menjadi sekunder.`);
        }

    } 
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>bikar.campur(\"warna1\", \"warna2\")</code>.");
    }

    document.getElementById("arahanInput").value = "";
}

function paparRalatPantas(sfx, mesej) {
    mainBunyi(sfx);
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.style.borderLeftColor = "#ff5e57";
    maklumBalas.innerHTML = mesej;
}

function paparRalatKalah(tajuk, mesej) {
    mainBunyi(document.getElementById("bunyiSalah")); 
    
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1500);
    
    adakahSibuk = false;
    adakahTamat = true; 
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }