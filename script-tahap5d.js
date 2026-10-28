let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

// Pangkalan Data Item
const senaraiItem = [
    { nama: "jus", ikon: "🧃", harga: 3, idHTML: "jus" },
    { nama: "susu", ikon: "🥛", harga: 4, idHTML: "susu" },
    { nama: "kopi", ikon: "☕", harga: 5, idHTML: "kopi" }
];

// Pilih Item Rawak & Generate Baki Rawak (Baki sentiasa cukup)
const sasaranItem = senaraiItem[Math.floor(Math.random() * senaraiItem.length)];
const bakiRawak = Math.floor(Math.random() * 5) + sasaranItem.harga; // Baki confirm lebih atau sama dengan harga

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
    // Kemaskini Skrin Digital Mesin
    document.getElementById("teks-baki").innerHTML = `BAKI : RM ${bakiRawak}.00`;
    document.getElementById("teks-harga").innerHTML = `HARGA: RM ${sasaranItem.harga}.00`;
    
    // Kemaskini Status Kotak Putih secara Dinamik
    document.getElementById("teksAnimasi").innerHTML = `Status: Menunggu arahan untuk membantu membeli ${sasaranItem.nama.toUpperCase()}.`;

    // Tunjuk dialog awal
    setTimeout(() => { 
        cakap(`Saya teringin nak minum <strong>${sasaranItem.nama}</strong>! Boleh tolong belikan?`, 4000); 
    }, 500);
}

async function laksanaArahanTahap5d() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let pelanggan = document.getElementById("kotak-pelanggan");
    let ikonPelanggan = document.getElementById("ikonPelanggan");
    let awanDialog = document.getElementById("dialogPelanggan");
    
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

    // RegEx Tangkap: if(baki>=harga){beli("nama_item")}
    let padananIf = input.match(/^if\(baki>=harga\)\{beli\("([a-z]+)"\)\}$/);

    // Semakan Ralat Umum Dulu (Kalau salah tulis formula math)
    let cekRalatSimbol = input.match(/^if\(baki(>|<|<=|=)harga\)/);

    if (padananIf) {
        let itemDitaip = padananIf[1]; 

        adakahSibuk = true;

        if (itemDitaip === sasaranItem.nama) {
            
            // KEPUTUSAN TEPAT
            maklumBalas.innerHTML = "Sistem: Logik perbandingan sah! Memproses pengeluaran item.";
            maklumBalas.style.borderLeftColor = "#00f3ff";
            teksAnimasi.innerHTML = `Status: Memproses transaksi ${sasaranItem.nama.toUpperCase()}...`;
            
            cakap("Syiling dimasukkan... Ting! 🪙", 2000);
            mainBunyi(sfxBetul);
            await tunggu(1000);
            
            // Fasa 1: Minuman Jatuh
            let minumanFizikal = document.getElementById(sasaranItem.idHTML);
            minumanFizikal.style.transform = `translateY(180px)`; // Jatuh ke ruang dispenser
            teksAnimasi.innerHTML = `Status: Minuman ${sasaranItem.nama.toUpperCase()} berjaya dikeluarkan!`;
            await tunggu(1000);

            // Fasa 2: Pelanggan jalan ambil
            pelanggan.style.transition = "left 1s ease-in-out";
            pelanggan.style.left = "42%";
            await tunggu(1200);

            // Fasa 3: Barang ghaib (masuk tangan), pelanggan lompat happy
            minumanFizikal.style.opacity = "0";
            ikonPelanggan.innerHTML = "🤩"; // Muka happy
            pelanggan.style.transition = "transform 0.3s ease-out";
            pelanggan.style.transform = "translateY(-30px)"; // Lompat
            await tunggu(300);
            pelanggan.style.transform = "translateY(0)";
            await tunggu(300);

            adakahTamat = true;
            cakap(`Terima kasih! Sedapnya ${sasaranItem.nama} ni! ${sasaranItem.ikon}`, 4000);
            
            maklumBalas.innerHTML = "Berjaya: Transaksi lengkap. Baki mencukupi dan barang tepat.";
            maklumBalas.style.borderLeftColor = "#0be881";
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } else {
            // SALAH ITEM TAPI FORMULA BETUL
            adakahTamat = true;
            maklumBalas.innerHTML = "Gagal: Anda telah membelikan minuman yang salah!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Transaksi Dibatalkan. Item salah dipilih.";
            mainBunyi(sfxSalah);

            let minumanSalah = document.getElementById(itemDitaip);
            if (minumanSalah) {
                minumanSalah.style.transform = `translateY(180px)`; // Minuman salah jatuh
            }
            
            await tunggu(1000);
            
            ikonPelanggan.innerHTML = "😠"; // Muka marah
            cakap(`Eh, kenapa beli ${itemDitaip}? Saya nak ${sasaranItem.nama} la!`, 4000);

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "💸😡";
                document.getElementById("tajuk-kalah").innerHTML = "Tersalah Beli!";
                document.getElementById("pesan-kalah").innerHTML = `Logik perbandingan anda tepat, tetapi anda menaip <strong>"${itemDitaip}"</strong>. Pelanggan meminta <strong>"${sasaranItem.nama}"</strong>. Sila perhatikan arahan pelanggan.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (cekRalatSimbol) {
        // RALAT SIMBOL MATEMATIK (< ATAU =)
        maklumBalas.innerHTML = "Ralat Matematik: Anda menggunakan simbol perbandingan yang salah!";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        
        teksAnimasi.innerHTML = "Status: Ralat! Sistem menolak nilai matematik.";
        cakap("Eh? Betul ke simbol matematik tu? Mesin tak faham! 🤨", 3000);
        
        setTimeout(() => {
            document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            document.getElementById("ikon-kalah").innerHTML = "🧮❌";
            document.getElementById("tajuk-kalah").innerHTML = "Ralat Simbol!";
            document.getElementById("pesan-kalah").innerHTML = `Untuk mengesahkan wang mencukupi, nilai baki mestilah Lebih Besar atau Sama Dengan harga barang. Gunakan gabungan simbol <strong>&gt;=</strong>.`;
        }, 3000);

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Sila ikut format -> <code>if(baki>=harga){beli(\"jus\")}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPelanggan");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}