let adakahTamat = false;
let adakahSibuk = false;

// Urutan Resepi yang Tepat
const urutanResepi = ["roti_bawah", "daging", "sayur", "roti_atas"];
let langkahSemasa = 0; 
let pemasaDialogChef;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Bunyi disekat sementara oleh browser.");
            });
        }
    }
}

function laksanaArahanTahap1c() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    
    let ikonChef = document.getElementById("ikon-chef");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Pesanan dah siap! Sila muat semula halaman (Refresh) untuk main semula.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) { return; } // Halang budak spam enter

    // Tangkap kod dengan format masuk.nama_bahan()
    let padananMasuk = input.match(/^masuk\.([a-z_]+)\(\)$/);

    if (padananMasuk) {
        let bahanDitaip = padananMasuk[1]; 
        let bahanSepatutnya = urutanResepi[langkahSemasa];

        // JIKA BAHAN BETUL MENGIKUT URUTAN
        if (bahanDitaip === bahanSepatutnya) {
            adakahSibuk = true;
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = `Berjaya: Bahan '${bahanDitaip.replace("_", " ")}' ditambah ke dalam hidangan!`;
            maklumBalas.style.borderLeftColor = "#0be881";
            
            // Animasi bahan jatuh
            let bahanElemen = document.getElementById(`bahan-${langkahSemasa}`);
            bahanElemen.classList.add("tunjuk-bahan");

            // Dialog Chef & Update Status
            if (langkahSemasa === 0) {
                teksAnimasi.innerHTML = "Status: Tapak sedia. Menunggu Daging...";
                cakapChef("Mantap! Tapak yang kukuh!", 2000);
            } else if (langkahSemasa === 1) {
                teksAnimasi.innerHTML = "Status: Daging dimasak. Menunggu Sayur...";
                cakapChef("Fuh, bau daging ni menyengat!", 2000);
            } else if (langkahSemasa === 2) {
                teksAnimasi.innerHTML = "Status: Sayur segar ditambah. Menunggu Roti Atas...";
                cakapChef("Sayur hijau untuk kesihatan!", 2000);
            } else if (langkahSemasa === 3) {
                teksAnimasi.innerHTML = "Status: BURGER GERGASI SIAP!";
                cakapChef("MAMMA MIA! Burger Gergasi Siap! 🍔", 3000);
                
                // Menang Game
                adakahTamat = true;
                setTimeout(() => {
                    let menangSfx = document.getElementById("bunyiMenang");
                    mainBunyi(menangSfx);
                    document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                }, 1500);
            }

            langkahSemasa++;
            setTimeout(() => { adakahSibuk = false; }, 800); // Masa untuk bahan mendarat habis

        } 
        // JIKA BAHAN SALAH URUTAN
        else {
            mainBunyi(sfxSalah);
            
            // Cek kalau dia taip bahan yang belum patut diletak atau bahan mengarut
            if (urutanResepi.includes(bahanDitaip)) {
                maklumBalas.innerHTML = `Ralat Urutan: Belum masa untuk letak '${bahanDitaip.replace("_", " ")}'. Sila letak '${bahanSepatutnya.replace("_", " ")}' dahulu!`;
                
                if (langkahSemasa === 0) cakapChef("Adoi! Kena letak tapak roti dulu lah!", 3000);
                else if (langkahSemasa === 1) cakapChef("Tungguuu! Daging tak letak lagi!", 3000);
                else cakapChef("Jangan tergopoh-gapah! Ikut resepi!", 3000);

            } else {
                maklumBalas.innerHTML = `Ralat Bahan: Kunci '${bahanDitaip}' tiada dalam resepi kita!`;
                cakapChef("Apa benda kau masuk ni? Rosak burger aku!", 3000);
            }
            
            maklumBalas.style.borderLeftColor = "#ff5e57";
        }
        
    } 
    // RALAT TYPO SINTAKS
    else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Sila rujuk Senarai Kod Bahan yang betul di panel arahan.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakapChef(mesej, masa) {
    let kotakDialog = document.getElementById("dialogChef");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialogChef); 
        pemasaDialogChef = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}