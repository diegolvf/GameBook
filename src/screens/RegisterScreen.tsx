import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../constants/theme';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (username.trim().length < 3) {
      Alert.alert('Atenção', 'O nome de usuário precisa ter ao menos 3 caracteres.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe o e-mail.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const message = await signUp(email.trim(), password, username.trim());
    setLoading(false);
    if (message) Alert.alert('Cadastro', message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <Input
        label="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        placeholder="Como quer ser chamado"
      />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="voce@email.com"
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mínimo de 6 caracteres"
      />

      <Button title="Cadastrar" onPress={handleRegister} loading={loading} />

      <View style={styles.linkWrapper}>
        <Button
          title="Já tem conta? Entrar"
          variant="link"
          onPress={() => navigation.goBack()}
        />
      </View>
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
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  linkWrapper: { marginTop: spacing.md },
});