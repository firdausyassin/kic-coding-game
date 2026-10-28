let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranLorek = 2; // 2/4 setara dengan 1/2
const totalPetak = 4;

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

async function laksanaArahanTahap4h() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let berus = document.getElementById("berus-cat");
    let labelJawapan = document.getElementById("label-jawapan");
    let simbolSama = document.getElementById("simbol-sama");
    
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

    // RegEx Tangkap Tepat: ulang(angka){blok.lorek()}
    let padananLoop = input.match(/^ulang\((\d+)\)\{blok\.lorek\(\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        
        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Geometri: Gelung sifar bermaksud tiada lorekan dibuat.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Sifar? Jimat cat betul awak ni...", 2500);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Berus bergerak untuk melorek ${kaliUlang} petak...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Had Animasi: Papan cuma ada 4 petak. Kalau budak letak 100, kita stop kat 4.
        let limitLoop = kaliUlang;
        if(limitLoop > 4) limitLoop = 4;

        cakap("Mari kita mengecat!", 1500);
        await tunggu(800);

        // ==========================================
        // ANIMASI BERUS MELOREK (LOOPING)
        // ==========================================
        for (let i = 1; i <= limitLoop; i++) {
            
            let petakTarget = document.getElementById(`petak-${i}`);
            
            // Pengiraan Koordinat CSS: 
            // Blok mula dekat 60% left dari container utama.
            // Kita anjak 10% setiap petak.
            let posisiX = 58 + (i * 7); 
            
            // Berus Terbang ke petak
            berus.style.left = `${posisiX}%`;
            berus.style.top = "90px"; 
            
            teksAnimasi.innerHTML = `Status: Melorek petak ke-${i}...`;
            await tunggu(500); // Tunggu berus sampai
            
            // Animasi Sental
            berus.classList.add("animasi-berus");
            mainBunyi(sfxBetul); 
            
            await tunggu(250); // Ngam-ngam tgh sental
            
            // Petak Bertukar Warna
            petakTarget.classList.add("lorek-aktif");
            labelJawapan.innerHTML = `${i} / 4`; // Update Teks Label atas tu
            
            await tunggu(250); 
            berus.classList.remove("animasi-berus");
            
            await tunggu(200); // Rehat kejap sebelum petak next
        }

        // Berus undur tepi sikit lepas siap
        berus.style.left = "85%";
        berus.style.top = "150px";
        await tunggu(800);

        // ==========================================
        // KEPUTUSAN EKSPERIMEN PECAHAN
        // ==========================================

        if (kaliUlang === sasaranLorek) {
            // TEPAT! (2/4)
            adakahTamat = true;
            
            simbolSama.classList.add("simbol-aktif"); // Simbol '=' warna hijau membesar
            
            maklumBalas.innerHTML = "Berjaya: Saiz kawasan lorekan adalah sepadan!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Persamaan Disahkan! 1/2 = 2/4.`;
            
            mainBunyi(sfxMenang);
            cakap("Nampak tak? Saiznya sama besar! 🎨", 3500);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } 
        else if (kaliUlang > sasaranLorek) {
            // TERLEBIH (Cth: 3/4 atau 4/4) 
            adakahTamat = true;
            
            simbolSama.innerHTML = "≠"; // Tukar simbol Tak Sama
            simbolSama.classList.add("simbol-salah");
            
            maklumBalas.innerHTML = `Gagal: Anda melorek ${kaliUlang} bahagian. Terlebih saiz!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Kawasan merah lebih besar daripada kawasan biru.";
            mainBunyi(sfxSalah);
            
            let mesejTerlebih = (kaliUlang > 4) ? `Anda mengarahkan berus melorek sebanyak ${kaliUlang} kali, padahal kotak hanya ada 4! Lebih teruk lagi, ` : "";
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "📈❌";
                document.getElementById("tajuk-kalah").innerHTML = "Pecahan Berlebihan!";
                document.getElementById("pesan-kalah").innerHTML = `${mesejTerlebih}Pecahan <strong>${limitLoop}/4</strong> tidak setara dengan 1/2 kerana kawasan lerekannya sudah melimpah dan lebih besar. Kurangkan bilangan gelung anda!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }
        else {
            // TERKURANG (Cth: 1/4)
            adakahTamat = true;
            
            simbolSama.innerHTML = "≠"; 
            simbolSama.classList.add("simbol-salah");
            
            maklumBalas.innerHTML = `Gagal: Anda hanya melorek ${kaliUlang} bahagian. Belum cukup!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Kawasan merah lebih kecil daripada kawasan biru.";
            mainBunyi(sfxSalah);
            
            cakap("Sikitnya... tak sama saiz pun.", 3000);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "📉❌";
                document.getElementById("tajuk-kalah").innerHTML = "Belum Setara!";
                document.getElementById("pesan-kalah").innerHTML = `Pecahan <strong>${kaliUlang}/4</strong> tidak setara dengan 1/2. Ruang yang dilorek terlalu kecil. Anda perlu melorek lebih banyak petak untuk menyamai saiz 1/2.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){blok.lorek()}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogBerus");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}