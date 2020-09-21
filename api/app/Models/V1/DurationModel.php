<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ timeslotsModel;
class DurationModel extends AuthenticationModel {
	protected $table = "durations";
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

	function getData( $slotId = "", $doctorId = "", $durationId="") {
		$user = $this->user_data;
		if ( !empty( $durationId ) ) {
			$this->durations->where( 'id', $durationId );
		} elseif ( !empty( $slotId ) ) {
			$this->durations->where( 'slot_id', $slotId );
		} elseif ( !empty( $doctorId ) ) {
			$this->durations->where( "slot_id IN (SELECT id FROM slots WHERE doctor=$doctorId AND star)" );
		}
		else {
			return $this->get_json( 1, "Common.2" );
		}
		$sql_more = $this->durations->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$this->durations->orderBy( 'id' );
		$result = $this->durations->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		$part_data = array();
		$part_data[ 'timeline' ] = array();
		$part_data[ 'break' ] = array();
		$part_data[ 'leave' ] = array();
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				if ( $result[ $i ][ 'type' ] == "leave" ) {
					$result[ $i ][ 'start_raw' ] = $this->get_date_raw( $result[ $i ][ 'start' ] );
					$result[ $i ][ 'end_raw' ] = $this->get_date_raw( $result[ $i ][ 'end' ] );
					$result[ $i ][ 'start' ] = $this->get_date( $result[ $i ][ 'start' ] );
					$result[ $i ][ 'end' ] = $this->get_date( $result[ $i ][ 'end' ] );
				} else {
					$result[ $i ][ 'startap' ] = $this->ampm( $result[ $i ][ 'start' ] );
					$result[ $i ][ 'endap' ] = $this->ampm( $result[ $i ][ 'end' ] );
					$result[ $i ][ 'startpicker' ] = $this->get_date_raw( strtotime( $this->get_date( time() ) . " " . $result[ $i ][ 'start' ] ) );
					$result[ $i ][ 'endpicker' ] = $this->get_date_raw( strtotime( $this->get_date( time() ) . " " . $result[ $i ][ 'end' ] ) );
				}
				if ( empty( $part_data[ $result[ $i ][ 'type' ] ] ) ) {
					$part_data[ $result[ $i ][ 'type' ] ] = array();
				}
				$part_data[ $result[ $i ][ 'type' ] ][] = $result[ $i ];
			}
		}
		return $this->get_error( 1, "Common.15", $part_data, $more );
	}
	public

	function deleteData( $duration ) {
		$user = $this->user_data;
		$id = $duration;
		$table = $this->table;
		$id = $id;
		if ( !empty( $table ) && !empty( $id ) ) {
			$timeline = $this->durations->where( 'id', $id )->where( 'type', 'timeline' )->get()->getRowArray();
			if ( !empty( $timeline ) ) {
				$timeslotsModel = new timeslotsModel( $this->request );
				$timeslotsModel->deleteSlots( $id );
				$res = $this->delete_row( $id, $table );
				$duration = $this->getData( $timeline[ 'slot_id' ] );
				$duration = $duration[ 'data' ];
				$res[ 'data' ] = array( 'slotId' => $timeline[ 'slot_id' ], "durationId" => $id, "durations" => $duration );
				return json_encode( $res );
			} else {
				return $this->get_json( 0, 'Common.2', array( "id" => $id ) );
			}
		} else {
			return $this->get_json( 0, 'Common.2', array( "id" => $id ) );
		}
	}
	public

	function deleteDataBreak( $breakId ) {
		$user = $this->user_data;
		$id = $breakId;
		$table = $this->table;
		$id = $id;
		if ( !empty( $table ) && !empty( $id ) ) {
			$timeslotsModel = new timeslotsModel( $this->request );
			$break = $this->durations->where( 'id', $breakId )->where( 'type', 'break' )->get()->getRowArray();
			if ( !empty( $break[ 'slot_id' ] ) ) {
				$res = $this->delete_row( $id, $table );
				$timeslotsModel->markBreaks( $break[ 'slot_id' ] );
				$duration = $this->getData( $break[ 'slot_id' ] );
				$duration = $duration[ 'data' ];
				$res[ 'data' ] = array( 'slotId' => $break[ 'slot_id' ], "durationId" => $id, "durations" => $duration );
				return json_encode( $res );
			}
		} else {
			return $this->get_json( 0, 'Common.2', array( "id" => $id ) );
		}
	}
	public

	function deleteDataLeave( $leaveId ) {
		$user = $this->user_data;
		$id = $leaveId;
		$table = $this->table;
		$id = $id;
		if ( !empty( $table ) && !empty( $id ) ) {
			$timeslotsModel = new timeslotsModel( $this->request );
			$leave = $this->durations->where( 'id', $leaveId )->where( 'type', 'leave' )->get()->getRowArray();
			if ( !empty( $leave[ 'slot_id' ] ) ) {
				$res = $this->delete_row( $id, $table );
				$timeslotsModel->markLeave( $leave[ 'slot_id' ] );
				$duration = $this->getData( $leave[ 'slot_id' ] );
				$duration = $duration[ 'data' ];
				$res[ 'data' ] = array( 'slotId' => $leave[ 'slot_id' ], "durationId" => $id, "durations" => $duration );
				return json_encode( $res );
			} else {
				return $this->get_json( 0, 'Common.2' );
			}
		} else {
			return $this->get_json( 0, 'Common.2' );
		}
	}
	public

	function addbreak( $slotId, $start, $end, $id = "" ) {
		$user = $this->user_data;
		if ( empty( $start ) || empty( $end ) ) {
			return $this->get_error( 0, "Common.2" );
		}
		$date = $this->getDateMDY( time() );
		$type = "break";
		$data[ 'type' ] = $type;
		$data[ 'start' ] = $this->ampmto24( $start );
		$data[ 'end' ] = $this->ampmto24( $end );
		$slotData = $this->slots->where( 'id', $slotId )->select( '*' )->get()->getrowArray();
		if ( strtotime( $date . " $start" ) > strtotime( $date . " $end" ) ) {
			return $this->get_error_msg( 0, lang( "App.13", [ 'type' => $type ] ) );
		}
		if ( empty( $slotData ) ) {
			return $this->get_error( 0, "App.23" );
		}
		$data[ 'slot_id' ] = $slotId;
		if ( !empty( $id ) ) {
			$this->durations->where( 'id', $id )->update( $data );
		} else {
			$res = $this->durations->where( $data )->get()->getRowArray();
			if ( empty( $res ) ) {
				$this->durations->insert( $data );
				$id = $this->db->insertId();
			} else {
				return $this->get_error( 0, "App.20" );
			}
		}
		$timeslotsModel = new timeslotsModel( $this->request );
		return $timeslotsModel->markBreaks( $slotId );
	}
	public

	function addleave( $slotId, $start, $end, $id = "" ) {
		$user = $this->user_data;
		if ( empty( $start ) || empty( $end ) ) {
			return $this->get_error( 0, "Common.2" );
		}
		$type = "leave";
		$data[ 'type' ] = $type;
		$data[ 'start' ] = strtotime( $start );
		$data[ 'end' ] = strtotime( $end ) + ( ( 24 * 60 * 60 ) - 1 );
		$slotData = $this->slots->where( 'id', $slotId )->select( '*' )->get()->getrowArray();
		if ( empty( $slotData ) ) {
			return $this->get_error( 0, "App.22" );
		}
		if ( $data[ 'start' ] > $data[ 'end' ]  || !$this->between( $data[ 'start' ], $slotData[ 'start_date' ], $slotData[ 'end_date' ] ) ) {
			return $this->get_error_msg( 0, lang( "App.25" ) );
		}
		$data[ 'slot_id' ] = $slotId;
		if ( !empty( $id ) ) {
			$this->durations->where( 'id', $id )->update( $data );
		} else {
			$res = $this->durations->where( $data )->get()->getRowArray();
			if ( empty( $res ) ) {
				$this->durations->insert( $data );
				$id = $this->db->insertId();
			} else {
				return $this->get_error( 0, "App.27" );
			}
		}
		$timeslotsModel = new timeslotsModel( $this->request );
		return $timeslotsModel->markLeave( $slotId );
	}
	public

	function add( $slotId, $start, $end, $id = "" ) {
		$user = $this->user_data;
		if ( empty( $start ) || empty( $end ) ) {
			return $this->get_error( 0, "Common.2" );
		}
		$date = $this->getDateMDY( time() );
		$type = "timeline";
		$data[ 'type' ] = $type;
		$data[ 'start' ] = $this->ampmto24( $start );
		$data[ 'end' ] = $this->ampmto24( $end );
		$slotData = $this->slots->where( 'id', $slotId )->select( '*' )->get()->getrowArray();
		if ( strtotime( $date . " $start" ) >= strtotime( $date . " $end" ) ) {
			return $this->get_error_msg( 0, lang( "App.13", [ 'type' => $type ] ) );
		}
		if ( empty( $slotData ) ) {
			return $this->get_error( 0, "App.22" );
		}
		$durationData = $this->durations->where( 'slot_id', $slotId )->select( '*' )->get()->getResultArray();
		$hasTimeline = false;
		$data[ 'slot_id' ] = $slotId;
		$timeslotsModel = new timeslotsModel( $this->request );
		$slots = $timeslotsModel->checkSlots( $start, $end, $slotId, $id );
		if ( $slots[ 'error' ] != 1 ) {
			return $slots;
		}
		if ( !empty( $id ) ) {
			$this->durations->where( 'id', $id )->update( $data );
			$timeslotsModel->deleteSlots( $id );
		} else {
			$res = $this->durations->where( $data )->get()->getRowArray();
			if ( empty( $res ) ) {
				$this->durations->insert( $data );
				$id = $this->db->insertId();
			} else {
				return $this->get_error( 0, "App.20" );
			}
		}
		return $timeslotsModel->createSlots( $start, $end, $slotId, $id );

	}
}
?>