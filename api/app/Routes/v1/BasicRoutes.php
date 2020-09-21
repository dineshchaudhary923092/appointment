<?php 
$route['login'] = 'V1/Home::login';
$route['register'] = 'V1/Home::register';
$route['get-password'] = 'V1/Home::get_password';
$route['get-password/(:any)/(:any)'] = 'V1/Home::get_password/$1/$2';
$route['request-password'] = 'V1/Home::request_password';
$route['get-options'] = 'V1/Home::get_options';
$routes->map($route, ['filter' => 'isNotLogged']);
$route1['get_details'] = 'V1/Home::get_details';
$route1['logout'] = 'V1/Home::logout';
$route1['update-profile'] = 'V1/Home::update_profile';
$route1['update-dp'] = 'V1/Home::update_dp';
$route['contact-sync'] = 'V1/Home::contact_sync';
$route['refresh-token'] = 'V1/Home::refreshToken';
$routes->map($route1, ['filter' => 'isLogged']);
$routes->add('verify-otp', 'V1/Home::verify_otp');
$routes->get('getslots', 'V1/Timeslots::getslots');
$routes->post('send-otp', 'V1/Home::send_otp');
$routes->post('contact-us', 'V1/Home::contact_us');
$routes->post('upload_file', 'V1/Home::upload_file');
$routes->post('update-password', 'V1/Home::update_password');
$routes->post('update-password-otp', 'V1/Home::update_password_otp');
?>