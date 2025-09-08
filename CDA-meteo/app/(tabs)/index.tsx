import { useCallback, useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

const fond = require("../../assets/images/meteo.jpg");

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  // Récupération de la meteo
  const getWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.openmeteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données meteo: ",
        error
      );
    }
  };

  const getLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de géolocalisation réfusée");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setLocation(location);

      // appel de l'api meteo
      getWeatherData(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la geolocalisation: ",
        error
      );
    }
  }, []);

  // récupération auto au démarrage
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <ImageBackground source={fond} style={styles.img_background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.meteo_basic}>
          {weatherData && (
            <>
              <Text style={styles.temperature}>
                {Math.round(weatherData.current_weather.temperature)}°C
              </Text>
              <Text style={styles.location}>
                Lat: {location?.coords.latitude?.toFixed(2)}, 
                Lon:{" "} {location?.coords.longitude?.toFixed(2)}
              </Text>
            </>
          )}
        </View>
        <View style={styles.searchbar}></View>
        <View style={styles.meteo_advanced}></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img_background: {
    flex: 1,
  },
  meteo_basic: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    flex: 2,
  },
  meteo_advanced: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  location: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 8,
  },
});
