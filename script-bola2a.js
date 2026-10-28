let adakahTamat = false;
let situasiKeeper = Math.random() > 0.5 ? "kiri" : "kanan"; 

setTimeout(() => {
    let teksAnimasi = document.getElementById("teksAnimasi");
    if (situasiKeeper === "kiri") {
        teksAnimasi.innerHTML = "Arah Angin: Keeper cenderung melompat ke KIRI.";
        cakap("Aku akan tutup sudut kiri!", 3000);
    } else {
        teksAnimasi.innerHTML = "Arah Angin: Keeper cenderung melompat ke KANAN.";
        cakap("Sudut kanan dalam kawalan aku!", 3000);
    }
}, 1000);

function laksanaArahanBola() {
    // Kita buang SEMUA ruang kosong supaya senang nak baca kod budak
    let inputKasar = document.getElementById("arahanInput").value.toLowerCase();
    let inputBersih = inputKasar.replace(/\s+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let keeper = document.getElementById("keeper");
    let bola = document.getElementById("bola");
    let ikonKeeper = document.getElementById("ikonKeeper");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    
    if (adakahTamat) {
        maklumBalas.innerHTML = "Sistem: Perlawanan tamat. Sila muat semula (Refresh).";
        sfxSalah.play();
        return;
    }

    // Semak sama ada budak tu ada tulis kod yang lengkap (kalis-ruang)
    let adaLogikKiri = inputBersih.includes('if(keeper=="kiri"){rembat.kanan()}') || inputBersih.includes('elseif(keeper=="kiri"){rembat.kanan()}');
    let adaLogikKanan = inputBersih.includes('if(keeper=="kanan"){rembat.kiri()}') || inputBersih.includes('elseif(keeper=="kanan"){rembat.kiri()}');

    if (adaLogikKiri && adaLogikKanan) {
        adakahTamat = true; 

        // ANIMASI KEEPER MELOMPAT
        if (situasiKeeper === "kiri") {
            keeper.style.transform = "translate(-100px, 20px) rotate(-45deg)";
            ikonKeeper.innerHTML = "🦸‍♂️";
        } else {
            keeper.style.transform = "translate(100px, 20px) rotate(45deg)";
            ikonKeeper.innerHTML = "🦸‍♂️";
        }

        setTimeout(() => {
            // JIKA KEEPER KIRI, BOLA MESTI KANAN
            if (situasiKeeper === "kiri") {
                // Tembak Kanan
                bola.style.transform = "translate(100px, -220px) scale(0.5)";
            } 
            // JIKA KEEPER KANAN, BOLA MESTI KIRI
            else {
                // Tembak Kiri
                bola.style.transform = "translate(-100px, -220px) scale(0.5)";
            }

            maklumBalas.innerHTML = "Berjaya: Logik Else-If tepat! Penjaga gol tertipu!";
            maklumBalas.style.borderLeftColor = "#2ecc71";
            sfxBetul.play();
            
            setTimeout(() => {
                tamatMisi();
            }, 1000);
            
        }, 500); // Delay sikit bola gerak lepas keeper lompat
        
    } else {
        // JIKA KOD SALAH ATAU TAK LENGKAP
        adakahTamat = true;
        
        // Keeper lompat ikut bola (Tepis)
        if (situasiKeeper === "kiri") {
            keeper.style.transform = "translate(-100px, 20px) rotate(-45deg)";
            bola.style.transform = "translate(-100px, -180px) scale(0.6)"; // Bola tembak kiri, keeper kiri
        } else {
            keeper.style.transform = "translate(100px, 20px) rotate(45deg)";
            bola.style.transform = "translate(100px, -180px) scale(0.6)"; // Bola tembak kanan, keeper kanan
        }
        
        ikonKeeper.innerHTML = "🙅‍♂️"; // Keeper halang
        maklumBalas.innerHTML = "Gagal: Tembakan ditepis! Logik bersyarat tidak tepat.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        cakap("Haha! Mudah dibaca!", 3000);
        sfxSalah.play();
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function tamatMisi() {
    let sfxMenang = document.getElementById("bunyiMenang");
    setTimeout(() => {
        document.getElementById("modalKemenangan").className = "modal-tunjuk";
        sfxMenang.play();
    }, 1500);
}

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogKeeper");
    kotakDialog.innerHTML = mesej;
    kotakDialog.classList.add("tunjuk-dialog");
    setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
}