import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, ScrollView, TouchableOpacity, ActivityIndicator, TouchableHighlight, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getDeviceType } from 'react-native-device-info';
import { Api } from '../../Constants/Api';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../../Hooks/useAxios';
import {Picker} from '@react-native-community/picker';

let deviceType = getDeviceType();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminDepartmentsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [matchedData, setMatchedData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [showBranches, setShowBranches] = useState(false);
    const [branch, setBranch] = useState(false);

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
        if(responseType === 'getDepartments') {
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.department.length) > 0) {
                    setData(responseData.data.department)
                    setMatchedData(responseData.data.department.filter((value) => {
                        if(value.branchName === responseData.data.branches[0].name) {
                            return value;
                        }
                    }))
                } else {
                    setData('empty');
                    setMatchedData('empty');
                }
                if(JSON.stringify(responseData.data.branches.length) > 0) {
                    setBranchData(responseData.data.branches)
                    setBranch(responseData.data.branches[0].name);
                } else {
                    setBranchData('empty');
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteDepartment') {
            if(responseData.error === 1) {
                if(responseData.data.id) {
                    const updatedData = [...data];
                    const prevIndex = data.findIndex(value => value.id === responseData.data.id);
                    updatedData.splice(prevIndex, 1);
                    setData(updatedData);
                    setMatchedData(updatedData);
                    setButtonDisabled(false);
                }
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        getUserData();
    }, [userToken])
    
    useEffect(() => {
        if(isFocused === true) {
            setBranch(null);
            setData(null);
            setMatchedData(null);
            getDepartmentsData();
        }
    }, [isFocused])

    const getDepartmentsData = async() => {
        getData('api/v1/admin/department/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            app: 'xhr'
        }, 'getDepartments', false);
    }

    const deleteDepartment = (id) => {
        getData('api/v1/admin/department/delete', {
            token: userToken,
            app: 'xhr',
            id: id,
        }, 'deleteDepartment', true);
    }

    const BranchHeader = () => {
        return (
            <View style={{paddingTop: EStyleSheet.value('20rem')}}>
                {
                    Platform.OS === 'ios' ?
                    <TouchableOpacity 
                        onPress={() => setShowBranches(true)} 
                        style={sstyles.DoctorPickerWrapper}
                    >
                        <Text style={sstyles.DoctorPickerText}>
                            {
                                branch === null ?
                                'Select Branch' :
                                branch
                            }
                        </Text>
                        <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                    </TouchableOpacity> : 
                    <View style={sstyles.PickerAndroid}>
                        <View style={[sstyles.DoctorPickerWrapper, {zIndex: 1}]}>
                            <Text style={sstyles.DoctorPickerText}>
                                {
                                    branch === null ?
                                    'Select Branch' :
                                    branch
                                }
                            </Text>
                            <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                        </View>
                        <Picker
                            selectedValue={branch}
                            style={Platform.OS === 'ios' ? sstyles.PickerStyle : sstyles.PickerStyleAndroid }
                            onValueChange={(itemValue, itemIndex) => {
                                setBranch(itemValue);
                                setMatchedData(data.filter((value) => {
                                    if(value.branchName === itemValue) {
                                        return value;
                                    }
                                }))
                            }}
                            prompt='Select Branch'
                        >
                            {
                                branchData.map( (value)=>{
                                    return <Picker.Item label={value.name} value={value.name} key={value.id} />
                                })
                            }
                        </Picker>
                    </View>
                }
                <View style={[sstyles.AHeader, {
                    borderTopColor: Colors.lighter, 
                    borderTopWidth: EStyleSheet.value('1rem'),
                    paddingTop: EStyleSheet.value('12rem')
                }]}>
                    <Text style={[sstyles.Title, {paddingTop: 15}]}>Departments</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AdminAddDepartment', {
                                type: 'Add', 
                                branches: branchData
                            })
                        }}
                    >
                        <LinearGradient 
                            colors={[Colors.green, Colors.primary]} 
                            style={sstyles.AddBtn}
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        >
                            <FontAwesome5 name="plus" style={sstyles.AddBtnIcon} />
                            <Text style={sstyles.AddBtnText}>Add</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Departments</Text>
                    </View>
                    <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    <TouchableOpacity 
                        style={sstyles.MenuBtn}
                        onPress={() => navigation.openDrawer()}
                    >
                        <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                    </TouchableOpacity>
                </LinearGradient>
                {
                    data === null ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator color={Colors.green} size='large' />
                    </View> :
                    branchData === 'empty' ?
                    <View style={sstyles.spacing}>
                        <Text style={sstyles.emptyText}>Please add branch before adding a department</Text>    
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AdminBranches')}
                        >
                            <LinearGradient 
                                colors={[Colors.green, Colors.primary]} 
                                style={[sstyles.AddBtn, {justifyContent: 'center', height: EStyleSheet.value('40rem')}]}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                                <Text style={sstyles.AddBtnText}>Add Branch</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> :
                    matchedData.length <= 0 ?
                    <>  
                        <BranchHeader />
                        <Text style={sstyles.emptyText}>No Departments added</Text>
                    </> :
                    <>  
                        <BranchHeader />
                        <View style={{paddingBottom: EStyleSheet.value('20rem')}}>
                            <SwipeListView
                                data={matchedData}
                                keyExtractor={ (id, index) => matchedData[index].id }
                                renderHiddenItem={ ({ item }, rowMap) => {
                                    return (
                                        <View style={sstyles.rowBack}>
                                            <TouchableOpacity 
                                                style={sstyles.rowEditBtn}
                                                onPress={() => {
                                                    navigation.navigate('AdminAddDepartment', {
                                                        type: 'Edit',
                                                        branches: branchData,
                                                        dItem: item
                                                    })
                                                }}
                                            >
                                                <AntDesign name="edit" style={sstyles.rowEditBtnIcon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={sstyles.rowDeleteBtn}
                                                disabled={buttonDisabled}
                                                onPress={() => {
                                                    setButtonDisabled(true);
                                                    deleteDepartment(item.id);
                                                }}
                                            >
                                                <FontAwesome5 name="trash-alt" style={sstyles.rowDeleteBtnIcon} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                                rightOpenValue={
                                    deviceType === 'Tablet' ? 
                                    EStyleSheet.value('-100rem') :
                                    EStyleSheet.value('-150rem')
                                }
                                renderItem={ ({ item, index }) => {
                                    return (
                                        <TouchableHighlight 
                                            style={[sstyles.Vbox, {alignItems: 'center'}]}
                                            underlayColor={Colors.dark + 90}
                                        >
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Image source={{uri: `${Api.baseurl}/${item.image}`}} style={[sstyles.VboxImg, sstyles.VboxImgRounded]} />
                                                    <Text style={sstyles.VboxText}>{item.name}</Text>
                                                </View>
                                                <FontAwesome5 name="chevron-right" style={{opacity: 0.4}} />
                                            </View>
                                        </TouchableHighlight> 
                                    )
                                }}
                            />
                        </View>
                    </>
                }
            </ScrollView>
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
                        selectedValue={branch}
                        style={sstyles.PickerStyle}
                        onValueChange={(itemValue, itemIndex) => {
                            setBranch(itemValue);
                            setMatchedData(data.filter((value) => {
                                if(value.branchName === itemValue) {
                                    return value;
                                }
                            }))
                        }}
                    >
                        {
                            branchData.map( (value)=>{
                                return <Picker.Item label={value.name} value={value.name} key={value.id} />
                            })
                        }
                    </Picker>
                </View> : null
            }
        </>
    )
}

export default AdminDepartmentsScreen;