let jumlahAir = 0;
let jumlahBaja = 0;
let hariTinggal = 3; 
let adakahMati = false;
let adakahSibuk = false;

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

function laksanaArahanTahap2() {
    let inputElement = document.getElementById("arahanInput");
    let input = inputElement.value.toLowerCase().replace(/\s+/g, '');
    let maklumBalas = document.getElementById("maklumBalas");
    
    let pokok = document.getElementById("pokok");
    let epal = document.getElementById("buah-epal");
    let kesanAir = document.getElementById("kesanAir");
    let kesanBaja = document.getElementById("kesanBaja");

    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahMati) {
        maklumBalas.innerHTML = "Ralat: Misi telah tamat. Sila muat semula kanvas (Refresh) untuk bermula kembali.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return; // Elak budak spam enter masa nutrisi tengah jatuh

    let padananSiram = input.match(/^pokok\.siram\((\d+)\)$/);
    let padananBaja = input.match(/^pokok\.baja\((\d+)\)$/);

    // ===================================
    // LOGIK SIRAM POKOK
    // ===================================
    if (padananSiram) {
        let nilaiInput = parseInt(padananSiram[1]);
        if (nilaiInput <= 0) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Operasi: Nilai liter air di dalam parameter mestilah sekurang-kurangnya 1!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
        } else {
            adakahSibuk = true;
            jumlahAir += nilaiInput;
            hariTinggal--; 
            
            document.getElementById("valAir").innerHTML = jumlahAir;
            document.getElementById("valHari").innerHTML = hariTinggal;
            
            maklumBalas.innerHTML = `Berjaya: Anda menyiram ${nilaiInput} Liter air kepada pokok.`;
            maklumBalas.style.borderLeftColor = "#3498db";
            mainBunyi(sfxBetul);
            
            // Animasi Air Jatuh Menghempas (Graviti)
            setTimeout(() => { kesanAir.classList.add("turun-nutrisi"); }, 50);
            
            setTimeout(() => { 
                kesanAir.classList.remove("turun-nutrisi"); 
                semakTumbesaran();
                adakahSibuk = false;
            }, 700); // Tunggu air siap jatuh baru check status pokok
        }
    }
    // ===================================
    // LOGIK BAJA POKOK
    // ===================================
    else if (padananBaja) {
        let nilaiInput = parseInt(padananBaja[1]);
        if (nilaiInput <= 0) {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = "Ralat Operasi: Nilai gram baja di dalam parameter mestilah sekurang-kurangnya 1!";
            maklumBalas.style.borderLeftColor = "#ff5e57";
        } else {
            adakahSibuk = true;
            jumlahBaja += nilaiInput;
            hariTinggal--; 
            
            document.getElementById("valBaja").innerHTML = jumlahBaja;
            document.getElementById("valHari").innerHTML = hariTinggal;
            
            maklumBalas.innerHTML = `Berjaya: Anda menabur ${nilaiInput} Gram baja pada akar.`;
            maklumBalas.style.borderLeftColor = "#e67e22";
            mainBunyi(sfxBetul);

            // Animasi Baja Jatuh Menghempas (Graviti)
            setTimeout(() => { kesanBaja.classList.add("turun-nutrisi"); }, 50);
            
            setTimeout(() => { 
                kesanBaja.classList.remove("turun-nutrisi"); 
                semakTumbesaran();
                adakahSibuk = false;
            }, 700); // Tunggu baja siap jatuh baru check status
        }
    }
    // JIKA SINTAKS SALAH ATAU BUKAN PARAMETER NOMBOR
    else if (input !== "") {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Guna format <code>pokok.siram(angka)</code> atau <code>pokok.baja(angka)</code>.";
        maklumBalas.style.borderLeftColor = "#ff5e57";
    }

    inputElement.value = "";

    // ===================================
    // ENJIN PENILAIAN TUMBESARAN POKOK
    // ===================================
    function semakTumbesaran() {
        let teksAnimasi = document.getElementById("teksAnimasi");
        let jumlahKombinasi = jumlahAir + jumlahBaja;
        
        // GAGAL 1: TERLEBIH NUTRISI (OVERDOSE)
        if (jumlahAir > 2 || jumlahBaja > 1) {
            adakahMati = true;
            pokok.innerHTML = "🥀"; 
            pokok.style.fontSize = "80px"; 
            epal.classList.remove("keluar-buah"); // Hilangkan epal kalau ada
            
            teksAnimasi.innerHTML = "Status: Pokok layu dan mati akibat lebihan nutrisi! 💀";
            maklumBalas.innerHTML = "Misi Gagal: Ekosistem rosak. Akar melecur akibat lebihan baja/air.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);
            
            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "🥀";
                document.getElementById("tajuk-kalah").innerHTML = "Terlebih Dos Nutrisi!";
                document.getElementById("pesan-kalah").innerHTML = `Anda telah meletakkan ${jumlahAir}L Air dan ${jumlahBaja}g Baja.<br><br>Lebihan air membusukkan akar, manakala lebihan baja membakar pokok sehingga layu.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
            return;
        }

        // MENANG: SEMPURNA (Tepat 2 Air, 1 Baja)
        if (jumlahAir === 2 && jumlahBaja === 1) {
            adakahMati = true; 
            pokok.innerHTML = "🌳";
            pokok.style.fontSize = "170px"; 
            
            setTimeout(() => {
                epal.classList.add("keluar-buah"); // Epal pop!
            }, 500);
            
            teksAnimasi.innerHTML = "Status: Sempurna! Pokok membesar dan menghasilkan buah.";
            mainBunyi(sfxMenang);

            setTimeout(() => {
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 2500);
            return;
        }

        // GAGAL 2: MASA (HARI) TAMAT TAPI TAK CUKUP NUTRISI
        if (hariTinggal === 0 && (jumlahAir < 2 || jumlahBaja < 1)) {
            adakahMati = true;
            pokok.innerHTML = "🥀"; 
            pokok.style.fontSize = "80px";
            teksAnimasi.innerHTML = "Status: Misi Gagal! Masa tamat sebelum pokok sempat matang... ⏳";
            maklumBalas.innerHTML = "Ralat: Had 3 hari telah tamat. Pokok terbantut mati.";
            maklumBalas.style.borderLeftColor = "#ff5e57";
            mainBunyi(sfxSalah);

            setTimeout(() => {
                document.getElementById("ikon-kalah").innerHTML = "⏳";
                document.getElementById("tajuk-kalah").innerHTML = "Masa Tempoh Tamat!";
                document.getElementById("pesan-kalah").innerHTML = `Baki hari telah habis tetapi anda baru memberi ${jumlahAir}L Air dan ${jumlahBaja}g Baja.<br><br>Nutrisi tidak mencukupi untuk membesarkan pokok di dalam tempoh 3 Hari.`;
                document.getElementById("modalKalah").classList.add("tunjuk-modal-kustom");
            }, 1500);
            return;
        }

        // FASA EVOLUSI (Jika permainan masih berjalan)
        if (jumlahKombinasi === 1) {
            pokok.innerHTML = "🌿";
            pokok.style.fontSize = "90px"; 
            teksAnimasi.innerHTML = "Status: Biji benih telah bercambah menjadi anak pokok.";
        }
        else if (jumlahKombinasi === 2) {
            pokok.innerHTML = "🌳";
            pokok.style.fontSize = "130px"; 
            teksAnimasi.innerHTML = "Status: Pokok muda sedang membesar dengan subur!";
        }
    }
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }