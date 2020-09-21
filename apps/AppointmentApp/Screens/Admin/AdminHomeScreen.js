import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import useAxios from '../../Hooks/useAxios';
import { useIsFocused } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminHomeScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
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

    useEffect(() => {
        if(responseType === 'getCounts') {
            if(responseData.error === 1) {
                if(responseData.data) {
                    setData(responseData.data)
                } else {
                    setData('empty');
                }
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
            getCounts();
        }
    }, [isFocused])

    const getCounts = async() => {
        getData('api/v1/getcount', {
            app: 'xhr'
        }, 'getCounts', false);
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
                    colors={[Colors.green, Colors.primary]} 
                    style={sstyles.TopBarStyle}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                >
                    <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                        <Text style={sstyles.Welcome}>Welcome</Text>
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Administrator</Text>
                    </View>
                    <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    <TouchableOpacity 
                        style={sstyles.MenuBtn}
                        onPress={() => navigation.openDrawer()}
                    >
                        <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                    </TouchableOpacity>
                </LinearGradient>
                <View style={{flex: 1}}>
                    {
                        data === null ?
                        <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                            <ActivityIndicator color={Colors.green} size='large' />
                        </View> :
                        <View style={{paddingBottom: 20}}>
                            <View style={sstyles.Dashboard}>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.branch}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Branches</Text>
                                    </View>
                                </View>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.department}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Departments</Text>
                                    </View>
                                </View>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.doctor}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Doctors</Text>
                                    </View>
                                </View>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.users}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Users</Text>
                                    </View>
                                </View>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.receptionist}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Receptionists</Text>
                                    </View>
                                </View>
                                <View style={sstyles.DashboardItem}>
                                    <View style={sstyles.DashboardItemWrapper}>
                                        <Text style={sstyles.DashboardItemValue}>{data.admin}</Text>
                                        <Text style={sstyles.DashboardItemName} ellipsizeMode='tail'>Administrators</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </>
    )
}

export default AdminHomeScreen;