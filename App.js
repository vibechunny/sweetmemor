// 1. Import các thành phần điều hướng cần thiết
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import "./global.css";
import Friendcreen from './src/app/(tabs)/friend.tsx';
import ProfileScreen from './src/app/(tabs)/profile.tsx';
// 2. Khởi tạo Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    // 3. Bao bọc NavigationContainer
    <NavigationContainer>
      {/* 4. Sử dụng Tab.Navigator */}
      <Tab.Navigator>
        {/* Định nghĩa các Tab */}
        <Tab.Screen 
          name="Friends" 
          component={Friendcreen} 
          options={{ 
            title: 'Friends',
            // Có thể thêm icon ở đây: tabBarIcon: ...
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;