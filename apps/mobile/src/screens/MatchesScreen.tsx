import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';
import ApiClient from '../api/client';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MatchData {
  id: string;
  otherUserId: string;
  otherUserProfile: {
    name: string;
    photos: string[];
    interests: string[];
    location: string;
    age: number;
  };
  chat: {
    id: string;
    lastMessage?: {
      content: string;
      createdAt: string;
    };
    unreadCount: number;
  };
  createdAt: string;
}

export default function MatchesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { matches: data } = await ApiClient.getUserMatches(user.id);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const handleUnmatch = (matchId: string, name: string) => {
    Alert.alert(
      'Deshacer Match',
      `¿Estás seguro de que quieres deshacer el match con ${name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deshacer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiClient.unmatch(matchId);
              setMatches(matches.filter((m) => m.id !== matchId));
            } catch (error) {
              Alert.alert('Error', 'No se pudo deshacer el match');
            }
          },
        },
      ]
    );
  };

  const renderMatch = ({ item }: { item: MatchData }) => {
    return (
      <View style={styles.matchCard}>
        <TouchableOpacity
          style={styles.matchContent}
          onPress={() => navigation.navigate('Chat', { chatId: item.chat.id })}
        >
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoText}>📷</Text>
          </View>
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{item.otherUserProfile.name}</Text>
            <Text style={styles.matchLocation}>
              📍 {item.otherUserProfile.location} · {item.otherUserProfile.age} años
            </Text>
            <Text style={styles.matchInterests} numberOfLines={1}>
              {item.otherUserProfile.interests.slice(0, 3).join(', ')}
            </Text>
            {item.chat.lastMessage && (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.chat.lastMessage.content}
              </Text>
            )}
          </View>
          {item.chat.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.chat.unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.unmatchButton}
          onPress={() => handleUnmatch(item.id, item.otherUserProfile.name)}
        >
          <Text style={styles.unmatchButtonText}>Deshacer Match</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{matches.length}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💔</Text>
            <Text style={styles.emptyText}>No tienes matches aún</Text>
            <Text style={styles.emptySubtext}>
              Chatea y solicita un match cuando encuentres a alguien interesante
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#ef4444" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0b',
  },
  statsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2b',
  },
  statBox: {
    backgroundColor: '#1a1a1b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  listContent: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#1a1a1b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2b',
    overflow: 'hidden',
  },
  matchContent: {
    flexDirection: 'row',
    padding: 16,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoText: {
    fontSize: 24,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  matchLocation: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  matchInterests: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unmatchButton: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a2b',
    padding: 12,
    alignItems: 'center',
  },
  unmatchButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
