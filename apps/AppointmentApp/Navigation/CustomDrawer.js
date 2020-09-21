import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../Constants/Colors';
import { AuthContext } from '../Components/Context';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import { getDeviceType } from 'react-native-device-info';
import { Api } from '../Constants/Api';

let deviceType = getDeviceType();

const CustomDrawer = (props) => {

    const { logout } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        getUserData();
    }, [])

    const getUserData = async() => {
        try {
            userData = await AsyncStorage.getItem('userData');
            userData = userData != null ? JSON.parse(userData) : null;
            setData(userData);
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <View style={{ flex: 1, marginVertical: 30}}>
            {
                data === null ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                </View> :
                <DrawerContentScrollView {...props}>
                    <View style={styles.drawerContent}>
                        <View style={styles.userInfoContainer}>
                            <Image 
                                source={{uri: `${Api.baseurl}/${data.image}`}} 
                                style={styles.drawerImage} 
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.userInfoTitle}>
                                    {
                                        data.type === 'SA' ?
                                        'Super Admin' :data.name 
                                    }
                                </Text>
                                <Text style={styles.userInfoCaption}>{data.email}</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="home" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Home'
                                    onPress={ () => props.navigation.navigate('AdminHome') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="th-list" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Branches'
                                    onPress={ () => props.navigation.navigate('AdminBranches') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="stethoscope" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Departments'   
                                    onPress={ () => props.navigation.navigate('AdminDepartments') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="user-md" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Doctors'
                                    onPress={ () => props.navigation.navigate('AdminDoctors') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="user-clock" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Receptionist'
                                    onPress={ () => props.navigation.navigate('AdminReceptionist') }     
                                />
                                <DrawerItem 
                                    style={{display: data.type === 'SA' ? 'flex' : 'none'}}
                                    icon={() => (
                                        <FontAwesome5 name="cogs" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Manage Admins'
                                    onPress={ () => props.navigation.navigate('AdminManage') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="chart-pie" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Slots'
                                    onPress={ () => props.navigation.navigate('AdminSlots') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="user-circle" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Profile' 
                                    onPress={ () => props.navigation.navigate('AdminProfile') }     
                                />
                                <DrawerItem 
                                    icon={() => (
                                        <FontAwesome5 name="sign-out-alt" size={18} color={Colors.green} style={styles.drawerIconStyle} />
                                    )}
                                    label='Logout'                    
                                    onPress={ () => logout() }
                                />
                            </View>
                        </View>
                    </View>
                </DrawerContentScrollView>
            }
        </View>
    )
}

const styles = EStyleSheet.create({
    userInfoContainer: {
        flexDirection: 'row',
        marginBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingHorizontal: deviceType === 'Tablet' ? '12rem' : '16rem',
        alignItems: 'center'
    },
    userInfo: {
        paddingLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        flex: 1,
    },
    userInfoTitle: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        paddingBottom: deviceType === 'Tablet' ? '3.33rem' : '5rem',
    },
    userInfoCaption: {
        fontWeight: '300',
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '13rem',
        letterSpacing: 0.2
    },
    userInfoItem: {
        flexDirection: 'row',
        flex: 1
    },
    userInfoItemTitle: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        alignSelf: 'center',
        fontWeight: '800',
        paddingRight: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    userInfoItemCaption: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        alignSelf: 'center',
        letterSpacing: 0.2
    }, 
    drawerIconStyle: {
        width: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '14rem' : '20rem',
        lineHeight: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    preferencesStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: deviceType === 'Tablet' ? '12rem' : '16rem',
        paddingVertical: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    drawerImage: {
        height: deviceType === 'Tablet' ? '40rem' : '60rem',
        width: deviceType === 'Tablet' ? '40rem' : '60rem',
        borderRadius: deviceType === 'Tablet' ? '35rem' : '50rem',
    }
});

export default CustomDrawer;

