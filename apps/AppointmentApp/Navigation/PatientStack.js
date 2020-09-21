import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../Constants/Colors';
import UserHome from '../Screens/User/UserHomeScreen';
import UserHomeCategory from '../Screens/User/UserHomeCategoryScreen';
import UserHomeBooking from '../Screens/User/UserBookingScreen';
import UserHomeConfirmation from '../Screens/User/UserConfirmationScreen';
import UserAppointments from '../Screens/User/UserAppointmentsScreen';
import UserNotifications from '../Screens/User/UserNotificationsScreen';
import UserProfile from '../Screens/User/UserProfileScreen';
import UserProfileEdit from '../Screens/User/UserProfileEditScreen';
import UserChangePassword from '../Screens/User/UserChangePasswordScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Patient = createBottomTabNavigator();
const PatientHomeTab = createStackNavigator();
const PatientAppointmentsTab = createStackNavigator();
const PatientProfileTab = createStackNavigator();

const PatientHomeStack = () => {
	return (
		<PatientHomeTab.Navigator 
			headerMode='none' 
			initialRouteName='Phome'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<PatientHomeTab.Screen name="UserHome" component={UserHome} />
			<PatientHomeTab.Screen name="UserHomeCategory" component={UserHomeCategory} />
			<PatientHomeTab.Screen name="UserHomeBooking" component={UserHomeBooking} />
			<PatientHomeTab.Screen name="UserHomeConfirmation" component={UserHomeConfirmation} />
		</PatientHomeTab.Navigator>
	)
}

const PatientAppointmentsStack = () => {
	return (
		<PatientAppointmentsTab.Navigator 
			headerMode='none' 
			initialRouteName='UserAppointments'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<PatientAppointmentsTab.Screen name="UserAppointments" component={UserAppointments} />
		</PatientAppointmentsTab.Navigator>
	)
}

const PatientProfileStack = () => {
	return (
		<PatientProfileTab.Navigator 
			headerMode='none' 
			initialRouteName='UserProfile'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<PatientProfileTab.Screen name="UserProfile" component={UserProfile} />
			<PatientProfileTab.Screen name="UserProfileEdit" component={UserProfileEdit} />
			<PatientProfileTab.Screen name="UserChangePassword" component={UserChangePassword} />
		</PatientProfileTab.Navigator>
	)
}

const PatientStack = () => {
	return (
		<>
			<Patient.Navigator 
				initialRouteName='PatientHome'
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
				<Patient.Screen 
					name="PatientHome" 
					component={PatientHomeStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Home</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="home" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Patient.Screen 
					name="Appointments" 
					component={PatientAppointmentsStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Appointments</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="list-alt" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Patient.Screen 
					name="Notifications" 
					component={UserNotifications} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Notifications</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="bell" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
				<Patient.Screen 
					name="Profile" 
					component={PatientProfileStack} 
					options={{
						tabBarLabel: ({ focused }) => (
							<Text style={[styles.TabText, focused ? styles.TabTextActive : null]} >Profile</Text>
						),
						tabBarIcon: ({ focused }) => (
							<FontAwesome5 name="user-circle" style={[styles.TabIcon, focused ? styles.TabIconActive : null]} />
						)
					}}
				/>
			</Patient.Navigator>
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

export default PatientStack;