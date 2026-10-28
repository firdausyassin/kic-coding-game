let adakahTamat = false;
let medanAsteroid = document.getElementById("medan-asteroid");
let jumlahAsteroid = Math.floor(Math.random() * 5) + 2; // Rawak dari 2 hingga 6 biji
let asteroidMusnah = 0;

// Menjana batu asteroid di skrin
for (let i = 0; i < jumlahAsteroid; i++) {
    let batu = document.createElement("span");
    batu.innerHTML = "🪨";
    batu.className = "batu-asteroid";
    batu.id = `batu-${i}`;
    medanAsteroid.appendChild(batu);
}

setTimeout(() => {
    let teks = document.getElementById("teksAnimasi");
    teks.innerHTML = `Status: Radar mengesan ${jumlahAsteroid} asteroid menghampiri!`;
    cakap("Kunci sasaran, laksanakan gelung tembakan!", 3000);
}, 1000);

function laksanaArahanAngkasa() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let laser = document.getElementById("laser-pancaran");
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) return;

    // Menangkap struktur: while(radar=="bahaya"){kapal.tembak()}
    let padananWhile = input.match(/^while\(radar==['"]bahaya['"]\)\{kapal\.tembak\(\)\}$/);
    
    // Perangkap jika budak cuma taip If biasa
    let padananIf = input.match(/^if\(radar==['"]bahaya['"]\)\{kapal\.tembak\(\)\}$/);

    if (padananWhile) {
        adakahTamat = true;
        maklumBalas.innerHTML = "Sistem: Gelung While Diaktifkan! Memusnahkan ancaman berterusan...";
        maklumBalas.style.borderLeftColor = "#00f3ff";
        
        let tembakInterval = setInterval(() => {
            // Animasi tembak laser naik
            laser.style.height = "100%";
            
            setTimeout(() => {
                let sasaran = document.getElementById(`batu-${asteroidMusnah}`);
                if (sasaran) {
                    sasaran.classList.add("meletup"); // Hancur
                    sfxBetul.play();
                    asteroidMusnah++;
                }
                laser.style.height = "0"; // Laser mati
                
                // Semak jika semua habis
                if (asteroidMusnah === jumlahAsteroid) {
                    clearInterval(tembakInterval);
                    setTimeout(() => {
                        document.getElementById("teksAnimasi").innerHTML = "Status: Sektor galaksi ini kembali selamat.";
                        maklumBalas.innerHTML = "Berjaya: Gelung ditamatkan apabila ancaman 0.";
                        maklumBalas.style.borderLeftColor = "#2ecc71";
                        cakap("Fuh! Kalau guna If biasa tadi, kita dah hancur!", 4000);
                        
                        setTimeout(() => {
                            document.getElementById("modalKemenangan").className = "modal-tunjuk";
                            document.getElementById("bunyiMenang").play();
                        }, 2500);
                    }, 500);
                }
            }, 100); 
            
        }, 600); // Masa delay antara satu tembakan ke tembakan lain
        
    } else if (padananIf) {
        // Tembak sekali je, baki asteroid langgar kapal
        adakahTamat = true;
        laser.style.height = "100%";
        setTimeout(() => {
            document.getElementById("batu-0").classList.add("meletup");
            laser.style.height = "0";
            sfxBetul.play();
            
            setTimeout(() => {
                document.getElementById("kapal-angkasa").innerHTML = "💥";
                maklumBalas.innerHTML = `Gagal: Anda cuma musnahkan 1! Ada baki ${jumlahAsteroid - 1} asteroid lagi merempuh kita!`;
                maklumBalas.style.borderLeftColor = "#e74c3c";
                sfxSalah.play();
            }, 500);
        }, 100);
        
    } else {
        maklumBalas.innerHTML = "Ralat Sintaks: Rantai gelung tidak lengkap. Sila klik Panduan ℹ️.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        sfxSalah.play();
    }
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }
function cakap(m, s) { 
    let d = document.getElementById("dialogKapal");
    d.innerHTML = m; d.classList.add("tunjuk-dialog");
    setTimeout(() => d.classList.remove("tunjuk-dialog"), s);
}