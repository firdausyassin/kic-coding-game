let adakahTamat = false;
let adakahSibuk = false; 
const jumlahPokokSebenar = 5;
let pemasaDialogRobot;

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

async function laksanaArahanTahap2b() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kotakRobot = document.getElementById("kotak-robot");
    let paipAir = document.getElementById("paip-air");
    let awanDialog = document.getElementById("dialogRobot");
    let roda = document.getElementById("roda-robot");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) {
        maklumBalas.innerHTML = "Sistem: Droid sedang beroperasi. Sila tunggu sebentar...";
        maklumBalas.style.borderLeftColor = "#f39c12";
        return;
    }

    let padananArahan = input.match(/^robot\.siram\((\d+)\)$/);

    if (padananArahan) {
        let kuantitiDitaip = parseInt(padananArahan[1]);

        if (kuantitiDitaip === 0) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Logik: Kuantiti 0 bermaksud tiada siraman direkodkan!";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            cakapRobot("Bos, masuk nombor 0 nak saya siram angin ke?", 3000);
            return;
        }

        adakahSibuk = true;
        maklumBalas.innerHTML = `Sistem: Memproses pengiraan siraman sebanyak ${kuantitiDitaip} kali...`;
        maklumBalas.style.borderLeftColor = "#00cec9";
        
        // KORDINAT ROBOT BERHENTI MENYIRAM (Pokok di 20%, 35%, 50%, 65%, 80%)
        // Posisi Ke-6 (86%) ditambah khas untuk tunjukkan robot telajak menyiram di luar batas.
        const posisiRobot = [11, 26, 41, 56, 71, 86]; 
        
        // Hadkan animasi jalan ke maksima 6 perhentian sahaja (untuk tunjuk ralat terlajak)
        let hadAnimasi = Math.min(kuantitiDitaip, 6); 

        cakapRobot("Baik Bos! Enjin hidrolik dihidupkan!", 1500);
        await tunggu(1000); 

        roda.classList.add("roda-putar"); 

        // GELUNG BERJALAN & MENYIRAM (Maksimum 6 kali gerak)
        for (let langkah = 1; langkah <= hadAnimasi; langkah++) {
            
            let posIndex = langkah - 1;
            let targetX = posisiRobot[posIndex];

            // 1. Robot Bergerak
            roda.style.animationPlayState = "running";
            kotakRobot.style.left = `${targetX}%`;
            
            if (langkah >= 4) { awanDialog.classList.add("dialog-tepi"); }
            else { awanDialog.classList.remove("dialog-tepi"); }
            
            // Tunggu robot sampai (Transisi CSS 0.8s)
            await tunggu(850); 
            roda.style.animationPlayState = "paused"; 

            // 2. Siram Air & Bunyi "Ting!"
            paipAir.style.opacity = "1";
            mainBunyi(sfxBetul); 
            await tunggu(600); 

            // 3. Tutup Air & Pokok Mekar
            paipAir.style.opacity = "0";

            if (langkah <= jumlahPokokSebenar) {
                let pokok = document.getElementById(`pokok-${langkah}`);
                if (pokok) {
                    pokok.innerHTML = "🌻";
                    pokok.classList.add("pokok-mekar");
                }
            }

            // Rehat sekejap sebelum jalan ke tempat seterusnya
            await tunggu(400); 
        }

        roda.classList.remove("roda-putar");
        await tunggu(300);

        // ===================================
        // PENILAIAN JAWAPAN (MENANG / KALAH)
        // ===================================
        
        // KES 1: TEPAT 5 POKOK (MENANG)
        if (kuantitiDitaip === jumlahPokokSebenar) {
            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Semua 5 pokok berjaya disiram dan mekar cantik!";
            maklumBalas.innerHTML = "Berjaya: Parameter kuantiti air menepati sasaran tepat!";
            maklumBalas.style.borderLeftColor = "#0be881";
            
            cakapRobot("Tugas Selesai! Bunga dah kembang! 🤖🌻", 3000);
            
            setTimeout(() => {
                let menangSfx = document.getElementById("bunyiMenang");
                mainBunyi(menangSfx);
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);
        } 
        
        // KES 2: KURANG DARI 5 POKOK (TERKURANG)
        else if (kuantitiDitaip < jumlahPokokSebenar) {
            mainBunyi(sfxSalah);
            teksAnimasi.innerHTML = `Status: Masih ada ${jumlahPokokSebenar - kuantitiDitaip} pokok layu! Air tak cukup!`;
            maklumBalas.innerHTML = `Ralat Logik: Anda memasukkan angka ${kuantitiDitaip}. Bunga kembali layu kerana kekurangan air.`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            
            cakapRobot("Alamak! Tangki dah habis. Ada lagi layu ni!", 3500);
            
            setTimeout(() => {
                for(let i=1; i<=kuantitiDitaip; i++) {
                    let p = document.getElementById(`pokok-${i}`);
                    if(p) { p.innerHTML = "🥀"; p.classList.remove("pokok-mekar"); }
                }
                
                roda.classList.add("roda-putar");
                kotakRobot.style.left = "-15%"; 
                
                setTimeout(() => { roda.classList.remove("roda-putar"); adakahSibuk = false; }, 850);
            }, 2500);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🥀";
                document.getElementById("tajuk-kalah").innerHTML = "Misi Gagal!";
                document.getElementById("pesan-kalah").innerHTML = `Anda cuma mengarahkan robot menyiram ${kuantitiDitaip} pokok sahaja. Sila kira semula jumlah keseluruhan pokok layu di batas!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }
        
        // KES 3: LEBIH DARI 5 POKOK (BANJIR MAUT DI HUJUNG KANVAS)
        else {
            // Bunyi error dimainkan SELEPAS loop ke-6 tamat.
            mainBunyi(sfxSalah);
            teksAnimasi.innerHTML = "Status: BAHAYA! Kebun tenggelam akibat paip bocor dan banjir!";
            maklumBalas.innerHTML = `Ralat Parameter: Terdapat 5 pokok sahaja, tetapi anda siram ${kuantitiDitaip} kali!`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
            
            // Robot litar pintas & air terpancut tanpa henti
            paipAir.style.opacity = "1"; 
            document.getElementById("efek-banjir").style.height = "220px"; // Banjir naik tinggi!
            
            awanDialog.classList.add("marah-border");
            cakapRobot("BOS!! Litar saya litar pintas!! Banjirrrr!! 🌊", 4000);
            
            // Masa banjir naik (selepas 1 saat), SEMUA pokok bunga matahari bertukar layu on-the-spot!
            setTimeout(() => {
                for(let i=1; i<=5; i++) {
                    let p = document.getElementById(`pokok-${i}`);
                    if(p) { 
                        p.innerHTML = "🥀"; 
                        p.classList.remove("pokok-mekar"); 
                    }
                }
            }, 1000);

            // Pop-up amaran kekalahan muncul selepas 3 saat.
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🌊";
                document.getElementById("tajuk-kalah").innerHTML = "Banjir Besar!";
                document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan angka ${kuantitiDitaip} yang melebihi kuantiti sebenar pokok. Robot telah menyiram di luar kawasan tanaman dan menyebabkan kebun ditenggelami air!`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 3000);
        }

    } else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Pastikan ejaan tepat seperti -> <code>robot.siram(nombor)</code>";
        maklumBalas.style.borderLeftColor = "#e74c3c";
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakapRobot(mesej, masa) {
    let kotakDialog = document.getElementById("dialogRobot");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialogRobot); 
        pemasaDialogRobot = setTimeout(() => { 
            kotakDialog.classList.remove("buka-cakap"); 
            kotakDialog.classList.remove("marah-border");
        }, masa);
    }
}