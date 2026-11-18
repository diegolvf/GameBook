import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { SearchScreen } from '../screens/SearchScreen';
import { AppStackParamList } from './types';
import { AddGameScreen } from '../screens/AddGameScreen';


const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar jogo' }} />
      <Stack.Screen name="AddGame" component={AddGameScreen} options={{ title: 'Adicionar à coleção' }} />
    </Stack.Navigator>
  );
}