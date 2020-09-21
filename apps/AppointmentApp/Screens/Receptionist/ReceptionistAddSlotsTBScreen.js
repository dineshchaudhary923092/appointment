import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Platform } from 'react-native';
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

const ReceptionistAddSlotsTBScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const {name, type, id, sid, data} = route.params;
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isFromData, setIsFromData] = useState(null);
    const [fromData, setFromData] = useState(
        type === 'Edit' ? 
        name === 'Leaves' ? 
        new Date(data.start_raw) : 
        new Date(data.startpicker) : 
        new Date()
    );
    const [toData, setToData] = useState(
        type === 'Edit' ? 
        name === 'Leaves' ? 
        new Date(data.end_raw) : 
        new Date(data.endpicker) : 
        new Date()
    );
    const [buttonDisabled, setButtonDisabled] = useState(false);

    console.log(data);

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
        if(isFromData) {
            setFromData(currentDate);
        } else {
            setToData(currentDate);
        }
    };
  
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
  
    const showTimepicker = () => {
        if(name === 'Leaves') {
            showMode('date');
        } else {
            showMode('time');
        }
    };

    useEffect(() => {
        console.log('responseData');
        if(responseType === 'addData') {
            if(responseData.error === 1) {
                navigation.goBack();
            }
            setButtonDisabled(false);
        }
    }, [responseData]);

    useEffect(() => {
        getUserData();
    }, [userToken])

    const addSlots = (id, start, end, sid) => {
        getData('api/v1/duration/add', {
            app: 'xhr',
            token: userToken,
            slotid: id,
            start: moment(start).format('h:mm a'),
            end: moment(end).format('h:mm a'), 
            id: sid ? sid : ''
        }, 'addData', true);
    }

    const addBreaks = (id, start, end, sid) => {
        getData('api/v1/duration/addbreak', {
            app: 'xhr',
            token: userToken,
            slotid: id,
            start: moment(start).format('h:mm a'),
            end: moment(end).format('h:mm a'), 
            id: sid ? sid : ''
        }, 'addData', true);
    }

    const addLeaves = (id, start, end, sid) => {
        getData('api/v1/duration/addleave', {
            app: 'xhr',
            token: userToken,
            slotid: id,
            start: moment(start).format('MMM-DD YYYY'),
            end: moment(end).format('MMM-DD YYYY'),
            id: sid ? sid : ''
        }, 'addData', true);
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
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>{type} {name}</Text>
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
                        <Text style={[sstyles.Title, {paddingTop: 15, textAlign: 'center'}]}>
                            Select 
                            { name === 'Leaves' ? ' Date' : ' Time' }
                        </Text>
                        <View style={sstyles.TimelineDateArea}>
                            <TouchableOpacity 
                                onPress={() => {
                                    setIsFromData(true);
                                    setDate(fromData);
                                    showTimepicker();
                                }}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm, {textTransform: 'uppercase'}]}>
                                        {
                                            name === 'Leaves' ?
                                            moment(fromData).format('MMM') :
                                            moment(fromData).format('a')
                                        }
                                    </Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>
                                        {
                                            name === 'Leaves' ?
                                            moment(fromData).format('DD') :
                                            moment(fromData).format('h:mm')
                                        }
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateArrow} />
                            <TouchableOpacity 
                                onPress={() => {
                                    setIsFromData(false);
                                    setDate(toData);
                                    showTimepicker();
                                }}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm, {textTransform: 'uppercase'}]}>
                                        {
                                            name === 'Leaves' ?
                                            moment(toData).format('MMM') :
                                            moment(toData).format('a')
                                        }
                                    </Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>
                                        {
                                            name === 'Leaves' ?
                                            moment(toData).format('DD') :
                                            moment(toData).format('h:mm')
                                        }
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if(name === 'Slot') {
                                    type === 'Edit' ?
                                    addSlots(id, fromData, toData, sid) :
                                    addSlots(id, fromData, toData)
                                } else if(name === 'Break') {
                                    type === 'Edit' ?
                                    addBreaks(id, fromData, toData, sid) :
                                    addBreaks(id, fromData, toData)
                                } else if(name === 'Leaves') {
                                    type === 'Edit' ?
                                    addLeaves(id, fromData, toData, sid) :
                                    addLeaves(id, fromData, toData)
                                }
                            }}
                            disabled={buttonDisabled}
                        >
                            <LinearGradient 
                                colors={[Colors.green, Colors.primary]} 
                                style={sstyles.CustomBtn}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                                {
                                    buttonDisabled ?
                                    <ActivityIndicator /> :
                                    <Text style={sstyles.CustomBtnText}>
                                        {type === 'Edit' ? 'Update ' : 'Add '} 
                                        {name}
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
                        textColor={Colors.dark}
                        display="default"
                        onChange={onChange}
                        minuteInterval={5}
                    />
                </View>
            )}
        </>
    )
}

export default ReceptionistAddSlotsTBScreen;