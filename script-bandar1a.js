let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

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
    await tunggu(800); 
    cakapSistem("Nino! Nino! Trafik sesak di hadapan. Mohon pelepasan kecemasan segera!", 5000);
}

// 🔥 Fungsi Event-Driven Promise untuk Pergerakan Kenderaan 🔥
function gerakkanKenderaan(elemen, sasaranKiri) {
    return new Promise((resolve) => {
        const tamatHandler = (e) => {
            if (e.propertyName === 'left') {
                elemen.removeEventListener('transitionend', tamatHandler);
                resolve(); 
            }
        };
        elemen.addEventListener('transitionend', tamatHandler);
        elemen.style.left = sasaranKiri;
    });
}

async function laksanaArahanBandar1a() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kenderaan = document.getElementById("ambulans-container");
    let mentolMerah = document.getElementById("merah");
    let mentolHijau = document.getElementById("hijau");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // REGEX: Membaca if(ambulans){lampu.hijau()} 
    let padananIf = input.match(/^if\(ambulans\)\{lampu\.hijau\(\)\}$/);
    
    // REGEX PERANGKAP: Jika pemain menipu taip lampu.hijau() tanpa if()
    let padananTipu = input.match(/^lampu\.hijau\(\)$/);

    if (padananIf) {
        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Pengkompilan Berjaya: Logik Bersyarat dieksekusi. Laluan dibuka.";
        maklumBalas.style.borderLeftColor = "#2ecc71";
        
        // 1. TUKAR LAMPU HIJAU
        mentolMerah.classList.remove("merah-nyala");
        mentolHijau.classList.add("hijau-nyala");
        
        teksAnimasi.innerHTML = "Status: Lampu Hijau! Ambulans melintasi persimpangan.";
        teksAnimasi.style.color = "#27ae60";
        teksAnimasi.style.borderColor = "#2ecc71";
        
        await tunggu(1000);

        // 2. KENDERAAN BERGERAK (PROMISE)
        await gerakkanKenderaan(kenderaan, "120%"); 
        
        cakapSistem("Terima kasih! Masa kecemasan berjaya disingkatkan.", 3000);
        
        await tunggu(1000);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        document.getElementById("modalKemenangan").className = "modal-tunjuk";

    } else if (padananTipu) {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Keselamatan: Anda tidak boleh menukar lampu hijau sesuka hati! Wajib masukkan fungsi itu di dalam arahan bersyarat <code>if(ambulans)</code>.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        cakapSistem("Sistem lampu tidak benarkan pertukaran manual! Guna arahan blok IF!", 4000);
    } else {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format, ejaan, serta pembukaan/penutupan kurungan <code>()</code> dan <code>{}</code> ditaip dengan tepat.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        cakapSistem("Struktur IF gagal dibaca. Sila rujuk panduan operasi kembali.", 3500);
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogAmbulans");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}