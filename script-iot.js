let adakahTamat = false;
let statusLampu = false;
let kelajuanKipas = 0;

function laksanaArahanIoT() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let badanBilik = document.getElementById("badanBilik");
    let kipas = document.getElementById("kipas-pusing");
    let mentol = document.getElementById("mentol-iot");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) return;

    // REGEX TANGKAP ARAHAN
    let padananKipasOn = input.match(/^kipas\.on\((\d+)\)$/);

    // KAWALAN LAMPU
    if (input === "lampu.on()") {
        statusLampu = true;
        badanBilik.classList.add("terang");
        mentol.style.filter = "drop-shadow(0 0 40px #fff)";
        maklumBalas.innerHTML = "Berjaya: Suis lampu diaktifkan.";
        maklumBalas.style.borderLeftColor = "#2ecc71";
        sfxBetul.play();
    } 
    else if (input === "lampu.off()") {
        statusLampu = false;
        badanBilik.classList.remove("terang");
        mentol.style.filter = "drop-shadow(0 10px 10px rgba(0,0,0,0.5))";
        maklumBalas.innerHTML = "Berjaya: Suis lampu dimatikan.";
        maklumBalas.style.borderLeftColor = "#3498db";
        sfxBetul.play();
    }
    // KAWALAN KIPAS (PARAMETER 1-3)
    else if (padananKipasOn) {
        let speed = parseInt(padananKipasOn[1]);
        if (speed >= 1 && speed <= 3) {
            kelajuanKipas = speed;
            // Padam kelas speed lama, ganti yang baru
            kipas.className = ""; 
            kipas.classList.add(`speed-${speed}`);
            maklumBalas.innerHTML = `Berjaya: Kipas diaktifkan pada Tahap ${speed}.`;
            maklumBalas.style.borderLeftColor = "#2ecc71";
            sfxBetul.play();
        } else {
            maklumBalas.innerHTML = "Gagal: Litar pintas! Kelajuan kipas hanya dari tahap 1 hingga 3.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            sfxSalah.play();
        }
    }
    else if (input === "kipas.off()") {
        kelajuanKipas = 0;
        kipas.className = "";
        maklumBalas.innerHTML = "Berjaya: Kipas dimatikan.";
        maklumBalas.style.borderLeftColor = "#3498db";
        sfxBetul.play();
    }
    else {
        maklumBalas.innerHTML = "Ralat Sintaks: Arahan perkakasan tidak dikenali. Rujuk Panduan ℹ️.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        sfxSalah.play();
    }

    // KEMAS KINI TEKS STATUS
    let teksLampu = statusLampu ? "Cerah" : "Gelap";
    let teksKipas = kelajuanKipas > 0 ? `Kipas Tahap ${kelajuanKipas}` : "Kipas Mati";
    teksAnimasi.innerHTML = `Status: ${teksLampu} & ${teksKipas}`;

    // SEMAK SYARAT MENANG (Lampu ON & Kipas Speed 3)
    if (statusLampu && kelajuanKipas === 3) {
        adakahTamat = true;
        setTimeout(() => {
            document.getElementById("modalKemenangan").className = "modal-tunjuk";
            document.getElementById("bunyiMenang").play();
        }, 1500);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }