#include <Arduino.h>

#include <WiFiManager.h>
#include <MQTT.h>

WiFiManager wifiManager;
WiFiClient net;
MQTTClient client;

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

    client.publish(
        "temperatureAndHumidityTopic",
        "{"
            "\"id\": " + String(id) + ","
            "\"temperature\": 25.0,"
            "\"humidity\": 50.0"
        "}"
    );
    delay(1000);
}
