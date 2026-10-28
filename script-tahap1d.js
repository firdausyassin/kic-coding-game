let adakahTamat = false;
let adakahSibuk = false; 

// STATE MACHINE UNTUK URUTAN
let minyakPenuh = false;
let angkasawanDalam = false;
let pemasaDialog;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara oleh browser."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function laksanaArahanTahap1d() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let w_angkasawan = document.getElementById("angkasawan");
    let w_roket = document.getElementById("roket-kapal");
    let api = document.getElementById("api-enjin");
    let asap = document.getElementById("asap-enjin");
    let boom = document.getElementById("boom-impak");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return; 

    // ==========================================
    // ARAHAN 1: ISI MINYAK
    // ==========================================
    if (input === "roket.isi_minyak()") {
        
        if (angkasawanDalam) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Urutan: Angkasawan dah masuk roket. Siapa nak tolong cabut pam minyak kat luar tu?!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            adakahTamat = true;
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🤦‍♂️";
                document.getElementById("tajuk-kalah").innerHTML = "Tersekat!";
                document.getElementById("pesan-kalah").innerHTML = "Angkasawan terperangkap di dalam roket kerana tidak mengisi bahan api terlebih dahulu sebelum memanjat masuk.";
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
            return;
        }

        if (minyakPenuh) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Sistem: Minyak dah penuh lah komander!";
            maklumBalas.style.borderLeftColor = "#f39c12";
            cakap("Dah melimpah minyak tu!", 2000);
            return;
        }

        adakahSibuk = true;
        minyakPenuh = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Berjaya: Tangki roket kini diisi penuh!";
        maklumBalas.style.borderLeftColor = "#0be881";
        teksAnimasi.innerHTML = "Status: Minyak 100%. Sedia untuk dinaiki.";
        
        w_angkasawan.style.left = "38%"; // Jalan gi pam minyak
        await tunggu(1000);
        cakap("Glup.. Glup.. Minyak penuh!", 2000);
        await tunggu(1000);
        
        adakahSibuk = false;
    }
    // ==========================================
    // ARAHAN 2: MASUK ROKET
    // ==========================================
    else if (input === "angkasawan.masuk()") {
        
        if (angkasawanDalam) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Logik: Angkasawan memang dah ada dekat dalam!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            return;
        }

        adakahSibuk = true;
        angkasawanDalam = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Berjaya: Angkasawan mula memanjat masuk ke kokpit roket.";
        maklumBalas.style.borderLeftColor = "#0be881";
        teksAnimasi.innerHTML = "Status: Angkasawan di dalam roket. Sedia untuk pelancaran.";
        
        w_angkasawan.classList.remove("jalan-kanan"); 
        w_angkasawan.style.left = "65%"; // Jalan pergi roket
        
        await tunggu(1000);
        w_angkasawan.style.opacity = "0"; // Hilang masuk dlm roket
        mainBunyi(sfxBetul);
        w_roket.classList.add("gegar-roket"); // Roket bergoyang sikit angkasawan pijak
        
        await tunggu(500);
        w_roket.classList.remove("gegar-roket");
        
        adakahSibuk = false;
    }
    // ==========================================
    // ARAHAN 3: LANCAR ROKET
    // ==========================================
    else if (input === "roket.lancar()") {
        
        adakahSibuk = true;
        adakahTamat = true;

        // KES KALAH 1: TERUS LANCAR TAPI MINYAK KOSONG
        if (!minyakPenuh) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "RALAT MAUT: Roket dilancarkan tanpa bahan api! Enjin gagal berfungsi!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: BAHAYA! Kerosakan sistem enjin teruk!";
            
            // Gegar dan keluarkan Asap (💨) di hujung ekor (kini kedudukan tepat)
            w_roket.classList.add("gegar-roket");
            asap.style.opacity = "1";
            await tunggu(1000);
            
            w_roket.classList.remove("gegar-roket");
            asap.style.opacity = "0";
            boom.classList.add("skala-boom");
            mainBunyi(sfxSalah);
            w_roket.innerHTML = "💀";
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "💥";
                document.getElementById("tajuk-kalah").innerHTML = "Roket Meletup!";
                document.getElementById("pesan-kalah").innerHTML = "Anda cuba melancarkan roket dengan tangki kosong. Ketiadaan bahan api menyebabkan geseran melampau dan memusnahkan enjin.";
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
            return;
        }

        // KES KALAH 2: MINYAK DAH ISI, TAPI ANGKASAWAN LUPA MASUK! 😂
        if (!angkasawanDalam) {
            mainBunyi(sfxBetul); // Bunyi pelancaran berjaya, tapi...
            maklumBalas.innerHTML = "RALAT LOGIK: Roket berjaya dilancarkan. Tetapi ke mana angkasawan kita?!";
            maklumBalas.style.borderLeftColor = "#f39c12";
            teksAnimasi.innerHTML = "Status: Roket berlepas cemerlang... sebagai roket tanpa pemandu.";
            
            // Proses berlepas (Api berada tepat di ekor)
            api.style.opacity = "1";
            w_roket.classList.add("gegar-roket");
            
            await tunggu(1000);
            w_roket.classList.remove("gegar-roket");
            api.style.opacity = "0"; // Api ignition padam
            w_roket.classList.add("roket-terbang"); // Roket melilau naik
            
            await tunggu(1000);
            w_angkasawan.classList.remove("jalan-kanan"); 
            cakap("Woi!!! Aku tertinggal kat bumi gila!!! 😭", 5000);
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "😭🚀";
                document.getElementById("tajuk-kalah").innerHTML = "Tertinggal Di Bumi!";
                document.getElementById("pesan-kalah").innerHTML = "Anda terlupa menyuruh angkasawan masuk. Akibatnya roket berlepas dan meninggalkan angkasawan kita menangis keseorangan di bumi.";
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
            return;
        }

        // KES MENANG: SEMUA URUTAN TEPAT (Isi Minyak -> Masuk -> Lancar)
        mainBunyi(sfxBetul);
        maklumBalas.innerHTML = "BERJAYA: Pencucuhan enjin dimulakan. Berlepas dalam 3... 2... 1...";
        maklumBalas.style.borderLeftColor = "#0be881";
        teksAnimasi.innerHTML = "Status: Roket sedang meluncur laju ke angkasa lepas!";
        
        // Fasa 1: Ignition (Api menyala tepat di ekor, roket gegar)
        api.style.opacity = "1";
        w_roket.classList.add("gegar-roket");
        
        await tunggu(1000);
        
        // Fasa 2: Berlepas Melilau (Api ignition padam, roket zig-zag naik)
        w_roket.classList.remove("gegar-roket");
        api.style.opacity = "0"; 
        w_roket.classList.add("roket-terbang"); 
        
        await tunggu(2500);
        let menangSfx = document.getElementById("bunyiMenang");
        mainBunyi(menangSfx);
        document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
        
    } 
    else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan ejaan kod sepadan dengan senarai operasi.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogAngkasawan");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
        }, masa);
    }
}