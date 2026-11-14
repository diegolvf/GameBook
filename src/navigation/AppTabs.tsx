import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GamesCollectionScreen } from '../screens/GamesCollectionScreen';
import { ConsolesCollectionScreen } from '../screens/ConsolesCollectionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../constants/theme';
import { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Collection" component={GamesCollectionScreen} options={{ title: 'Games' }} />
      <Tab.Screen name="Consoles" component={ConsolesCollectionScreen} options={{ title: 'Consoles' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}