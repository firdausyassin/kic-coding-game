let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranRadas = 3;

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

async function laksanaArahanTahap4i() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let robot = document.getElementById("robot-lengan");
    let taliJalur = document.getElementById("tali-jalur");
    let cangkuk = document.getElementById("cangkuk");
    let air = document.getElementById("pancutan");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    let padananLoop = input.match(/^ulang\((\d+)\)\{(.+)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        let isiDalamGelung = padananLoop[2];

        if (isiDalamGelung === "radas.cuci()" || isiDalamGelung === "radas.simpan()") {
            maklumBalas.innerHTML = "Ralat SOP: Anda mesti memasukkan KEDUA-DUA arahan cuci dan simpan di dalam gelung!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        if (isiDalamGelung === "radas.simpan();radas.cuci()") {
            maklumBalas.innerHTML = "Ralat Logik: Anda menyimpan radas kotor, kemudian memancutkan air di dalam almari! Cikgu marah!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            
            taliJalur.style.left = "80%";
            taliJalur.style.height = "110px";
            taliJalur.style.display = "block";
            robot.style.left = "80%";
            robot.style.top = "110px";
            setTimeout(() => { air.classList.add("pancut-air"); }, 600);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "💦🤬";
                document.getElementById("tajuk-kalah").innerHTML = "Habis Basah Almari!";
                document.getElementById("pesan-kalah").innerHTML = `Susunan kod anda terbalik. Robot telah mengutip mikroskop yang masih kotor, menyimpannya di dalam rak almari, dan kemudian menyembur air di dalamnya! Sentiasa <strong>cuci dahulu, baru simpan</strong>!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
            
            adakahTamat = true;
            return;
        }
        
        if (isiDalamGelung !== "radas.cuci();radas.simpan()") {
            maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format betul -> <code>radas.cuci();radas.simpan()</code>";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Logik: Gelung sifar tidak akan membersihkan makmal.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Memulakan SOP makmal sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        let limitLoop = kaliUlang;
        if(limitLoop > 4) limitLoop = 4; 

        // Aktivkan tali latar belakang
        taliJalur.style.display = "block";

        // ==========================================
        // ANIMASI SINKRONIK (FIZIK TALI)
        // ==========================================
        for (let i = 1; i <= limitLoop; i++) {
            
            if (i > sasaranRadas) {
                teksAnimasi.innerHTML = `Status: Mencari radas ke-${i}... Tiada dijumpai.`;
                taliJalur.style.left = "75%";
                taliJalur.style.height = "40px";
                robot.style.left = "75%";
                robot.style.top = "40px";
                await tunggu(800);
                cakap("Eh, mana ada barang dah?", 2500);
                await tunggu(2500);
                continue; 
            }

            let radas = document.getElementById(`radas-${i}`);
            let posisiAsalX = 15 + ((i-1) * 20); 
            
            // FASA 1: ROBOT BERGERAK & TURUN RAPAT ATAS RADAS
            taliJalur.style.left = `${posisiAsalX}%`;
            taliJalur.style.height = "120px"; // Tali memanjang
            robot.style.left = `${posisiAsalX}%`;
            robot.style.top = "120px"; // Rapat ke atas kepala mikroskop
            teksAnimasi.innerHTML = `Status: Menghampiri radas ke-${i}...`;
            await tunggu(700);
            
            // FASA 2: PANCUT AIR (Mencuci)
            teksAnimasi.innerHTML = `Status: radas.cuci() dilaksanakan.`;
            air.classList.add("pancut-air");
            mainBunyi(sfxBetul); 
            
            await tunggu(800);
            air.classList.remove("pancut-air");
            radas.classList.add("radas-bersih"); 
            await tunggu(300);

            // FASA 3: MELURUTKAN CANGKUK 🪝 RAPAT MENINDIH RADAS
            teksAnimasi.innerHTML = `Status: Menurunkan cangkuk mekanikal...`;
            cangkuk.classList.add("keluar-cangkuk"); 
            await tunggu(400);
            
            // FASA 4: ANGKAT SERENTAK KE ATAS
            teksAnimasi.innerHTML = `Status: Mengangkat radas...`;
            taliJalur.style.height = "40px"; // Tali mengecut naik
            robot.style.top = "40px"; 
            radas.style.bottom = "190px"; // Radas diangkat rapat mengikut cangkuk
            await tunggu(700);
            
            // FASA 5: BAWA MASUK ALMARI & JEJAK LANTAI RAK
            let targetLeft = "80%"; // Posisi almari
            let targetBotRadas = 185 - ((i-1) * 85); // Lantai rak rigid (Diperkemas kordinatnya): 185, 100, 15
            let letakTopRobot = 40 + (190 - targetBotRadas); // Penyesuaian lengan automatik ikut radas

            taliJalur.style.left = targetLeft;
            taliJalur.style.height = `${letakTopRobot}px`; // Tali memanjang ikut ketinggian rak almari
            robot.style.left = targetLeft;
            robot.style.top = `${letakTopRobot}px`;
            
            radas.style.left = targetLeft;
            radas.style.bottom = `${targetBotRadas}px`;
            
            mainBunyi(sfxBetul);
            await tunggu(800);
            
            // FASA 6: LEPASKAN CANGKUK & ROBOT NAIK STANDBY
            cangkuk.classList.remove("keluar-cangkuk");
            await tunggu(400);
            
            taliJalur.style.height = "40px"; // Tali tarik balik
            robot.style.top = "40px"; // Berundur ke atas untuk clearance
            await tunggu(600);
        }

        taliJalur.style.display = "none"; // Padam jalur tali bila tamat

        // ==========================================
        // KEPUTUSAN EKSPERIMEN
        // ==========================================
        if (kaliUlang === sasaranRadas) {
            adakahTamat = true;
            robot.style.left = "15%"; 
            robot.style.top = "40px";
            
            maklumBalas.innerHTML = "Berjaya: Makmal bersih dan selamat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Cikgu Sains bangga dengan anda.`;
            
            mainBunyi(sfxMenang);
            cakap("Selesai tugasan! Semua radas bersih dan disimpan. 🤖", 3500);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 3000);

        } 
        else if (kaliUlang > sasaranRadas) {
            adakahTamat = true;
            maklumBalas.innerHTML = `Gagal: Anda menetapkan ${kaliUlang} kitaran untuk 3 radas sahaja!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Pembaziran tenaga robotik dikesan.";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🔋❌";
                document.getElementById("tajuk-kalah").innerHTML = "Membazir Tenaga!";
                document.getElementById("pesan-kalah").innerHTML = `Di atas meja hanya ada 3 buah mikroskop. Gelung anda berjalan sebanyak <strong>${kaliUlang} kali</strong> menyebabkan robot keliru mencari barang yang tiada. Jangan membazir pusingan gelung anda!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        else {
            adakahTamat = true;
            robot.style.left = "15%";
            robot.style.top = "40px";
            
            maklumBalas.innerHTML = `Gagal: Hanya ${kaliUlang} radas disimpan. Ada yang tertinggal!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Makmal belum bersih sepenuhnya.";
            mainBunyi(sfxSalah);
            
            for (let i = kaliUlang + 1; i <= sasaranRadas; i++) {
                let radasCicir = document.getElementById(`radas-${i}`);
                radasCicir.style.animation = "goyangRadas 0.5s infinite";
            }
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🔬⚠️";
                document.getElementById("tajuk-kalah").innerHTML = "Kerja Tak Siap!";
                document.getElementById("pesan-kalah").innerHTML = `Anda hanya mencuci <strong>${kaliUlang} radas</strong>. Terdapat radas kotor yang masih tertinggal di atas meja. Betulkan kuantiti *Loop* supaya selari dengan jumlah radas!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){arahan1();arahan2()}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogRobot");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }