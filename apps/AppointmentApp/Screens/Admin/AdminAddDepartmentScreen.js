import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, StatusBar, Image, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../Components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { LogBox } from 'react-native';
import { Api } from '../../Constants/Api';
const axios = require('axios');
import { showMessage } from "react-native-flash-message";
import { getDeviceType } from 'react-native-device-info';
import ImagePicker from 'react-native-image-crop-picker';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Picker} from '@react-native-community/picker';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();
const screenHeight = Dimensions.get('window').height;

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminAddDepartmentScreen = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const { logout } = useContext(AuthContext);
    const { type, branches, dItem } = route.params;
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const insets = useSafeAreaInsets();
    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [directUrl, setDirectUrl] = useState(false);
    const [showBranches, setShowBranches] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(branches[0].name);
    const [departmentImg, setDepartmentImg] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [departmentName, setDepartmentName] = useState({
        dName: type === 'Edit' ? dItem.name  : '',
        isValid: true
    });

    useEffect(() => {
        if(type === 'Edit') {
            setDirectUrl(true);
            setImageData(dItem.image);
            setDepartmentImg(dItem.image);
            setSelectedBranch(dItem.branchName);
        }
    }, [isFocused])

    const takePhoto = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            bs.current.snapTo(1);
            setDirectUrl(false);
            setDepartmentImg(image.path);
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
            setDepartmentImg(image.path);
            setImageData(image);
        });
    }

    const departmentNameInputChange = (value) => {
        if (value.length >= 3){
            setDepartmentName({
                ...departmentName,
                dName: value,
                isValid: true
            })
        }
        else{
            setDepartmentName({
                ...departmentName,
                dName: value,
                isValid: false
            })
        }
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

    const addDepartment = async(name, image, did) => {
        setButtonDisabled(true);
        if(name.isValid && image != null & did != null) {
            const departData = new FormData();
            departData.append('token', await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }));
            departData.append('app', 'xhr');
            departData.append('name', name.dName);
            departData.append('branch', did);
            if(type === 'Edit') {
                departData.append('id', dItem.id);
            }
            if(!directUrl) {
                departData.append('file', {
                    name: 'departmentImage.jpg',
                    type: image.mime,
                    uri: image.path,
                    size: image.size
                });
            } 
            console.log(JSON.stringify(departData));
            try {
                const response = await axios({
                    url: `${Api.baseurl}/api/v1/admin/department/add`,
                    method: 'post',
                    data: departData,
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

    console.log(selectedBranch);

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
                <View style={{paddingBottom: EStyleSheet.value('50rem')}}>
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.TopBarStyle}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} Department</Text>
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
                    <View>
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
                                        departmentImg === null ?
                                        <FontAwesome5 name="camera" style={sstyles.Picon} /> :
                                        <Image 
                                            source={{
                                                uri: directUrl ?
                                                `${Api.baseurl}/${departmentImg}`
                                                : departmentImg
                                            }} 
                                            style={sstyles.profIcon}
                                        />
                                    }
                                </LinearGradient>
                                <View style={sstyles.ImageEdit}>
                                    <FontAwesome5 name='camera' style={sstyles.ImageEditIcon} />
                                </View>
                            </TouchableOpacity>
                            <Text style={sstyles.Pname}>Department Icon</Text>
                        </View>
                        <View style={sstyles.FormInputStyle}>
                            <Text style={sstyles.FormInputLabelStyle}>Department Name:</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={sstyles.FormInputFieldStyle}
                                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                                placeholder="enter department name"
                                value={departmentName.dName}
                                onChangeText={departmentNameInputChange}
                            />
                            {
                                departmentName.isValid ? null :
                                <Text style={sstyles.errorText}>Department name should be minimum 3 characters</Text>
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
                        <TouchableOpacity 
                            disabled={buttonDisabled}
                            onPress={() => {
                                addDepartment(departmentName, imageData, selectedBranch)
                            }}
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
                                        Department
                                    </Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
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

export default AdminAddDepartmentScreen;