let adakahTamat = false;
let adakahSibuk = false;

// KAWALAN DATA BERGILI-GILIR (Kalis random asyik keluar benda sama)
let gilirAsal = sessionStorage.getItem("z2_m1b_gilir") || "kereta";
let situasiSemasa = (gilirAsal === "kereta") ? "orang" : "kereta";
sessionStorage.setItem("z2_m1b_gilir", situasiSemasa);

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.log("Audio disekat browser."));
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    let teksAnimasi = document.getElementById("teksAnimasi");
    let h_orang = document.getElementById("pejalan-kaki");
    let h_kereta = document.getElementById("kereta-awam");
    
    await tunggu(600);
    
    if (situasiSemasa === "orang") {
        teksAnimasi.innerHTML = "Status: Radar mengesan kemunculan Pejalan Kaki.";
        await tunggu(100);
        // Orang jalan dari kanan (luar skrin) ke bahu jalan
        await gerak("pejalan-kaki", {left: "58%"}, 1.5);
        bukaDialog("dial-orang", "Tolong buka lampu merah untuk kereta, saya nak lintas!", 4000);
    } else {
        teksAnimasi.innerHTML = "Status: Radar mengesan kemunculan Kenderaan Awam.";
        await tunggu(100);
        // Kereta tunggu di sebelah kiri masuk sikit je supaya nampak jelas bumper dia
        await gerak("kereta-awam", {left: "5%"}, 1.5);
        bukaDialog("dial-kereta", "Jalan lengang ni, harap dapat lampu trafik hijau!", 4000);
    }
}

// Enjin Penggerak CSS (Smooth Transition)
function gerak(id, props, masa) {
    let el = document.getElementById(id);
    el.style.transition = `all ${masa}s linear`;
    for (let key in props) { el.style[key] = props[key]; }
    return new Promise(r => setTimeout(r, masa * 1000));
}

function setLampuVisual(keadaanKereta) {
    document.getElementById("l-k-merah").classList.remove("aktif-merah");
    document.getElementById("l-k-hijau").classList.remove("aktif-hijau");
    document.getElementById("l-p-merah").classList.remove("p-merah-nyala");
    document.getElementById("l-p-hijau").classList.remove("p-hijau-nyala");

    // LAMPU MENYALA SERENTAK TETAPI BERLAWANAN FUNGSI
    if (keadaanKereta === "hijau") {
        document.getElementById("l-k-hijau").classList.add("aktif-hijau");
        document.getElementById("l-p-merah").classList.add("p-merah-nyala"); 
    } else {
        document.getElementById("l-k-merah").classList.add("aktif-merah");
        document.getElementById("l-p-hijau").classList.add("p-hijau-nyala"); 
    }
}

