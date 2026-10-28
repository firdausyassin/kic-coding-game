let adakahTamat = false;
let adakahSibuk = false;

// TETAPAN SAINS
const haiwanSasaran = "karnivor";
const makananTepat = "daging";

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

async function laksanaArahanTahap3g() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Haiwan telah diberi makan. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // KETEGASAN SINTAKS 1: Masukkan nombor
    let cekAdaNombor = input.match(/\d/);
    if (cekAdaNombor) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Pengecaman diet haiwan menggunakan huruf abjad (Teks), bukannya angka (Nombor)!`);
        return;
    }

    // KETEGASAN SINTAKS 2: Tertinggal tanda petik
    let cekTinggalQuotes = input.match(/^zoo\.beri\(([a-z]+),([a-z]+)\)$/);
    if (cekTinggalQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Pembolehubah: <code>${cekTinggalQuotes[1]}</code> dan <code>${cekTinggalQuotes[2]}</code> dikesan sebagai entiti tanpa nilai. Gunakan tanda petik <code>" "</code> untuk parameter teks!`);
        return;
    }

    // REGEX TEPAT: zoo.beri("teks1", "teks2")
    let padananTepat = input.match(/^zoo\.beri\((["'])([a-z]+)\1,(["'])([a-z]+)\3\)$/);

    if (padananTepat) {
        let inputKelas = padananTepat[2]; // karnivor
        let inputMakanan = padananTepat[4]; // daging

        adakahSibuk = true;
        let pintuMesin = document.getElementById("pintu-mesin");
        let objekMakanan = document.getElementById("objek-makanan");
        let singa = document.getElementById("haiwan-sasaran");
        let reaksi = document.getElementById("reaksi-haiwan");

        // Tukar visual makanan berdasarkan input budak
        if (inputMakanan === "sayur" || inputMakanan === "daun") {
            objekMakanan.innerHTML = "🥬";
        } else if (inputMakanan === "buah" || inputMakanan === "epal") {
            objekMakanan.innerHTML = "🍎";
        } else if (inputMakanan === "daging" || inputMakanan === "ayam") {
            objekMakanan.innerHTML = "🍖";
        } else {
            paparRalatPantas(sfxSalah, `Ralat Sistem: Makanan jenis "${inputMakanan}" tiada dalam stor logistik zoo.`);
            adakahSibuk = false; return;
        }

        maklumBalas.innerHTML = `Sistem melepaskan ${inputMakanan} dari dispenser...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Memproses pemberian makanan...";

        // ==========================================
        // ANIMASI DISPENSER JATUHKAN MAKANAN
        // ==========================================
        mainBunyi(sfxBetul);
        pintuMesin.classList.add("buka-pintu");
        await tunggu(400);
        
        objekMakanan.style.opacity = "1";
        objekMakanan.style.top = "180px"; // Makanan jatuh depan singa
        await tunggu(1000);
        pintuMesin.classList.remove("buka-pintu");

        // ==========================================
        // LOGIK SAINS (DIET HAIWAN)
        // ==========================================
        
        // KES 1: TEPAT (Karnivor + Daging)
        if (inputKelas === "karnivor" && (inputMakanan === "daging" || inputMakanan === "ayam")) {
            
            mainBunyi(sfxBetul);
            objekMakanan.style.opacity = "0"; // Singa ngap makanan
            singa.classList.add("haiwan-makan");
            
            await tunggu(500);
            reaksi.innerHTML = "❤️";
            reaksi.classList.add("tunjuk-reaksi");
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Haiwan kenyang!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Padanan pengelasan haiwan disahkan!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // KES 2: SALAH KELAS TAPI MAKANAN BETUL (Cth: Herbivor, Daging)
        else if (inputKelas !== "karnivor" && inputMakanan === "daging") {
            
            singa.classList.add("haiwan-marah");
            reaksi.innerHTML = "❓";
            reaksi.classList.add("tunjuk-reaksi");
            
            paparRalatKalah("Kelas Salah!", `Anda memanggil kelas "${inputKelas}", sedangkan haiwan ini berkelas KARNIVOR. Makanan betul, tetapi prosedur pengelasan gagal!`);
        }
        // KES 3: KELAS BETUL TAPI MAKANAN SALAH (Cth: Karnivor, Sayur)
        else if (inputKelas === "karnivor" && inputMakanan !== "daging") {
            
            singa.classList.add("haiwan-marah");
            reaksi.innerHTML = "😠";
            reaksi.classList.add("tunjuk-reaksi");
            
            document.getElementById("ikon-kalah").innerHTML = "🥬❌";
            paparRalatKalah("Diet Ditolak!", `Singa adalah Karnivor. Memberikan "${inputMakanan}" boleh memudaratkan kesihatannya. Ia perlukan daging!`);
        }
        // KES 4: SALAH DUA-DUA (Cth: Herbivor, Sayur)
        else {
            singa.classList.add("haiwan-marah");
            reaksi.innerHTML = "🙅‍♂️";
            reaksi.classList.add("tunjuk-reaksi");
            
            document.getElementById("ikon-kalah").innerHTML = "❌";
            paparRalatKalah("Pengelasan Gagal!", `Anda memasukkan kelas "${inputKelas}" dan makanan "${inputMakanan}". Singa ini adalah pemakan daging (Karnivor).`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>zoo.beri(\"kelas\", \"makanan\")</code>.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Pemberian makanan tergendala.";

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