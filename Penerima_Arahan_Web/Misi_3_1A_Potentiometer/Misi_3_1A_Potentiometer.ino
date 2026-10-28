// --- KOD MISI 3.1A: TOMBOL KAWALAN ANALOG (POTENTIOMETER) ---

int pinPot = 4;      // Kaki tengah tombol disambung ke Pin D4 (Lubang 5A)
int pinLED = 2;      // Wayar Isyarat LED di Pin D2 (Lubang 4A)
bool sedia = false;  // Kunci dari Web

unsigned long masaLalu = 0; // Pembolehubah untuk kawal memori kelipan LED
int statusLED = LOW;

void setup() {
  Serial.begin(115200);
  pinMode(pinLED, OUTPUT);
}

void loop() {
  // 1. TUNGGU ARAHAN 'MULA' DARI WEB (MOD STANDBY)
  if (Serial.available() > 0) {
    String arahan = Serial.readStringUntil('\n');
    arahan.trim();
    if (arahan == "MULA") {
      sedia = true;
    }
  }

  // 2. BACA DATA ANALOG (0 hingga 4095) JIKA GAME DAH MULA
  if (sedia == true) {
    int nilaiTombol = analogRead(pinPot); 
    
    // Tentukan kelajuan berdasarkan logik perbandingan (>)
    int masaKelipan = 500; // Asal: Kelipan perlahan (500ms)
    String statusTeks = "PERLAHAN";

    if (nilaiTombol > 2000) {
      masaKelipan = 100;   // Jika diputar lebih 2000, kelipan Laju (100ms)
      statusTeks = "LAJU";
    }

    // 3. FUNGSI KELIPAN LED (Tanpa menghentikan cip)
    unsigned long masaSekarang = millis();
    if (masaSekarang - masaLalu >= masaKelipan) {
      masaLalu = masaSekarang;
      if (statusLED == LOW) {
        statusLED = HIGH;
      } else {
        statusLED = LOW;
      }
      digitalWrite(pinLED, statusLED);
    }

    // 4. HANTAR DATA KE WEB (Setiap 50ms)
    static unsigned long masaHantar = 0;
    if (masaSekarang - masaHantar >= 50) {
      masaHantar = masaSekarang;
      // Format hantar: STATUS|NILAITOMBOL (Contoh: LAJU|3500)
      Serial.println(statusTeks + "|" + String(nilaiTombol));
    }
  } 
  else {
    digitalWrite(pinLED, LOW); // Padam LED kalau web belum sahkan kod
  }
}