import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome6, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={24} color="black" />
          ),
        }}
      />
         {/* <Tabs.Screen
        name="doctor"
        options={{
          title: 'doctor',
          tabBarIcon: ({ color, focused }) => (
            <Fontisto name="doctor" size={24} color="black" />
          ),
        }}
      />
      
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="calendar" size={24} color="black" />          ),
        }}
      />
       <Tabs.Screen
        name="chatbot"
        options={{
          title: 'chatbot',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="robot-love-outline" size={24} color="black" />
          ),
        }}
      /> */}
       
    </Tabs>
    
  );
}
