let adakahTamat = false;
let adakahSibuk = false;
const hargaAir = 50;

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

async function laksanaArahanTahap2d() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Transaksi telah selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // KES 1: Tangkap kalau letak String (contoh: mesin.masuk("50") atau mesin.masuk('50sen'))
    let padananPetik = input.match(/^mesin\.masuk\((["'])(.*?)\1\)$/);
    if (padananPetik) {
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        maklumBalas.innerHTML = `Ralat Parameter: Anda memasukkan format String (Teks). Sila buang tanda petik <code>" "</code> untuk memasukkan nilai Angka!`;
        return;
    }

    // KES 2: Tangkap kalau campur huruf tanpa petik (contoh: mesin.masuk(50sen))
    let padananCampurHuruf = input.match(/^mesin\.masuk\(([0-9]+[a-z]+|[a-z]+[0-9]+)\)$/);
    if (padananCampurHuruf) {
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        maklumBalas.innerHTML = `Ralat Sintaks: Komputer tidak boleh mengira unit/perkataan (seperti 'sen'). Masukkan nilai ANGKA sahaja!`;
        return;
    }

    // KES 3: RegEx tepat - Tangkap Nombor Sahaja! (contoh: mesin.masuk(50))
    let padananAngkaSahaja = input.match(/^mesin\.masuk\((\d+)\)$/);

    if (padananAngkaSahaja) {
        let nilaiWang = parseInt(padananAngkaSahaja[1]);

        adakahSibuk = true;

        // JAWAPAN BETUL = 50
        if (nilaiWang === hargaAir) {
            mainBunyi(sfxBetul);
            maklumBalas.innerHTML = `Wang syiling ${nilaiWang} sen disahkan. Memproses minuman...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Memasukkan syiling...";

            let syiling = document.getElementById("syiling-emas");
            let skrinHarga = document.getElementById("skrin-harga");
            let airDalamKaca = document.getElementById("air-tin");
            let airDahKeluar = document.getElementById("air-tin-keluar");
            
            // 1. Animasi Syiling Terbang ke Lubang Mesin
            // Disebabkan cermin-kaca ada hidden, kita gerakkan syiling relatif
            syiling.style.bottom = "230px";
            syiling.style.left = "calc(50% + 80px)"; // Lokasi panel kanan
            syiling.style.transform = "scale(0.3) rotate(360deg)"; // Syiling mengecil masuk lubang
            
            await tunggu(600);
            syiling.style.opacity = "0"; // Ghaib masuk mesin
            
            // 2. Skrin Tukar Jadi 00 (Berjaya)
            mainBunyi(sfxBetul); // Bunyi kaching!
            skrinHarga.innerHTML = "00";
            skrinHarga.style.color = "#0be881";
            teksAnimasi.innerHTML = "Status: Transaksi sah. Menjatuhkan air...";
            
            await tunggu(800);
            
            // 3. Air tin jatuh dalam kaca
            airDalamKaca.style.top = "200px"; // Turun melepasi cermin (overflow hidden akan potong)
            
            await tunggu(500); // Masa tin jatuh
            
            // 4. Air tin muncul kat ruang bawah
            airDahKeluar.classList.add("dah-jatuh");
            mainBunyi(sfxBetul); // Bunyi debuk jatuh

            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Minuman sedia untuk diambil!";
            maklumBalas.innerHTML = "Sempurna: Objektif memanipulasi parameter nombor tercapai!";
            
            await tunggu(1200);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // JAWAPAN SALAH (KURANG)
        else if (nilaiWang < hargaAir) {
            prosesSalah(`Duit syiling ${nilaiWang} sen tidak mencukupi! Harga minuman ialah ${hargaAir} sen.`);
        } 
        // JAWAPAN SALAH (LEBIH) - Boleh buat logic baki kalau rajin, tapi misi ni kita ajar bagi tepat
        else if (nilaiWang > hargaAir) {
            prosesSalah(`Syiling ${nilaiWang} sen tidak diterima. Sila masukkan nilai duit syiling yang ngam-ngam 50 sen sahaja!`);
        }

    } 
    // JIKA TULIS MERAPU
    else {
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        maklumBalas.innerHTML = "Ralat Sintaks: Gunakan format <code>mesin.masuk(nombor)</code>.";
    }

    document.getElementById("arahanInput").value = "";
}

async function prosesSalah(mesej) {
    mainBunyi(document.getElementById("bunyiSalah"));
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";
    document.getElementById("teksAnimasi").innerHTML = "Status: Transaksi ditolak mesin.";
    
    // Animasi syiling tak lepas masuk, vibrate sikit
    let syiling = document.getElementById("syiling-emas");
    syiling.style.transform = "translateX(-15px)";
    await tunggu(100);
    syiling.style.transform = "translateX(15px)";
    await tunggu(100);
    syiling.style.transform = "translateX(0)";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🚫🪙";
        document.getElementById("tajuk-kalah").innerHTML = "Transaksi Ditolak!";
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1000);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }