let adakahTamat = false;
let adakahSibuk = false;
const ukuranTepat = 5;
const unitTepat = "jengkal";

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

async function laksanaArahanTahap2h() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut dan buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");
    let sfxGergaji = document.getElementById("bunyiGergaji");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Kayu telah dipotong. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // KES 1: Budak TERBALIKKAN format (letak teks dulu baru angka macam misi sebelum ni)
    let cekTerbalik = input.match(/^kayu\.potong\((["'])([a-z]+)\1,(\d+)\)$/);
    if (cekTerbalik) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Susunan terbalik! Anda mesti memasukkan Angka dahulu, diikuti dengan Unit Teks.`);
        return;
    }

    // KES 2: Budak terlupa letak quotes pada jengkal
    let cekTanpaQuotesTeks = input.match(/^kayu\.potong\((\d+),([a-z]+)\)$/);
    if (cekTanpaQuotesTeks) {
        paparRalatPantas(sfxSalah, `Ralat Teks: Unit ukuran "${cekTanpaQuotesTeks[2]}" adalah String. Sila letak tanda petik <code>" "</code>!`);
        return;
    }

    // REGEX TEPAT: kayu.potong(angka, "teks")
    let padananTepat = input.match(/^kayu\.potong\((\d+),(["'])([a-z]+)\2\)$/);

    if (padananTepat) {
        let nilaiUkuran = parseInt(padananTepat[1]); // 5
        let jenisUnit = padananTepat[3]; // "jengkal"

        adakahSibuk = true;

        // VALIDASI JAWAPAN
        if (nilaiUkuran === ukuranTepat && jenisUnit === unitTepat) {
            
            mainBunyi(sfxBetul);
            maklumBalas.innerHTML = "Arahan diterima. Memulakan ukuran jengkal...";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Mengukur kayu sebanyak ${nilaiUkuran} ${jenisUnit}...`;

            let tangan = document.getElementById("tangan-jengkal");
            let gergaji = document.getElementById("gergaji");
            let kayuKanan = document.getElementById("kayu-kanan");
            
            tangan.style.opacity = "1";
            let gerakTangan = 15; // Mula dari 15% skrin (kiri kayu)

            // 1. Animasi Mengukur (Loop Jengkal)
            for (let i = 1; i <= ukuranTepat; i++) {
                tangan.style.transform = "scale(0.8)"; // Tangan kuncup
                await tunggu(200);
                
                gerakTangan += 8; // Gerak ke kanan
                tangan.style.left = gerakTangan + "%";
                tangan.style.transform = "scale(1.1)"; // Tangan buka (jengkal)
                mainBunyi(sfxBetul); // Bunyi dap dap (mengukur)
                
                await tunggu(300);
            }

            tangan.style.opacity = "0"; // Hilang pas habis ukur
            await tunggu(300);

            // 2. Animasi Memotong
            teksAnimasi.innerHTML = "Status: Memotong kayu mengikut tandaan...";
            maklumBalas.innerHTML = "Mengaktifkan gergaji pemotong...";
            
            gergaji.style.opacity = "1";
            gergaji.classList.add("gergaji-gerak");
            
            // Mainkan bunyi gergaji SEKALI sahaja
            mainBunyi(sfxGergaji); 
            
            // Biarkan animasi gergaji bergerak selama 1 saat (1000 milisaat) 
            // supaya ngam-ngam habis serentak dengan audio mp3 kau
            await tunggu(1000); 
            
            gergaji.classList.remove("gergaji-gerak");
            gergaji.style.opacity = "0";
            await tunggu(200);
            
            // 3. Kayu Terbelah (kayu belah kanan jatuh)
            mainBunyi(sfxBetul); // Bunyi pap! (kayu jatuh)
            kayuKanan.classList.add("kayu-terpotong");

            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Potongan sempurna!";
            maklumBalas.innerHTML = "Sempurna: Objektif memanipulasi dwi-parameter tercapai!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // SALAH NILAI ANGKA ATAU UNIT
        else if (jenisUnit !== unitTepat) {
            paparRalatKalah("Unit Tidak Sah!", `Sistem bengkel ini menggunakan ukuran tradisional. Ukuran dalam unit "${jenisUnit}" tidak dapat dikesan. Gunakan "jengkal".`);
        } 
        else if (nilaiUkuran !== ukuranTepat) {
            paparRalatKalah("Panjang Melencong!", `Kayu terpotong pada ukuran ${nilaiUkuran} jengkal. Kita memerlukan panjang tepat ${ukuranTepat} jengkal untuk membina kotak!`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>kayu.potong(angka, \"unit\")</code> dengan koma sebagai pemisah.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Kayu rosak akibat salah potong.";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "📏❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1000);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }