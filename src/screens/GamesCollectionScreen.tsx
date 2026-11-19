import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameCard } from '../components/GameCard';
import { StatusFilter, StatusFilterValue } from '../components/StatusFilter';
import { listGames } from '../services/gamesService';
import { Game } from '../types';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

export function GamesCollectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilterValue>('all');
  const [query, setQuery] = useState('');

  const loadGames = useCallback(async () => {
    try {
      setError(null);
      setGames(await listGames());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar a coleção.');
    }
  }, []);

  // recarrega sempre que a aba ganha foco (por exemplo, ao voltar da tela de adicionar)
  useFocusEffect(
    useCallback(() => {
      loadGames().finally(() => setLoading(false));
    }, [loadGames])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  }

  // quantos jogos há em cada status (para os botões do filtro)
  const counts = useMemo(() => {
    const result: Record<StatusFilterValue, number> = {
      all: games.length,
      want_to_play: 0,
      playing: 0,
      paused: 0,
      completed: 0,
    };
    for (const game of games) result[game.status] += 1;
    return result;
  }, [games]);

  // a lista exibida: filtro de status + busca por nome
  const visibleGames = useMemo(() => {
    const text = query.trim().toLowerCase();
    return games.filter(
      (game) =>
        (filter === 'all' || game.status === filter) &&
        (!text || game.title.toLowerCase().includes(text))
    );
  }, [games, filter, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar na coleção"
        placeholderTextColor={colors.textMuted}
      />

      <StatusFilter selected={filter} counts={counts} onSelect={setFilter} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={visibleGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameCard game={item} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          error ? undefined : (
            <Text style={styles.empty}>
              {games.length === 0
                ? 'Sua coleção está vazia. Toque em + para adicionar o primeiro jogo.'
                : 'Nenhum jogo encontrado com esse filtro.'}
            </Text>
          )
        }
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  search: {
    backgroundColor: colors.card,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
  },
  list: { paddingTop: spacing.sm, paddingBottom: 96 },
  error: { color: colors.danger, marginVertical: spacing.sm },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { color: colors.text, fontSize: 28, lineHeight: 32 },
});