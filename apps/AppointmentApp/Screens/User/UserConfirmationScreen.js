import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './UserStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Api } from '../../Constants/Api';
import EStyleSheet from 'react-native-extended-stylesheet';
import useAxios from '../../Hooks/useAxios';
import { useIsFocused } from '@react-navigation/native';

const UserConfirmationScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const { data, type } = route.params;
    const isFocused = useIsFocused();

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
        if(responseType === 'cancelSlot') {
            if(responseData.error === 1) {
                navigation.popToTop('');
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
            getUserData();
        }
    }, [isFocused])

    const cancelSlot = async(id) => {
        await getData('api/v1/appointments/update-status', {
            token: userToken,
            timeSlotId: id,
            status: 'cancelled',
            app: 'xhr'
        }, 'cancelSlot', true);
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
                    colors={[Colors.green, Colors.primary, Colors.primary, Colors.primary, Colors.primary]} 
                    style={sstyles.FancyRounded}
                    start={{x: 0, y: 1}} end={{x: 0, y: 0}}
                ></LinearGradient>
                <View style={sstyles.ConfirmArea}>
                    <FontAwesome5 name="check-circle" style={sstyles.ConfirmAreaIcon} />
                    <Text style={sstyles.ConfirmAreaName}>Booking Confirmed</Text>
                    <Text style={sstyles.ConfirmAreaID}>FID: {data.print_slot_id}</Text>
                    <Text style={sstyles.ConfirmAreaMsg}>Email has been sent to your {'\n'} registered details</Text>
                    <TouchableOpacity 
                        style={sstyles.BackBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome5 name="angle-left" style={sstyles.BackBtnIcon} />
                        <Text style={sstyles.BackBtnText}>back</Text>
                    </TouchableOpacity>
                </View>
                <View style={[sstyles.ConfirmationArea, {paddingBottom: EStyleSheet.value('50rem')}]}>
                    <Text style={sstyles.Title}>Booking Details</Text>
                    <View style={sstyles.Cfbox}>
                        <Image source={{uri: `${Api.baseurl}/${data.image}`}} style={sstyles.CfImg} />
                        <View>
                            <Text style={sstyles.BoxDname}>Dr. {data.name}</Text>
                            <Text style={sstyles.BoxCategory}>{data.department_name}</Text>
                        </View>
                    </View>
                    <View style={sstyles.CfTimeBox}>
                        <View style={sstyles.CfTimeBoxLeft}>
                            <FontAwesome5 name="calendar-alt" style={sstyles.CfTimeIcon} />
                            <Text style={sstyles.CfTimeText}>Time & Date</Text>
                        </View>                        
                        <View>
                            <Text style={sstyles.CfTimeLight}>{data.date}</Text>
                            <Text style={sstyles.CfTimeDark}>{data.time}</Text>
                        </View>                        
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            type === 'Edit' ?
                            navigation.navigate('UserHomeBooking', {
                                dInfo: data,
                                type: 'resc'
                            })
                            : navigation.popToTop('')
                        }}
                    >
                        <LinearGradient 
                            style={sstyles.BookBtn}
                            colors={[Colors.green, Colors.primary]} 
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                            <Text style={sstyles.BookBtnText}>
                                {
                                    type === 'Edit' ? 'Reschedule' : 'Done'
                                }
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {
                        type === 'Edit' ?
                        <TouchableOpacity
                            onPress={() => {
                                cancelSlot(data.id);
                            }}
                        >
                            <LinearGradient 
                                style={sstyles.BookBtn}
                                colors={['#D31027', '#EA384D']} 
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                >
                                <Text style={sstyles.BookBtnText}>
                                    Cancel
                                </Text>
                            </LinearGradient> 
                        </TouchableOpacity>: null
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({

})

export default UserConfirmationScreen;