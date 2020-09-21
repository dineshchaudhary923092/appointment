import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, StatusBar, Image, ScrollView, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
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

const UserHomeScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [matchedData, setMatchedData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [showBranches, setShowBranches] = useState(false);
    const [branch, setBranch] = useState(false);
    const [upcomingData, setUpcomingData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        if(responseType === 'getAppointments') {
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.length) > 0) {
                    setUpcomingData(responseData.data);
                } else {
                    setUpcomingData('empty');
                }
            } else {
                setResponse(false);
            }
            setIsLoading(false);
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
            getHomeData();
        }
    }, [isFocused])

    const getHomeData = async() => {
        await getUserData();
        await getData('api/v1/admin/department/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            app: 'xhr'
        }, 'getDepartments', false);
        await getData('api/v1/appointments/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            type: 'upcoming',
            app: 'xhr'
        }, 'getAppointments', false);
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
                {
                    isLoading ? 
                    <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator size='large' />
                    </View> :
                    <>
                        <LinearGradient 
                            colors={[Colors.green, Colors.primary]} 
                            style={sstyles.TopBarStyle}
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        >
                            <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                                <Text style={sstyles.Welcome}>Welcome</Text>
                                <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Mr. {userData.name}</Text>
                            </View>
                            <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                        </LinearGradient>
                        <BranchHeader />
                        {
                            upcomingData === 'empty' || upcomingData === null ?
                            null :
                            <>
                                <Text style={[sstyles.Title, {paddingTop: 15}]}>Upcoming Appointments</Text>
                                <FlatList
                                    data={upcomingData}
                                    keyExtractor={ (id, index) => upcomingData[index].id }
                                    renderItem={ ({ item }) => {
                                        return (
                                            <TouchableOpacity 
                                                style={sstyles.Abox}
                                                onPress={() => {
                                                    navigation.navigate('UserHomeConfirmation', {
                                                        data: item,
                                                        type: 'Edit'
                                                    })
                                                }}
                                            >
                                                <View style={sstyles.AboxLeft}>
                                                    <Image source={{uri: `${Api.baseurl}/${item.image}`}} style={sstyles.AboxImg} />
                                                    <View style={sstyles.AboxLeftInner}>
                                                        <View>
                                                            <Text style={sstyles.BoxDname}>Dr. {item.doctor_name}</Text>
                                                            <Text style={sstyles.BoxCategory}>{item.department_name}</Text>
                                                        </View>
                                                        <Text style={sstyles.AboxLight}>FID: {item.print_slot_id}</Text>
                                                    </View>
                                                </View>
                                                <View style={sstyles.AboxRight}>
                                                    <FontAwesome5 name="calendar-alt" style={sstyles.AboxIcon} />
                                                    <Text style={sstyles.AboxLight}>{item.date}</Text>
                                                    <Text style={sstyles.AboxTime}>{item.time}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </>
                        }
                        {
                            data === null ? 
                            <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                                <ActivityIndicator size='large' />
                            </View> :
                            data === 'empty' ?
                            <Text style={sstyles.emptyText}>No Departments added</Text> :
                            <>  
                                <View style={{paddingBottom: EStyleSheet.value('20rem')}}>
                                    <Text style={[sstyles.Title, {paddingTop: 15}]}>Departments</Text>
                                    <FlatList
                                        data={matchedData}
                                        keyExtractor={ (id, index) => matchedData[index].id }
                                        renderItem={ ({ item, index }) => {
                                            return (
                                                <TouchableOpacity  
                                                    style={[sstyles.Vbox, {alignItems: 'center'}]}
                                                    onPress={() => {
                                                        navigation.navigate('UserHomeCategory', {
                                                            id: item.id,
                                                            dName: item.name
                                                        })
                                                    }}
                                                >
                                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                            <Image source={{uri: `${Api.baseurl}/${item.image}`}} style={[sstyles.VboxImg, sstyles.VboxImgRounded]} />
                                                            <Text style={sstyles.VboxText}>{item.name}</Text>
                                                        </View>
                                                        <FontAwesome5 name="chevron-right" style={{opacity: 0.4}} />
                                                    </View>
                                                </TouchableOpacity> 
                                            )
                                        }}
                                    />
                                </View>
                            </>
                        }
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

export default UserHomeScreen;