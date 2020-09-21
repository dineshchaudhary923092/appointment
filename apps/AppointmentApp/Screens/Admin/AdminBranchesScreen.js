import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, ScrollView, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import sstyles from './AdminStyles';
import { Colors } from '../../Constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../../Hooks/useAxios';

let deviceType = getDeviceType();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
])

const AdminBranchesScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null)
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
        if(responseType === 'getBranches') {
            if(responseData.error === 1) {
                if(responseData.data.length > 0) {
                    setData(responseData.data)
                } else {
                    setData('empty');
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteBranch') {
            if(responseData.error === 1) {
                if(responseData.data.length > 0) {
                    setData(responseData.data)
                } else {
                    setData('empty');
                }
                setButtonDisabled(false);
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'deleteBranch') {
            if(responseData.error === 1) {
                if(responseData.data.id) {
                    const updatedData = [...data];
                    const prevIndex = data.findIndex(value => value.id === responseData.data.id);
                    updatedData.splice(prevIndex, 1);
                    setData(updatedData);
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
            getBranchesData();
        }
    }, [isFocused])

    const getBranchesData = async() => {
        getData('api/v1/admin/branch/get', {
            token: await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                return value;
            }),
            app: 'xhr'
        }, 'getBranches', false);
    }

    const deleteBranch = (id) => {
        getData('api/v1/admin/branch/delete', {
            token: userToken,
            app: 'xhr',
            id: id,
        }, 'deleteBranch', true);
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
                        <Text style={sstyles.Name} ellipsizeMode="tail" numberOfLines={1}>Branches</Text>
                    </View>
                    <FontAwesome5 name="stethoscope" style={sstyles.TopBarIcon} />
                    <TouchableOpacity 
                        style={sstyles.MenuBtn}
                        onPress={() => navigation.openDrawer()}
                    >
                        <FontAwesome5 name="bars" style={sstyles.MenuBtnIcon} />
                    </TouchableOpacity>
                </LinearGradient>
                <View style={sstyles.AHeader}>
                    <Text style={[sstyles.Title, {paddingTop: 15}]}>All Branches</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AdminAddBranch', {
                                type: 'Add'
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
                {
                    data === null ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator size='large' color={Colors.green} />
                    </View> :
                    data === 'empty' ?
                    <Text style={sstyles.emptyText}>No branches added</Text> :
                    <View style={{paddingBottom: EStyleSheet.value('20rem')}}>
                        <SwipeListView
                            data={data}
                            keyExtractor={ (id, index) => data[index].id }
                            renderHiddenItem={ ({ item }, rowMap) => (
                                <View style={sstyles.rowBack}>
                                    <TouchableOpacity 
                                        style={sstyles.rowEditBtn}
                                        onPress={() => {
                                            navigation.navigate('AdminAddBranch', {
                                                type: 'Edit',
                                                branchId: item.id,
                                                branchInput: item.name
                                            })
                                        }}
                                    >
                                        <AntDesign name="edit" style={sstyles.rowEditBtnIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        disabled={buttonDisabled}
                                        style={sstyles.rowDeleteBtn}
                                        onPress={() => {
                                            setButtonDisabled(true);
                                            deleteBranch(item.id);
                                        }}
                                    >
                                        <FontAwesome5 name="trash-alt" style={sstyles.rowDeleteBtnIcon} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            rightOpenValue={
                                deviceType === 'Tablet' ? 
                                EStyleSheet.value('-100rem') :
                                EStyleSheet.value('-150rem')
                            }
                            renderItem={ ({ item }) => {
                                return (
                                <TouchableHighlight 
                                    style={[sstyles.Vbox, {alignItems: 'center'}]}
                                    underlayColor={Colors.dark + 90}
                                >
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image source={require('../../assets/branch.png')} style={sstyles.VboxImg} />
                                            <Text style={sstyles.VboxText}>{item.name}</Text>
                                        </View>
                                        <FontAwesome5 name="chevron-right" style={{opacity: 0.4}} />
                                    </View>
                                </TouchableHighlight>
                                )
                            }}
                        />
                    </View>
                }
            </ScrollView>
        </>
    )
}

export default AdminBranchesScreen;