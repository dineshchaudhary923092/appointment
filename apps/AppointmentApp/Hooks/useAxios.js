import { useState, useContext } from 'react';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import { AuthContext } from '../Components/Context';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';

const qs = require('qs');
const axios = require('axios');

export default () => {

    const { logout } = useContext(AuthContext);

    const [responseData, setResponseData] = useState(null);
    const [response, setResponse] = useState(false);
    const [responseType, setResponseType] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isData, setIsData] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const getData = async (headPoint, bodyData, rType, show) => {
        setResponseType(rType);
        try {
            const response = await axios({
                url: `${Api.baseurl}/${headPoint}`,
                method: 'post',
                data: qs.stringify(bodyData),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            // console.log(response.data);
            setResponseData(response.data);
            setResponse(true);
            if(response.data.token != '') {
                // console.log('token updated')
                await AsyncStorage.setItem('userToken', JSON.stringify(response.data.token)).then(() => {
                    setUserToken(response.data.token);
                })
            }
            if(response.data.error === 5) {
                logout();
            }
            if(response.data.data.user && rType != 'login' && rType != 'signup') {
                try {
                    await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user)).then(() => {
                        setUserData(response.data.data.user);
                    })
                } catch(e) {
                    console.log(e);
                }
            }
            if(response.data.error === 1) {
                if(show) {
                    showMessage({
                        message: response.data.msg,
                        type: "success",
                        duration: 3000,
                        style: {
                            backgroundColor: Colors.dark
                        },
                        titleStyle: {
                            color: Colors.primary,
                            fontFamily: 'Roboto-Medium'
                        }
                    });
                }
            } else {
                showMessage({
                    message: response.data.msg,
                    type: "danger",
                    icon: "danger",
                    duration: 3000,
                    titleStyle: {
                        fontFamily: 'Roboto-Medium'
                    }
                });
            }
        } catch(err) {
            console.log('err');
            console.log(err);
        }
    }       

    const getUserData = async () => {
        // console.log('data updated');
        try {
            await AsyncStorage.getItem('userData').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                if(value != null) {
                    setUserData(value);
                }
            })
            await AsyncStorage.getItem('userToken').then((value) => {
                value = value != null ? JSON.parse(value) : null;
                if(value != null) {
                    setUserToken(value);
                }
            });
            setIsData(true);
        } catch(e) {
            console.log(e);
        }
    }   

    return [
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
    ];
}

