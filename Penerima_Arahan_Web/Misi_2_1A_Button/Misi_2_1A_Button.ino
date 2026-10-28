// --- KOD MISI 2.1A: SUIS FIZIKAL (INPUT) & LED (VERSI GAME MODE) ---

int pinLED = 2;     // Wayar Isyarat LED di 4A
int pinButang = 4;  // Wayar Isyarat Butang di 5A
bool sedia = false; // Kunci (Flag) supaya ESP32 tunggu arahan Web

void setup() {
  Serial.begin(115200);
  
  // Set LED sebagai OUTPUT
  pinMode(pinLED, OUTPUT);
  digitalWrite(pinLED, LOW); // Padamkan LED pada permulaan
  
  // Set Butang sebagai INPUT_PULLUP
  // (Sentiasa HIGH, jadi LOW bila ditekan ke bumi/GND)
  pinMode(pinButang, INPUT_PULLUP); 
}

void loop() {
  // 1. DENGAR ARAHAN DARI WEB DAHULU (STANDBY)
  if (Serial.available() > 0) {
    String arahan = Serial.readStringUntil('\n');
    arahan.trim();
    if (arahan == "MULA") {
      sedia = true; // Kunci dibuka! Kod ditaip dengan betul, Game bermula!
    }
  }

  // 2. BACA STATUS SENSOR & LOGIK IF/ELSE (HANYA JIKA GAME DAH MULA)
  if (sedia == true) {
    int status = digitalRead(pinButang);

    if (status == LOW) {          // Jika butang sedang ditekan (GND)
      digitalWrite(pinLED, HIGH); // Nyalakan LED Fizikal
      Serial.println("TEKAN");    // Hantar isyarat ke Web
    } 
    else {                        // Sebaliknya (jika dilepas)
      digitalWrite(pinLED, LOW);  // Padamkan LED Fizikal
      Serial.println("LEPAS");    // Hantar isyarat ke Web
    }
  } 
  else {
    // Kalau web belum sahkan kod, pastikan LED fizikal terpadam
    digitalWrite(pinLED, LOW);
  }
  
  // Rehat 50 milisaat supaya butang tak 'gila' (Debounce)
  delay(50);
}