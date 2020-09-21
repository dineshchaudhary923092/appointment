import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, Platform, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminAddSlotsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [timelineChecked, setTimelineChecked] = useState(false);
    const [breakChecked, setBreakChecked] = useState(false);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
  
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
  
    const showDatepicker = () => {
        showMode('date');
    };

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
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Add Timeline/Break</Text>
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
                    <View style={{marginBottom: 50}}>
                        <Text style={[sstyles.Title, {paddingTop: 15, textAlign: 'center'}]}>Select Dates</Text>
                        <View style={sstyles.TimelineDateArea}>
                            <TouchableOpacity 
                                onPress={showDatepicker}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm]}>Mon</Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>15</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateArrow} />
                            <TouchableOpacity 
                                onPress={showDatepicker}
                            >
                                <LinearGradient    
                                    colors={[Colors.bg, Colors.bg]} 
                                    style={[sstyles.TimelineDayBtn]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.TimelineDayBtnTextSm]}>Mon</Text>
                                    <Text style={[sstyles.TimelineDayBtnText]}>15</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={sstyles.CheckArea}>
                            <TouchableOpacity 
                                onPress={() => setTimelineChecked(!timelineChecked)}
                                style={{flex: 1}}
                            >
                                <LinearGradient 
                                    
                                    colors={timelineChecked ? [Colors.green, Colors.primary] : [Colors.bg, Colors.bg]} 
                                    style={[sstyles.CheckBtn, timelineChecked ? sstyles.CheckBtnChecked : null]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.CheckBtnText, timelineChecked ? sstyles.CheckBtnTextChecked : null]}>Timeline</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setBreakChecked(!breakChecked)}
                                style={{flex: 1}}
                            >
                                <LinearGradient    
                                    colors={breakChecked ? [Colors.green, Colors.primary] : [Colors.bg, Colors.bg]} 
                                    style={[sstyles.CheckBtn, breakChecked ? sstyles.CheckBtnChecked : null]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                    <Text style={[sstyles.CheckBtnText, breakChecked ? sstyles.CheckBtnTextChecked : null]}>Break</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        {
                            timelineChecked ?
                            <View style={sstyles.TimelineArea}>
                                <Text style={[sstyles.Title, {paddingTop: 15}]}>Timelines</Text>
                                <View style={sstyles.TimelineAreaWrapper}>
                                    <View style={sstyles.TimelineAreaWrapperItem}>
                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                            <Text style={sstyles.TimelineDateAItemText}>11:00 AM</Text>
                                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateAItemIcon} />
                                            <Text style={sstyles.TimelineDateAItemText}>04:00 PM</Text>
                                        </View>
                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                            <TouchableOpacity 
                                                style={sstyles.TimelineAreaWrapperBtn}
                                                onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                    name: "Timeline",
                                                    type: 'Edit'
                                                })}
                                            >
                                                <FontAwesome5 name='pencil-alt' style={{color: '#fff'}} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[sstyles.TimelineAreaWrapperBtn, sstyles.TimelineAreaWrapperBtnVar]}
                                                onPress={() => console.log('delete')}
                                            >
                                                <FontAwesome5 name='trash-alt' style={{color: '#fff'}} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={sstyles.TimelineAreaWrapperItem}>
                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                            <Text style={sstyles.TimelineDateAItemText}>11:00 AM</Text>
                                            <FontAwesome5 name='arrows-alt-h' style={sstyles.TimelineDateAItemIcon} />
                                            <Text style={sstyles.TimelineDateAItemText}>04:00 PM</Text>
                                        </View>
                                        <View style={sstyles.TimelineAreaWrapperItemInner}>
                                            <TouchableOpacity 
                                                style={sstyles.TimelineAreaWrapperBtn}
                                                onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                                    name: "Timeline",
                                                    type: 'Edit'
                                                })}
                                            >
                                                <FontAwesome5 name='pencil-alt' style={{color: '#fff'}} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[sstyles.TimelineAreaWrapperBtn, sstyles.TimelineAreaWrapperBtnVar]}
                                                onPress={() => console.log('delete')}
                                            >
                                                <FontAwesome5 name='trash-alt' style={{color: '#fff'}} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={{alignItems: 'center'}}
                                    onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                        name: "Timeline",
                                        type: 'Add'
                                    })}
                                >
                                    <FontAwesome5 name='plus-circle' style={sstyles.SlotsAddBtnIcon} />
                                </TouchableOpacity>
                            </View> : null
                        }
                        {
                            breakChecked ?
                            <View style={sstyles.BreakArea}>
                                <Text style={[sstyles.Title, {paddingTop: 15}]}>Breaks</Text>
                                <TouchableOpacity 
                                    style={{alignItems: 'center'}}
                                    onPress={() => navigation.navigate('AdminAddSlotsTb', {
                                        name: "Break",
                                        type: 'Add'
                                    })}
                                >
                                    <FontAwesome5 name='plus-circle' style={sstyles.SlotsAddBtnIcon} />
                                </TouchableOpacity>
                            </View> : null
                        }
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
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                </View>
            )}
        </>
    )
}

export default AdminAddSlotsScreen;