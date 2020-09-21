import { Dimensions } from 'react-native';
import { Colors } from '../../Constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();

export default EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    margHorizon: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    btnSm: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        paddingVertical: deviceType === 'Tablet' ? '4rem' : '6rem',
        borderRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    TopNavigationStyle: {
        height: deviceType === 'Tablet' ? '22rem' : '32rem',
        position: 'relative'
    },
    FancyRounded: {
        position: 'absolute',
        height: Dimensions.get('window').height * 2,
        width: Dimensions.get('window').height * 2,
        borderRadius: Dimensions.get('window').height,
        top: -Dimensions.get('window').height * 1.65,
        left: -Dimensions.get('window').height,
        transform: [{ translateX: Dimensions.get('window').width / 2 }],
    },
    FancyTopBarStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    TopBarStyle: {
        height: deviceType === 'Tablet' ? '98rem' : '140rem',
        borderBottomRightRadius: deviceType === 'Tablet' ? '22rem' : '32rem',
        borderBottomLeftRadius: deviceType === 'Tablet' ? '22rem' : '32rem',
        overflow: 'hidden'
    },
    TopBarIcon: {
        fontSize: deviceType === 'Tablet' ? '91rem' : '130rem',
        position: 'absolute',
        opacity: 0.065,
        right: deviceType === 'Tablet' ? '14rem' : '20rem',
        bottom: deviceType === 'Tablet' ? '-17.5rem' : '-25rem',
    },
    Welcome: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '21rem',
        paddingBottom: deviceType === 'Tablet' ? '5rem' : '8rem',
        fontFamily: 'Roboto-Regular',
        color: '#fff'
    },
    Name: {
        fontSize: deviceType === 'Tablet' ? '20rem' : '28rem',
        fontFamily: 'Roboto-Bold',
        color: '#fff'
    },
    Title: {
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingVertical: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        fontFamily: 'Roboto-Bold',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        color: Colors.dark,
        letterSpacing: '0.5rem'
    },
    MenuBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingVertical: deviceType === 'Tablet' ? '8rem' : '12rem',
        zIndex: 2
    },
    MenuBtnIcon: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '16rem' : '24rem',
    },
    BackBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingVertical: deviceType === 'Tablet' ? '8rem' : '12rem',
        zIndex: 2
    },
    BackBtnText: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        fontFamily: 'Roboto-Medium',
        paddingLeft: deviceType === 'Tablet' ? '3rem' : '4rem',
    },
    BackBtnIcon: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
    },
    CustomBtn: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        marginVertical: deviceType === 'Tablet' ? '13rem' : '25rem',
        height: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    CboxBtns: {
        width: '100%',
        flexDirection: 'row'
    },
    CustomBtnSm: {
        marginHorizontal: '3rem',
        marginVertical: 0,
        height: deviceType === 'Tablet' ? '21rem' : '30rem',
        marginTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        flex: 1
    },
    CustomBtnText: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    CustomBtnTextSm: {
        fontFamily: 'Roboto-Medium',
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '13rem',
    },
    BoxDname: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold'
    },
    BoxCategory: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: Colors.dark,
        paddingTop: 4
    },
    // userhome
    Abox: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        marginBottom: deviceType === 'Tablet' ? '8rem' : '12rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: '#fff',
        padding: deviceType === 'Tablet' ? '7rem' : '10rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    AboxLeft: {
        flexDirection: 'row',
    },
    AboxLeftInner: {
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    AboxImg: {
        height: deviceType === 'Tablet' ? '56rem' : '80rem',
        width: deviceType === 'Tablet' ? '56rem' : '80rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        marginRight: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    AboxRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right'
    },
    AboxIcon: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        color: 'rgba(0, 0, 0, 0.3)'
    },
    AboxLight: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '11.5rem',
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: 'rgba(0, 0, 0, 0.3)',
        paddingTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        paddingBottom:  deviceType === 'Tablet' ? '3rem' : '4rem',
        lineHeight: deviceType === 'Tablet' ? '12rem' : '16rem',
    },
    AStatus: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingBottom:  deviceType === 'Tablet' ? '7rem' : '10rem',
        alignItems: 'flex-start',
    },
    AStatusInner: {
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingVertical: deviceType === 'Tablet' ? '3rem' : '4rem',
        borderRadius: deviceType === 'Tablet' ? '10rem' : '14rem',
    },
    AboxStatus: {
        color: '#fff',
        lineHeight: deviceType === 'Tablet' ? '12rem' : '16rem',
        fontFamily: 'Roboto-Medium',
        textTransform: 'capitalize'
    },
    AboxTime: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'Roboto-Bold',
        letterSpacing: 0.5,
        paddingBottom:  deviceType === 'Tablet' ? '3rem' : '4rem',
    },
    Cbox: {
        width: '20%',
        alignItems: 'center',
        paddingBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    CboxWrapper: {
        height: deviceType === 'Tablet' ? '49rem' : '70rem',
        width: deviceType === 'Tablet' ? '49rem' : '70rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    CboxImg: {
        height: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        width: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        resizeMode: 'contain'
    },
    CboxText: {
        paddingTop: deviceType === 'Tablet' ? '4rem' : '6rem',
        fontFamily: 'Roboto-Medium',
        color: Colors.dark,
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
    },
    // category
    Catbox: {
        backgroundColor: '#fff',
        flex: 1,
        margin: 7.5,
        borderRadius: 8,
        padding: 12
    },
    Catimg: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 8
    },
    Catname: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold'
    },
    Catitem: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: Colors.dark,
        paddingTop: 2,
        paddingBottom: 6,
        opacity: 0.5
    },
    Catbtn: {
        borderRadius: 8,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    CatbtnText: {
        color: '#fff',
        fontFamily: 'Roboto-Medium',
        fontSize: 13
    },
    // booking
    Bbox: {
        flexDirection: 'row',
        margin: 15,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8
    },
    BboxImg: {
        flex: 1.5,
        height: 95,
        borderRadius: 8,
        marginRight: 10
    },
    BboxInner: {
        flex: 2,
        paddingVertical: 4
    },
    MonthWrapper: {
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    MonthText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        paddingRight: 4,
        letterSpacing: 0.25,
        color: Colors.dark
    },
    MonthIcon: {
        fontSize: 16,
        color: Colors.dark
    },
    DateWrapper: {
        marginLeft: 15,
        marginVertical: 15,
        width: 65,
        height: 70,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,

    },
    DateWrapperInner: {
        height: '100%',
        width: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    DateText: {
        fontSize: 13,
        color: Colors.dark,
        fontFamily: 'Roboto-Regular'
    },
    DateNum: {
        fontSize: 21,
        fontFamily: 'Roboto-Bold',
        color: Colors.dark,
        paddingTop: 5,
        letterSpacing: -0.2
    },
    SlotWrapper: {
        margin: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    SlotWrapperInner: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 30,
    },
    SlotText: {
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        letterSpacing: 0.4
    },
    SlotsCount: {
        textAlign: 'center',
        fontSize: 12.5,
        fontFamily: 'Roboto-Medium',
        opacity: 0.35,
        paddingBottom: 12,
        paddingTop: 6
    },
    BookBtn: {
        marginHorizontal: 15,
        marginTop: 15,
        height: 45,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    BookBtnText: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 15
    },
    // profile
    Pheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    Parea: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: deviceType === 'Tablet' ? '13rem' : '25rem',
        marginBottom: deviceType === 'Tablet' ? '13rem' : '25rem',
    },
    profileBtn: {
        marginBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        position: 'relative'
    },
    ImageEdit: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark,
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
        width: deviceType === 'Tablet' ? '18rem' : '30rem',
        borderRadius: deviceType === 'Tablet' ? '9rem' : '15rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageEditIcon: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        color: Colors.primary,
    },
    Ppreview: {
        height: deviceType === 'Tablet' ? '77rem' : '110rem',
        width: deviceType === 'Tablet' ? '77rem' : '110rem',
        borderRadius: deviceType === 'Tablet' ? '38.5rem' : '55rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: '2rem',
        borderColor: Colors.primary
    },
    Picon: {
        fontSize: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        color: '#fff'
    },
    profIcon: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    Pname: {
        fontSize: deviceType === 'Tablet' ? '13.5rem' : '19rem',
        fontFamily: 'Roboto-Bold',
        marginTop: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    Pemail: {
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '13rem',
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: Colors.dark,
        paddingTop: deviceType === 'Tablet' ? '3rem' : '4rem',
        opacity: 0.5
    },
    Pbtn: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        marginBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        height: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    PbtnText: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    Vtext: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'Roboto-Medium',
        color: Colors.green,
        textAlign: 'center'
    },
    ScreenTitle: {
        paddingVertical: deviceType === 'Tablet' ? '3.5rem' : '5rem',
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        fontSize: deviceType === 'Tablet' ? '21rem' : '30rem',
        color: Colors.green,
        fontFamily: 'Roboto-Black'
    },
    FormInputStyle: {
        marginBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    FormInputLabelStyle: {
        fontFamily: 'Roboto-Medium',
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        marginBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    FormInputFieldStyle: {
        height: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        borderColor: Colors.green,
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderWidth: '2rem',
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    // confirmation screen
    ConfirmArea: {
        height: Dimensions.get('window').height * 0.35,
        paddingBottom: 25,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    ConfirmAreaIcon: {
        fontSize: 65,
        color: '#fff',
        paddingBottom: 15
    },
    ConfirmAreaName: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        paddingBottom: 10
    },
    ConfirmAreaID: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Roboto-Regular',
        letterSpacing: 0.5,
        paddingBottom: 15,
    },
    ConfirmAreaMsg: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        textAlign: 'center',
        lineHeight: 17
    },
    ConfirmationArea: {
        paddingVertical: 20
    },
    Cfbox: {
        flexDirection: 'row',
        marginHorizontal: 15
    },
    CfImg: {
        height: 60,
        width: 60,
        borderRadius: 12,
        marginRight: 10
    },
    CfTimeBox: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    CfTimeBoxLeft: {
        flexDirection: 'row',
        paddingLeft: 15,
        alignItems: 'center'
    },
    CfTimeIcon: {
        fontSize: 20,
        opacity: 0.3
    },
    CfTimeText: {
        fontFamily: 'Roboto-Medium',
        paddingLeft: 15,
    },
    CfTimeLight: {
        fontSize: 11.5,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: 'rgba(0, 0, 0, 0.3)',
        paddingBottom: 4,
        textAlign: 'center'
    },
    CfTimeDark: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 0.5,
        textAlign: 'center'
    },
    BottomSheet: {
        padding: deviceType === 'Tablet' ? '12rem' : '16rem',
        height: '100%',
        justifyContent: 'flex-start',
    },
    bsHeader: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: Colors.green,
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    bsHandle: {
        height: deviceType === 'Tablet' ? '3.75rem' : '6rem',
        width: deviceType === 'Tablet' ? '32rem' : '50rem',
        borderRadius: '3rem'
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        width: '100%'
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'Roboto-Medium',
    },
    ProfileName: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        paddingBottom: '2rem',
    },
    ProfileEmail: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'Roboto-Light',
        textAlign: 'center'
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        paddingLeft: deviceType === 'Tablet' ? '1.4rem' : '2rem',
        paddingTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        color: Colors.light
    },
    Vbox: {
        flexDirection: 'row',
        borderBottomWidth: '1rem',
        borderBottomColor: Colors.lighter,
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '50rem' : '75rem',
        backgroundColor: Colors.bg
    },
    VboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    VboxImg: {
        height: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        width: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        marginRight: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    VboxImgRounded: {
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        width: deviceType === 'Tablet' ? '35rem' : '50rem',
        borderRadius: deviceType === 'Tablet' ? '3.3rem' : '5rem',
    },
    VboxText: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'Roboto-Medium',
        color: Colors.dark
    },
    VboxTextVar: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        color: '#fff'
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: '1rem',
        borderBottomColor: Colors.lighter,
    },
    rowEditBtn: {
        height: deviceType === 'Tablet' ? '50rem' : '75rem',
        width: deviceType === 'Tablet' ? '50rem' : '75rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },
    rowEditBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '16rem' : '24rem',
        color: '#000',
        opacity: 0.65
    },
    rowDeleteBtn: {
        height: deviceType === 'Tablet' ? '50rem' : '75rem',
        width: deviceType === 'Tablet' ? '50rem' : '75rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ED3833',
    },
    rowDeleteBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        color: '#fff',
        opacity: 0.65
    },
    emptyText: {
        fontFamily: 'Roboto-Medium',
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        textAlign: 'center',
        paddingVertical: deviceType === 'Tablet' ? '16rem' : '24rem',
    },
    spacing: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    TextLg: {
        fontSize: deviceType === 'Tablet' ? '24rem' : '35rem',
        fontFamily: 'Roboto-Medium',
        paddingBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    otpBack: {
        alignSelf: 'center',
        marginTop: deviceType === 'Tablet' ? '32rem' : '50rem',
    },
    ExtraButton: {
        marginTop: deviceType === 'Tablet' ? '22rem' : '30rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ExtraButtonText: {
        textAlign: 'center',
        fontFamily: 'Roboto-Light',
        fontSize: deviceType === 'Tablet' ? '10rem' : '15rem',
    },
    ExtraButtonTextBold:  {
        fontFamily: 'Roboto-Medium', 
        paddingLeft: deviceType === 'Tablet' ? '3.5rem' : '6rem',
    },
    SubmitContainerVar: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        width: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '6rem' : '10rem',
        backgroundColor: Colors.primary
    },
    otparea: {
        paddingTop: '10%'
    },
    // picker
    PickerWrap: {
        backgroundColor: Colors.bg,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: deviceType === 'Tablet' ? '3.33rem' : '5rem',
        },
        shadowOpacity: '0.34rem',
        shadowRadius: deviceType === 'Tablet' ? '4.1rem' : '6.27rem',
        elevation: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    PickerStyle: {
        height: Dimensions.get('window').height/3, 
        width: Dimensions.get('window').width,
    },
    PickerAndroid: {
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        justifyContent: 'center',
        position: 'relative'
    },
    PickerStyleAndroid: {
        opacity: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        zIndex: 2
    },
    DoctorPickerWrapper: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    DoctorPickerWrapperVar: {
        marginHorizontal: 0,
        justifyContent: 'space-between',
        height: deviceType === 'Tablet' ? '31.5rem' : '45rem',
        borderColor: Colors.green,
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderWidth: '2rem',
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    DoctorPickerText: {
        fontFamily: 'Roboto-Bold',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        paddingRight: deviceType === 'Tablet' ? '3rem' : '4rem',
        letterSpacing: '0.25rem',
        color: Colors.light
    },
    DoctorPickerTextVar: {
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '13rem',
        fontFamily: 'Roboto-Regular'
    },
    DoctorPickerIcon: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        color: Colors.light
    },
    DatePickerStyle: {
        backgroundColor: Colors.bg,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: deviceType === 'Tablet' ? '3.33rem' : '5rem',
        },
        shadowOpacity: '0.34rem',
        shadowRadius: deviceType === 'Tablet' ? '4.1rem' : '6.27rem',
        elevation: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    PickerBtns: {
        paddingHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingTop: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    PickerBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        color: Colors.green,
        fontFamily: 'Roboto-Medium',
    },
});
