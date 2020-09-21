<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ AdminModel;
use App\ Models\ V1\ DepartmentModel;
class Admin extends BaseController {
	public
	function add_user() {
		$AdminModel = new AdminModel( \Config\ Services::request() );
		$AdminModel->verify_route("SA,A");
		$res = $AdminModel->add_user();
		die($res);
	}
	public
	function getcount() {
		$AdminModel = new AdminModel( \Config\ Services::request() );
		$AdminModel->verify_route("SA,A");
		$res = $AdminModel->getcount();
		return $this->response->setJSON($res);
	}
	public
	function get_users() {
		$AdminModel = new AdminModel( \Config\ Services::request() );
		$DepartmentModel = new DepartmentModel( \Config\ Services::request() );
		$AdminModel->verify_route("SA,A,U,R,D");
		$type = $AdminModel->no_data('type');
		$res =$AdminModel->get_users($type);
		$data = $res['data'];
		$res['data'] = array();
		$res['data']['users'] = $data;
		$_POST['search'] = "";
		unset($_POST['search']);
		$res['data']['department'] = $DepartmentModel->getData();
		$res['data']['branches'] = $res['data']['department']['data']['branches'];
		$res['data']['department'] = $res['data']['department']['data']['department'];
		return $this->response->setJSON($res);
	}
	public
	function delete_user() {
		$AdminModel = new AdminModel( \Config\ Services::request() );
		$AdminModel->verify_route("SA,A");
		$res = $AdminModel->delete_user();
		return $this->response->setJSON($res);
	}
}