import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();

const WelcomeScreen = ({ navigation }) => {

    const [isLandscape, setIsLandscape] = useState(null);

	useEffect(() => {
		if(Dimensions.get('window').width > Dimensions.get('window').height) {
			setIsLandscape(true);
		} else {
			setIsLandscape(false);
		}
		Dimensions.addEventListener("change", onChange);
		return () => {
			Dimensions.removeEventListener("change", onChange);
		};
	}, []);

	const onChange = ({ window }) => {
		if(window.width > window.height) {
			setIsLandscape(true);
		} else {
			setIsLandscape(false);
		}
	};

    return (
        <>
            <SafeAreaView style={{height: 20, backgroundColor: '#fff'}}>
                <StatusBar barStyle='dark-content' />
            </SafeAreaView> 
            <View style={styles.Container}>
                <Image source={require('../assets/welcome.png')} style={[styles.WelcomeImg, {display: isLandscape ? 'none' : 'flex'}]} />
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.Logo}>DocSchedule</Text>    
                    <View style={styles.ButtonsArea}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <LinearGradient 
                                colors={[Colors.primary, Colors.green + 'B3', Colors.green + 'D9', Colors.green]} 
                                style={styles.ButtonWrap}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            >
                                <Text style={styles.ButtonText}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                        >
                            <View style={[styles.ButtonWrap, styles.ButtonWrapVar]}>
                                <Text style={[styles.ButtonText, styles.ButtonTextVar]}>Register an account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.version}>V 0.0.1</Text>
                </View>
            </View>
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    Logo: {
        fontSize: deviceType === 'Tablet' ? '22rem' : '32rem',
        color: Colors.dark,
        fontFamily: 'Roboto-Black',
        textAlign: 'center',
        paddingVertical: 10
    },
    WelcomeImg: {
        width: Dimensions.get('window').width,
        flex: 1,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    ButtonsArea: {
        padding: deviceType === 'Tablet' ? '14rem' : '20rem',
        width: '100%',
        maxWidth: deviceType === 'Tablet' ? '75%' : '350rem',
        alignSelf: 'center'
    },
    ButtonWrap: {
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        borderRadius: deviceType === 'Tablet' ? '9rem' : '14rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ButtonText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        fontFamily: 'Roboto-Medium',
        color: '#fff'
    },
    ButtonWrapVar: {
        borderWidth: '2rem',
        borderColor: Colors.green,
        marginTop: deviceType === 'Tablet' ? '12.5rem' : '18rem',
    },
    ButtonTextVar: {
        color: Colors.green
    },
    version: {
        fontSize: deviceType === 'Tablet' ? '10rem' : '15rem',
        color: Colors.light,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        paddingTop: deviceType === 'Tablet' ? '14rem' : '20rem',
    }
})

export default WelcomeScreen;