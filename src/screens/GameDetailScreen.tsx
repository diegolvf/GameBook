import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { OptionSelector } from '../components/OptionSelector';
import { deleteGame, getGame, updateGame } from '../services/gamesService';
import { findCoverUrl } from '../services/tgdbService';
import { formatDate, formatPrice } from '../utils/format';
import { STATUS_LABELS, STATUS_LIST } from '../constants/status';
import { Game, GameStatus } from '../types';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'GameDetail'>;

const STATUS_OPTIONS = STATUS_LIST.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido.';
}

export function GameDetailScreen({ route, navigation }: Props) {
  const { gameId } = route.params;

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setGame(await getGame(gameId));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // recarrega ao abrir e também ao voltar da tela de edição
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function changeStatus(status: GameStatus) {
    if (!game || busy || status === game.status) return;
    setBusy(true);
    try {
      setGame(await updateGame(game.id, { status }));
    } catch (e) {
      Alert.alert('Não foi possível alterar o status', errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function refreshCover() {
    if (!game || busy) return;
    if (!game.platform) {
      Alert.alert('Atenção', 'Este jogo não tem plataforma definida.');
      return;
    }
    setBusy(true);
    try {
      const cover = await findCoverUrl(game.title, game.platform);
      if (cover) {
        setGame(await updateGame(game.id, { cover_url: cover }));
      } else {
        Alert.alert(
          'Capa não encontrada',
          'A TheGamesDB não tem uma capa deste jogo para esta plataforma.'
        );
      }
    } catch (e) {
      Alert.alert('Não foi possível atualizar a capa', errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!game) return;
    setBusy(true);
    try {
      await deleteGame(game.id);
      navigation.goBack();
    } catch (e) {
      setBusy(false);
      Alert.alert('Não foi possível excluir', errorMessage(e));
    }
  }

  function confirmDelete() {
    if (!game || busy) return;
    Alert.alert(
      'Excluir jogo',
      `Remover "${game.title}" da sua coleção? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleDelete },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Jogo não encontrado.'}</Text>
        <Button title="Tentar de novo" variant="link" onPress={load} />
      </View>
    );
  }

  const formatLabel = game.format === 'physical' ? 'Físico' : 'Digital';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {game.cover_url ? (
        <Image source={{ uri: game.cover_url }} style={styles.cover} />
      ) : null}
      <Text style={styles.title}>{game.title}</Text>
      <Text style={styles.meta}>
        {[game.platform, formatLabel].filter(Boolean).join(' · ')}
      </Text>

      <View style={styles.section}>
        <OptionSelector
          label="Status"
          options={STATUS_OPTIONS}
          selected={game.status}
          onSelect={changeStatus}
        />
      </View>

      <View style={styles.section}>
        <InfoRow label="Lançamento" value={formatDate(game.released)} />
        <InfoRow
          label="Gêneros"
          value={game.genres.length > 0 ? game.genres.join(', ') : '—'}
        />
        <InfoRow label="Loja" value={game.store ?? '—'} />
        <InfoRow label="Valor pago" value={formatPrice(game.price)} />
        <InfoRow label="Data da compra" value={formatDate(game.purchase_date)} />
        <InfoRow label="Observações" value={game.notes ?? '—'} />
      </View>

      {busy ? <ActivityIndicator color={colors.primary} style={styles.busy} /> : null}

      <View style={styles.actions}>
        <Button
          title="Editar dados"
          onPress={() => navigation.navigate('EditGame', { game })}
        />
        <Button
          title="Atualizar capa (TheGamesDB)"
          variant="link"
          onPress={refreshCover}
        />
        <Button title="Excluir jogo" variant="danger" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  cover: {
    width: 160,
    height: 220,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  meta: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
  section: { marginTop: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.textMuted },
  rowValue: { color: colors.text, flexShrink: 1, textAlign: 'right' },
  busy: { marginTop: spacing.md },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
});