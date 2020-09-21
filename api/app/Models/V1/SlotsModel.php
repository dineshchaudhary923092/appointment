<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ DurationModel;
use App\ Models\ V1\ timeslotsModel;
class SlotsModel extends AuthenticationModel {
	protected $table = "slots";
	protected $useTimestamps = false;
	protected $useSoftDeletes = false;
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->get_details();
		$this->slots = $this->db->table( 'slots' );
		$this->durations = $this->db->table( 'durations' );
		$this->timeslots = $this->db->table( 'timeslots' );
	}
	public

	function getData($doctor="") {
		$user = $this->user_data;
		if ( $doctor ) {
//			$doctor = $this->no_data( 'doctor' );
			$doctor = $this->decrypt( $doctor );
			$this->slots->where( 'doctor', $doctor );
		} else {
			return $this->get_json( 1, "Common.2" );
		}
		$sql_more = $this->slots->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$this->slots->orderBy( 'id' );
		$result = $this->slots->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			$durationModel = new DurationModel( $this->request );
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'start_date_formatted' ] = $this->get_date( $result[ $i ][ 'start_date' ] );
				$result[ $i ][ 'end_date_formatted' ] = $this->get_date( $result[ $i ][ 'end_date' ] );
				$result[ $i ][ 'start_date' ] = $this->get_date_raw( $result[ $i ][ 'start_date' ] );
				$result[ $i ][ 'end_date' ] = $this->get_date_raw( $result[ $i ][ 'end_date' ] );
				$result[ $i ][ 'durations' ] = $durationModel->getData($result[ $i ][ 'id' ]);
				$result[ $i ][ 'durations' ] = $result[ $i ][ 'durations' ]['data'];
				
			}
		}
		$status = 1;
		$msg = "Common.15";
		if ( $this->no_data( 'slotId' ) ) {
			$get[ 'slot_id' ] = $this->no_data( 'slotId' );
			$res = $this->timeslots->where( $get )->where( 'status', 'booked' )->where( 'start_time >', time() )->get()->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$status = 2; //there are booked slots
				$status = "Common.21";
			}
		}
		return $this->get_error( $status, $msg, $result, $more );
	}
	public

	function deleteData() {
		$user = $this->user_data;
		$id = $this->no_data( 'id' );
		$table = $this->table;
		$id = $id;
		if ( !empty( $table ) && !empty( $id ) ) {
			$durationModel = new DurationModel( $this->request );
			$durations = $this->durations->where( 'slot_id', $id )->get()->getResultArray();
			foreach ( $durations as $duration ) {
				$durationModel->deleteData( $duration[ 'id' ] );
			}
			$data = $this->delete_row( $id, $table );
			$data[ 'data' ] = array( 'id' => $id );
			return $data;
		} else {
			return $this->get_error( 0, 'Common.2',array("id"=>$id) );
		}
	}
	public

	function add() {
		$user = $this->user_data;
		if ( !$this->no_data( 'doctor' ) || !$this->no_data( 'start' ) || !$this->no_data( 'end' ) ) {
			return $this->get_error( 0, "Common.2" );
		} else {
			$doctor = $this->decrypt( $this->no_data( 'doctor' ) );
			$doctor = $this->builder->where( 'id', $doctor )->select( 'type,id' )->get()->getRowArray();
			if ( empty($doctor)||$doctor[ 'type' ] != "D" ) {
				return $this->get_error( 0, "App.8" );
			}
			$doctor = $doctor[ 'id' ];
		}
		$data[ 'doctor' ] = $doctor;
		$data[ 'start_date' ] = strtotime( $this->no_data( 'start' ) );
		$data[ 'end_date' ] = ( strtotime( $this->no_data( 'end' )));
		if ( ( time() > $data[ 'start_date' ] ) || ( time() > $data[ 'end_date' ] ) || ( $data[ 'end_date' ] < $data[ 'start_date' ] ) ) {
			return $this->get_error( 0, "App.11" );
		}
		$id = $this->no_data( 'id' );
		if ( !empty( $id ) ) {
			$durations = $this->durations->where( 'slot_id', $id )->where( 'type', 'timeline' )->get()->getResultArray();
			$timeslotsModel = new timeslotsModel( $this->request );
			if ( !empty( $durations ) ) {
				foreach ( $durations as $duration ) {
					$valid = $timeslotsModel->checkSlotsUpdate( $data[ 'start_date' ], $data[ 'end_date' ], $duration[ 'start' ], $duration[ 'end' ], $id, $duration[ 'id' ] );
					if ( $valid[ 'error' ] == 0 ) {
						return $this->get_error( 0, "App.18" );
					}
				}
			}
			$this->slots->update( $data, [ 'id' => $id ] );
			if ( !empty( $durations ) ) {
				$DurationModel = new DurationModel( $this->request );
				foreach ( $durations as $duration ) {
				   $DurationModel->add( $id, $duration[ 'start' ], $duration[ 'end' ], $duration[ 'id' ] );
				}
			}
			$error = 9;
		} else {
			$this->slots->insert( $data );
			$id = $this->db->insertId();
			$error = 10;
		}
		return $this->get_error( 1, "App.$error",array('zone'=>date_default_timezone_get()) );
	}
}
?>