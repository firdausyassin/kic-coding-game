let langkahSekarang = 0;
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

function bukaInfo() { 
    document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanMakmal() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    
    let subjek = document.getElementById("subjek-ujian");
    let laser = document.getElementById("cahaya-laser");
    let skrinHolo = document.getElementById("skrin-hologram");
    let teksHolo = document.getElementById("teks-hologram");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) return;
    if (adakahSibuk) return;
    if (input === "") return;

    adakahSibuk = true;

    // LANGKAH 1: IMBAS SUBJEK
    if (langkahSekarang === 0) {
        if (input === "imbas(subjek)") {
            
            maklumBalas.innerHTML = "Sistem: Kod diterima. Pengimbasan biometrik dimulakan...";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxBetul);
            
            teksHolo.innerHTML = "MENGIMBAS STRUKTUR...";
            laser.classList.add("laser-aktif");
            
            await tunggu(1500);
            
            laser.classList.remove("laser-aktif");
            teksHolo.innerHTML = "PROFIL: KUCING DOMESTIK<br>Sila buat pengesahan ciri hidup.";
            teksHolo.style.color = "#00f3ff";
            
            langkahSekarang = 1;
            
        } else {
            // Ralat Langkah 1
            mainBunyi(sfxSalah);
            if (input === "sahkan(bernafas)" || input === "asingkan(hidup)") {
                maklumBalas.innerHTML = "Ralat Logik: Anda mesti mengimbas subjek terlebih dahulu!";
            } else {
                gagalSebabSintaks();
                return;
            }
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
    }
    
    // LANGKAH 2: SAHKAN BERNAFAS
    else if (langkahSekarang === 1) {
        if (input === "sahkan(bernafas)") {
            
            maklumBalas.innerHTML = "Sistem: Ciri dikesan! Dada subjek berombak mengambil oksigen.";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxBetul);
            
            teksHolo.innerHTML = "MENGANALISA RESPIRASI...";
            
            await tunggu(1000);
            
            skrinHolo.classList.add("hologram-hijau");
            teksHolo.innerHTML = "CIRI: BERNAFAS<br>STATUS: BENDA HIDUP";
            
            langkahSekarang = 2;
            
        } else {
            // Ralat Langkah 2
            mainBunyi(sfxSalah);
            if (input === "asingkan(hidup)") {
                maklumBalas.innerHTML = "Ralat Logik: Mesin belum mengesahkan ciri benda hidup (bernafas)!";
            } else if (input === "imbas(subjek)") {
                maklumBalas.innerHTML = "Amaran: Subjek telah pun diimbas. Teruskan ke arahan seterusnya.";
            } else {
                gagalSebabSintaks();
                return;
            }
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
    }
    
    // LANGKAH 3: ASINGKAN (MENANG)
    else if (langkahSekarang === 2) {
        if (input === "asingkan(hidup)") {
            
            adakahTamat = true;
            maklumBalas.innerHTML = "Sistem: Memindahkan Benda Hidup ke Zon Habitat selamat.";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxBetul);
            
            teksHolo.innerHTML = "MEMINDAHKAN SUBJEK...";
            
            // Animasi Pindah ke Zon Selamat (Kanan)
            subjek.style.left = "calc(85% - 150px)";
            subjek.style.transform = "scale(0.8)";
            
            await tunggu(1500);
            
            teksHolo.innerHTML = "OPERASI SELESAI!";
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 800);
            
        } else {
            // Ralat Langkah 3
            mainBunyi(sfxSalah);
            if (input === "imbas(subjek)" || input === "sahkan(bernafas)") {
                maklumBalas.innerHTML = "Amaran: Analisis telah selesai. Sila arahkan proses pengasingan.";
                maklumBalas.style.borderLeftColor = "#ff5e57";
            } else {
                gagalSebabSintaks();
                return;
            }
        }
    }

    document.getElementById("arahanInput").value = "";
    adakahSibuk = false;
}

// Fungsi Panggil Modal Kalah Jika Ejaan Hancur Teruk
function gagalSebabSintaks() {
    adakahTamat = true;
    let sfxSalah = document.getElementById("bunyiSalah");
    mainBunyi(sfxSalah);
    
    document.getElementById("maklumBalas").innerHTML = "Sistem Tergendala: Sintaks kod tidak ditemui dalam pangkalan data.";
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1000);
}