let adakahTamat = false;
let adakahSibuk = false;
let ketinggianSemasa = 10; 
let sasaranTanah = 0;   
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

async function laksanaArahanTahap3d() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kotakMonyetUtama = document.getElementById("kotak-monyet-utama");
    let monyet = document.getElementById("monyet");
    let ikon = document.getElementById("ikonMonyet");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    let padananTurun = input.match(/^monyet\.turun\((\d+)\)$/);

    if (padananTurun) {
        let jarakTurun = parseInt(padananTurun[1]);
        
        if (jarakTurun === 0) {
            maklumBalas.innerHTML = "Ralat Logik: Monyet terlalu takut untuk bergerak 0 meter!";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            mainBunyi(sfxSalah);
            cakap("Sifar meter?! Kau nak suruh aku kena makan ke?!", 3000);
            return;
        }

        adakahTamat = true; // Kunci terminal sementara
        adakahSibuk = true;
        
        // PENGIRAAN PENOLAKAN
        ketinggianSemasa = ketinggianSemasa - jarakTurun;

        cakap("Uuk aak! Turun " + jarakTurun + " meter!", 2000);
        mainBunyi(sfxBetul);

        // FORMULA PIXEL: Tanah = 100px. 1 Meter = 30 Pixel. 
        let posisiY = 100 + (ketinggianSemasa * 30); 
        
        // Hadkan posisi jatuh supaya tak tembus bawah skrin sangat
        let targetY = posisiY < 50 ? 50 : posisiY; 
        
        kotakMonyetUtama.style.bottom = `${targetY}px`;

        await tunggu(800); // Masa animasi monyet melorot turun dahan

        // ===================================
        // KES 1: MASIH DI ATAS POKOK
        // ===================================
        if (ketinggianSemasa > sasaranTanah) {
            teksAnimasi.innerHTML = `Status: Monyet berada di ketinggian ${ketinggianSemasa} meter.`;
            maklumBalas.innerHTML = `Ular semakin hampir! Baki ${ketinggianSemasa} meter lagi untuk selamat ke tanah.`;
            maklumBalas.style.borderLeftColor = "#f39c12"; 
            
            cakap(`Aak aak! Cepat, lagi ${ketinggianSemasa} meter!`, 3000);
            
            adakahTamat = false; // Buka terminal untuk taip kod seterusnya
            adakahSibuk = false;
        }
        
        // ===================================
        // KES 2: TEPAT SAMPAI TANAH (MENANG)
        // ===================================
        else if (ketinggianSemasa === sasaranTanah) {
            teksAnimasi.innerHTML = "Status: Monyet selamat mendarat di atas tanah!";
            maklumBalas.innerHTML = "Berjaya: Logik penolakan matematik dieksekusi dengan sempurna.";
            maklumBalas.style.borderLeftColor = "#0be881";
            
            await tunggu(500); // Monyet tarik nafas kejap kat tanah

            // Animasi lari berdesup ke KIRI skrin
            ikon.innerHTML = "🐒💨"; 
            kotakMonyetUtama.style.transform = "translateX(calc(-50% - 250px))"; // Lari laju ke kiri
            
            cakap("Lariii! Selamat tinggal ular!", 4000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        
        // ===================================
        // KES 3: TERLAJAK TURUN (TERHEMPAS BAWAH TANAH)
        // ===================================
        else {
            kotakMonyetUtama.style.bottom = `100px`; // Ditarik balik ke level tanah keras
            
            setTimeout(() => {
                ikon.innerHTML = "🐒😵"; 
                monyet.classList.add("monyet-pening"); // Monyet terlipat pening
                kotakMonyetUtama.style.transform = "translateX(calc(-50% - 40px))"; // Terpelanting tepi batang sikit
                
                teksAnimasi.innerHTML = "Status: Monyet terhempas akibat salah kira!";
                maklumBalas.innerHTML = `Gagal: Nilai penolakan melanggar lantai graviti (${ketinggianSemasa} meter).`;
                maklumBalas.style.borderLeftColor = "#e74c3c";
                
                // Ubah kedudukan awan dialog sebab monyet dah landing tergolek
                document.getElementById("dialogMonyet").style.bottom = "80px"; 
                
                cakap("Adoiii, berderai tulang aku jatuh laju sangat!", 5000);
                mainBunyi(sfxSalah);
                
                setTimeout(() => {
                    document.getElementById("ikon-kalah").innerHTML = "💥";
                    document.getElementById("tajuk-kalah").innerHTML = "Terhempas Jatuh!";
                    document.getElementById("pesan-kalah").innerHTML = `Anda menolak melebihi baki yang ada, menjadikan baki meter negatif (${ketinggianSemasa}m). Kesannya monyet meluncur jatuh tanpa brek dan terhempas ke bumi!`;
                    document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                }, 2500);

            }, 200); // Hentakan cepat kat lantai
        }
        
    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>monyet.turun(jumlah)</code>.";
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
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
        }, masa);
    }
}