#include <Arduino.h>

#include <WiFiManager.h>
#include <MQTT.h>
#include <DHT.h>

WiFiManager wifiManager;
WiFiClient net;
MQTTClient client;
DHT dht(D1, DHT11);

#define KEY "zazu"

unsigned long previousMillis = 0;    // will store last time DHT was updated

// Updates DHT readings every 10 seconds
const long interval = 10000;

String encrypt(String s, String key) {
    String encrypted;
    for (int i = 0; i < s.length(); i++) {
        encrypted += (char) (s[i] ^ key[i % key.length()]);
    }
    return encrypted;
}

const char *id = "1";

void connect() {
    Serial.print("checking wifi...");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }

    Serial.print("\nconnecting...");
    while (!client.connect(id)) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nconnected!");
}

void setup() {
    Serial.begin(115200);
    Serial.println("Starting...");
    dht.begin();

    wifiManager.autoConnect();
    wifiManager.setSaveConfigCallback([]() {
        Serial.println("Saving wifi");
        return true;
    });
    Serial.println("Connected");
    Serial.print("connecting to MQTT broker");
    client.begin("192.168.1.10", net);
    connect();
}

void loop() {
    client.loop();
    if (!client.connected()) {
        connect();
    }
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        float temp = dht.readTemperature();
        float humidity = dht.readHumidity();

        if (isnan(temp) || isnan(humidity)) {
            Serial.println("Failed to read from DHT sensor!");
        } else {
            const String msg = encrypt(
                String(
                    "{"
                    "\"id\": " + String(id) + ","
                    "\"temperature\": " + String(temp) + ","
                    "\"humidity\": " + String(humidity) +
                    "}"
                ),
                KEY
            );

            client.publish("temperatureAndHumidityTopic", msg.c_str());
        }
        delay(10);
    }
}
