let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Janakan berat lori rawak (Kurang dari 5000 supaya budak sentiasa dapat jawapan True)
let beratLori = Math.floor(Math.random() * 2000) + 2000; 

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
    let lori = document.getElementById("lori");
    let penimbang = document.getElementById("penimbang");
    let skrin = document.getElementById("skrin-tol");
    
    await tunggu(800); 
    
    // Lori masuk dan berhenti atas penimbang 
    lori.style.left = "38%"; 
    
    await tunggu(2500); // Masa lori jalan perlahan-lahan ke penimbang
    
    penimbang.classList.add("timbang-aktif"); 
    mainBunyi(document.getElementById("bunyiBetul")); 
    
    skrin.innerHTML = `${beratLori} KG`; 
    
    cakapSistem(`Kenderaan dikesan! Berat lori adalah ${beratLori}kg. Sila masukkan syarat pengimbas untuk memastikan ia < 5000!`, 5500);
}

async function laksanaArahanTahap9a() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let lori = document.getElementById("lori");
    let palang = document.getElementById("palang");
    let skrin = document.getElementById("skrin-tol");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // REGEX: Membaca sistem.semak(berat<5000)
    let regexSyarat = /^sistem\.semak\(berat<(\d+)\)$/;
    let padanan = input.match(regexSyarat);

    if (padanan) {
        let nilaiHadDitaip = parseInt(padanan[1]);

        if (nilaiHadDitaip === 5000) {
            adakahSibuk = true;
            adakahTamat = true;
            
            // LOGIK BOOLEAN BERLAKU DI SINI
            let adakahLulus = beratLori < nilaiHadDitaip; 
            
            if (adakahLulus) {
                mainBunyi(sfxBetul);
                maklumBalas.innerHTML = `Sistem Logik: ${beratLori} < 5000 adalah <b>TRUE</b>. Palang dibuka!`;
                maklumBalas.style.borderLeftColor = "#2ecc71";
                
                skrin.innerHTML = "TRUE: LULUS";
                cakapSistem(`Syarat perbandingan disahkan Benar (TRUE)! Membuka palang keselamatan.`, 3000);
                
                await tunggu(1000);
                
                // PALANG NAIK MENEGAK
                palang.classList.add("palang-buka");
                await tunggu(1500);
                
                // LORI JALAN (Berada di belakang pondok tol)
                lori.style.left = "120%"; 
                
                await tunggu(2500);
                let menangSfx = document.getElementById("bunyiMenang");
                mainBunyi(menangSfx);
                document.getElementById("modalKemenangan").className = "modal-tunjuk";
            } 
            else {
                mainBunyi(sfxSalah);
                skrin.innerHTML = "FALSE: GAGAL";
                skrin.classList.add("amaran-merah");
                maklumBalas.innerHTML = `Sistem Logik: ${beratLori} < 5000 adalah <b>FALSE</b>. Kenderaan disekat!`;
            }

        } else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Parameter: Kenapa letak syarat had ${nilaiHadDitaip}? Arahan menetapkan jambatan hanya menyokong had kurang 5000!`;
            cakapSistem("Baca arahan betul-betul! Had jambatan adalah 5000, bukannya nombor yang awak reka tu.", 4000);
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
    } else {
        mainBunyi(sfxSalah);
        
        if (input.includes(">")) {
            maklumBalas.innerHTML = "Ralat Logik Bencana: Anda menggunakan simbol lebih besar (<code>></code>)! Habislah runtuh jambatan tu kalau lori lebih 5000kg yang lalu!";
            cakapSistem("Bahaya! Awak nak suruh lori berat melampau robohkan jambatan ke? Gunakan simbol kurang dari (<).", 4500);
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Format pengimbas salah. Pastikan kod ditaip sebagai: <code>sistem.semak(berat < 5000)</code>";
            cakapSistem("Sistem pengimbas gagal memproses format arahan tersebut.", 3000);
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