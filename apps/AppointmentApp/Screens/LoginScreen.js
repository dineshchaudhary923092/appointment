import React, { useState, useContext, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../Constants/Colors';
import useAxios from '../Hooks/useAxios';
import { AuthContext } from '../Components/Context';
import { showMessage } from "react-native-flash-message";
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const LoginScreen = ({ navigation }) => {

    const { login } = useContext(AuthContext);

    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse, 
        getUserData, 
        userData, 
        setUserData, 
        isData, 
        userToken,
        setUserToken
    ] = useAxios();  

    const [data, setData] = useState({
		username: '',
		password: '',
		isUserValid: true,
        isPasswordValid: true,
        secureTextEntry: true,
    });

    const usernameInputChange = (value) => {
        if (value.length >= 6){
            setData({
                ...data,
                username: value,
                isUserValid: true
            })
        }
        else{
            setData({
                ...data,
                isUserValid: false
            })
        }
	}
    
    const passwordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                password: value,
                isPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isPasswordValid: false
            })
        }
    }
    
    const handleSecureTextEntry = () => {
		setData({
            ...data,
			secureTextEntry: !data.secureTextEntry
		})
    }

    useEffect(() => {
        if(responseType === 'login') {
            if(responseData.error === 1) {
                login(responseData);
                console.log(responseData);
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);
    
    const loginHandle = (username, password) => {
        if(data.isUserValid && data.isPasswordValid) {
            getData('api/v1/login', {
                username: username,
                password: password,
                remember: 'yes',
                app: 'xhr'
            }, 'login', true); 
        } else {
            showMessage({
                message: 'Some of the fields you entered are not valid',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'Roboto-Medium'
                }
            });
        }
    }

    return (
        <>
            <SafeAreaView style={{height: 20, backgroundColor: '#fff'}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
			<KeyboardAwareScrollView style={styles.Container}>
                <View style={styles.LoginContainer}>
                    <Text style={styles.Title}>Login</Text>
                    <View>
                        <View style={styles.FormInputStyle}>
                            <Text style={styles.FormInputLabelStyle}>Username</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={styles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter your email/number"
                                onChangeText={(value) => usernameInputChange(value)}
                            />
                            {
                                data.isUserValid ? null :
                                <Text style={styles.errorText}>Please enter valid email/phone number</Text>
                            }
                        </View>
                        <View style={[styles.FormInputStyle, { marginBottom: 0}]}>
                            <Text style={styles.FormInputLabelStyle}>Password</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={styles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter password"
                                secureTextEntry={true}
                                onChangeText={(value) => passwordInputChange(value)}
                            />
                            {
                                data.isPasswordValid ? null :
                                <Text style={styles.errorText}>Please enter valid password</Text>
                            }
                        </View>
                        <TouchableOpacity 
                            style={styles.ButtonContainerVar}
                            onPress={() => navigation.navigate('Forgot')}
                        >
                            <Text style={[styles.ButtonTextVar, styles.ButtonTextLeft]}>Forgot password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
							onPress={() => loginHandle(data.username, data.password)}
						>
							<LinearGradient 
								colors={[Colors.primary, Colors.green + 'B3', Colors.green + 'D9', Colors.green]} 
								style={styles.ButtonContainer}
								start={{x: 0, y: 0}} end={{x: 1, y: 1}}
							>
                            	<Text style={styles.ButtonText}>Login</Text>
							</LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.ButtonContainerVar}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.ButtonTextVar}>Don't an account? Create now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <Image source={require('../assets/welcome.png')} style={styles.LoginImg} resizeMode="contain" /> */}
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    LoginImg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
        position: 'absolute',
        bottom: deviceType === 'Tablet' ? '-7rem' : '-10rem',
        left: 0,
        right: 0,
        alignSelf: 'center',
        zIndex: 2,
    },
    LoginContainer: {
        width: '100%',
        height: Dimensions.get('window').height * 0.75,
        maxWidth: deviceType === 'Tablet' ? '75%' : '100%',
        justifyContent: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        alignSelf: 'center',
        paddingBottom: '20rem'
    },
    Title: {
        fontFamily: 'Roboto-Black',
        fontSize: deviceType === 'Tablet' ? '28rem' : '40rem',
        lineHeight: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        color: Colors.green,
        paddingBottom: deviceType === 'Tablet' ? '21rem' : '30rem',
    },
    ButtonContainer: {
        textAlign: 'center',
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        borderRadius: deviceType === 'Tablet' ? '21rem' : '30rem',
        alignContent: 'center',
        justifyContent: 'center',
    },
    ButtonContainerVar: {
        marginTop: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: deviceType === 'Tablet' ? '13rem' : '18rem',
    },
    ButtonTextVar: {
        color: Colors.light,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        fontSize: deviceType === 'Tablet' ? '10rem' : '14rem',
    },
    ButtonTextLeft: {
        textAlign: 'left',
        color: Colors.light,
        paddingBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    FormInputStyle: {
		marginBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputLabelStyle: {
        fontFamily: 'Roboto-Medium',
        fontSize: deviceType === 'Tablet' ? '13rem' : '18rem',
    },
    FormInputFieldStyle: {
        height: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        borderBottomColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: '1rem', 
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        paddingLeft: deviceType === 'Tablet' ? '1.4rem' : '2rem',
        paddingTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        color: Colors.light
    }
})

export default LoginScreen;