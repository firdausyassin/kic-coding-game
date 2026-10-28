let adakahTamat = false;
let adakahSibuk = false;
const sasaranSuku = 4;

// AKU DAH TAMBAH "mulaMasa" KAT SINI UNTUK SKIP BUNYI KOSONG
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

async function laksanaArahanTahap2j() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut dan buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");
    let sfxPotong = document.getElementById("bunyiPotong"); 

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Piza telah dipotong. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap: Kalau letak quotes ("4")
    let cekAdaQuotes = input.match(/^pizza\.potong\((["'])\d+\1\)$/);
    if (cekAdaQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Parameter Angka (Integer) tidak memerlukan tanda petik <code>" "</code>!`);
        return;
    }

    // RegEx Tangkap: Kalau taip ejaan huruf (contoh: pizza.potong(empat))
    let cekTeksHuruf = input.match(/^pizza\.potong\(([a-z]+)\)$/);
    if (cekTeksHuruf) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Sistem ini memerlukan bacaan <strong>Nombor Bulat (1, 2, 3...)</strong>, bukannya perkataan ejaan!`);
        return;
    }

    // REGEX TEPAT: pizza.potong(angka)
    let padananTepat = input.match(/^pizza\.potong\((\d+)\)$/);

    if (padananTepat) {
        let jumlahPotong = parseInt(padananTepat[1]); // Cth: 2 atau 4

        adakahSibuk = true;
        let pisau = document.getElementById("pisau-potong");
        let gV = document.getElementById("garis-v");
        let gH = document.getElementById("garis-h");
        let gD1 = document.getElementById("garis-d1");
        let gD2 = document.getElementById("garis-d2");

        maklumBalas.innerHTML = `Mengaktifkan pisau untuk memotong kepada ${jumlahPotong} kepingan...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Memotong piza...";

        // =====================================
        // FUNGSI ANIMASI PISAU MELIBAS SEKALI
        // =====================================
        const libasMenegak = async () => {
            pisau.style.opacity = "1";
            pisau.classList.add("libas-menegak");
            
            // CONTOH: Skip 0.3 saat pertama audio. Kalau masih lambat, tukar 0.3 jadi 0.5 atau 1.0!
            mainBunyi(sfxPotong, 0.3); 
            
            await tunggu(200); // Pertengahan libasan (pisau sentuh piza)
            gV.classList.add("tunjuk-garis");
            await tunggu(200); // Habis libas
            pisau.classList.remove("libas-menegak");
        }

        const libasMelintang = async () => {
            pisau.style.opacity = "1";
            pisau.classList.add("libas-melintang");
            
            // CONTOH: Skip 0.3 saat pertama audio. Kalau masih lambat, tukar 0.3 jadi 0.5 atau 1.0!
            mainBunyi(sfxPotong, 0.3); 
            
            await tunggu(200);
            gH.classList.add("tunjuk-garis");
            await tunggu(200);
            pisau.classList.remove("libas-melintang");
        }

        // KES 1: JAWAPAN TEPAT (SUKU = 4 POTONGAN)
        if (jumlahPotong === sasaranSuku) {
            
            // Libas 1 (Menegak)
            await libasMenegak();
            await tunggu(200);
            
            // Libas 2 (Melintang)
            await libasMelintang();
            
            // Set Timer 600ms untuk matikan sfxPotong supaya 25 saat tak meleret
            setTimeout(() => { sfxPotong.pause(); sfxPotong.currentTime = 0; }, 600);
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Terbentuklah 4 kepingan suku (1/4)!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Konsep pecahan suku disahkan secara visual!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            // Papar modal kemenagan penamat Tahap 2!
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // KES 2: SETENGAH (2 POTONGAN)
        else if (jumlahPotong === 2) {
            
            await libasMenegak();
            
            setTimeout(() => { sfxPotong.pause(); sfxPotong.currentTime = 0; }, 600);
            
            paparRalatKalah("Ini Saiz Setengah!", `Memotong kepada ${jumlahPotong} bahagian akan menghasilkan saiz SETENGAH (1/2). Pelanggan perlukan saiz SUKU (1/4).`);
        }
        // KES 3: LAPAN POTONGAN (OVERKILL)
        else if (jumlahPotong === 8) {
            
            await libasMenegak(); await tunggu(100);
            await libasMelintang(); await tunggu(100);
            
            mainBunyi(sfxPotong, 0.3); // Letak masa skip juga
            gD1.classList.add("tunjuk-garis");
            gD2.classList.add("tunjuk-garis");
            
            setTimeout(() => { sfxPotong.pause(); sfxPotong.currentTime = 0; }, 600);
            
            paparRalatKalah("Terlalu Kecil!", `Memotong kepada ${jumlahPotong} kepingan akan menjadikannya terlalu hancur (1/8). Kita perlukan potongan yang membina saiz Suku.`);
        }
        // KES 4: NOMBOR MERAPU (Cth: 3, 5, 10)
        else {
            mainBunyi(document.getElementById("bunyiSalah"));
            paparRalatKalah("Mustahil Dipotong!", `Pisau tidak dapat membahagikan piza secara seragam kepada ${jumlahPotong} kepingan untuk membentuk susunan silang. Guna 2, 4, atau 8.`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>pizza.potong(angka)</code>.");
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
    mainBunyi(document.getElementById("bunyiSalah")); // AKU DAH MASUKKAN BALIK BUNYI GAGAL KAT SINI!
    
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";
    document.getElementById("teksAnimasi").innerHTML = "Status: Kegagalan ukuran pecahan.";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "✂️❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1200);
    
    adakahSibuk = false;
    adakahTamat = true;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }