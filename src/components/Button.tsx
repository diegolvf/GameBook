import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'link';
};

export function Button({ title, onPress, loading = false, variant = 'primary' }: Props) {
  const isLink = variant === 'link';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.text, isLink && styles.linkText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.6 },
  text: { color: colors.text, fontSize: 16, fontWeight: '600' },
  linkText: { color: colors.primary, fontWeight: '400' },
});