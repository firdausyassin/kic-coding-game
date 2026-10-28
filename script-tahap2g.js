let adakahTamat = false;
let adakahSibuk = false;
const kuantitiSasaran = 4;

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

async function laksanaArahanTahap2g() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); // Sedut dan buang space
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Kitaran pembiakan selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap: Kesilapan tiada quotes pada string ATAU letak quotes pada nombor
    // Ini check kalau format betul tak objek.tindakan("teks", angka)
    let formatSintaksSebenar = input.match(/^ayam\.biak\((["'])([a-z]+)\1,(\d+)\)$/);
    
    // Fallback errors untuk ajar budak
    let cekTanpaQuotesTeks = input.match(/^ayam\.biak\(([a-z]+),\d+\)$/);
    if (cekTanpaQuotesTeks) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks Teks: Kaedah pembiakan (${cekTanpaQuotesTeks[1]}) adalah perkataan. Sila kurung dengan tanda petik <code>" "</code>!`);
        return;
    }
    let cekAdaQuotesAngka = input.match(/^ayam\.biak\((["'])[a-z]+\1,(["'])\d+\2\)$/);
    if (cekAdaQuotesAngka) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks Angka: Kuantiti adalah nilai Matematik. Nombor TIDAK boleh diletakkan tanda petik!`);
        return;
    }

    // Jika berjaya melepasi tapisan sintaks
    if (formatSintaksSebenar) {
        let kaedahBiak = formatSintaksSebenar[2]; // bertelur atau beranak
        let nilaiKuantiti = parseInt(formatSintaksSebenar[3]); // Angka

        adakahSibuk = true;

        // VALIDASI FAKTA SAINS & MATEMATIK
        if (kaedahBiak === "bertelur" && nilaiKuantiti === kuantitiSasaran) {
            
            mainBunyi(sfxBetul);
            maklumBalas.innerHTML = "Kod disahkan. Ibu ayam mula bertelur...";
            maklumBalas.style.borderLeftColor = "#0be881";
            teksAnimasi.innerHTML = "Status: Menghasilkan zuriat...";

            let ibuAyam = document.getElementById("ibu-ayam");
            
            // Ayam terbang lompat ke atas untuk dedahkan telur
            ibuAyam.style.bottom = "230px";
            await tunggu(500);

            // Pop telur sebiji-sebiji pakai gelung (Loop)
            for (let i = 1; i <= kuantitiSasaran; i++) {
                let telur = document.getElementById("telur" + i);
                telur.classList.add("keluar-telur");
                mainBunyi(sfxBetul); // Bunyi pop pop pop pop
                await tunggu(300);
            }

            // Ayam mendarat kat tepi sangkar bangga
            ibuAyam.style.left = "25%";
            ibuAyam.style.bottom = "120px";

            adakahTamat = true;
            teksAnimasi.innerHTML = "Status: Pembiakan selesai!";
            maklumBalas.innerHTML = "Sempurna: Parameter Teks dan Angka tepat!";
            
            await tunggu(1000);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1500);

        } 
        // SALAH KAEDAH (FAKTA SAINS)
        else if (kaedahBiak === "beranak" || kaedahBiak === "melahirkan") {
            paparRalatKalah("Ayam Bukan Mamalia!", `Ayam adalah kumpulan haiwan jenis unggas/burung. Ayam tidak membiak secara "${kaedahBiak}". Sila tukar parameter pertama kepada kaedah yang betul!`);
        } 
        else if (kaedahBiak !== "bertelur") {
            paparRalatKalah("Istilah Tidak Sah!", `Istilah biologi "${kaedahBiak}" tidak dikenali. Pilih antara bertelur atau beranak.`);
        }
        // SALAH KUANTITI
        else if (nilaiKuantiti !== kuantitiSasaran) {
            paparRalatKalah("Kuantiti Tersasar!", `Anda meletakkan kuantiti sebanyak ${nilaiKuantiti} biji. Sila rujuk objektif misi, kita perlukan tepat ${kuantitiSasaran} biji telur sahaja.`);
        }

    } 
    // JIKA FORMAT MERAPU TERUK
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>ayam.biak(\"kaedah\", angka)</code> dengan koma sebagai pemisah.");
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
    document.getElementById("teksAnimasi").innerHTML = "Status: Fitrah pembiakan terganggu.";
    
    // Ayam goyang-goyang pening
    let ibuAyam = document.getElementById("ibu-ayam");
    ibuAyam.style.transform = "translateX(-50%) rotate(-15deg)";
    setTimeout(() => { ibuAyam.style.transform = "translateX(-50%) rotate(15deg)"; }, 150);
    setTimeout(() => { ibuAyam.style.transform = "translateX(-50%) rotate(0deg)"; }, 300);

    setTimeout(() => {
        document.getElementById("ikon-kalah").innerHTML = "🧬❌";
        document.getElementById("tajuk-kalah").innerHTML = tajuk;
        document.getElementById("pesan-kalah").innerHTML = mesej;
        document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
    }, 1000);
    
    adakahSibuk = false;
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }