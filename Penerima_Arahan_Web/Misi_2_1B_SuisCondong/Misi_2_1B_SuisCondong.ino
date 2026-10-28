// --- KOD MISI 2.1B: SUIS CONDONG & BUZZER (VERSI GAME MODE) ---

int pinSuisCondong = 4; // Wayar Isyarat Input di 5A (D4)
int pinBuzzer = 5;      // Wayar Isyarat Output di 8A (D5)
bool sedia = false;     // Kunci (Flag) supaya ESP32 tunggu arahan Web

void setup() {
  Serial.begin(115200);
  
  pinMode(pinBuzzer, OUTPUT);
  digitalWrite(pinBuzzer, LOW); // Diamkan buzzer awal-awal
  
  pinMode(pinSuisCondong, INPUT_PULLUP); 
}

void loop() {
  // 1. DENGAR ARAHAN DARI WEB DAHULU
  if (Serial.available() > 0) {
    String arahan = Serial.readStringUntil('\n');
    arahan.trim();
    if (arahan == "MULA") {
      sedia = true; // Kunci dibuka! Kod ditaip dengan betul, Game bermula!
    }
  }

  // 2. BACA STATUS SENSOR TILT FIZIKAL
  int statusSudut = digitalRead(pinSuisCondong);

  // 3. LOGIK BERBUNYI (HANYA BERJALAN JIKA GAME DAH MULA)
  if (sedia == true) {
    if (statusSudut == LOW) {          
      digitalWrite(pinBuzzer, HIGH); // Bunyikan Penggera
      Serial.println("AMARAN");      // Hantar ke Web
    } 
    else {                        
      digitalWrite(pinBuzzer, LOW);  // Matikan Penggera
      Serial.println("SELAMAT");     // Hantar ke Web
    }
  } 
  else {
    // Kalau web belum sahkan kod, senyapkan komponen fizikal
    digitalWrite(pinBuzzer, LOW);
  }
  
  delay(50); // Rehat 50ms untuk kestabilan pembacaan sensor
}