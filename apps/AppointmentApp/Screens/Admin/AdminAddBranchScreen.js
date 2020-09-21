import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import useAxios from '../../Hooks/useAxios';
import { showMessage } from "react-native-flash-message";
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminAddBranchScreen = ({ navigation, route }) => {

    const { type, branchId, branchInput } = route.params;
    const insets = useSafeAreaInsets();

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [branchName, setBranchName] = useState({
        bName: type === 'Edit' ? branchInput : '',
        isValid: true
    });

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

    useEffect(() => {
        getUserData();
    }, [userToken])

    const branchNameInputChange = (value) => {
        if (value.length >= 4){
            setBranchName({
                ...branchName,
                bName: value,
                isValid: true
            })
        }
        else{
            setBranchName({
                ...branchName,
                bName: value,
                isValid: false
            })
        }
    }

    useEffect(() => {
        // console.log(JSON.stringify(responseData)); 
        if(responseType === 'addBranch') {
            if(responseData.error === 1) {
                navigation.goBack();
            } else {
                setResponse(false);
            }
            setButtonDisabled(false);
        }
    }, [responseData]);
    
    const addBranch = (name, id) => {
        setButtonDisabled(true);
        if(branchName.isValid && branchName.bName != '') {
            if(type === 'Add') {
                getData('api/v1/admin/branch/add', {
                    token: userToken,
                    app: 'xhr',
                    name: name
                }, 'addBranch', true);
            } else {
                getData('api/v1/admin/branch/add', {
                    token: userToken,
                    app: 'xhr',
                    name: name,
                    id: id
                }, 'addBranch', true);
            }
        } else {
            showMessage({
                message: 'Branch Name is not valid',
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
            <SafeAreaView style={{position: 'relative', backgroundColor: Colors.bg, flex: 1}}>
                <LinearGradient 
                    colors={[Colors.green, Colors.primary]}
                    style={[sstyles.FancyTopBarStyle, {height: insets.top}]}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <StatusBar barStyle='dark-content' />
                </LinearGradient>
            </SafeAreaView> 
            <ScrollView style={[sstyles.Container, sstyles.FancyTopBarStyle, {top: insets.top}]}>
                <LinearGradient 
                    colors={[Colors.green, Colors.primary]} 
                    style={sstyles.TopBarStyle}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} Branch</Text>
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
                <View style={{marginTop: EStyleSheet.value('30rem')}}>
                    <View style={sstyles.FormInputStyle}>
                        <Text style={sstyles.FormInputLabelStyle}>Branch Name:</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={sstyles.FormInputFieldStyle}
                            placeholderTextColor='rgba(0, 0, 0, 0.5)'
                            placeholder="enter branch name"
                            value={branchName.bName}
                            onChangeText={branchNameInputChange}
                        />
                        {
                            branchName.isValid ? null :
                            <Text style={sstyles.errorText}>Branch name should be minimum 4 characters</Text>
                        }
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            if(type === 'Add') {
                                addBranch(branchName.bName)
                            } else {
                                addBranch(branchName.bName, branchId)
                            }
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
                                    Branch
                                </Text>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}

export default AdminAddBranchScreen;