import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from '../Constants/Colors';
import AdminHome from '../Screens/Admin/AdminHomeScreen';
import AdminDepartments from '../Screens/Admin/AdminDepartmentsScreen';
import AdminAddDepartment from '../Screens/Admin/AdminAddDepartmentScreen';
import AdminDoctors from '../Screens/Admin/AdminDoctorsScreen';
import AdminAddDoctors from '../Screens/Admin/AdminAddDoctorsScreen';
import AdminReceptionist from '../Screens/Admin/AdminReceptionistScreen';
import AdminAddReceptionist from '../Screens/Admin/AdminAddReceptionistScreen';
import AdminManage from '../Screens/Admin/AdminManageScreen';
import AdminAddManage from '../Screens/Admin/AdminAddManageScreen';
import AdminSlots from '../Screens/Admin/AdminSlotsScreen';
import AdminAddSlots from '../Screens/Admin/AdminAddSlotsScreen';
import AdminAddSlotsTb from '../Screens/Admin/AdminAddSlotsTBScreen';
import AdminProfile from '../Screens/Admin/AdminProfileScreen';
import AdminChangePassword from '../Screens/Admin/AdminChangePassword';
import AdminBranchesScreen from '../Screens/Admin/AdminBranchesScreen';
import AdminAddBranchScreen from '../Screens/Admin/AdminAddBranchScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';

const Admin = createDrawerNavigator();
const AdminBranchesTab = createStackNavigator();
const AdminDepartmentsTab = createStackNavigator();
const AdminDoctorsTab = createStackNavigator();
const AdminReceptionistTab = createStackNavigator();
const AdminManageTab = createStackNavigator();
const AdminSlotsTab = createStackNavigator();
const AdminProfileTab = createStackNavigator();

const AdminBranchesStack = () => {
	return (
		<AdminBranchesTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminDepartments'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminBranchesTab.Screen name="AdminBranches" component={AdminBranchesScreen} />
			<AdminBranchesTab.Screen name="AdminAddBranch" component={AdminAddBranchScreen} />
		</AdminBranchesTab.Navigator>
	)
}

const AdminDepartmentsStack = () => {
	return (
		<AdminDepartmentsTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminDepartments'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminDepartmentsTab.Screen name="AdminDepartments" component={AdminDepartments} />
			<AdminDepartmentsTab.Screen name="AdminAddDepartment" component={AdminAddDepartment} />
		</AdminDepartmentsTab.Navigator>
	)
}

const AdminDoctorsStack = () => {
	return (
		<AdminDoctorsTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminDoctors'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminDoctorsTab.Screen name="AdminDoctors" component={AdminDoctors} />
			<AdminDoctorsTab.Screen name="AdminAddDoctors" component={AdminAddDoctors} />
		</AdminDoctorsTab.Navigator>
	)
}

const AdminReceptionistStack = () => {
	return (
		<AdminReceptionistTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminReceptionist'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminReceptionistTab.Screen name="AdminReceptionist" component={AdminReceptionist} />
			<AdminReceptionistTab.Screen name="AdminAddReceptionist" component={AdminAddReceptionist} />
		</AdminReceptionistTab.Navigator>
	)
}

const AdminManageStack = () => {
	return (
		<AdminManageTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminManage'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminManageTab.Screen name="AdminManage" component={AdminManage} />
			<AdminManageTab.Screen name="AdminAddManage" component={AdminAddManage} />
		</AdminManageTab.Navigator>
	)
}

const AdminSlotsStack = () => {
	return (
		<AdminSlotsTab.Navigator 
			headerMode='none' 
			initialRouteName='AdminSlots'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminSlotsTab.Screen name="AdminSlots" component={AdminSlots} />
			<AdminSlotsTab.Screen name="AdminAddSlots" component={AdminAddSlots} />
			<AdminSlotsTab.Screen name="AdminAddSlotsTb" component={AdminAddSlotsTb} />
		</AdminSlotsTab.Navigator>
	)
}

const AdminProfileStack = () => {
	return (
		<AdminProfileTab.Navigator 
			headerMode='none' 
			initialRouteName='Phome'
			screenOptions={() => ({
				gestureEnabled: false
			})}
		>
			<AdminProfileTab.Screen name="AdminProfile" component={AdminProfile} />
			<AdminProfileTab.Screen name="AdminChangePassword" component={AdminChangePassword} />
		</AdminProfileTab.Navigator>
	)
}

const AdminStack = () => {
	return (
		<>
			<Admin.Navigator 
				drawerStyle={{
					width: 300,
					backgroundColor: '#fff'
				}}				
				initialRouteName='AdminHome'	
				drawerContent={props => <CustomDrawer {...props} />}
			>
				<Admin.Screen name="AdminHome" component={AdminHome} />
				<Admin.Screen name="AdminBranches" component={AdminBranchesStack} />
				<Admin.Screen name="AdminDepartments" component={AdminDepartmentsStack} />
				<Admin.Screen name="AdminDoctors" component={AdminDoctorsStack} />
				<Admin.Screen name="AdminReceptionist" component={AdminReceptionistStack} />
				<Admin.Screen name="AdminManage" component={AdminManageStack} />
				<Admin.Screen name="AdminSlots" component={AdminSlotsStack} />
				<Admin.Screen name="AdminProfile" component={AdminProfileStack} />
			</Admin.Navigator> 
		</>
	);
}

const styles = StyleSheet.create({
	TabIcon: {
		fontSize: 20,
		color: 'rgba(51, 51, 51, 0.3)'
	},
	TabIconActive: {
		color: '#337b82',
	},
	TabText: {
		fontSize: 11,
		color: 'rgba(51, 51, 51, 0.3)',
		fontFamily: 'Roboto-Regular',
		paddingBottom: 8
	},
	TabTextActive: {
		color: '#337b82',
	}
})

export default AdminStack;