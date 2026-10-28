let adakahTamat = false;
let beratSasaran = 500;

function laksanaArahanGajah() {
    let input = document.getElementById("arahanInput").value.toLowerCase().trim();
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let gajah = document.getElementById("gajah");
    let balak = document.getElementById("kumpulan-balak");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) return;

    // REGEX: Tangkap apa sahaja ekspresi matematik di dalam kurungan gajah.angkat(...)
    let padananAngkat = input.match(/^gajah\.angkat\((.+)\)$/);

    if (padananAngkat) {
        let ekspresiMatematik = padananAngkat[1];
        let jumlahKiraan = 0;

        try {
            // Komputer selesaikan pengiraan matematik secara dinamik (cth: 200 + 300)
            jumlahKiraan = eval(ekspresiMatematik);
        } catch (e) {
            maklumBalas.innerHTML = "Ralat Matematik: Format pengiraan di dalam kurungan salah.";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            sfxSalah.play();
            return;
        }

        adakahTamat = true; // Kunci terminal

        // KES 1: TEPAT TOTAL 500 KG (Menang)
        if (jumlahKiraan === beratSasaran) {
            cakap("Hup! Berat ngam-ngam 500 KG!", 2000);
            
            setTimeout(() => {
                // Animasi gajah jalan ke arah balak dan angkat
                gajah.style.left = "45%";
                balak.style.bottom = "100px"; // Balak terangkat ke atas
                
                teksAnimasi.innerHTML = "Status: Muatan berjaya dipindahkan!";
                maklumBalas.innerHTML = `Berjaya: Formula (${ekspresiMatematik}) menghasilkan tepat 500 KG.`;
                maklumBalas.style.borderLeftColor = "#2ecc71";
                sfxBetul.play();
                
                setTimeout(() => {
                    document.getElementById("modalKemenangan").className = "modal-tunjuk";
                    document.getElementById("bunyiMenang").play();
                }, 2000);
            }, 2000);
        } 
        // KES 2: TERKURANG BERAT (Gajah merungut)
        else if (jumlahKiraan < beratSasaran) {
            cakap(`Eh, total baru ${jumlahKiraan} KG? Tak cukup ni!`, 3000);
            maklumBalas.innerHTML = `Gagal: Jumlah muatan kurang daripada 500 KG. Sila semak formula tambah anda.`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            sfxSalah.play();
            // Biarkan adakahTamat = false supaya budak boleh betulkan kod tanpa refresh
            adakahTamat = false; 
        } 
        // KES 3: TERLEBIH BERAT (Terlebih muatan bahaya)
        else {
            cakap(`Aduh! ${jumlahKiraan} KG berat sangat! Sakit pinggang aku!`, 3000);
            gajah.innerHTML = "😭"; // Gajah menangis kesakitan
            maklumBalas.innerHTML = `Gagal: Overload! Berat maksimum sistem hidraulik ialah 500 KG.`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            sfxSalah.play();
        }

    } else {
        maklumBalas.innerHTML = "Ralat Sintaks: Format salah. Sila gunakan format gajah.angkat(nombor + nombor).";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        sfxSalah.play();
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogGajah");
    kotakDialog.innerHTML = mesej;
    kotakDialog.classList.add("tunjuk-dialog");
    setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
}