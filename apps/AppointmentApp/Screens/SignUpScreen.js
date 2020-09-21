import { Text, View, SafeAreaView, StatusBar, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState, useContext, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CodeInput from 'react-native-confirmation-code-input';
import { AuthContext } from '../Components/Context'
import useAxios from '../Hooks/useAxios';
import { showMessage } from "react-native-flash-message";
import { Colors } from '../Constants/Colors';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const SignUpScreen = ({ navigation }) => {

	const { register } = useContext(AuthContext);
    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse
    ] = useAxios();  

    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const [data, setData] = useState({
		email: '',
        password: '',
        fullname: '',
		isNameValid: true,
		isEmailValid: true,
		isPasswordValid: true,
	    secureTextEntry: true
    });
    const [showOTP, setShowOTP] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [showActivity, setShowActivity] = useState(false);

    const otpbox = useRef();

    const emailInputChange = (value) => {
        if (regEmail.test(value) === true){
            setData({
                ...data,
                email: value, 
                isEmailValid: true
            })
        }
        else{
            setData({
                ...data,
                isEmailValid: false
            })
        }
    }

    const fullnameInputChange = (value) => {
        if (regName.test(value) === true){
            setData({
                ...data,
                fullname: value,
                isNameValid: true
            })
        }
        else{
            setData({
                ...data,
                isNameValid: false
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

    useEffect(() => {
        console.log(responseData);
        if(responseType === 'rOTP') {
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'signup') {
            if(responseData.error === 1) {
                register(responseData);
            } else {
                otpbox.current.clear();
            }
            setShowActivity(false);
            setResponse(false);
        }
    }, [responseData]);

    const getOTP = async(data) => {
        if(data.isEmailValid && data.isNameValid && data.isPasswordValid) {
            getData('api/v1/send-otp', {
                email: data.email,
                type: 'signup',
                app: 'xhr'
            }, 'rOTP', true); 
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

    const handleRegister = async(data, OTP, OTPData) => {
        getData('api/v1/register', {
            email: data.email,
            type: 'signup',
            hash: OTPData.data.hash,
            timestamp: OTPData.data.timestamp,
            password: data.password,
            name: data.fullname,
            country: 'IN',
            otp: OTP,
            app: 'xhr'
        }, 'signup', true); 
    }

    return (
        <>
            <SafeAreaView style={{height: 20, backgroundColor: '#fff'}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
			<KeyboardAwareScrollView style={styles.Container}>
                <View style={styles.LoginContainer}>
                    <View style={{paddingBottom: 30}}>
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
                                        console.log(code);
                                        setTimeout(() => {
                                            handleRegister(data, code, OTPData);
                                        }, 1000)
                                    }}
                                    containerStyle={{ 
                                        marginBottom: 
                                        deviceType === 'Tablet' ? 
                                        EStyleSheet.value('32rem') :
                                        EStyleSheet.value('50rem')
                                    }}
                                    codeInputStyle={{ borderWidth: EStyleSheet.value('1rem') }}
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
                                    onPress={() => {
                                        setShowOTP(false);
                                        setResponse(false);
                                    }}
                                >
                                    <AntDesign 
                                        name='arrowleft' 
                                        size={
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('14rem') :
                                            EStyleSheet.value('24rem')
                                        } 
                                        color={Colors.black} 
                                    />
                                </TouchableOpacity>
                            </View>
                            :
                            <>
                                <Text style={styles.Title}>Register</Text>
                                <View>
                                    <View style={styles.FormInputStyle}>
                                        <Text style={styles.FormInputLabelStyle}>Fullname</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={styles.FormInputFieldStyle}
                                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                            placeholder="enter your fullname"
                                            onChangeText={(value) => fullnameInputChange(value)}
                                        />
                                        {
                                            data.isNameValid ? null :
                                            <Text style={styles.errorText}>Please enter first name and last name</Text>
                                        }
                                    </View>
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
                                            data.isEmailValid ? null :
                                            <Text style={styles.errorText}>Please enter valid email</Text>
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
                                            <Text style={styles.errorText}>Password should be minimum 8 characters</Text>
                                        }
                                    </View>
                                    <TouchableOpacity 
                                        style={{marginTop: 15}}
                                        onPress={() => getOTP(data)}
                                    >
                                        <LinearGradient 
                                            colors={[Colors.primary, Colors.green + 'B3', Colors.green + 'D9', Colors.green]} 
                                            style={styles.ButtonContainer}
                                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                        >
                                            <Text style={styles.ButtonText}>Register</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.ButtonContainerVar}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        <Text style={styles.ButtonTextVar}>Already have a account? Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }                       
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    LoginContainer: {
        width: '100%',
        maxWidth: deviceType === 'Tablet' ? '75%' : '100%',
        justifyContent: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        alignSelf: 'center',
        paddingBottom: '20rem',
        height: Dimensions.get('window').height
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

export default SignUpScreen;