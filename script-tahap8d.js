let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Variable global untuk memegang nilai semasa dan interval
let nilaiRahsiaA = 0; 
let loopKunciA;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem bunyi audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    let kotakA = document.getElementById("kotak-a");
    await tunggu(800); 
    
    // 🔥 MULA GERAKKAN NOMBOR LAJU-LAJU (50 MILISAAT) 🔥
    loopKunciA = setInterval(() => {
        nilaiRahsiaA = Math.floor(Math.random() * 9000) + 1000; // Nombor rawak 4 digit
        kotakA.innerHTML = nilaiRahsiaA;
    }, 50);

    cakapSistem(`Sistem mengesan aliran data mentah yang pantas pada Kunci A. Kunci B masih kosong. Lakukan sinkronisasi untuk menstabilkannya!`, 5500);
}

async function laksanaArahanTahap8d() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let jambatan = document.getElementById("jambatan");
    let rover = document.getElementById("rover");
    let kotakB = document.getElementById("kotak-b");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // 🔥 SISTEM ANTI-PENIPU (Kalau budak cuba taip nombor bulat-bulat e.g: kunci_b=1234) 🔥
    let regexMenipu = /^kunci_b=\d+$/;
    if (input.match(regexMenipu)) {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Operasi: Anda tidak boleh meneka dan menaip nombor secara manual kerana datanya berubah terlalu pantas!";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        cakapSistem("Ditolak! Mustahil untuk ditaip secara manual. Sila ambil terus nilai tersebut menggunakan nama pembolehubah 'kunci_a'!", 4500);
        return;
    }

    // REGEX MENANGKAP COPY VARIABLE: kunci_b = kunci_a
    let regexCopy = /^kunci_b=kunci_a$/;

    if (input.match(regexCopy)) {
        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        // 🔥 HENTIKAN PERGERAKAN NOMBOR A (FREEZE) 🔥
        clearInterval(loopKunciA);
        
        maklumBalas.innerHTML = "Pengkompilan Berjaya: Menstabilkan aliran data dan memindahkan memori...";
        maklumBalas.style.borderLeftColor = "#00ff88";
        
        // 1. KEMASKINI NILAI B
        teksAnimasi.innerHTML = "Status: Membina jambatan sambungan...";
        cakapSistem("Pautan memori disahkan. Kedua-dua memori kini stabil. Menjana jambatan hologram!", 3000);
        
        await tunggu(1000);
        
        // Tulis nilai terakhir A yang dibekukan ke dalam kotak B
        kotakB.innerHTML = nilaiRahsiaA;
        kotakB.style.boxShadow = "0 0 30px #00ff88, inset 0 0 15px #00ff88"; // Efek hijau berjaya
        kotakB.style.borderColor = "#00ff88";
        mainBunyi(sfxBetul);
        
        await tunggu(1000);

        // 2. BINA JAMBATAN
        teksAnimasi.innerHTML = "Status: Jambatan stabil. Rover memulakan pergerakan.";
        jambatan.style.width = "calc(70% - 200px)"; 
        await tunggu(1500);

        // 3. ROVER MELINTAS
        rover.style.left = "calc(85% - 40px)"; // Bergerak ke menara B
        
        await tunggu(2500);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        document.getElementById("modalKemenangan").className = "modal-tunjuk";

    } else {
        mainBunyi(sfxSalah);
        
        // Diagnostic Ralat Terbalik (kunci_a = kunci_b)
        if (input.match(/^kunci_a=kunci_b$/)) {
            maklumBalas.innerHTML = "Ralat Data: Terbalik! Anda sedang cuba menyalin nilai kosong dari B ke dalam A. Taipkan <code>kunci_b = kunci_a</code>.";
            cakapSistem("Jangan kosongkan memori saya! Nilai mesti disalin dari A kepada B.", 4000);
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Gagal mengesan proses salinan. Pastikan format <code>kunci_b = kunci_a</code> ditaip dengan betul.";
            cakapSistem("Arahan sinkronisasi gagal dibaca oleh sistem.", 3000);
        }
        
        maklumBalas.style.borderLeftColor = "#e74c3c";
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogSistem");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}