import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
        `https://api.openmeteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation&timezone=auto`
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

  const getWeatherDescription = (code: number) => {
    const weatherCodes = {
      0: "Ciel dégagé",
      1: "Principalement dégagé",
      2: "Partiellement nuageux",
      3: "Couvert",
      45: "Brouillard",
      48: "Brouillard givrant",
      51: "Bruine légère",
      53: "Bruine modérée",
      55: "Bruine dense",
      61: "Pluie légère",
      63: "Pluie modérée",
      65: "Pluie forte",
      71: "Neige légère",
      73: "Neige modérée",
      75: "Neige forte",
      95: "Orage",
    };
    return (weatherCodes as Record<number, string>)[code] || "Météo inconnu";
  };

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <ImageBackground source={fond} style={styles.img_background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.meteo_basic}>
          {weatherData ? (
            <>
              <Text style={styles.city}>Meteo actuelle</Text>
              <Text style={styles.temperature}>
                {Math.round(weatherData.current_weather.temperature)}°C
              </Text>
              <Text style={styles.weatherDescription}>
                {getWeatherDescription(weatherData.current_weather.weathercode)}
              </Text>
              <View style={styles.weatherDetails}>
                <Text style={styles.detailText}>
                  🌪️{weatherData.current_weather.windspeed} km/h
                </Text>
                <Text style={styles.detailText}>
                  🧭
                  {getWindDirection(weatherData.current_weather.winddirection)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Récupérations Météo...</Text>
            </View>
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
    padding: 20,
  },
  searchbar: {
    flex: 2,
  },
  meteo_advanced: {
    flex: 1,
  },
  city: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    fontWeight: "500",
  },
  temperature: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 20,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  detailText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  loading: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
