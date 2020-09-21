<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ BranchModel;
class Branch extends BaseController {
	public
	function add() {
		$BranchModel = new BranchModel( \Config\ Services::request() );
		$BranchModel->verify_route("SA,A");
		$res = $BranchModel->add();
		die($res);
	}
	public
	function get() {
		$BranchModel = new BranchModel( \Config\ Services::request() );
		$BranchModel->verify_route("SA,A,D,U,R");
		$res = $BranchModel->getData();
		return $this->response->setJSON($res);
	}
	public
	function delete() {
		$BranchModel = new BranchModel( \Config\ Services::request() );
		$BranchModel->verify_route("SA,A");
		$res = $BranchModel->deleteData();
		return $this->response->setJSON($res);
	}
}