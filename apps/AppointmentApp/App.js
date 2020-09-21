import 'react-native-gesture-handler';
import React, {useState, useEffect, useMemo, useReducer} from 'react';
import { Appearance, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './Navigation/AppNavigation';
import FlashMessage from "react-native-flash-message";
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './Components/Context';
import SplashScreen from './Screens/SplashScreen';

const {width} = Dimensions.get('window');
const rem = width / 380;

EStyleSheet.build({
	$rem: rem,
});

const App = () => {

	const initialLoginState = {
		isLoading: true,
		userToken: null,
		goto: null
	}

	const loginReducer = (prevState, action) => {
		switch(action.type) {
			case 'RETRIEVE_TOKEN':
				return {
					...prevState,
					userToken: action.token,
					goto: action.goto,
					isLoading: false
				};
			case 'LOGIN':
				return {
					...prevState,
					userToken: action.token,
					goto: action.goto,
					isLoading: false
				};
			case 'LOGOUT':
				return {
					...prevState,
					userName: null,
					userToken: null,
					goto: null,
					isLoading: false
				};
			case 'REGISTER':
				return {
					...prevState,
					userToken: action.token,
					goto: action.goto,
					isLoading: false
				};
		}
	}

	const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

	const authContext = useMemo(() => ({
		login: async(data) => {
			let userToken;
			userToken = String(data.token);
			if(data.msg === 'Login Successful.') {
				try{
					await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
					await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
					await AsyncStorage.setItem('goto', JSON.stringify(data.data.goto));
					dispatch({ type: 'LOGIN', token: userToken, goto: data.data.goto})
				} catch(e) {
					console.log(e);
				}
			}
		},
		logout: async() => {
			try {
				await AsyncStorage.removeItem('userData');
				await AsyncStorage.removeItem('userToken');
				await AsyncStorage.removeItem('goto');
			} catch(e) {
				console.log(e);
			}
			dispatch({ type: 'LOGOUT' })
		},
		register: async(data) => {
			let userToken;
			userToken = String(data.token);
			if(data.msg === 'Login Successful.') {
				try{
					await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
					await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
					await AsyncStorage.setItem('goto', JSON.stringify(data.data.goto));
					dispatch({ type: 'REGISTER', token: userToken, goto: data.data.goto})
				} catch(e) {
					console.log(e);
				}
			}
		},
	}), []);

	useEffect(()=> {
		setTimeout(async()=> {
			// await AsyncStorage.removeItem('userToken');
			// await AsyncStorage.removeItem('goto');
			let userToken;
			let goto;
			userToken = null; 
			goto = null; 
			try {
				userToken = await AsyncStorage.getItem('userToken');
				userToken = userToken != null ? JSON.parse(userToken) : null;
				goto = await AsyncStorage.getItem('goto');
				goto = goto != null ? JSON.parse(goto) : null;
				if(userToken === null) {
					dispatch({ type: 'RETRIEVE_TOKEN', token: null });
				} else {
					dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, goto: goto})
				}
			} catch(e) {
				console.log(e);
			}
		}, 2000)
	}, [])

	if(loginState.isLoading) {
		return (
			<SplashScreen/>
		)
	}

    return (
		<>
			<AuthContext.Provider value={authContext}>
				<NavigationContainer>
					<AppNavigation userToken={loginState.userToken} goto={loginState.goto} />
				</NavigationContainer>
				<FlashMessage position="top" />
			</AuthContext.Provider>
		</>
    );
};

export default App;
