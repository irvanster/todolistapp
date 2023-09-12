import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/home';
import EventsScreen from './src/screens/events';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import DetailEvent from './src/screens/detailEvent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function App() {
  const TabNavigation = () => {
    return (
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#ddd',
        tabBarActiveTintColor: '#2b79c9',
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}>
        <Tab.Screen name="Home" component={HomeScreen}
          options={{
            tabBarLabel: 'Tugas',
            tabBarIcon: ({ focused, color, size }) => {
              if (focused)
                return <Icon name="format-list-text" size={size} color={color} />;
              return (
                <Icon name="format-list-text" size={size} color={color} />
              );
            },
          }} />
        <Tab.Screen name="Events" component={EventsScreen}
          options={{
            tabBarLabel: 'Acara',
            tabBarIcon: ({ focused, color, size }) => {
              if (focused)
                return <Icon name="calendar-multiselect" size={size} color={color} />;
              return (
                <Icon name="calendar-multiselect" size={size} color={color} />
              );
            },
          }} />
      </Tab.Navigator>
    )
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="TabNavigation" component={TabNavigation} />
            <Stack.Screen name="DetailEvent" component={DetailEvent} options={{ headerShown: true, headerTitle: 'Event', headerShadowVisible: false }} />
          </Stack.Navigator>
        </NavigationContainer>

      </Provider>

    </GestureHandlerRootView>
  );
}

export default App