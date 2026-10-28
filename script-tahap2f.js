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

async function laksanaArahanTahap2f() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Loceng telah berbunyi. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap String (Ada quotes)
    let cekAdaPetik = input.match(/^jam\.set\((["'])?\d+\1,(["'])?\d+\2\)$/);
    if (cekAdaPetik && (input.includes('"') || input.includes("'"))) {
        paparRalatPantas(sfxSalah, `Ralat Teks: Parameter jam dan minit adalah nombor murni. Jangan letak tanda petik <code>" "</code>!`);
        return;
    }

    // RegEx Tangkap Tanda Titik Bertindih (Budak taip jam.set(3:30))
    let cekTitikBertindih = input.match(/^jam\.set\((\d+:\d+)\)$/);
    if (cekTitikBertindih) {
        paparRalatPantas(sfxSalah, `Ralat Pemisah: Gunakan tanda koma <code>,</code> untuk memisahkan dua parameter (jam dan minit), bukan titik bertindih ( : )!`);
        return;
    }

    // RegEx Tepat: jam.set(jam, minit)
    let padananTepat = input.match(/^jam\.set\((\d+),(\d+)\)$/);

    if (padananTepat) {
        let nilaiJam = parseInt(padananTepat[1]);
        let nilaiMinit = parseInt(padananTepat[2]);

        adakahSibuk = true;

        // Validasi Logik Jam (Masa tak boleh melampau)
        if (nilaiJam > 12 || nilaiJam < 1 || nilaiMinit >= 60 || nilaiMinit < 0) {
            paparRalatKalah("Logik Masa Tergelincir!", `Masa ${nilaiJam}:${nilaiMinit} tidak wujud pada muka jam analog biasa. Jam terhad 1-12, minit terhad 0-59.`);
            return;
        }

        // KIRAAN MATEMATIK PUTARAN DARJAH (DEGREES)
        // 1 Jam = 30 darjah (360/12). 1 Minit = 6 darjah (360/60).
        // Jarum jam kena gerak sikit bergantung pada minit (30 minit = setengah jalan = 15 darjah)
        let darjahMinit = nilaiMinit * 6;
        let darjahJam = (nilaiJam * 30) + (nilaiMinit * 0.5);

        // Putarkan Jarum Jam di skrin CSS
        let jarumJamElemen = document.getElementById("jarum-jam");
        let jarumMinitElemen = document.getElementById("jarum-minit");
        
        jarumJamElemen.style.transform = `rotate(${darjahJam}deg)`;
        jarumMinitElemen.style.transform = `rotate(${darjahMinit}deg)`;
        
        mainBunyi(sfxBetul); // Bunyi tik tok mekanikal
        maklumBalas.innerHTML = "Memproses pergerakan gear mekanikal jam...";
        teksAnimasi.innerHTML = "Status: Jarum jam sedang berpusing...";
        
        await tunggu(1500); // Tunggu jarum habis melantun-lantun

        // JAWAPAN BETUL (3:30)
        if (nilaiJam === 3 && nilaiMinit === 30) {
            document.getElementById("maklumBalas").style.borderLeftColor = "#0be881";
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Masa 3:30 disahkan!";
            maklumBalas.innerHTML = "Sempurna: Loceng sekolah berbunyi!";
            
            await tunggu(800);
            mainBunyi(sfxMenang); // Boleh set bunyi loceng kringgg kalau ada MP3 dia
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // JAWAPAN SALAH
        else {
            let minitFormat = nilaiMinit < 10 ? "0" + nilaiMinit : nilaiMinit; // Bagi cantik cth: 3:05
            paparRalatKalah("Masa Salah!", `Anda telah menetapkan jam pada pukul ${nilaiJam}:${minitFormat}. Waktu pulang sekolah adalah pada pukul 3:30!`);
        }
    } 
    // JIKA FORMAT SALAH TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>jam.set(jam, minit)</code>.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Waktu salah.";
    
    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🕰️❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1000);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }