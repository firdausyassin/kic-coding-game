let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;
let isPaused = false;

// Menjana nombor soalan rawak secara automatik
let kotakA = Math.floor(Math.random() * 4) + 2; // Nombor antara 2 hingga 5
let kotakB = Math.floor(Math.random() * 4) + 1; // Nombor antara 1 hingga 4
let jumlahSebenar = kotakA + kotakB;

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
    let lori = document.getElementById("lori");
    
    await tunggu(800); 
    
    if(teksStatus) {
        teksStatus.innerHTML = `Tugasan: Hantar ${kotakA} kotak oren dan ${kotakB} kotak biru. Berapa jumlahnya?`;
    }
    
    // Lori masuk ke dalam kilang dari kanan, berhenti di tengah (left: 45%)
    if(lori) lori.style.left = "40%";
    cakapSistem(`Perhatian! Lori memerlukan ${kotakA} kotak oren dan ${kotakB} kotak biru. Masukkan operasi matematik (+) di dalam kod!`, 4500);
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

async function laksanaArahanTahap7a() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let zonKotak = document.getElementById("zon-kotak");
    let lori = document.getElementById("lori");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Lori telah berlepas! Refresh untuk tugasan baru.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // REGEX MENANGKAP OPERASI MATEMATIK (TAMBAH)
    let regexKira = /^sistem\.kira\((\d+)\+(\d+)\)$/;
    let padanan = input.match(regexKira);

    if (padanan) {
        let nombor1 = parseInt(padanan[1]);
        let nombor2 = parseInt(padanan[2]);
        let jawapanDitaip = nombor1 + nombor2;

        adakahSibuk = true;
        
        // SEMAK LOGIK KETEPATAN JAWAPAN
        // Memastikan pelajar menaip nombor yang betul diminta oleh sistem
        if (jawapanDitaip === jumlahSebenar && ((nombor1 === kotakA && nombor2 === kotakB) || (nombor1 === kotakB && nombor2 === kotakA))) {
            
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            if(maklumBalas) {
                maklumBalas.innerHTML = `Pengiraan Tepat: ${nombor1} + ${nombor2} = ${jawapanDitaip}. Kargo diluluskan!`;
                maklumBalas.style.borderLeftColor = "#2ecc71";
            }
            
            cakapSistem(`Sistem mengira... ${nombor1} tambah ${nombor2} bersamaan ${jawapanDitaip}. Memulakan tali sawat!`, 3000);
            
            // JANA KOTAK ATAS TALI SAWAT BERDERET
            if(zonKotak) {
                zonKotak.innerHTML = "";
                for(let i=0; i<jawapanDitaip; i++) {
                    let div = document.createElement("div");
                    div.className = "kotak";
                    div.innerHTML = (i < kotakA) ? "📦" : "🧃";
                    div.style.left = `${5 + (i * 7)}%`; // Susun berderet
                    div.style.bottom = "35px"; // Ngam-ngam atas belt
                    zonKotak.appendChild(div);
                }
            }
            
            await tunggu(1000);
            
            // 🔥 TAHAP 1: KOTAK TERBANG & SUSUN IKUT JENIS (BELAKANG LORI / KANAN) 🔥
            if(teksAnimasi) {
                teksAnimasi.innerHTML = `Status: Mengasingkan ${jawapanDitaip} unit kargo mengikut jenis...`;
                teksAnimasi.style.borderColor = "#f1c40f";
                teksAnimasi.style.color = "#2c3e50";
            }
            
            let semuaKotak = document.querySelectorAll(".kotak");
            let susunanOren = 0;
            let susunanBiru = 0;
            
            for(let i=0; i<semuaKotak.length; i++) {
                let kotak = semuaKotak[i];
                let isOren = kotak.innerHTML === "📦";
                
                // Muka lori = Kiri (45%). Belakang lori = Kanan (+150px)
                if (isOren) {
                    kotak.style.left = "calc(45% + 150px)"; // Tindanan Oren (Kanan Lori)
                    kotak.style.bottom = `${85 + (susunanOren * 45)}px`; 
                    susunanOren++;
                } else {
                    kotak.style.left = "calc(45% + 220px)"; // Tindanan Biru (Paling Kanan)
                    kotak.style.bottom = `${85 + (susunanBiru * 45)}px`; 
                    susunanBiru++;
                }
                
                mainBunyi(sfxBetul); // Bunyi 'pop'
                await tunggu(250); 
            }
            
            await tunggu(800);
            
            // 🔥 TAHAP 2: ANIMASI MELUNCUR MASUK KE PINTU BELAKANG LORI 🔥
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Memasukkan kargo ke ruang simpanan lori...";
            cakapSistem("Kerja yang bagus! Kargo disusun rapi. Memuatkan ke dalam lori sekarang.", 4000);
            
            for(let i=0; i<semuaKotak.length; i++) {
                let kotak = semuaKotak[i];
                
                // Animasi kotak menggelongsor serong ke kiri (masuk pintu)
                kotak.style.transition = "left 0.4s ease-in, bottom 0.4s ease-in, opacity 0.4s ease-in";
                
                // Meluncur ke arah KIRI (koordinat perut lori)
                kotak.style.left = "calc(45% + 80px)"; 
                kotak.style.bottom = "90px"; 
                kotak.style.opacity = "0"; // Hilang di dalam trailer
                
                mainBunyi(sfxBetul);
                await tunggu(200); 
            }
            
            await tunggu(1000);
            
            // 🔥 TAHAP 3: LORI BERLEPAS 🔥
            if(teksAnimasi) {
                teksAnimasi.innerHTML = "Status: Kargo penuh! Lori sedia untuk bertolak.";
                teksAnimasi.style.borderColor = "#2ecc71";
            }
            cakapSistem("Penghantaran Selesai! Mengunci pintu kargo dan bergerak...", 3000);
            
            await tunggu(1000);
            
            // Lori jalan ke KIRI skrin
            if(lori) lori.style.left = "-50%"; 
            
            await tunggu(2000);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
            
        } 
        else {
            // JAWAPAN SALAH / TIDAK MENGIKUT ARAHAN
            mainBunyi(sfxSalah);
            let kotakMesej = document.getElementById("pesan-kalah-teks");
            
            if (jawapanDitaip === jumlahSebenar) {
                if(maklumBalas) maklumBalas.innerHTML = `Ralat Operasi: Gunakan nombor yang diminta sahaja!`;
                cakapSistem(`Sila tulis operasi ${kotakA} + ${kotakB} mengikut arahan lori!`, 4000);
                if(kotakMesej) kotakMesej.innerHTML = `Anda memasukkan nilai yang menghasilkan jumlah yang sama, tetapi ia tidak mematuhi senarai barangan kargo yang diminta iaitu ${kotakA} dan ${kotakB}.`;
            } else {
                if(maklumBalas) maklumBalas.innerHTML = `Ralat Matematik: ${nombor1} + ${nombor2} bukan jumlah kargo yang diminta!`;
                cakapSistem(`Operasi ditolak. Kita perlukan ${kotakA} kotak oren dan ${kotakB} kotak biru!`, 4000);
                if(kotakMesej) kotakMesej.innerHTML = `Jumlah kargo tidak mencukupi! Anda memasukkan operasi ${nombor1} + ${nombor2} = ${jawapanDitaip}. Lori memerlukan jumlah tepat untuk berlepas.`;
            }
            
            if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";
            
            setTimeout(() => {
                adakahTamat = true;
                let modalKalah = document.getElementById("modalKalah");
                if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
            }, 3500);
        }

    } 
    else {
        // RALAT SINTAKS
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        
        let jawapanTerus = input.match(/^sistem\.kira\((\d+)\)$/);
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (jawapanTerus) {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Arahan: Jangan letak jumlah terus! Tulis operasi tambah (+).";
            cakapSistem("Biarkan saya yang mengira! Gunakan simbol tambah (+).", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Anda tidak sepatutnya memberikan jawapan akhir. Komputer direka untuk mengira bagi pihak anda, jadi sediakan parameter operasi matematik lengkap (contoh: 3+2).";
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format <code>sistem.kira(x+y)</code> ditaip betul.";
            cakapSistem("Sistem gagal mengecam format pengiraan anda.", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Terdapat kesilapan pada ejaan fungsi arahan atau anda lupa meletakkan kurungan () pada operasi pengiraan.";
        }
        if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";

        setTimeout(() => {
            adakahTamat = true;
            let modalKalah = document.getElementById("modalKalah");
            if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
        }, 3500);
    }
}

// 🔥 NAMA ID DIALOG DIKEMASKINI 🔥
function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogLori");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog-lori");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog-lori"); }, masa);
    }
}