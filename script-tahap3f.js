let adakahTamat = false;
let adakahSibuk = false;

// KEDUDUKAN SEBENAR KAPAL SELAM
const jawapanX = 3;
const jawapanY = 2;

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

async function laksanaArahanTahap3f() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Sistem radar ditutup. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // TAPISAN KETAT: Periksa jika ada pengguna yang letak tanda petik ("3", "2")
    let cekAdaQuotes = input.match(/^radar\.kesan\((["'])\d+\1,(["'])\d+\2\)$/);
    if (cekAdaQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Koordinat adalah nilai Angka murni! Tolong jangan letak tanda petik <code>" "</code> pada nombor.`);
        return;
    }

    // REGEX TEPAT: radar.kesan(angka, angka)
    let padananTepat = input.match(/^radar\.kesan\((\d+),(\d+)\)$/);

    if (padananTepat) {
        let inputX = parseInt(padananTepat[1]);
        let inputY = parseInt(padananTepat[2]);

        adakahSibuk = true;
        let crosshair = document.getElementById("crosshair");
        let kapalSelam = document.getElementById("sasaran-objek");

        maklumBalas.innerHTML = `Mengesahkan lokasi Paksi X=${inputX}, Paksi Y=${inputY}...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Menggerakkan pengimbas...";
        
        // LIMITKAN NOMBOR MAKSIMUM (Grid kita saiz 0 hingga 4 je)
        if (inputX > 4 || inputY > 4) {
            paparRalatPantas(sfxSalah, `Ralat Radar: Grid kita hanya menyokong skala 0 hingga 4 sahaja. Koordinat (${inputX}, ${inputY}) berada di luar peta!`);
            adakahSibuk = false;
            return;
        }

        // ==========================================
        // ANIMASI CROSSHAIR BERGERAK KE KOORDINAT
        // ==========================================
        mainBunyi(sfxBetul);
        crosshair.classList.add("crosshair-aktif");
        
        // Kira pergerakan dalam Pixel (Setiap 1 grid = 50px)
        let gerakX_Px = inputX * 50;
        let gerakY_Px = inputY * 50;

        // Gerak X dulu (Melintang)
        crosshair.style.left = gerakX_Px + "px";
        await tunggu(600);
        
        // Gerak Y pulak (Menegak)
        mainBunyi(sfxBetul);
        crosshair.style.bottom = gerakY_Px + "px";
        await tunggu(800);

        // ==========================================
        // KEPUTUSAN PENGESANAN
        // ==========================================
        
        if (inputX === jawapanX && inputY === jawapanY) {
            // TEPAT!
            mainBunyi(sfxBetul); // Ganti dengan bunyi alarm lock kalau ada
            kapalSelam.classList.add("sasaran-dijumpai");
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Kapal Selam Asing dikesan!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Kefahaman Dwi-Parameter Koordinat berjaya!";
            
            // Hentikan pusingan radar sebab dah lock
            document.getElementById("garisan-scan").style.animationPlayState = "paused";
            
            await tunggu(1200);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        else if (inputX === jawapanY && inputY === jawapanX) {
            // TERSILAP TERBALIK (X masuk Y, Y masuk X)
            crosshair.style.borderColor = "#ff5e57"; // Tukar kotak jadi merah
            paparRalatKalah("Koordinat Terbalik!", `Anda mengunci kedudukan X=${inputX} dan Y=${inputY}. Sentiasa tulis nilai Paksi X (bawah) dahulu, barulah Paksi Y (kiri).`);
        }
        else {
            // SALAH TERUK
            crosshair.style.borderColor = "#ff5e57";
            paparRalatKalah("Tersasar Jauh!", `Sistem pengimbas tidak menjumpai apa-apa pada petak X=${inputX} dan Y=${inputY}. Sila semak silang garisan kapal tersebut.`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>radar.kesan(x, y)</code> menggunakan nombor.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Imbasan gagal. Tiada sasaran.";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "❌🌊";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1200);
    
    adakahSibuk = false;
    adakahTamat = true;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }