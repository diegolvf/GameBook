import { useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack'; //
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SearchResultItem } from '../components/SearchResultItem';
import { searchGames } from '../services/rawgService';
import { RawgGame } from '../types/rawgType';
import { AppStackParamList } from '../navigation/types'; //
import { colors, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) { //
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    const text = term.trim();
    if (text.length < 2) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchGames(text);
      setResults(data.results);
      setSearched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar jogos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Input
        label="Nome do jogo"
        value={term}
        onChangeText={setTerm}
        placeholder="Ex.: Zelda"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <Button title="Buscar" onPress={handleSearch} loading={loading} />

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <SearchResultItem
            game={item}
            onPress={() => navigation.navigate('AddGame', { game: item })} //[cite: 2] Substituído o console.log
          />
        )}
        ListEmptyComponent={
          searched && !loading ? <Text style={styles.empty}>Nenhum jogo encontrado.</Text> : undefined
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />

      <Text style={styles.credit} onPress={() => Linking.openURL('https://rawg.io')}>
        Dados e imagens: RAWG (rawg.io)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  list: { paddingVertical: spacing.md },
  error: { color: colors.danger, marginTop: spacing.md },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  credit: { color: colors.primary, textAlign: 'center', paddingTop: spacing.sm },
});