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
        borderRadius: 20
    },
    TopNavigationStyle: {
        height: deviceType === 'Tablet' ? '22rem' : '32rem',
        position: 'relative'
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
        zIndex: 9
    },
    MenuBtnIcon: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '16rem' : '24rem',
    },
    BackBtn: {
        position: 'absolute',
        left: 0,
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
        paddingLeft: 4
    },
    BackBtnIcon: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
    },
    AHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        marginTop: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    AddBtn: {
        paddingHorizontal: deviceType === 'Tablet' ? '12rem' : '16rem',
        paddingVertical: 6,
        borderRadius: deviceType === 'Tablet' ? '21rem' : '30rem',
        flexDirection: 'row',
        alignItems: 'center',
    },
    AddBtnIcon: {
        color: '#fff',
        paddingRight: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    AddBtnText: {
        fontFamily: 'Roboto-Medium',
        color: '#fff'
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
    // Dashboard
    Dashboard: {
        flexDirection: 'row',
        margin: deviceType === 'Tablet' ? '3.5rem' : '5rem',
        flexWrap: 'wrap',
        paddingTop: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    DashboardItem: {
        width: '50%',
        padding: deviceType === 'Tablet' ? '3.5rem' : '5rem',
    },
    DashboardItemWrapper: {
        backgroundColor: '#fff',
        borderRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        padding: '10%',
        borderBottomColor: Colors.primary,
        borderBottomWidth: '3rem',
        borderRightColor: Colors.primary,
        borderRightWidth: '3rem',
    },
    DashboardItemName: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        fontFamily: 'Roboto-Bold',
        color: '#222',
        paddingTop: deviceType === 'Tablet' ? '6rem' : '9rem',
    },
    DashboardItemValue: {
        fontSize: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        color: Colors.green,
        fontFamily: 'Roboto-Black',
        opacity: 0.65
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
        borderRadius: deviceType === 'Tablet' ? '38.5rem' : '55rem',
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
    // Categories
    Cbox: {
        flex: 1,
        alignItems: 'center',
        margin: deviceType === 'Tablet' ? '5rem' : '7.5rem',
    },
    CboxWrapper: {
        paddingVertical: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingHorizontal: deviceType === 'Tablet' ? '3.33rem' : '5rem',
        width: '100%',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    CboxImg: {
        height: deviceType === 'Tablet' ? '40rem' : '60rem',
        width: deviceType === 'Tablet' ? '40rem' : '60rem',
        resizeMode: 'contain'
    },
    CboxText: {
        paddingTop: deviceType === 'Tablet' ? '4rem' : '6rem',
        fontFamily: 'Roboto-Medium',
        color: Colors.dark,
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    // Doctors
    Catbox: {
        backgroundColor: '#fff',
        flex: 1,
        margin: deviceType === 'Tablet' ? '5rem' : '7.5rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        padding: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    Catimg: {
        width: '100%',
        height: deviceType === 'Tablet' ? '70rem' : '100rem',
        resizeMode: 'cover',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        marginBottom: deviceType === 'Tablet' ? '5rem' : '8rem',
    },
    Catname: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        fontFamily: 'Roboto-Bold',
        textTransform: 'capitalize'
    },
    Catitem: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        fontFamily: 'Roboto-Medium',
        letterSpacing: 0.5,
        color: Colors.dark,
        paddingTop: '2rem',
        paddingBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
        opacity: 0.5
    },
    // slots
    DoctorTimeline: {
        marginVertical: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    DoctorTimelineItem: {
        marginHorizontal: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingVertical: deviceType === 'Tablet' ? '17.5rem' : '25rem',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '14rem',
        backgroundColor: '#fff',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        marginBottom: deviceType === 'Tablet' ? '21rem' : '30rem',
    },
    DoctorTimelineItemTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        borderRadius: deviceType === 'Tablet' ? '21rem' : '30rem',
        marginBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    DoctorTimelineItemTitleText: {
        fontFamily: 'Roboto-Bold',
        color: '#fff'
    },
    DoctorTimelineItemTitleIcon: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
        marginHorizontal: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    DoctorTimelineItemSubtitle: {
        fontSize: 13,
        fontFamily: 'Roboto-Bold',
        paddingVertical: deviceType === 'Tablet' ? '7rem' : '10rem',
        color: Colors.dark
    },
    DoctorTimelineItemInner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    DoctorTimelineText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'Roboto-Bold',
        color: Colors.dark,
        opacity: 0.6
    },
    DoctorTimelineIcon: {
        color: Colors.dark,
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        marginHorizontal: deviceType === 'Tablet' ? '7rem' : '10rem',
        opacity: 0.6
    },
    CheckArea: {
        flexDirection: 'row',
        marginHorizontal: deviceType === 'Tablet' ? '4rem' : '6rem',
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    CheckBtn: {
        marginHorizontal: deviceType === 'Tablet' ? '5rem' : '7.5rem',
        height: deviceType === 'Tablet' ? '24.5rem' : '35rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.primary,
        borderWidth: '2rem',
        borderRadius: deviceType === 'Tablet' ? '21rem' : '30rem',
    },
    CheckBtnChecked: {
        borderWidth: 0,
        borderColor: 0
    },
    CheckBtnText: {
        color: Colors.dark,
        fontFamily: 'Roboto-Medium',
    },
    CheckBtnTextChecked: {
        color: '#fff'
    },
    TimelineArea: {
        marginVertical: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    TimelineTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.lighter,
        borderBottomWidth: '1rem',
    },
    BreakArea: {
        marginVertical: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    TimelineDateArea: {
        marginVertical: deviceType === 'Tablet' ? '7rem' : '10rem',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TimelineDayBtn: {
        height: deviceType === 'Tablet' ? '44.5rem' : '65rem',
        width: deviceType === 'Tablet' ? '44.5rem' : '65rem',
        borderColor: Colors.green,
        borderWidth: '2rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TimelineDayBtnText: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        fontFamily: 'Roboto-Bold'
    },
    TimelineDayBtnTextSm: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        paddingBottom: deviceType === 'Tablet' ? '3rem' : '4rem',
        opacity: 0.5
    },
    TimelineDateArrow: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        color: Colors.green,
        marginHorizontal: deviceType === 'Tablet' ? '21rem' : '30rem',
    },
    SlotsAddBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        color: Colors.primary,
    },
    SlotsAddBtnText: {
        paddingLeft: '6rem',
        fontFamily: 'Roboto-Medium'
    },
    TimelineAreaWrapper: {
        paddingTop: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        borderBottomColor: Colors.lighter,
        borderBottomWidth: '1rem'
    },
    TimelineAreaWrapperItem: {
        paddingVertical: deviceType === 'Tablet' ? '3.5rem' : '5rem',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: deviceType === 'Tablet' ? '4rem' : '6rem',
        marginBottom: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    TimelineAreaWrapperItemInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TimelineDateAItemText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'Roboto-Bold'
    },
    TimelineDateAItemIcon: {
        color: Colors.green,
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '12rem',
        fontSize: deviceType === 'Tablet' ? '12rem' : '16rem',
    },
    TimelineAreaWrapperBtn: {
        height: deviceType === 'Tablet' ? '21rem' : '30rem',
        width: deviceType === 'Tablet' ? '21rem' : '30rem',
        borderRadius: deviceType === 'Tablet' ? '7rem' : '10rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.green,
        marginLeft: deviceType === 'Tablet' ? '5rem' : '8rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TimelineAreaWrapperBtnVar: {
        backgroundColor: '#e73232'
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
    // DatePicker
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
    // Bottomsheet
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
    }
});
