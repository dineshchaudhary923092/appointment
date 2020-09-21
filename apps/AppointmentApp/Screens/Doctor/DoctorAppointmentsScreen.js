import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const DoctorAppointmentsScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const [data, setData] = useState({
        upcoming: [
            {
                patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                patient_name: 'John Doe',
                patient_category: 'Cardio',
                appointment_date: '3, Aug 2020',
                appointment_time: '03:00 PM',
                appointment_ID: 'HOS21DOC001'
            },
            {
                patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                patient_name: 'John Doe',
                patient_category: 'Cardio',
                appointment_date: '3, Aug 2020',
                appointment_time: '03:00 PM',
                appointment_ID: 'HOS21DOC002'
            }
        ],
        previous: [
            {
                patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                patient_name: 'John Doe',
                patient_category: 'Cardio',
                appointment_date: '3, Aug 2020',
                appointment_time: '03:00 PM',
                appointment_ID: 'HOS21DOC003'
            },
            {
                patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                patient_name: 'John Doe',
                patient_category: 'Cardio',
                appointment_date: '3, Aug 2020',
                appointment_time: '03:00 PM',
                appointment_ID: 'HOS21DOC004'
            }
        ]
    })
    const [previousData, setPreviousData] = useState();
    const [upcomingData, setUpcomingData] = useState();

    useEffect(() => {
        setUpcomingData(data.upcoming)
        setPreviousData(data.previous)
    }, [])

    return (
        <>
            <SafeAreaView style={{position: 'relative', backgroundColor: Colors.bg, flex: 1}}>
                <LinearGradient 
                    colors={[Colors.green, Colors.primary]}
                    style={[styles.FancyTopBarStyle, {height: insets.top}]}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <StatusBar barStyle='dark-content' />
                </LinearGradient>
            </SafeAreaView> 
            <ScrollView style={[styles.Container, styles.FancyTopBarStyle, {top: insets.top}]}>
                <View style={{paddingBottom: 20}}>
                    <FlatList
                        data={upcomingData}
                        keyExtractor={item => item.appointment_ID}
                        ListHeaderComponent={() => {
                            return (
                                <>
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.primary]} 
                                        style={styles.TopBarStyle}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                                            <Text style={styles.Name} ellipsizeMode="tail" numberOfLines={1}>Appointments</Text>
                                        </View>
                                        <FontAwesome5 name="stethoscope" style={styles.TopBarIcon} />
                                    </LinearGradient>
                                    <Text style={[styles.Title, {paddingTop: 15}]}>Upcoming Appointments</Text>
                                </>
                            )
                        }}
                        renderItem={ ({ item }) => {
                            return (
                            <TouchableOpacity>
                                <View style={styles.Abox}>
                                        <View style={styles.AboxLeft}>
                                            <Image source={require('../../assets/doctor.png')} style={styles.AboxImg} />
                                            <View style={styles.AboxLeftInner}>
                                                <View>
                                                    <Text style={styles.AboxDname}>{item.patient_name}</Text>
                                                    <Text style={styles.AboxCategory}>{item.patient_category}</Text>
                                                </View>
                                                <Text style={styles.AboxLight}>FID: {item.appointment_ID}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.AboxRight}>
                                            <FontAwesome5 name="calendar-alt" style={styles.AboxIcon} />
                                            <Text style={styles.AboxLight}>{item.appointment_date}</Text>
                                            <Text style={styles.AboxTime}>{item.appointment_time}</Text>
                                        </View>
                                </View>
                            </TouchableOpacity>
                            )
                        }}
                    />
                    <FlatList
                        data={previousData}
                        keyExtractor={item => item.appointment_ID}
                        ListHeaderComponent={() => {
                            return (
                                <Text style={[styles.Title, {paddingTop: 15}]}>Previous Appointments</Text>
                            )
                        }}
                        renderItem={ ({ item }) => {
                            return (
                            <TouchableOpacity>
                                <View style={styles.Abox}>
                                        <View style={styles.AboxLeft}>
                                            <Image source={require('../../assets/doctor.png')} style={styles.AboxImg} />
                                            <View style={styles.AboxLeftInner}>
                                                <View>
                                                    <Text style={styles.AboxDname}>{item.patient_name}</Text>
                                                    <Text style={styles.AboxCategory}>{item.patient_category}</Text>
                                                </View>
                                                <Text style={styles.AboxLight}>FID: {item.appointment_ID}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.AboxRight}>
                                            <FontAwesome5 name="calendar-alt" style={styles.AboxIcon} />
                                            <Text style={styles.AboxLight}>{item.appointment_date}</Text>
                                            <Text style={styles.AboxTime}>{item.appointment_time}</Text>
                                        </View>
                                </View>
                            </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    FancyTopBarStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    TopBarStyle: {
        height: 140,
        borderBottomRightRadius: 32,
		borderBottomLeftRadius: 32
    },
    TopBarIcon: {
        fontSize: 130,
        position: 'absolute',
        opacity: 0.065,
        right: 20,
        bottom: -25
    },
    Welcome: {
        fontSize: 21,
        paddingBottom: 8,
        fontFamily: 'Roboto-Regular',
        color: '#fff'
    },
    Name: {
        fontSize: 28,
        fontFamily: 'Roboto-Bold',
        color: '#fff'
    },
    Title: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: Colors.dark,
        letterSpacing: 0.5
    },
    Abox: {
        marginHorizontal: 15,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    AboxLeft: {
        flexDirection: 'row',
    },
    AboxLeftInner: {
        justifyContent: 'space-between'
    },
    AboxImg: {
        height: 80,
        width: 80,
        borderRadius: 12,
        marginRight: 10
    },
    AboxDname: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold'
    },
    AboxCategory: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: Colors.dark,
        paddingTop: 4
    },
    AboxRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right'
    },
    AboxIcon: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.3)'
    },
    AboxLight: {
        fontSize: 11.5,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: 'rgba(0, 0, 0, 0.3)',
        paddingTop: 10,
        paddingBottom: 4
    },
    AboxTime: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 0.5,
        paddingBottom: 4
    },
    Cbox: {
        width: '20%',
        alignItems: 'center',
        paddingBottom: 10
    },
    CboxWrapper: {
        height: 70,
        width: 70,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    CboxImg: {
        height: 35,
        width: 35,
        resizeMode: 'contain'
    },
    CboxText: {
        paddingTop: 6,
        fontFamily: 'Roboto-Medium',
        color: Colors.dark,
        fontSize: 14
    }
})

export default DoctorAppointmentsScreen;