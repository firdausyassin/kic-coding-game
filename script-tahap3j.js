let adakahTamat = false;
let adakahSibuk = false;

// SASARAN PEMBAHAGIAN: 12 pizza diagih pada 4 orang
const sasaranJumlah = 12;
const sasaranOrang = 4;

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

async function laksanaArahanTahap3j() {
    let inputAsal = document.getElementById("arahanInput").value;
    let input = inputAsal.toLowerCase().replace(/\s+/g, ''); 
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");
    let sfxMenang = document.getElementById("bunyiMenang");

    if (adakahTamat) {
        maklumBalas.innerHTML = "Ralat: Operasi pengagihan selesai. Sila muat semula (Refresh).";
        maklumBalas.style.borderLeftColor = "#ff5e57";
        mainBunyi(sfxSalah);
        return;
    }

    if (adakahSibuk) return;

    // RegEx Tangkap: Kalau letak teks berpetik ("12", "4")
    let cekAdaQuotes = input.match(/^pizza\.agih\((["'])\d+\1,(["'])\d+\2\)$/);
    if (cekAdaQuotes) {
        paparRalatPantas(sfxSalah, `Ralat Sintaks: Pengekodan matematik menggunakan unit Angka tulen! Jangan letak tanda petik <code>" "</code>.`);
        return;
    }

    // REGEX TEPAT: pizza.agih(angka, angka)
    let padananTepat = input.match(/^pizza\.agih\((\d+),(\d+)\)$/);

    if (padananTepat) {
        let bilPizza = parseInt(padananTepat[1]);
        let bilOrang = parseInt(padananTepat[2]);

        adakahSibuk = true;
        
        let dulangUtama = document.getElementById("dulang-utama");
        let kawasanPinggan = document.getElementById("kawasan-pinggan");
        
        // BERSIHKAN KANVAS SEBELUM MULA
        dulangUtama.innerHTML = ""; 
        kawasanPinggan.innerHTML = "";
        
        // LIMIT KESELAMATAN (Elak budak test nilai ribu-ribu)
        if (bilPizza > 30 || bilOrang > 10) {
            paparRalatPantas(sfxSalah, `Ralat Servis: Dapur hanya mampu masak maksima 30 keping, dan kedai hanya muat 10 pelanggan.`);
            adakahSibuk = false;
            return;
        }

        maklumBalas.innerHTML = `Memproses: Menghidangkan ${bilPizza} potong untuk ${bilOrang} orang...`;
        maklumBalas.style.borderLeftColor = "#f1c40f";
        teksAnimasi.innerHTML = `Status: Membakar ${bilPizza} potong pizza...`;

        // ==========================================
        // DYNAMIC SIZING (Bila pizza/pinggan terlampau banyak)
        // ==========================================
        let saizPizza = "25px";
        let saizPinggan = "80px";
        
        if (bilPizza >= 20) saizPizza = "15px";
        else if (bilPizza >= 12) saizPizza = "20px";
        
        if (bilOrang > 6) saizPinggan = "40px";
        else if (bilOrang > 4) saizPinggan = "60px";

        // ==========================================
        // 1. ANIMASI KELUARKAN PIZZA DI DULANG
        // ==========================================
        for (let i = 0; i < bilPizza; i++) {
            let p = document.createElement("div");
            p.className = "potongan-pizza";
            p.innerHTML = "🍕";
            p.style.fontSize = saizPizza;
            p.id = `pizza-${i}`;
            dulangUtama.appendChild(p);
            
            setTimeout(() => {
                p.classList.add("pizza-muncul");
                if (i % 3 === 0) mainBunyi(sfxBetul); 
            }, 50);
            await tunggu(50); 
        }

        teksAnimasi.innerHTML = `Status: Menyediakan meja untuk ${bilOrang} pelanggan...`;
        await tunggu(500);

        // ==========================================
        // 2. ANIMASI KELUARKAN PINGGAN
        // ==========================================
        for (let i = 0; i < bilOrang; i++) {
            let pinggan = document.createElement("div");
            pinggan.className = "pinggan";
            pinggan.style.width = saizPinggan;
            pinggan.style.height = saizPinggan;
            pinggan.setAttribute("data-nama", `P${i+1}`);
            pinggan.id = `pinggan-${i}`;
            kawasanPinggan.appendChild(pinggan);
            
            setTimeout(() => {
                pinggan.classList.add("pinggan-muncul");
                mainBunyi(sfxBetul); 
            }, 100);
            await tunggu(200); 
        }

        teksAnimasi.innerHTML = `Status: Mengagih ${bilPizza} potong pizza secara bergilir...`;
        await tunggu(600);

        // ==========================================
        // 3. ANIMASI AGIHAN (BAHAGI SAMA RATA / ROUND ROBIN)
        // ==========================================
        if (bilOrang > 0 && bilPizza > 0) {
            let indeksPinggan = 0;
            let kelajuanAgih = (bilPizza > 15) ? 100 : 250; // Agih laju sikit kalau banyak sangat
            
            for (let i = bilPizza - 1; i >= 0; i--) {
                let p = document.getElementById(`pizza-${i}`);
                let pingganTarget = document.getElementById(`pinggan-${indeksPinggan}`);
                
                // Pindah pizza dari dulang ke pinggan
                pingganTarget.appendChild(p);
                
                // Beri efek pop sikit lepas pindah
                p.classList.remove("pizza-muncul");
                
                setTimeout(() => {
                    p.classList.add("masuk-pinggan");
                    mainBunyi(sfxBetul); 
                }, 10);
                
                // Giliran pinggan seterusnya (Looping pembahagian)
                indeksPinggan++;
                if (indeksPinggan >= bilOrang) indeksPinggan = 0;
                
                await tunggu(kelajuanAgih); 
            }
        }

        // KIRAAN MATEMATIK SEBENAR UNTUK STATUS
        let dapatBerapa = (bilPizza / bilOrang).toFixed(2);
        let adaBaki = bilPizza % bilOrang;
        
        teksAnimasi.innerHTML = `Status: ${bilPizza} ÷ ${bilOrang} = Setiap orang dapat ${Math.floor(dapatBerapa)} potong.`;
        if (adaBaki !== 0) {
            teksAnimasi.innerHTML += ` (Baki: ${adaBaki})`;
        }

        await tunggu(800);

        // ==========================================
        // KEPUTUSAN PEMBAHAGIAN
        // ==========================================
        if (bilPizza === sasaranJumlah && bilOrang === sasaranOrang) {
            
            // JAWAPAN TEPAT (12 pizza, 4 orang)
            adakahTamat = true;
            maklumBalas.style.borderLeftColor = "#0be881";
            maklumBalas.innerHTML = "Sempurna: Pengagihan pembahagian tepat!";
            
            await tunggu(500);
            mainBunyi(sfxMenang);
            
            setTimeout(() => {
                document.getElementById("pesan-menang").innerHTML = `Hebat! Anda berjaya membahagikan ${bilPizza} potong pizza kepada ${bilOrang} orang pelanggan. Setiap pelanggan menerima tepat ${bilPizza/bilOrang} potong (${bilPizza} ÷ ${bilOrang} = ${bilPizza/bilOrang}).`;
                document.getElementById("modalKemenangan").classList.add("tunjuk-modal-kustom");
            }, 1000);

        } 
        else if (bilPizza === sasaranOrang && bilOrang === sasaranJumlah) {
            
            // JAWAPAN TERBALIK (4 pizza, 12 orang)
            document.getElementById("ikon-kalah").innerHTML = "🍽️❌";
            paparRalatKalah("Konsep Terbalik!", `Anda mengagihkan 4 keping pizza kepada 12 orang! Dalam fungsi matematik ini, parameter pertama mestilah jumlah makanan, dan parameter kedua adalah jumlah pembahagi (penerima).`);
        }
        else if (adaBaki !== 0) {
            // JAWAPAN TAK BOLEH BAHAGI SAMA RATA (Contoh: 12 pizza, 5 orang)
            document.getElementById("ikon-kalah").innerHTML = "⚖️❌";
            paparRalatKalah("Agihan Tidak Rata!", `Terdapat baki ${adaBaki} potong pizza yang tidak dapat diagihkan sama rata. Pelanggan VIP menuntut agihan yang tepat tanpa baki!`);
        }
        else {
            // JAWAPAN SALAH JUMLAH (Contoh: 10 pizza, 2 orang)
            document.getElementById("ikon-kalah").innerHTML = "📋❌";
            paparRalatKalah("Pesanan Ditolak!", `Meja ini membuat pesanan sebanyak ${sasaranJumlah} potong pizza untuk ${sasaranOrang} orang. Pesanan anda adalah ${bilPizza} pizza untuk ${bilOrang} orang.`);
        }

    } 
    else {
        paparRalatPantas(sfxSalah, "Ralat Sintaks: Guna format <code>pizza.agih(jumlah_objek, jumlah_kumpulan)</code> menggunakan nombor.");
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
    adakahTamat = false; // Boleh try lagi tanpa refresh
}

function bukaInfo() { document.getElementById("modalInfo").classList.add("tunjuk-modal-kustom"); }
function tutupInfo() { document.getElementById("modalInfo").classList.remove("tunjuk-modal-kustom"); }