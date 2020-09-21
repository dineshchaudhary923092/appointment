import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList, LogBox, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeviceType } from 'react-native-device-info';
import { Api } from '../../Constants/Api';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../../Hooks/useAxios';

let deviceType = getDeviceType();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const UserHomeCategoryScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { id, dName } = route.params;
    const [doctorsList, setDoctorsList] = useState(null);
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
        if(responseType === 'getDoctorsData') {
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.users.length) > 0) {
                    setDoctorsList(responseData.data.users);
                } else {
                    setDoctorsList('empty');
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
            setDoctorsList(null);
            getDoctorsData();
        }
    }, [isFocused])

    const getDoctorsData = async() => {
        await getUserData();
        await getData('api/v1/admin/get-users', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            type: 'D',
            department: id,
            app: 'xhr'
        }, 'getDoctorsData', false);
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
                            <Text style={sstyles.Welcome}>{dName}</Text>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Available Doctors</Text>
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
                        doctorsList === 'empty' ?
                        <Text style={sstyles.emptyText}>No Doctors Available</Text> :
                        <FlatList
                            data={doctorsList}
                            keyExtractor={ (id, index) => doctorsList[index].id }
                            horizontal={false}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent:'space-between', 
                                marginHorizontal: 7.5, 
                                marginVertical: 10
                            }}
                            renderItem={ ({ item }) => {
                                return (
                                    <TouchableOpacity 
                                        style={[sstyles.Catbox, {flex: 0.5}]}
                                        onPress={() => navigation.navigate('UserHomeBooking', {
                                            dInfo: item,
                                            resc: 'Add'
                                        })}
                                    >
                                        <Image source={{uri: `${Api.baseurl}/${item.image}`}} style={sstyles.Catimg} />
                                        <Text style={sstyles.Catname}>{item.name}</Text>
                                        <Text style={sstyles.Catitem}>{item.department_name} | {item.branch_name}</Text>
                                        <LinearGradient 
                                            style={sstyles.Catbtn}
                                            colors={[Colors.green, Colors.primary]} 
                                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                        >
                                            <Text style={sstyles.CatbtnText}>Book Appointment</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    
})

export default UserHomeCategoryScreen;