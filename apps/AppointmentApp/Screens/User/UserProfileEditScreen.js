import React, { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../../Constants/Colors';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import CodeInput from 'react-native-confirmation-code-input';
import useAxios from '../../Hooks/useAxios';
import { getDeviceType, useFirstInstallTime } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const UserProfileEditScreen = ({ navigation }) => {

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

    const isFocused = useIsFocused();

    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const [data, setData] = useState({
		email: '',
        fullname: '',
		isNameValid: true,
		isEmailValid: true
    });
    const [showOTP, setShowOTP] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [showActivity, setShowActivity] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const otpbox = useRef();

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
                fullname: value,
                isNameValid: false
            })
        }
	}

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
                email: value, 
                isEmailValid: false
            })
        }
    }
    
    useEffect(() => {
        getUserData();
        if(userData) {
            setData({
                ...data,
                email: userData.email,
                fullname: userData.name,
            })
        }
    }, [userToken])

    useEffect(() => {
        if(responseType === 'eOTP') {
            console.log(responseData);
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'updateProfile') {
            if(responseData.error === 1) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UserProfile' }],
                })
            } else {
                setResponse(false);
            }
            setShowActivity(false);
            if(OTPData != null) {
                otpbox.current.clear();
            }
        }
        setButtonDisabled(false);
    }, [responseData]);

    const getOTP = async(data) => {
        setButtonDisabled(true);
        if(data.isEmailValid && data.isNameValid) {
            if(data.email != userData.email) {
                getData('api/v1/send-otp', {
                    email: data.email,
                    type: 'profile',
                    app: 'xhr'
                }, 'eOTP', true); 
            } else {
                getData('api/v1/update-profile', {
                    email: data.email,
                    type: 'profile',
                    name: data.fullname,
                    country: 'IN',
                    token: userToken,
                    app: 'xhr'
                }, 'updateProfile', true); 
            }
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

    const updateProfile = async(data, OTP, OTPData) => {
        getData('api/v1/update-profile', {
            email: data.email,
            type: 'profile',
            hash: OTPData.data.hash,
            timestamp: OTPData.data.timestamp,
            name: data.fullname,
            country: 'IN',
            otp: OTP,
            token: userToken,
            app: 'xhr'
        }, 'updateProfile', true); 
    }
    
    return (
        <>
            <SafeAreaView style={{backgroundColor: Colors.bg}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
            <View style={sstyles.Container}>
                <KeyboardAwareScrollView>
                    {
                        showOTP ? 
                        <View style={sstyles.otparea}>
                            <Text style={[sstyles.TextLg, {textAlign: 'center'}]}>Enter OTP</Text>
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
                                    setTimeout(() => {
                                        updateProfile(data, code, OTPData);
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
                                        EStyleSheet.value('14rem') :
                                        EStyleSheet.value('20rem')
                                    }} 
                                /> : null
                            }
                            <TouchableOpacity 
                                style={sstyles.ExtraButton}
                                onPress={() => getOTP(data)}
                            >
                                <Text style={sstyles.ExtraButtonText}>
                                    If you didn't receive a code! 
                                </Text>
                                <Text style={[sstyles.ExtraButtonText, sstyles.ExtraButtonTextBold]}>
                                    resend
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[sstyles.SubmitContainerVar, sstyles.otpBack]}
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
                        </View> :
                        <>
                            <View style={sstyles.Pheader}>
                                <Text style={sstyles.ScreenTitle}>Edit Profile</Text>
                                <TouchableOpacity 
                                    style={sstyles.BackBtn}
                                    onPress={() => navigation.goBack()}
                                >
                                    <FontAwesome5 name="angle-left" style={[sstyles.BackBtnIcon, {color: Colors.green}]} />
                                    <Text style={[sstyles.BackBtnText, {color: Colors.green}]}>back</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                !isData ?
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <ActivityIndicator size="large" />
                                </View> :
                                <View style={{marginTop: 20}}>
                                    <View style={sstyles.FormInputStyle}>
                                        <Text style={sstyles.FormInputLabelStyle}>Full name:</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={sstyles.FormInputFieldStyle}
                                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                            placeholder="enter your full name"
                                            value={data.fullname}
                                            onChangeText={fullnameInputChange}
                                        />
                                        {
                                            data.isNameValid ? null :
                                            <Text style={sstyles.errorText}>Please enter first name and last name</Text>
                                        }
                                    </View>
                                    <View style={sstyles.FormInputStyle}>
                                        <Text style={sstyles.FormInputLabelStyle}>Email:</Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={sstyles.FormInputFieldStyle}
                                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                            placeholder="enter email"
                                            value={data.email}
                                            onChangeText={emailInputChange}
                                        />
                                        {
                                            data.isEmailValid ? null :
                                            <Text style={sstyles.errorText}>Please enter valid email</Text>
                                        }
                                    </View>
                                    <TouchableOpacity
                                        disabled={buttonDisabled}
                                        onPress={() => {
                                            getOTP(data);
                                        }}
                                    >
                                        <LinearGradient 
                                            colors={[Colors.green, Colors.primary]} 
                                            style={[sstyles.CustomBtn, {marginTop: 10}]}
                                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                        >
                                            {
                                                buttonDisabled ?
                                                <ActivityIndicator color={Colors.dark} />
                                                :
                                                <Text style={sstyles.CustomBtnText}>Update Account</Text>
                                            }
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            }
                        </>
                    }
                </KeyboardAwareScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({

})

export default UserProfileEditScreen;