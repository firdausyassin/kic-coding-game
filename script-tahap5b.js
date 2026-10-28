let adakahTamat = false;
let adakahSibuk = false;

// Database Objek Baru
const pangkalanBentuk = [
    { nama: "bola", bucu: 0, ikon: "🏀" },
    { nama: "kaset", bucu: 4, ikon: "📼" },
    { nama: "pelindung", bucu: 5, ikon: "🛡️" }
];

// Pilih bentuk rawak
const bentukSemasa = pangkalanBentuk[Math.floor(Math.random() * pangkalanBentuk.length)];

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

// Animasi Masuk Awal (Conveyor Belt bawa objek)
window.onload = async function() {
    let kotakObjek = document.getElementById("kotak-objek");
    let sawat = document.getElementById("sawat-gerak");
    let infoBucu = document.getElementById("data-bucu-info");
    
    // Set ikon rawak
    kotakObjek.innerHTML = bentukSemasa.ikon;
    
    // Hidupkan tali sawat
    sawat.classList.add("sawat-aktif");
    
    // Gerak objek ke bawah scanner (21% left)
    await tunggu(100);
    kotakObjek.style.left = "21%";
    
    await tunggu(1000); // Masa perjalanan
    sawat.classList.remove("sawat-aktif"); // Stop sawat
    
    // Papar maklumat imbasan
    infoBucu.innerHTML = `Objek dikesan mempunyai <strong>${bentukSemasa.bucu} bucu</strong>.`;
    document.getElementById("teksAnimasi").innerHTML = "Sistem: Sila sahkan jenis objek.";
}

async function laksanaArahanTahap5b() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kotakObjek = document.getElementById("kotak-objek");
    let pintuKiri = document.getElementById("pintu-kiri");
    let pintuKanan = document.getElementById("pintu-kanan");
    let kunci1 = document.getElementById("kunci-1");
    let kunci2 = document.getElementById("kunci-2");
    let laser = document.getElementById("laser-beam");
    let sawat = document.getElementById("sawat-gerak");
    
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

    // RegEx Tangkap: if(bentuk.bucu==angka){lepaskan("teks")}
    let padananIf = input.match(/^if\(bentuk\.bucu==(\d+)\)\{lepaskan\("([a-z]+)"\)\}$/);

    if (padananIf) {
        let bucuDitaip = parseInt(padananIf[1]); 
        let namaDitaip = padananIf[2];   

        adakahSibuk = true;

        // Semak 2 Perkara: Adakah syarat BUCU tepat? Adakah NAMA OBJEK tepat?
        if (bucuDitaip === bentukSemasa.bucu && namaDitaip === bentukSemasa.nama) {
            
            // KEPUTUSAN TEPAT
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Sistem: Syarat bucu (${bucuDitaip}) & bentuk (${namaDitaip}) dipadankan. Akses diluluskan!`;
            maklumBalas.style.borderLeftColor = "#f1c40f";
            teksAnimasi.innerHTML = "Status: Membuka pintu kebal...";
            mainBunyi(sfxBetul);
            
            // Fasa 1: Kunci hijau
            kunci1.classList.add("kunci-hijau");
            kunci2.classList.add("kunci-hijau");
            laser.style.display = "none"; // Tutup laser
            await tunggu(500);

            // Fasa 2: Pintu Buka
            pintuKiri.classList.add("buka-kiri");
            pintuKanan.classList.add("buka-kanan");
            await tunggu(800);

            // Fasa 3: Tali sawat jalan balik, objek masuk bilik
            sawat.classList.add("sawat-aktif");
            kotakObjek.style.left = "80%"; // Gerak masuk vault
            await tunggu(1000);
            
            kotakObjek.style.opacity = "0"; // Ghaib dalam gelap bilik kebal
            sawat.classList.remove("sawat-aktif");
            await tunggu(300);

            // Fasa 4: Tutup pintu
            pintuKiri.classList.remove("buka-kiri");
            pintuKanan.classList.remove("buka-kanan");
            await tunggu(500);
            
            maklumBalas.innerHTML = "Berjaya: Pengecaman ciri objek berjaya. Barangan disimpan dengan selamat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Pintu Dikunci. Sistem Sempurna.";
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } else {
            // SALAH SATU SYARAT GAGAL
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Parameter tidak sepadan! Protokol Keselamatan diaktifkan!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: AMARAN! ANCAMAN PENCEROBOHAN!";
            mainBunyi(sfxSalah);

            // Fasa 1: Laser bertukar merah pekat
            laser.classList.add("laser-musnah");
            await tunggu(300);

            // Fasa 2: Objek hancur
            kotakObjek.classList.add("objek-hancur");
            await tunggu(1000);

            // Analisis apa yang salah untuk bagitahu budak
            let ralatMesej = "";
            if (bucuDitaip !== bentukSemasa.bucu) {
                ralatMesej = `Objek di atas tali sawat mempunyai <strong>${bentukSemasa.bucu} bucu</strong>, bukan ${bucuDitaip}.`;
            } else {
                ralatMesej = `Bucu anda tepat (${bentukSemasa.bucu}), tetapi nama objek <strong>"${namaDitaip}"</strong> adalah salah! Objek tersebut adalah "${bentukSemasa.nama}".`;
            }

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "💥❌";
                document.getElementById("tajuk-kalah").innerHTML = "Akses Ditolak!";
                document.getElementById("pesan-kalah").innerHTML = `Sistem Keselamatan memusnahkan objek tersebut kerana maklumat pengecaman salah. ${ralatMesej} Pastikan syarat dan nama objek ditaip dengan betul.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Sila ikut format -> <code>if(bentuk.bucu==0){lepaskan(\"bola\")}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }