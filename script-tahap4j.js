let adakahTamat = false;
let adakahSibuk = false;
let pemasaDialog; 

const sasaranTarikan = 10;

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

async function laksanaArahanTahap4j() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let gajah = document.getElementById("objek-gajah");
    let roda = document.getElementById("roda-takal");
    let tali = document.getElementById("tali-takal");
    let awanDialog = document.getElementById("dialogGajah");
    
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

    // RegEx Tangkap: ulang(jumlah){takal.tarik()}
    let padananLoop = input.match(/^ulang\((\d+)\)\{takal\.tarik\(\)\}$/);

    if (padananLoop) {
        let kaliUlang = parseInt(padananLoop[1]);
        
        if (kaliUlang === 0) {
            maklumBalas.innerHTML = "Ralat Mekanikal: Gelung sifar tidak akan menggerakkan takal.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            cakap("Hoi! Tarik la cepat sikit!", 2500);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Menarik takal secara berterusan sebanyak ${kaliUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";

        // Limit Animasi (Maksimum 11 saja sebelum putus)
        let limitLoop = kaliUlang;
        if(limitLoop > 11) limitLoop = 11; 

        cakap("Terangkat dah ni! Tarik lagi!", 1500);
        await tunggu(800);

        // ==========================================
        // ANIMASI TARIKAN TAKAL & GAJAH NAIK
        // ==========================================
        let tinggiAsalGajah = 60; 
        let panjangAsalTali = 260;
        let pusinganRoda = 0;

        for (let i = 1; i <= limitLoop; i++) {
            
            // Pengiraan Fizik (Setiap tarikan naik 19px)
            let naikY = i * 19; 
            
            gajah.style.bottom = `${tinggiAsalGajah + naikY}px`;
            tali.style.height = `${panjangAsalTali - naikY}px`; // Tali mengecut tanpa rotate
            
            pusinganRoda -= 60; // Pusing roda lawan jam (sebab tali ditarik dari kanan)
            roda.style.transform = `rotate(${pusinganRoda}deg)`;

            teksAnimasi.innerHTML = `Status: Tarikan ke-${i} dilaksanakan.`;
            mainBunyi(sfxBetul); 
            
            await tunggu(500);
        }

        await tunggu(500);

        // ==========================================
        // KEPUTUSAN EKSPERIMEN
        // ==========================================
        
        if (kaliUlang === sasaranTarikan) {
            // TEPAT! (10 kali tarik)
            adakahTamat = true;
            
            // Gajah melangkah masuk ke dalam pentas di sebelah kiri
            gajah.style.right = "75%";
            document.getElementById("daun-sasaran").style.display = "none";
            document.getElementById("ikonGajah").innerHTML = "🐘🌿";
            
            awanDialog.classList.add("dialog-kiri"); 
            
            maklumBalas.innerHTML = "Berjaya: Gajah selamat diangkat menggunakan mesin ringkas!";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = `Status: Operasi takal sempurna. Beban dipindahkan.`;
            
            mainBunyi(sfxMenang);
            cakap("Akhirnya sampai juga! Daun sedap!", 3500);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 3000);

        } 
        else if (kaliUlang > sasaranTarikan) {
            // TERLAJAK (> 10) TALI PUTUS!
            adakahTamat = true;
            
            tali.classList.add("tali-putus"); // Tali ghaib putus
            gajah.classList.add("jatuh-hempas"); // Gajah jatuh tergolek bergegar
            
            maklumBalas.innerHTML = `Gagal: Anda menarik ${kaliUlang} kali melepasi had ketegangan tali!`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: AMARAN! TALI TAKAL PUTUS!";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🧶💥";
                document.getElementById("tajuk-kalah").innerHTML = "Tali Putus!";
                document.getElementById("pesan-kalah").innerHTML = `Had maksimum mesin takal ini adalah 10 tarikan. Tarikan anda sebanyak <strong>${kaliUlang} kali</strong> telah melebihi had menyebabkan tali putus dan gajah jatuh terhempas!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 2000);
        }
        else {
            // TERKURANG (< 10) JATUH BALIK BAWAH
            adakahTamat = true;
            
            // Gajah tergelongsor turun balik
            gajah.style.bottom = "60px";
            tali.style.height = "260px";
            roda.style.transform = `rotate(0deg)`; // Roda pusing balik laju
            
            maklumBalas.innerHTML = `Gagal: Tarikan ${kaliUlang} kali tidak cukup. Beban jatuh semula.`;
            maklumBalas.style.borderLeftColor = "#ff5e57";
            teksAnimasi.innerHTML = "Status: Gagal mencapai pentas. Berat gajah menarik tali kembali.";
            mainBunyi(sfxSalah);
            
            cakap("Aaaa! Jatuh balik!! Berat ni!!", 2500);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🐘📉";
                document.getElementById("tajuk-kalah").innerHTML = "Daya Tarikan Lemah!";
                document.getElementById("pesan-kalah").innerHTML = `Anda hanya menarik sebanyak <strong>${kaliUlang} kali</strong>. Beban gajah sangat berat dan ia telah tergelongsor jatuh kembali ke tanah. Anda memerlukan tepat 10 tarikan!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(jumlah){takal.tarik()}</code>";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogGajah");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}