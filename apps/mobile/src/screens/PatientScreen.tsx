import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Patient">;

export default function PatientScreen({ route }: Props) {
  const { name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {name}</Text>
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
