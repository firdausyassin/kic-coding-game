let adakahTamat = false;
let adakahSibuk = false;
const sasaranVoltan = 2;

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

async function laksanaArahanTahap2i() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut dan buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Litar telah rosak/berjaya. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // KES 1: Budak TERBALIKKAN format (letak angka dulu macam Misi 2H)
    let cekTerbalik = input.match(/^litar\.pasang\((\d+),(["'])([a-z]+)\2\)$/);
    if (cekTerbalik) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Susunan terbalik! Anda mesti memasukkan "Komponen Teks" dahulu, diikuti dengan Angka Kuantiti.`);
        return;
    }

    // REGEX TEPAT: litar.pasang("teks", angka)
    let padananTepat = input.match(/^litar\.pasang\((["'])([a-z_]+)\1,(\d+)\)$/);

    if (padananTepat) {
        let komponen = padananTepat[2]; // bateri
        let kuantiti = parseInt(padananTepat[3]); // 2

        adakahSibuk = true;
        let wayarSemua = document.querySelectorAll(".wayar");

        // VALIDASI NAMA KOMPONEN
        if (komponen !== "bateri" && komponen !== "sel_kering") {
            paparRalatKalah("Komponen Salah!", `Litar ini memerlukan sumber kuasa elektrik. Komponen "${komponen}" tidak dapat menghidupkan mentol.`);
            return;
        }

        maklumBalas.innerHTML = `Memasang ${kuantiti} biji ${komponen} ke dalam pemegang...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Mengalirkan arus elektrik...";
        
        // 1. Animasi Masukkan Bateri
        let hadPaparanBateri = kuantiti > 3 ? 3 : kuantiti; // Max 3 bateri nak tunjuk kat skrin
        for (let i = 1; i <= hadPaparanBateri; i++) {
            let bateri = document.getElementById("bateri-" + i);
            if (bateri) {
                bateri.classList.add("bateri-masuk");
                mainBunyi(sfxBetul); // Bunyi kachak! (pasang bateri)
                await tunggu(300);
            }
        }

        await tunggu(400);

        // KES A: VOLTAN TEPAT (MENANG)
        if (kuantiti === sasaranVoltan) {
            
            // Wayar bercahaya kuning
            wayarSemua.forEach(w => w.classList.add("wayar-aktif"));
            mainBunyi(sfxBetul); // Bunyi zap elektrik
            await tunggu(600);
            
            // Mentol menyala
            document.getElementById("mentol").classList.add("mentol-terang");
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Litar lengkap. Voltan stabil!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Parameter Teks & Angka dieksploitasi dengan baik!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // KES B: VOLTAN RENDAH (KALAH)
        else if (kuantiti < sasaranVoltan) {
            
            // Wayar malap kelip sekejap
            wayarSemua.forEach(w => w.classList.add("wayar-aktif"));
            mainBunyi(sfxBetul);
            await tunggu(300);
            
            // Mentol malap
            document.getElementById("mentol").classList.add("mentol-malap");
            await tunggu(800);
            
            // Terus mati semua
            wayarSemua.forEach(w => w.classList.remove("wayar-aktif"));
            document.getElementById("mentol").classList.remove("mentol-malap");
            
            paparRalatKalah("Kurang Voltan!", `Anda hanya meletakkan ${kuantiti} bateri. Tenaga tidak mencukupi untuk menghidupkan mentol. Kita perlukan ${sasaranVoltan} bateri.`);
        }
        // KES C: VOLTAN BERLEBIHAN (KALAH - MELETUP)
        else if (kuantiti > sasaranVoltan) {
            
            // Wayar bertukar merah (overheat)
            wayarSemua.forEach(w => w.classList.add("wayar-terbakar"));
            mainBunyi(document.getElementById("bunyiSalah")); // Boleh letak bunyi buzz keras
            await tunggu(600);
            
            // Mentol letup!
            document.getElementById("mentol").style.opacity = "0";
            document.getElementById("letupan-mentol").classList.add("meletup-boom");
            
            paparRalatKalah("Litar Pintas!", `BAM! Voltan berlebihan! Anda memasukkan ${kuantiti} bateri menyebabkan mentol terbakar. Kita cuma perlukan ${sasaranVoltan} bateri.`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK ATAU TIADA QUOTES
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>litar.pasang(\"komponen\", angka)</code>.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Litar tidak berfungsi.";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "⚡❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1200);
    
    adakahSibuk = false;
    adakahTamat = true; // Lock the game so they have to refresh
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }