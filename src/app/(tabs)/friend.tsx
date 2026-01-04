import { authAPI } from '@/src/api/auth';
import { friendsAPI } from '@/src/api/friend';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Friendship } from '../../api/type';

export default  function FriendsScreen() {

  const [activeTab, setActiveTab] = useState('All');
  const [allFriends, setAllFriends] = useState<Friendship[]>([]);
  const [filterFriends, setFilterFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false); // Hiện Menu chọn (QR hay Username)
  const [searchUsername, setSearchUsername] = useState('');          // Lưu nội dung nhập tìm kiếm
  const [foundUser, setFoundUser] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [currentUser, setcurrentUser] = useState<any>(null);
  const [foundUserModal, setFoundUserModal] = useState(false);          // Lưu nội dung nhập tìm kiếm

  const tabs = ['All', 'Pending', 'Rejected', 'Blocked'];

  // Gọi API trong useEffect
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        const data = await friendsAPI.getFriendsList();
        setAllFriends(data); // Lưu dữ liệu vào state

        const defaultList = data.filter(f => f.status === 'accepted');
        setFilterFriends(defaultList);

        const { data: { user } } = await authAPI.getCurrentUser();
        setcurrentUser(user);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
  const listenTabAndFilterFriends = (tab: string) => {
    setActiveTab(tab);

    let statusToFilter = '';
    switch (tab) {
      case 'All': statusToFilter = 'accepted'; break;
      case 'Pending': statusToFilter = 'pending'; break;
      case 'Rejected': statusToFilter = 'rejected'; break;
      case 'Blocked': statusToFilter = 'blocked'; break;
    }

    if (statusToFilter && statusToFilter === 'pending') {
      const filtered = allFriends.filter(f => f.status === statusToFilter && currentUser.id === f.friend_id);
      setFilterFriends(filtered);
    }

    else if (statusToFilter) {
      const filtered = allFriends.filter(f => f.status === statusToFilter);
      setFilterFriends(filtered);
    } else {
      // Trường hợp không xác định hoặc muốn hiện tất cả không lọc
      setFilterFriends(allFriends);
    }
  }

  const searchUser = async (username: string) => {
  if (!username.trim()) return;

  setLoading(true);
  try {
    const { data, error } = await friendsAPI.getProfileByUsername(username.trim());

    if (error) {
      console.log("Không tìm thấy người dùng:", error);
      setFoundUser(null);
      alert("Không tìm thấy người dùng này!");
    } else {
      setFoundUser(data);
      setFoundUserModal(true);
    }
  } catch (err) {
    console.error("Lỗi search:", err);
  } finally {
    setLoading(false);
  }
};


  const sendFriendRequest = async () => {
    if (!foundUser) return;
    const { data: { user } } = await authAPI.getCurrentUser();
    if (!user) return;
    if (foundUser.id === user.id) {
      alert("Bạn không thể gửi lời mời kết bạn cho chính mình!");
      return;
    }
    try {
      await friendsAPI.sendFriendRequest(foundUser.id);
      alert("Gửi lời mời kết bạn thành công!");
      setFoundUser(null);
      setShowAddOptions(false);
      fetchData();
      listenTabAndFilterFriends('All');

    } catch (err) {
      console.error("Lỗi gửi lời mời:", err);
    }
  }

  const handleUnfriend = async (friendId: string) => {
  try {
    const { data: { user } } = await authAPI.getCurrentUser();
    if (!user) return;

    // Hiển thị Alert xác nhận
    Alert.alert(
      "Xác nhận", // Tiêu đề
      "Bạn có chắc chắn muốn hủy kết bạn với người này không?", // Nội dung
      [
        {
          text: "Hủy",
          style: "cancel", // Nút hủy (thường có màu khác trên iOS)
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            const error =await friendsAPI.unfriend(friendId);
          if (error) {
            alert("Không thể hủy kết bạn: " + error.message);
          } else {
            alert("Đã hủy kết bạn thành công.");
            // Sau khi xóa xong, bạn cần gọi lại hàm load danh sách bạn bè để cập nhật UI
            fetchData();
            listenTabAndFilterFriends('All'); 
    }
          },
        },
      ],
      { cancelable: true } // Cho phép đóng bằng cách nhấn ra ngoài (trên Android)
    );
  } catch (err) {
    console.error("Lỗi hủy kết bạn:", err);
  }
};

