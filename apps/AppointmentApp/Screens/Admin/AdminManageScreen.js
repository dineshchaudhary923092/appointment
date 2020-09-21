import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, FlatList, LogBox, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
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

const AdminManageScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);

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
        if(responseType === 'getAdmins') {
            console.log('responseData.data');
            console.log(JSON.stringify(responseData.data));
            if(responseData.error === 1) {
                if(JSON.stringify(responseData.data.users.length) > 0) {
                    setData(responseData.data.users)
                } else {
                    setData('empty');
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteAdmin') {
            if(responseData.error === 1) {
                if(responseData.data.id) {
                    const updatedData = [...data];
                    const prevIndex = data.findIndex(value => value.id === responseData.data.id);
                    updatedData.splice(prevIndex, 1);
                    setData(updatedData);
                    setButtonDisabled(false);
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
            getAdminData();
        }
    }, [isFocused])

    const getAdminData = async() => {
        getData('api/v1/admin/get-users', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            type: 'A',
            app: 'xhr'
        }, 'getAdmins', false);
    }

    const deleteAdmin = (id) => {
        getData('api/v1/admin/delete-user', {
            token: userToken,
            app: 'xhr',
            id: id,
        }, 'deleteAdmin', true);
    }
    const ReceptionistHeader = () => {
        return (
            <View style={sstyles.AHeader}>
                <Text style={[sstyles.Title, {paddingTop: 15}]}>All Admins</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('AdminAddManage', {
                            type: 'Add',
                        })
                    }}
                >
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.AddBtn}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <FontAwesome5 name="plus" style={sstyles.AddBtnIcon} />
                        <Text style={sstyles.AddBtnText}>Add</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
                <View style={{paddingBottom: 20}}>
                    <LinearGradient 
                        colors={[Colors.green, Colors.primary]} 
                        style={sstyles.TopBarStyle}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    >
                        <View style={{paddingHorizontal: 15, flex: 1, justifyContent: 'center'}}>
                            <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Manage Admins</Text>
                        </View>
                        <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                        <TouchableOpacity 
                            style={sstyles.MenuBtn}
                            onPress={() => navigation.openDrawer()}
                        >
                            <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                        </TouchableOpacity>
                    </LinearGradient>
                    {
                        data === null ?
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: EStyleSheet.value('50rem')}}>
                            <ActivityIndicator color={Colors.green} size='large' />
                        </View> :
                        data === 'empty' ?
                        <>
                            <ReceptionistHeader />
                            <Text style={sstyles.emptyText}>No Admins added</Text>
                        </> :
                        <>
                            <ReceptionistHeader />
                            <FlatList
                                data={data}
                                keyExtractor={ (id, index) => data[index].id }
                                horizontal={false}
                                numColumns={2}
                                columnWrapperStyle={{
                                    justifyContent:'space-between', 
                                    marginHorizontal: 7.5, 
                                    marginVertical: 10
                                }}
                                renderItem={ ({ item }) => {
                                    return (
                                        <View style={[sstyles.Catbox, {flex: 0.5}]}>
                                            <Image source={{uri: `${Api.baseurl}/${item.image}`}} style={sstyles.Catimg} />
                                            <Text style={sstyles.Catname}>{item.name}</Text>
                                            <View style={sstyles.CboxBtns}>
                                                <TouchableOpacity 
                                                    style={{flex: 1}}
                                                    disabled={buttonDisabled}
                                                    onPress={() => deleteAdmin(item.id)}
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
                                                        navigation.navigate('AdminAddManage', {
                                                            type: 'Edit',
                                                            rUser: item
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
                        </>
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    
})

export default AdminManageScreen;