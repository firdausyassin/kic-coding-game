let adakahTamat = false;
let adakahSibuk = false;

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

async function laksanaArahanTahap1g() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Pemasangan telah selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Check untuk pastikan budak letak quotes ""
    let padananSintaks = input.match(/^robot\.cop\((["'])([a-z]+)\1\)$/);
    
    // Kalau salah tak letak petik, tegur
    let cekTanpaQuotes = input.match(/^robot\.cop\(([a-z]+)\)$/);
    if (cekTanpaQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Parameter jenis huruf mestilah dikurung dengan tanda petik <code>" "</code>!`);
        return;
    }

    if (padananSintaks) {
        let bentukDipilih = padananSintaks[2]; // bentuk yang ditaip

        adakahSibuk = true;
        let emojiBentuk = "";
        
        // Tentukan emoji ikut teks
        if (bentukDipilih === "segiempat") emojiBentuk = "🟦";
        else if (bentukDipilih === "segitiga") emojiBentuk = "🔺";
        else if (bentukDipilih === "bulat") emojiBentuk = "🔴";
        else {
            paparRalatPantas(sfxSalah, `Ralat Pangkalan Data: Bentuk "${bentukDipilih}" tidak wujud di kilang ini! Pilih segiempat, segitiga, atau bulat.`);
            adakahSibuk = false;
            return;
        }

        maklumBalas.innerHTML = `Mengaktifkan hidraulik robot untuk mengecap ${bentukDipilih}...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = "Status: Lengan robot digerakkan...";

        // ELEMEN ANIMASI
        let robotLengan = document.getElementById("robot-lengan");
        let copBentuk = document.getElementById("bentuk-cop");
        let sasaranLubang = document.getElementById("lubang-bentuk");
        let spark = document.getElementById("efek-spark");

        // 1. Load bentuk kat kepala robot
        copBentuk.innerHTML = emojiBentuk;
        copBentuk.style.opacity = "1";
        
        await tunggu(400);

        // 2. Robot turun laju ke bawah (cop)
        robotLengan.style.height = "250px"; 
        
        await tunggu(500); // Masa untuk lengan sampai bawah
        
        // Letupan spark masa bersentuh
        spark.classList.add("meletup-spark");
        
        // JAWAPAN TEPAT (Segiempat)
        if (bentukDipilih === "segiempat") {
            mainBunyi(sfxBetul);
            
            // Bentuk pindah masuk lubang (warna warni sikit)
            sasaranLubang.innerHTML = "🟦";
            sasaranLubang.style.color = "#fff"; // Buang bayang gelap
            sasaranLubang.style.filter = "drop-shadow(0 0 10px #3498db)";
            
            await tunggu(200);
            spark.classList.remove("meletup-spark");
            
            // 3. Robot tarik lengan naik balik
            copBentuk.style.opacity = "0"; // Hilangkan cop dari lengan
            robotLengan.style.height = "120px";
            
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Padanan geometri tepat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Sistem pengesahan geometri berjaya!";
            
            // Hentikan tali sawat
            document.getElementById("conveyor").style.animationPlayState = "paused";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // JAWAPAN SALAH BENTUK
        else {
            mainBunyi(document.getElementById("bunyiSalah"));
            
            await tunggu(200);
            spark.classList.remove("meletup-spark");
            
            // Robot tarik lengan balik bawa bentuk tu sekali
            robotLengan.style.height = "120px";
            
            paparRalatKalah("Bentuk Tersekat!", `Komponen memerlukan bentuk "segiempat" untuk berfungsi. Bentuk "${bentukDipilih}" tidak boleh dimasukkan!`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>robot.cop(\"bentuk\")</code>.");
    }

    document.getElementById("arahanInput").value = "";
}

function paparRalatPantas(sfx, mesej) {
    mainBunyi(sfx);
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.style.borderLeftColor = "#ff5e57";
    maklumBalas.innerHTML = mesej;
}

function paparRalatKalah(tajuk, mesej) {
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";
    document.getElementById("teksAnimasi").innerHTML = "Status: Proses ditolak.";
    
    // Conveyor berenti sebab ralat
    document.getElementById("conveyor").style.animationPlayState = "paused";

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🚫⚙️";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1200);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }