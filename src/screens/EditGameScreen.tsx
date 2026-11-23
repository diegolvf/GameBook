import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { FormScrollView } from '../components/FormScrollView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OptionSelector } from '../components/OptionSelector';
import { updateGame } from '../services/gamesService';
import { maskDate, parseDateBR, parsePrice } from '../utils/parse';
import { toDateInput, toPriceInput } from '../utils/format';
import { STATUS_LABELS, STATUS_LIST } from '../constants/status';
import { GameFormat, GameStatus } from '../types';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'EditGame'>;

const FORMAT_OPTIONS: { value: GameFormat; label: string }[] = [
  { value: 'physical', label: 'Físico' },
  { value: 'digital', label: 'Digital' },
];

const STATUS_OPTIONS = STATUS_LIST.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

export function EditGameScreen({ route, navigation }: Props) {
  const { game } = route.params;

  // cada campo começa com o valor atual do jogo
  const [platform, setPlatform] = useState(game.platform ?? '');
  const [format, setFormat] = useState<GameFormat>(game.format);
  const [status, setStatus] = useState<GameStatus>(game.status);
  const [store, setStore] = useState(game.store ?? '');
  const [priceText, setPriceText] = useState(toPriceInput(game.price));
  const [dateText, setDateText] = useState(toDateInput(game.purchase_date));
  const [notes, setNotes] = useState(game.notes ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!platform.trim()) {
      Alert.alert('Atenção', 'Informe a plataforma.');
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
      await updateGame(game.id, {
        platform: platform.trim(),
        format,
        status,
        store: store.trim() || null,
        price,
        purchase_date: purchaseDate,
        notes: notes.trim() || null,
      });
      navigation.goBack();
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
    <FormScrollView>
      <Text style={styles.title}>{game.title}</Text>

      <Input
        label="Plataforma"
        value={platform}
        onChangeText={setPlatform}
        placeholder="Ex.: PlayStation 5"
      />
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

      <Input label="Loja" value={store} onChangeText={setStore} placeholder="Ex.: Amazon" />
      <Input
        label="Valor pago"
        value={priceText}
        onChangeText={setPriceText}
        keyboardType="decimal-pad"
        placeholder="Ex.: 199,90"
      />
      <Input
        label="Data da compra"
        value={dateText}
        onChangeText={(text) => setDateText(maskDate(text))}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        maxLength={10}
      />
      <Input
        label="Observações"
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
        placeholder="Ex.: edição de colecionador"
      />

      <Button title="Salvar alterações" onPress={handleSave} loading={saving} />
    </FormScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
});