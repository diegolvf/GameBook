import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RawgGame } from '../types/rawgType';
import { colors, spacing } from '../constants/theme';

type Props = {
  game: RawgGame;
  onPress: () => void;
};

export function SearchResultItem({ game, onPress }: Props) {
  const year = game.released ? game.released.slice(0, 4) : 'Sem data';
  const platforms = (game.platforms ?? []).map((p) => p.platform.name).join(', ');

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.noCover]}>
          <Text style={styles.noCoverText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {game.name}
        </Text>
        <Text style={styles.meta}>{year}</Text>
        <Text style={styles.platforms} numberOfLines={2}>
          {platforms}
        </Text>
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
  cover: { width: 96, height: 96 },
  noCover: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: { color: colors.textMuted, fontSize: 12 },
  info: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.textMuted, marginTop: spacing.xs },
  platforms: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});