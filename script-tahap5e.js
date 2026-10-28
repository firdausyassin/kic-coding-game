let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

// Pangkalan Data Kimia
const senaraiUjian = [
    { warna: "merah", hasil: "asid", kelasCSS: "litmus-merah", teksCSS: "merah-teks" },
    { warna: "biru", hasil: "alkali", kelasCSS: "litmus-biru", teksCSS: "biru-teks" }
];

// Pilih Hasil Rawak Secara Automatik
const sasaran = senaraiUjian[Math.floor(Math.random() * senaraiUjian.length)];

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

window.onload = async function() {
    let lengan = document.getElementById("lengan-robot");
    let litmus = document.getElementById("kertas-litmus");
    let skrinWarna = document.getElementById("warna-dikesan");
    let teksAnimasi = document.getElementById("teksAnimasi");

    // Tunjuk dialog awal
    setTimeout(() => { 
        cakap(`Mari kita uji cecair ini. Perhatikan perubahan warnanya!`, 4000); 
    }, 500);

    await tunggu(2000); // Tunggu kejap lepas dialog
    
    // Fasa 1: Lengan turun celup cecair
    lengan.classList.add("celup-kertas");
    
    // Fasa 2: Kertas Litmus bertukar warna (CSS transition 1s delay)
    litmus.classList.add(sasaran.kelasCSS);
    
    await tunggu(2500); // Tunggu proses celup & tukar warna selesai

    // Fasa 3: Lengan naik semula
    lengan.classList.remove("celup-kertas");
    await tunggu(1000);

    // Fasa 4: Update Skrin & Status Box
    skrinWarna.innerHTML = sasaran.warna.toUpperCase();
    skrinWarna.classList.add(sasaran.teksCSS);
    
    teksAnimasi.innerHTML = `Status: Menunggu pengesahan untuk warna kertas ${sasaran.warna.toUpperCase()}...`;
    
    cakap(`Kertas dah tukar warna ${sasaran.warna}! Taipkan kod pengesahan sekarang.`, 5000);
}

async function laksanaArahanTahap5e() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let saintis = document.getElementById("kotak-saintis");
    let ikonSaintis = document.getElementById("ikonSaintis");
    let cecair = document.getElementById("cecair");
    
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

    // RegEx Tangkap: if(kertas=="warna"){sahkan("hasil")}
    let padananIf = input.match(/^if\(kertas=="([a-z]+)"\)\{sahkan\("([a-z]+)"\)\}$/);

    if (padananIf) {
        let warnaDitaip = padananIf[1]; 
        let jenisDitaip = padananIf[2];

        adakahSibuk = true;

        // SEMAKAN KEMENANGAN (Warna Tepat & Hasil Kimia Tepat)
        if (warnaDitaip === sasaran.warna && jenisDitaip === sasaran.hasil) {
            
            // KEPUTUSAN TEPAT
            maklumBalas.innerHTML = "Sistem: Logik kimia disahkan! Keputusan direkodkan.";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Laporan Ujian ${sasaran.hasil.toUpperCase()} diluluskan.`;
            teksAnimasi.style.borderColor = "#0be881";
            
            mainBunyi(sfxBetul);
            
            // Fasa 1: Cecair bercahaya (Glitch effect glow)
            if(sasaran.hasil === "asid") { cecair.classList.add("cecair-asid"); } 
            else { cecair.classList.add("cecair-alkali"); }
            
            await tunggu(1000);
            
            // Fasa 2: Saintis happy
            ikonSaintis.innerHTML = "🤩"; 
            saintis.style.transition = "transform 0.3s ease-out";
            saintis.style.transform = "translateY(-30px)"; // Lompat sikit
            await tunggu(300);
            saintis.style.transform = "translateY(0)";
            
            cakap(`Tepat sekali! Formula kimia itu memang sifatnya ${sasaran.hasil}! 🔬`, 4000);

            adakahTamat = true;
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } else {
            // SALAH SATU FAKTA KIMIA GAGAL
            adakahTamat = true;
            maklumBalas.innerHTML = "Gagal: Laporan ralat! Kesilapan fakta sains dikesan.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Ujian Gagal. Penolakan data makmal.";
            teksAnimasi.style.borderColor = "#ff5e57";
            
            mainBunyi(sfxSalah);

            // Analisis apa yang budak tu salah tulis
            let mesejRalat = "";
            if (warnaDitaip !== sasaran.warna) {
                mesejRalat = `Mesin mengesan warna <strong>${sasaran.warna}</strong>, tetapi anda menaip warna <strong>"${warnaDitaip}"</strong> pada syarat IF.`;
            } else if (jenisDitaip !== sasaran.hasil) {
                mesejRalat = `Syarat warna anda betul (${sasaran.warna}), tetapi anda mengesahkan cecair ini sebagai <strong>"${jenisDitaip}"</strong>. Ingat, warna ${sasaran.warna} bermaksud ia adalah <strong>${sasaran.hasil}</strong>!`;
            }

            ikonSaintis.innerHTML = "🤦‍♂️"; // Tepuk dahi
            cakap(`Aduh, salah fakta sains tu! Bahaya kalau tersalah lapor!`, 4000);

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🧪❌";
                document.getElementById("tajuk-kalah").innerHTML = "Ralat Fakta Sains!";
                document.getElementById("pesan-kalah").innerHTML = `${mesejRalat} Sila semak semula nota panduan litmus anda.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>if(kertas==\"merah\"){sahkan(\"asid\")}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogSaintis");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}