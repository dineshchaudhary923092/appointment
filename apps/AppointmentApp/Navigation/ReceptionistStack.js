import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from '../Constants/Colors';
import ReceptionistHome from '../Screens/Receptionist/ReceptionistHomeScreen';
import ReceptionistProfile from '../Screens/Receptionist/ReceptionistProfileScreen';
import ReceptionistProfileEdit from '../Screens/Receptionist/ReceptionistProfileEditScreen';
import ReceptionistChangePassword from '../Screens/Receptionist/ReceptionistChangePasswordScreen';
import ReceptionistSlots from '../Screens/Receptionist/ReceptionistSlotsScreen';
import ReceptionistAddSlots from '../Screens/Receptionist/ReceptionistAddSlotsScreen';
import ReceptionistAddSlotsTb from '../Screens/Receptionist/ReceptionistAddSlotsTBScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Receptionist = createBottomTabNavigator();
const ReceptionistSlotsTab = createStackNavigator();
const ReceptionistProfileTab = createStackNavigator();

const ReceptionistSlotsStack = () => {
	return (
		<ReceptionistProfileTab.Navigator 
			headerMode='none' 
			initialRouteName='ReceptionistSlots'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<ReceptionistProfileTab.Screen name="ReceptionistSlots" component={ReceptionistSlots} />
			<ReceptionistProfileTab.Screen name="ReceptionistAddSlots" component={ReceptionistAddSlots} />
			<ReceptionistProfileTab.Screen name="ReceptionistAddSlotsTb" component={ReceptionistAddSlotsTb} />
		</ReceptionistProfileTab.Navigator>
	)
}

const ReceptionistProfileStack = () => {
	return (
		<ReceptionistProfileTab.Navigator 
			headerMode='none' 
			initialRouteName='RHome'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<ReceptionistProfileTab.Screen name="RHome" component={ReceptionistProfile} />
			<ReceptionistProfileTab.Screen name="ReceptionistProfileEdit" component={ReceptionistProfileEdit} />
			<ReceptionistProfileTab.Screen name="ReceptionistChangePassword" component={ReceptionistChangePassword} />
		</ReceptionistProfileTab.Navigator>
	)
}

const ReceptionistStack = () => {
	return (
		<>
			<Receptionist.Navigator 
				initialRouteName='ReceptionistHome'
				tabBarOptions={{
					style: {
						height: 60,
						paddingTop: 5,
						backgroundColor: '#fff',
						borderTopWidth: 0,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 7,
						},
						shadowOpacity: 0.41,
						shadowRadius: 9.11,
						elevation: 14,
						borderTopRightRadius: 20,
						borderTopLeftRadius: 20
					},
				}}
			>
				<Receptionist.Screen 
					name="ReceptionistHome" 
					component={ReceptionistHome} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Home</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="home" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Receptionist.Screen 
					name="ReceptionistSlots" 
					component={ReceptionistSlotsStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Manage Slots</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="chart-pie" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Receptionist.Screen 
					name="ReceptionistProfile" 
					component={ReceptionistProfileStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Profile</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="user-circle" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
			</Receptionist.Navigator>
		</>
	);
}

const styles = StyleSheet.create({
	TabIcon: {
		fontSize: 22,
		color: 'rgba(51, 51, 51, 0.3)'
	},
	TabIconActive: {
		color: '#337b82',
	},
	TabText: {
		fontSize: 12,
		color: 'rgba(51, 51, 51, 0.3)',
		fontFamily: 'Roboto-Regular',
		paddingBottom: 8
	},
	TabTextActive: {
		color: '#337b82',
	}
})

export default ReceptionistStack;