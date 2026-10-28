let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialog;
let isPaused = false;

// 🔥 SISTEM GILIRAN GEOMETRI (Local Storage) 🔥
const senaraiBentuk = [
    { nama: "Kuboid", ciri: "seragam", ikon: "📦" },
    { nama: "Piramid", ciri: "menirus", ikon: "🔺" } // Diperbetulkan istilah matematik
];

let indeksSemasa = localStorage.getItem("indexBentuk6G");
if (indeksSemasa === null) {
    indeksSemasa = 0; 
} else {
    indeksSemasa = (parseInt(indeksSemasa) + 1) % senaraiBentuk.length;
}
localStorage.setItem("indexBentuk6G", indeksSemasa);

let bentukSemasa = senaraiBentuk[indeksSemasa];

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
    let objekBentuk = document.getElementById("objek-bentuk");
    let skrinStatus = document.getElementById("status-ciri");
    let teksStatus = document.getElementById("teksAnimasi");
    
    await tunggu(500); 
    
    // Objek 3D dihasilkan dalam hologram
    if(objekBentuk) {
        objekBentuk.innerHTML = bentukSemasa.ikon;
    }
    
    await tunggu(1000); // Masa mengimbas
    
    if(skrinStatus) {
        skrinStatus.innerHTML = `"${bentukSemasa.ciri}"`;
        skrinStatus.style.color = bentukSemasa.ciri === "seragam" ? "#2ecc71" : "#e74c3c";
    }
    
    if(teksStatus) {
        teksStatus.innerHTML = `Status: Bentuk ${bentukSemasa.nama} 3D diimbas. Menunggu arahan...`;
    }
    
    if (bentukSemasa.ciri === "seragam") {
        cakapPekerja("Mesin imbas bentuk Kuboid. Keratan rentasnya seragam! Ini adalah Prisma. Labelkan ia!", 4500);
    } else {
        cakapPekerja("Mesin imbas bentuk Piramid. Keratan rentasnya menirus ke atas, bukan seragam! Asingkan ia ke tepi!", 4500);
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

async function laksanaArahanTahap6g() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let objekBentuk = document.getElementById("objek-bentuk");
    let labelCop = document.getElementById("label-prisma");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        if(maklumBalas) {
            maklumBalas.innerHTML = "Sistem: Tugasan selesai. Sila muat semula (Refresh).";
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; }

    // 🔥 PARAMETER DIKEMASKINI DARI 'tapak' KE 'keratan' 🔥
    let regexPrisma = /^if\(keratan=="seragam"\)\{mesin\.label_prisma\(\)\}else\{mesin\.asingkan_objek\(\)\}$/;

    let padanan = input.match(regexPrisma);

    if (padanan) {
        adakahSibuk = true;
        adakahTamat = true;
        
        if(maklumBalas) {
            maklumBalas.innerHTML = "Logik Diterima. Melaksanakan klasifikasi algoritma...";
            maklumBalas.style.borderLeftColor = "#e056fd";
        }
        
        cakapPekerja("Menyemak sifat keratan rentas pada objek hologram...", 2000);
        await tunggu(1500); 
        
        // SITUASI 1: PRISMA (KUBOID - SERAGAM)
        if (bentukSemasa.ciri === "seragam") {
            cakapPekerja("Syarat BENAR! Keratan seragam. Mengaktifkan sistem label prisma.", 2500);
            await tunggu(1000);
            berjayaLabel();
        } 
        // SITUASI 2: BUKAN PRISMA (PIRAMID - MENIRUS - LOMPAT KE ELSE)
        else {
            cakapPekerja("Syarat PALSU! Keratan tidak seragam. Melompat ke fungsi ELSE untuk diasingkan.", 3500);
            await tunggu(1500);
            berjayaAsing();
        }
        
        // FUNGSI ANIMASI MENANG (LABEL PRISMA)
        async function berjayaLabel() {
            if(labelCop) labelCop.classList.add("cop-muncul");
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) {
                teksAnimasi.innerHTML = "Status: Berjaya! Kuboid dilabelkan sebagai Prisma.";
                teksAnimasi.style.borderColor = "#2ecc71";
            }
            
            await tunggu(1500);
            let menangSfx = document.getElementById("bunyiMenang");
            mainBunyi(menangSfx);
            let modalMenang = document.getElementById("modalKemenangan");
            if(modalMenang) modalMenang.classList.add("tunjuk-modal-kustom");
        }
        
        // FUNGSI ANIMASI MENANG (ASINGKAN BUKAN PRISMA)
        async function berjayaAsing() {
            // Objek dibaling masuk tong asing
            if(objekBentuk) objekBentuk.classList.add("objek-terpelanting");
            mainBunyi(sfxBetul);
            
            if(teksAnimasi) {
                teksAnimasi.innerHTML = "Status: Tepat! Piramid diasingkan kerana bukan Prisma.";
                teksAnimasi.style.borderColor = "#2ecc71";
            }
            
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
            let salahTerbalik = input.match(/if\(keratan=="seragam"\)\{mesin\.asingkan_objek/);
            
            if (salahTerbalik) {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Kritikal: Anda mengasingkan Prisma dan melabel bentuk yang salah!";
                cakapPekerja("Aduhai! Kalau keratannya seragam, ia mesti dilabel sebagai Prisma!", 4000);
                if(kotakMesej) kotakMesej.innerHTML = "Logik klasifikasi anda terbalik! Ingat, bentuk berkeratan rentas seragam WAJIB dilabelkan (label_prisma), manakala selainnya diasingkan (asingkan_objek).";
                
                if(teksAnimasi) {
                    teksAnimasi.innerHTML = "Status: RALAT KLASIFIKASI!";
                    teksAnimasi.style.borderColor = "#e74c3c";
                    teksAnimasi.style.color = "#e74c3c";
                }
                
            } else {
                if(maklumBalas) maklumBalas.innerHTML = "Ralat Logik: Semak semula padanan ejaan dan struktur {}.";
                cakapPekerja("Sistem gagal memproses logik matematik anda.", 3000);
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