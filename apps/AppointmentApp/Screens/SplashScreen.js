import React, { useEffect } from 'react';
import {Colors} from '../Constants/Colors'
import { Dimensions, View, Image, ActivityIndicator } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();

const SplashScreen = () => {

    return (
        <View style={styles.Container}>
            <View style={styles.Splash}>
                <Image source={require('../assets/heartbeat.png')} style={styles.SplashImg} resizeMode="contain" />
            </View>
            <ActivityIndicator color={Colors.green} size='large' />
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    Splash: {
        width: deviceType === 'Tablet' ? '100rem' : '180rem',
        height: deviceType === 'Tablet' ? '100rem' : '180rem',
        maxWidth: '50%',
        marginBottom: '18rem'
    },
    SplashImg: {
        height: '100%',
        width: '100%',
    }
})

export default SplashScreen;