<?php
//C:/wamp64/bin/php/php7.4.0/php.exe spark serve
namespace App\ Controllers\ V1;
use App\ Controllers\ BaseController;
use App\ Models\ V1\ SlotsModel;
use App\ Models\ V1\ AdminModel;
use App\ Models\ V1\ DurationModel;
class Slots extends BaseController {
	public

	function add() {
		$SlotsModel = new SlotsModel( \Config\ Services::request() );
		$SlotsModel->verify_route( "SA,A,R" );
		$res = $SlotsModel->add();
		return $this->response->setJSON( $res );
	}
	public
	function get() {
		$SlotsModel = new SlotsModel( \Config\ Services::request() );
		$AdminModel = new AdminModel( \Config\ Services::request() );
		$SlotsModel->verify_route( "SA,A,R" );
		$doctor = $SlotsModel->no_data( 'doctor' );
		$users = $AdminModel->get_users( 'D' );
		$user_data = $users[ 'data' ];
		if ( empty( $doctor ) && !empty( $user_data ) ) {
			$doctor = $user_data[ 0 ][ 'id' ];
		} elseif ( empty( $doctor ) ) {
			return $this->response->setJSON( $SlotsModel->get_error( 1, "Common.16", $users ) );
		}
		for ( $i = 0; $i < count( $user_data ); $i++ ) {
			$user_data[ $i ][ 'selected' ] = $user_data[ $i ][ 'id' ] == $doctor ? "yes" : "no";
		}
		$res = $SlotsModel->getData( $doctor );
		$res_data = $res[ 'data' ];
		$res[ 'data' ] = [];
		if ( !$SlotsModel->no_data( 'doctor' ) ) {
			$res[ 'data' ][ 'users' ] = $user_data;
		}
		$res[ 'data' ][ 'slots' ] = $res_data;
		return $this->response->setJSON( $res );
	}
	public
	function delete() {
		$SlotsModel = new SlotsModel( \Config\ Services::request() );
		$SlotsModel->verify_route( "SA,A,R" );
		$res = $SlotsModel->deleteData();
		return $this->response->setJSON( $res );
	}
}