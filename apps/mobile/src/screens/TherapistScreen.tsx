import { StyleSheet, Text, View } from "react-native";

export default function TherapistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, therapist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
  },
});
