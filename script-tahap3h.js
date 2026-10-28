let adakahTamat = false;
let adakahSibuk = false;

// SASARAN PENDARABAN: 3 kumpulan darab 4 ahli = 12 total
const sasaranKotak = 3;
const sasaranGuli = 4;
const totalSasaran = sasaranKotak * sasaranGuli;

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

async function laksanaArahanTahap3h() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi pembungkusan selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap: Kalau letak teks berpetik ("3", "4")
    let cekAdaQuotes = input.match(/^kilang\.bungkus\((["'])\d+\1,(["'])\d+\2\)$/);
    if (cekAdaQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Pendaraban menggunakan unit Angka tulen! Jangan letak tanda petik <code>" "</code>.`);
        return;
    }

    // REGEX TEPAT: kilang.bungkus(angka, angka)
    let padananTepat = input.match(/^kilang\.bungkus\((\d+),(\d+)\)$/);

    if (padananTepat) {
        let bilKotak = parseInt(padananTepat[1]);
        let bilGuli = parseInt(padananTepat[2]);

        adakahSibuk = true;
        
        let taliSawat = document.getElementById("tali-sawat");
        // BERSIHKAN TALI SAWAT SEBELUM MULA
        taliSawat.innerHTML = ""; 
        
        // LIMIT KESELAMATAN: Had maksimum 15 kotak dan 15 ahli
        if (bilKotak > 15 || bilGuli > 15) {
            paparRalatPantas(sfxSalah, `Ralat Kapasiti: Kilang ini maksimum memproses 15 kotak dan 15 ahli sekaligus.`);
            adakahSibuk = false;
            return;
        }

        maklumBalas.innerHTML = `Memproses: ${bilKotak} kumpulan darab ${bilGuli} ahli...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = `Status: Membina ${bilKotak} kotak...`;

        // ==========================================
        // LOGIK DINAMIK (DIBESARKAN SUPAYA NGAM-NGAM PENUH KANVAS)
        // ==========================================
        let setSaizKotak = "80px";
        let setSaizGuli = "15px";
        let setGapKotak = "25px";
        let setPaddingKotak = "8px";
        let setGapGuli = "4px";
        let setFontKotak = "10px";

        if (bilKotak >= 13) {
            // SANGAT KECIL (13-15 Kotak) - Dibesarkan secara drastik dari 25px ke 42px
            setSaizKotak = "42px"; 
            setSaizGuli = "6px"; 
            setGapKotak = "6px";   
            setPaddingKotak = "4px";
            setGapGuli = "2px";
            setFontKotak = "7px"; 
        } else if (bilKotak >= 10) {
            // KECIL (10-12 Kotak)
            setSaizKotak = "52px"; 
            setSaizGuli = "8px";
            setGapKotak = "8px";
            setPaddingKotak = "5px";
            setGapGuli = "3px";
            setFontKotak = "9px";
        } else if (bilKotak >= 6) {
            // SEDERHANA (6-9 Kotak)
            setSaizKotak = "65px";
            setSaizGuli = "10px";
            setGapKotak = "12px";
            setPaddingKotak = "6px";
            setGapGuli = "3px";
            setFontKotak = "10px";
        }
        
        // Ejas guli ekstra kecil kalau guli terlalu ramai
        if (bilGuli >= 10 && parseInt(setSaizGuli) > 4) {
            setSaizGuli = "4px";
            setGapGuli = "1px";
        }

        document.documentElement.style.setProperty('--font-kotak', setFontKotak);
        taliSawat.style.gap = setGapKotak;

        // ==========================================
        // KELAJUAN ANIMASI (Dikekalkan relax)
        // ==========================================
        let kelajuanAnimasi = (bilKotak >= 10) ? 250 : 400; 
        let kelajuanIsiGuli = (bilGuli >= 10) ? 80 : 180; 

        // ==========================================
        // ANIMASI BINA KOTAK
        // ==========================================
        for (let i = 0; i < bilKotak; i++) {
            let divKotak = document.createElement("div");
            divKotak.className = "kotak-kargo";
            divKotak.style.boxSizing = "border-box"; 
            divKotak.style.width = setSaizKotak;
            divKotak.style.height = setSaizKotak;
            divKotak.style.padding = setPaddingKotak;
            divKotak.style.gap = setGapGuli;
            
            let labelTeks = (bilKotak >= 10) ? `K${i+1}` : `Kotak ${i+1}`;
            divKotak.setAttribute("data-label", labelTeks);
            divKotak.id = `kotak-${i}`;
            
            taliSawat.appendChild(divKotak);
            
            setTimeout(() => {
                divKotak.classList.add("kotak-muncul");
                mainBunyi(sfxBetul); 
            }, 50); 
            
            await tunggu(kelajuanAnimasi); 
        }
        
        teksAnimasi.innerHTML = `Status: Mengisi ${bilGuli} guli ke setiap kotak...`;
        await tunggu(400);

        // ==========================================
        // ANIMASI ISI GULI
        // ==========================================
        for (let i = 0; i < bilKotak; i++) {
            let kotakSemasa = document.getElementById(`kotak-${i}`);
            
            for (let j = 0; j < bilGuli; j++) {
                let divGuli = document.createElement("div");
                divGuli.className = "guli-barang";
                divGuli.style.width = setSaizGuli;
                divGuli.style.height = setSaizGuli;
                kotakSemasa.appendChild(divGuli);
                
                setTimeout(() => {
                    divGuli.classList.add("guli-jatuh");
                    if (j % 2 === 0 || bilGuli <= 5) mainBunyi(sfxBetul); 
                }, 50);
                
                await tunggu(kelajuanIsiGuli); 
            }
            await tunggu(100); 
        }

        let totalSistem = bilKotak * bilGuli;
        teksAnimasi.innerHTML = `Status: ${bilKotak} × ${bilGuli} = ${totalSistem} Jumlah keseluruhan.`;

        // ==========================================
        // KEPUTUSAN PENDARABAN
        // ==========================================
        if (bilKotak === sasaranKotak && bilGuli === sasaranGuli) {
            
            adakahTamat = true;
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Konsep Kumpulan x Ahli diterjemahkan dengan tepat!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("pesan-menang").innerHTML = `Sempurna! Anda berjaya membina ${bilKotak} kumpulan (kotak) darab ${bilGuli} ahli (guli) untuk menghasilkan jumlah ${totalSasaran} biji guli secara tepat.`;
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        else if (bilKotak === sasaranGuli && bilGuli === sasaranKotak) {
            paparRalatKalah("Konsep Terbalik!", `Jumlah keseluruhan memang 12, tetapi urutannya terbalik! Operasi pendaraban bermaksud (Kumpulan x Ahli). Arahan anda menghasilkan 4 kotak, sedangkan sistem mahukan 3 kotak sahaja.`);
        }
        else {
            document.getElementById("ikon-kalah").innerHTML = "📦❌";
            paparRalatKalah("Jumlah Tidak Tepat!", `Arahan anda menghasilkan jumlah sebanyak ${totalSistem} guli. Kita memerlukan tepat ${totalSasaran} guli keseluruhannya. Semak nombor Kumpulan dan Ahli.`);
        }

    } 
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>kilang.bungkus(jumlah_kumpulan, isi_ahli)</code> menggunakan nombor.");
    }

    document.getElementById("arahanInput").value = "";
}

function paparRalatPantas(sfx, mesej) {
    mainBunyi(sfx);
    let maklumBalas = document.getElementById("maklumBalas");
    maklumBalas.style.borderLeftColor = "#ff5e57";
    maklumBalas.innerHTML = mesej;
}

function paparRalatKalah(tajuk, mesej) {
    mainBunyi(document.getElementById("bunyiSalah")); 
    
    document.getElementById("maklumBalas").style.borderLeftColor = "#ff5e57";

    setTimeout(() => {
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1500);
    
    adakahSibuk = false;
    adakahTamat = false; 
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }