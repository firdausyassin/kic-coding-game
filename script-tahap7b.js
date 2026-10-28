let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;
let isPaused = false;

// Menjana nombor soalan rawak untuk Operasi Tolak
let jumlahTong = Math.floor(Math.random() * 4) + 5; // 5 hingga 8
let tongDibuang = Math.floor(Math.random() * 3) + 2; // 2 hingga 4
let bakiSebenar = jumlahTong - tongDibuang;

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem bunyi audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", async function() {
    let teksStatus = document.getElementById("teksAnimasi");
    let zonTong = document.getElementById("zon-tong");
    
    await tunggu(800); 
    
    if(teksStatus) {
        teksStatus.innerHTML = `Tugasan: Terdapat ${jumlahTong} tong. Buang ${tongDibuang} tong kosong!`;
    }
    
    // Jana Tong 🛢️ dan susun sekeliling bawah Roket
    if(zonTong) {
        zonTong.innerHTML = "";
        for(let i=0; i<jumlahTong; i++) {
            let div = document.createElement("div");
            div.className = "tong";
            div.innerHTML = "🛢️";
            let jarakX = (i % 2 === 0) ? (30 - (i * 3)) : (60 + (i * 3)); 
            div.style.left = `${jarakX}%`; 
            zonTong.appendChild(div);
        }
    }

    cakapSistem(`Amaran Graviti! Roket menampung ${jumlahTong} tong. Kita mesti buang ${tongDibuang} daripadanya. Gunakan tolak (-)!`, 5000);
});

