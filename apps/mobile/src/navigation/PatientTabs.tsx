import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ExerciseTopTabs from "./ExerciseTopTabs";
import MissionsScreen from "../screens/patient/MissionsScreen";

const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Exercises"
        component={ExerciseTopTabs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Missions"
        component={MissionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
