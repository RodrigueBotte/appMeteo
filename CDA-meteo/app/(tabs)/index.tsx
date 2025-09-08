import { SafeAreaView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.meteo_basic}></View>
      <View style={styles.searchbar}></View>
      <View style={styles.meteo_advanced}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  meteo_basic: {
    flex: 2,
    backgroundColor: "red",
  },
  searchbar: {
    flex: 2,
    backgroundColor: "blue",
  },
  meteo_advanced: {
    flex: 1,
    backgroundColor: "green",
  },
});
