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

async function laksanaArahanTahap1i() {
    let inputAsal = document.getElementById("arahanInput").value;
    
    // Kita biarkan petik (quotes) wujud untuk validasi, cuma buang space.
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let ruangAnimasi = document.getElementById("ruangAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Hari telah pun malam. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // Check format sintaks String: langit.tukar("teks") ATAU langit.tukar('teks')
    // Memaksa budak letak tanda petik (quotes)
    let padananSintaks = input.match(/^langit\.tukar\((["'])([a-z]+)\1\)$/);

    if (padananSintaks) {
        let fasaMasa = padananSintaks[2]; // Ambil perkataan dalam quotes

        adakahSibuk = true;

        // KES 1: JAWAPAN TEPAT (MALAM)
        if (fasaMasa === "malam") {
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Berjaya: Memproses putaran bumi ke fasa malam...`;
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Matahari mula terbenam...";
            
            // MULA ANIMASI CSS (Tambah class .malam-aktif)
            ruangAnimasi.classList.add("malam-aktif");
            
            // Tunggu animasi transisi 2.5 saat habis
            await tunggu(2500); 

            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Fasa malam yang tenang telah tiba.";
            maklumBalas.innerHTML = "Sempurna: Algoritma pertukaran fasa selesai!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } 
        // KES 2: JIKA TULIS "SIANG"
        else if (fasaMasa === "siang") {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#f1c40f";
            maklumBalas.innerHTML = "Ralat Logik: Sekarang memang sedang fasa siang! Bumi mesti berputar ke depan.";
            adakahSibuk = false;
        } 
        // KES 3: MENGARUT (Cth: "hujan", "pagi")
        else {
            mainBunyi(sfxSalah);
            maklumBalas.style.borderLeftColor = "#ff5e57";
            maklumBalas.innerHTML = `Gagal: Sistem tidak mengenal pasti fasa "${fasaMasa}".`;
            teksAnimasi.innerHTML = `Ralat Sistem: Parameter teks tidak sah!`;
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "❓❌";
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan parameter teks "${fasaMasa}". Fasa kitaran bumi untuk misi ini hanyalah "malam". Sila pastikan ejaan anda betul.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
        }

    } 
    // JIKA TERTINGGAL TANDA PETIK (Quotes) ATAU SALAH EJAAN ASAS
    else {
        // Cek jika budak tulis langit.tukar(malam) tanpa quotes
        let cekTanpaQuotes = input.match(/^langit\.tukar\(([a-z]+)\)$/);
        
        mainBunyi(sfxSalah);
        maklumBalas.style.borderLeftColor = "#ff5e57";
        
        if (cekTanpaQuotes) {
            maklumBalas.innerHTML = "Ralat Sintaks: Parameter jenis teks mesti dikurung dengan tanda petik <code>\" \"</code>!";
        } else {
            maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>langit.tukar(\"malam\")</code>.";
        }
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }