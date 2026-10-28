let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranKitaran = 3;

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

async function laksanaArahanTahap4d() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let awan = document.getElementById("awan-kitaran");
    let matahari = document.getElementById("matahari");
    let pokok = document.getElementById("pokok-kitaran");
    let ikonPokok = document.getElementById("ikonPokok");
    let zonSejat = document.getElementById("zon-sejat");
    let zonHujan = document.getElementById("zon-hujan");
    let sungai = document.getElementById("sungai-air");
    
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

    // RegEx Tangkap: Memastikan ada pemisah ';' antara dua arahan
    let padananLoop = input.match(/^ulang\((\d+)\)\{(.+)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        let isiDalamGelung = padananLoop[2];

        // Validasi Ketat: Mesti guna bumi.sejat() dan awan.hujan()
        if (isiDalamGelung !== "bumi.sejat();awan.hujan()" && isiDalamGelung !== "awan.hujan();bumi.sejat()") {
            maklumBalas.innerHTML = "Ralat Sintaks Dalaman: Pastikan anda menaip dua arahan yang betul dan memisahkannya dengan koma bertitik (<code>;</code>). Contoh: <code>bumi.sejat();awan.hujan()</code>";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Gejala: Kitaran 0 bermaksud tiada perubahan cuaca akan berlaku!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Kitaran air diaktifkan sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Limit Animasi supaya tak crash kalau letak ulang(100)
        let limitLoop = kaliUlang;
        if(limitLoop > 5) limitLoop = 5;

        // ==========================================
        // ANIMASI KITARAN CUACA (LOOPING KRONOLOGI)
        // ==========================================
        for (let i = 1; i <= limitLoop; i++) {
            
            // FASA 1: PENYEJATAN DI SUNGAI
            teksAnimasi.innerHTML = `Status (Kitaran ${i}): Proses penyejatan air di sungai...`;
            matahari.style.opacity = "1";
            zonSejat.classList.add("aktif-sejat"); // Air naik dari sungai ke awan
            sungai.style.height = "100px"; // Air sungai surut sikit
            
            mainBunyi(sfxBetul);
            await tunggu(1500);
            
            // Awan membesar & gelap
            awan.classList.add("awan-gelap");
            zonSejat.classList.remove("aktif-sejat"); // Tutup sejatan
            matahari.style.opacity = "0.2";
            
            await tunggu(1000);
            
            // FASA 2: AWAN BERGERAK KE POKOK
            teksAnimasi.innerHTML = `Status (Kitaran ${i}): Awan tebal bergerak membawa air...`;
            awan.style.left = "20%"; // Awan gerak lalu tepat atas pokok
            await tunggu(1500);

            // FASA 3: HUJAN TURUN ATAS POKOK
            teksAnimasi.innerHTML = `Status (Kitaran ${i}): Awan terkondensasi, hujan turun!`;
            zonHujan.classList.add("hujan-lebat"); // Buka pili hujan 💦💦💦
            sungai.style.height = "130px"; // Air sungai naik balik perlahan
            
            mainBunyi(sfxBetul);
            await tunggu(1500); // Biar hujan turun lama sikit
            
            // FASA 4: POKOK MEMBESAR
            zonHujan.classList.remove("hujan-lebat"); // Stop hujan
            awan.classList.remove("awan-gelap"); // Awan cerah balik
            
            if (i === 1) {
                ikonPokok.innerHTML = "🌿";
                pokok.style.fontSize = "70px";
                cakap("Wah, segar sikit!", 2000);
            } else if (i === 2) {
                ikonPokok.innerHTML = "🪴";
                pokok.style.fontSize = "100px";
            } else if (i >= 3) {
                ikonPokok.innerHTML = "🌳";
                pokok.style.fontSize = "140px";
            }

            await tunggu(1000);

            // FASA 5: AWAN PULANG KE SUNGAI UNTUK NEXT LOOP
            if (i < limitLoop) {
                awan.style.left = "65%";
                await tunggu(1500); // Tunggu awan sampai sungai baru mula loop seterusnya
            }
        }

        // ==========================================
        // KEPUTUSAN EKSPERIMEN CUACA
        // ==========================================
        
        if (kaliUlang === sasaranKitaran) {
            // TEPAT! (3 Kali)
            adakahTamat = true;
            
            matahari.style.opacity = "1";
            awan.style.left = "65%"; // Awan pergi balik ke tempat asal dengan tenang
            
            maklumBalas.innerHTML = "Berjaya: Ekologi seimbang dan pokok membesar dengan sihat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Pokok matang telah terhasil.";
            
            mainBunyi(sfxMenang);
            cakap("Terima kasih hujan! Saya dah besar! 🌳", 3500);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } 
        else if (kaliUlang > sasaranKitaran) {
            // TERLEBIH (Cth: 4 atau 5) BANJIR!
            adakahTamat = true;
            
            sungai.style.height = "250px"; // Banjir naik melimpah
            pokok.style.transform = "rotate(90deg)"; // Pokok tumbang, pangkal tetap lekat
            awan.style.left = "65%";
            
            maklumBalas.innerHTML = `Gagal: Anda melakukan ${kaliUlang} kitaran berturut-turut!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Bencana Alam! Banjir besar menumbangkan pokok.";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🌊🌳🌊";
                document.getElementById("tajuk-kalah").innerHTML = "Banjir Besar!";
                document.getElementById("pesan-kalah").innerHTML = `Kitaran air sebanyak ${kaliUlang} kali yang terlalu pantas telah menyebabkan isipadu air sungai melimpah. Pokok tersebut telah lemas dan tumbang. Gunakan tepat 3 kitaran sahaja.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        else {
            // TERKURANG (Cth: 1 atau 2) KEMARAU!
            adakahTamat = true;
            
            matahari.style.opacity = "1";
            matahari.style.transform = "scale(1.5)";
            sungai.style.height = "30px"; // Sungai kering
            ikonPokok.innerHTML = "🥀"; // Pokok layu
            pokok.style.filter = "sepia(100%) hue-rotate(30deg) saturate(300%)";
            awan.style.left = "65%";
            
            maklumBalas.innerHTML = `Gagal: Pokok tidak cukup air dengan hanya ${kaliUlang} kitaran.`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Kemarau. Pokok bantut dan layu kekeringan.";
            mainBunyi(sfxSalah);
            cakap("Panasnya... air tak cukup... 🥵", 3000);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "☀️🥀";
                document.getElementById("tajuk-kalah").innerHTML = "Kemarau!";
                document.getElementById("pesan-kalah").innerHTML = `Anda hanya menjalankan kitaran air sebanyak ${kaliUlang} kali. Pokok tidak mendapat air yang mencukupi untuk membesar dan akhirnya layu. Tambahkan jumlah pengulangan!`;
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

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPokok");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}