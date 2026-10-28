let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Janakan kuasa asal rawak
let kuasaAsal = Math.floor(Math.random() * 30) + 30; // 30 hingga 59
let kuasaSasaran = 100;
let nilaiDiperlukan = kuasaSasaran - kuasaAsal;

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
    let paparKuasa = document.getElementById("nilai-kuasa");
    
    await tunggu(800); 
    paparKuasa.innerHTML = kuasaAsal;
    mainBunyi(document.getElementById("bunyiSalah")); // Bunyi warning
    
    cakapSistem(`AMARAN! Teras tidak stabil. Kuasa semasa: ${kuasaAsal}. Masukkan nilai "tambahan" supaya sasaran "== 100" tercapai!`, 6000);
}

async function laksanaArahanTahap10a() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let cincinLuar = document.getElementById("cincin-luar");
    let cincinDalam = document.getElementById("cincin-dalam");
    let nadiTeras = document.getElementById("nadi-teras");
    let skrinData = document.getElementById("skrin-data");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // REGEX: Membaca tambahan=XX dan sistem.stabil(YY+tambahan==100) atau (tambahan+YY==100)
    let regexBateri = /tambahan=(\d+)/;
    let regexStabil1 = /sistem\.stabil\((\d+)\+tambahan==100\)/;
    let regexStabil2 = /sistem\.stabil\(tambahan\+(\d+)==100\)/;

    let padananBateri = input.match(regexBateri);
    let padananStabil = input.match(regexStabil1) || input.match(regexStabil2);

    if (padananBateri && padananStabil) {
        let tambahanDitaip = parseInt(padananBateri[1]);
        let asalDitaip = parseInt(padananStabil[1]);

        if (asalDitaip === kuasaAsal && tambahanDitaip === nilaiDiperlukan) {
            adakahSibuk = true;
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Sistem Logik: ${kuasaAsal} + ${tambahanDitaip} == 100 adalah <b>TRUE</b>.`;
            maklumBalas.style.borderLeftColor = "#2ecc71";
            
            cakapSistem(`Override Logik diterima (TRUE). Memulakan kalibrasi penyejukan teras utama...`, 3500);
            
            await tunggu(1500);
            
            // ANIMASI TERAS BERTUKAR STABIL (HIJAU)
            mainBunyi(sfxBetul);
            cincinLuar.classList.add("cincin-luar-stabil");
            cincinDalam.classList.add("cincin-dalam-stabil");
            nadiTeras.classList.add("nadi-stabil");
            nadiTeras.innerHTML = "✅";
            skrinData.classList.add("skrin-stabil");
            
            document.getElementById("nilai-kuasa").style.color = "#2ecc71";
            document.getElementById("nilai-kuasa").innerHTML = "100";
            
            await tunggu(1000);
            cakapSistem("Teras telah stabil 100%. Zon 1 selesai sepenuhnya!", 3000);
            
            await tunggu(2500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            document.getElementById("modalKemenangan").className = "modal-tunjuk";

        } else if (asalDitaip !== kuasaAsal) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Input: Nilai kuasa asal (${asalDitaip}) tidak sepadan dengan bacaan sensor (${kuasaAsal}).`;
            cakapSistem("Semak semula bacaan Kuasa Asal di panel data!", 3500);
        } else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Boolean: ${kuasaAsal} + ${tambahanDitaip} == 100 adalah <b>FALSE</b>! Teras kekal tidak stabil.`;
            cakapSistem(`Pengiraan salah! ${kuasaAsal} + ${tambahanDitaip} tidak bersamaan dengan 100.`, 4000);
        }

    } else {
        mainBunyi(sfxSalah);
        
        if (!padananBateri) {
            maklumBalas.innerHTML = "Ralat Sintaks: Anda belum mengisytiharkan pembolehubah <code>tambahan = nilai</code>.";
            cakapSistem("Isytiharkan nilai tambahan dahulu sebelum melakukan override!", 3500);
        } else if (!input.includes("==")) {
            maklumBalas.innerHTML = "Ralat Operasi: Anda mesti menggunakan dua tanda sama dengan (<code>==</code>) untuk membuat perbandingan!";
            cakapSistem("Awak terlupa meletakkan simbol == di dalam kurungan sistem.stabil!", 4000);
        } else if (!padananStabil) {
            maklumBalas.innerHTML = "Ralat Sintaks: Format pengesahan salah. Gunakan: <code>sistem.stabil(kuasa_asal + tambahan == 100)</code>.";
            cakapSistem("Sistem gagal memproses format arahan kestabilan anda.", 3500);
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