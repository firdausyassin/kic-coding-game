// --- KOD UNTUK MISI 1.1B: AMARAN BUNYI (ACTIVE BUZZER) ---

#define BUZZER_PIN 5 // Kita guna pin D5 (GPIO 5) sama macam wayar kau

void setup() {
  // Mula komunikasi dengan Web Serial
  Serial.begin(115200); 
  
  // Beritahu ESP32 bahawa pin D5 adalah Output (mengeluarkan elektrik)
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Pastikan buzzer senyap bila mula-mula dihidupkan
  digitalWrite(BUZZER_PIN, LOW); 
}

void loop() {
  // Jika ada mesej masuk dari Web...
  if (Serial.available() > 0) {
    
    // Baca mesej tersebut
    String arahan = Serial.readStringUntil('\n');
    arahan.trim(); // Buang sebarang ruang kosong (space)

    // Jika mesejnya adalah "BUZON", alirkan elektrik (HIGH)
    if (arahan == "BUZON") {
      digitalWrite(BUZZER_PIN, HIGH);
    }
    // Jika mesejnya adalah "BUZOFF", matikan elektrik (LOW)
    else if (arahan == "BUZOFF") {
      digitalWrite(BUZZER_PIN, LOW);
    }
  }
}