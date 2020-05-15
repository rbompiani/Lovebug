#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <Servo.h>
#include <ArduinoJson.h>

// ip configurations for soft access point
IPAddress local_IP(192,168,4,22);
IPAddress gateway(192,168,4,9);
IPAddress subnet(255,255,255,0);

// local wifi network credentials, once set
String ssid = "";
String password = "";

// servo object
Servo myservo;

// servo angle holder
int angle = 0;

// create web server and set port to 80
ESP8266WebServer server(80); 



// ----- EEPROM / PERMANENT MEMORY HANDLERS ----- //

// reset permanent memory storage (EEPROM)
void resetCredentials() {
  for (int i = 0; i < 128; i++) {
    EEPROM.write(i, 0);
  }
}

// write strings to permanent memory (EEPROM)
void writeString(char add,String data)
{
  int _size = data.length();
  int i;
  for(i=0;i<_size;i++)
  {
    EEPROM.write(add+i,data[i]);
  }
  EEPROM.write(add+_size,'\0');   //Add termination null character for String Data
  EEPROM.commit();
}

// read strings from permanent memory (EEPROM)
String read_String(char add)
{
  int i;
  char data[100]; //Max 100 Bytes
  int len=0;
  unsigned char k;
  k=EEPROM.read(add);
  while(k != '\0' && len<500)   //Read until null character
  {    
    k=EEPROM.read(add+len);
    data[len]=k;
    len++;
  }
  data[len]='\0';
  return String(data);
}


// ----- ROUTE HANDLERS ----- //

// serve index form
void handleRoot() {                         // When URI / is requested, send a web page with a button to toggle the LED
  server.send(200, "text/html", "<form action=\"/network\" method=\"POST\"><label for=\"network\">Network name:</label><br><input type=\"text\" id=\"network\" name=\"network\"><br><label for=\"password\">Password:</label><br><input type=\"text\" id=\"password\" name=\"password\"><input type=\"submit\" value=\"Update Network\"></form>");
}

// If a POST request is made to URI /network
void handleCredentials() { 
  
  // store form data
  ssid = server.arg("network");
  password = server.arg("password");

  //ssid = "HOME-F600-2.4";                         
  //password = "7TDHE7DP3HACF793";

  // reset memory
  resetCredentials();

  // write new network and password strings to permanent memory
  writeString(0,ssid);
  writeString(64, password);
  Serial.print("updating network to: ");
  Serial.println(read_String(0));
  Serial.print("updating password to: ");
  Serial.println(read_String(64));
  
  server.sendHeader("Location","/");        // Add a header to respond with a new location for the browser to go to the home page again
                         // Send it back to the browser with an HTTP status 303 (See Other) to redirect
}

// If a POST request is made to URI /angle
void handleAngle() { 
  
  // store form data
  //angle = server.arg("angle");
  String data = server.arg("plain");
  StaticJsonDocument<256> jDoc;
  deserializeJson(jDoc, data);
  Serial.println(data);
  int angl = jDoc["angle"];

  // set servo to incoming angle
  Serial.print("updating servo angle to: ");
  Serial.println(angl);
  myservo.write(angl);

  server.send(200);  
}

// 404 catch
void handleNotFound(){
  server.send(404, "text/plain", "404: Not found"); // Send HTTP status 404 (Not Found) when there's no handler for the URI in the request
}




// ------ SETUP ------//
void setup() {
  
  // initiate serial
  Serial.begin(115200);
  Serial.println();

  EEPROM.begin(128);

  // if network credentials are set in EEPROM, start up in station mode, else start as access point
  if( read_String(0)!= '\0' && read_String(64)!='\0'){
      Serial.println( "You have network credentials - starting in station mode" );
      Serial.print( "network: " );
      Serial.println( read_String(0) );
      Serial.print( "password: " );
      Serial.println( read_String(64) );
      WiFiClient client;
        // Connect to WiFi
      Serial.print("Connecting to ");
      Serial.print(read_String(0));
      WiFi.begin(read_String(0), read_String(64));
      while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
      }
      Serial.println();
  
      // Show that we are connected
      Serial.println("Connected!");
      // Print IP address
      Serial.println(WiFi.localIP());
  } else {
      Serial.println("you are missing credentials - starting soft access point");
      //configure soft access point
      Serial.print("Setting soft-AP configuration ... ");
      Serial.println(WiFi.softAPConfig(local_IP, gateway, subnet) ? "Ready" : "Failed!");
      Serial.print("Setting soft-AP ... ");
      Serial.println(WiFi.softAP("LoveBug") ? "Ready" : "Failed!");
      Serial.print("Soft-AP IP address = ");
      Serial.println(WiFi.softAPIP());
  }


  // ----- ROUTES ----- //
  // "/" -> handleRoot
  server.on("/", HTTP_GET, handleRoot); 
  // "/network" -> handleCredentials    
  server.on("/network", HTTP_POST, handleCredentials);

  // "/angle" -> handleAngle
  server.on("/angle", HTTP_POST, handleAngle);
  
  // unknown -> handleNotFound     
  server.onNotFound(handleNotFound);         
               
  // start web server
  server.begin();                      
  Serial.println("HTTP server started");

  myservo.attach(D2);
}

  
// ------ LOOP ------//
void loop(void){
  // Listen for HTTP requests from clients
  server.handleClient();         
}
