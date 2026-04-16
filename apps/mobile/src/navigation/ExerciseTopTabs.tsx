import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function Placeholder() {
  return <View style={{ flex: 1 }} />;
}

export default function ExerciseTopTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Attention" component={Placeholder} />
      <Tab.Screen name="Flexibilité" component={Placeholder} />
      <Tab.Screen name="Info. Processing" component={Placeholder} />
      <Tab.Screen name="Langage" component={Placeholder} />
      <Tab.Screen name="Memory" component={Placeholder} />
      <Tab.Screen name="Memory Work" component={Placeholder} />
      <Tab.Screen name="Planification" component={Placeholder} />
      <Tab.Screen name="Visuo-Spatial" component={Placeholder} />
      <Tab.Screen name="Vitesse" component={Placeholder} />
    </Tab.Navigator>
  );
}
