let adakahTamat = false;
let adakahSibuk = false; 

// State Machine
let posisiMonyet = "bawah"; 
let kelapaDiPokok = 3;
let kelapaDiBakul = 0;
let tungguUpah = false;

let pemasaDialogMonyet;
let pemasaDialogTuan;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Bunyi auto-play disekat sementara oleh browser.");
            });
        }
    }
}

function laksanaArahanTahap1b() {
    let input = document.getElementById("arahanInput").value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let kotakMonyet = document.getElementById("kotak-monyet");
    let kelapaTangan = document.getElementById("kelapa-tangan");
    let pisangTerbang = document.getElementById("pisang-terbang");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula (Refresh) halaman.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) {
        maklumBalas.innerHTML = "Sistem: Monyet sedang bergerak! Sila tunggu sebentar...";
        maklumBalas.style.borderLeftColor = "#f39c12";
        return;
    }

    // ----------------------------------------------------
    // ARAHAN 1: MONYET PANJAT
    // ----------------------------------------------------
    if (input === "monyet.panjat()") {
        
        if (tungguUpah) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Logik: Kerja dah siap! Monyet sedang tunggu upah pisang.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            cakapMonyet("Uuk aak! Mana pisang aku?", 3000);
            return;
        }

        if (posisiMonyet === "atas") {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Logik: Monyet memang dah ada dekat atas pokok!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            cakapMonyet("Eh, aku dah kat atas ni!", 2500);
            return;
        }

        adakahSibuk = true;
        posisiMonyet = "atas";
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Berjaya: Monyet memanjat pokok...";
        maklumBalas.style.borderLeftColor = "#0be881";
        
        // Animasi Kekal Asal
        kotakMonyet.style.bottom = "260px"; 
        cakapMonyet("Uuk aak! Panjat!", 1500);

        setTimeout(() => {
            if (kelapaDiPokok > 0) {
                document.getElementById(`kelapa-p${kelapaDiPokok}`).style.opacity = "0";
                kelapaTangan.style.opacity = "1";
                
                kelapaDiPokok--;
                teksAnimasi.innerHTML = `Status: Monyet berjaya petik 1 kelapa. (Baki di pokok: ${kelapaDiPokok})`;
                cakapMonyet("Dapat kelapa!", 2000);
            }
            adakahSibuk = false; 
        }, 800);

    }
    // ----------------------------------------------------
    // ARAHAN 2: MONYET TURUN
    // ----------------------------------------------------
    else if (input === "monyet.turun()") {
        
        if (posisiMonyet === "bawah") {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Logik: Monyet memang dah ada dekat bawah!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            cakapMonyet("Aku memang kat tanah la!", 2500);
            return;
        }

        adakahSibuk = true;
        posisiMonyet = "bawah";
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Berjaya: Monyet membawa kelapa turun ke bawah...";
        maklumBalas.style.borderLeftColor = "#0be881";
        
        // Animasi Kekal Asal
        kotakMonyet.style.bottom = "120px"; 
        cakapMonyet("Wooshhh turun!", 1500);

        setTimeout(() => {
            kotakMonyet.style.left = "45%"; 
            
            setTimeout(() => {
                kelapaTangan.style.opacity = "0"; 
                
                kelapaDiBakul++;
                document.getElementById(`kelapa-b${kelapaDiBakul}`).style.opacity = "1"; 
                mainBunyi(sfxBetul);
                
                teksAnimasi.innerHTML = `Status: ${kelapaDiBakul} kelapa selamat dimasukkan ke dalam bakul.`;
                cakapMonyet("Siap masuk bakul!", 2000);
                
                setTimeout(() => {
                    kotakMonyet.style.left = "23%"; 
                    
                    if (kelapaDiBakul === 3) {
                        tungguUpah = true;
                        teksAnimasi.innerHTML = "Status: SEMUA KELAPA SELESAI! Sila minta upah dari tuan.";
                        maklumBalas.innerHTML = "Kerja siap! Taipkan kod <code>tuan.beri_pisang()</code> untuk upah.";
                        maklumBalas.style.borderLeftColor = "#f39c12";
                        cakapMonyet("Kerja siap! Mana pisang?", 4000);
                    }
                    
                    adakahSibuk = false; 
                }, 800);
                
            }, 600);
        }, 800);
        
    }
    // ----------------------------------------------------
    // ARAHAN 3: TUAN BERI PISANG (KEMENANGAN)
    // ----------------------------------------------------
    else if (input === "tuan.beri_pisang()") {
        
        if (!tungguUpah) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Senario: Kerja belum siap! Selesaikan 3 biji kelapa dahulu.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            cakapTuan("Siapkan kerja dulu baru dapat pisang!", 3000);
            return;
        }

        adakahSibuk = true;
        adakahTamat = true;
        mainBunyi(sfxBetul);
        
        maklumBalas.innerHTML = "Berjaya: Tuan memberikan pisang sebagai ganjaran!";
        maklumBalas.style.borderLeftColor = "#0be881";
        
        cakapTuan("Bagus Mat! Nah ambil pisang ni!", 2000);
        
        // Animasi Pisang Kekal Asal
        setTimeout(() => {
            pisangTerbang.style.left = "50%"; 
            pisangTerbang.style.bottom = "280px"; 
            
            setTimeout(() => {
                pisangTerbang.style.left = "23%"; 
                pisangTerbang.style.bottom = "160px"; 
                
                setTimeout(() => {
                    pisangTerbang.style.opacity = "0"; 
                    document.getElementById("ikon-monyet").innerHTML = "🐒🍌"; 
                    kotakMonyet.style.bottom = "160px"; 
                    
                    cakapMonyet("Yahuuuu! Pisangg sedappp! 🤩", 3000);
                    
                    setTimeout(() => {
                        kotakMonyet.style.bottom = "120px"; 
                        let menangSfx = document.getElementById("bunyiMenang");
                        mainBunyi(menangSfx);
                        
                        setTimeout(() => {
                            document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
                        }, 1500);
                    }, 500);
                    
                }, 400); 
            }, 400); 
        }, 1500);

    } 
    else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Arahan tidak ditaip dengan betul. Rujuk Senarai Kod.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }

    document.getElementById("arahanInput").value = "";
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }

function cakapMonyet(mesej, masa) {
    let kotakDialog = document.getElementById("dialogMonyet");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialogMonyet); 
        pemasaDialogMonyet = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}

function cakapTuan(mesej, masa) {
    let kotakDialog = document.getElementById("dialogTuan");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("buka-cakap");
        clearTimeout(pemasaDialogTuan); 
        pemasaDialogTuan = setTimeout(() => { kotakDialog.classList.remove("buka-cakap"); }, masa);
    }
}