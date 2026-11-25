import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { SearchScreen } from '../screens/SearchScreen';
import { AppStackParamList } from './types';
import { AddGameScreen } from '../screens/AddGameScreen';
import { GameDetailScreen } from '../screens/GameDetailScreen';
import { EditGameScreen } from '../screens/EditGameScreen';
import { ConsoleFormScreen } from '../screens/ConsoleFormScreen';


const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar jogo' }} />
      <Stack.Screen name="AddGame" component={AddGameScreen} options={{ title: 'Adicionar à coleção' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: 'Detalhes' }} />
      <Stack.Screen name="EditGame" component={EditGameScreen} options={{ title: 'Editar jogo' }} />
      <Stack.Screen name="ConsoleForm" component={ConsoleFormScreen} options={({ route }) => ({ title: route.params.existing ? 'Editar console' : 'Novo console',})}/>
    </Stack.Navigator>
  );
}