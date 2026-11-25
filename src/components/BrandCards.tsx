import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Brand } from '../data/consoleCatalog';
import { Console as GameConsole } from '../types';
import { formatDate, formatPrice } from '../utils/format';
import { sumPrices } from '../utils/stats';
import { colors, spacing } from '../constants/theme';

type Props = {
  brand: Brand;
  consoles: GameConsole[];
  onAdd: () => void;
  onEdit: (item: GameConsole) => void;
};

// "PlayStation 4 (Pro · Edição God of War)"
function consoleTitle(item: GameConsole): string {
  const extras = [item.variant, item.edition].filter(Boolean).join(' · ');
  return extras ? `${item.name} (${extras})` : item.name;
}

// "Compra 17/12/2024 · R$ 2.500,00"
function purchaseSummary(item: GameConsole): string {
  return [
    item.purchase_date ? `Compra ${formatDate(item.purchase_date)}` : null,
    item.price !== null ? formatPrice(item.price) : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function BrandCard({ brand, consoles, onAdd, onEdit }: Props) {
  const total = sumPrices(consoles);
  const count = consoles.length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {brand.logo ? (
          <Image source={brand.logo} style={styles.logoImage} resizeMode="contain" />
        ) : (
          <View style={[styles.logo, { backgroundColor: brand.color }]}>
            <Text style={styles.logoText}>{brand.name.charAt(0)}</Text>
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.brandName}>{brand.name}</Text>
          <Text style={styles.summary}>
            {count === 0
              ? 'Nenhum console'
              : `${count} ${count === 1 ? 'console' : 'consoles'} · ${formatPrice(total)}`}
          </Text>
        </View>

        <Pressable style={styles.addButton} onPress={onAdd} hitSlop={8}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>

      {consoles.map((item) => (
        <Pressable key={item.id} style={styles.row} onPress={() => onEdit(item)}>
          <Text style={styles.rowTitle}>{consoleTitle(item)}</Text>
          {purchaseSummary(item) ? (
            <Text style={styles.rowMeta}>{purchaseSummary(item)}</Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: { width: 48, height: 48 },
  logoText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  brandName: { color: colors.text, fontSize: 18, fontWeight: '600' },
  summary: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: { color: colors.text, fontSize: 22, lineHeight: 26 },
  row: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowTitle: { color: colors.text, fontSize: 15, fontWeight: '500' },
  rowMeta: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
});