import { StyleSheet, Text, View } from 'react-native';
import { GameStatus } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants/status';

type Props = { status: GameStatus };

export function StatusBadge({ status }: Props) {
    return (
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
            <Text style={styles.text}>{STATUS_LABELS[status]}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    text: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});