import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Game } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatPrice } from '../utils/format';
import { colors, spacing } from '../constants/theme';

type Props = {
    game: Game;
    onPress?: () => void;
};

export function GameCard({ game, onPress }: Props) {
    const formatLabel = game.format === 'physical' ? 'Físico' : 'Digital';
    const meta = [game.platform, formatLabel].filter(Boolean).join(' · ');

    return (
        <Pressable style={styles.card} onPress={onPress}>
            {game.cover_url ? (
                <Image source={{ uri: game.cover_url }} style={styles.cover} />
            ) : (
                <View style={[styles.cover, styles.noCover]}>
                    <Text style={styles.noCoverText}>Sem capa</Text>
                </View>
            )}

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {game.title}
                </Text>
                <Text style={styles.meta}>{meta}</Text>
                <View style={styles.footer}>
                    <StatusBadge status={game.status} />
                    {game.price !== null ? (
                        <Text style={styles.price}>{formatPrice(game.price)}</Text>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 8,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    cover: { width: 72, height: 96 },
    noCover: {
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCoverText: { color: colors.textMuted, fontSize: 12 },
    info: { flex: 1, padding: spacing.sm, justifyContent: 'space-between' },
    title: { color: colors.text, fontSize: 16, fontWeight: '600' },
    meta: { color: colors.textMuted, fontSize: 13 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: { color: colors.textMuted, fontSize: 13 },
});