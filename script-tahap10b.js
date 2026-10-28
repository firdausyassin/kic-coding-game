let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Janakan nombor rawak
let nilaiAsal = Math.floor(Math.random() * 20) + 50; // 50 hingga 69
let nilaiBuffer = Math.floor(Math.random() * 15) + 10; // 10 hingga 24
let hadSuhuSebenar = nilaiAsal + nilaiBuffer; 

// Pastikan suhu terkini sentiasa sedikit rendah dari had supaya logik sentiasa 'True'
let suhuTerkini = hadSuhuSebenar - Math.floor(Math.random() * 5) - 1; 

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
    let paparAsal = document.getElementById("data-asal");
    let paparBuffer = document.getElementById("data-buffer");
    let paparTerkini = document.getElementById("data-terkini");
    let termometer = document.getElementById("termometer-skrin");
    
    await tunggu(800); 
    
    paparAsal.innerHTML = nilaiAsal;
    paparBuffer.innerHTML = nilaiBuffer;
    paparTerkini.innerHTML = suhuTerkini;
    termometer.innerHTML = suhuTerkini + "°C";
    
    mainBunyi(document.getElementById("bunyiSalah")); // Bunyi warning
    cakapSistem(`SISTEM KRITIKAL! Server mencecah ${suhuTerkini}°C. Sila isytiharkan 'had_suhu' dan jalankan semakan overclock segera!`, 7000);
}

async function laksanaArahanTahap10b() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    
    // Buang semua space dan newlines supaya code bersambung menjadi 1 string panjang (Mudah untuk di-regex)
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let rakServer = document.getElementById("rak-server");
    let haba = document.getElementById("haba-bahaya");
    let termometer = document.getElementById("termometer-skrin");
    let semuaLed = document.querySelectorAll(".lampu-led");
    let semuaKipas = document.querySelectorAll(".kipas");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // REGEX: Membaca [had_suhu=XX] (boleh letak + YY juga) bersambung dengan [sistem.overclock(ZZ<had_suhu)]
    let regexOverclock = /had_suhu=(\d+)(?:\+(\d+))?sistem\.overclock\((\d+)<had_suhu\)/;
    let padanan = input.match(regexOverclock);

    if (padanan) {
        let no1 = parseInt(padanan[1]);
        let no2 = padanan[2] ? parseInt(padanan[2]) : 0; // Jika budak menaip 60+20
        let nilaiHadDitaip = no2 === 0 ? no1 : (no1 + no2); // Jika ditaip 80 terus, ambil no1
        let terkiniDitaip = parseInt(padanan[3]);

        // Semakan Logik Keseluruhan
        let perbandinganMatematik = (no1 === nilaiAsal && no2 === nilaiBuffer) || (nilaiHadDitaip === hadSuhuSebenar);
        
        if (perbandinganMatematik && terkiniDitaip === suhuTerkini) {
            adakahSibuk = true;
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Logik Disahkan: Suhu Terkini (${suhuTerkini}) < Had Maksimum (${hadSuhuSebenar}) adalah <b>TRUE</b>.`;
            maklumBalas.style.borderLeftColor = "#00f3ff";
            
            cakapSistem(`Parameter berada di dalam julat selamat (TRUE). Mengaktifkan sistem penyejukan cecair!`, 3500);
            
            await tunggu(1500);
            
            // ANIMASI SEJUK / STABIL ❄️
            mainBunyi(sfxBetul);
            haba.classList.add("haba-hilang"); // Haba merah lesap
            rakServer.classList.add("server-sejuk"); // Server glow biru
            termometer.classList.add("suhu-sejuk");
            
            // Tukar warna termometer dan turunkan angka
            let suhuTurun = suhuTerkini;
            let intervalTurun = setInterval(() => {
                if(suhuTurun > 35) {
                    suhuTurun--;
                    termometer.innerHTML = suhuTurun + "°C";
                } else {
                    clearInterval(intervalTurun);
                }
            }, 50);
            
            // Kipas dan LED jadi biru dan pusing laju
            semuaLed.forEach(led => led.classList.add("led-sejuk"));
            semuaKipas.forEach(kipas => {
                kipas.innerHTML = "❄️"; // Tukar ikon nuklear ke salji
                kipas.classList.add("kipas-laju");
            });
            
            await tunggu(2500);
            cakapSistem("Suhu optimal dicapai (35°C). Misi Master Overclock selesai!", 3000);
            
            await tunggu(2000);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            document.getElementById("modalKemenangan").className = "modal-tunjuk";

        } else if (!perbandinganMatematik) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Matematik: Nilai <code>had_suhu</code> yang anda isytiharkan (${nilaiHadDitaip}) tidak sama dengan data Asal + Buffer (${hadSuhuSebenar}).`;
            cakapSistem("Pengiraan had suhu salah! Sila campurkan Suhu Asal dan Buffer dengan tepat.", 4000);
        } else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Pembolehubah: Nilai semakan (${terkiniDitaip}) tidak sepadan dengan data Suhu Terkini (${suhuTerkini}).`;
            cakapSistem(`Kenapa awak masukkan angka ${terkiniDitaip}? Sila rujuk skrin Suhu Terkini!`, 4000);
        }

    } else {
        mainBunyi(sfxSalah);
        
        // Diagnostic
        if (input.includes(">")) {
            maklumBalas.innerHTML = "Ralat Operasi: Gunakan simbol Lebih Kecil (<code><</code>) untuk memastikan suhu selamat. Jika lebih besar (>), server akan terbakar!";
            cakapSistem("Kita nak pastikan suhu KURANG daripada had! Gunakan simbol <, bukan >.", 4000);
        } else if (!input.includes("had_suhu=")) {
            maklumBalas.innerHTML = "Ralat Sintaks: Anda mesti mencipta memori <code>had_suhu</code> pada baris pertama terlebih dahulu.";
            cakapSistem("Isytiharkan pembolehubah had_suhu sebelum menggunakan sistem overclock!", 3500);
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Pastikan 2 baris kod ditaip mengikut format contoh di ruang panduan.";
            cakapSistem("Sistem gagal membaca rantaian arahan anda.", 3500);
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