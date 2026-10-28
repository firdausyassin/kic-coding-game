let adakahTamat = false;
let adakahSibuk = false; 
let pemasaDialogSistem;

// Parameter Soalan
let kargoAsal = Math.floor(Math.random() * 2) + 2;   // 2 hingga 3
let kargoTambah = Math.floor(Math.random() * 3) + 3; // 3 hingga 5
let kargoBuang = Math.floor(Math.random() * 2) + 1;  // 1 hingga 2
let jumlahMuktamad = kargoAsal + kargoTambah - kargoBuang;

function mainBunyi(audioElemen) {
    if (audioElemen) {
        audioElemen.pause();
        audioElemen.currentTime = 0;
        let playPromise = audioElemen.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log("Sistem audio disekat."); });
        }
    }
}

const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = async function() {
    let teksStatus = document.getElementById("teksAnimasi");
    let lori1 = document.getElementById("lori1");
    let lori2 = document.getElementById("lori2");
    let container = document.getElementById("container-kargo-fizikal");
    
    await tunggu(500); 
    teksStatus.innerHTML = `Tugasan: Logistik memerlukan baki ${jumlahMuktamad} kotak. (Asal: ${kargoAsal}, Tambah: ${kargoTambah}, Buang: ${kargoBuang})`;
    
    // Lori 1 dan Lori 2 mengambil posisi di tengah hab
    lori1.style.left = "45%";
    lori2.style.left = "45%";

    // Janakan kotak asal di atas Sawat 1 dan Sawat 2 sebagai placeholder visual awal
    container.innerHTML = "";
    for(let i=0; i<kargoAsal; i++) {
        // Kotak Lori 1 (Atas) - Base bottom diselaraskan kepada 115px (Ngam atas sawat 1)
        let k1 = document.createElement("div");
        k1.className = "kotak-kargo"; k1.innerHTML = "📦";
        k1.style.left = `${10 + (i * 8)}%`; k1.style.bottom = "115px";
        k1.id = `k1-asal-${i}`;
        container.appendChild(k1);

        // Kotak Lori 2 (Bawah) - Base bottom diselaraskan kepada 10px (Ngam atas sawat 2)
        let k2 = document.createElement("div");
        k2.className = "kotak-kargo"; k2.innerHTML = "🧃";
        k2.style.left = `${10 + (i * 8)}%`; k2.style.bottom = "10px";
        k2.id = `k2-asal-${i}`;
        container.appendChild(k2);
    }
    
    cakapSistem("Dua lori logistik telah bersedia. Masukkan formula gabungan perindustrian untuk menguruskan kargo berkembar!", 4500);
}

// 🔥 FUNGSI TERBANG MENGGUNAKAN EVENT-DRIVEN PROMISE 🔥
function terbangkanKotakPintar(elemenKotak, targetLeft, targetBottom) {
    return new Promise((resolve) => {
        const tamatHandler = (e) => {
            if (e.propertyName === 'left' || e.propertyName === 'bottom') {
                elemenKotak.removeEventListener('transitionend', tamatHandler);
                resolve(); 
            }
        };
        elemenKotak.addEventListener('transitionend', tamatHandler);
        
        elemenKotak.style.left = targetLeft;
        elemenKotak.style.bottom = targetBottom;
    });
}

