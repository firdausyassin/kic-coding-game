let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 
let keretaApiDikesan = false;
let isPaused = false; 

// VARIABLES UNTUK SISTEM MASA (25 SAAT)
let bakiMasaKecemasan = 25; 
let intervalMasa;

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

window.onload = async function() {
    let keretaApi = document.getElementById("kereta-api");
    let skrinPenderia = document.getElementById("status-ciri");
    let hintPenderia = document.getElementById("hint-penderia");
    let teksAnimasi = document.getElementById("teksAnimasi");

    cakap(`Perhatian! Sebuah kereta api kargo menghampiri stesen kita.`, 4000); 
    
    await tunggu(1500);

    // Kereta api mula bergerak ke checkpoint radar
    keretaApi.style.left = "25%";
    
    await tunggu(3000); // Tunggu sampai kereta api dikesan radar

    // KEPUTUSAN IMBASAN
    keretaApiDikesan = true;
    
    skrinPenderia.innerHTML = "GENAP";
    skrinPenderia.classList.add("status-aktif");
    hintPenderia.innerHTML = `jenis == "genap"`;
    hintPenderia.style.color = "#f1c40f";
    
    teksAnimasi.innerHTML = `AMARAN: Kereta api di landasan utama! Baki: ${bakiMasaKecemasan}s`;
    teksAnimasi.style.borderColor = "#f1c40f";
    
    cakap("Nombor 24 berakhir dengan angka 4! Ia adalah nombor GENAP. Tukar landasan segera!", 6000);
    
    // MULA TIMER KECEMASAN
    mulakanTimerKecemasan();
}

function mulakanTimerKecemasan() {
    let teksAnimasi = document.getElementById("teksAnimasi");

    intervalMasa = setInterval(() => {
        if (isPaused || adakahTamat) return; // BEKU MASA JIKA BUKA PANDUAN
        
        bakiMasaKecemasan--;
        teksAnimasi.innerHTML = `Status: Masukkan kod lencongan! Baki: ${bakiMasaKecemasan}s`;
        
        // Animasi pergerakan kereta api merangkak perlahan ke arah maut jika belum ditaip kod
        let posisiSemasa = 25 + ((25 - bakiMasaKecemasan) * 2); // Bergerak dari 25% hingga 75%
        document.getElementById("kereta-api").style.transition = "left 1s linear";
        document.getElementById("kereta-api").style.left = posisiSemasa + "%";

        if (bakiMasaKecemasan <= 5) {
            teksAnimasi.innerHTML = `AMARAN: REMPUHAN! Masa: ${bakiMasaKecemasan}s`;
            teksAnimasi.style.borderColor = "#e74c3c";
            teksAnimasi.style.color = "#e74c3c";
        }
        
        if (bakiMasaKecemasan <= 0) {
            clearInterval(intervalMasa);
            gagalSebabMasa();
        }
    }, 1000); 
}

// KAWALAN BUKA/TUTUP PANDUAN (MOD PAUSE GLOBAL)
function bukaInfo() { 
    isPaused = true; 
    document.getElementById("ruangAnimasi").classList.add("paused"); 
    document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    isPaused = false; 
    document.getElementById("ruangAnimasi").classList.remove("paused"); 
    document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanTahap5i() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let keretaApi = document.getElementById("kereta-api");
    let landasanLencong = document.getElementById("landasan-lencong");
    let lampuMerah = document.getElementById("merah");
    let lampuHijau = document.getElementById("hijau");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    if(!keretaApiDikesan) {
        maklumBalas.innerHTML = "Amaran: Radar sedang memproses nombor tren. Sila tunggu.";
        maklumBalas.style.borderLeftColor = "#f1c40f";
        cakap("Sabar! Tunggu sehingga nombor plat melepasi pengimbas kita.", 3000);
        return;
    }

    // RegEx Tangkap: if(jenis=="genap"){tukar_landasan()}
    let padananIf = input.match(/^if\(jenis=="([a-z]+)"\)\{tukar_landasan\(\)\}$/);
    let cekRalatTeks = input.match(/^if\(jenis==([a-z]+)\)/);

    if (padananIf) {
        let jenisDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (jenisDitaip === "genap") {
            
            // MENANG!
            adakahTamat = true;
            clearInterval(intervalMasa); // Hentikan masa

            maklumBalas.innerHTML = "Sistem: Logik Genap sah! Landasan dilencongkan.";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Arah lencongan diaktifkan.`;
            teksAnimasi.style.borderColor = "#0be881";
            teksAnimasi.style.color = "#2c3e50";
            
            mainBunyi(sfxBetul);
            
            // Fasa Animasi Menang
            lampuMerah.classList.remove("lampu-merah-aktif");
            lampuHijau.classList.add("lampu-hijau-aktif");
            landasanLencong.classList.add("landasan-aktif");
            
            await tunggu(500);
            
            // Gerakkan kereta api naik ke atas mengikut landasan serong
            keretaApi.style.transition = "all 2s ease-in-out";
            keretaApi.style.left = "110%";
            keretaApi.style.bottom = "130px";
            keretaApi.style.transform = "scale(0.8)";
            
            await tunggu(1000);
            
            cakap(`Penyelamatan yang hebat! Kereta api bernombor genap kini berada di laluan selamat. 🛤️`, 4000);
            
            await tunggu(1500); 

            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } else {
            // SALAH NOMBOR
            maklumBalas.innerHTML = "Gagal: Klasifikasi nombor ditolak!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);

            cakap(`Eh, skrin radar dikesan nombor "genap", kenapa awak tulis "${jenisDitaip}"? 🤨`, 3000);
            adakahSibuk = false; 
        }

    } else if (cekRalatTeks) {
        maklumBalas.innerHTML = "Ralat Sintaks: Nilai pembolehubah memerlukan Tanda Petik Ganda (\" \")!";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        
        cakap("Awas! Perkataan genap perlukan tanda petik (\" \") di kiri dan kanan!", 3000);
        adakahSibuk = false;

    } else if (input !== "") {
        maklumBalas.innerHTML = `Ralat Sintaks: Sila ikut format -> <code>if(jenis=="genap"){tukar_landasan()}</code>`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        adakahSibuk = false;
    }

    document.getElementById("arahanInput").value = "";
}

async function gagalSebabMasa() {
    adakahTamat = true;
    let sfxSalah = document.getElementById("bunyiSalah");
    let keretaApi = document.getElementById("kereta-api");
    let letupan = document.getElementById("boom-impak");
    
    // Rempuhan
    keretaApi.style.transition = "left 0.5s ease-in";
    keretaApi.style.left = "75%"; 
    
    await tunggu(500);
    letupan.classList.add("skala-boom");
    mainBunyi(sfxSalah);
    
    document.getElementById("teksAnimasi").innerHTML = "Status: KEMALANGAN! Penghadang musnah!";
    
    cakap("Alamak!! Kereta api merempuh penghadang sebab awak lambat menaip kod! 😭", 4000);
    
    document.getElementById("maklumBalas").innerHTML = "Sistem Tergendala: Kegagalan pertukaran landasan.";
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 2500);
}

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPekerja");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}