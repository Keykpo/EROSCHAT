import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Chat } from '../types';
import { useChatStore } from '../store/chatStore';
import SocketClient from '../api/socket';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { chats, loadChats } = useChatStore();

  useEffect(() => {
    loadChats();

    // Listen for match found
    SocketClient.on('matching:found', handleMatchFound);
    SocketClient.on('chat:new_message', handleNewMessage);

    return () => {
      SocketClient.off('matching:found', handleMatchFound);
      SocketClient.off('chat:new_message', handleNewMessage);
    };
  }, []);

  const handleMatchFound = (data: { chat: Chat }) => {
    setSearching(false);
    loadChats();
    navigation.navigate('Chat', { chatId: data.chat.id });
  };

  const handleNewMessage = () => {
    loadChats();
  };

  const handleSearch = () => {
    setSearching(true);
    SocketClient.joinQueue();
  };

  const handleCancelSearch = () => {
    setSearching(false);
    SocketClient.leaveQueue();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const isActive = item.status === 'ACTIVE';
    const isMatched = item.status === 'MATCHED';

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => navigation.navigate('Chat', { chatId: item.id })}
      >
        <View style={styles.chatHeader}>
          <View>
            <Text style={styles.chatTitle}>
              {isMatched ? item.otherUserProfile?.name || 'Match' : 'Chat Anónimo'}
            </Text>
            <Text style={styles.chatStatus}>
              {isActive ? '⏱️ En progreso' : isMatched ? '💕 Matched' : '⏹️ Finalizado'}
            </Text>
          </View>
          {item.unreadCount && item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const activeChats = chats.filter((c) => c.status === 'ACTIVE');
  const matchedChats = chats.filter((c) => c.status === 'MATCHED');
  const endedChats = chats.filter((c) => c.status === 'ENDED');

  return (
    <View style={styles.container}>
      {searching ? (
        <View style={styles.searchingContainer}>
          <Text style={styles.searchingTitle}>🔍 Buscando...</Text>
          <ActivityIndicator size="large" color="#ef4444" style={{ marginVertical: 24 }} />
          <Text style={styles.searchingText}>
            Estamos buscando alguien interesante para ti...
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSearch}>
            <Text style={styles.cancelButtonText}>Cancelar Búsqueda</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔥 Buscar Chat</Text>
          </TouchableOpacity>

          <FlatList
            data={[...activeChats, ...matchedChats, ...endedChats]}
            renderItem={renderChat}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes chats activos</Text>
                <Text style={styles.emptySubtext}>Presiona "Buscar Chat" para comenzar</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#ef4444"
              />
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  searchButton: {
    backgroundColor: '#ef4444',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  searchingTitle: {
    fontSize: 32,
    marginBottom: 8,
  },
  searchingText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#2a2a2b',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  chatCard: {
    backgroundColor: '#1a1a1b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2b',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  chatStatus: {
    fontSize: 14,
    color: '#9ca3af',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
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
  },
});
