import React, { useState, useContext, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './ReceptionistStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../Constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { showMessage } from "react-native-flash-message";
import { AuthContext } from '../../Components/Context';
import useAxios from '../../Hooks/useAxios';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();

const ReceptionistChangePasswordScreen = ({ navigation }) => {
    
    const { logout } = useContext(AuthContext);

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
		oldPassword: '',
        newPassword: '',
        confirmPassword: '',
		isoldPasswordValid: true,
		isnewPasswordValid: true,
		isconfirmPasswordValid: true,
        buttonDisabled: false
    });

    const oldPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                oldPassword: value,
                isoldPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isoldPasswordValid: false
            })
        }
    }

    const newPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                newPassword: value,
                isnewPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isnewPasswordValid: false
            })
        }
    }

    const confirmPasswordInputChange = (value) => {
        if (value === data.newPassword){
            setData({
                ...data,
                confirmPassword: value,
                isconfirmPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isconfirmPasswordValid: false
            })
        }
    }

    useEffect(() => {
        if(responseType === 'cPassword') {
            if(responseData.error === 1) {
                logout();
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        getUserData();
    }, [userToken])
    
    const updatePassword = async() => {
        setData({
            ...data,
			buttonDisabled: true
        })
        if(data.isoldPasswordValid && data.isnewPasswordValid && data.isconfirmPasswordValid && data.confirmPassword != '') {
            getData('api/v1/update-password', {
                secret_key: userData.id, 
                password: data.newPassword,
                old_password: data.oldPassword,
                token: userToken,
                app: 'xhr'
            }, 'cPassword', true); 
            setData({
                ...data,
                buttonDisabled: false
            })
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
            setData({
                ...data,
                buttonDisabled: false
            })
        }
    }
    
    return (
        <>
            <SafeAreaView style={{backgroundColor: Colors.bg}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
            <View style={sstyles.Container}>
                <KeyboardAwareScrollView>
                    <View style={sstyles.Pheader}>
                        <Text style={sstyles.ScreenTitle}>Change Password</Text>
                        <TouchableOpacity 
                            style={sstyles.BackBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <FontAwesome5 name="angle-left" style={[sstyles.BackBtnIcon, {color: Colors.green}]} />
                            <Text style={[sstyles.BackBtnText, {color: Colors.green}]}>back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 20}}>
                        <View style={sstyles.FormInputStyle}>
                            <Text style={sstyles.FormInputLabelStyle}>Old Password:</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={sstyles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter old password"
                                secureTextEntry={true}
                                onChangeText={oldPasswordInputChange}
                            />
                            {
                                data.isoldPasswordValid ? null :
                                <Text style={sstyles.errorText}>Please enter valid old password</Text>
                            }
                        </View>
                        <View style={sstyles.FormInputStyle}>
                            <Text style={sstyles.FormInputLabelStyle}>New Password:</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={sstyles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter new password"
                                secureTextEntry={true}
                                onChangeText={newPasswordInputChange}
                            />
                            {
                                data.isnewPasswordValid ? null :
                                <Text style={sstyles.errorText}>Please enter valid new password</Text>
                            }
                        </View>
                        <View style={sstyles.FormInputStyle}>
                            <Text style={sstyles.FormInputLabelStyle}>Confirm Password:</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={sstyles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter confirm password"
                                secureTextEntry={true}
                                onChangeText={confirmPasswordInputChange}
                            />
                            {
                                data.isconfirmPasswordValid ? null :
                                <Text style={sstyles.errorText}>Please enter valid confirm password</Text>
                            }
                        </View>
                        <TouchableOpacity
                            disabled={data.buttonDisabled}
                            onPress={() => updatePassword()}
                        >
                            <LinearGradient 
                                colors={[Colors.green, Colors.primary]} 
                                style={[sstyles.CustomBtn, {marginTop: 10}]}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                                {
                                    data.buttonDisabled ?
                                    <ActivityIndicator color={Colors.dark} />
                                    :
                                    <Text style={sstyles.CustomBtnText}>Change Password</Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({

})

export default ReceptionistChangePasswordScreen;