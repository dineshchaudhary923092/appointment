<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ AdminModel;
use App\ Models\ V1\ HolidayModel;
class Holiday extends BaseController {
	public
	function add() {
		$HolidayModel = new HolidayModel( \Config\ Services::request() );
		$HolidayModel->verify_route("SA,A");
		$res = $HolidayModel->add();
		return $this->response->setJSON($res);
	}
	public
	function get() {
		$HolidayModel = new HolidayModel( \Config\ Services::request() );
		$HolidayModel->verify_route("SA,A,R");
		$res = $HolidayModel->getData();
		return $this->response->setJSON($res);
	}
	public
	function delete() {
		$HolidayModel = new HolidayModel( \Config\ Services::request() );
		$HolidayModel->verify_route("SA,A");
		$res = $HolidayModel->deleteData();
		return $this->response->setJSON($res);
	}
}
?>