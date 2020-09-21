import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MonthPicker from 'react-native-month-year-picker';
import moment from "moment";
import { getDeviceType } from 'react-native-device-info';
import { Api } from '../../Constants/Api';
import { showMessage } from "react-native-flash-message";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../../Hooks/useAxios';

let deviceType = getDeviceType();

const UserBookingScreen = ({ navigation, route }) => {

    const [month, setMonth] = useState(moment(new Date()).format('MM YYYY'));
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const isFocused = useIsFocused();
    const { dInfo, type } = route.params;
    const insets = useSafeAreaInsets();
    const [doctorInfo, setDoctorInfo] = useState(dInfo)
    const [slots, setSlots] = useState(null)
    const [slotsList, setSlotsList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false)

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
        if(responseType === 'getSlots') {
            console.log(responseData);
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.slots.length) > 0) {
                    setSlots(responseData.data.slots);
                    setSelectedDate(responseData.data.slots[0].date);
                    if(JSON.stringify(responseData.data.slots[0].slotList.length) > 0) {
                        setSlotsList(responseData.data.slots[0].slotList);
                    } else {
                        setSlotsList('empty');
                    }
                } else {
                    setSlots('empty');
                }
            } else {
                setResponse(false);
            }
            setIsLoading(false);
        }
        if(responseType === 'bookSlot') {
            console.log(responseData);
            if(responseData.error === 1) {
                navigation.navigate('UserHomeConfirmation', {
                    data: responseData.data,
                    type: 'View'
                });
            } else {
                setResponse(false);
            }
            setButtonDisabled(false);
        }
    }, [responseData]);

    useEffect(() => {
        getUserData();
    }, [userToken])
    
    useEffect(() => {
        if(isFocused === true) {
            setSlots(null);
            setSlotsList(null);
            getSlots();
        }
    }, [isFocused])

    const getSlots = async(month) => {
        await getUserData();
        await getData('api/v1/timeslot/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            year: month ? month.substring(3) : moment(new Date()).format('YYYY'),
            month: month ? month.slice(0, -5) :  moment(new Date()).format('MM'),
            doctor: type === 'resc' ? doctorInfo.doctor_id : doctorInfo.id,
            app: 'xhr'
        }, 'getSlots', false);
    }

    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedMonth = newDate || month;
            setMonth(selectedMonth);
            setIsLoading(true);
            getSlots(selectedMonth);
            showPicker(false);
        },
    [],); 

    const confirmAppointment = async(time) => {
        if(selectedTime != null) {
            await getData('api/v1/appointments/bookslot', {
                token: userToken,
                userId: userData.id,
                id: time,
                oldId: type === 'resc' ? doctorInfo.id : '',
                app: 'xhr'
            }, 'bookSlot', false);
        } else {
            showMessage({
                message: 'Please select a slot',
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
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Booking Slot</Text>
                    </View>
                    <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    <TouchableOpacity 
                        style={sstyles.BackBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome5 name="angle-left" style={sstyles.BackBtnIcon} />
                        <Text style={sstyles.BackBtnText}>back</Text>
                    </TouchableOpacity>
                </LinearGradient>
                {
                    isLoading ?
                    <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator size='large' />
                    </View> :
                    <>
                        <View style={sstyles.Bbox}>
                            <Image source={{uri: `${Api.baseurl}/${doctorInfo.image}`}} style={sstyles.BboxImg} />
                            <View style={sstyles.BboxInner}>
                                <Text style={[sstyles.BoxDname, {fontSize: 18}]}>{doctorInfo.name}</Text>
                                <Text style={[sstyles.BoxCategory, {fontSize: 13, opacity: 0.5}]} ellipsizeMode='tail'>{doctorInfo.department_name} | {doctorInfo.branch_name}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => showPicker(true)} style={sstyles.MonthWrapper}>
                            <Text style={sstyles.MonthText}>
                                {
                                    moment(month, 'MM').format('MMMM') + ' ' + month.substring(3)
                                }
                            </Text>
                            <FontAwesome5 name="angle-down" style={sstyles.MonthIcon} />
                        </TouchableOpacity>
                        {
                            slots === 'empty' ?
                            <Text style={sstyles.emptyText}>No Slots Available</Text> :
                            <>
                                <FlatList
                                    data={slots}
                                    keyExtractor={ (id, index) => slots[index].date }
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={ ({ item, index }) => {
                                        return (
                                        <TouchableWithoutFeedback 
                                            onPress={() => {
                                                item.date === selectedDate ? 
                                                null : 
                                                setSelectedDate(item.date);
                                                setSelectedTime(null);
                                                slots.filter(value => {
                                                    if(value.date === item.date) {
                                                        setSlotsList(value.slotList);
                                                    }
                                                })
                                            }}
                                        >
                                            <View style={sstyles.DateWrapper}>
                                                <LinearGradient 
                                                    style={sstyles.DateWrapperInner}
                                                    colors={item.date === selectedDate ? [Colors.green, Colors.primary] : ['#fff', '#fff']} 
                                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                                >
                                                    <Text 
                                                        style={[
                                                            sstyles.DateText, 
                                                            item.date === selectedDate ? 
                                                            { color: '#fff' } : null
                                                        ]}>
                                                        {item.day}
                                                    </Text>
                                                    <Text 
                                                        style={[
                                                            sstyles.DateNum, 
                                                            item.date === selectedDate ? 
                                                            { color: '#fff' } : null
                                                        ]}>
                                                        {item.date}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        )
                                    }}
                                />
                                {
                                    slotsList === 'empty' || slotsList === null ?
                                    <Text style={sstyles.SlotsCount}>0 Slots Found</Text> :
                                    <FlatList
                                        data={slotsList}
                                        keyExtractor={ (id, index) => slotsList[index].id }
                                        horizontal={false}
                                        numColumns={4}
                                        columnWrapperStyle={{
                                            justifyContent: 'center',
                                            marginHorizontal: 15
                                        }}
                                        ListHeaderComponent={() => {
                                            return (
                                                <Text style={sstyles.SlotsCount}>{slotsList.length} Slots Found</Text>
                                            )
                                        }}
                                        renderItem={ ({ item, index }) => {
                                            // console.log(item);
                                            return (
                                                <TouchableWithoutFeedback   
                                                    onPress={() => setSelectedTime(item.id)}
                                                    disabled={item.status === 'free' ? false : true}
                                                >
                                                    <View style={[sstyles.SlotWrapper, {
                                                        opacity : item.status === 'free' ? 1 : 0.35
                                                    }]}>
                                                        <LinearGradient 
                                                            style={sstyles.SlotWrapperInner}
                                                            colors={
                                                                selectedTime === item.id ? 
                                                                [Colors.green, Colors.primary] : 
                                                                ['#fff', '#fff']
                                                            } 
                                                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                                            >
                                                            <Text
                                                                style={[
                                                                    sstyles.SlotText,
                                                                    selectedTime === item.id ? 
                                                                    { color: '#fff' } : { color: Colors.dark }
                                                                ]}
                                                            >
                                                                {item.printTime}
                                                            </Text>
                                                        </LinearGradient>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            )
                                        }}
                                    />
                                }
                                <TouchableOpacity
                                    disabled={buttonDisabled}
                                    onPress={() => {
                                        setButtonDisabled(true);
                                        confirmAppointment(selectedTime);
                                    }}
                                    style={{marginBottom: EStyleSheet.value('50rem')}}
                                >
                                    <LinearGradient 
                                        style={sstyles.BookBtn}
                                        colors={[Colors.green, Colors.primary]} 
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        {
                                            buttonDisabled ?
                                            <ActivityIndicator /> :
                                            <Text style={sstyles.BookBtnText}>
                                                Book an Appointment
                                            </Text>
                                        }
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        }
                    </>
                }
            </ScrollView>
            {show && (
                <MonthPicker
                    onChange={onValueChange}
                    value={month}
                    minimumDate={new Date()}
                    maximumDate={new Date(2025, 5)}
                    enableAutoDarkMode={true}
                    outputFormat='MM YYYY'
                    okButton="Select"
              />
            )}
        </>
    )
}

const styles = StyleSheet.create({

})

export default UserBookingScreen;