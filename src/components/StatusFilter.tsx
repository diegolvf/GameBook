import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { GameStatus } from '../types';
import { STATUS_LABELS, STATUS_LIST } from '../constants/status';
import { colors, spacing } from '../constants/theme';

export type StatusFilterValue = GameStatus | 'all';

const FILTERS: { value: StatusFilterValue; label: string }[] = [
    { value: 'all', label: 'Todos' },
    ...STATUS_LIST.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

type Props = {
    selected: StatusFilterValue;
    counts: Record<StatusFilterValue, number>;
    onSelect: (value: StatusFilterValue) => void;
};

export function StatusFilter({ selected, counts, onSelect }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.row}
        >
            {FILTERS.map(({ value, label }) => {
                const active = value === selected;
                return (
                    <Pressable
                        key={value}
                        onPress={() => onSelect(value)}
                        style={[styles.chip, active && styles.chipActive]}
                    >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {label} ({counts[value]})
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 0, flexShrink: 0 },
    row: { gap: spacing.sm, paddingVertical: spacing.sm },
    chip: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { color: colors.textMuted },
    chipTextActive: { color: colors.text, fontWeight: '600' },
});