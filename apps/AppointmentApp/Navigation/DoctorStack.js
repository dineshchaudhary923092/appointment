import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from '../Constants/Colors';
import DoctorHome from '../Screens/Doctor/DoctorHomeScreen';
import DoctorAppointments from '../Screens/Doctor/DoctorAppointmentsScreen';
import DoctorProfileHome from '../Screens/Doctor/DoctorProfileScreen';
import DoctorProfileEdit from '../Screens/Doctor/DoctorProfileEditScreen';
import DoctorChangePassword from '../Screens/Doctor/DoctorChangePasswordScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Doctor = createBottomTabNavigator();
const DoctorProfileTab = createStackNavigator();

const DoctorProfileStack = () => {
	return (
		<DoctorProfileTab.Navigator 
			headerMode='none' 
			initialRouteName='DoctorProfileHome'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<DoctorProfileTab.Screen name="DoctorProfileHome" component={DoctorProfileHome} />
			<DoctorProfileTab.Screen name="DoctorProfileEdit" component={DoctorProfileEdit} />
			<DoctorProfileTab.Screen name="DoctorChangePassword" component={DoctorChangePassword} />
		</DoctorProfileTab.Navigator>
	)
}

const DoctorStack = () => {
	return (
		<>
			<Doctor.Navigator 
				initialRouteName='DoctorHome'
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
				<Doctor.Screen 
					name="DoctorHome" 
					component={DoctorHome} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Home</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="home" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Doctor.Screen 
					name="DoctorAppointments" 
					component={DoctorAppointments} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Appointments</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="list-alt" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Doctor.Screen 
					name="DoctorProfile" 
					component={DoctorProfileStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Profile</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="user-circle" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
			</Doctor.Navigator>
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

export default DoctorStack;