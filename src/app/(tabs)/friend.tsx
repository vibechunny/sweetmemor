import { friendsAPI } from '@/src/api/friend';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { Friendship } from '../../api/type';


export default  function FriendsScreen() {

  const [activeTab, setActiveTab] = useState('All');
  const [allFriends, setAllFriends] = useState<Friendship[]>([]);
  const [filterFriends, setFilterFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['All', 'Pending', 'Rejected', 'Blocked'];

  // Gọi API trong useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await friendsAPI.getFriendsList();
        setAllFriends(data); // Lưu dữ liệu vào state

        const defaultList = data.filter(f => f.status === 'accepted');
        setFilterFriends(defaultList);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const listenTabAndFilterFriends = (tab: string) => {
    setActiveTab(tab);

    let statusToFilter = '';
    switch (tab) {
      case 'All': statusToFilter = 'accepted'; break;
      case 'Pending': statusToFilter = 'pending'; break;
      case 'Rejected': statusToFilter = 'rejected'; break;
      case 'Blocked': statusToFilter = 'blocked'; break;
    }

    if (statusToFilter) {
      const filtered = allFriends.filter(f => f.status === statusToFilter);
      setFilterFriends(filtered);
    } else {
      // Trường hợp không xác định hoặc muốn hiện tất cả không lọc
      setFilterFriends(allFriends);
    }
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-gray-200">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Friends list</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => listenTabAndFilterFriends(tab)}
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
        <Text className="text-sm text-gray-500 mb-4">{filterFriends.length} friends</Text>

        {filterFriends.map((friendship) => (
          <View key={friendship.friend?.id} className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">

              <Image
                source={{ uri: friendship.friend?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(friendship.friend?.full_name || 'User') + '&background=random',}}
                className="w-14 h-14 rounded-full mr-4"
              />
              <View>
                <Text className="font-semibold text-base">{friendship.friend?.full_name}</Text>
                <Text className="text-gray-500 text-sm">{friendship.friend?.username}</Text>
              </View>
            </View>

            <TouchableOpacity
              className={`px-6 py-2 rounded-full `}
            >
              <Text
                className={`font-medium text-white`}
              >
                Added
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}