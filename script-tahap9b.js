let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Janakan kuasa altitud rawak (Pastikan LEBIH BESAR dari 8000 supaya budak sentiasa dapat jawapan True)
let altitudDron = Math.floor(Math.random() * 1500) + 8500; // Antara 8500 hingga 9999

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
    let skrinAltitud = document.getElementById("papar-altitud");
    
    await tunggu(800); 
    
    skrinAltitud.innerHTML = `${altitudDron} px`; // Papar altitud sebenar dron
    mainBunyi(document.getElementById("bunyiBetul")); 
    
    cakapSistem(`Sistem sedia. Kapasiti altitud semasa dikesan pada ${altitudDron} piksel. Sila masukkan syarat pelepasan (Lebih Besar > 8000).`, 6000);
}

// 🔥 FUNGSI EVENT-DRIVEN UNTUK PERGERAKAN DRON YANG SELAMAT (INDUSTRI STANDARD) 🔥
function gerakkanDron(elemen, jenisTransition, sasaranTarget) {
    return new Promise((resolve) => {
        const tamatHandler = (e) => {
            if (e.propertyName === jenisTransition) {
                elemen.removeEventListener('transitionend', tamatHandler);
                resolve(); 
            }
        };
        elemen.addEventListener('transitionend', tamatHandler);
        
        if (jenisTransition === 'bottom') {
            elemen.style.bottom = sasaranTarget;
        } else if (jenisTransition === 'left') {
            elemen.style.left = sasaranTarget;
        }
    });
}

async function laksanaArahanTahap9b() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let dron = document.getElementById("dron");
    let paparStatus = document.getElementById("papar-status");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // REGEX: Membaca sistem.semak(altitud>8000)
    let regexSyarat = /^sistem\.semak\(altitud>(\d+)\)$/;
    let padanan = input.match(regexSyarat);

    if (padanan) {
        let nilaiHadDitaip = parseInt(padanan[1]);

        if (nilaiHadDitaip === 8000) {
            adakahSibuk = true;
            adakahTamat = true;
            
            // LOGIK BOOLEAN BERLAKU DI SINI
            let adakahLulus = altitudDron > nilaiHadDitaip; // Hasilnya TRUE
            
            if (adakahLulus) {
                mainBunyi(sfxBetul);
                maklumBalas.innerHTML = `Sistem Logik: ${altitudDron} > 8000 adalah <b>TRUE</b>. Kebenaran terbang diberikan!`;
                maklumBalas.style.borderLeftColor = "#2ecc71";
                
                paparStatus.innerHTML = "TRUE (DILULUSKAN)";
                paparStatus.className = "status-hijau";
                cakapSistem(`Syarat disahkan Benar (TRUE)! Memulakan pelepasan menegak.`, 3000);
                
                await tunggu(1000);
                
                // 1. DRON NAIK MENEGAK (Translate Y / Bottom) - Z-Index 20 akan lepasi Firewall 10
                await gerakkanDron(dron, 'bottom', '260px'); 
                
                cakapSistem(`Altitud selamat dicapai. Meluncur melepasi Firewall...`, 2500);
                
                // 2. DRON BERGERAK KE HADAPAN (Translate X / Left)
                await gerakkanDron(dron, 'left', '120%'); 
                
                await tunggu(500);
                let menangSfx = document.getElementById("bunyiMenang");
                mainBunyi(menangSfx);
                document.getElementById("modalKemenangan").className = "modal-tunjuk";
            } 
            else {
                // Failsafe (Tidak patut berlaku sbb altitud sentiasa > 8500)
                mainBunyi(sfxSalah);
                paparStatus.innerHTML = "FALSE (GAGAL)";
                paparStatus.className = "status-merah";
                maklumBalas.innerHTML = `Sistem Logik: ${altitudDron} > 8000 adalah <b>FALSE</b>. Penerbangan dibatalkan!`;
            }

        } else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Parameter: Kenapa letak syarat ${nilaiHadDitaip}? Ketinggian Tembok Firewall adalah 8000!`;
            cakapSistem("Baca data pada skrin betul-betul! Had halangan adalah 8000, bukan nombor sesuka hati.", 4000);
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
    } else {
        mainBunyi(sfxSalah);
        
        if (input.includes("<")) {
            maklumBalas.innerHTML = "Ralat Logik Bencana: Anda menggunakan simbol lebih kecil (<code><</code>)! Dron akan merempuh tembok jika terbang di bawah 8000!";
            cakapSistem("Adakah awak buta huruf logik? Nak lepasi halangan tinggi kena terbang LEBIH BESAR (>), bukan lebih kecil (<)!", 4500);
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Format semakan salah. Pastikan kod ditaip sebagai: <code>sistem.semak(altitud > 8000)</code>";
            cakapSistem("Sistem radar gagal memproses format arahan penerbangan tersebut.", 3000);
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