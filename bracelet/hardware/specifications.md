# AirLink Bracelet Device - Hardware Specification

## Component Selection

### Core Microcontroller
**ESP32-WROOM-32** (Recommended)
- **Wi-Fi**: 802.11 b/g/n for server sync
- **Bluetooth**: For optional mobile pairing
- **Flash**: 4MB for firmware and data storage
- **RAM**: 520KB for operations
- **GPIO**: Multiple pins for peripherals
- **Power**: 3.3V operation, low power modes

### Display Module
**0.96" OLED Display (128x64)**
- **Interface**: I2C (SDA/SCL)
- **Driver**: SSD1306
- **Power**: 3.3V, ~20mA
- **Visibility**: High contrast, readable in daylight

### RFID/NFC Module
**PN532 NFC Module**
- **Frequency**: 13.56MHz
- **Interface**: I2C or SPI
- **Range**: 5cm for gate scanning
- **Standards**: ISO14443A/B, FeliCa

### Status LEDs
**RGB LED (WS2812B)**
- **Colors**: Red, Green, Blue, combinations
- **Control**: Single data pin (GPIO)
- **Power**: 5V, ~60mA max per LED

### Power System
**LiPo Battery 3.7V 500mAh**
- **Capacity**: 8-12 hours operation
- **Charging**: USB-C or micro-USB
- **Protection**: Built-in over-charge/discharge protection

### Enclosure
**Waterproof Silicone Wristband**
- **Material**: Medical-grade silicone
- **Rating**: IP65 water resistance
- **Size**: Adjustable 150-220mm wrist circumference
- **Color**: Airport branding colors

## Pin Configuration (ESP32)

```
GPIO Pin | Component        | Function
---------|------------------|------------------
GPIO21   | OLED SDA        | I2C Data
GPIO22   | OLED SCL        | I2C Clock
GPIO18   | PN532 SDA       | NFC I2C Data
GPIO19   | PN532 SCL       | NFC I2C Clock
GPIO5    | RGB LED         | Status indicator
GPIO0    | Button          | User input
GPIO2    | Buzzer          | Audio alerts
GPIO4    | Charging LED    | Charge status
```

## Power Consumption Analysis

| Component | Active (mA) | Sleep (mA) | Notes |
|-----------|-------------|------------|-------|
| ESP32     | 160-240     | 0.01       | Wi-Fi active/deep sleep |
| OLED      | 20          | 0          | Can be turned off |
| PN532     | 100         | 1          | Standby mode available |
| RGB LED   | 60          | 0          | Only when active |
| **Total** | **340-420** | **1.01**   | **8-12 hours runtime** |

## Physical Dimensions

```
Bracelet Module: 45mm x 35mm x 12mm
Display Area:    25mm x 15mm
Weight:          35-40 grams
Wristband:       22mm width, adjustable length
```

## Environmental Specifications

- **Operating Temperature**: -10°C to +60°C
- **Storage Temperature**: -20°C to +70°C
- **Humidity**: 0-95% non-condensing
- **Water Resistance**: IP65 (splash proof)
- **Drop Test**: 1.2m onto concrete
- **Battery Life**: 500+ charge cycles