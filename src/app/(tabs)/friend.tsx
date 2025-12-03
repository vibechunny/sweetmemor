import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState('All friends');

  const tabs = ['All friends', 'Pending', 'Block'];

  // Dữ liệu giả lập (giống hình)
  const friends = [
    { id: 1, name: 'Asma islam chua', subtitle: 'Love music, love world', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', added: false },
    { id: 2, name: 'Alamgir Hosain', subtitle: 'Love music, love world', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', added: true },
    { id: 3, name: 'Bablu khan bablu', subtitle: 'Love music, love world', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', added: false },
    { id: 4, name: 'Shaidul Islam Shishir', subtitle: 'Love music, love world', avatar: 'https://randomuser.me/api/portraits/men/47.jpg', added: false },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-gray-200">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Your Friends</Text>
      </View>

      {/* Số lượng friends */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold">256 Friends</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === tab ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`font-medium ${
                activeTab === tab ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách bạn bè */}
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-sm text-gray-500 mb-4">Choose your friend</Text>

        {friends.map((friend) => (
          <View key={friend.id} className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              {friend.id === 2 && (
                <View className="absolute left-8 bottom-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10 flex items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
              <Image
                source={{ uri: friend.avatar }}
                className="w-14 h-14 rounded-full mr-4"
              />
              <View>
                <Text className="font-semibold text-base">{friend.name}</Text>
                <Text className="text-gray-500 text-sm">{friend.subtitle}</Text>
              </View>
            </View>

            <TouchableOpacity
              className={`px-6 py-2 rounded-full ${
                friend.added
                  ? 'bg-gray-200'
                  : 'bg-blue-500'
              }`}
            >
              <Text
                className={`font-medium ${
                  friend.added ? 'text-gray-600' : 'text-white'
                }`}
              >
                {friend.added ? 'Added' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}