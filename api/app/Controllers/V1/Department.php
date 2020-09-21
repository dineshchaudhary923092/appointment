<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ DepartmentModel;
class Department extends BaseController {
	public
	function add() {
		$DepartmentModel = new DepartmentModel( \Config\ Services::request() );
		$DepartmentModel->verify_route("SA,A");
		$res = $DepartmentModel->add();
		die($res);
	}
	public
	function get() {

		$DepartmentModel = new DepartmentModel( \Config\ Services::request() );
		$DepartmentModel->verify_route("SA,A,R,U,D");
		$res = $DepartmentModel->getData();
		return $this->response->setJSON($res);
	}
	public
	function delete() {
		$DepartmentModel = new DepartmentModel( \Config\ Services::request() );
		$DepartmentModel->verify_route("SA,A");
		$res = $DepartmentModel->deleteData();
		return $this->response->setJSON($res);
	}
}