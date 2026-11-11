import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Tap, Text, TextField } from '../../components';
import {
  COUPONS,
  DELIVERY_FEE,
  couponDiscount,
  inr,
  useCart,
  type Coupon,
} from '../../state/cart';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';

/**
 * "Apply coupon" bottom sheet (static UI: the codes live in state/cart).
 * Type a code or pick one from the list; codes whose minimum order isn't met
 * say how much more to add.
 */
export function CouponSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setCode('');
    setError(null);
    onClose();
  };
  const apply = (value: string) => {
    const err = cart.applyCoupon(value);
    if (err) {
      setError(err);
    } else {
      close();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close coupons"
          onPress={close}
          style={styles.scrim}
        />
        <View
          accessibilityViewIsModal
          style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}
        >
          <View style={styles.grabber} />
          <View style={styles.head}>
            <Text style={type.h3} accessibilityRole="header">
              Apply coupon
            </Text>
            <Tap
              accessibilityLabel="Close"
              onPress={close}
              style={styles.close}
            >
              <Icon name="x" size={22} color={colors.forestInk} />
            </Tap>
          </View>

          <View style={styles.entry}>
            <TextField
              containerStyle={styles.flex}
              value={code}
              // Kept as typed: rewriting the text on each keystroke drops
              // fast input on iOS. The code is normalised when applied.
              onChangeText={t => {
                setCode(t);
                setError(null);
              }}
              onSubmitEditing={() => code.trim() && apply(code)}
              placeholder="Enter coupon code"
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              returnKeyType="done"
              maxLength={20}
              error={error ?? undefined}
              accessibilityLabel="Coupon code"
            />
            <Tap
              disabled={!code.trim()}
              onPress={() => apply(code)}
              accessibilityLabel="Apply code"
              style={styles.applyBtn}
              pressedBackground={colors.forestInkPressed}
            >
              <Text style={styles.applyText}>Apply</Text>
            </Tap>
          </View>

          <Text
            style={[type.eyebrow, styles.listLabel]}
            accessibilityRole="header"
          >
            Available coupons
          </Text>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            {COUPONS.map(c => (
              <CouponCard
                key={c.code}
                coupon={c}
                itemTotal={cart.itemTotal}
                applied={cart.coupon?.code === c.code}
                onApply={() => apply(c.code)}
                onRemove={cart.removeCoupon}
              />
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CouponCard({
  coupon,
  itemTotal,
  applied,
  onApply,
  onRemove,
}: {
  coupon: Coupon;
  itemTotal: number;
  applied: boolean;
  onApply: () => void;
  onRemove: () => void;
}) {
  const short = Math.max(0, coupon.minOrder - itemTotal);
  const saving = coupon.freeDelivery
    ? DELIVERY_FEE
    : couponDiscount(coupon, itemTotal);
  return (
    <View style={[styles.card, applied ? styles.cardOn : null]}>
      <View style={styles.flex}>
        <View style={styles.codeTag}>
          <Text style={styles.codeText}>{coupon.code}</Text>
        </View>
        <Text style={styles.cTitle}>{coupon.title}</Text>
        <Text style={styles.cDetail}>{coupon.detail}</Text>
        {short > 0 ? (
          <Text style={styles.cShort}>Add {inr(short)} more to unlock</Text>
        ) : (
          <Text style={styles.cSave}>Save {inr(saving)} on this order</Text>
        )}
      </View>
      {applied ? (
        <Tap
          onPress={onRemove}
          accessibilityLabel={`Remove ${coupon.code}`}
          style={styles.cAction}
        >
          <Icon name="check" size={16} color={colors.leaf} />
          <Text style={styles.cApplied}>Applied</Text>
        </Tap>
      ) : (
        <Tap
          onPress={onApply}
          disabled={short > 0}
          accessibilityLabel={`Apply ${coupon.code}`}
          style={styles.cAction}
        >
          <Text style={styles.cApply}>Apply</Text>
        </Tap>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  flex: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  sheet: {
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  grabber: {
    width: 36,
    height: 4,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.mapLine,
  },
  head: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  close: {
    width: 44,
    height: 44,
    marginRight: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  entry: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  applyBtn: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: colors.forestInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { ...ff('body', 600), fontSize: 15, color: '#FFFFFF' },

  listLabel: { marginTop: 24 },
  list: { marginTop: 12, flexGrow: 0 },
  listContent: { gap: 12, paddingBottom: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  cardOn: { borderColor: colors.leaf, backgroundColor: colors.leafMist },
  codeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.kcalCream,
  },
  codeText: {
    ...ff('mono', 600),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: em(0.06, 12),
    color: colors.turmericDeep,
  },
  cTitle: { ...ff('body', 600), marginTop: 8, fontSize: 15, lineHeight: 20 },
  cDetail: { marginTop: 2, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  cShort: {
    ...ff('body', 600),
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: colors.turmericDeep,
  },
  cSave: {
    ...ff('body', 600),
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: colors.leaf,
  },
  cAction: {
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cApply: { ...ff('body', 700), fontSize: 14, color: colors.turmericDeep },
  cApplied: { ...ff('body', 700), fontSize: 14, color: colors.leaf },
});
