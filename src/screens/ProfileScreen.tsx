import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../constants/theme';

export function ProfileScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Logado como</Text>
      <Text style={styles.email}>{session?.user.email}</Text>
      <Button title="Sair" variant="danger" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  label: { color: colors.textMuted },
  email: {
    color: colors.text,
    fontSize: 18,
    marginBottom: spacing.lg,
  },
});