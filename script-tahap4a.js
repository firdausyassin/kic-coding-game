let adakahTamat = false;
let adakahSibuk = false;
const jumlahDaunSediaAda = 5;
let pemasaDialog; 

function laksanaArahanTahap4a() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kotakUlat = document.getElementById("kotak-ulat");
    let dialogUlat = document.getElementById("dialogUlat");
    let ikon = document.getElementById("ikonUlat");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        if(sfxSalah) { sfxSalah.pause(); sfxSalah.currentTime = 0; sfxSalah.play(); }
        return;
    }

    if(adakahSibuk) return;

    let padananUlang = input.match(/^ulang\((\d+)\)\{ulat\.makan\(\)\}$/);

    if (padananUlang) {
        let jumlahUlang = parseInt(padananUlang[1]);
        
        if (jumlahUlang === 0) {
            maklumBalas.innerHTML = "Ralat: Gelung sifar tidak akan melaksanakan apa-apa!";
            maklumBalas.style.borderLeftColor = "#e74c3c";
            if(sfxSalah) { sfxSalah.pause(); sfxSalah.currentTime = 0; sfxSalah.play(); }
            cakap("Eh? Tak jadi makan ke?", 2500);
            return;
        }

        adakahSibuk = true;
        
        maklumBalas.innerHTML = `Sistem: Gelung (Loop) diaktifkan sebanyak ${jumlahUlang} kali...`;
        maklumBalas.style.borderLeftColor = "#2ecc71";
        
        let langkahSemasa = 0;
        let posisiUlat = 10; 

        // LOGIK HAD ANIMASI (Cap maksimum pergerakan untuk elak tunggu lama)
        let limitAnimasi = jumlahUlang;
        let meletup = false;
        
        if (jumlahUlang > jumlahDaunSediaAda) {
            // Kalau taip > 5 (Contoh: 100), kita jalankan animasi 6 kali je.
            // Langkah ke-6 perut akan meletup.
            limitAnimasi = jumlahDaunSediaAda + 1; 
            meletup = true;
        }

        cakap("Nyam nyam... Mari makan!", 1500);

        let makanInterval = setInterval(() => {
            langkahSemasa++;
            posisiUlat += 15; // Jarak bergerak ke daun seterusnya
            
            kotakUlat.style.left = `${posisiUlat}%`;
            
            // Urus dialog position kalau terlajak hujung skrin
            if (posisiUlat >= 90) { 
                dialogUlat.style.left = "80%"; 
                dialogUlat.style.bottom = "160px"; 
                dialogUlat.classList.add("dialog-terlajak"); 
            } else {
                dialogUlat.style.left = `${posisiUlat}%`; 
                dialogUlat.style.bottom = "220px"; 
                dialogUlat.classList.remove("dialog-terlajak");
            }

            // Kalau masih ada daun, hilangkan daun
            if (langkahSemasa <= jumlahDaunSediaAda) {
                let daun = document.getElementById(`daun-${langkahSemasa}`);
                if (daun) {
                    setTimeout(() => {
                        daun.style.transform = "scale(0)"; 
                        daun.style.opacity = "0"; 
                        if(sfxBetul) { sfxBetul.pause(); sfxBetul.currentTime = 0; sfxBetul.play(); }
                    }, 500); 
                }
            }

            // HENTIKAN LOOP APABILA MENCECAH LIMIT ANIMASI
            if (langkahSemasa === limitAnimasi) {
                clearInterval(makanInterval); 
                
                setTimeout(() => {
                    // ==========================================
                    // KES 1: Terlebih Makan (MELETUP!)
                    // ==========================================
                    if (meletup) {
                        ikon.innerHTML = "💥"; 
                        teksAnimasi.innerHTML = "Status: Ralat Logik! Ulat terlebih makan!";
                        maklumBalas.innerHTML = `Gagal: Anda paksa ulat makan ${jumlahUlang} kali, tapi daun hanya ada 5!`;
                        maklumBalas.style.borderLeftColor = "#e74c3c";
                        cakap("Aduhhh perut aku meletuuup! 💢", 3000); 
                        if(sfxSalah) { sfxSalah.pause(); sfxSalah.currentTime = 0; sfxSalah.play(); }
                        
                        setTimeout(() => {
                            document.getElementById("ikon-kalah").innerHTML = "💥🐛";
                            document.getElementById("tajuk-kalah").innerHTML = "Terlebih Suap!";
                            document.getElementById("pesan-kalah").innerHTML = `Anda mengarahkan ulat makan sebanyak ${jumlahUlang} kali, sedangkan daun hanya ada 5. Akibatnya perut ulat meletup kerana tidak dapat menampung arahan gelung yang berlebihan!`;
                            document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                        }, 2000);
                        
                        adakahTamat = true;
                    }
                    // ==========================================
                    // KES 2: Tepat 5 Helai (MENANG)
                    // ==========================================
                    else if (jumlahUlang === jumlahDaunSediaAda) {
                        ikon.innerHTML = "🥜"; 
                        ikon.style.fontSize = "75px";
                        teksAnimasi.innerHTML = "Status: Ulat membungkus diri menjadi kepompong!";
                        maklumBalas.innerHTML = "Berjaya: Parameter gelung tepat dengan jumlah objek.";
                        cakap("Kenyang! Masa untuk tidur... 💤", 3000);
                        
                        setTimeout(() => {
                            ikon.innerHTML = "🦋"; 
                            ikon.style.fontSize = "80px";
                            
                            kotakUlat.style.left = "50%"; 
                            kotakUlat.style.bottom = "350px"; 
                            
                            dialogUlat.style.left = "50%";
                            dialogUlat.style.bottom = "450px";
                            dialogUlat.classList.remove("dialog-terlajak"); 
                            
                            cakap("Wah! Aku dah bebas! 🌸", 5000);
                            if(sfxMenang) sfxMenang.play();
                            
                            setTimeout(() => {
                                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                            }, 3000);
                        }, 3500);
                        
                        adakahTamat = true;
                    } 
                    // ==========================================
                    // KES 3: Terkurang Makan (< 5)
                    // ==========================================
                    else if (jumlahUlang < jumlahDaunSediaAda) {
                        ikon.innerHTML = "😵";
                        teksAnimasi.innerHTML = "Status: Ulat kelaparan dan pengsan!";
                        maklumBalas.innerHTML = `Gagal: Anda hanya suap ${jumlahUlang} daun. Baki ${jumlahDaunSediaAda - jumlahUlang} daun terbiar.`;
                        maklumBalas.style.borderLeftColor = "#e74c3c";
                        cakap("Lapar lagi ni... tak cukup tenaga nak membesar!", 3000);
                        if(sfxSalah) { sfxSalah.pause(); sfxSalah.currentTime = 0; sfxSalah.play(); }
                        
                        setTimeout(() => {
                            document.getElementById("ikon-kalah").innerHTML = "🐛📉";
                            document.getElementById("tajuk-kalah").innerHTML = "Kurang Tenaga!";
                            document.getElementById("pesan-kalah").innerHTML = `Anda memasukkan nilai loop ${jumlahUlang} sahaja. Ulat ini memerlukan 5 helai daun untuk membesar menjadi rama-rama.`;
                            document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
                        }, 2000);
                        
                        adakahTamat = true;
                    }
                }, 800); 
            }
        }, 800);

    } else if (input !== "") {
        maklumBalas.innerHTML = "Ralat Sintaks: Ikut format -> <code>ulang(nombor){ulat.makan()}</code>";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        if(sfxSalah) { sfxSalah.pause(); sfxSalah.currentTime = 0; sfxSalah.play(); }
    }
    
    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakap(mesej, masa) {
    let kotakDialog = document.getElementById("dialogUlat");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        
        clearTimeout(pemasaDialog); 
        
        pemasaDialog = setTimeout(() => { 
            kotakDialog.classList.remove("tunjuk-dialog"); 
        }, masa);
    }
}