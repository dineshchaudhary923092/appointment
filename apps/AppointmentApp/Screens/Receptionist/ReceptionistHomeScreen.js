import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './ReceptionistStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const ReceptionistHomeScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const [data, setData] = useState([
        {
            patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            patient_name: 'John Doe',
            patient_category: 'Cardio',
            appointment_date: '3, Aug 2020',
            appointment_time: '03:00 PM',
            appointment_ID: 'HOS21DOC001',
            appointment_doctorName: 'John Doe'
        },
        {
            patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            patient_name: 'John Doe',
            patient_category: 'Cardio',
            appointment_date: '3, Aug 2020',
            appointment_time: '03:00 PM',
            appointment_ID: 'HOS21DOC002',
            appointment_doctorName: 'John Doe'
        },
        {
            patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            patient_name: 'John Doe',
            patient_category: 'Cardio',
            appointment_date: '3, Aug 2020',
            appointment_time: '03:00 PM',
            appointment_ID: 'HOS21DOC003',
            appointment_doctorName: 'John Doe'
        },
        {
            patient_img: 'https://images.pexels.com/photos/3408367/pexels-photo-3408367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            patient_name: 'John Doe',
            patient_category: 'Cardio',
            appointment_date: '3, Aug 2020',
            appointment_time: '03:00 PM',
            appointment_ID: 'HOS21DOC004',
            appointment_doctorName: 'John Doe'
        },
    ])

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
                    <FlatList
                        data={data}
                        keyExtractor={item => item.appointment_ID}
                        ListHeaderComponent={() => {
                            return (
                                <>
                                    <LinearGradient 
                                        colors={[Colors.green, Colors.primary]} 
                                        style={sstyles.TopBarStyle}
                                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    >
                                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                                            <Text style={sstyles.Welcome}>Welcome</Text>
                                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Receptionist Name</Text>
                                        </View>
                                        <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                                    </LinearGradient>
                                    <Text style={[sstyles.Title, {paddingTop: 15}]}>Appointments</Text>
                                </>
                            )
                        }}
                        renderItem={ ({ item }) => {
                            return (
                            <TouchableOpacity>
                                <View style={sstyles.Abox}>
                                        <View style={sstyles.AboxLeft}>
                                            <Image source={require('../../assets/doctor.png')} style={sstyles.AboxImg} />
                                            <View style={sstyles.AboxLeftInner}>
                                                <View>
                                                    <Text style={sstyles.BoxDname}>{item.patient_name}</Text>
                                                    <Text style={sstyles.BoxCategory}>{item.patient_category}</Text>
                                                </View>
                                                <Text style={sstyles.AboxLight}>Doctor Name {'\nDr. '}{item.appointment_doctorName}</Text>
                                            </View>
                                        </View>
                                        <View style={sstyles.AboxRight}>
                                            <FontAwesome5 name="calendar-alt" style={sstyles.AboxIcon} />
                                            <Text style={sstyles.AboxLight}>{item.appointment_date}</Text>
                                            <Text style={sstyles.AboxTime}>{item.appointment_time}</Text>
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
})

export default ReceptionistHomeScreen;