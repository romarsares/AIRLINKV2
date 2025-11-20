/*
 * AirLink Bracelet Device Firmware
 * ESP32-based smart bracelet for airport boarding verification
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <Adafruit_NeoPixel.h>

// Hardware Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define LED_PIN 5
#define BUTTON_PIN 0
#define BUZZER_PIN 2

// Network Configuration
const char* ssid = "AIRPORT_WIFI";
const char* password = "airport123";
const char* serverURL = "http://192.168.1.100:3002/api";

// Hardware Objects
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
PN532_I2C pn532i2c(Wire);
PN532 nfc(pn532i2c);
Adafruit_NeoPixel led(1, LED_PIN, NEO_GRB + NEO_KHZ800);

// Bracelet Data Structure
struct BraceletData {
  String braceletId;
  String passengerName;
  String flightNo;
  String destination;
  String seatNo;
  String gateNo;
  String status;
  int batteryLevel;
  bool isAssigned;
};

BraceletData braceletData;
unsigned long lastSync = 0;
const unsigned long SYNC_INTERVAL = 30000; // 30 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize hardware
  initializeHardware();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize bracelet data
  braceletData.braceletId = "GES001";
  braceletData.isAssigned = false;
  
  // Initial sync
  syncWithServer();
  
  Serial.println("AirLink Bracelet Ready");
}

void loop() {
  // Check for button press
  if (digitalRead(BUTTON_PIN) == LOW) {
    handleButtonPress();
    delay(200); // Debounce
  }
  
  // Check for NFC scan
  checkNFCScan();
  
  // Periodic sync with server
  if (millis() - lastSync > SYNC_INTERVAL) {
    syncWithServer();
    lastSync = millis();
  }
  
  // Update display
  updateDisplay();
  
  // Update status LED
  updateStatusLED();
  
  delay(100);
}

void initializeHardware() {
  // Initialize display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    while(1);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Initialize NFC
  nfc.begin();
  nfc.SAMConfig();
  
  // Initialize LED
  led.begin();
  led.show();
  
  // Initialize pins
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  
  Serial.println("Hardware initialized");
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Connecting WiFi...");
  display.display();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected");
  Serial.println("IP: " + WiFi.localIP().toString());
}

void syncWithServer() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  HTTPClient http;
  String url = String(serverURL) + "/bracelets/" + braceletData.braceletId + "/status";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    parseServerResponse(response);
    Serial.println("Sync successful");
  } else {
    Serial.println("Sync failed: " + String(httpResponseCode));
  }
  
  http.end();
}

void parseServerResponse(String response) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, response);
  
  if (doc["success"]) {
    JsonObject data = doc["data"];
    
    braceletData.passengerName = data["passenger_name"].as<String>();
    braceletData.flightNo = data["flight_no"].as<String>();
    braceletData.destination = data["destination"].as<String>();
    braceletData.seatNo = data["seat_no"].as<String>();
    braceletData.gateNo = data["gate_no"].as<String>();
    braceletData.status = data["status"].as<String>();
    braceletData.isAssigned = data["assigned"].as<bool>();
    
    Serial.println("Data updated from server");
  }
}

void updateDisplay() {
  display.clearDisplay();
  display.setCursor(0, 0);
  
  if (!braceletData.isAssigned) {
    display.println("AIRLINK BRACELET");
    display.println("");
    display.println("Not Assigned");
    display.println("Please check-in");
  } else {
    display.println("AIRLINK BRACELET");
    display.println("");
    display.println(braceletData.passengerName);
    display.println("Flight: " + braceletData.flightNo);
    display.println("Gate: " + braceletData.gateNo + " Seat: " + braceletData.seatNo);
    display.println("Status: " + braceletData.status);
    display.println("");
    display.println("Battery: " + String(getBatteryLevel()) + "%");
  }
  
  display.display();
}

void updateStatusLED() {
  if (!braceletData.isAssigned) {
    // Blue - Not assigned
    led.setPixelColor(0, led.Color(0, 0, 255));
  } else if (braceletData.status == "CLEARED") {
    // Green - Cleared for boarding
    led.setPixelColor(0, led.Color(0, 255, 0));
  } else if (braceletData.status == "DENIED") {
    // Red - Boarding denied
    led.setPixelColor(0, led.Color(255, 0, 0));
  } else {
    // Orange - Pending
    led.setPixelColor(0, led.Color(255, 165, 0));
  }
  
  led.show();
}

void checkNFCScan() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    Serial.println("NFC scan detected");
    
    // Send verification request to server
    sendVerificationRequest();
    
    // Provide feedback
    playBeep();
    
    delay(1000); // Prevent multiple scans
  }
}

void sendVerificationRequest() {
  HTTPClient http;
  String url = String(serverURL) + "/bracelets/verify";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  DynamicJsonDocument doc(512);
  doc["bracelet_id"] = braceletData.braceletId;
  doc["gate_no"] = braceletData.gateNo;
  doc["timestamp"] = millis();
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    handleVerificationResponse(response);
  }
  
  http.end();
}

void handleVerificationResponse(String response) {
  DynamicJsonDocument doc(512);
  deserializeJson(doc, response);
  
  if (doc["success"]) {
    String status = doc["status"];
    braceletData.status = status;
    
    if (status == "CLEARED") {
      playSuccessBeep();
    } else {
      playErrorBeep();
    }
  }
}

void handleButtonPress() {
  Serial.println("Button pressed - Manual sync");
  syncWithServer();
  playBeep();
}

int getBatteryLevel() {
  // Read battery voltage and convert to percentage
  int adcValue = analogRead(A0);
  int batteryPercent = map(adcValue, 0, 4095, 0, 100);
  return constrain(batteryPercent, 0, 100);
}

void playBeep() {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
}

void playSuccessBeep() {
  for (int i = 0; i < 2; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(150);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}

void playErrorBeep() {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(500);
  digitalWrite(BUZZER_PIN, LOW);
}