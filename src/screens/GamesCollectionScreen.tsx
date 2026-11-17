import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

export function GamesCollectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sua coleção de jogos aparecerá aqui.</Text>
      <View style={styles.action}>
        <Button title="Buscar jogo" onPress={() => navigation.navigate('Search')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  text: { color: colors.textMuted },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});