async function laksanaArahanBandar1b() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/[\s\n\r]+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let boom = document.getElementById("boom-impak");
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxHon = document.getElementById("bunyiHon"); // Audio Hon

    if (adakahTamat || adakahSibuk) return;

    let regexStruktur = /^if\(situasi==['"](orang|kereta)['"]\)\{(lampu\.merah\(\)|lampu\.hijau\(\))\}else\{(lampu\.merah\(\)|lampu\.hijau\(\))\}$/;
    let padanan = input.match(regexStruktur);

    if (padanan) {
        let s_if = padanan[1]; 
        let t_if = padanan[2];
        let t_else = padanan[3];

        // 🛑 VALIDASI RALAT KOD AWAL (Mesti Mula Dengan Situasi Sebenar!) 🛑
        if (s_if !== situasiSemasa) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `RALAT KOD: Situasi sekarang adalah "${situasiSemasa}". Arahan anda bermula dengan <code>if(situasi=="${s_if}")</code>. Sila padam dan semak situasi di kanvas!`;
            maklumBalas.style.borderLeftColor = "#f39c12"; 
            return; 
        }

        adakahSibuk = true;
        let outputLampuKereta = (situasiSemasa === s_if) ? t_if : t_else;

        // ==========================================
        // SITUASI 1: ADA ORANG NAK LINTAS
        // ==========================================
        if (situasiSemasa === "orang") {
            if (outputLampuKereta === "lampu.merah()") {
                // KESAN BETUL: Kereta berhenti, Orang U-Turn melintas
                adakahTamat = true;
                mainBunyi(sfxBetul);
                setLampuVisual("merah");
                maklumBalas.innerHTML = "Berjaya: Kereta dihentikan. Laluan selamat untuk pejalan kaki.";
                maklumBalas.style.borderLeftColor = "#0be881";
                
                // Kereta meluncur dari -250px ke zebra
                gerak("kereta-awam", {left: "15%"}, 1.5); 
                
                await tunggu(500);
                document.getElementById("ikon-orang-emoji").innerHTML = "🚶"; // Ikon berjalan
                await gerak("pejalan-kaki", {top: "80%"}, 2.0); // Lintas ke seberang (bahu bawah)
                
                bukaDialog("dial-orang", "Terima kasih, sistem bertindak adil!", 2000);
                
                document.getElementById("pejalan-kaki").classList.add("pusing-kanan-diri"); 
                await gerak("pejalan-kaki", {left: "120%"}, 2.0); // Keluar belah kanan U-turn
                
                await tunggu(500);
                mainBunyi(document.getElementById("bunyiMenang"));
                document.getElementById("modalKemenanganKustom").classList.add("tunjuk-modal-kustom");
            } 
            else {
                // KESAN SALAH (HON & MARAH): Kereta dpt Hijau, Orang dpt Merah tapi degil lintas
                adakahTamat = true;
                setLampuVisual("hijau");
                maklumBalas.innerHTML = "RALAT KESELAMATAN: Lampu hijau diberikan kepada kereta semasa pejalan kaki melintas!";
                maklumBalas.style.borderLeftColor = "#ff5e57";
                
                // Orang degil melintas
                document.getElementById("ikon-orang-emoji").innerHTML = "🏃";
                gerak("pejalan-kaki", {top: "50%"}, 1.0);
                
                // Kereta pecut dari luar (-250px) ke arah orang
                await gerak("kereta-awam", {left: "30%"}, 1.0);
                
                // Kereta nampak orang, brek mengejut dan HONK!
                mainBunyi(sfxSalah); // Main bunyi salah if hon tak function
                mainBunyi(sfxHon); // PONN PONN
                document.getElementById("dial-kereta").classList.add("marah-border");
                bukaDialog("dial-kereta", "PONN!! Ke tepi woi!! Buta warna ke lintas masa lampu merah?!", 4000);
                
                document.getElementById("ikon-orang-emoji").innerHTML = "🧍"; // Terkejut
                bukaDialog("dial-orang", "Alamak! Maaf bang saya silap tengok!", 4000);
                
                await tunggu(3500);
                document.getElementById("ikon-kalah").innerHTML = "🚨🚗";
                document.getElementById("tajuk-kalah").innerHTML = "Provokasi Trafik!";
                document.getElementById("pesan-kalah").innerHTML = "Pemandu hampir terlanggar pejalan kaki! <br><br><b>Sebab Ralat:</b> Anda memberikan <code>lampu.hijau()</code> kepada kenderaan pada masa pejalan kaki mahu melintas.";
                document.getElementById("modalKalahKustom").classList.add("tunjuk-modal-kustom");
            }
        } 
        // ==========================================
        // SITUASI 2: KERETA NAK LALU (Jalan Kosong)
        // ==========================================
        else if (situasiSemasa === "kereta") {
            if (outputLampuKereta === "lampu.hijau()") {
                // KESAN BETUL: Kereta lepas, timing orang masuk serentak
                adakahTamat = true;
                mainBunyi(sfxBetul);
                setLampuVisual("hijau");
                maklumBalas.innerHTML = "Berjaya: Tiada halangan dikesan. Isyarat pelepasan hijau diberikan.";
                maklumBalas.style.borderLeftColor = "#0be881";
                
                // Kereta gerak laju
                gerak("kereta-awam", {left: "120%"}, 2.5); 
                
                // Serentak, orang masuk dari kanan ke bahu jalan
                gerak("pejalan-kaki", {left: "58%"}, 1.5); 
                
                await tunggu(1600); // Tunggu orang sampai tepi jalan
                bukaDialog("dial-orang", "Fuh, nasib baik aku tunggu, laju kereta tu.", 2500);
                
                await tunggu(1500);
                mainBunyi(document.getElementById("bunyiMenang"));
                document.getElementById("modalKemenanganKustom").classList.add("tunjuk-modal-kustom");
            } 
            else {
                // KESAN SALAH (EKSIDEN MAUT): Kereta dpt Merah tapi langgar je, Orang dpt Hijau terus melintas
                adakahTamat = true;
                mainBunyi(sfxSalah);
                setLampuVisual("merah");
                maklumBalas.innerHTML = "RALAT KRITIKAL: Kereta gagal membrek dan merempuh pejalan kaki di lampu merah!";
                maklumBalas.style.borderLeftColor = "#ff5e57";
                
                // Orang (dari luar skrin) nampak lampu pejalan hijau, masuk berlari dan terus melintas
                document.getElementById("ikon-orang-emoji").innerHTML = "🏃";
                gerak("pejalan-kaki", {left: "58%"}, 0.5).then(() => {
                    gerak("pejalan-kaki", {top: "50%"}, 1.0); // Melintas ke tengah
                });
                
                // Kereta (yang dari tadi dah tunggu di 5%) degil langgar lampu merah!
                mainBunyi(sfxHon); // PONN
                document.getElementById("dial-kereta").classList.add("marah-border");
                bukaDialog("dial-kereta", "Woi aku dah lambat apasal lampu merah tiba-tiba!!", 3000);
                await gerak("kereta-awam", {left: "48%"}, 1.5); // Kereta sapu dari tepi
                
                // BOOM
                boom.classList.add("skala-boom"); 
                mainBunyi(sfxSalah);
                document.getElementById("ikon-orang-emoji").innerHTML = "💀"; // Jadi tengkorak
                
                await tunggu(2500);
                document.getElementById("ikon-kalah").innerHTML = "💥🚑";
                document.getElementById("tajuk-kalah").innerHTML = "Kemalangan Maut!";
                document.getElementById("pesan-kalah").innerHTML = "Kereta merempuh lampu merah mengejut dan melanggar pejalan kaki yang sedang melintas.<br><br><b>Sebab Ralat:</b> Anda menetapkan <code>lampu.merah()</code> kepada kenderaan secara tidak logik di jalan kosong, menyebabkan sistem trafik keliru!";
                document.getElementById("modalKalahKustom").classList.add("tunjuk-modal-kustom");
            }
        }

    } else {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Rantaian If-Else rosak. Semak padanan penutup beralun <code>{}</code>.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        adakahSibuk = false;
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function bukaDialog(id, mesej, masa) {
    let box = document.getElementById(id);
    if(box) {
        box.innerHTML = mesej;
        box.classList.add("buka-cakap");
        setTimeout(() => { box.classList.remove("buka-cakap"); }, masa);
    }
}