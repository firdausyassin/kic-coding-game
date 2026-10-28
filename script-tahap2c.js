let adakahTamat = false;
let adakahSibuk = false;
let jumlahEpalSebenar = 5;

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

async function laksanaArahanTahap2c() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Piktograf telah lengkap direkod. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx khas untuk menangkap NOMBOR SAHAJA dalam kurungan (cth: carta.masuk(5))
    let padananAngkaSahaja = input.match(/^carta\.masuk\((\d+)\)$/);
    
    // RegEx khas untuk tangkap kalau budak tertulis text/string berpetik (cth: carta.masuk("5"))
    let padananAdaPetik = input.match(/^carta\.masuk\((["'])\d+\1\)$/);

    if (padananAdaPetik) {
        // Kalau budak letak tanda petik untuk nombor
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        maklumBalas.innerHTML = `Ralat Format: Parameter angka (nombor) TIDAK memerlukan tanda petik <code>" "</code>! Sila buang tanda petik tersebut.`;
        return;
    }

    if (padananAngkaSahaja) {
        let nilaiDimasukkan = parseInt(padananAngkaSahaja[1]); // Tukar jadi Number

        adakahSibuk = true;

        // JAWAPAN BETUL
        if (nilaiDimasukkan === jumlahEpalSebenar) {
            mainBunyi(sfxBetul);
            maklumBalas.innerHTML = `Merekod ${nilaiDimasukkan} data epal ke dalam piktograf...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Mengumpul data...";

            // Animasi epal terbang satu per satu masuk carta
            for (let i = 1; i <= jumlahEpalSebenar; i++) {
                let epal = document.getElementById("epal" + i);
                let targetSlot = document.getElementById("target" + i);
                
                // Dapat koordinat target relatif kepada skrin
                let targetRect = targetSlot.getBoundingClientRect();
                let bekasAnimasiRect = document.getElementById("ruangAnimasi").getBoundingClientRect();
                
                let targetY = targetRect.top - bekasAnimasiRect.top;
                let targetX = targetRect.left - bekasAnimasiRect.left + 40; // Ke kanan sikit dari nombor

                // Setup pergerakan
                epal.style.bottom = "auto"; // Buang pegangan bottom sebab kita guna top sekarang
                epal.style.top = epal.offsetTop + "px"; // Kunci posisi asal
                epal.style.transform = "rotate(0deg)"; // Luruskan buah
                
                await tunggu(50); // Frame buffer sikit
                
                // Gerak ke target
                epal.style.top = targetY + "px";
                epal.style.left = targetX + "px";
                epal.style.zIndex = "25"; // Biar dia lalu depan papan
                
                mainBunyi(sfxBetul); // Bunyi 'pop' setiap kali epal gerak
                await tunggu(600); // Tunggu epal sampai slot sebelum gerak seterusnya
            }

            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Piktograf lengkap!";
            maklumBalas.innerHTML = "Sempurna: Nilai pembolehubah angka tepat!";
            
            await tunggu(800);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // JAWAPAN SALAH NOMBOR
        else {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#f1c40f";
            maklumBalas.innerHTML = `Ralat Matematik: Terdapat ${jumlahEpalSebenar} biji epal fizikal, bukan ${nilaiDimasukkan}!`;
            teksAnimasi.innerHTML = "Ralat: Data tidak sepadan dengan realiti.";
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🔢❌";
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan parameter nilai (${nilaiDimasukkan}). Jumlah ini tidak sama dengan taburan epal di atas padang. Sila hitung dengan betul.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
            
            adakahSibuk = false;
        }

    } 
    // JIKA SALAH SYNTAX TERUK
    else {
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>carta.masuk(angka)</code> tanpa tanda petik.";
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }