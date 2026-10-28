// Senarai urutan jawapan yang betul
const urutanCorak = ["bulat", "segi_empat", "segi_tiga"];
const idBongkahSasaran = ["bongkah-3", "bongkah-4", "bongkah-5"];

let langkahSemasa = 0; 
let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

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

async function laksanaArahanTahap4b() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let arnab = document.getElementById("arnab-geometri");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let awanDialog = document.getElementById("dialogArnab");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    let padananBina = input.match(/^bina\.([a-z_]+)\(\)$/);

    if (padananBina) {
        let bentukDitaip = padananBina[1]; 
        let bentukSasaran = urutanCorak[langkahSemasa];

        adakahSibuk = true;

        if (bentukDitaip === bentukSasaran) {
            
            // JAWAPAN BETUL: Bina Bongkah
            let bongkahElemen = document.getElementById(idBongkahSasaran[langkahSemasa]);
            
            if(bongkahElemen) {
                bongkahElemen.classList.remove("bongkah-runtuh");
                bongkahElemen.classList.add("bongkah-terbina");
            }
            
            mainBunyi(sfxBetul);

            maklumBalas.innerHTML = `Sistem: Susunan corak ke-${langkahSemasa + 1} TEPAT! Teruskan...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            
            langkahSemasa++; // Naikkan ke tahap seterusnya

            // ==========================================
            // KES: SEMUA BONGKAH SIAP (TAMAT)
            // ==========================================
            if (langkahSemasa === urutanCorak.length) {
                
                adakahTamat = true;
                teksAnimasi.innerHTML = "Status: Jambatan siap! Arnab menyeberang...";
                maklumBalas.innerHTML = "Berjaya: Anda pakar membaca pola corak!";
                
                cakap("Yeyy! Jambatan dah siap!", 1500);
                await tunggu(1000); // Tunggu arnab gembira kejap
                
                // Arnab melompat ke tengah
                arnab.style.left = "45%"; 
                arnab.style.bottom = "230px"; 
                mainBunyi(sfxBetul); // Ganti bunyi boing lompat kalau ada

                await tunggu(600);
                
                // Arnab melompat ke seberang
                arnab.style.left = "80%"; 
                arnab.style.bottom = "125px"; 
                mainBunyi(sfxBetul);

                await tunggu(600);
                
                // Bila landing, dialog pindah tepi sikit dan ucap terima kasih
                awanDialog.classList.add("dialog-tepi");
                cakap("Yahuuu! Terima kasih! 🥕", 3000);
                
                await tunggu(1500);
                mainBunyi(document.getElementById("bunyiMenang"));
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");

            } 
            else {
                // Kalau bongkah belum habis, suruh teruskan
                cakap("Terbaik! Cepat bina yang seterusnya!", 2500);
                adakahSibuk = false;
            }

        } 
        else {
            // ==========================================
            // JAWAPAN SALAH (Bongkah Runtuh)
            // ==========================================
            let formatNama = bentukDitaip.replace("_", " ");
            maklumBalas.innerHTML = `Gagal: Anda pilih bentuk '${formatNama}'. Sila perhatikan pola dengan betul!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            
            let bongkahElemen = document.getElementById(idBongkahSasaran[langkahSemasa]);
            
            if(bongkahElemen) {
                // Tunjuk bongkah tu kejap (opacity 1) pastu terus jatuh
                bongkahElemen.classList.add("bongkah-terbina");
                
                setTimeout(() => {
                    bongkahElemen.classList.remove("bongkah-terbina");
                    bongkahElemen.classList.add("bongkah-runtuh");
                }, 200);
                
                // Reset balik state bongkah supaya boleh cuba lagi
                setTimeout(() => {
                    bongkahElemen.classList.remove("bongkah-runtuh");
                    adakahSibuk = false;
                }, 1000);
            }

            mainBunyi(sfxSalah);
            cakap("Alamak! Runtuh! Salah corak tu...", 3000);
        }

    } 
    else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format betul -> <code>bina.nama_bentuk()</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogArnab");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}