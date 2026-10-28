// MEMORI SISTEM TAHAP 3B (Matematik Terkumpul)
let adakahTamat = false;
let adakahSibuk = false;
let kedudukanSemasa = 0; 
let jumlahSasaran = 5;   

// KOORDINAT PIXEL BARU (Ngam dengan kedudukan 3A)
const posLompat = [
    { bottom: "160px", left: "3%" },   // Pos 0: Tebing Kiri (Mula)
    { bottom: "110px", left: "19%" },  // Pos 1: Pijak Buaya 1
    { bottom: "110px", left: "31%" },  // Pos 2: Pijak Buaya 2
    { bottom: "110px", left: "43%" },  // Pos 3: Pijak Buaya 3
    { bottom: "110px", left: "55%" },  // Pos 4: Pijak Buaya 4
    { bottom: "160px", left: "75%" },  // Pos 5: Pulau Tengah (Menang)
    { bottom: "50px",  left: "93%" }   // Pos 6: Jatuh Sungai Kanan (Terlajak Kalah)
];

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

async function laksanaArahanTahap3b() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let rusa = document.getElementById("rusa");
    let ikon = document.getElementById("ikonRusa");
    let epalAtasPokok = document.getElementById("epal");
    let buayaRahsia = document.getElementById("buaya-rahsia");
    
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

    let padananLompat = input.match(/^rusa\.lompat\((\d+)\)$/);

    if (padananLompat) {
        let jumlahLompatan = parseInt(padananLompat[1]);
        
        if (jumlahLompatan === 0) {
            maklumBalas.innerHTML = "Ralat: Tiada pergerakan jika nombor parameter adalah 0.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            mainBunyi(sfxSalah);
            cakap("Jalan setempat je ke macam mana ni?", 2500);
            return;
        }

        // Halang budak lompat terus 5 dari tebing awal
        if (jumlahLompatan >= jumlahSasaran && kedudukanSemasa === 0) {
            maklumBalas.innerHTML = "Ralat Arahan: Anda diwajibkan melompat secara berperingkat (contoh: 2 langkah dahulu).";
            maklumBalas.style.borderLeftColor = "#f39c12";
            mainBunyi(sfxSalah);
            cakap("Jauh sangat nak lompat terus! Suruh aku rehat atas buaya dulu.", 3500);
            return;
        }

        adakahSibuk = true; 
        mainBunyi(sfxBetul);
        
        // PENGIRAAN MATEMATIK KUMULATIF
        let posisiSeterusnya = kedudukanSemasa + jumlahLompatan;
        
        maklumBalas.innerHTML = `Sistem: Melompat dari posisi ${kedudukanSemasa} ke posisi ${posisiSeterusnya}...`;
        maklumBalas.style.borderLeftColor = "#3498db";
        cakap("Hup! Aku lompat " + jumlahLompatan + " langkah!", 2000);

        // Pastikan Rusa tak bergerak melepasi index array terakhir (6)
        let targetIndex = Math.min(posisiSeterusnya, 6);

        // 🔥 ANIMASI LOMPAT PARABOLIK 🔥
        rusa.style.left = posLompat[targetIndex].left;
        rusa.style.bottom = posLompat[targetIndex].bottom;
        rusa.classList.add("lompatan-arc"); 
        
        await tunggu(800); 
        rusa.classList.remove("lompatan-arc");

        // ===================================
        // KES 1: BERHENTI REHAT DI ATAS BUAYA
        // ===================================
        if (posisiSeterusnya < jumlahSasaran) {
            kedudukanSemasa = posisiSeterusnya; // Simpan memori kedudukan baru
            let baki = jumlahSasaran - kedudukanSemasa;
            
            teksAnimasi.innerHTML = `Status: Rusa berehat di atas buaya ke-${kedudukanSemasa}.`;
            maklumBalas.innerHTML = `Perjalanan belum selesai! Sila tambah baki ${baki} langkah lagi.`;
            maklumBalas.style.borderLeftColor = "#f39c12"; 
            
            cakap(`Fuh! Baki lagi ${baki} langkah nak sampai.`, 3000);
            adakahSibuk = false; // Buka balik terminal untuk taip sambungan
        }
        
        // ===================================
        // KES 2: TEPAT SAMPAI KE PULAU (MENANG)
        // ===================================
        else if (posisiSeterusnya === jumlahSasaran) {
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Rusa berjaya mendarat di pulau dengan selamat!";
            maklumBalas.innerHTML = "Berjaya: Formula matematik terkumpul dieksekusi dengan sempurna.";
            maklumBalas.style.borderLeftColor = "#0be881";
            
            await tunggu(500);

            // Epal jatuh ke Rusa!
            epalAtasPokok.style.bottom = "180px"; 
            epalAtasPokok.style.left = "78%"; 
            
            await tunggu(500);
            
            epalAtasPokok.style.opacity = "0"; 
            ikon.innerHTML = "🦌🍎"; 
            cakap("Alhamdulillah... Kenyang makan epal!", 5000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        
        // ===================================
        // KES 3: TERLAJAK DAN JATUH SUNGAI KEDUA
        // ===================================
        else {
            adakahTamat = true;
            rusa.classList.add("jatuh-air"); 
            
            ikon.innerHTML = "😵"; 
            teksAnimasi.innerHTML = "Status: Jumlah kumulatif terlajak! Rusa terjatuh ke sungai belakang!";
            maklumBalas.innerHTML = `Gagal: Anda merekodkan ${posisiSeterusnya} langkah keseluruhan. Had maksimum pulau ialah 5!`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            
            cakap("Aduh! Daya terlalu kuat, aku terlajak ke sungai belakang!", 4000);
            mainBunyi(sfxSalah);

            // Buaya Rahsia Muncul Dari Dalam Air
            await tunggu(500);
            buayaRahsia.classList.add("muncul-buaya");
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐊🌊";
                document.getElementById("tajuk-kalah").innerHTML = "Terlebih Had Kumulatif!";
                document.getElementById("pesan-kalah").innerHTML = `Jumlah penambahan terkumpul anda ialah ${posisiSeterusnya}. Rusa telah melompat melepasi pulau dan jatuh ke dalam sungai kedua yang mempunyai Buaya Rahsia!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2500);
        }

    } 
    else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan format ejaan adalah <code>rusa.lompat(jumlah)</code>.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogRusa");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}