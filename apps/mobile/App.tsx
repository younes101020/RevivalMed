import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import TherapistTabs from "./src/navigation/TherapistTabs";
import PatientTabs from "./src/navigation/PatientTabs";

export type RootStackParamList = {
  Login: undefined;
  TherapistTabs: undefined;
  PatientTabs: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TherapistTabs" component={TherapistTabs} />
        <Stack.Screen name="PatientTabs" component={PatientTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
