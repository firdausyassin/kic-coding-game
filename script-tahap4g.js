let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranHaiwan = 5;

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

async function laksanaArahanTahap4g() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let paip = document.getElementById("paip-makanan");
    let objekMakanan = document.getElementById("makanan-objek");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi zoo tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    // RegEx Tangkap: Kalau letak tanpa tanda petik
    let cekTinggalQuotes = input.match(/^ulang\(\d+\)\{karnivor\.makan\(([a-z]+)\)\}$/);
    if (cekTinggalQuotes) {
        maklumBalas.innerHTML = `Ralat Pembolehubah: Makanan adalah bentuk teks (String). Gunakan tanda petik <code>" "</code>!`;
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    // RegEx Tangkap Tepat: ulang(angka){karnivor.makan("teks")}
    let padananLoop = input.match(/^ulang\((\d+)\)\{karnivor\.makan\((["'])([a-z]+)\2\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        let jenisMakanan = padananLoop[3];
        
        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Logik: Gelung sifar tidak akan memberi sebarang makanan.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Mesin digerakkan untuk melepaskan "${jenisMakanan}" sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Tentukan emoji makanan berdasarkan input
        let emojiMakanan = "❓";
        if (jenisMakanan === "daging") emojiMakanan = "🥩";
        else if (jenisMakanan === "sayur") emojiMakanan = "🥬";
        else if (jenisMakanan === "buah") emojiMakanan = "🍎";
        else emojiMakanan = "🪨"; // Makanan merepek jadi batu

        objekMakanan.innerHTML = emojiMakanan;

        // Limit Animasi supaya tak keluar beratus kali
        let limitLoop = kaliUlang;
        if(limitLoop > 7) limitLoop = 7; 

        // ==========================================
        // ANIMASI MESIN SUAP MAKANAN
        // ==========================================
        for (let i = 1; i <= limitLoop; i++) {
            
            // Paip bergerak ke posisi haiwan (10%, 30%, 50%, 70%, 90%)
            let posisiPaip = -10 + (i * 20); 
            if (posisiPaip > 90) posisiPaip = 90; // Had maksimum gerak paip
            
            paip.style.left = `${posisiPaip}%`;
            teksAnimasi.innerHTML = `Status: Mesin bergerak ke kandang ${i}...`;
            
            await tunggu(600); // Masa mesin gerak
            
            // Jatuhkan makanan
            objekMakanan.classList.add("sedang-jatuh");
            mainBunyi(sfxBetul); 
            
            await tunggu(400); 

            // Haiwan react kalau i wujud (1 hingga 5 shj)
            if (i <= sasaranHaiwan) {
                let haiwan = document.getElementById(`haiwan-${i}`);
                let ikon = document.getElementById(`ikon-${i}`);
                
                if (jenisMakanan === "daging") {
                    ikon.innerHTML = "🍖"; // Tgh ngunyah
                    setTimeout(() => { ikon.innerHTML = "💤"; }, 1000); // Kenyang tidur
                } else {
                    haiwan.classList.add("haiwan-marah");
                    ikon.innerHTML = "😾"; // Kucing/Harimau marah
                    cakap(`dialog-${i}`, "Wek! Tak sedap!", 1500);
                }
            }

            objekMakanan.classList.remove("sedang-jatuh");
            await tunggu(200); 
        }

        await tunggu(1000);

        // ==========================================
        // KEPUTUSAN EKSPERIMEN SAINS
        // ==========================================

        if (jenisMakanan !== "daging") {
            // SALAH MAKANAN! MARAH!
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Anda menyuapkan ${jenisMakanan} kepada Karnivor!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: AMARAN! Harimau mengamuk sebab salah diet!";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "😾🥬";
                document.getElementById("tajuk-kalah").innerHTML = "Diet Terpesong!";
                document.getElementById("pesan-kalah").innerHTML = `Fakta Sains: Karnivor secara semula jadi hanya memakan <strong>Daging</strong>. Arahan anda menyuapkan "${jenisMakanan}" telah menyebabkan harimau marah dan menolak makanan tersebut!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
            
        }
        else if (kaliUlang === sasaranHaiwan && jenisMakanan === "daging") {
            // TEPAT! (5 kali, daging)
            adakahTamat = true;
            paip.style.left = "10%"; // Paip balik tempat asal
            
            maklumBalas.innerHTML = "Berjaya: Gelung diet karnivor dipenuhi!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Kesemua 5 harimau telah kenyang.`;
            
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2000);

        } 
        else if (kaliUlang > sasaranHaiwan) {
            // TERLAJAK (> 5) 
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Mesin menjatuhkan ${kaliUlang} ketul daging, tetapi harimau hanya ada 5!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Pembaziran makanan berlaku di dalam sangkar.";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🥩🗑️";
                document.getElementById("tajuk-kalah").innerHTML = "Membazir Makanan!";
                document.getElementById("pesan-kalah").innerHTML = `Kandang ini hanya menempatkan 5 ekor haiwan. Gelung anda berjalan sebanyak <strong>${kaliUlang} kali</strong>, menyebabkan lebihan daging jatuh ke atas tanah dan membazir.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        else {
            // TERKURANG (< 5)
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Hanya ${kaliUlang} ekor diberi makan. Yang lain kelaparan!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Sebahagian harimau masih lapar dan mula bising.";
            mainBunyi(sfxSalah);
            
            // Buat yang tak dapat makan tu marah
            for (let i = kaliUlang + 1; i <= sasaranHaiwan; i++) {
                document.getElementById(`haiwan-${i}`).classList.add("haiwan-marah");
                cakap(`dialog-${i}`, "Grrr! Mana aku punya?!", 2000);
            }
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐅❓";
                document.getElementById("tajuk-kalah").innerHTML = "Agihan Tidak Cukup!";
                document.getElementById("pesan-kalah").innerHTML = `Anda hanya menjalankan loop sebanyak <strong>${kaliUlang} kali</strong>. Harimau yang tidak menerima makanan kini kelaparan dan marah. Betulkan kuantiti *Loop* anda kepada 5!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){karnivor.makan(\"makanan\")}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(idDialog, mesej, masa) {
    let kotakDialog = document.getElementById(idDialog);
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}