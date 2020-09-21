import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, StatusBar, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import sstyles from './UserStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

const UserAppointmentsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [previousData, setPreviousData] = useState(null);
    const [upcomingData, setUpcomingData] = useState(null);
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
        if(responseType === 'getPast') {
            if(responseData.error === 1) {
                if(responseData.error === 1) {
                    if(JSON.stringify(responseData.data.length) > 0) {
                        setPreviousData(responseData.data);
                    } else {
                        setPreviousData('empty');
                    }
                } else {
                    setResponse(false);
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'getUpcoming') {
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
            setPreviousData(null);
            setUpcomingData(null);
            getAppointmentData();
        }
    }, [isFocused])

    const getAppointmentData = async() => {
        await getUserData();
        await getData('api/v1/appointments/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            type: 'past',
            app: 'xhr'
        }, 'getPast', false);
        await getData('api/v1/appointments/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            type: 'upcoming',
            app: 'xhr'
        }, 'getUpcoming', false);
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
                <View style={{paddingBottom: 20}}>
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.TopBarStyle}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Appointments</Text>
                        </View>
                        <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    </LinearGradient>
                    {
                        isLoading ?
                        <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                            <ActivityIndicator size='large' />
                        </View> :
                        <>
                            {
                                upcomingData === 'empty' || upcomingData === null ? null :
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
                            <Text style={[sstyles.Title, {paddingTop: 15}]}>Previous Appointments</Text>
                            {
                                previousData === null ?
                                <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                                    <ActivityIndicator size='large' />
                                </View> :
                                previousData === 'empty' ? 
                                <Text style={sstyles.emptyText}>No Previous Bookings</Text> :
                                <FlatList
                                    data={previousData}
                                    keyExtractor={ (id, index) => previousData[index].id }
                                    renderItem={ ({ item }) => {
                                        return (
                                        <TouchableOpacity>
                                            <View style={sstyles.AStatus}>
                                                <LinearGradient 
                                                    colors={[Colors.green, Colors.primary]} 
                                                    style={sstyles.AStatusInner}
                                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                                >
                                                    <Text style={sstyles.AboxStatus}>{item.status}</Text>
                                                </LinearGradient>
                                            </View>
                                            <View style={sstyles.Abox}>
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
                                            </View>
                                        </TouchableOpacity>
                                        )
                                    }}
                                />
                            }
                        </>
                    }
                </View>
            </ScrollView>
        </>
    )
}

export default UserAppointmentsScreen;