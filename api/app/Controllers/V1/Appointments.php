<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ SlotsModel;
use App\ Models\ V1\ AppointmentModel;
class Appointments extends BaseController {
	public
	function get() {
		$AppointmentModel = new AppointmentModel( \Config\ Services::request() );
		$type = $AppointmentModel->no_data( 'type' );
		$res = $AppointmentModel->getData($type);
		return $this->response->setJSON( $res );
	}
	public
	function updatestatus() {
		$AppointmentModel = new AppointmentModel( \Config\ Services::request() );
		$AppointmentModel->verify_route("R,U");
		$status = $AppointmentModel->no_data( 'status' );
		$timeSlotId = $AppointmentModel->no_data( 'timeSlotId' );
		$res = $AppointmentModel->updateStatus($timeSlotId,$status);
		return $this->response->setJSON( $res );
	}
	public
	function addmedia() {
		$AppointmentModel = new AppointmentModel( \Config\ Services::request() );
		$AppointmentModel->verify_route("R,U");
		$SlotId = $AppointmentModel->no_data( 'timeSlotId' );
		$res = $AppointmentModel->uploadMedia($SlotId);
		return $this->response->setJSON( $res );
	}
	public
	function deletemedia() {
		$AppointmentModel = new AppointmentModel( \Config\ Services::request() );
		$AppointmentModel->verify_route("R,U");
		$SlotId = $AppointmentModel->no_data( 'timeSlotId' );
		$res = $AppointmentModel->deleteMedia($SlotId);
		return $this->response->setJSON( $res );
	}
	public
	function bookslot() {
		$AppointmentModel = new AppointmentModel( \Config\ Services::request() );
		$AppointmentModel->verify_route("R,U");
		$res = $AppointmentModel->bookSlot();
		return $this->response->setJSON( $res );
	}
}