import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, Platform, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './ReceptionistStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LogBox } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import useAxios from '../../Hooks/useAxios';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const ReceptionistAddSlotsScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const { type, doctorId, slot } = route.params;
    const [date, setDate] = useState(new Date(Date.now()+(24*60*60*1000)));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isFromDate, setIsFromDate] = useState(null);
    const [fromDate, setFromDate] = useState(type === 'Edit' ? new Date(slot.start_date) : new Date(Date.now()+(24*60*60*1000)));
    const [toDate, setToDate] = useState(type === 'Edit' ? new Date(slot.end_date) : new Date(Date.now()+(24*60*60*1000)));
    const [buttonDisabled, setButtonDisabled] = useState(false); 

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
  
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if(isFromDate) {
            setFromDate(currentDate);
        } else {
            setToDate(currentDate);
        }
    };
  
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
  
    const showDatepicker = () => {
        showMode('date');
    };

    useEffect(() => {
        if(responseType === 'addTimeline') {
            navigation.goBack();
            setButtonDisabled(false);
        }
    }, [responseData]);

    useEffect(() => {
        getUserData();
    }, [userToken])

    const addTimeline = (id, start, end, sid) => {
        getData('api/v1/slots/add', {
            app: 'xhr',
            token: userToken,
            doctor: id,
            start: moment(start).format('MMM-DD YYYY'),
            end: moment(end).format('MMM-DD YYYY'),
            id: sid ? sid : ''
        }, 'addTimeline', true);
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
                <View>
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.TopBarStyle}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} Timeline</Text>
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
                        <Text style={[sstyles.Title, {paddingTop: 15, textAlign: 'center'}]}>Select Dates</Text>
                        <View style={sstyles.TimelineDateArea}>
                            <TouchableOpacity 
                                onPress={() => {
                                    setIsFromDate(true);
                                    setDate(fromDate);
                                    showDatepicker();
                                }}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm]}>{moment(fromDate).format('MMM')}</Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>{moment(fromDate).format('DD')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateArrow} />
                            <TouchableOpacity 
                                onPress={() => {
                                    setIsFromDate(false);
                                    setDate(toDate);
                                    showDatepicker();
                                }}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm]}>{moment(toDate).format('MMM')}</Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>{moment(toDate).format('DD')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            onPress={() => {
                                type === 'Edit' ?
                                addTimeline(doctorId, fromDate, toDate, slot.id) :
                                addTimeline(doctorId, fromDate, toDate)
                            }}
                            disabled={buttonDisabled}
                            style={{paddingTop: EStyleSheet.value('15rem')}}
                        >
                            <LinearGradient 
                                colors={[Colors.green, Colors.primary]} 
                                style={sstyles.Pbtn}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                                {
                                    buttonDisabled ?
                                    <ActivityIndicator /> :
                                    <Text style={sstyles.PbtnText}>
                                        {
                                            type === 'Add' ? 'Add ' : 'Update '
                                        } 
                                        Timeline
                                    </Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {show && (
                <View style={Platform.OS === 'ios' ? sstyles.DatePickerStyle : null}>
                    {
                        Platform.OS === 'ios' ?
                        <View style={sstyles.PickerBtns}>
                            <TouchableOpacity onPress={() => setShow(false)}>
                                <Text style={sstyles.PickerBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShow(false)}>
                                <Text style={sstyles.PickerBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View> : null
                    }
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        display="default"
                        textColor={Colors.dark}
                        onChange={onChange}
                    />
                </View>
            )}
        </>
    )
}

export default ReceptionistAddSlotsScreen;