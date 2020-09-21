<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ DurationModel;
class Duration extends BaseController {
	public
	function add() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A,R");
		$slotId = $SlotsModel->no_data('slotid');	
		$start = $SlotsModel->no_data('start');	
		$end = $SlotsModel->no_data('end');	
		$id = $SlotsModel->no_data('id');	
		$res = $SlotsModel->add($slotId,$start,$end,$id);
		return $this->response->setJSON($res);
	}
	public
	function addbreak() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A,R");
		$slotId = $SlotsModel->no_data('slotid');
		$start = $SlotsModel->no_data('start');	
		$end = $SlotsModel->no_data('end');	
		$id = $SlotsModel->no_data('id');	
		$res = $SlotsModel->addbreak($slotId,$start,$end,$id);
		return $this->response->setJSON($res);
	}
	public
	function addleave() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A,R");
		$slotId = $SlotsModel->no_data('slotid');
		$start = $SlotsModel->no_data('start');	
		$end = $SlotsModel->no_data('end');	
		$id = $SlotsModel->no_data('id');	
		$res = $SlotsModel->addleave($slotId,$start,$end,$id);
		return $this->response->setJSON($res);
	}
	public
	function get() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A,D,U,R");
		$res = $SlotsModel->getData();
		return $this->response->setJSON($res);
	}
	public
	function delete() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A");
		$slotId = $SlotsModel->no_data('durationid');
		$res = $SlotsModel->deleteData($slotId);
		die($res);
	}
	public
	function deletebreak() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A");
		$slotId = $SlotsModel->no_data('breakid');
		$res = $SlotsModel->deleteDataBreak($slotId);
		die($res);
	}
	public
	function deleteleave() {
		$SlotsModel = new DurationModel( \Config\ Services::request() );
		$SlotsModel->verify_route("SA,A");
		$leaveid = $SlotsModel->no_data('leaveid');
		$res = $SlotsModel->deleteDataLeave($leaveid);
		die($res);
	}
}