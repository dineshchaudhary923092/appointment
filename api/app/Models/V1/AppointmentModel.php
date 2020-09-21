<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ NotificationModel;
use CodeIgniter\ I18n\ Time;
class AppointmentModel extends AuthenticationModel {
	protected $table = "timeslots";
	protected $useTimestamps = false;
	protected $useSoftDeletes = false;
	protected $allowedFields = [ 'name', 'image' ];
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->get_details();
		$this->slots = $this->db->table( 'slots' );
		$this->timeslots = $this->db->table( $this->table );
	}

	function getSlotDetails( $slotId ) {
		$timeSlotNew = $this->timeslots->where( 'id', $slotId )->get()->getRowArray();
		$doctor = $this->slots->where( "slots.id", $timeSlotNew[ 'slot_id' ] )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->join( 'user b', "b.id = {$timeSlotNew['user_id']}", 'LEFT' )->select( 'slots.*,user.*,user.department as doctor_department,user.image as doctor_image,b.name as user_name, b.image as user_image' )->get()->getRowArray();
		$department = $this->db->table( 'branch,department' )->where( 'department.branch = branch.id' )->select( 'department.name as department_name,department.image as department_image,branch.name as branch_name' )->where( 'department.id', $doctor[ 'doctor_department' ] )->get()->getRowArray();
		if ( !empty( $doctor ) && !empty( $department ) ) {
			foreach ( $department as $key => $value ) {
				$doctor[ $key ] = $value;
			}
			$doctor[ 'print_slot_id' ] = "SL" . $timeSlotNew[ 'id' ] . "D" . $doctor[ 'id' ];
			$doctor[ 'date' ] = $this->get_date( $timeSlotNew[ 'start_time' ] );
			$doctor[ 'time' ] = date( "H:i A", $timeSlotNew[ 'start_time' ] );
			return $this->get_error( 1, "App.51",$doctor );
		} else {
			return $this->get_error( 0, "App.50" );
		}
	}
	public

	function deleteMedia( $slotId ) {
		$user = $this->user_data;
		$slotData = $this->timeslots->where( 'id', $slotId )->get()->getRowArray();
		$file = $this->no_data( 'file' );
		if ( !( $slotData[ 'status' ] == "booked" || $slotData[ 'status' ] == "present" || $slotData[ 'status' ] == "absent" ) ) {
			return $this->get_error( 0, "App.43" );
		}
		$data = array();
		$data[ 'media' ] = "";
		if ( !empty( $slotData ) ) {
			$slotData[ 'media' ] = str_replace( $file, '', $slotData[ 'media' ] );
			if ( !empty( $slotData[ 'media' ] ) ) {
				$slotData[ 'media' ] = implode( ',', array_filter( explode( ',', $slotData[ 'media' ] ) ) );
			}
			$data[ 'media' ] = $slotData[ 'media' ];
			$this->delete_file( $file );
			$this->timeslots->where( 'id', $slotId )->update( $data );
			return $this->get_error( 1, "App.44", $slotData );
		}
	}
	public

	function uploadMedia( $slotId ) {
		$user = $this->user_data;
		$slotData = $this->timeslots->where( 'id', $slotId )->get()->getRowArray();
		$data = array();
		$data[ 'media' ] = "";
		if ( !( $slotData[ 'status' ] == "booked" || $slotData[ 'status' ] == "present" || $slotData[ 'status' ] == "absent" ) ) {
			return $this->get_error( 0, "App.43" );
		}
		if ( !empty( $slotData ) ) {
			$res = $this->upload_file( 'file', '', 'appointments/' );
			if ( $res[ 'error' ] == 1 && !empty( $res[ 'msg' ] ) ) {
				$data[ 'media' ] .= empty( $slotData[ 'media' ] ) ? $res[ 'msg' ] : "," . $res[ 'msg' ];
				$slotData[ 'media' ] .= empty( $slotData[ 'media' ] ) ? $res[ 'msg' ] : "," . $res[ 'msg' ];
				$this->timeslots->where( 'id', $slotId )->update( $data );
				return $this->get_error( 1, "App.42", $slotData );
			} else {
				return $this->get_error( $res[ 'error' ], $res[ 'msg' ] );
			}
		}
	}
	public

	function bookSlot() {
		$user = $this->user_data;
		$id = $this->no_data( 'id' );
		$userId = $this->no_data( 'userId' );
		$userId = $this->decrypt( $userId );
		$oldId = $this->no_data( 'oldId' );
		$timeSlotNew = $this->timeslots->where( 'id', $id )->get()->getRowArray();
		if ( !empty( $oldId ) ) {
			$timeSlot = $this->timeslots->where( 'id', $oldId )->get()->getRowArray();
		}
		$doctor = $this->slots->where( "slots.id", $timeSlotNew[ 'slot_id' ] )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->join( 'user b', "b.id = $userId", 'LEFT' )->select( 'slots.*,user.*,b.name as user_name, b.image as user_image' )->get()->getRowArray();
		if ( $timeSlotNew[ 'status' ] != "free" ) {
			return $this->get_error( 0, "App.39" );
		}
		$data[ 'status' ] = "booked";
		$data[ 'user_id' ] = $userId;
		$data[ 'booking_time' ] = time();
		if ( !empty( $oldId ) ) {
			if ( $timeSlot[ 'start_time' ] < time() + ( 24 * 60 * 60 ) ) {
				return $this->get_error( 0, "App.38" );
			}
			$this->updateStatus( $oldId, "free" );
		}
		$this->timeslots->where( 'id', $id )->update( $data );
		$slotDetails = $this->getSlotDetails($timeSlotNew['id']);
		$slotDetails = $slotDetails['data'];
		if ( $user[ 'type' ] == "R" && !empty( $oldId ) ) {
			$notification = new NotificationModel( $this->request );
			$notification->saveNotification( $userId, lang( 'App.40', [ "doctor" => $doctor[ 'name' ], 'date' => date( 'D,M d,Y', $timeSlot[ 'start_time' ] ), 'new_date' => date( 'D,M d,Y', $timeSlotNew[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
			return $this->get_error( 1, "App.47",$slotDetails );
		} elseif ( $user[ 'type' ] == "U" ) {
			$notification = new NotificationModel( $this->request );
			if ( empty( $oldId ) ) {
				$notification->saveNotification( $userId, lang( 'App.45', [ "name" => $doctor[ 'user_name' ], 'date' => date( 'D,M d,Y', $timeSlotNew[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
				return $this->get_error( 1, "App.48",$slotDetails );
			} else {
				$notification->saveNotification( $userId, lang( 'App.46', [ "name" => $doctor[ 'user_name' ], 'date' => date( 'D,M d,Y', $timeSlot[ 'start_time' ] ), 'new_date' => date( 'D,M d,Y', $timeSlotNew[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
				return $this->get_error( 1, "App.47",$slotDetails );
			}
		} else {
			return $this->get_error( 0, "App.49", [ 'role' => "Users/Receptionist" ] );
		}
	}
	public

	function updateStatus( $timeSlotId, $status ) {
		$user = $this->user_data;
		$timeSlot = $this->timeslots->where( 'id', $timeSlotId )->get()->getRowArray();
		$error = 36;
		if ( empty( $timeSlot ) || ( !empty( $timeSlot ) && $timeSlot[ 'status' ] != "booked" ) ) {
			return $this->get_error( 1, "App.37" );
		}
		$doctor = $this->slots->where( "slots.id", $timeSlot[ 'slot_id' ] )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->get()->getRowArray();
		if ( $user[ 'type' ] == "U" ) {
			$error = 35;
			$this->timeslots->where( 'user_id', $user[ 'id' ] );
		}
		if ( $status == "cancelled" || $status == "free" ) {
			$data[ 'user_id' ] = null;
			$data[ 'booking_time' ] = null;
		}
		$data[ 'status' ] = $status;
		$this->timeslots->where( 'id', $timeSlotId );
		$this->timeslots->update( $data );
		if ( $user[ 'type' ] == "R" ) {
			$notification = new NotificationModel( $this->request );
			$notification->saveNotification( $timeSlot[ 'user_id' ], lang( 'App.17', [ "doctor" => $doctor[ 'name' ], 'date' => date( 'D,M d,Y', $timeSlot[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
		}
		return $this->get_error( 1, "App.$error" );
	}
	public

	function getData( $type = "upcoming" ) {
		$user = $this->user_data;
		$user[ 'type' ] = $this->no_data( 'user_type' );
		if ( $user[ 'type' ] == "R" ) {
			return $this->getAppointmentReceptionist( $type );
		} elseif ( $user[ 'type' ] == "D" ) {
			return $this->getAppointmentDoctor( $type );
		} else {
			return $this->getAppointmentUser( $type );
		}

	}
	public

	function getAppointmentUser( $type ) {
		$user = $this->user_data;
		$tables = $this->db->table( 'user,slots,timeslots,branch,department' )->where( 'timeslots.slot_id = slots.id AND slots.doctor = user.id AND user.department = department.id AND department.branch = branch.id' )->where( 'user_id', $user[ 'id' ] )->SELECT( 'timeslots.*,user.name,user.image,department.name as department_name, branch.name as branch_name, department.image as department_logo,`user`.`id` as doctor_id,`user`.`name` as doctor_name,b.name as userName,b.image as userImage' );
		$tables->join( 'user b', "b.id = timeslots.user_id", 'LEFT' );
		if ( $type == "upcoming" ) {
			$tables->where( 'timeslots.status', 'booked' )->where( 'timeslots.start_time >', time() );
		} elseif ( $type == "today" ) {
			$start = strtotime( 'Today' );
			$end = strtotime( 'Tomorrow' ) - 1;
			$tables->where( 'timeslots.status', 'booked' )->where( "timeslots.start_time BETWEEN $start AND $end" );
		} else {
			$tables->where( 'timeslots.status!=', 'free' )->where( 'timeslots.status!=', 'invalid' )->where( 'timeslots.status!=', 'onleave' );
			$tables->groupStart()->where( 'timeslots.status!=', 'booked' )->orWhere( 'timeslots.start_time <', time() )->groupEnd()->where( 'timeslots.status!=', 'free' )->where( 'timeslots.status!=', 'invalid' )->where( 'timeslots.status!=', 'onleave' );
		}
		$sql_more = $tables->getCompiledSelect( false );
		//		die($sql_more);
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$tables->orderBy( 'timeslots.start_time', "DESC" );
		$result = $tables->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by timeslots.id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'date' ] = $this->get_date( $result[ $i ][ 'start_time' ] );
				if ( !empty( $result[ $i ][ 'media' ] ) ) {
					$result[ $i ][ 'media' ] = explode( ',', $result[ $i ][ 'media' ] );
				}
				$result[ $i ][ 'print_slot_id' ] = "SL" . $result[ $i ][ 'id' ] . "D" . $result[ $i ][ 'doctor_id' ];
				$result[ $i ][ 'doctor_id' ] = $this->encrypt( $result[ $i ][ 'doctor_id' ] );
				$result[ $i ][ 'time' ] = date( "H:i A", $result[ $i ][ 'start_time' ] );
				$result[ $i ][ 'can_edit' ] = "no";
				if ( $result[ $i ][ 'status' ] = "booked" ) {
					$result[ $i ][ 'can_edit' ] = $result[ $i ][ 'start_time' ] > time() + ( 24 * 60 * 60 ) && $result[ $i ][ 'status' ] == "booked" ? "yes" : "no"; //24 hours
				}

			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
	}
	public

	function getAppointmentReceptionist( $type ) {
		$user = $this->user_data;
		$tables = $this->db->table( 'user,slots,timeslots,branch,department' )->where( 'timeslots.slot_id = slots.id AND slots.doctor = user.id AND user.department = department.id AND department.branch = branch.id' )->select( 'timeslots.*,user.name,user.image,department.name as department_name, branch.name as branch_name, department.image as department_logo,`user`.`id` as doctor_id,`user`.`name` as doctor_name,b.name as userName,b.id as userId,b.image as userImage' );
		$tables->join( 'user b', "b.id = timeslots.user_id", 'LEFT' );
		if ( $this->no_data( 'branch' ) ) {
			$branch = $this->no_data( 'branch' );
			$tables->where( 'branch.id', $branch );
		}
		if ( $this->no_data( 'department' ) ) {
			$department = $this->no_data( 'department' );
			$tables->where( 'department.id', $department );
		}
		if ( $this->no_data( 'doctor' ) ) {
			$doctor = $this->no_data( 'doctor' );
			$doctor = $this->decrypt( $doctor );
			$tables->where( 'slots.doctor', $doctor );
		}
		if ( $this->no_data( 'status' ) ) {
			$status = $this->no_data( 'status' );
			$tables->where( 'timeslots.status', $status );
		} else {
			$tables->where( 'timeslots.status', 'booked' );
		}
		if ( $type == "upcoming" ) {
			$tables->where( 'start_time >', time() );
		} elseif ( $type == "today" ) {
			$start = strtotime( 'Today' );
			$end = strtotime( 'Tomorrow' ) - 1;
			$tables->where( "timeslots.start_time BETWEEN $start AND $end" );
		}
		elseif ( $type == "date" && $this->no_data( 'date' ) ) {
			$date = $this->no_data( 'date' );
			$start = strtotime( $date );
			$end = strtotime( $date . ' +1 day' ) - 1;
			$tables->where( "timeslots.start_time BETWEEN $start AND $end" );
		}
		$sql_more = $tables->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$tables->orderBy( 'timeslots.start_time', "DESC" );
		$result = $tables->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by timeslots.id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'date' ] = $this->get_date( $result[ $i ][ 'start_time' ] );
				$result[ $i ][ 'time' ] = date( "H:i A", $result[ $i ][ 'start_time' ] );
				if ( !empty( $result[ $i ][ 'media' ] ) ) {
					$result[ $i ][ 'media' ] = explode( ',', $result[ $i ][ 'media' ] );
				}
				$result[ $i ][ 'print_slot_id' ] = "SL" . $result[ $i ][ 'id' ] . "D" . $result[ $i ][ 'doctor_id' ];
				$result[ $i ][ 'userId' ] = $this->encrypt( $result[ $i ][ 'userId' ] );
				$result[ $i ][ 'doctor_id' ] = $this->encrypt( $result[ $i ][ 'doctor_id' ] );
				$result[ $i ][ 'can_edit' ] = "no";
				if ( $result[ $i ][ 'status' ] = "booked" ) {
					$result[ $i ][ 'can_edit' ] = $result[ $i ][ 'start_time' ] > time() + ( 24 * 60 * 60 ) && $result[ $i ][ 'status' ] == "booked" ? "yes" : "no"; //24 hours
				}
			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
	}
	public

	function getAppointmentDoctor( $type ) {
		$user = $this->user_data;
		$tables = $this->db->table( 'user,slots,timeslots,branch,department' )->where( 'timeslots.slot_id = slots.id AND slots.doctor = user.id AND user.department = department.id AND department.branch = branch.id' )->Select( 'timeslots.*,user.name,user.image,department.name as department_name, branch.name as branch_name, department.image as department_logo,`user`.`id` as doctor_id,`user`.`name` as doctor_name,b.name as userName,b.image as userImage' );
		$tables->join( 'user b', "b.id = timeslots.user_id", 'LEFT' );
		$tables->where( 'slots.doctor', $user[ 'id' ] );
		if ( $this->no_data( 'status' ) ) {
			$status = $this->no_data( 'status' );
			$tables->where( 'timeslots.status', $status );
		} else {
			$tables->where( 'timeslots.status', 'booked' );
		}
		if ( $type == "upcoming" ) {
			$tables->where( 'start_time >', time() );
		} elseif ( $type == "today" ) {
			$start = strtotime( 'Today' );
			$end = strtotime( 'Tomorrow' ) - 1;
			$tables->where( "timeslots.start_time BETWEEN $start AND $end" );
		}
		elseif ( $type == "date" && $this->no_data( 'date' ) ) {
			$date = $this->no_data( 'date' );
			$start = strtotime( $date );
			$end = strtotime( $date . ' +1 day' ) - 1;
			$tables->where( "timeslots.start_time BETWEEN $start AND $end" );
		}
		$sql_more = $tables->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$tables->orderBy( 'timeslots.start_time', "DESC" );
		$result = $tables->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by timeslots.id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'date' ] = $this->get_date( $result[ $i ][ 'start_time' ] );
				if ( !empty( $result[ $i ][ 'media' ] ) ) {
					$result[ $i ][ 'media' ] = explode( ',', $result[ $i ][ 'media' ] );
				}
				$result[ $i ][ 'time' ] = date( "H:i A", $result[ $i ][ 'start_time' ] );
				$result[ $i ][ 'print_slot_id' ] = "SL" . $result[ $i ][ 'id' ] . "D" . $result[ $i ][ 'doctor_id' ];
				$result[ $i ][ 'doctor_id' ] = $this->encrypt( $result[ $i ][ 'doctor_id' ] );
				$result[ $i ][ 'can_edit' ] = "no";
				if ( $result[ $i ][ 'status' ] = "booked" ) {
					$result[ $i ][ 'can_edit' ] = $result[ $i ][ 'start_time' ] > time() + ( 24 * 60 * 60 ) && $result[ $i ][ 'status' ] == "booked" ? "yes" : "no"; //24 hours
				}
			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
	}
}