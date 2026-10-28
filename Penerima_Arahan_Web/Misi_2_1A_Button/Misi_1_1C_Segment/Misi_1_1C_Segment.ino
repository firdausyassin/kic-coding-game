// --- KOD UNTUK MISI 1.1C: PAPARAN ANGKA (THE FINAL MATRIX) ---

// Urat Saraf diolah 100% tepat mengikut komponen yang dibaringkan 90 darjah!
// JANGAN UBAH WAYAR DI BREADBOARD. INI SUSUNANNYA:

int segA = 18; // Wayar di 24J -> Mengawal lampu ATAS
int segB = 19; // Wayar di 25J -> Mengawal lampu ATAS-KANAN
int segC = 4;  // Wayar di 24A -> Mengawal lampu BAWAH-KANAN
int segD = 2;  // Wayar di 22A -> Mengawal lampu BAWAH
int segE = 15; // Wayar di 21A -> Mengawal lampu BAWAH-KIRI
int segF = 5;  // Wayar di 22J -> Mengawal lampu ATAS-KIRI
int segG = 17; // Wayar di 21J -> Mengawal lampu TENGAH
int segDP = 16;// Wayar di 25A -> Mengawal Titik Perpuluhan (Kita matikan)

int pins[] = {segA, segB, segC, segD, segE, segF, segG};

// Peta matriks nombor 0 hingga 9 (1 = Nyala, 0 = Padam)
byte nombor[10][7] = {
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}, // 1
  {1,1,0,1,1,0,1}, // 2
  {1,1,1,1,0,0,1}, // 3
  {0,1,1,0,0,1,1}, // 4
  {1,0,1,1,0,1,1}, // 5
  {1,0,1,1,1,1,1}, // 6
  {1,1,1,0,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,0,1,1}  // 9
};

void setup() {
  Serial.begin(115200);
  
  // Set semua 7 pin sebagai OUTPUT
  for(int i = 0; i < 7; i++){
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], LOW); // Padamkan semua masa mula-mula
  }
  
  // Matikan titik perpuluhan (DP) supaya nombor nampak bersih
  pinMode(segDP, OUTPUT);
  digitalWrite(segDP, LOW);
}

void loop() {
  // Tunggu arahan dari web Chrome
  if (Serial.available() > 0) {
    String arahan = Serial.readStringUntil('\n');
    arahan.trim();

    if (arahan.startsWith("SEG")) {
      String teksAngka = arahan.substring(3);
      int angka = teksAngka.toInt();

      if (angka >= 0 && angka <= 9) {
        for(int i = 0; i < 7; i++){
          digitalWrite(pins[i], nombor[angka][i]);
        }
      }
    }
  }
}