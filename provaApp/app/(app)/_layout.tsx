import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Alert, View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { useState, useRef } from 'react';

export default function AppLayout() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              router.replace('/');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    setSidebarOpen(!isSidebarOpen);
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const sidebarTranslate = sidebarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-280, 0],
  });

  const MenuItem = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color={colors.text.primary} />
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );

  const MenuButton = () => (
    <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
      <Ionicons name="menu" size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.text.primary,
          headerLeft: () => <MenuButton />,
          headerRight: () => <LogoutButton />,
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="clients/list"
          options={{
            title: 'Clientes',
          }}
        />
        <Stack.Screen
          name="clients/create"
          options={{
            title: 'Novo Cliente',
          }}
        />
        <Stack.Screen
          name="clients/edit/[id]"
          options={{
            title: 'Editar Cliente',
          }}
        />
        <Stack.Screen
          name="users/list"
          options={{
            title: 'Usuários',
          }}
        />
        <Stack.Screen
          name="users/edit/[id]"
          options={{
            title: 'Editar Usuário',
          }}
        />
        <Stack.Screen
          name="team"
          options={{
            title: 'Time de Desenvolvimento',
          }}
        />
      </Stack>

      {/* Overlay escuro quando a sidebar está aberta */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarTranslate }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.sidebarHeader} 
          onPress={() => {
            router.push('/home');
            toggleSidebar();
          }}
        >
          <Text style={styles.sidebarTitle}>Menu</Text>
        </TouchableOpacity>

        <View style={styles.sidebarContent}>
          <Text style={styles.sectionTitle}>CLIENTES</Text>
          <MenuItem
            icon="people"
            title="Listar Clientes"
            onPress={() => {
              router.push('/clients/list');
              toggleSidebar();
            }}
          />
          <MenuItem
            icon="person-add"
            title="Cadastrar Cliente"
            onPress={() => {
              router.push('/clients/create');
              toggleSidebar();
            }}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>USUÁRIOS</Text>
          <MenuItem
            icon="people"
            title="Listar Usuários"
            onPress={() => {
              router.push('/users/list');
              toggleSidebar();
            }}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>SOBRE</Text>
          <MenuItem
            icon="people-circle"
            title="Time de Desenvolvimento"
            onPress={() => {
              router.push('/team');
              toggleSidebar();
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  menuButton: {
    padding: 8,
    marginRight: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: colors.background.light,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButton: {
    marginRight: 15,
    padding: 8,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.input,
    marginTop: 30,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background.input,
    marginVertical: 20,
  },
}); 