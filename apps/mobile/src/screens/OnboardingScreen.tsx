import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/authStore';
import ApiClient from '../api/client';

const INTERESTS = [
  'Música', 'Deportes', 'Arte', 'Cine', 'Lectura', 'Viajes',
  'Cocina', 'Tecnología', 'Fitness', 'Gaming', 'Fotografía', 'Naturaleza',
  'Baile', 'Moda', 'Animales', 'Anime', 'Series', 'Yoga',
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic info
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER'>('MALE');

  // Step 2: Preferences
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [maxDistance, setMaxDistance] = useState('50');
  const [minAge, setMinAge] = useState('18');
  const [maxAge, setMaxAge] = useState('30');

  // Step 3: Interests & Photos
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const refreshUser = useAuthStore((state) => state.refreshUser);

  const handleNext = () => {
    if (step === 1) {
      if (!name || !birthDate) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (interestedIn.length === 0 || !location) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterestedIn = (value: string) => {
    if (interestedIn.includes(value)) {
      setInterestedIn(interestedIn.filter((i) => i !== value));
    } else {
      setInterestedIn([...interestedIn, value]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      if (interests.length < 10) {
        setInterests([...interests, interest]);
      } else {
        Alert.alert('Límite alcanzado', 'Puedes seleccionar máximo 10 intereses');
      }
    }
  };

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert('Límite alcanzado', 'Puedes subir máximo 6 fotos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const { photos: updatedPhotos } = await ApiClient.uploadPhoto(result.assets[0].uri);
        setPhotos(updatedPhotos);
      } catch (error: any) {
        Alert.alert('Error', 'No se pudo subir la foto');
      }
    }
  };

  const handleComplete = async () => {
    if (interests.length < 3) {
      Alert.alert('Error', 'Selecciona al menos 3 intereses');
      return;
    }

    if (photos.length < 1) {
      Alert.alert('Error', 'Sube al menos 1 foto');
      return;
    }

    try {
      setLoading(true);

      await ApiClient.createProfile({
        name,
        birthDate,
        gender,
        interestedIn,
        location,
        locationCoordinates: { lat: 0, lng: 0 }, // TODO: Get real coordinates
        interests,
        maxDistance: parseInt(maxDistance),
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
      });

      await refreshUser();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>
        <Text style={styles.stepText}>Paso {step} de 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <View style={styles.step}>
            <Text style={styles.title}>Información Básica</Text>
            <Text style={styles.subtitle}>Cuéntanos sobre ti</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de Nacimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#6b7280"
                value={birthDate}
                onChangeText={setBirthDate}
              />
              <Text style={styles.hint}>Debes ser mayor de 18 años</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Género</Text>
              <View style={styles.optionsRow}>
                {(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.option, gender === g && styles.optionSelected]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
                      {g === 'MALE' ? 'Hombre' : g === 'FEMALE' ? 'Mujer' : g === 'NON_BINARY' ? 'No binario' : 'Otro'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <Text style={styles.title}>Preferencias</Text>
            <Text style={styles.subtitle}>¿A quién buscas?</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Interesado en</Text>
              <View style={styles.optionsWrap}>
                {['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, interestedIn.includes(g) && styles.chipSelected]}
                    onPress={() => toggleInterestedIn(g)}
                  >
                    <Text style={[styles.chipText, interestedIn.includes(g) && styles.chipTextSelected]}>
                      {g === 'MALE' ? 'Hombres' : g === 'FEMALE' ? 'Mujeres' : g === 'NON_BINARY' ? 'No binario' : 'Otros'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ciudad, País"
                placeholderTextColor="#6b7280"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Distancia máxima (km)</Text>
              <TextInput
                style={styles.input}
                placeholder="50"
                placeholderTextColor="#6b7280"
                value={maxDistance}
                onChangeText={setMaxDistance}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Edad mín</Text>
                <TextInput
                  style={styles.input}
                  placeholder="18"
                  placeholderTextColor="#6b7280"
                  value={minAge}
                  onChangeText={setMinAge}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Edad máx</Text>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  placeholderTextColor="#6b7280"
                  value={maxAge}
                  onChangeText={setMaxAge}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <Text style={styles.title}>Intereses y Fotos</Text>
            <Text style={styles.subtitle}>Muestra tu personalidad</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Intereses ({interests.length}/10, mín 3)
              </Text>
              <View style={styles.optionsWrap}>
                {INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[styles.chip, interests.includes(interest) && styles.chipSelected]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[styles.chipText, interests.includes(interest) && styles.chipTextSelected]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Fotos ({photos.length}/6, mín 1)
              </Text>
              <View style={styles.photosGrid}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoPlaceholder}>
                    <Text style={styles.photoText}>Foto {index + 1}</Text>
                  </View>
                ))}
                {photos.length < 6 && (
                  <TouchableOpacity style={styles.photoAdd} onPress={pickImage}>
                    <Text style={styles.photoAddText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={loading}>
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={step === 3 ? handleComplete : handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{step === 3 ? 'Completar' : 'Siguiente'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2a2a2b',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ef4444',
  },
  stepText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  step: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1b',
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  optionText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  chipText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoPlaceholder: {
    width: 100,
    height: 120,
    backgroundColor: '#1a1a1b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2b',
  },
  photoText: {
    color: '#6b7280',
    fontSize: 12,
  },
  photoAdd: {
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
  photoAddText: {
    color: '#6b7280',
    fontSize: 32,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2b',
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flex: 2,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
