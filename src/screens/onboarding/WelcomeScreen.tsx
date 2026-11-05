import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/images';
import {
  BottomBar,
  Button,
  DietMark,
  Icon,
  Kcal,
  LogoPill,
  Screen,
  Span,
  Text,
  TextLink,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/** 1.1 Welcome — design file: Onboard-Welcome.dc.html */
export default function WelcomeScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();

  return (
    <Screen
      footer={
        <BottomBar border={false} background={colors.paper} style={styles.footer}>
          <Button label="Get started" onPress={() => nav.navigate('Login')} />
          <View style={styles.center}>
            <TextLink
              label="I already have an account"
              onPress={() => nav.navigate('Login')}
              style={styles.haveAccount}
            />
          </View>
          <Text style={styles.legal}>
            By continuing you agree to our <Span style={styles.legalLink}>Terms</Span>
            {' & '}
            <Span style={styles.legalLink}>Privacy Policy</Span>
          </Text>
        </BottomBar>
      }
    >
      {/* Hero photo, 400px with 28px bottom corners */}
      <View style={styles.hero}>
        <Image
          source={images.muesliBowlHero}
          accessibilityLabel="Top-down bowl of yogurt with muesli, berries and dates"
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LogoPill style={[styles.logo, { top: 16 + insets.top }]} />
        <View style={styles.heroCard}>
          <View style={styles.heroCardName}>
            <DietMark type="veg" />
            <Text style={styles.heroCardNameText}>Berry muesli yogurt bowl</Text>
          </View>
          <View style={styles.heroCardNumbers}>
            <Kcal value={340} />
            <Text style={type.price}>₹199</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={type.h1} accessibilityRole="header">
          Eat for your goal.
        </Text>
        <Text style={[type.body, styles.lede]}>
          Meals and groceries ranked by calories — not just price.
        </Text>

        <View style={styles.list}>
          <Feature
            icon="flame"
            tileBg={colors.kcalCream}
            tileFg={colors.turmericDeep}
            text="Calories shown before price, on everything"
          />
          <Feature
            icon="target"
            tileBg={colors.stone}
            tileFg={colors.forestInk}
            text="Picks for weight loss, gain or muscle"
          />
          <Feature
            icon="leaf"
            tileBg={colors.leafMist}
            tileFg={colors.leaf}
            text="Veg & non-veg, clearly marked"
          />
        </View>
      </View>
    </Screen>
  );
}

function Feature({
  icon,
  tileBg,
  tileFg,
  text,
}: {
  icon: IconName;
  tileBg: string;
  tileFg: string;
  text: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={[styles.featureTile, { backgroundColor: tileBg }]}>
        <Icon name={icon} size={20} color={tileFg} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 400 },
  heroImage: {
    width: '100%',
    height: 400,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logo: { position: 'absolute', left: 20 },
  heroCard: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  heroCardName: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroCardNameText: { ...ff('body', 600), fontSize: 12, lineHeight: 16, color: colors.ink2 },
  heroCardNumbers: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  body: { paddingTop: 24, paddingHorizontal: 20 },
  lede: { marginTop: 8 },
  list: { marginTop: 24, gap: 12 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureTile: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { ...type.ui, flex: 1 },
  footer: { paddingTop: 20 },
  center: { alignItems: 'center', marginTop: 4 },
  haveAccount: { alignSelf: 'center' },
  legal: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  legalLink: { ...ff('body', 600), color: colors.ink2, textDecorationLine: 'underline' },
});
