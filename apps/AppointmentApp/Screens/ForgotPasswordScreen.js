import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../Constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import useAxios from '../Hooks/useAxios';
import { AuthContext } from '../Components/Context';
import { showMessage } from "react-native-flash-message";
import { getDeviceType } from 'react-native-device-info';
import CodeInput from 'react-native-confirmation-code-input';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const ForgotPasswordScreen = ({ navigation }) => {

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

    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const [data, setData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
        isValidEmail: true,
        isValidNewPassword: true,
        isValidConfirmPassword: true,
    });

    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [OTP, setOTP] = useState('');
    const [showActivity, setShowActivity] = useState(false);

    const otpbox = useRef();

    const emailInputChange = (value) => {
        if (regEmail.test(value) === true){
            setData({
                ...data,
                email: value, 
                isValidEmail: true
            })
        }
        else{
            setData({
                ...data,
                isValidEmail: false
            })
        }
    }

    const newPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                newPassword: value,
                isValidNewPassword: true
            })
        }
        else{
            setData({
                ...data,
                isValidNewPassword: false
            })
        }
    }

    const confirmPasswordInputChange = (value) => {
        if (value === data.newPassword){
            setData({
                ...data,
                confirmPassword: value,
                isValidConfirmPassword: true
            })
        }
        else{
            setData({
                ...data,
                isValidConfirmPassword: false
            })
        }
    }
    
    const handleSecureTextEntryNew = () => {
		setData({
            ...data,
			secureTextEntryNew: !data.secureTextEntryNew
		})
    }

    const handleSecureTextEntryConfirm = () => {
		setData({
            ...data,
			secureTextEntryConfirm: !data.secureTextEntryConfirm
		})
    }

    useEffect(() => {
        console.log(responseData);
        if(responseType === 'fOTP') {
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'vOTP') {
            if(responseData.error === 1) {
                setShowPassword(true);
            } else {
                otpbox.current.clear();
            }
            setShowActivity(false);
            setResponse(false);
        }
        if(responseType === 'rpassword') {
            if(responseData.error === 1) {
                navigation.goBack();
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    console.log(data.email);

    const getOTP = async(data) => {
        if(data.isValidEmail) {
            getData('api/v1/send-otp', {
                email: data.email,
                type: 'reset',
                app: 'xhr'
            }, 'fOTP', true); 
        } else {
            showMessage({
                message: 'Entered phone number is not valid',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'Roboto-Medium'
                }
            });
        }
    }

    const verifyOTP = async(code, OTPData) => {
        getData('api/v1/verify-otp', {
            type: 'reset',
            hash: OTPData.data.hash,
            timestamp: OTPData.data.timestamp,
            otp: code,
            app: 'xhr'
        }, 'vOTP', true); 
    }

    const loginReset = async(password, OTP, OTPData) => {
        getData('api/v1/update-password-otp', {
            secret_key: OTPData.data.secret_key,
            password: password,
            timestamp: OTPData.data.timestamp,
            hash: OTPData.data.hash,
            otp: OTP,
            app: 'xhr'
        }, 'rpassword', true);
    }

    return (
        <>
            <SafeAreaView style={{height: 20, backgroundColor: '#fff'}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
			<View style={styles.Container}>
                <View style={styles.LoginContainer}>
                <View style={{paddingBottom: EStyleSheet.value('30rem')}}>
                        {
                            showPassword ? 
                            <KeyboardAwareScrollView>
                                <View>
                                    <Text style={styles.Title}>Reset Password</Text>
                                </View>
                                <View style={styles.FormContainer}>
                                    <View style={styles.FormInputStyle}>
                                        <Text style={styles.FormInputLabelStyle}>New Password</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={styles.FormInputFieldStyle}
                                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                            placeholder="enter new password"
                                            secureTextEntry={true}
                                            onChangeText={(value) => newPasswordInputChange(value)}
                                        />
                                        {
                                            data.isValidNewPassword ? null :
                                            <Text style={styles.errorText}>Please enter valid password</Text>
                                        }
                                    </View>
                                    <View style={styles.FormInputStyle}>
                                        <Text style={styles.FormInputLabelStyle}>Confirm Password</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={styles.FormInputFieldStyle}
                                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                            placeholder="enter confirm password"
                                            secureTextEntry={true}
                                            onChangeText={(value) => confirmPasswordInputChange(value)}
                                        />
                                        {
                                            data.isValidConfirmPassword ? null :
                                            <Text style={styles.errorText}>Please enter valid password</Text>
                                        }
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.SubmitContainer}
                                        onPress={() => {loginReset(data.newPassword, OTP, OTPData)}}
                                    >
                                        <AntDesign 
                                            name='arrowright' 
                                            size={
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('14rem') :
                                                EStyleSheet.value('24rem')
                                            } 
                                            color={Colors.dark} 
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.ExtraButton}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold]}>
                                            Back to login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView> 
                            :
                            <KeyboardAwareScrollView>
                                {
                                    showOTP ? 
                                    <View style={styles.otparea}>
                                        <Text style={[styles.TextLg, {textAlign: 'center'}]}>Enter OTP</Text>
                                        <CodeInput
                                            ref={otpbox}
                                            codeLength={4}
                                            secureTextEntry
                                            activeColor={Colors.dark}
                                            inactiveColor={Colors.light}
                                            autoFocus={true}
                                            ignoreCase={true}
                                            inputPosition='center'
                                            size={
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('32rem') :
                                                EStyleSheet.value('50rem')
                                            }
                                            onFulfill={(code) => {
                                                setShowActivity(true);
                                                setOTP(code);
                                                setTimeout(() => {
                                                    verifyOTP(code, OTPData);
                                                }, 1000)
                                            }}
                                            containerStyle={{ 
                                                marginBottom: 
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('32rem') :
                                                EStyleSheet.value('50rem')
                                            }}
                                            codeInputStyle={{ borderWidth: 1 }}
                                        /> 
                                        {
                                            showActivity ?
                                            <ActivityIndicator 
                                                size='large' 
                                                style={{
                                                    marginTop: deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('24rem') :
                                                    EStyleSheet.value('30rem')
                                                }} 
                                            /> : null
                                        }
                                        <TouchableOpacity 
                                            style={styles.ExtraButton}
                                            onPress={() => getOTP(data)}
                                        >
                                            <Text style={styles.ExtraButtonText}>
                                                If you didn't receive a code! 
                                            </Text>
                                            <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold]}>
                                                resend
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.SubmitContainer, styles.otpBack]}
                                            onPress={() => setShowOTP(false)}
                                        >
                                            <AntDesign 
                                                name='arrowleft' 
                                                size={
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('14rem') :
                                                    EStyleSheet.value('24rem')
                                                } 
                                                color={Colors.dark} 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <>
                                        <Text style={styles.Title}>Forgot Password</Text>
                                        <View>
                                            <View style={styles.FormInputStyle}>
                                                <Text style={styles.FormInputLabelStyle}>Email</Text>
                                                <TextInput
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    style={styles.FormInputFieldStyle}
                                                    placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                                    placeholder="enter your email"
                                                    onChangeText={(value) => emailInputChange(value)}
                                                />
                                                {
                                                    data.isValidEmail ? null :
                                                    <Text style={styles.errorText}>Please enter valid email</Text>
                                                }
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => getOTP(data)}
                                            >
                                                <LinearGradient 
                                                    colors={[Colors.primary, Colors.green + 'B3', Colors.green + 'D9', Colors.green]} 
                                                    style={styles.ButtonContainer}
                                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                                >
                                                    <Text style={styles.ButtonText}>Verify Email</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={styles.ButtonContainerVar}
                                                onPress={() => navigation.navigate('Login')}
                                            >
                                                <Text style={styles.ButtonTextVar}>back to login</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                }
                            </KeyboardAwareScrollView>
                        }
                    </View>
                </View>
            </View>
            <Image source={require('../assets/welcome.png')} style={styles.LoginImg} resizeMode="contain" />
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
    },
    TextLg: {
        fontSize: deviceType === 'Tablet' ? '24rem' : '35rem',
        fontFamily: 'Roboto-Medium',
        paddingBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    otpBack: {
        alignSelf: 'center',
        marginTop: deviceType === 'Tablet' ? '32rem' : '50rem',
    },
    ExtraButton: {
        marginTop: deviceType === 'Tablet' ? '22rem' : '30rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ExtraButtonText: {
        textAlign: 'center',
        fontFamily: 'Roboto-Light',
        fontSize: deviceType === 'Tablet' ? '10rem' : '15rem',
    },
    ExtraButtonTextBold:  {
        fontFamily: 'Roboto-Medium', 
        paddingLeft: deviceType === 'Tablet' ? '3.5rem' : '6rem',
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        width: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '6rem' : '10rem',
        backgroundColor: Colors.primary
    },
})

export default ForgotPasswordScreen;