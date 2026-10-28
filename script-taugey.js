// ==========================================
// ENJIN PANGKALAN DATA (LOCAL STORAGE)
// ==========================================

let logSemaian = JSON.parse(localStorage.getItem("dataTaugey")) || {
    hari: 0,
    adaKapas: false,
    jumlahBenih: 0,
    adaAir: false
};

// Paparkan status terkini sebaik sahaja web dibuka
kemaskiniPaparan();

function laksanaArahanTaugey() {
    let input = document.getElementById("arahanInput").value.toLowerCase().trim();
    let maklumBalas = document.getElementById("maklumBalas");
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    let padananBenih = input.match(/^letak\.benih\((\d+)\)$/);

    // KUNCI JIKA SUDAH TAMAT (Hari ke-3)
    if (logSemaian.hari >= 3) {
        maklumBalas.innerHTML = "Sistem: Projek tamat. Taugey sudah sedia untuk dituai!";
        maklumBalas.style.borderLeftColor = "#2ecc71";
        sfxBetul.play();
        document.getElementById("arahanInput").value = "";
        return;
    }

    if (input === "sedia.kapas()") {
        if (!logSemaian.adaKapas) {
            logSemaian.adaKapas = true;
            berjaya("Kapas berjaya dihamparkan di dalam bekas.");
        } else {
            gagal("Kapas sudah pun berada di dalam bekas.");
        }
    }
    else if (padananBenih) {
        let nilai = parseInt(padananBenih[1]);
        if (!logSemaian.adaKapas) {
            gagal("Ralat: Sila letak kapas dahulu sebelum menabur benih!");
        } else if (logSemaian.jumlahBenih > 0) {
            gagal("Ralat: Benih sudah ditabur.");
        } else {
            logSemaian.jumlahBenih = nilai;
            berjaya(nilai + " biji benih kacang hijau dimasukkan.");
        }
    }
    else if (input === "siram.air()") {
        if (!logSemaian.adaKapas) {
            gagal("Ralat: Tiada medium kapas untuk menyerap air.");
        } else if (logSemaian.adaAir) {
            gagal("Kapas sudah lembap. Jangan terlebih air nanti akar lemas!");
        } else {
            logSemaian.adaAir = true;
            berjaya("Medium kapas telah dilembapkan. Sedia untuk pembesaran.");
        }
    }
    else if (input !== "") {
        gagal("Ralat Sintaks: Arahan tidak wujud.");
    }

    document.getElementById("arahanInput").value = "";
    localStorage.setItem("dataTaugey", JSON.stringify(logSemaian));
    kemaskiniPaparan();

    function berjaya(mesej) {
        maklumBalas.innerHTML = "Berjaya: " + mesej;
        maklumBalas.style.borderLeftColor = "#2ecc71";
        sfxBetul.play();
    }
    function gagal(mesej) {
        maklumBalas.innerHTML = "Gagal: " + mesej;
        maklumBalas.style.borderLeftColor = "#e74c3c";
        sfxSalah.play();
    }
}

// ==========================================
// FUNGSI MESIN MASA (ADMIN/TESTER)
// ==========================================
function lajukanMasa() {
    // Halang masa bergerak jika semaian Hari 0 belum siap
    if (!logSemaian.adaKapas || logSemaian.jumlahBenih === 0) {
        alert("Sila lengkapkan prosedur semaian (kapas & benih) dahulu!");
        return;
    }
    
    // Halang masa bergerak jika kapas kering (pokok akan mati)
    if (!logSemaian.adaAir) {
        alert("AMARAN: Kapas kering! Anda perlu taip 'siram.air()' sebelum membiarkan ia keesokan harinya.");
        return;
    }

    // Halang jika dah sampai had
    if (logSemaian.hari >= 3) {
        alert("Projek sudah selesai. Sila tuai taugey anda!");
        return;
    }

    // Proses melajukan masa
    logSemaian.hari += 1;
    logSemaian.adaAir = false; // Air menyejat, kapas kering esoknya
    localStorage.setItem("dataTaugey", JSON.stringify(logSemaian));
    
    kemaskiniPaparan();

    // Notifikasi sistem
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.innerHTML = "⏳ Sistem: 24 Jam berlalu. Kapas telah mengering, sila siram semula!";
    maklumBalas.style.borderLeftColor = "#f39c12";
}

// ==========================================
// FUNGSI KEMAS KINI VISUAL BERDASARKAN MEMORI
// ==========================================
function kemaskiniPaparan() {
    document.getElementById("valHari").innerHTML = logSemaian.hari;
    document.getElementById("valKapas").innerHTML = logSemaian.adaKapas ? "Ada" : "Belum";
    document.getElementById("valBenih").innerHTML = logSemaian.jumlahBenih;
    
    let statusAir = document.getElementById("valAir");
    statusAir.innerHTML = logSemaian.adaAir ? "Lembap 💧" : "Kering 🏜️";
    statusAir.style.color = logSemaian.adaAir ? "#3498db" : "#e74c3c"; // Biru jika basah, Merah jika kering

    let bekas = document.getElementById("bekasTaugey");
    let teksStatus = document.getElementById("teksAnimasi");

    // LOGIK EVOLUSI TUMBESARAN MENGIKUT HARI
    if (logSemaian.hari === 3) {
        bekas.innerHTML = "🥣🌳"; // Taugey Matang
        teksStatus.innerHTML = "Status: TAHNIAH! Taugey sedia untuk dituai dan dimasak!";
        teksStatus.style.color = "#27ae60";
    }
    else if (logSemaian.hari === 2) {
        bekas.innerHTML = "🥣🪴"; // Pokok kecil
        teksStatus.innerHTML = logSemaian.adaAir ? "Status: Tumbesaran sangat sihat." : "AMARAN: Kapas kering! Sila siram air.";
    }
    else if (logSemaian.hari === 1) {
        bekas.innerHTML = "🥣🌿"; // Pucuk keluar
        teksStatus.innerHTML = logSemaian.adaAir ? "Status: Pucuk mula naik." : "AMARAN: Kapas kering! Sila siram air.";
    }
    else {
        // HARI 0 (Fasa Semaian)
        if (logSemaian.adaAir && logSemaian.jumlahBenih > 0) {
            bekas.innerHTML = "🥣🌱"; 
            teksStatus.innerHTML = "Status: Semaian lengkap. Sila tunggu esok (atau guna Mesin Masa).";
        } 
        else if (logSemaian.jumlahBenih > 0) {
            bekas.innerHTML = "🥣🧆"; 
            teksStatus.innerHTML = "Status: Benih perlukan air untuk mula aktif.";
        } 
        else if (logSemaian.adaKapas) {
            bekas.innerHTML = "🥣☁️"; 
            teksStatus.innerHTML = "Status: Medium kapas sedia. Masukkan benih.";
        } 
        else {
            bekas.innerHTML = "🥣"; 
            teksStatus.innerHTML = "Status: Bekas kosong. Sila ikut manual prosedur.";
        }
    }
}

// ==========================================
// FUNGSI RESET
// ==========================================
function resetTaugey() {
    localStorage.removeItem("dataTaugey");
    location.reload(); 
}