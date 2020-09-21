import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Picker} from '@react-native-community/picker';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminSlotsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const [doctor, setDoctor] = useState(null);
    const [showDoctors, setShowDoctors] = useState(false);

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
                    </LinearGradient>
                </View>
                <View style={{paddingTop: 20}}>
                    <TouchableOpacity onPress={() => setShowDoctors(true)} style={sstyles.DoctorPickerWrapper}>
                        <Text style={sstyles.DoctorPickerText}>
                            {
                                doctor === null ?
                                'Select Doctor' :
                                'Mr. ' + doctor
                            }
                        </Text>
                        <FontAwesome5 name="angle-down" style={sstyles.DoctorPickerIcon} />
                    </TouchableOpacity>
                    {
                        doctor === null ?
                        null :
                        <>
                            <View style={sstyles.AHeader}>
                                <Text style={sstyles.Title}>Doctor Timeline</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AdminAddSlots')}
                                >
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.primary]} 
                                        style={sstyles.AddBtn}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <FontAwesome5 name="plus" style={sstyles.AddBtnIcon} />
                                        <Text style={sstyles.AddBtnText}>Add Timelines/Breaks</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={sstyles.DoctorTimeline}>
                                <View style={sstyles.DoctorTimelineItem}>
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.green, Colors.primary]} 
                                        style={sstyles.DoctorTimelineItemTitle}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <Text style={sstyles.DoctorTimelineItemTitleText}>17, Aug 20</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineItemTitleIcon} />
                                        <Text style={sstyles.DoctorTimelineItemTitleText}>25, Aug 20</Text>
                                    </LinearGradient>
                                    <Text style={sstyles.DoctorTimelineItemSubtitle}>Timelines</Text>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>11:00 AM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>04:00 PM</Text>
                                    </View>
                                    <Text style={sstyles.DoctorTimelineItemSubtitle}>Breaks</Text>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>11:00 AM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>04:00 PM</Text>
                                    </View>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>01:00 PM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>02:00 PM</Text>
                                    </View>
                                    <View style={sstyles.CboxBtns}>
                                        <TouchableOpacity style={{flex: 1}}>
                                            <LinearGradient 
                                                colors={['#e73232', 'rgba(219, 50, 50, 0.65)']} 
                                                style={[sstyles.CustomBtn, sstyles.CustomBtnSm]}
                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            >
                                                <Text style={[sstyles.CustomBtnText, sstyles.CustomBtnTextSm]}>Delete</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{flex: 1}}>
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
                                <View style={sstyles.DoctorTimelineItem}>
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.green, Colors.primary]} 
                                        style={sstyles.DoctorTimelineItemTitle}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <Text style={sstyles.DoctorTimelineItemTitleText}>17, Aug 20</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineItemTitleIcon} />
                                        <Text style={sstyles.DoctorTimelineItemTitleText}>25, Aug 20</Text>
                                    </LinearGradient>
                                    <Text style={sstyles.DoctorTimelineItemSubtitle}>Timelines</Text>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>11:00 AM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>04:00 PM</Text>
                                    </View>
                                    <Text style={sstyles.DoctorTimelineItemSubtitle}>Breaks</Text>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>11:00 AM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>04:00 PM</Text>
                                    </View>
                                    <View style={sstyles.DoctorTimelineItemInner}>
                                        <Text style={sstyles.DoctorTimelineText}>01:00 PM</Text>
                                        <FontAwesome5 name='arrows-alt-h' style={sstyles.DoctorTimelineIcon} />
                                        <Text style={sstyles.DoctorTimelineText}>02:00 PM</Text>
                                    </View>
                                    <View style={sstyles.CboxBtns}>
                                        <TouchableOpacity style={{flex: 1}}>
                                            <LinearGradient 
                                                colors={['#e73232', 'rgba(219, 50, 50, 0.65)']} 
                                                style={[sstyles.CustomBtn, sstyles.CustomBtnSm]}
                                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            >
                                                <Text style={[sstyles.CustomBtnText, sstyles.CustomBtnTextSm]}>Delete</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{flex: 1}}>
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
                            </View>
                        </> 
                    }
                </View>
            </ScrollView>
            {
                showDoctors ?
                <View style={Platform.OS === 'ios' ? sstyles.PickerWrap : null}>
                    {
                        Platform.OS === 'ios' ?
                        <View style={sstyles.PickerBtns}>
                            <TouchableOpacity onPress={() => setShowDoctors(false)}>
                                <Text style={sstyles.PickerBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDoctors(false)}>
                                <Text style={sstyles.PickerBtnText}>Select</Text>
                            </TouchableOpacity>
                        </View> : null
                    }
                    <Picker
                        selectedValue={doctor}
                        style={sstyles.PickerStyle}
                        onValueChange={(itemValue, itemIndex) => setDoctor(itemValue)}
                    >
                        <Picker.Item label="Dinesh" value="Dinesh" />
                        <Picker.Item label="Himanshu" value="Himanshu" />
                        <Picker.Item label="Craftnotion" value="Craftnotion" />
                        <Picker.Item label="Pseudo" value="Pseudo" />
                    </Picker>
                </View> : null
            }
        </>
    )
}

export default AdminSlotsScreen;