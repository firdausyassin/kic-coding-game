let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

// Generate Halangan Rawak
const senaraiHalangan = ["api", "batu"];
const halanganSemasa = senaraiHalangan[Math.floor(Math.random() * senaraiHalangan.length)];

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

// Setup awal bila page load
window.onload = function() {
    let kotak = document.getElementById("kotak-halangan");
    let teks = document.getElementById("teksAnimasi");
    
    if (halanganSemasa === "api") {
        kotak.innerHTML = "🔥";
        teks.innerHTML = "Status AWAS: Terdapat Kebakaran Api di hadapan!";
    } else {
        kotak.innerHTML = "🪨";
        teks.innerHTML = "Status AWAS: Terdapat Bongkah Batu Besar di hadapan!";
    }
}

async function laksanaArahanTahap5a() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let naga = document.getElementById("kotak-naga-utama");
    let ikonNaga = document.getElementById("ikonNaga");
    let awanDialog = document.getElementById("dialogNaga");
    let halangan = document.getElementById("kotak-halangan");
    let magik = document.getElementById("kesan-magik");
    
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

    // RegEx Tangkap: if(halangan=="teks"){naga.tindakan()}
    let padananIf = input.match(/^if\(halangan==\"([a-z]+)\"\)\{naga\.([a-z_]+)\(\)\}$/);

    if (padananIf) {
        let situasiDitaip = padananIf[1]; 
        let aksiDitaip = padananIf[2];   

        adakahSibuk = true;

        if (situasiDitaip === halanganSemasa) {
            
            // KES JAWAPAN TEPAT 1: API -> HEMBUS AIR
            if (halanganSemasa === "api" && aksiDitaip === "hembus_air") {
                maklumBalas.innerHTML = "Sistem: Memproses logik... Keputusan tepat! Menghembus air.";
                maklumBalas.style.borderLeftColor = "#f1c40f";
                
                cakap("Terima amukan air aku! 💦", 2000);
                await tunggu(500);

                // Animasi Air Terbang
                magik.innerHTML = "💦";
                magik.classList.add("animasi-hembus");
                mainBunyi(sfxBetul);
                
                await tunggu(400); // Masa air sampai ke api
                halangan.style.opacity = "0"; // Api padam
                teksAnimasi.innerHTML = "Status: Api berjaya dipadamkan! Laluan selamat.";
                
                await tunggu(800);
                magik.style.opacity = "0"; // Air hilang
                
                // Naga berjalan melepasi halangan
                naga.style.transition = "left 1s ease-in-out";
                naga.style.left = "75%";
                await tunggu(1000);

                awanDialog.classList.add("dialog-tepi"); 
                cakap("Mudah sahaja! Hahaha!", 3000);
                adakahTamat = true;
                
                maklumBalas.innerHTML = "Berjaya: Syarat dipenuhi! Anda mengawal elemen dengan sempurna.";
                maklumBalas.style.borderLeftColor = "#0be881";
                mainBunyi(sfxMenang);

                setTimeout(() => {
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 2000);
            }
            
            // KES JAWAPAN TEPAT 2: BATU -> LOMPAT
            else if (halanganSemasa === "batu" && aksiDitaip === "lompat") {
                maklumBalas.innerHTML = "Sistem: Memproses logik... Keputusan tepat! Melompat melepasi batu.";
                maklumBalas.style.borderLeftColor = "#f1c40f";
                
                cakap("Hup! Lompat tinggi-tinggi! 🐉", 2000);
                mainBunyi(sfxBetul);
                
                // Animasi Lompat Parabolik Smooth (Naik + Gerak Depan)
                naga.style.transition = "left 0.5s linear, bottom 0.5s ease-out";
                naga.style.left = "45%"; 
                naga.style.bottom = "330px"; 
                
                await tunggu(500); // Tunggu sampai puncak awan

                // Mendarat (Turun + Gerak Depan)
                naga.style.transition = "left 0.5s linear, bottom 0.5s ease-in";
                naga.style.left = "75%"; 
                naga.style.bottom = "120px"; 
                
                await tunggu(500); // Tunggu mendarat
                
                teksAnimasi.innerHTML = "Status: Rintangan batu berjaya dilompati!";
                awanDialog.classList.add("dialog-tepi"); 
                cakap("Kacang je halangan batu ni!", 3000);
                
                adakahTamat = true;
                maklumBalas.innerHTML = "Berjaya: Syarat dipenuhi! Ketangkasan naga diselamatkan.";
                maklumBalas.style.borderLeftColor = "#0be881";
                mainBunyi(sfxMenang);

                setTimeout(() => {
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 2000);
            }
            
            // JIKA SITUASI BETUL TAPI TINDAKAN TERBALIK (Gagal)
            else {
                adakahTamat = true;
                maklumBalas.innerHTML = `Gagal: Anda menyasarkan '${situasiDitaip}', tetapi tindakan '${aksiDitaip}' adalah tidak logik!`;
                maklumBalas.style.borderLeftColor = "#ff5e57";
                mainBunyi(sfxSalah);
                
                if (halanganSemasa === "api") {
                    // Lompat masuk api
                    cakap("Aduhai! Lompat tak boleh padamkan api! 🔥😭", 3000);
                    naga.style.transition = "left 0.5s linear, bottom 0.5s ease-in";
                    naga.style.left = "50%"; // Masuk dalam api
                    naga.style.bottom = "120px";
                    
                    await tunggu(500);
                    ikonNaga.innerHTML = "💀";
                    ikonNaga.style.transform = "scaleX(-1) rotate(90deg)"; // Naga hangus tumbang
                    teksAnimasi.innerHTML = "Status: NAGA TERBAKAR DIHIDUP-HIDUP!";
                    
                    setTimeout(() => {
                        document.getElementById("ikon-kalah").innerHTML = "🐉🔥";
                        document.getElementById("tajuk-kalah").innerHTML = "Naga Rentung!";
                        document.getElementById("pesan-kalah").innerHTML = `Anda membuat keputusan untuk melompat melepasi api yang marak. Ini adalah keputusan logik yang membahayakan nyawa! Sepatutnya anda menggunakan <code>naga.hembus_air()</code>.`;
                        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                    }, 2500);
                } else {
                    // Pancut air kat batu
                    cakap("Aduhh! Hembus air tak hancurkan batu! Terlanggar! 💥", 3000);
                    magik.innerHTML = "💦";
                    magik.classList.add("animasi-hembus");
                    
                    await tunggu(400);
                    magik.style.opacity = "0"; // Air langgar batu hilang macam tu je
                    
                    naga.style.transition = "left 0.3s ease-in";
                    naga.style.left = "35%"; // Terlanggar batu
                    await tunggu(300);
                    
                    ikonNaga.innerHTML = "😵";
                    teksAnimasi.innerHTML = "Status: NAGA KEMALANGAN TERLANGGAR BATU!";
                    
                    setTimeout(() => {
                        document.getElementById("ikon-kalah").innerHTML = "🐉💥";
                        document.getElementById("tajuk-kalah").innerHTML = "Kemalangan Teruk!";
                        document.getElementById("pesan-kalah").innerHTML = `Anda membuat keputusan untuk menghembus air ke arah batu pejal. Kuasa air tidak mampu memecahkan batu, menyebabkan naga terlanggar. Anda sepatutnya <code>naga.lompat()</code>!`;
                        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                    }, 2500);
                }
            }

        } else {
            // SALAH TENGOK HALANGAN
            adakahTamat = true;
            maklumBalas.innerHTML = `Gagal: Kod anda diprogramkan untuk halangan '${situasiDitaip}'. Sila imbas bentuk ancaman sebenar di skrin!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            
            cakap("Eh? Mataku salah tengok halangan ke? 🤔", 3000);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "👀❌";
                document.getElementById("tajuk-kalah").innerHTML = "Silap Imbas!";
                document.getElementById("pesan-kalah").innerHTML = `Anda menulis syarat untuk halangan <strong>"${situasiDitaip}"</strong>, sedangkan sistem mengesan halangan <strong>"${halanganSemasa}"</strong> di hadapan. Sila pastikan anda menulis syarat (If) yang betul!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Sila ikut format keputusan -> <code>if(halangan==\"api\"){naga.hembus_air()}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogNaga");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}