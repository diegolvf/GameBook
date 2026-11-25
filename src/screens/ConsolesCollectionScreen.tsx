import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandCard } from '../components/BrandCards';
import { BRANDS } from '../data/consoleCatalog';
import { listConsoles } from '../services/consolesService';
import { Console as GameConsole } from '../types';
import { errorMessage } from '../utils/errors';
import { formatPrice } from '../utils/format';
import { sumPrices } from '../utils/stats';
import { colors, spacing } from '../constants/theme';
import { AppStackParamList } from '../navigation/types';

export function ConsolesCollectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [consoles, setConsoles] = useState<GameConsole[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConsoles = useCallback(async () => {
    try {
      setError(null);
      setConsoles(await listConsoles());
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConsoles().finally(() => setLoading(false));
    }, [loadConsoles])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadConsoles();
    setRefreshing(false);
  }

  // total gasto em todos os consoles
  const total = useMemo(() => sumPrices(consoles), [consoles]);

  // agrupa os consoles pela marca: { sony: [...], nintendo: [...] }
  const byBrand = useMemo(() => {
    const groups: Record<string, GameConsole[]> = {};
    for (const item of consoles) {
      groups[item.brand] = [...(groups[item.brand] ?? []), item];
    }
    return groups;
  }, [consoles]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={BRANDS}
        keyExtractor={(brand) => brand.id}
        renderItem={({ item: brand }) => (
          <BrandCard
            brand={brand}
            consoles={byBrand[brand.id] ?? []}
            onAdd={() => navigation.navigate('ConsoleForm', { brand: brand.id })}
            onEdit={(item) =>
              navigation.navigate('ConsoleForm', { brand: brand.id, existing: item })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total gasto em consoles</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            <Text style={styles.totalCount}>
              {consoles.length} {consoles.length === 1 ? 'console' : 'consoles'} cadastrados
            </Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.list}
      />
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
  list: { paddingBottom: spacing.xl },
  error: { color: colors.danger, marginBottom: spacing.sm },
  totalBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  totalLabel: { color: colors.textMuted, fontSize: 13 },
  totalValue: { color: colors.text, fontSize: 26, fontWeight: 'bold', marginTop: spacing.xs },
  totalCount: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
});