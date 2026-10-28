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

async function laksanaArahanTahap3e() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");
    let sfxKacau = document.getElementById("bunyiKacau"); // Kalau kau jumpa bunyi air kena kacau/sudu kilanting cawan, letak sini!

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Bikar telah digunakan. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Check Error 1: Ada satu atau dua nombor tanpa quotes (cth: bikar.kacau("gula", 5))
    let cekAdaNombor = input.match(/bikar\.kacau\(.*?\d+.*?\)/);
    if (cekAdaNombor) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Misi ini memerlukan DUA parameter Teks (huruf). Jangan masukkan sebarang Angka (nombor)!`);
        return;
    }

    // RegEx Check Error 2: Tertinggal quotes pada kelajuan (cth: bikar.kacau("gula", laju))
    let cekTinggalQuotes = input.match(/^bikar\.kacau\((["'])[a-z]+\1,([a-z]+)\)$/);
    if (cekTinggalQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Parameter kelajuan (${cekTinggalQuotes[2]}) adalah rentetan Teks! Sila kurung menggunakan tanda petik <code>" "</code>.`);
        return;
    }

    // REGEX TEPAT: bikar.kacau("bahan", "kelajuan")
    let padananTepat = input.match(/^bikar\.kacau\((["'])([a-z]+)\1,(["'])([a-z]+)\3\)$/);

    if (padananTepat) {
        let bahan = padananTepat[2]; // gula / pasir
        let kelajuan = padananTepat[4]; // laju / perlahan

        adakahSibuk = true;
        let partikel = document.getElementById("partikel-bahan");
        let rodKaca = document.getElementById("rod-kaca");

        // Set visual bahan
        if (bahan === "gula" || bahan === "garam") {
            partikel.innerHTML = "🧊"; // Kiub gula
        } else if (bahan === "pasir" || bahan === "batu") {
            partikel.innerHTML = "🪨"; // Pasir/Batu
        } else {
            paparRalatPantas(sfxSalah, `Ralat Pangkalan Bahan: Makmal ini tiada stok bahan "${bahan}". Sila gunakan "gula" atau "pasir".`);
            adakahSibuk = false; return;
        }

        // Set animasi kelajuan
        let kelasKelajuan = "";
        let masaKacau = 0;
        if (kelajuan === "laju") {
            kelasKelajuan = "kacau-laju";
            masaKacau = 2000;
        } else if (kelajuan === "perlahan") {
            kelasKelajuan = "kacau-perlahan";
            masaKacau = 4000; // Kalau perlahan dia lama sikit nak pusing
        } else {
            paparRalatPantas(sfxSalah, `Ralat Parameter: Kelajuan mesin "${kelajuan}" tidak wujud. Tulis "laju" atau "perlahan".`);
            adakahSibuk = false; return;
        }

        // ==========================================
        // ANIMASI EKSPERIMEN BERMULA
        // ==========================================
        maklumBalas.innerHTML = `Memasukkan ${bahan} dan mengacau secara ${kelajuan}...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Mengacau larutan...";
        mainBunyi(sfxBetul);

        // 1. Bahan Jatuh ke dalam air
        partikel.style.opacity = "1";
        partikel.style.top = "150px"; // Turun masuk air
        await tunggu(800);

        // 2. Rod Mula Berpusing (Kacau)
        rodKaca.classList.add(kelasKelajuan);
        
        // Loop bunyi kacau beberapa kali sepanjang rod berpusing
        let loopBunyi = setInterval(() => { mainBunyi(sfxKacau); }, 500);
        
        await tunggu(masaKacau); // Tunggu sampai siap kacau
        
        clearInterval(loopBunyi); // Stop loop bunyi
        rodKaca.classList.remove(kelasKelajuan); // Rod stop
        
        // ==========================================
        // KEPUTUSAN KETERLARUTAN (LOGIK SAINS)
        // ==========================================
        
        // JAWAPAN TEPAT (GULA + LAJU)
        if ((bahan === "gula" || bahan === "garam") && kelajuan === "laju") {
            
            // Gula larut (hilang)
            partikel.style.opacity = "0";
            await tunggu(500);
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Bahan larut sepenuhnya!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Keterlarutan maksimum dicapai!";
            
            await tunggu(800);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        }
        // GULA TAPI PERLAHAN (Larut sikit je)
        else if ((bahan === "gula" || bahan === "garam") && kelajuan === "perlahan") {
            
            // Gula larut separuh (tak hilang habis sebab perlahan sangat)
            partikel.style.opacity = "0.5";
            partikel.style.transform = "translateX(-50%) scale(0.6)"; 
            
            paparRalatKalah("Lambat Larut!", `Sifat bahan ini boleh larut, namun adukan secara "${kelajuan}" menyebabkan ia masih mendak. Sila tukar kelajuan kepada "laju" untuk hasil segera.`);
        }
        // BAHAN TAK LARUT (PASIR / BATU)
        else if (bahan === "pasir" || bahan === "batu") {
            
            // Pasir berlonggok kat bawah tak larut
            partikel.style.opacity = "1";
            partikel.style.transform = "translateX(-50%) scale(1.1)";
            
            paparRalatKalah("Bahan Mendap!", `Sifat fizikal "${bahan}" adalah TIDAK LARUT di dalam air walaupun dikacau secara ${kelajuan}.`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>bikar.kacau(\"bahan\", \"kelajuan\")</code> dengan koma sebagai pemisah.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Eksperimen gagal.";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🪨❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1200);
    
    adakahSibuk = false;
    adakahTamat = true;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }