let adakahTamat = false;
let adakahSibuk = false;
let ketinggianSemasa = 0; 
let tinggiPokok = 10;   
let pemasaDialog;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Bunyi disekat sementara."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function laksanaArahanTahap3c() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let monyet = document.getElementById("monyet");
    let ikon = document.getElementById("ikonMonyet");
    let pisangGergasi = document.getElementById("pisang-gergasi");
    let pisangTangan = document.getElementById("pisang-tangan");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return; 

    let padananPanjat = input.match(/^monyet\.panjat\((\d+)\)$/);

    if (padananPanjat) {
        let jarakPanjat = parseInt(padananPanjat[1]);
        
        if (jarakPanjat === 0) {
            maklumBalas.innerHTML = "Ralat Logik: Monyet tidak akan bergerak jika parameter adalah 0.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Gayung pun takleh capai kalau sifar meter!", 2500);
            return;
        }

        // 🔥 HALANG PANJAT TERUS! MESTI BERPERINGKAT 🔥
        if (jarakPanjat >= tinggiPokok && ketinggianSemasa === 0) {
            maklumBalas.innerHTML = "Ralat Akademik: Anda DIWAJIBKAN memanjat secara berperingkat (contoh: 4 meter dahulu).";
            maklumBalas.style.borderLeftColor = "#f39c12";
            mainBunyi(sfxSalah);
            cakap("Gila ke panjat terus sampai atas?! Biar aku rehat kat batang pokok jap.", 3500);
            return;
        }

        adakahTamat = true; // Lock sementara 
        adakahSibuk = true;
        
        let tinggiSeterusnya = ketinggianSemasa + jarakPanjat;
        
        cakap("Uuk aak! Aku panjat " + jarakPanjat + " meter!", 2000);
        mainBunyi(sfxBetul);

        // FORMULA PIXEL: Tanah 160px. 1 Meter = 20 Pixel.
        let posisiY = 160 + (tinggiSeterusnya * 20); 
        monyet.style.bottom = `${posisiY}px`;
        
        await tunggu(800); // Masa transition CSS untuk monyet panjat sampai

        ketinggianSemasa = tinggiSeterusnya; 

        // ===================================
        // KES 1: MASIH MEMANJAT (REHAT DI DAHAN)
        // ===================================
        if (ketinggianSemasa < tinggiPokok) {
            let baki = tinggiPokok - ketinggianSemasa;
            teksAnimasi.innerHTML = `Status: Monyet berehat di ketinggian ${ketinggianSemasa} meter.`;
            
            maklumBalas.innerHTML = `Teruskan memanjat! Baki ${baki} meter lagi.`;
            maklumBalas.style.borderLeftColor = "#f39c12"; 
            
            cakap(`Fuh berpeluh! Baki ${baki} meter lagi.`, 3000);
            adakahTamat = false; // Buka balik terminal untuk sambungan input
            adakahSibuk = false;
        }
        
        // ===================================
        // KES 2: TEPAT SAMPAI KE PUNCAK (MENANG)
        // ===================================
        else if (ketinggianSemasa === tinggiPokok) {
            teksAnimasi.innerHTML = "Status: Monyet berjaya mencapai pisang!";
            maklumBalas.innerHTML = "Berjaya: Koordinat Paksi-Y dikira dengan sempurna.";
            maklumBalas.style.borderLeftColor = "#0be881";

            await tunggu(500);

            // Pisang dahan hilang, pisang tangan muncul!
            pisangGergasi.style.opacity = "0"; 
            pisangTangan.style.opacity = "1";  
            
            cakap("Yummy! Kenyang perut aku hari ni!", 5000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        
        // ===================================
        // KES 3: TERLAJAK TINGGI (JATUH TERHEMPAS)
        // ===================================
        else {
            teksAnimasi.innerHTML = "Status: Monyet terlajak panjat dan dahan patah!";
            maklumBalas.innerHTML = `Gagal: Anda merekodkan ketinggian ${ketinggianSemasa} meter. Had maksimum dahan hanya 10!`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            
            mainBunyi(sfxSalah);
            cakap("Adoiiii dahan patahhh!! Tolonggg!!", 2000);
            
            await tunggu(800);
            
            // Animasi Jatuh Pusing-Pusing ke tanah! (Muka kekal monyet biasa masa jatuh)
            monyet.classList.add("monyet-jatuh");
            monyet.style.bottom = `160px`; 
            
            // Selepas 600ms (masa landing kat tanah), baru tukar muka pening/mati
            setTimeout(() => {
                ikon.innerHTML = "😵"; 
                document.getElementById("ikon-kalah").innerHTML = "💫";
                document.getElementById("tajuk-kalah").innerHTML = "Jatuh Terhempas!";
                document.getElementById("pesan-kalah").innerHTML = `Jumlah penambahan ketinggian anda ialah ${ketinggianSemasa} meter. Ia melebihi daya tampungan pokok (10m) menyebabkan monyet jatuh berderai ke tanah!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 600);
        }

    } 
    else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>monyet.panjat(jumlah)</code>.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogMonyet");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}