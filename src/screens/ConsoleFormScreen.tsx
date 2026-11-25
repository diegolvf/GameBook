import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormScrollView } from '../components/FormScrollView';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OptionSelector } from '../components/OptionSelector';
import { addConsole, deleteConsole, updateConsole } from '../services/consolesService';
import { brandById, catalogFor } from '../data/consoleCatalog';
import { maskDate, parseDateBR, parsePrice } from '../utils/parse';
import { formatDate, toDateInput, toPriceInput } from '../utils/format';
import { errorMessage } from '../utils/errors';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'ConsoleForm'>;

const OTHER = '__other__';

export function ConsoleFormScreen({ route, navigation }: Props) {
  const { brand, existing } = route.params;

  const brandInfo = brandById(brand);
  const models = catalogFor(brand);
  const modelOptions = [
    ...models.map((item) => ({ value: item.name, label: item.name })),
    { value: OTHER, label: 'Outro' },
  ];

  // na edição, descobre se o console salvo é um modelo do catálogo ou um "Outro"
  const initialModel = existing
    ? models.some((item) => item.name === existing.name)
      ? existing.name
      : OTHER
    : null;

  const [model, setModel] = useState<string | null>(initialModel);
  const [customName, setCustomName] = useState(
    existing && initialModel === OTHER ? existing.name : ''
  );
  const [variant, setVariant] = useState(existing?.variant ?? '');
  const [edition, setEdition] = useState(existing?.edition ?? '');
  const [dateText, setDateText] = useState(toDateInput(existing?.purchase_date ?? null));
  const [priceText, setPriceText] = useState(toPriceInput(existing?.price ?? null));
  const [saving, setSaving] = useState(false);

  const catalogItem = models.find((item) => item.name === model);

  async function handleSave() {
    const name = model === OTHER ? customName.trim() : model;
    if (!name) {
      Alert.alert(
        'Atenção',
        model === OTHER ? 'Digite o nome do console.' : 'Escolha o modelo do console.'
      );
      return;
    }
    const price = parsePrice(priceText);
    if (price === undefined) {
      Alert.alert('Atenção', 'Valor inválido. Use o formato 2500,00.');
      return;
    }
    const purchaseDate = parseDateBR(dateText);
    if (purchaseDate === undefined) {
      Alert.alert('Atenção', 'Data inválida. Use o formato DD/MM/AAAA.');
      return;
    }

    const values = {
      brand,
      name,
      released: catalogItem?.released ?? null,
      variant: variant.trim() || null,
      edition: edition.trim() || null,
      price,
      purchase_date: purchaseDate,
      platform_id: null,
      image_url: null,
      store: existing?.store ?? null,
      notes: existing?.notes ?? null,
    };

    setSaving(true);
    try {
      if (existing) {
        await updateConsole(existing.id, values);
      } else {
        await addConsole(values);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Não foi possível salvar', errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setSaving(true);
    try {
      await deleteConsole(existing.id);
      navigation.goBack();
    } catch (e) {
      setSaving(false);
      Alert.alert('Não foi possível excluir', errorMessage(e));
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Excluir console', `Remover "${existing.name}" da sua coleção?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: handleDelete },
    ]);
  }

  return (
    <FormScrollView>
      <Text style={styles.brandTitle}>{brandInfo.name}</Text>

      <OptionSelector
        label="Modelo"
        options={modelOptions}
        selected={model}
        onSelect={setModel}
      />

      {catalogItem?.released ? (
        <Text style={styles.info}>Lançamento: {formatDate(catalogItem.released)}</Text>
      ) : null}

      {model === OTHER ? (
        <Input
          label="Nome do console"
          value={customName}
          onChangeText={setCustomName}
          placeholder="Ex.: Mega Drive 3"
          autoCapitalize="sentences"
        />
      ) : null}

      <Input
        label="Versão (opcional)"
        value={variant}
        onChangeText={setVariant}
        placeholder="Ex.: Slim, Pro, OLED"
        autoCapitalize="sentences"
      />
      <Input
        label="Edição especial (opcional)"
        value={edition}
        onChangeText={setEdition}
        placeholder="Ex.: Edição God of War"
        autoCapitalize="sentences"
      />
      <Input
        label="Data da compra (opcional)"
        value={dateText}
        onChangeText={(text) => setDateText(maskDate(text))}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        maxLength={10}
      />
      <Input
        label="Valor pago (opcional)"
        value={priceText}
        onChangeText={setPriceText}
        keyboardType="decimal-pad"
        placeholder="Ex.: 2500,00"
      />

      <Button
        title={existing ? 'Salvar alterações' : 'Adicionar console'}
        onPress={handleSave}
        loading={saving}
      />

      {existing ? (
        <View style={styles.deleteWrapper}>
          <Button title="Excluir console" variant="danger" onPress={confirmDelete} />
        </View>
      ) : null}
    </FormScrollView>
  );
}

const styles = StyleSheet.create({
  brandTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  info: { color: colors.textMuted, marginBottom: spacing.md },
  deleteWrapper: { marginTop: spacing.md },
});