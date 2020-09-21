<?php
$routes->group( 'admin', function ( $routes ) {
	$route1[ 'add-user' ] = 'V1/Admin::add_user';
	
	$route1[ 'get-users' ] = 'V1/Admin::get_users';
	$route1[ 'delete-user' ] = 'V1/Admin::delete_user';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
	$route1 = [];
	$routes->group( 'branch', function ( $routes ) {
		$route1[ 'add' ] = 'V1/Branch::add';
		$route1[ 'get' ] = 'V1/Branch::get';
		$route1[ 'delete' ] = 'V1/Branch::delete';
		$routes->map( $route1, [ 'filter' => 'isLogged' ] );
	} );
	$route1 = [];
	$routes->group( 'department', function ( $routes ) {
		$route1[ 'add' ] = 'V1/Department::add';
		$route1[ 'get' ] = 'V1/Department::get';
		$route1[ 'delete' ] = 'V1/Department::delete';
		$routes->map( $route1, [ 'filter' => 'isLogged' ] );
	} );
	$routes->group( 'holiday', function ( $routes ) {
		$route1[ 'add' ] = 'V1/Holiday::add';
		$route1[ 'get' ] = 'V1/Holiday::get';
		$route1[ 'delete' ] = 'V1/Holiday::delete';
		$routes->map( $route1, [ 'filter' => 'isLogged' ] );
	} );
} );
$route1 = [];
$routes->group( 'slots', function ( $routes ) {
	$route1[ 'add' ] = 'V1/Slots::add';
	$route1[ 'get' ] = 'V1/Slots::get';
	$route1[ 'delete' ] = 'V1/Slots::delete';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
} );
$route1 = [];
$routes->group( 'duration', function ( $routes ) {
	$route1[ 'add' ] = 'V1/Duration::add';
	$route1[ 'addbreak' ] = 'V1/Duration::addbreak';
	$route1[ 'addleave' ] = 'V1/Duration::addleave';
	$route1[ 'get' ] = 'V1/Duration::get';
	$route1[ 'delete' ] = 'V1/Duration::delete';
	$route1[ 'deletebreak' ] = 'V1/Duration::deletebreak';
	$route1[ 'deleteleave' ] = 'V1/Duration::deleteleave';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
} );
$route1 = [];
$routes->group( 'timeslot', function ( $routes ) {
	$route1[ 'get' ] = 'V1/Timeslots::get';
	$route1[ 'get-timeslots-receptionist' ] = 'V1/Timeslots::getr';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
});
$route1 = [];
$routes->group( 'appointments', function ( $routes ) {
	$route1[ 'get' ] = 'V1/Appointments::get';
	$route1[ 'update-status' ] = 'V1/Appointments::updatestatus';
	$route1[ 'add-media' ] = 'V1/Appointments::addmedia';
	$route1[ 'delete-media' ] = 'V1/Appointments::deletemedia';
	$route1[ 'bookslot' ] = 'V1/Appointments::bookslot';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
});
$routes->group( 'group', function ( $routes ) {
	$route1[ 'create' ] = 'V1/Group::create';
	$route1[ 'edit' ] = 'V1/Group::create';
	$route1[ 'delete' ] = 'V1/Group::delete';
	$route1[ 'get' ] = 'V1/Group::get';
	$route1[ 'toggle-admin' ] = 'V1/Group::toggle_admin';
	$route1[ 'add-user' ] = 'V1/Group::add_user';
	$route1[ 'remove-buddy' ] = 'V1/Group::remove-buddy';
	$route1[ 'toggle-location' ] = 'V1/Group::toggle_location';
	$routes->map( $route1, [ 'filter' => 'isLogged' ] );
} );
$routes->post('getcount','V1/Admin::getcount');
?>