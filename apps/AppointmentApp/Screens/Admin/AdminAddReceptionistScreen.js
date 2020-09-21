import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ActivityIndicator, TouchableOpacity, TextInput, LogBox, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../../Components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { Api } from '../../Constants/Api';
const axios = require('axios');
import { showMessage } from "react-native-flash-message";
import { getDeviceType } from 'react-native-device-info';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-community/picker';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();
const screenHeight = Dimensions.get('window').height;

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminAddReceptionistScreen = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const { logout } = useContext(AuthContext);
    const [receptionistImage, setReceptionistImage] = useState(null);
    const { type, branches, rUser } = route.params;
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const insets = useSafeAreaInsets();
    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [isLoading, setIsLoading] = useState(true);
    const [directUrl, setDirectUrl] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [showBranches, setShowBranches] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(branches[0].name);
    const [data, setData] = useState({
        name: type === 'Edit' ? rUser.name : '',
        email: type === 'Edit' ? rUser.email : '',
        phone: type === 'Edit' ? rUser.phone : '',
        password: '',
        userId: type === 'Edit' ? rUser.id : '',
        isNameValid: true,
        isEmailValid: true,
        isPhoneValid: true,
        isPasswordValid: true,
    });

    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    useEffect(() => {
        if(type === 'Edit') {
            setDirectUrl(true);
            setImageData(rUser.image);
            setReceptionistImage(rUser.image);
            setSelectedBranch(rUser.branch_name);
        } 
        setIsLoading(false);
    }, [isFocused])

    const nameInputChange = (value) => {
        if (value.length >= 3){
            setData({
                ...data,
                name: value,
                isNameValid: true
            })
        }
        else{
            setData({
                ...data,
                name: value,
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

    const phoneInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                phone: value,
                isPhoneValid: true
            })
        }
        else{
            setData({
                ...data,
                phone: value,
                isPhoneValid: false
            })
        }
    }

    const passworInputChange = (value) => {
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
                password: value,
                isPasswordValid: false
            })
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
            setDirectUrl(false);
            setReceptionistImage(image.path);
            setImageData(image);
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
            setDirectUrl(false);
            setReceptionistImage(image.path);
            setImageData(image);
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

    const addReceptionist = async(data, image, branch) => {
        setButtonDisabled(true);
        if(data.isNameValid && 
        data.isEmailValid && 
        data.isPhoneValid && 
        data.isPasswordValid && 
        image != null &&
        branch != null) {
            const receptionistData = new FormData();
            receptionistData.append('token', await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }));
            receptionistData.append('app', 'xhr');
            receptionistData.append('name', data.name);
            receptionistData.append('type', 'R');
            receptionistData.append('email', data.email);
            receptionistData.append('phone', data.phone);
            receptionistData.append('country', 'IN');
            receptionistData.append('callingcode', '91');
            receptionistData.append('password', data.password);
            receptionistData.append('branch', branch);
            if(!directUrl) {
                receptionistData.append('file', {
                    name: 'doctorImage.jpg',
                    type: image.mime,
                    uri: image.path,
                    size: image.size
                });
            } 
            if(type === 'Edit') {
                receptionistData.append('id', data.userId);
            }
            console.log(JSON.stringify(receptionistData));
            try {
                const response = await axios({
                    url: `${Api.baseurl}/api/v1/admin/add-user`,
                    method: 'post',
                    data: receptionistData,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data;',
                    },
                });
                try {
                    await AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
                } catch(e) {
                    console.log(e);
                }
                if(response.data.error === 5) {
                    logout();
                }
                if(response.data.error === 1) {
                    navigation.goBack();
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
            setButtonDisabled(false);
        } else {
            showMessage({
                message: 'All fields are mandatory',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'Roboto-Medium'
                }
            });
            setButtonDisabled(false);
        }
    }

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
            <SafeAreaView style={{position: 'relative', backgroundColor: Colors.bg, flex: 1}}>
                <LinearGradient 
                    colors={[Colors.green, Colors.primary]}
                    style={[sstyles.FancyTopBarStyle, {height: insets.top}]}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <StatusBar barStyle='dark-content' />
                </LinearGradient>
            </SafeAreaView> 
            <KeyboardAwareScrollView style={[sstyles.Container, sstyles.FancyTopBarStyle, {top: insets.top}]}>
                <LinearGradient 
                    colors={[Colors.green, Colors.primary]} 
                    style={sstyles.TopBarStyle}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} Receptionists</Text>
                    </View>
                    <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    <TouchableOpacity 
                        style={sstyles.BackBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome5 name="angle-left" style={sstyles.BackBtnIcon} />
                        <Text style={sstyles.BackBtnText}>back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={sstyles.MenuBtn}
                        onPress={() => navigation.openDrawer()}
                    >
                        <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                    </TouchableOpacity>
                </LinearGradient>
                <View style={{marginBottom: 50}}>
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
                                {
                                    receptionistImage === null ?
                                    <FontAwesome5 name="camera" style={sstyles.Picon} /> :
                                    <Image 
                                        source={{
                                            uri: directUrl ?
                                            `${Api.baseurl}/${receptionistImage}`
                                            : receptionistImage
                                        }} 
                                        style={sstyles.profIcon}
                                    />
                                }
                            </LinearGradient>
                            <View style={sstyles.ImageEdit}>
                                <FontAwesome5 name='camera' style={sstyles.ImageEditIcon} />
                            </View>
                        </TouchableOpacity>
                        <Text style={sstyles.Pname}>Receptionist Image</Text>
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Receptionist Name:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter receptionist name"
                            value={data.name}
                            onChangeText={nameInputChange}
                        />
                        {
                            data.isNameValid ? null :
                            <Text style={sstyles.errorText}>Name should be minimum 3 characters</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Receptionist Email:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter receptionist email"
                            value={data.email}
                            onChangeText={emailInputChange}
                        />
                        {
                            data.isEmailValid ? null :
                            <Text style={sstyles.errorText}>Please enter valid email</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Receptionist Phone:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter receptionist phone"
                            value={data.phone}
                            onChangeText={phoneInputChange}
                        />
                        {
                            data.isPhoneValid ? null :
                            <Text style={sstyles.errorText}>Please enter valid phone number</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Select Branch: </Text>
                        {
                            Platform.OS === 'ios' ?
                            <TouchableOpacity 
                                onPress={() => setShowBranches(true)} 
                                style={[sstyles.DoctorPickerWrapper, sstyles.DoctorPickerWrapperVar]}
                            >
                                <Text style={[sstyles.DoctorPickerText, sstyles.DoctorPickerTextVar]}>
                                    {
                                        selectedBranch === null ?
                                        'Select Branch' :
                                        selectedBranch
                                    }
                                </Text>
                                <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                            </TouchableOpacity> : 
                            <View style={sstyles.PickerAndroid}>
                                <View style={[sstyles.DoctorPickerWrapper, sstyles.DoctorPickerWrapperVar, {zIndex: 1}]}>
                                    <Text style={[sstyles.DoctorPickerText, sstyles.DoctorPickerTextVar]}>
                                        {
                                            selectedBranch === null ?
                                            'Select Branch' :
                                            selectedBranch
                                        }
                                    </Text>
                                    <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                                </View>
                                <Picker
                                    selectedValue={selectedBranch}
                                    style={Platform.OS === 'ios' ? sstyles.PickerStyle : sstyles.PickerStyleAndroid }
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedBranch(itemValue);
                                    }}
                                    prompt='Select Branch'
                                >
                                    {
                                        branches.map( (value)=>{
                                            return <Picker.Item label={value.name} value={value.name} key={value.id} />
                                        })
                                    }
                                </Picker>
                            </View>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Receptionist Password:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter receptionist password"
                            secureTextEntry={true}
                            onChangeText={passworInputChange}
                        />
                        {
                            data.isPasswordValid ? null :
                            <Text style={sstyles.errorText}>Password should be minimum 8 characters</Text>
                        }
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            addReceptionist(data, imageData, selectedBranch)
                        }}
                        disabled={buttonDisabled}
                    >
                        <LinearGradient 
                            colors={[Colors.green, Colors.primary]} 
                            style={[sstyles.CustomBtn, {marginVertical: 0}]}
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        >
                            {
                                buttonDisabled ?
                                <ActivityIndicator color='#fff' /> :
                                <Text style={sstyles.CustomBtnText}>
                                    {
                                        type === 'Add' ? 'Add ' : 'Update '
                                    } 
                                    Receptionist
                                </Text>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            {
                showBranches && Platform.OS === 'ios' ?
                <View style={sstyles.PickerWrap}>
                    <View style={sstyles.PickerBtns}>
                            <TouchableOpacity onPress={() => setShowBranches(false)}>
                                <Text style={sstyles.PickerBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowBranches(false)}>
                                <Text style={sstyles.PickerBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    <Picker
                        selectedValue={selectedBranch}
                        style={sstyles.PickerStyle}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedBranch(itemValue);
                        }}
                    >
                        {
                            branches.map( (value)=>{
                                return <Picker.Item label={value.name} value={value.name} key={value.id} />
                            })
                        }
                    </Picker>
                </View> : null
            }
        </>
    )
}

export default AdminAddReceptionistScreen;