let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranPlanet = 8;
const namaPlanet = ["Utarid", "Zuhrah", "Bumi", "Marikh", "Musytari", "Zuhal", "Uranus", "Neptun", "KOMET GERGASI"];

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

// Jana Bintang Latar Belakang masa page load
function janaBintang() {
    let ruangBintang = document.getElementById("ruang-bintang");
    for(let i=0; i<40; i++){
        let bintang = document.createElement("div");
        bintang.className = "bintang";
        bintang.style.top = `${Math.random() * 100}%`;
        bintang.style.left = `${Math.random() * 100}%`;
        bintang.style.animationDelay = `${Math.random() * 2}s`;
        ruangBintang.appendChild(bintang);
    }
}
janaBintang();

async function laksanaArahanTahap4f() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Simulasi tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if(adakahSibuk) return;

    // RegEx Tangkap: ulang(jumlah){orbit.tambah_planet()}
    let padananLoop = input.match(/^ulang\((\d+)\)\{orbit\.tambah_planet\(\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        
        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Astronomi: Tiada penciptaan planet direkodkan.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Sepi sungguh angkasa ni...", 2500);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Menjana orbit dan memposisikan ${kaliUlang} jasad angkasa...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Limit Animasi supaya tak keluar 100 orbit
        let limitLoop = kaliUlang;
        if(limitLoop > 9) limitLoop = 9; // Hadkan ke 9 (Planet anomali terakhir)

        cakap("Graviti aktif! Menyerap debu angkasa...", 2000);
        await tunggu(1000);

        // ==========================================
        // ANIMASI BINA PLANET DAN ORBIT
        // ==========================================
        for (let i = 1; i <= limitLoop; i++) {
            
            let orbitElemen = document.getElementById(`orbit-${i}`);
            let planetElemen = document.getElementById(`planet-${i}`);
            let namaSemasa = namaPlanet[i-1];

            if(orbitElemen && planetElemen) {
                // Munculkan planet
                planetElemen.classList.add("planet-muncul");
                
                // Putarkan orbit
                orbitElemen.classList.add("orbit-putar");
                
                mainBunyi(sfxBetul); 
                
                if(i === 9) {
                    teksAnimasi.innerHTML = `Status: AMARAN! Objek tidak dikenali (${namaSemasa}) dikesan!`;
                } else {
                    teksAnimasi.innerHTML = `Status: Planet ${i} (${namaSemasa}) berjaya memasuki orbit.`;
                }
            }
            
            await tunggu(600);
        }

        await tunggu(1000);

        // ==========================================
        // KEPUTUSAN EKSPERIMEN ANGKASA
        // ==========================================

        if (kaliUlang === sasaranPlanet) {
            // TEPAT! (8 Planet)
            adakahTamat = true;
            
            maklumBalas.innerHTML = "Berjaya: Sistem Suria seimbang dan mematuhi fakta Sains!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Lengkap. 8 planet berputar dengan harmoni.`;
            
            mainBunyi(sfxMenang);
            cakap("Cantiknya ciptaan tuhan! 🌍", 3000);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);

        } 
        else if (kaliUlang > sasaranPlanet) {
            // TERLAJAK (> 8) KOMET MASUK CAMPUR!
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Sistem suria hanya mempunyai 8 planet! Anda meletakkan ${kaliUlang}.`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: AMARAN GRAVITI! Orbit bertindih!";
            mainBunyi(sfxSalah);
            cakap("Alamak! Asteroid datang!! ☄️", 3000);
            
            // Gegarkan skrin sikit
            document.getElementById("ruangAnimasi").style.animation = "kelipBintang 0.1s infinite";
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "☄️💥";
                document.getElementById("tajuk-kalah").innerHTML = "Anomali Graviti!";
                document.getElementById("pesan-kalah").innerHTML = `Fakta Sains: Terdapat 8 buah planet utama sahaja. Arahan gelung anda melebihi had (<strong>${kaliUlang} kali</strong>), menyebabkan tarikan graviti musnah dan menarik objek komet asing masuk ke dalam sistem suria!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                document.getElementById("ruangAnimasi").style.animation = ""; // Stop gegar
            }, 2500);
        }
        else {
            // TERKURANG (< 8)
            adakahTamat = true;
            
            maklumBalas.innerHTML = `Gagal: Hanya ${kaliUlang} planet dijana. Di mana yang lain?`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Sistem suria tidak lengkap. Graviti tidak seimbang.";
            mainBunyi(sfxSalah);
            
            if(kaliUlang < 3) {
                cakap("Eh mana Bumi? Macam mana kita nak hidup ni?! 😱", 3000);
            } else {
                cakap("Hmm... rasa macam ada planet yang tertinggal...", 3000);
            }
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🌑❓";
                document.getElementById("tajuk-kalah").innerHTML = "Sistem Terbengkalai!";
                document.getElementById("pesan-kalah").innerHTML = `Anda hanya mencipta <strong>${kaliUlang} orbit</strong>. Mengikut silibus Sains, kita memerlukan 8 orbit yang lengkap. Tambahkan bilangan pengulangan anda!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){orbit.tambah_planet()}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogMatahari");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}