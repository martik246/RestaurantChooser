import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, Platform, StatusBar } from 'react-native';
import PeopleScreen from '../screens/people/peopleScreen';
import DecisionScreenNavigation from '../screens/decision/decisionScreenNavigation';
import RestaurantsScreen from '../screens/restaurants/restaurantsScreen';

const Tab = createMaterialTopTabNavigator();

export default function Navigation() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Restaurants"
          screenOptions={{
            animationEnabled: true,
            swipeEnabled: true,
            lazy: true,
            tabBarActiveTintColor: 'red',
            tabBarPosition: Platform.OS === 'ios' ? 'bottom' : 'top'
          }}
        >
          <Tab.Screen
            name="People"
            component={PeopleScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/icon-people.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Decision"
            component={DecisionScreenNavigation}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/icon-decision.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require('../assets/icon-restaurants.png')}
                  style={{ width: 24, height: 24 }}
                  tintColor={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}