const acceptFriendRequest = async (friendId: string) => {
  try {    
    await friendsAPI.respondFriendRequest(friendId, "accepted");
    alert("Đã chấp nhận lời mời kết bạn.");
    fetchData();
    listenTabAndFilterFriends('All'); 
  }
  catch (err) {
    console.error("Lỗi hủy kết bạn:", err);
  }
};
// 2. Hàm mở máy ảnh
  const openQRScanner = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        alert("Bạn cần cấp quyền máy ảnh để sử dụng tính năng này!");
        return;
      }
    }
    setScannerOpen(true);
    setScanned(false);
  };

  function openOptionScreen() {
    setShowAddOptions(true);
    setSearchUsername('');
    setFoundUser(null);
  }
  // 3. Hàm xử lý khi quét trúng mã QR
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannerOpen(false);
    
    searchUser(data);
  };
  
  if (loading) return <Text>Loading...</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-12 pb-4 border-b border-gray-200">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Friends list</Text>
        <TouchableOpacity  onPress={() => openOptionScreen()}>
          <Ionicons name="person-add-outline" size={22} color="blue" />
      </TouchableOpacity>
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
              <View className="ml-3">
                <Text className="font-semibold text-base">{friendship.friend?.full_name}</Text>
                <Text className="text-gray-500 text-sm">@{friendship.friend?.username}</Text>
              </View>
            </View>

            {/* Nút Unfriend */}
          <TouchableOpacity 
            onPress={() => handleUnfriend(friendship.friend?.id!)}
            className={`bg-gray-100 px-3 py-3 rounded-lg ${activeTab === 'All' ? '' : 'hidden'}`}
          >
            <Text className="text-red-500 font-medium text-xs">Unfriend</Text>
          </TouchableOpacity>

            {/* Nút Accept */}
          <TouchableOpacity 
            onPress={() => acceptFriendRequest(friendship.id!)}
            className={`bg-blue-400 px-3 py-3 rounded-lg ${activeTab === 'Pending' ? '' : 'hidden'}`}
          >
            <Text className="text-white font-medium text-xs">Accept</Text>
          </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

<Modal visible={showAddOptions} animationType="slide">
  <View className="flex-1 p-6 bg-white">
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-lg font-bold">Add new friend</Text>
      <TouchableOpacity onPress={() => setShowAddOptions(false)}><Text>Close</Text></TouchableOpacity>
    </View>

    {/* Ô nhập username */}
    <View className="flex-row bg-gray-100 rounded-xl p-3 mb-4">
      <TextInput 
        placeholder="Enter username..." 
        className="flex-1"
        value={searchUsername}
        onChangeText={setSearchUsername}
      />
      <TouchableOpacity onPress={() => searchUser(searchUsername)}><Ionicons name="search" size={20}/></TouchableOpacity>
    </View>

    {/* Nút mở Camera Quét QR */}
    <TouchableOpacity 
      onPress={openQRScanner}
      className="flex-row items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl mt-4"
    >
      <Ionicons name="qr-code-outline" size={24} className="mr-2"/>
      <Text>Scan QR Code</Text>
    </TouchableOpacity>

    {/* Giao diện Scanner */}
      <Modal visible={isScannerOpen} animationType="slide">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          {/* Lớp phủ UI */}
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.middleContainer}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                  {/* Khung vuông nhận diện */}
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity 
                onPress={() => setScannerOpen(false)}
                className="bg-white px-10 py-3 rounded-full shadow-lg"
              >
                <Text className="text-black font-bold">Thoát</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </Modal>
  </View>
  {/* Giao diện tìm thấy user */}
      <Modal visible={foundUserModal} animationType="slide">
          <Image source={{uri: foundUser?.avatar_url ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(foundUser?.full_name || 'User') + '&background=random'}} className="w-20 h-20 rounded-full mb-3"/>
        <Text className="font-bold text-lg">{foundUser?.full_name}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-full mt-4"
          onPress={sendFriendRequest}
        >
          <Text className="text-white font-bold">Add friend</Text>
        </TouchableOpacity>
        <TouchableOpacity 
                onPress={() => setFoundUserModal(false)}
                className="bg-white px-10 py-3 rounded-full shadow-lg"
              >
                <Text className="text-black font-bold">Đóng</Text>
              </TouchableOpacity>
      </Modal>
</Modal>
</View>
    
    
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
  },
  focusedContainer: {
    width: 250,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});