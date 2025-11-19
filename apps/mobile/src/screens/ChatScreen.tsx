import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Message } from '../types';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import SocketClient from '../api/socket';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(1200); // 20 minutes in seconds
  const flatListRef = useRef<FlatList>(null);

  const { user } = useAuthStore();
  const { currentChat, messages, isTyping, loadChat, loadMessages, sendMessage, addMessage, setIsTyping } =
    useChatStore();

  useEffect(() => {
    loadChat(chatId);
    loadMessages(chatId);

    // Join chat room
    SocketClient.joinChat(chatId);

    // Socket listeners
    SocketClient.on('chat:message', handleMessage);
    SocketClient.on('chat:typing', handleTyping);
    SocketClient.on('chat:ended', handleChatEnded);
    SocketClient.on('chat:matched', handleMatched);

    // Timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      SocketClient.leaveChat(chatId);
      SocketClient.off('chat:message', handleMessage);
      SocketClient.off('chat:typing', handleTyping);
      SocketClient.off('chat:ended', handleChatEnded);
      SocketClient.off('chat:matched', handleMatched);
      clearInterval(interval);
    };
  }, [chatId]);

  const handleMessage = (data: { message: Message }) => {
    addMessage(data.message);
  };

  const handleTyping = (data: { userId: string; isTyping: boolean }) => {
    if (data.userId !== user?.id) {
      setIsTyping(data.isTyping);
    }
  };

  const handleChatEnded = () => {
    Alert.alert('Chat Finalizado', 'El chat ha terminado', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleMatched = () => {
    loadChat(chatId);
    Alert.alert('¡Match! 💕', 'Han hecho match! Ahora pueden ver sus perfiles');
  };

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(chatId, message.trim());
    setMessage('');
  };

  const handleTypingChange = (text: string) => {
    setMessage(text);
    SocketClient.typing(chatId, text.length > 0);
  };

  const handleMatchRequest = () => {
    Alert.alert(
      'Solicitar Match',
      '¿Quieres enviar una solicitud de match?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            SocketClient.sendMatchRequest(chatId);
            Alert.alert('Enviado', 'Solicitud de match enviada');
          },
        },
      ]
    );
  };

  const handleMatchResponse = (messageId: string, accepted: boolean) => {
    SocketClient.respondToMatchRequest(chatId, accepted);
    Alert.alert(
      accepted ? '¡Match! 💕' : 'Rechazado',
      accepted ? 'Han hecho match!' : 'Has rechazado la solicitud'
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    const isMatchRequest = item.type === 'MATCH_REQUEST';

    if (isMatchRequest && !isMine) {
      return (
        <View style={styles.matchRequestContainer}>
          <Text style={styles.matchRequestText}>
            {currentChat?.status === 'MATCHED' ? 'Ya son match 💕' : '¿Quieres hacer match?'}
          </Text>
          {currentChat?.status !== 'MATCHED' && (
            <View style={styles.matchRequestButtons}>
              <TouchableOpacity
                style={[styles.matchRequestButton, styles.matchAccept]}
                onPress={() => handleMatchResponse(item._id, true)}
              >
                <Text style={styles.matchRequestButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.matchRequestButton, styles.matchReject]}
                onPress={() => handleMatchResponse(item._id, false)}
              >
                <Text style={styles.matchRequestButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>⏱️ {formatTime(timer)}</Text>
        </View>
        {currentChat?.status === 'ACTIVE' && (
          <TouchableOpacity style={styles.matchButton} onPress={handleMatchRequest}>
            <Text style={styles.matchButtonText}>💕 Match</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Escribiendo...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#6b7280"
          value={message}
          onChangeText={handleTypingChange}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1b',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2b',
  },
  timerContainer: {
    backgroundColor: '#2a2a2b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  matchButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ef4444',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2b',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    color: '#e5e7eb',
    fontSize: 11,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  matchRequestContainer: {
    backgroundColor: '#7c3aed',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  matchRequestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  matchRequestButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  matchRequestButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  matchAccept: {
    backgroundColor: '#22c55e',
  },
  matchReject: {
    backgroundColor: '#6b7280',
  },
  matchRequestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1a1a1b',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2b',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#ef4444',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