// KAWALAN BUKA/TUTUP PANDUAN
function bukaInfo() { 
    isPaused = true; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.add("paused"); 
    if(modal) modal.classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    isPaused = false; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.remove("paused"); 
    if(modal) modal.classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanTahap7b() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let roket = document.getElementById("roket");
    let semuaTong = document.querySelectorAll(".tong");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Roket telah berada di orbit! Refresh untuk misi baru.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX MENANGKAP OPERASI MATEMATIK (TOLAK)
    let regexKira = /^sistem\.kira\((\d+)-(\d+)\)$/;
    let padanan = input.match(regexKira);

    if (padanan) {
        let nombor1 = parseInt(padanan[1]);
        let nombor2 = parseInt(padanan[2]);
        let jawapanDitaip = nombor1 - nombor2;

        adakahSibuk = true;
        
        if (jawapanDitaip === bakiSebenar && nombor1 === jumlahTong && nombor2 === tongDibuang) {
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            if(maklumBalas) {
                maklumBalas.innerHTML = `Pengiraan Tepat: ${nombor1} - ${nombor2} = ${jawapanDitaip}. Membuang bebanan lebihan!`;
                maklumBalas.style.borderLeftColor = "#2ecc71";
            }
            
            cakapSistem(`Baki ${jawapanDitaip} tong disahkan mencukupi! Melucutkan ${nombor2} tong kosong sekarang...`, 3000);
            
            await tunggu(1000);
            
            // 🔥 ANIMASI 1: TONG LEBIHAN GUGUR JATUH KE BAWAH 🔥
            if(teksAnimasi) {
                teksAnimasi.innerHTML = `Status: Melucutkan ${nombor2} tong berlebihan...`;
                teksAnimasi.style.borderColor = "#f1c40f";
            }
            
            for(let i=0; i<nombor2; i++) {
                let tongTarget = semuaTong[jumlahTong - 1 - i];
                tongTarget.classList.add("tong-gugur");
                
                mainBunyi(sfxBetul); 
                await tunggu(400); 
            }
            
            await tunggu(1000);

            // 🔥 ANIMASI 2: BAKI TONG MELUNCUR MASUK DALAM ROKET 🔥
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Memuatkan baki kargo ke dalam roket...";
            cakapSistem("Menyimpan baki tong dengan selamat ke dalam ruang kargo roket.", 3000);

            for(let i=0; i<jawapanDitaip; i++) {
                let tongMasuk = semuaTong[i];
                // Tukar speed transition untuk slide masuk yang smooth
                tongMasuk.style.transition = "left 0.4s ease-in, bottom 0.4s ease-in, opacity 0.4s ease-in";
                
                tongMasuk.style.left = "50%"; // Slide ke tengah (koordinat badan roket)
                tongMasuk.style.bottom = "120px"; // Angkat sikit ke perut roket
                tongMasuk.style.opacity = "0"; // Ghaib! Masuk dalam roket
                
                mainBunyi(sfxBetul);
                await tunggu(300);
            }

            await tunggu(1000);
            
            // 🔥 ANIMASI 3: ROKET TERBANG SOLO 🔥
            if(teksAnimasi) {
                teksAnimasi.innerHTML = "Status: Berat optimum dicapai! Enjin Utama dihidupkan!";
                teksAnimasi.style.borderColor = "#2ecc71";
            }
            cakapSistem("Semua sistem berfungsi. IGNITION! Selamat berlepas!", 3000);
            
            await tunggu(1000);
            
            if(roket) roket.classList.add("roket-terbang"); 
            
            await tunggu(2500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
            
        } 
        else if (nombor1 !== jumlahTong || nombor2 !== tongDibuang) {
            mainBunyi(sfxSalah);
            let kotakMesej = document.getElementById("pesan-kalah-teks");
            
            if(maklumBalas) maklumBalas.innerHTML = `Ralat Input: Gunakan nombor yang tertera di soalan (${jumlahTong} dan ${tongDibuang})!`;
            cakapSistem(`Hei! Dari mana awak dapat nombor ${nombor1} dan ${nombor2} tu? Gunakan data di atas!`, 4000);
            if(kotakMesej) kotakMesej.innerHTML = `Anda telah memasukkan nombor rawak. Sila baca pada soalan: Tolak ${tongDibuang} daripada ${jumlahTong} tong asal.`;
            
            if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";
            
            setTimeout(() => {
                adakahTamat = true;
                let modalKalah = document.getElementById("modalKalah");
                if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
            }, 3500);
        }
        else {
            mainBunyi(sfxSalah);
            let kotakMesej = document.getElementById("pesan-kalah-teks");
            
            if(maklumBalas) maklumBalas.innerHTML = `Ralat Matematik: Pengiraan ditolak!`;
            if(kotakMesej) kotakMesej.innerHTML = `Terdapat ralat pada format penolakan atau hasil tolak anda.`;
            if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";
            
            setTimeout(() => {
                adakahTamat = true;
                let modalKalah = document.getElementById("modalKalah");
                if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } 
    else {
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        
        let salahTambah = input.match(/^sistem\.kira\((\d+)\+(\d+)\)$/);
        let jawapanTerus = input.match(/^sistem\.kira\((\d+)\)$/);
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (salahTambah) {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Arahan: Anda mahu tambah beban lagi ke?! Gunakan tolak (-) untuk membuang!";
            cakapSistem("Bahaya! Jangan tambah beban! Roket terlalu berat. Gunakan simbol tolak (-).", 4000);
            if(kotakMesej) kotakMesej.innerHTML = "Anda menggunakan simbol tambah (+). Untuk misi ini, kita perlu membuang tong yang tidak diperlukan menggunakan simbol tolak (-).";
        }
        else if (jawapanTerus) {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Arahan: Tulis operasi tolak (-) berserta nombor di dalam kurungan.";
            cakapSistem("Biarkan saya mengira tolakannya! Gunakan simbol tolak (-).", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Anda memasukkan jawapan terus. Berikan arahan pengiraan yang lengkap kepada mesin. (Contoh: 7-3).";
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format <code>sistem.kira(x - y)</code> ditaip dengan betul.";
            cakapSistem("Sistem gagal mengecam format penolakan anda.", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada sintaks anda. Pastikan ejaan `sistem.kira(x-y)` tepat.";
        }
        if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";

        setTimeout(() => {
            adakahTamat = true;
            let modalKalah = document.getElementById("modalKalah");
            if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
        }, 3500);
    }
}

// 🔥 FUNGSI CAKAP SISTEM DIKEMASKINI DENGAN ID BARU 🔥
function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogRoket");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog-roket");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog-roket"); }, masa);
    }
}