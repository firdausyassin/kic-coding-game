let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Menjana nombor soalan rawak (A + B - C)
let tangkiAsal = Math.floor(Math.random() * 3) + 2;  // 2 hingga 4
let tangkiTambah = Math.floor(Math.random() * 3) + 3; // 3 hingga 5
let tangkiBuang = Math.floor(Math.random() * 2) + 1;  // 1 hingga 2
let bakiSebenar = tangkiAsal + tangkiTambah - tangkiBuang;

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
    let teksStatus = document.getElementById("teksAnimasi");
    let zonTangki = document.getElementById("zon-tangki");
    
    await tunggu(800); 
    
    teksStatus.innerHTML = `Tugasan: Ada ${tangkiAsal} tangki. Tambah ${tangkiTambah} tangki pemberat, buang ${tangkiBuang} yang bocor!`;
    
    // Jana Tangki Asal 💧 di badan kapsul
    zonTangki.innerHTML = "";
    for(let i=0; i<tangkiAsal; i++) {
        let div = document.createElement("div");
        div.className = "titisan";
        div.innerHTML = "💧";
        zonTangki.appendChild(div);
    }

    cakapSistem(`Amaran Tekanan! Kapsul perlukan kalibrasi. Sila taip gabungan tambah dan tolak mengikut turutan di skrin.`, 4500);
}

async function laksanaArahanTahap7c() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let kapsulContainer = document.getElementById("kapsul-container");
    let zonTangki = document.getElementById("zon-tangki");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Sistem: Misi selesai! Harta Karun telah dijumpai.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // 🔥 REGEX MENANGKAP OPERASI GABUNGAN (A + B - C) 🔥
    let regexKira = /^sistem\.kira\((\d+)\+(\d+)-(\d+)\)$/;
    let padanan = input.match(regexKira);

    if (padanan) {
        let nAsal = parseInt(padanan[1]);
        let nTambah = parseInt(padanan[2]);
        let nBuang = parseInt(padanan[3]);
        let jawapanDitaip = nAsal + nTambah - nBuang;

        adakahSibuk = true;
        
        // SEMAK LOGIK KETEPATAN JAWAPAN
        if (nAsal === tangkiAsal && nTambah === tangkiTambah && nBuang === tangkiBuang) {
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Pengiraan Gabungan Tepat: ${nAsal} + ${nTambah} - ${nBuang} = ${jawapanDitaip} Tangki!`;
            maklumBalas.style.borderLeftColor = "#2ecc71";
            
            cakapSistem(`Sistem mengesahkan... Menambah ${nTambah} tangki pemberat ke dalam kapsul!`, 3000);
            
            await tunggu(1000);
            
            // 🔥 FASA 1: ANIMASI TAMBAH TANGKI 🔥
            teksAnimasi.innerHTML = `Status: Memasukkan ${nTambah} tangki pemberat tambahan...`;
            
            for(let i=0; i<nTambah; i++) {
                let div = document.createElement("div");
                div.className = "titisan titisan-masuk";
                div.innerHTML = "💧";
                zonTangki.appendChild(div);
                
                mainBunyi(sfxBetul); 
                await tunggu(400); 
            }
            
            await tunggu(1000);

            // 🔥 FASA 2: ANIMASI BUANG TANGKI BOCOR 🔥
            teksAnimasi.innerHTML = `Status: Membuang ${nBuang} tangki yang dikesan bocor...`;
            cakapSistem(`Amaran! Membuang ${nBuang} tangki bocor dari sistem bagi mengelakkan kerosakan.`, 3000);

            let semuaTangki = document.querySelectorAll(".titisan");
            for(let i=0; i<nBuang; i++) {
                // Kita ambil elemen dari belakang (tangki terakhir yang baru masuk)
                let tangkiTarget = semuaTangki[semuaTangki.length - 1 - i];
                tangkiTarget.classList.add("titisan-buang");
                
                mainBunyi(sfxSalah); // Guna sfx berbeza sikit utk efek buang
                await tunggu(500);
            }

            await tunggu(1500);
            
            // Bersihkan elemen DOM yang dah dibuang (supaya UI kemas)
            let tangkiBocor = document.querySelectorAll(".titisan-buang");
            tangkiBocor.forEach(el => el.remove());
            
            // 🔥 FASA 3: KAPSUL MENYELAM KE DASAR 🔥
            teksAnimasi.innerHTML = "Status: Tekanan air optimum dicapai! Kapsul mula menyelam!";
            cakapSistem("Berat stabil. Melancarkan protokol selaman dasar laut!", 3500);
            
            await tunggu(1000);
            
            kapsulContainer.classList.add("kapsul-selam"); 
            
            await tunggu(3500); // Tunggu sampai kapsul jejak dasar
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            document.getElementById("modalKemenangan").className = "modal-tunjuk";
            
        } 
        else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Input: Gunakan nombor yang tepat berdasarkan soalan di atas!`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            cakapSistem(`Ralat Kalibrasi! Nombor ${nAsal}, ${nTambah}, dan ${nBuang} tidak menepati spesifikasi skrin.`, 4000);
            adakahSibuk = false;
        }

    } 
    else {
        // RALAT SINTAKS / SALAH SUSUNAN
        mainBunyi(sfxSalah);
        
        let salahSusun = input.match(/^sistem\.kira\((\d+)-(\d+)\+(\d+)\)$/);
        
        if (salahSusun) {
            maklumBalas.innerHTML = "Ralat Arahan: Patuhi arahan skrin! Tambah (+) dahulu, kemudian baru tolak (-) !";
            cakapSistem("Sistem ralat! Sila letak operasi tambah (+) di hadapan, tolak (-) di belakang.", 4000);
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format <code>sistem.kira(x + y - z)</code> ditaip dengan betul.";
            cakapSistem("Sistem gagal membaca format kod matematik gabungan anda.", 3500);
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