# AirLink Bracelet Assembly Guide

## Required Components

### **Electronic Components**
| Component | Model | Quantity | Price | Purpose |
|-----------|-------|----------|-------|---------|
| Microcontroller | ESP32-WROOM-32 | 1 | $10 | Main processor |
| Display | 0.96" OLED SSD1306 | 1 | $8 | Passenger info display |
| NFC Module | PN532 Breakout | 1 | $15 | Gate scanning |
| RGB LED | WS2812B | 1 | $3 | Status indicator |
| Battery | 3.7V 500mAh LiPo | 1 | $8 | Power source |
| Buzzer | Active Buzzer 5V | 1 | $2 | Audio feedback |
| Button | Tactile Switch | 1 | $1 | User input |
| Wires | Jumper Wires | 20 | $2 | Connections |
| **Total** | | | **$49** | |

### **Enclosure Components**
| Component | Description | Quantity | Price |
|-----------|-------------|----------|-------|
| Silicone Wristband | Waterproof, adjustable | 1 | $12 |
| Plastic Case | Custom 3D printed | 1 | $5 |
| Charging Port | USB-C connector | 1 | $3 |
| **Total** | | | **$20** |

## Assembly Steps

### **Step 1: Prepare Components**
1. Unpack all electronic components
2. Check for damage or missing parts
3. Gather tools: soldering iron, wire strippers, multimeter
4. Download required Arduino libraries

### **Step 2: Wiring Connections**
```
ESP32 Pin | Component | Wire Color
----------|-----------|------------
GPIO21    | OLED SDA  | Blue
GPIO22    | OLED SCL  | Yellow
GPIO18    | PN532 SDA | Green
GPIO19    | PN532 SCL | White
GPIO5     | RGB LED   | Red
GPIO0     | Button    | Black
GPIO2     | Buzzer    | Orange
3.3V      | VCC       | Red
GND       | Ground    | Black
```

### **Step 3: Solder Connections**
1. **OLED Display**: Connect SDA/SCL to ESP32 I2C pins
2. **NFC Module**: Wire to secondary I2C pins
3. **RGB LED**: Single data wire to GPIO5
4. **Button**: Connect between GPIO0 and GND
5. **Buzzer**: Positive to GPIO2, negative to GND
6. **Power**: Battery positive to 3.3V, negative to GND

### **Step 4: Programming**
1. Install Arduino IDE
2. Add ESP32 board support
3. Install required libraries:
   - `Adafruit SSD1306`
   - `Adafruit GFX`
   - `PN532`
   - `Adafruit NeoPixel`
   - `ArduinoJson`
4. Upload firmware code via USB

### **Step 5: Testing**
1. **Power Test**: Verify 3.7V battery voltage
2. **Display Test**: Check OLED shows text
3. **NFC Test**: Verify PN532 module detection
4. **LED Test**: Confirm RGB colors work
5. **Wi-Fi Test**: Connect to network
6. **API Test**: Sync with AirLink server

### **Step 6: Enclosure Assembly**
1. **Case Preparation**: 3D print or modify plastic case
2. **Component Placement**: Fit electronics in case
3. **Display Mounting**: Secure OLED in visible position
4. **Charging Port**: Install USB-C connector
5. **Waterproofing**: Apply silicone sealant
6. **Wristband Attachment**: Connect to silicone band

## Programming Setup

### **Arduino IDE Configuration**
```
Board: ESP32 Dev Module
Upload Speed: 921600
CPU Frequency: 240MHz
Flash Frequency: 80MHz
Flash Mode: QIO
Flash Size: 4MB
Partition Scheme: Default 4MB
```

### **Required Libraries Installation**
```
Tools > Manage Libraries > Search and Install:
- Adafruit SSD1306 by Adafruit
- Adafruit GFX Library by Adafruit  
- PN532 by Elechouse
- Adafruit NeoPixel by Adafruit
- ArduinoJson by Benoit Blanchon
```

### **Wi-Fi Configuration**
Update firmware code with your network credentials:
```cpp
const char* ssid = "AIRPORT_WIFI";
const char* password = "your_password";
const char* serverURL = "http://192.168.1.100:3002/api";
```

## Testing Checklist

### **Hardware Tests**
- [ ] ESP32 powers on and connects to USB
- [ ] OLED display shows text clearly
- [ ] NFC module detected by firmware
- [ ] RGB LED cycles through colors
- [ ] Button press detected
- [ ] Buzzer produces sound
- [ ] Battery charges via USB-C

### **Software Tests**
- [ ] Firmware uploads successfully
- [ ] Wi-Fi connects to network
- [ ] Display shows bracelet information
- [ ] NFC responds to scanner reads
- [ ] API calls work with server
- [ ] Status LED indicates correct states
- [ ] Battery level displays accurately

### **Integration Tests**
- [ ] Bracelet syncs with AirLink server
- [ ] Gate scanner detects bracelet NFC
- [ ] Verification process completes
- [ ] Boarding status updates correctly
- [ ] Dashboard shows bracelet activity

## Troubleshooting

### **Common Issues**
| Problem | Cause | Solution |
|---------|-------|----------|
| No display | Wiring error | Check SDA/SCL connections |
| Wi-Fi fails | Wrong credentials | Update SSID/password |
| NFC not working | Module fault | Verify PN532 wiring |
| Battery drains fast | Power management | Enable deep sleep mode |
| Charging issues | USB-C wiring | Check charging circuit |

### **Debug Commands**
```cpp
Serial.begin(115200);  // Enable serial monitor
WiFi.printDiag(Serial); // Wi-Fi diagnostics
display.clearDisplay(); // Reset display
nfc.getFirmwareVersion(); // Check NFC module
```

## Production Considerations

### **Quality Control**
- Test each bracelet for 24 hours continuous operation
- Verify waterproof rating with submersion test
- Check NFC range and reliability
- Validate battery life under normal usage

### **Deployment**
- Program unique bracelet IDs for each device
- Configure Wi-Fi credentials for airport network
- Set server URL for production environment
- Create charging stations for bracelet maintenance

**Estimated Assembly Time**: 2-3 hours per bracelet  
**Skill Level Required**: Intermediate electronics/programming  
**Tools Needed**: Soldering iron, multimeter, 3D printer (optional)