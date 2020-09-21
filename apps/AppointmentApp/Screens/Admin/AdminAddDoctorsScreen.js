import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, LogBox } from 'react-native';
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

const AdminAddDoctorsScreen = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const { logout } = useContext(AuthContext);
    const [doctorImage, setDoctorImage] = useState(null);
    const { type, branches, departments, dUser } = route.params;
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const insets = useSafeAreaInsets();
    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [directUrl, setDirectUrl] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [showBranches, setShowBranches] = useState(false);
    const [showDepartments, setShowDepartments] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(branches[0].name);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [data, setData] = useState({
        name: type === 'Edit' ? dUser.name : '',
        email: type === 'Edit' ? dUser.email : '',
        phone: type === 'Edit' ? dUser.phone : '',
        duration: type === 'Edit' ? dUser.slot_duration : '',
        password: '',
        userId: type === 'Edit' ? dUser.id : '',
        isNameValid: true,
        isEmailValid: true,
        isPhoneValid: true,
        isDurationValid: true,
        isPasswordValid: true,
    });

    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    // console.log(dUser)
    
    useEffect(() => {
        if(type === 'Edit') {
            setDirectUrl(true);
            setImageData(dUser.image);
            setDoctorImage(dUser.image);
            setSelectedBranch(dUser.branch_name);
            setSelectedDepartment(dUser.department_name);
        } 
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

    const durationInputChange = (value) => {
        if (value.length >= 2){
            setData({
                ...data,
                duration: value,
                isDurationValid: true
            })
        }
        else{
            setData({
                ...data,
                duration: value,
                isDurationValid: false
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
            setDoctorImage(image.path);
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
            setDoctorImage(image.path);
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

    const addDoctor = async(data, image, branch, department) => {
        setButtonDisabled(true);
        if(data.isNameValid && 
        data.isEmailValid && 
        data.isPhoneValid && 
        data.isDurationValid && 
        data.isPasswordValid && 
        image != null &&
        branch != null &&
        department != null) {
            const doctorData = new FormData();
            doctorData.append('token', await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }));
            doctorData.append('app', 'xhr');
            doctorData.append('name', data.name);
            doctorData.append('type', 'D');
            doctorData.append('email', data.email);
            doctorData.append('phone', data.phone);
            doctorData.append('country', 'IN');
            doctorData.append('callingcode', '91');
            doctorData.append('slot_duration', data.duration);
            doctorData.append('password', data.password);
            doctorData.append('branch', branch);
            doctorData.append('department', department);
            if(!directUrl) {
                doctorData.append('file', {
                    name: 'doctorImage.jpg',
                    type: image.mime,
                    uri: image.path,
                    size: image.size
                });
            } 
            if(type === 'Edit') {
                doctorData.append('id', data.userId);
            }
            console.log(JSON.stringify(doctorData));
            try {
                const response = await axios({
                    url: `${Api.baseurl}/api/v1/admin/add-user`,
                    method: 'post',
                    data: doctorData,
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
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} Doctor</Text>
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
                                    doctorImage === null ?
                                    <FontAwesome5 name="camera" style={sstyles.Picon} /> :
                                    <Image 
                                        source={{
                                            uri: directUrl ?
                                            `${Api.baseurl}/${doctorImage}`
                                            : doctorImage
                                        }} 
                                        style={sstyles.profIcon}
                                    />
                                }
                            </LinearGradient>
                            <View style={sstyles.ImageEdit}>
                                <FontAwesome5 name='camera' style={sstyles.ImageEditIcon} />
                            </View>
                        </TouchableOpacity>
                        <Text style={sstyles.Pname}>Doctor Image</Text>
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Doctor Name:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter doctor name"
                            value={data.name}
                            onChangeText={nameInputChange}
                        />
                        {
                            data.isNameValid ? null :
                            <Text style={sstyles.errorText}>Name should be minimum 3 characters</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Doctor Email:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter doctor email"
                            value={data.email}
                            onChangeText={emailInputChange}
                        />
                        {
                            data.isEmailValid ? null :
                            <Text style={sstyles.errorText}>Please enter valid email</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Doctor Phone:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter doctor phone"
                            value={data.phone}
                            onChangeText={phoneInputChange}
                        />
                        {
                            data.isPhoneValid ? null :
                            <Text style={sstyles.errorText}>Please enter valid phone number</Text>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Session Duration(in mins):</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter session duration(in mins)"
                            value={data.duration}
                            onChangeText={durationInputChange}
                        />
                        {
                            data.isDurationValid ? null :
                            <Text style={sstyles.errorText}>Session Duration should be minimum 10</Text>
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
                                        departments.map(value => {
                                            if(value.branchName === itemValue) {
                                                setSelectedDepartment(departments[0].name);
                                            } else {
                                                setSelectedDepartment(null);
                                            }
                                        })
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
                        <Text style={sstyles.FormInputLabelStyle}>Select Department: </Text>
                        {
                            Platform.OS === 'ios' ?
                            <TouchableOpacity 
                                onPress={() => setShowDepartments(true)} 
                                style={[sstyles.DoctorPickerWrapper, sstyles.DoctorPickerWrapperVar]}
                            >
                                <Text style={[sstyles.DoctorPickerText, sstyles.DoctorPickerTextVar]}>
                                    {
                                        selectedDepartment === null ?
                                        'Select Branch' :
                                        selectedDepartment
                                    }
                                </Text>
                                <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                            </TouchableOpacity> : 
                            <View style={sstyles.PickerAndroid}>
                                <View style={[sstyles.DoctorPickerWrapper, sstyles.DoctorPickerWrapperVar,{zIndex: 1}]}>
                                    <Text style={[sstyles.DoctorPickerText, sstyles.DoctorPickerTextVar]}>
                                        {
                                            selectedDepartment === null ?
                                            'Select Department' :
                                            selectedDepartment
                                        }
                                    </Text>
                                    <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                                </View>
                                <Picker
                                    selectedValue={selectedDepartment}
                                    style={Platform.OS === 'ios' ? sstyles.PickerStyle : sstyles.PickerStyleAndroid }
                                    onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}
                                    prompt='Select Department'
                                >
                                    {
                                        departments.map( (value)=>{
                                            if(value.branchName === selectedBranch) {
                                                return <Picker.Item label={value.name} value={value.name} key={value.id} />
                                            }
                                        })
                                    }
                                </Picker>
                            </View>
                        }
                    </View>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Doctor Password:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter doctor password"
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
                            addDoctor(data, imageData, selectedBranch, selectedDepartment)
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
                                    Doctor
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
                            departments.map(value => {
                                if(value.branchName === itemValue) {
                                    setSelectedDepartment(departments[0].name);
                                } else {
                                    setSelectedDepartment(null);
                                }
                            })
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
            {
                showDepartments && Platform.OS === 'ios' ?
                <View style={sstyles.PickerWrap}>
                    <View style={sstyles.PickerBtns}>
                            <TouchableOpacity onPress={() => setShowDepartments(false)}>
                                <Text style={sstyles.PickerBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDepartments(false)}>
                                <Text style={sstyles.PickerBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    <Picker
                        selectedValue={selectedDepartment}
                        style={sstyles.PickerStyle}
                        onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}
                    >
                        {
                            departments.map( (value)=>{
                                if(value.branchName === selectedBranch) {
                                    return <Picker.Item label={value.name} value={value.name} key={value.id} />
                                }
                            })
                        }
                    </Picker>
                </View> : null
            }
        </>
    )
}

export default AdminAddDoctorsScreen;