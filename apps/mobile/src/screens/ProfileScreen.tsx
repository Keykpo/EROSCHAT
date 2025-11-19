import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const { user, profile, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>📷</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.info}>
          {calculateAge(profile.birthDate)} años · {profile.location}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fotos ({profile.photos.length}/6)</Text>
        <View style={styles.photosGrid}>
          {profile.photos.map((photo, index) => (
            <View key={index} style={styles.photoGridItem}>
              <Text style={styles.photoGridText}>Foto {index + 1}</Text>
            </View>
          ))}
          {profile.photos.length < 6 && (
            <TouchableOpacity style={styles.photoGridAdd}>
              <Text style={styles.photoGridAddText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intereses</Text>
        <View style={styles.interestsGrid}>
          {profile.interests.map((interest, index) => (
            <View key={index} style={styles.interestChip}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias de Match</Text>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Interesado en:</Text>
          <Text style={styles.preferenceValue}>
            {profile.interestedIn
              .map((g) => {
                if (g === 'MALE') return 'Hombres';
                if (g === 'FEMALE') return 'Mujeres';
                if (g === 'NON_BINARY') return 'No binario';
                return 'Otros';
              })
              .join(', ')}
          </Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Rango de edad:</Text>
          <Text style={styles.preferenceValue}>
            {profile.minAge} - {profile.maxAge} años
          </Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Distancia máxima:</Text>
          <Text style={styles.preferenceValue}>{profile.maxDistance} km</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Email:</Text>
          <Text style={styles.accountValue}>{user?.email}</Text>
        </View>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Miembro desde:</Text>
          <Text style={styles.accountValue}>
            {new Date(user?.createdAt || '').toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2b',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoText: {
    fontSize: 48,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    color: '#9ca3af',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoGridItem: {
    width: 100,
    height: 120,
    backgroundColor: '#1a1a1b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2b',
  },
  photoGridText: {
    color: '#6b7280',
    fontSize: 12,
  },
  photoGridAdd: {
    width: 100,
    height: 120,
    backgroundColor: '#1a1a1b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2b',
    borderStyle: 'dashed',
  },
  photoGridAddText: {
    color: '#6b7280',
    fontSize: 32,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#1a1a1b',
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  interestText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  preferenceValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  accountValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});
