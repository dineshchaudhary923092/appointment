import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Constants/Colors';

const UserNotificationsScreen = ({ navigation }) => {

    const [notificationData, setNotificationData] = useState([
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC001'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC002'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC003'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC004'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC005'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC006'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC007'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC008'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC009'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC010'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC011'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC012'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC013'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC014'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC015'
        },
        {
            notification_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            notification_msg: 'Doctor Mr. John Doe is available and confirmed your Appointment',
            notification_time: '10 Seconds ago',
            notification_ID: 'NOS21DOC016'
        },
    ])
    
    return (
        <>
            <SafeAreaView style={{backgroundColor: Colors.bg}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
            <View style={styles.Container}>
                <FlatList
                    data={notificationData}
                    keyExtractor={item => item.notification_ID}
                    ListHeaderComponent={() => {
                        return (
                            <Text style={styles.ScreenTitle}>Notifications</Text>
                        )
                    }}
                    renderItem={ ({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={styles.Nbox}>
                                    <Image source={require('../../assets/doctor.png')} style={styles.Nimg} />
                                    <View style={styles.NboxInner}>
                                        <Text style={styles.Nmsg}>{item.notification_msg}</Text>
                                        <Text style={styles.Ntime}>{item.notification_time}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    ScreenTitle: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        fontSize: 30,
        color: Colors.green,
        fontFamily: 'Roboto-Black'
    },
    Nbox: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'row'
    },
    Nimg: {
        height: 50,
        width: 50,
        borderRadius: 25,
        resizeMode: 'cover',
        marginRight: 10
    },
    NboxInner: {
        flexShrink: 1
    },
    Nmsg: {
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        letterSpacing: 0.2,
        lineHeight: 18,
        paddingBottom: 8
    },
    Ntime: {
        fontSize: 11.5,
        fontFamily: 'Roboto-Bold',
        opacity: 0.3,
        letterSpacing: 0.2,
    }
})

export default UserNotificationsScreen;