let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN BAHAN (Local Storage) 🔥
const senaraiObjek = [
    { jenis: "batu", sifat: "legap", ikon: "🪨" },
    { jenis: "kaca", sifat: "lutsinar", ikon: "🧊" }
];

let indeksSemasa = localStorage.getItem("indexBahan6E");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiObjek.length;
}
localStorage.setItem("indexBahan6E", indeksSemasa);

let objekSemasa = senaraiObjek[indeksSemasa];

function mainBunyi(audioElemen, mulaMasa = 0) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = mulaMasa;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem bunyi audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", async function() {
    let objekUjian = document.getElementById("objek-ujian");
    let bayangDinding = document.getElementById("bayang-dinding");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Objek dijatuhkan ke platform ujian
    if(objekUjian) {
        objekUjian.innerHTML = objekSemasa.ikon;
        objekUjian.classList.add("objek-masuk");
    }
    // Set ikon bayang siap-siap (tapi masih halimunan)
    if(bayangDinding) {
        bayangDinding.innerHTML = objekSemasa.ikon;
    }
    
    await tunggu(1000); // Imbasan bahan
    
    if(skrinStatus) {
        skrinStatus.innerHTML = `"${objekSemasa.sifat}"`;
        if (objekSemasa.sifat === "legap") {
            skrinStatus.classList.add("status-legap");
        } else {
            skrinStatus.classList.add("status-lutsinar");
        }
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Objek ${objekSemasa.jenis} (${objekSemasa.sifat}) diletakkan.`;
    }
    
    if (objekSemasa.sifat === "legap") {
        cakapPekerja("Mesin letak Batu (Legap). Cahaya tak boleh tembus. Pastikan bayang dipaparkan!", 4000);
    } else {
        cakapPekerja("Mesin letak Blok Ais/Kaca (Lutsinar). Cahaya boleh tembus. Pastikan tiada bayang!", 4000);
    }
});

// KAWALAN BUKA/TUTUP PANDUAN
function bukaInfo() { 
    isPaused = true; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.add("paused"); 
    if(modal) modal.classList.add("tunjuk-modal-kustom"); 
}

function tutupInfo() { 
    isPaused = false; 
    let ruang = document.getElementById("ruangAnimasi");
    let modal = document.getElementById("modalInfo");
    if(ruang) ruang.classList.remove("paused"); 
    if(modal) modal.classList.remove("tunjuk-modal-kustom"); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-kustom-overlay')) {
        tutupInfo();
    }
}

async function laksanaArahanTahap6e() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let beamCahaya = document.getElementById("beam-cahaya");
    let bayangDinding = document.getElementById("bayang-dinding");
    let cahayaDinding = document.getElementById("cahaya-dinding");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Ujian selesai. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // DUA JENIS LOGIK YANG SAH (Pelajar boleh mula dari Legap atau Lutsinar)
    let regexLegapMula = /^if\(sifat=="legap"\)\{lampu\.papar_bayang\(\)\}else\{lampu\.tembus_cahaya\(\)\}$/;
    let regexLutsinarMula = /^if\(sifat=="lutsinar"\)\{lampu\.tembus_cahaya\(\)\}else\{lampu\.papar_bayang\(\)\}$/;

    let kodBerasaskanLegap = input.match(regexLegapMula);
    let kodBerasaskanLutsinar = input.match(regexLutsinarMula);

    if (kodBerasaskanLegap || kodBerasaskanLutsinar) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Mengaktifkan lampu suluh...";
            maklumBalas.style.borderLeftColor = "#f1c40f";
        }
        
        cakapPekerja("Lampu dinyalakan! Menilai sifat optik...", 2000);
        await tunggu(1000); 
        
        // Pancarkan cahaya ke objek (separuh jalan)
        if(beamCahaya) beamCahaya.style.width = "30%";
        mainBunyi(sfxBetul);
        await tunggu(800);
        
        // SITUASI 1: KOD BERASASKAN LEGAP
        if (kodBerasaskanLegap) {
            if (objekSemasa.sifat === "legap") {
                cakapPekerja("Syarat BENAR (Legap)! Cahaya tersekat, bayang terhasil.", 2500);
                await tunggu(1000);
                berjayaBayang();
            } else {
                cakapPekerja("Syarat PALSU (Bukan Legap)! Melompat ke ELSE: Cahaya menembusi objek.", 3000);
                await tunggu(1500);
                berjayaTembus();
            }
        } 
        // SITUASI 2: KOD BERASASKAN LUTSINAR
        else if (kodBerasaskanLutsinar) {
            if (objekSemasa.sifat === "lutsinar") {
                cakapPekerja("Syarat BENAR (Lutsinar)! Cahaya menembusi objek sepenuhnya.", 2500);
                await tunggu(1000);
                berjayaTembus();
            } else {
                cakapPekerja("Syarat PALSU (Bukan Lutsinar)! Melompat ke ELSE: Cahaya disekat, bayang terhasil.", 3000);
                await tunggu(1500);
                berjayaBayang();
            }
        }
        
        // FUNGSI ANIMASI MENANG (LEGAP - ADA BAYANG)
        async function berjayaBayang() {
            if(bayangDinding) bayangDinding.style.opacity = "0.9";
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Objek legap menghalang cahaya. Unjuran bayang jelas.";
            
            await tunggu(1500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }
        
        // FUNGSI ANIMASI MENANG (LUTSINAR - CAHAYA TEMBUS)
        async function berjayaTembus() {
            // Cahaya diteruskan sampai ke dinding
            if(beamCahaya) beamCahaya.style.width = "75%";
            await tunggu(300);
            if(cahayaDinding) cahayaDinding.style.opacity = "1"; // Dinding bercahaya kuning
            
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) teksAnimasi.innerHTML = "Status: Objek lutsinar. Cahaya tembus ke dinding.";
            
            await tunggu(1500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }

    } 
    else {
        // PENILAIAN JIKA KOD MURDER (Salah pasang logik)
        mainBunyi(sfxSalah);
        adakahSibuk = true;
        let kotakMesej = document.getElementById("pesan-kalah-teks");
        
        if (input.includes("if") && input.includes("else")) {
            let salahLegapTembus = input.match(/if\(sifat=="legap"\)\{lampu\.tembus_cahaya/);
            let salahLutsinarBayang = input.match(/if\(sifat=="lutsinar"\)\{lampu\.papar_bayang/);
            
            if (salahLegapTembus || salahLutsinarBayang) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda menyuruh batu lutsinar dan kaca berbayang pekat!";
                cakapPekerja("Hukum Fizik dilanggar! Batu tak boleh tembus cahaya!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik cahaya anda terbalik! Ingat, batu (legap) membentuk bayang, kaca (lutsinar) ditembusi cahaya.";
                
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: RALAT OPTIK!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses susunan skrip.", 3000);
                if(kotakMesej) kotakMesej.innerHTML = "Terdapat ralat pada struktur kurungan {} atau susunan ayat If-Else anda.";
            }
        } else {
            if(maklumBalas) maklumBalas.innerHTML = "Ralat Sintaks: Pastikan struktur if-else, kurungan <code>{}</code> dan ejaan tepat.";
            cakapPekerja("Struktur kod if-else tidak lengkap.", 3000);
            if(kotakMesej) kotakMesej.innerHTML = "Anda belum melengkapkan struktur If-Else yang betul. Rujuk Panduan Misi!";
        }
        
        if(maklumBalas) maklumBalas.style.borderLeftColor = "#e74c3c";

        setTimeout(() => {
            adakahTamat = true;
            let modalKalah = document.getElementById("modalKalah");
            if(modalKalah) modalKalah.classList.add("tunjuk-modal-kustom");
        }, 3000);
    }
}

function cakapPekerja(mesej, masa) {
    let kotakDialog = document.getElementById("dialogPekerja");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialog); 
        pemasaDialog = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}