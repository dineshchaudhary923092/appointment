<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ SlotsModel;
use App\ Models\ V1\ timeslotsModel;
class Timeslots extends BaseController {
	public
	function get() {
		$SlotsModel = new timeslotsModel( \Config\ Services::request() );
		$doctor = $SlotsModel->no_data( 'doctor' );
		$month = $SlotsModel->no_data( 'month' )?$SlotsModel->no_data( 'month' ):date('m');
		$year = $SlotsModel->no_data( 'year' )?$SlotsModel->no_data( 'year' ):date('Y');
		$res = $SlotsModel->getTimeslotsForUser( $month, $year, $doctor );
		return $this->response->setJSON( $res );
	}
	public
	function getr() {
		$SlotsModel = new timeslotsModel( \Config\ Services::request() );
		$doctor = $SlotsModel->no_data( 'doctor' );
		$month = $SlotsModel->no_data( 'month' )?$SlotsModel->no_data( 'month' ):date('m');
		$year = $SlotsModel->no_data( 'year' )?$SlotsModel->no_data( 'year' ):date('Y');
		$res = $SlotsModel->getTimeslotsForR( $month, $year, $doctor );
		return $this->response->setJSON( $res );
	}
}