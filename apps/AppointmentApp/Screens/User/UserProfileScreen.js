import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../Constants/Colors';
import { AuthContext } from '../../Components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { showMessage } from "react-native-flash-message";
import { Api } from '../../Constants/Api';
import useAxios from '../../Hooks/useAxios';
const axios = require('axios');
import ImagePicker from 'react-native-image-crop-picker';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();
const screenHeight = Dimensions.get('window').height;

const UserProfileScreen = ({ navigation }) => {

    const isFocused = useIsFocused();

    const { logout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));

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

    console.log(userData);
    
    useEffect(() => {
        if(isFocused === true) {
            setIsLoading(true);
            const getInitialData = async() => {
                await getUserData();
                if(userData) {
                    setIsLoading(false);
                    bs.current.snapTo(1);
                }
            }
            getInitialData();
        }
    }, [isFocused])
    
    useEffect(() => {
        setIsLoading(true);
        getUserData();
        if(userData) {
            setIsLoading(false);
            bs.current.snapTo(1);
        }
    }, [userToken])

    const updateProfileImage = async(imgUri, imgType, imgSize) => {
        const imageData = new FormData();
        imageData.append('file', {
            name: 'profile.jpg',
            type: imgType,
            uri: imgUri, 
            size: imgSize
        });
        imageData.append('token', userToken);
        imageData.append('app', 'xhr');
        
        try {
            const response = await axios({
                url: `${Api.baseurl}/api/v1/update-dp`,
                method: 'post',
                data: imageData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
            });
            console.log(response.data);
            var newImage = {...userData};
            newImage.image = response.data.data.user.image
            setUserData(newImage);
            try {
                await AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
                await AsyncStorage.setItem('userData', JSON.stringify(newImage));
            } catch(e) {
                console.log(e);
            }
            if(response.data.error === 5) {
                logout();
            }
            if(response.data.error === 1) {
                getUserData();
                setIsLoading(false);
                showMessage({
                    message: response.data.msg,
                    type: "success",
                    style: {
                        backgroundColor: Colors.dark
                    },
                    titleStyle: {
                        color: Colors.primary,
                        fontFamily: 'Roboto-Medium'
                    }
                });
            } else {
                getUserData();
                showMessage({
                    message: response.data.msg,
                    type: "danger",
                    icon: "danger",
                    duration: 3000,
                    titleStyle: {
                        fontFamily: 'Roboto-Medium'
                    }
                });
            }
        } catch(err) {
            console.log('No Results Found!');
            console.log(err);
        }  
    }

    const takePhoto = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            bs.current.snapTo(1);
            setIsLoading(true);
            updateProfileImage(image.path, image.mime, image.size);
        });
    }
    
    const chooseFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            bs.current.snapTo(1);
            setIsLoading(true);
            updateProfileImage(image.path, image.mime, image.size);
        });
    }

    const renderContent = () => (
        <View style={[sstyles.BottomSheet, {backgroundColor: Colors.green}]}>
            <Text style={[sstyles.ProfileName, {color: Colors.pText}]}>Upload Photo</Text>
            <Text style={[sstyles.ProfileEmail, {color: Colors.text, opacity: 0.65}]}>Choose your Profile Picture</Text>
            <TouchableOpacity 
                style={sstyles.SubmitContainer}
                onPress={() => chooseFromLibrary()}
            >   
                <Text style={sstyles.SubmitText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={sstyles.SubmitContainer}
                onPress={() => takePhoto()}
            >   
                <Text style={sstyles.SubmitText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={sstyles.SubmitContainer}
                onPress={() => {
                    bs.current.snapTo(1);
                }}
            >   
                <Text style={sstyles.SubmitText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={sstyles.bsHeader}>
            <View style={[sstyles.bsHandle, {backgroundColor: 'white'}]} />
        </View>
    )
    
    return (
        <>
            <BottomSheet
                ref={bs}
                snapPoints={[
                    screenHeight > 720 ? 
                    deviceType === 'Tablet' ? 450 : 350 
                    : 320, 0
                ]}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
            />
            <SafeAreaView style={{backgroundColor: Colors.bg}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
            {
                isLoading ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg}}>
                    <ActivityIndicator size='large' />
                </View> :
                <>
                    <Animated.View style={{flex: 1}}>
                        <ScrollView style={sstyles.Container}>
                            <Text style={sstyles.ScreenTitle}>Profile</Text>
                            <View style={sstyles.Parea}>
                                <TouchableOpacity 
                                    style={sstyles.profileBtn}
                                    onPress={() => {
                                        bs.current.snapTo(0);
                                    }}
                                >
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.primary]} 
                                        style={sstyles.Ppreview}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <Image 
                                            source={{uri: `${Api.baseurl}/${userData.image}`}} 
                                            style={sstyles.profIcon}
                                        />
                                    </LinearGradient>
                                    <View style={sstyles.ImageEdit}>
                                        <FontAwesome5 name='camera' style={sstyles.ImageEditIcon} />
                                    </View>
                                </TouchableOpacity>
                                <Text style={sstyles.Pname}>{userData.name}</Text>
                                <Text style={sstyles.Pemail}>{userData.email}</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('UserProfileEdit')}
                            >
                                <LinearGradient 
                                    colors={[Colors.green, Colors.primary]} 
                                    style={sstyles.Pbtn}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={sstyles.PbtnText}>Account Settings</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('UserChangePassword')}
                            >
                                <LinearGradient 
                                    colors={[Colors.green, Colors.primary]} 
                                    style={sstyles.Pbtn}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={sstyles.PbtnText}>Change Password</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                // onPress={navigation.navigate('next')}
                            >
                                <LinearGradient 
                                    colors={[Colors.green, Colors.primary]} 
                                    style={sstyles.Pbtn}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={sstyles.PbtnText}>Rate Our App</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => logout()}
                            >
                                <LinearGradient 
                                    colors={[Colors.green, Colors.primary]} 
                                    style={sstyles.Pbtn}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={sstyles.PbtnText}>Logout</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={sstyles.Vtext}>Version 0.0.1</Text>
                        </ScrollView>
                    </Animated.View>
                </>
            }
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    ScreenTitle: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        fontSize: 30,
        color: Colors.green,
        fontFamily: 'Roboto-Black'
    },
})

export default UserProfileScreen;