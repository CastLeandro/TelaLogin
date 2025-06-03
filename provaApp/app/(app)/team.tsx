import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TeamScreen() {
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const TeamMember = ({ name, role, icon }: { name: string; role: string; icon: string }) => (
    <Animated.View
      style={[
        styles.memberCard,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={40} color={colors.primary} />
      </View>
      <View style={styles.memberInfo}>
        <Animated.Text
          style={[
            styles.memberName,
            {
              opacity: glowOpacity,
              textShadowColor: colors.primary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            },
          ]}
        >
          {name}
        </Animated.Text>
        <Text style={styles.memberRole}>{role}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.headerGlow,
            {
              opacity: glowOpacity,
            },
          ]}
        />
        <Text style={styles.title}>Time de Desenvolvimento</Text>
        <Text style={styles.subtitle}>Os criadores por trás do projeto</Text>
      </View>

      <View style={styles.teamContainer}>
        <TeamMember
          name="Rafaella Deganutti"
          role="Desenvolvedora"
          icon="code-working"
        />
        <TeamMember
          name="Gustavo"
          role="Desenvolvedor"
          icon="code-slash"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido com</Text>
        <Ionicons name="heart" size={20} color={colors.primary} />
        <Text style={styles.footerText}>e dedicação</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
    borderRadius: 20,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  teamContainer: {
    width: '100%',
    gap: 20,
  },
  memberCard: {
    backgroundColor: colors.background.light,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
}); 