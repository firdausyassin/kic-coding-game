// --- KOD MISI 2.1C: KESAN HALANGAN (IR SENSOR) ---

int pinIR = 4;       // Wayar Isyarat (OUT) IR Sensor di 5A (Pin D4)
bool sedia = false;  // Kunci (Flag) tunggu arahan MULA dari Web

void setup() {
  Serial.begin(115200);
  
  // Set IR Sensor sebagai INPUT untuk membaca pantulan halangan
  pinMode(pinIR, INPUT); 
}

void loop() {
  // 1. DENGAR ARAHAN WEB DAHULU (STANDBY MODE)
  // Litar tidak akan beroperasi selagi belum terima isyarat dari web
  if (Serial.available() > 0) {
    String arahan = Serial.readStringUntil('\n');
    arahan.trim();
    if (arahan == "MULA") {
      sedia = true; // Kunci dibuka! Kod budak betul, Game bermula!
    }
  }

  // 2. LOGIK PENDERIA IR (HANYA BERJALAN JIKA GAME DAH SEDIA)
  if (sedia == true) {
    int statusIR = digitalRead(pinIR);
    
    // IR Sensor biasanya membaca isyarat LOW apabila cahaya dipantulkan (Ada halangan)
    if (statusIR == LOW) {       
      Serial.println("KESAN");   // Hantar isyarat "Menceroboh" ke Web
    } 
    else {                           
      Serial.println("CLEAR");   // Hantar isyarat "Laluan Jelas" ke Web
    }
  } 
  
  delay(100); // Rehat 100ms supaya web tidak 'Jammed' terima data terlalu laju
}