async function laksanaArahanTahap7d() {
    let inputKotor = document.getElementById("arahanInput").value.toLowerCase();
    let input = inputKotor.replace(/[\s\n\r]+/g, ''); 
    
    let maklumBalas = document.getElementById("maklumBalas");
    let teksAnimasi = document.getElementById("teksAnimasi");
    let container = document.getElementById("container-kargo-fizikal");
    let lori1 = document.getElementById("lori1");
    let lori2 = document.getElementById("lori2");
    
    let sfxBetul = document.getElementById("bunyiBetul");
    let sfxSalah = document.getElementById("bunyiSalah");

    if (adakahTamat) { return; }
    if (adakahSibuk) { return; }

    // Regex Menangkap Operasi Gabungan Asal+Tambah-Buang
    let regexKira = /^sistem\.kira\((\d+)\+(\d+)-(\d+)\)$/;
    let padanan = input.match(regexKira);

    if (padanan) {
        let nAsal = parseInt(padanan[1]);
        let nTambah = parseInt(padanan[2]);
        let nBuang = parseInt(padanan[3]);
        let hasilDitaip = nAsal + nTambah - nBuang;

        if (nAsal === kargoAsal && nTambah === kargoTambah && nBuang === kargoBuang) {
            adakahSibuk = true;
            adakahTamat = true;
            mainBunyi(sfxBetul);
            
            maklumBalas.innerHTML = "Protokol Disahkan: Melancarkan rantaian pengurusan kargo berkembar...";
            maklumBalas.style.borderLeftColor = "#2ecc71";
            
            // 1. TAMBAH KOTAK PADA KEDDUDUKAN SAWAT
            cakapSistem(`Logik kod tepat! Menjana ${nTambah} unit kargo tambahan pada tali sawat industri.`, 3000);
            teksAnimasi.innerHTML = "Status: Memproses kemasukan kargo tambahan...";
            
            let kotakLori1Pakej = [];
            let kotakLori2Pakej = [];

            // Rekrut rujukan kotak asal
            for(let i=0; i<kargoAsal; i++) {
                kotakLori1Pakej.push(document.getElementById(`k1-asal-${i}`));
                kotakLori2Pakej.push(document.getElementById(`k2-asal-${i}`));
            }

            // Jana kargo baru
            for(let i=0; i<nTambah; i++) {
                let k1 = document.createElement("div"); k1.className = "kotak-kargo"; k1.innerHTML = "📦";
                k1.style.left = `${10 + ((kargoAsal + i) * 8)}%`; k1.style.bottom = "200px"; k1.style.opacity = "0";
                container.appendChild(k1);
                kotakLori1Pakej.push(k1);

                let k2 = document.createElement("div"); k2.className = "kotak-kargo"; k2.innerHTML = "🧃";
                k2.style.left = `${10 + ((kargoAsal + i) * 8)}%`; k2.style.bottom = "200px"; k2.style.opacity = "0";
                container.appendChild(k2);
                kotakLori2Pakej.push(k2);

                requestAnimationFrame(() => {
                    k1.style.bottom = "115px"; k1.style.opacity = "1";
                    k2.style.bottom = "10px"; k2.style.opacity = "1";
                });
                mainBunyi(sfxBetul);
                await tunggu(300);
            }

            await tunggu(1000);

            // 2. TOLAK / BUANG KOTAK YANG ROSAK
            teksAnimasi.innerHTML = `Status: Melucutkan ${nBuang} unit kargo gagal kuarantin...`;
            cakapSistem(`Mengesan ralat fizikal. Membuang ${nBuang} kargo terakhir ke pusat pelupusan.`, 3000);

            for(let i=0; i<nBuang; i++) {
                let target1 = kotakLori1Pakej.pop();
                let target2 = kotakLori2Pakej.pop();
                
                target1.style.bottom = "-100px"; target1.style.opacity = "0";
                target2.style.bottom = "-100px"; target2.style.opacity = "0";
                
                mainBunyi(sfxSalah);
                await tunggu(400);
            }

            await tunggu(1000);

            // 3. TERBANGKAN BAKI KOTAK SECARA BERTINGKAT MENGGUNAKAN EVENT PROMISE
            teksAnimasi.innerHTML = "Status: Memuatkan baki kargo ke belakang kenderaan...";
            
            let janjiLori1 = [];
            let janjiLori2 = [];

            // Penyelarasan base-bottom kotak bergantung kepada bottom lori
            // Lori 1: bottom 100px. Jadi kotak mula di 100px.
            // Lori 2: bottom 25px. Kotak mula di 25px.
            for(let i=0; i<kotakLori1Pakej.length; i++) {
                let p1 = terbangkanKotakPintar(kotakLori1Pakej[i], "calc(45% + 110px)", `${100 + (i * 32)}px`);
                janjiLori1.push(p1);

                let p2 = terbangkanKotakPintar(kotakLori2Pakej[i], "calc(45% + 110px)", `${25 + (i * 32)}px`);
                janjiLori2.push(p2);
                
                mainBunyi(sfxBetul);
                await tunggu(300);
            }

            // Tunggu kesemua kotak SELESAI mendarat secara fizikal
            await Promise.all([...janjiLori1, ...janjiLori2]);

            // 4. PROSES SLIDE MASUK KANTONG CARGO
            teksAnimasi.innerHTML = "Status: Isyarat fizikal diterima. Menyimpan kargo ke dalam lori...";
            
            let janjiSlide1 = [];
            let janjiSlide2 = [];

            for(let i=0; i<kotakLori1Pakej.length; i++) {
                let s1 = terbangkanKotakPintar(kotakLori1Pakej[i], "calc(45% + 40px)", kotakLori1Pakej[i].style.bottom);
                kotakLori1Pakej[i].style.opacity = "0";
                janjiSlide1.push(s1);

                let s2 = terbangkanKotakPintar(kotakLori2Pakej[i], "calc(45% + 40px)", kotakLori2Pakej[i].style.bottom);
                kotakLori2Pakej[i].style.opacity = "0";
                janjiSlide2.push(s2);
                
                mainBunyi(sfxBetul);
                await tunggu(250);
            }

            await Promise.all([...janjiSlide1, ...janjiSlide2]);

            // 5. LORI BERLEPAS AMAN TANPA RACE CONDITION
            teksAnimasi.innerHTML = "Status: Semua kargo selamat disimpan. Memulai pelepasan kenderaan...";
            cakapSistem("Pengesahan fizikal lengkap. Lori 1 dan Lori 2 dibenarkan bertolak!", 3000);
            
            await tunggu(1000);
            lori1.style.left = "-30%";
            lori2.style.left = "-30%";
            
            await tunggu(1800);
            mainBunyi(document.getElementById("bunyiMenang"));
            document.getElementById("modalKemenangan").className = "modal-tunjuk";

        } else {
            mainBunyi(sfxSalah);
            maklumBalas.innerHTML = `Ralat Parameter: Input ditaip tidak sepadan dengan data hab (Asal: ${kargoAsal}, Tambah: ${kargoTambah}, Buang: ${kargoBuang}).`;
            maklumBalas.style.borderLeftColor = "#e74c3c";
        }
    } else {
        mainBunyi(sfxSalah);
        maklumBalas.innerHTML = "Ralat Sintaks: Sila patuhi piawaian format kilang <code>sistem.kira(Asal + Tambah - Buang)</code>.";
        maklumBalas.style.borderLeftColor = "#e74c3c";
    }
}

function bukaInfo() { document.getElementById("modalInfo").className = "modal-tunjuk"; }
function tutupInfo() { document.getElementById("modalInfo").className = "modal-sembunyi"; }

function cakapSistem(mesej, masa) {
    let kotakDialog = document.getElementById("dialogSistem");
    if(kotakDialog) {
        kotakDialog.innerHTML = mesej;
        kotakDialog.classList.add("tunjuk-dialog");
        clearTimeout(pemasaDialogSistem); 
        pemasaDialogSistem = setTimeout(() => { kotakDialog.classList.remove("tunjuk-dialog"); }, masa);
    }
}