// KOD C++ UNTUK ESP32 (PENERIMA ARAHAN WEB)

const int pinLampu = 2; // Kita guna Pin 2 untuk LED

void setup() {
  // Mulakan komunikasi USB (Baud Rate: 115200 sangat penting!)
  Serial.begin(115200);
  
  // Beritahu ESP32 bahawa pin 2 adalah output (keluarkan elektrik)
  pinMode(pinLampu, OUTPUT);
  
  // Pastikan lampu terpadam pada awalnya
  digitalWrite(pinLampu, LOW);
}

void loop() {
  // Jika ada isyarat mesej masuk dari Google Chrome...
  if (Serial.available() > 0) {
    // Baca mesej String tersebut sampai habis
    String arahanWeb = Serial.readStringUntil('\n');
    arahanWeb.trim(); // Buang ruang kosong (spaces) yang tak perlu

    // Jika mesej dari Web adalah "NYALA"
    if (arahanWeb == "NYALA") {
      digitalWrite(pinLampu, HIGH); // Hantar elektrik (Lampu Hidup)
      Serial.println("ESP32: Lampu telah dihidupkan!");
    } 
    // Jika mesej dari Web adalah "PADAM"
    else if (arahanWeb == "PADAM") {
      digitalWrite(pinLampu, LOW); // Putuskan elektrik (Lampu Padam)
      Serial.println("ESP32: Lampu telah dimatikan!");
    }
  }
}