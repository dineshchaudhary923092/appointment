<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ AuthenticationModel;
class Home extends BaseController {
	public
	function index() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		return view( 'welcome_message' );
	}
	public
	function get_options() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->get_options();
		die($res);
	}
	public
	function contact_sync() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->contact_sync();
		die($res);
	}
	public
	function verify_otp() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->verify_otp($CommonModel->request->getPost('type'));
		if($res){
			$res = $CommonModel->get_json(1,"Common.43",$CommonModel->request->getPost('type'));
		}else{
			$res = $CommonModel->get_json(0,"Common.12",$CommonModel->request->getPost('type'));
		}
		die( $res );
	}
	public
	function login() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->login_user();
		die( $res );
	}
	public
	function refreshToken() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->refreshToken();
		die( $res );
	}
	public
	function get_details() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->get_details();
		die( json_encode( $res ) );
	}
	public
	function register() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->register();
		die($res);
	}
	public
	function send_otp() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->send_otp();
		die( $res );
	}
	public
	function contact_us() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->contact_us();
		die( json_encode( $res ) );
	}
	public
	function upload_file() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->upload_file();
		die( json_encode( $res ) );
	}
	public
	function request_password() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->request_password();
		die($res);
	}
	public
	function update_password() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->update_password();
		die($res );
	}
	public
	function update_password_otp() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->update_password_otp();
		die($res );
	}
	public
	function update_dp() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->update_dp();
		die($res );
	}
	public
	function update_profile() {
		$CommonModel = new AuthenticationModel( \Config\ Services::request() );
		$res = $CommonModel->update_user_data();
		die($res);
	}
}