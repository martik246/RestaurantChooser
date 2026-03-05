import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import PeopleScreen from '../screens/people/peopleScreen';
import DecisionScreen from '../screens/decision/decisionScreen';
import RestaurantsScreen from '../screens/restaurants/restaurantsScreen';
import { Image } from 'react-native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'react-native';

const platformOS = Platform.OS.toLowerCase();

const Tab = createMaterialTopTabNavigator();

export default function Navigation() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Restaurants"
          tabBarPosition="top"
          screenOptions={{
            animationEnabled: true,
            swipeEnabled: true,
            lazy: true,
            tabBarActiveTintColor: 'red'
          }}
        >
          <Tab.Screen
            name="People"
            component={PeopleScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/people.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              )
            }}
          />
          <Tab.Screen
            name="Decision"
            component={DecisionScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/decision.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              )
            }}
          />
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/restaurants.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}