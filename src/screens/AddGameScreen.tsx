import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OptionSelector } from '../components/OptionSelector';
import { addGame } from '../services/gamesService';
import { parseDateBR, parsePrice } from '../utils/parse';
import { STATUS_LABELS, STATUS_LIST } from '../constants/status';
import { GameFormat, GameStatus } from '../types';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';
import { findCoverUrl } from '../services/tgdbService';

type Props = NativeStackScreenProps<AppStackParamList, 'AddGame'>;

const FORMAT_OPTIONS: { value: GameFormat; label: string }[] = [
  { value: 'physical', label: 'Físico' },
  { value: 'digital', label: 'Digital' },
];

const STATUS_OPTIONS = STATUS_LIST.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

export function AddGameScreen({ route, navigation }: Props) {
  const { game } = route.params;

  const platformOptions = (game.platforms ?? []).map((p) => ({
    value: p.platform.name,
    label: p.platform.name,
  }));

  const [platform, setPlatform] = useState<string | null>(
    platformOptions.length === 1 ? platformOptions[0].value : null
  );
  const [format, setFormat] = useState<GameFormat>('physical');
  const [status, setStatus] = useState<GameStatus>('want_to_play');
  const [store, setStore] = useState('');
  const [priceText, setPriceText] = useState('');
  const [dateText, setDateText] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!platform) {
      Alert.alert('Atenção', 'Escolha a plataforma.');
      return;
    }
    const price = parsePrice(priceText);
    if (price === undefined) {
      Alert.alert('Atenção', 'Valor inválido. Use o formato 199,90.');
      return;
    }
    const purchaseDate = parseDateBR(dateText);
    if (purchaseDate === undefined) {
      Alert.alert('Atenção', 'Data inválida. Use o formato DD/MM/AAAA.');
      return;
    }

    setSaving(true);
    try {
        let coverUrl = game.background_image;
        try {
            const boxart = await findCoverUrl(game.name, platform);
            if (boxart) coverUrl = boxart;
        } catch (e) {
            console.log('TheGamesDB falhou:', e);
        }
        await addGame({
            rawg_id: game.id,
            title: game.name,
            cover_url: coverUrl,
            released: game.released,
            genres: (game.genres ?? []).map((g) => g.name),
            platform,
            console_id: null,
            format,
            status,
            store: store.trim() || null,
            price,
            purchase_date: purchaseDate,
            notes: notes.trim() || null,
        });
        Alert.alert('Pronto!', 'Jogo adicionado à sua coleção.', [
            { text: 'OK', onPress: () => navigation.popToTop() },
        ]);
    } catch (e) {
    Alert.alert(
        'Não foi possível salvar',
        e instanceof Error ? e.message : 'Erro desconhecido.'
    );
    } finally {
    setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={styles.cover} />
      ) : null}
      <Text style={styles.title}>{game.name}</Text>

      {platformOptions.length > 0 ? (
        <OptionSelector
          label="Plataforma"
          options={platformOptions}
          selected={platform}
          onSelect={setPlatform}
        />
      ) : (
        <Input
          label="Plataforma"
          value={platform ?? ''}
          onChangeText={setPlatform}
          placeholder="Ex.: PlayStation 5"
        />
      )}

      <OptionSelector
        label="Formato"
        options={FORMAT_OPTIONS}
        selected={format}
        onSelect={setFormat}
      />
      <OptionSelector
        label="Status"
        options={STATUS_OPTIONS}
        selected={status}
        onSelect={setStatus}
      />

      <Input label="Loja (opcional)" value={store} onChangeText={setStore} placeholder="Ex.: Amazon" />
      <Input
        label="Valor pago (opcional)"
        value={priceText}
        onChangeText={setPriceText}
        keyboardType="decimal-pad"
        placeholder="Ex.: 199,90"
      />
      <Input
        label="Data da compra (opcional)"
        value={dateText}
        onChangeText={setDateText}
        keyboardType="numbers-and-punctuation"
        placeholder="DD/MM/AAAA"
        maxLength={10}
      />
      <Input
        label="Observações (opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        placeholder="Ex.: edição de colecionador"
      />

      <Button title="Adicionar à coleção" onPress={handleSave} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  cover: { width: '100%', height: 160, borderRadius: 8 },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: spacing.md,
  },
});