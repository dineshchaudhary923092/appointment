import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, StatusBar, FlatList, ScrollView, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Picker} from '@react-native-community/picker';
import { LogBox } from 'react-native';
import useAxios from '../../Hooks/useAxios';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminSlotsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [doctorId, setDoctorId] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [timelines, setTimelines] = useState(null);
    const [showDoctors, setShowDoctors] = useState(false);
    const [data, setData] = useState(null);

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

    // console.log('timelines'); 
    // console.log(JSON.stringify(timelines));

    useEffect(() => {
        if(responseType === 'getSlots') {
            // console.log(JSON.stringify(responseData));
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.users.length) > 0) {
                    setDoctors(responseData.data.users)
                    responseData.data.users.filter((value) => {
                        if(value.selected === 'yes') {
                            setDoctor(value.name)
                            setDoctorId(value.id)
                        }
                    })
                } else {
                    setDoctors('empty');
                }
                if(JSON.stringify(responseData.data.slots.length) > 0) {
                    setTimelines(responseData.data.slots)
                } else {
                    setTimelines('empty');
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'getSlotsId') {
            // console.log(JSON.stringify(responseData));
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.slots.length) > 0) {
                    setTimelines(responseData.data.slots)
                } else {
                    setTimelines('empty');
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteTimeline') {
            if(responseData.error === 1) {
                if(responseData.data.id) {
                    const updatedData = [...timelines];
                    const prevIndex = timelines.findIndex(value => value.id === responseData.data.id);
                    updatedData.splice(prevIndex, 1);
                    setTimelines(updatedData);
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteSlot') {
            console.log(responseData)
            if(responseData.error === 1) {
                const updatedData = [...timelines];
                for(var i = 0; i < updatedData.length; i++){
                    if(updatedData[i].id==responseData.data.slotId) {
                        updatedData[i].durations = responseData.data.durations   
                    }
                }
                setTimelines(updatedData);
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
            setData(null);
            getSlots();
        }
    }, [isFocused])

    const getSlots = async(id) => {
        getData('api/v1/slots/get', {
            app: 'xhr',
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            doctor: id ? id : ''
        }, id ? 'getSlotsId' : 'getSlots', false);
    }

    const deleteTimeline = (id) => {
        getData('api/v1/slots/delete', {
            app: 'xhr',
            token: userToken,
            id: id
        }, 'deleteTimeline', false);
    }

    const deleteSlot = (id) => {
        getData('api/v1/duration/delete', {
            app: 'xhr',
            token: userToken,
            durationid: id
        }, 'deleteSlot', false);
    }

    const deleteBreak = (id) => {
        getData('api/v1/duration/deletebreak', {
            app: 'xhr',
            token: userToken,
            breakid: id
        }, 'deleteSlot', false);
    }

    const deleteLeave = (id) => {
        getData('api/v1/duration/deleteleave', {
            app: 'xhr',
            token: userToken,
            leaveid: id
        }, 'deleteSlot', false);
    }

    const SlotsHeader = () => {
        return (
            <>
                {
                    Platform.OS === 'ios' ?
                    <TouchableOpacity onPress={() => setShowDoctors(true)} style={sstyles.DoctorPickerWrapper}>
                        <Text style={sstyles.DoctorPickerText}>
                            {
                                doctor === null ?
                                'Select Doctor' :
                                'Mr. ' + doctor
                            }
                        </Text>
                        <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                    </TouchableOpacity> : 
                    <View style={sstyles.PickerAndroid}>
                        <View style={[sstyles.DoctorPickerWrapper, {zIndex: 1}]}>
                            <Text style={sstyles.DoctorPickerText}>
                                {
                                    doctor === null ?
                                    'Select Doctor' :
                                    'Mr. ' + doctor
                                }
                            </Text>
                            <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                        </View>
                        <Picker
                            selectedValue={doctor}
                            style={Platform.OS === 'ios' ? sstyles.PickerStyle : sstyles.PickerStyleAndroid }
                            onValueChange={(itemValue, itemIndex) => {
                                doctors.filter(value => {
                                    if(value.name === itemValue) {
                                        getSlots(value.id);
                                    }
                                })
                                setDoctor(itemValue);
                            }}
                            prompt='Select Doctor'
                        >
                            {
                                doctors.map( (value)=>{
                                    return <Picker.Item label={value.name} value={value.name} key={value.id} />
                                })
                            }
                        </Picker>
                    </View>
                }
                <View style={sstyles.AHeader}>
                    <Text style={sstyles.Title}>Doctor Timeline</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AdminAddSlots', {
                                type: 'Add',
                                doctorId: doctorId
                            })
                        }}
                    >
                        <LinearGradient 
                            colors={[Colors.green, Colors.primary]} 
                            style={sstyles.AddBtn}
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        >
                            <FontAwesome5 name="plus" style={sstyles.AddBtnIcon} />
                            <Text style={sstyles.AddBtnText}>Add Timeline</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </>
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
                <View>
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.TopBarStyle}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Manage Slots</Text>
                        </View>
                        <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                        <TouchableOpacity 
                            style={sstyles.MenuBtn}
                            onPress={() => navigation.openDrawer()}
                        >
                            <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                <View style={{paddingTop: 20}}>
                    {
                        timelines === null ?
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: EStyleSheet.value('50rem')}}>
                            <ActivityIndicator color={Colors.green} size='large' />
                        </View>
                        :
                        timelines === 'empty' ?
                        <>
                            <SlotsHeader />
                            <Text style={sstyles.emptyText}>No Timelines added</Text>
                        </> :
                        <>
                            <SlotsHeader />
                            <View style={sstyles.DoctorTimeline}>
                                <FlatList 
                                    data={timelines}
                                    keyExtractor={ (id, index) => timelines[index].id }
                                    renderItem={ ({ item, index }) => {
                                        return (
                                            <View style={sstyles.DoctorTimelineItem}>
                                                <LinearGradient 
                                                    colors={[Colors.green, Colors.green, Colors.primary]} 
                                                    style={sstyles.DoctorTimelineItemTitle}
                                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                                >
                                                    <Text style={sstyles.DoctorTimelineItemTitleText}>{item.start_date_formatted}</Text>
                                                    <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineItemTitleIcon} />
                                                    <Text style={sstyles.DoctorTimelineItemTitleText}>{item.end_date_formatted}</Text>
                                                </LinearGradient>
                                                <View style={sstyles.TimelineArea}>
                                                    <View style={sstyles.TimelineTitle}>
                                                        <Text style={[sstyles.Title, {paddingTop: EStyleSheet.value('15rem'), paddingHorizontal: 0}]}>Slots</Text>
                                                        <TouchableOpacity 
                                                            style={{alignItems: 'center', flexDirection: 'row'}}
                                                            onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                name: "Slot",
                                                                type: 'Add',
                                                                id: item.id
                                                            })}
                                                        >
                                                            <FontAwesome5 name='plus-circle' style={sstyles.SlotsAddBtnIcon} />
                                                            <Text style={sstyles.SlotsAddBtnText}>Add</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={sstyles.TimelineAreaWrapper}>
                                                        {
                                                            item.durations.timeline.length > 0 ?
                                                            item.durations.timeline.map( (value)=>{
                                                                return (
                                                                    <View style={sstyles.TimelineAreaWrapperItem} key={value.id}>
                                                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                            <Text style={sstyles.TimelineDateAItemText}>{value.startap}</Text>
                                                                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateAItemIcon} />
                                                                            <Text style={sstyles.TimelineDateAItemText}>{value.endap}</Text>
                                                                        </View>
                                                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                            <TouchableOpacity 
                                                                                style={sstyles.TimelineAreaWrapperBtn}
                                                                                onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                                    name: "Slot",
                                                                                    type: 'Edit',
                                                                                    id: item.id,
                                                                                    sid: value.id,
                                                                                    data: value
                                                                                })}
                                                                            >
                                                                                <FontAwesome5 name='pencil-alt' style={{color: '#fff'}} />
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity 
                                                                                style={[sstyles.TimelineAreaWrapperBtn, sstyles.TimelineAreaWrapperBtnVar]}
                                                                                onPress={() => {
                                                                                    deleteSlot(value.id);
                                                                                }}
                                                                            >
                                                                                <FontAwesome5 name='trash-alt' style={{color: '#fff'}} />
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            }) :
                                                            <Text style={[sstyles.emptyText, {paddingTop: EStyleSheet.value('10rem')}]}>No Slots Added</Text>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={sstyles.TimelineArea}>
                                                    <View style={sstyles.TimelineTitle}>
                                                        <Text style={[sstyles.Title, {paddingTop: EStyleSheet.value('15rem'), paddingHorizontal: 0}]}>Breaks</Text>
                                                        <TouchableOpacity 
                                                            style={{alignItems: 'center', flexDirection: 'row'}}
                                                            onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                name: "Break",
                                                                type: 'Add',
                                                                id: item.id
                                                            })}
                                                        >
                                                            <FontAwesome5 name='plus-circle' style={sstyles.SlotsAddBtnIcon} />
                                                            <Text style={sstyles.SlotsAddBtnText}>Add</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {
                                                        item.durations.break.length > 0 ?
                                                        <View style={sstyles.TimelineAreaWrapper}>
                                                            {
                                                                item.durations.break.map( (value)=>{
                                                                    return (
                                                                        <View style={sstyles.TimelineAreaWrapperItem} key={value.id}>
                                                                            <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                                <Text style={sstyles.TimelineDateAItemText}>{value.startap}</Text>
                                                                                <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateAItemIcon} />
                                                                                <Text style={sstyles.TimelineDateAItemText}>{value.endap}</Text>
                                                                            </View>
                                                                            <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                                <TouchableOpacity 
                                                                                    style={sstyles.TimelineAreaWrapperBtn}
                                                                                    onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                                        name: "Break",
                                                                                        type: 'Edit',
                                                                                        id: item.id,
                                                                                        sid: value.id,
                                                                                        data: value
                                                                                    })}
                                                                                >
                                                                                    <FontAwesome5 name='pencil-alt' style={{color: '#fff'}} />
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity 
                                                                                    style={[sstyles.TimelineAreaWrapperBtn, sstyles.TimelineAreaWrapperBtnVar]}
                                                                                    onPress={() => {
                                                                                        deleteBreak(value.id);
                                                                                    }}
                                                                                >
                                                                                    <FontAwesome5 name='trash-alt' style={{color: '#fff'}} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View> : null
                                                    }
                                                </View>
                                                <View style={sstyles.TimelineArea}>
                                                    <View style={sstyles.TimelineTitle}>
                                                        <Text style={[sstyles.Title, {paddingTop: EStyleSheet.value('15rem'), paddingHorizontal: 0}]}>Leaves</Text>
                                                        <TouchableOpacity 
                                                            style={{alignItems: 'center', flexDirection: 'row'}}
                                                            onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                name: "Leaves",
                                                                type: 'Add',
                                                                id: item.id
                                                            })}
                                                        >
                                                            <FontAwesome5 name='plus-circle' style={sstyles.SlotsAddBtnIcon} />
                                                            <Text style={sstyles.SlotsAddBtnText}>Add</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {
                                                        item.durations.leave.length > 0 ?
                                                        <View style={sstyles.TimelineAreaWrapper}>
                                                            {
                                                                item.durations.leave.map( (value)=>{
                                                                    return (
                                                                        <View style={sstyles.TimelineAreaWrapperItem} key={value.id}>
                                                                            <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                                <Text style={sstyles.TimelineDateAItemText}>{value.start}</Text>
                                                                                <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateAItemIcon} />
                                                                                <Text style={sstyles.TimelineDateAItemText}>{value.end}</Text>
                                                                            </View>
                                                                            <View style={sstyles.TimelineAreaWrapperItemInner}>
                                                                                <TouchableOpacity 
                                                                                    style={sstyles.TimelineAreaWrapperBtn}
                                                                                    onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                                                        name: "Leaves",
                                                                                        type: 'Edit',
                                                                                        id: item.id,
                                                                                        sid: value.id,
                                                                                        data: value
                                                                                    })}
                                                                                >
                                                                                    <FontAwesome5 name='pencil-alt' style={{color: '#fff'}} />
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity 
                                                                                    style={[sstyles.TimelineAreaWrapperBtn, sstyles.TimelineAreaWrapperBtnVar]}
                                                                                    onPress={() => {
                                                                                        deleteLeave(value.id);
                                                                                    }}
                                                                                >
                                                                                    <FontAwesome5 name='trash-alt' style={{color: '#fff'}} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View> : null
                                                    }
                                                </View>
                                                <View style={sstyles.CboxBtns}>
                                                    <TouchableOpacity 
                                                        style={{flex: 1}}
                                                        onPress={()=> {
                                                            deleteTimeline(item.id)
                                                        }}
                                                    >
                                                        <LinearGradient 
                                                            colors={['#e73232', 'rgba(219, 50, 50, 0.65)']} 
                                                            style={[sstyles.CustomBtn, sstyles.CustomBtnSm]}
                                                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                        >
                                                            <Text style={[sstyles.CustomBtnText, sstyles.CustomBtnTextSm]}>Delete</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style={{flex: 1}}
                                                        onPress={() => {
                                                            navigation.navigate('AdminAddSlots', {
                                                                type: 'Edit',
                                                                doctorId: doctorId,
                                                                slot: item
                                                            })
                                                        }}
                                                    >
                                                        <LinearGradient 
                                                            colors={[Colors.green, Colors.primary]} 
                                                            style={[sstyles.CustomBtn, sstyles.CustomBtnSm]}
                                                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                        >
                                                            <Text style={[sstyles.CustomBtnText, sstyles.CustomBtnTextSm]}>Edit</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                        </> 
                    }
                </View>
            </ScrollView>
            {
                showDoctors && Platform.OS === 'ios' ?
                <View style={sstyles.PickerWrap}>
                    <View style={sstyles.PickerBtns}>
                            <TouchableOpacity onPress={() => setShowDoctors(false)}>
                                <Text style={sstyles.PickerBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDoctors(false)}>
                                <Text style={sstyles.PickerBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    <Picker
                        selectedValue={doctor}
                        style={sstyles.PickerStyle}
                        onValueChange={(itemValue, itemIndex) => {
                            doctors.filter(value => {
                                if(value.name === itemValue) {
                                    getSlots(value.id);
                                }
                            })
                            setDoctor(itemValue);
                        }}
                    >
                        {
                            doctors.map( (value)=>{
                                return <Picker.Item label={value.name} value={value.name} key={value.id} />
                            })
                        }
                    </Picker>
                </View> : null
            }
        </>
    )
}

export default AdminSlotsScreen;