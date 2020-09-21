import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../Constants/Colors';
import WelcomeScreen from '../Screens/WelcomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import PatientStack from './PatientStack';
import DoctorStack from './DoctorStack';
import AdminStack from './AdminStack';
import ReceptionistStack from './ReceptionistStack';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreen = () => {
	return (
		<AuthStack.Navigator 
			headerMode='none' 
			initialRouteName='Welcome'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AuthStack.Screen name="Welcome" component={WelcomeScreen} />
			<AuthStack.Screen name="Login" component={LoginScreen} />
			<AuthStack.Screen name="Register" component={SignUpScreen} />
			<AuthStack.Screen name="Forgot" component={ForgotPasswordScreen} />
		</AuthStack.Navigator>
	)
}

const AppNavigation = ({userToken, goto}) => {

	// console.log('navigation');
	// console.log(userToken);
	// console.log(goto);

	return (
		<>
			{
				userToken != null ?
				<>
					{
						goto === 'admin' ?
						<AdminStack/> :
						goto === 'user' ?
						<PatientStack/> :
						goto === 'receptionist' ?
						<ReceptionistStack/> :
						goto === 'doctor' ?
						<DoctorStack/> :
						<AuthScreen/>
					}
					<SafeAreaView style={{flex: 0, backgroundColor: '#fff'}}/>
				</>
				:
				<>
					<AuthScreen/>
					<SafeAreaView style={{flex: 0, backgroundColor: '#fff'}}/>
				</>
			}
		</>
	);
}

const styles = StyleSheet.create({

})

export default AppNavigation;