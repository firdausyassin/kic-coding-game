let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

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

window.onload = function() {
    // Tunjuk dialog awal
    setTimeout(() => { cakap("Gelapnya! Tak nampak jalan!", 3000); }, 500);
}

async function laksanaArahanTahap5c() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let peneroka = document.getElementById("kotak-peneroka");
    let ikonPeneroka = document.getElementById("ikonPeneroka");
    let suar = document.getElementById("suar-tangan");
    let gelap = document.getElementById("kegelapan-overlay");
    let pening = document.getElementById("efek-langgar");
    let awanDialog = document.getElementById("dialogPeneroka");
    
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

    // RegEx Tangkap: if(ruang=="gelap"){pasang("suar")}
    let padananIf = input.match(/^if\(ruang==\"([a-z]+)\"\)\{pasang\(\"([a-z_]+)\"\)\}$/);

    if (padananIf) {
        let keadaanDitaip = padananIf[1]; 
        let objekDitaip = padananIf[2];   

        adakahSibuk = true;

        if (keadaanDitaip === "gelap" && objekDitaip === "suar") {
            
            // KEPUTUSAN TEPAT: Pasang Suar!
            maklumBalas.innerHTML = "Sistem: Logik diterima! Menyalakan sumber cahaya.";
            maklumBalas.style.borderLeftColor = "#f1c40f";
            teksAnimasi.innerHTML = "Status: Memasang suar cahaya...";
            
            cakap("Cucuh suar... Zap! 🧨", 2000);
            await tunggu(1000);
            
            // Fasa 1: Suar menyala & gua cerah
            suar.classList.add("suar-menyala");
            mainBunyi(sfxBetul);
            await tunggu(500);
            
            gelap.classList.add("gua-cerah");
            teksAnimasi.innerHTML = "Status: Gua telah diterangi cahaya. Selamat berjalan.";
            await tunggu(1500);

            // Fasa 2: Peneroka berjalan ke harta karun dengan selamat (elak batu sikit)
            cakap("Wah! Ada harta karun kat depan tu!", 3000);
            peneroka.style.left = "30%"; // Jalan sikit
            await tunggu(800);
            
            peneroka.style.bottom = "120px"; // Melangkah naik sikit elak batu
            await tunggu(300);
            peneroka.style.left = "65%"; // Terus ke harta karun
            await tunggu(700);
            peneroka.style.bottom = "90px"; // Turun balik
            await tunggu(500);

            adakahTamat = true;
            awanDialog.classList.add("dialog-kiri"); 
            cakap("Alhamdulillah kaya aku hari ni! 💎", 4000);
            
            maklumBalas.innerHTML = "Berjaya: Anda mengaplikasikan fungsi cahaya dengan cemerlang!";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } else {
            // SYARAT ATAU TINDAKAN SALAH (Buta dalam gelap)
            adakahTamat = true;
            maklumBalas.innerHTML = "Gagal: Syarat tidak tepat! Meneruskan perjalanan tanpa cahaya.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Berjalan membabi buta...";
            
            if(keadaanDitaip !== "gelap") {
                cakap("Gua ni mana ada terang! Aku main redah je la!", 2500);
            } else {
                cakap(`Pasang ${objekDitaip}? Mana boleh kasi terang! Redah je la!`, 2500);
            }
            
            await tunggu(1500);

            // Fasa 1: Jalan buta dan langgar batu
            peneroka.style.left = "35%"; // Kordinat batu penghalang
            await tunggu(1000);
            
            // Fasa 2: Terlanggar!
            mainBunyi(sfxSalah);
            ikonPeneroka.innerHTML = "😵";
            peneroka.style.bottom = "80px"; // Tergolek sikit
            pening.classList.add("pening-langgar");
            
            cakap("Aduhh! Berdarah kepala aku langgar batu! 😭", 4000);
            teksAnimasi.innerHTML = "Status: KEMALANGAN! PENEROKA CEDERA!";

            // Kesalahan Spesifik
            let mesejRalat = "";
            if (keadaanDitaip !== "gelap") {
                mesejRalat = `Anda meletakkan syarat <strong>ruang == "${keadaanDitaip}"</strong> padahal jelas gua ini sangat gelap! Akibatnya, arahan pasang suar tidak terbaca oleh sistem.`;
            } else {
                mesejRalat = `Memang betul ruang ini gelap, tetapi anda mengarahkan peneroka untuk memasang <strong>"${objekDitaip}"</strong> yang sama sekali bukan sumber cahaya! Sepatutnya anda menggunakan "suar".`;
            }

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🤕🪨";
                document.getElementById("tajuk-kalah").innerHTML = "Berjalan Dalam Gelap!";
                document.getElementById("pesan-kalah").innerHTML = `Mengikut Sains Tahun 2, kita memerlukan cahaya untuk melihat. ${mesejRalat} Peneroka telah terlanggar batu pejal.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Sila ikut format -> <code>if(ruang==\"gelap\"){pasang(\"suar\")}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPeneroka");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}