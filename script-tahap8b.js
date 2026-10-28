let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    await tunggu(800); 
    cakapSistem("Amaran! Meteor akan menghentam pangkalan kita. Sila cas bateri_a dan bateri_b supaya jumlahnya tepat 100!", 5000);
}

async function laksanaArahanTahap8b() {
    // Bersihkan kod dari segala space dan newline untuk carian Regex yang mantap
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let meteor = document.getElementById("meteor-ancaman");
    let laser = document.getElementById("sinar-laser");
    let meriam = document.getElementById("meriam-base");
    
    let isiA = document.getElementById("isi-a");
    let isiB = document.getElementById("isi-b");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // 🔥 REGEX SUPER CANGGIH: Mengesan deklarasi variabel dan fungsi tembak secara serentak 🔥
    let cariBateriA = input.match(/bateri_a=(\d+)/);
    let cariBateriB = input.match(/bateri_b=(\d+)/);
    let cariTembak = input.match(/sistem\.tembak\((bateri_a\+bateri_b|bateri_b\+bateri_a)\)/);

    if (cariBateriA && cariBateriB && cariTembak) {
        adakahSibuk = true;
        
        let nilaiA = parseInt(cariBateriA[1]);
        let nilaiB = parseInt(cariBateriB[1]);
        let jumlahKuasa = nilaiA + nilaiB;
        
        mainBunyi(sfxBetul);
        
        // 1. ANIMASI PENGECASAN BATERI
        maklumBalas.innerHTML = "Memproses logik data... Mengecas kapasitor meriam!";
        maklumBalas.style.borderLeftColor = "#00ff88";
        teksAnimasi.innerHTML = `Status: Bateri A(${nilaiA}) + Bateri B(${nilaiB}) = Total Kuasa: ${jumlahKuasa}`;
        
        // Elakkan tinggi bar bateri melebihi 100% jika user letak nombor gila babi
        isiA.style.height = `${Math.min(nilaiA, 100)}%`;
        isiB.style.height = `${Math.min(nilaiB, 100)}%`;
        
        cakapSistem(`Mengekstrak nilai: Bateri A memuatkan ${nilaiA}, Bateri B memuatkan ${nilaiB}. Total tembakan: ${jumlahKuasa}!`, 3500);
        
        await tunggu(1500);

        // 2. KEPUTUSAN TEMBAKAN BERDASARKAN LOGIK MATEMATIK
        if (jumlahKuasa === 100) {
            // TEPAT 100 (MENANG)
            adakahTamat = true;
            
            laser.style.height = "70%"; // Laser pacak kena meteor
            mainBunyi(sfxBetul);
            
            await tunggu(500); // Masa impak
            
            meteor.innerHTML = "💥";
            meteor.classList.add("meteor-hancur");
            
            await tunggu(500);
            laser.style.height = "0"; // Laser mati
            
            teksAnimasi.innerHTML = "Status: Kuasa sempurna 100 dicapai! Ancaman dimusnahkan.";
            cakapSistem("Pengiraan variabel yang tepat! Anda menyelamatkan pangkalan ini.", 4000);
            
            await tunggu(1500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            document.getElementById("modalKemenangan").className = "modal-tunjuk";
            
        } 
        else if (jumlahKuasa < 100) {
            // KURANG DARI 100 (KALAH: TEMBAKAN TAK SAMPAI)
            laser.style.height = `${jumlahKuasa * 0.5}%`; // Laser pendek ikut kuasa
            mainBunyi(sfxSalah);
            
            cakapSistem(`Ralat! Kuasa hanya ${jumlahKuasa}. Tembakan tidak cukup kuat! Meteor menghentam kita!`, 4000);
            
            await tunggu(800);
            laser.style.height = "0"; 
            
            // Meteor hempap
            meteor.style.transition = "top 1s cubic-bezier(0.5, 0, 0.2, 1)";
            meteor.classList.add("meteor-jatuh");
            
            await tunggu(1000);
            
            meriam.innerHTML = "💥";
            meriam.classList.add("meriam-meletup");
            
            maklumBalas.innerHTML = "Sistem Musnah: Kuasa tembakan terlalu lemah. Sila Refresh dan betulkan nilai variabel.";
            maklumBalas.style.borderLeftColor = "#ff4757";
            adakahSibuk = false;
        }
        else {
            // LEBIH DARI 100 (KALAH: OVERHEAT)
            laser.style.height = "30%"; // Tersekat
            laser.style.background = "red";
            laser.style.boxShadow = "0 0 20px red";
            
            mainBunyi(sfxSalah);
            
            cakapSistem(`AMARAN! Kapasiti lampau. Jumlah ${jumlahKuasa} melebihi had 100! Meriam OVERHEAT!`, 4000);
            
            await tunggu(1000);
            laser.style.height = "0"; 
            
            meriam.innerHTML = "💥";
            meriam.classList.add("meriam-meletup");
            
            maklumBalas.innerHTML = "Ralat Litar: Terlebih kuasa (Overload). Sila Refresh dan rendahkan nilai pembolehubah.";
            maklumBalas.style.borderLeftColor = "#ff4757";
            adakahSibuk = false;
        }

    } 
    else {
        // GAGAL KENAL PASTI VARIABEL ATAU SYNTAX
        mainBunyi(sfxSalah);
        
        if (!cariBateriA || !cariBateriB) {
            maklumBalas.innerHTML = "Ralat: Pastikan anda menaip nilai untuk <code>bateri_a = nombor</code> dan <code>bateri_b = nombor</code>.";
            cakapSistem("Dari mana saya nak dapatkan kuasa? Sila isytiharkan variabel bateri dahulu!", 3500);
        } else if (!cariTembak) {
            maklumBalas.innerHTML = "Ralat Arahan: Selepas mengisytihar bateri, masukkan perintah tembakan: <code>sistem.tembak(bateri_a + bateri_b)</code>.";
            cakapSistem("Bateri sudah diisi, tetapi arahan tembakan tidak dijumpai!", 3500);
        }
        
        maklumBalas.style.borderLeftColor = "#ff4757";
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