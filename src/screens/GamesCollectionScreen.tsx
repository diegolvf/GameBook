import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export function GamesCollectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sua coleção de jogos aparecerá aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: { color: colors.textMuted },
});