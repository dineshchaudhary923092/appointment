<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ NotificationModel;
use CodeIgniter\ I18n\ Time;
class timeslotsModel extends AuthenticationModel {
	protected $table = "timeslots";
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

	function checkSlotsUpdate( $slotStart, $slotEnd, $start, $end, $slotId, $durationId = "" ) {
		$slotData = $this->slots->where( 'slots.id', $slotId )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'slots.*,user.slot_duration as duration' )->get()->getRowArray();
		$Timeslots = $this->getSlots( $slotData[ 'duration' ], $slotStart, $slotEnd, $start, $end );
		$invalid = array();
		$validSlots = array();
		$Createdslots = $this->timeslots->where( "slot_id IN (SELECT id from slots WHERE doctor = {$slotData['doctor']})" )->where( 'slot_id!=', $slotId )->where( 'start_time >', time() )->select( 'start_time,end_time,duration_id,slot_id' )->get()->getResultArray();
		$data[ 'new' ] = $Timeslots;
		$data[ 'old' ] = $Createdslots;
		//		echo json_encode($data);
		if ( !empty( $Timeslots[ 'dates' ] ) ) {
			foreach ( $Timeslots[ 'dates' ] as $DateSlots ) {
				if ( !empty( $DateSlots[ 'slots' ] ) ) {
					foreach ( $DateSlots[ 'slots' ] as $newTimeSlots ) {
						if ( !empty( $Createdslots ) ) {
							foreach ( $Createdslots as $Createdslot ) {
								if ( $this->between( $newTimeSlots[ 'timestamp' ], $Createdslot[ 'start_time' ], $Createdslot[ 'end_time' ] ) ) {
									$invalid = array( "new" => $newTimeSlots, "old" => $Createdslot, 'D' => $durationId );
									return $this->get_error( 0, ( "App.12" ), $invalid );
								}
							}
						}
						$validSlots[] = $newTimeSlots;
					}
				} else {
					return $this->get_error( 0, ( "App.12" ) );
				}
			}
		} else {
			return $this->get_error( 0, ( "App.12" ) );
		}
		if ( !empty( $invalid ) ) {
			echo $this->get_json( 0, "App.18", $invalid );
			die;
		}
		return $this->get_error( 1, "App.12", $validSlots );
	}
	public
	function getTimeslotsForUser( $month, $year, $doctor ) {
		$month = $month;
		$year = $year;
		$d = $month == date( 'n' ) && $year == date( 'Y' ) ? "d" : "01";
		$ed = date( "t", strtotime( strtotime( date( "$month/$d/$year" ) ) ) );
		$time = $month == date( 'n' ) && $year == date( 'Y' ) ? "H:s" : "";
		$start = strtotime( date( "$month/$d/$year $time" ) );
		$end = ( strtotime( date( "$month/$ed/$year" ) . " +1day" ) - 1 );
		$doctor = $this->decrypt( $doctor );
		$data[ 'start' ] = $this->get_date( $start );
		$data[ 'end' ] = $this->get_date( $end );
		$data[ 'doctor' ] = $this->builder->where( 'id', $doctor )->select( 'id,name,email,phone,image' )->get()->getRowArray();
		$holidays = $this->db->table( 'holidays' )->where( "start BETWEEN $start AND $end" )->orWhere( "end BETWEEN $start AND $end" )->get()->getResultArray();
		if ( !empty( $data[ 'doctor' ] ) ) {
			$data[ 'doctor' ][ 'id' ] = $this->encrypt( $data[ 'doctor' ][ 'id' ] );
			if ( !empty( $holidays ) ) {
				$this->timeslots->groupStart();
				foreach ( $holidays as $holiday ) {
					$this->timeslots->GroupStart();
					$this->timeslots->where( "start_time NOT BETWEEN {$holiday['start']} AND {$holiday['end']}", NULL, FALSE );
					$this->timeslots->orWhere( "end_time NOT BETWEEN {$holiday['start']} AND {$holiday['end']}", NULL, FALSE );
					$this->timeslots->groupEnd();
				}
				$this->timeslots->groupEnd();
			}
			$res = $this->timeslots->where( 'start_time >', $start )->where( 'end_time <', $end )->groupStart()->where( 'status', 'free' )->orWhere( 'status', "booked" )->groupEnd()->where( "slot_id IN (SELECT id FROM slots WHERE doctor=$doctor)" )->get()->getResultArray();
			$slots = array();
			$data[ 'slots' ] = array();
			$singleSlot = array();
			$startWhile = $start;
			if ( empty( $res ) ) {
				return $this->get_error( 1, "App.41", $data );
			}
			while ( $startWhile < $end ) {
				$singleSlot[ 'day' ] = date( 'D', $startWhile );
				$singleSlot[ 'date' ] = date( 'd', $startWhile );
				$singleSlot[ 'count' ] = 0;
				$singleSlot[ 'slotList' ] = array();
				foreach ( $res as $slot ) {
					if ( date( 'm/d/Y', $startWhile ) == date( 'm/d/Y', $slot[ 'start_time' ] ) ) {
						$slot[ 'printTime' ] = date( 'h:i A', $slot[ 'start_time' ] );
						$singleSlot[ 'slotList' ][] = $slot;
					}
				}
				$singleSlot[ 'count' ] = count($singleSlot[ 'slotList' ]);
				$data[ 'slots' ][] = $singleSlot;
				$startWhile = strtotime( date( 'm/d/Y', $startWhile ) . " +1 day" );
			}
			return $this->get_error( 1, "Common.15", $data );
		} else {
			return $this->get_error( 0, "App.34", $data );
		}

	}
	public
	function getTimeslotsForR( $month, $year, $doctor ) {
		$month = $month;
		$year = $year;
		$d = "01";
		$ed = date( "t", strtotime( strtotime( date( "$month/$d/$year" ) ) ) );
		$time = $month == date( 'n' ) && $year == date( 'Y' ) ? "H:s" : "";
		$start = strtotime( date( "$month/$d/$year $time" ) );
		$end = ( strtotime( date( "$month/$ed/$year" ) . " +1day" ) - 1 );
		$doctor = $this->decrypt( $doctor );
		$data[ 'start' ] = $this->get_date( $start );
		$data[ 'end' ] = $this->get_date( $end );
		$data[ 'doctor' ] = $this->builder->where( 'id', $doctor )->select( 'id,name,email,phone,image' )->get()->getRowArray();
		$holidays = $this->db->table( 'holidays' )->where( "start BETWEEN $start AND $end" )->orWhere( "end BETWEEN $start AND $end" )->get()->getResultArray();
		if ( !empty( $data[ 'doctor' ] ) ) {
			$data[ 'doctor' ][ 'id' ] = $this->encrypt( $data[ 'doctor' ][ 'id' ] );
			if ( !empty( $holidays ) ) {
				$this->timeslots->groupStart();
				foreach ( $holidays as $holiday ) {
					$this->timeslots->GroupStart();
					$this->timeslots->where( "start_time NOT BETWEEN {$holiday['start']} AND {$holiday['end']}", NULL, FALSE );
					$this->timeslots->orWhere( "end_time NOT BETWEEN {$holiday['start']} AND {$holiday['end']}", NULL, FALSE );
					$this->timeslots->groupEnd();
				}
				$this->timeslots->groupEnd();
			}
			$res = $this->timeslots->where( 'start_time >=', $start )->where( 'end_time <=', $end )->groupStart()->where( 'status', 'present' )->where('status','absent')->orWhere( 'status', "booked" )->groupEnd()->where( "slot_id IN (SELECT id FROM slots WHERE doctor=$doctor)" )->join('user','user.id = timeslots.user_id')->get()->getResultArray();
			$slots = array();
			$data[ 'slots' ] = array();
			$singleSlot = array();
			$startWhile = $start;
			if ( empty( $res ) ) {
				return $this->get_error( 1, "App.41", $data );
			}
			while ( $startWhile < $end ) {
				$singleSlot[ 'day' ] = date( 'D', $startWhile );
				$singleSlot[ 'date' ] = date( 'd', $startWhile );
				$singleSlot[ 'count' ] = 0;
				$singleSlot[ 'slotList' ] = array();
				foreach ( $res as $slot ) {
					if ( date( 'm/d/Y', $startWhile ) == date( 'm/d/Y', $slot[ 'start_time' ] ) ) {
						$slot[ 'printTime' ] = date( 'h:i A', $slot[ 'start_time' ] );
						$singleSlot[ 'slotList' ][] = $slot;
					}
				}
				$singleSlot[ 'count' ] = count($singleSlot[ 'slotList' ]);
				$data[ 'slots' ][] = $singleSlot;
				$startWhile = strtotime( date( 'm/d/Y', $startWhile ) . " +1 day" );
			}
			return $this->get_error( 1, "Common.15", $data );
		} else {
			return $this->get_error( 0, "App.34", $data );
		}

	}
	public

	function checkSlots( $start, $end, $slotId, $durationId = "" ) {
		$slotData = $this->slots->where( 'slots.id', $slotId )->select( '*' )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'slots.*,user.slot_duration as duration' )->get()->getRowArray();
		$Timeslots = $this->getSlots( $slotData[ 'duration' ], $slotData[ 'start_date' ], $slotData[ 'end_date' ], $start, $end );
		if ( !empty( $durationId ) ) {
			$this->timeslots->where( 'duration_id!=', $durationId );
		}
		$validSlots = array();
		$Createdslots = $this->timeslots->where( "slot_id IN (SELECT id from slots WHERE doctor = {$slotData['doctor']})" )->where( 'start_time >', time() )->select( 'start_time,end_time' )->get()->getResultArray();
		if ( !empty( $Timeslots[ 'dates' ] ) ) {
			foreach ( $Timeslots[ 'dates' ] as $DateSlots ) {
				if ( !empty( $DateSlots[ 'slots' ] ) ) {
					foreach ( $DateSlots[ 'slots' ] as $newTimeSlots ) {
						if ( !empty( $Createdslots ) ) {
							foreach ( $Createdslots as $Createdslot ) {
								if ( $this->between( $newTimeSlots[ 'timestamp' ], $Createdslot[ 'start_time' ], $Createdslot[ 'end_time' ] ) ) {
									return $this->get_error( 0, ( "App.18" ) );
								}
							}
						}
						$validSlots[] = $newTimeSlots;
					}
				} else {
					return $this->get_error( 0, ( "App.12" ) );
				}
			}
		} else {
			return $this->get_error( 0, ( "App.12" ) );
		}
		return $this->get_error( 1, ( "App.12" ), $validSlots );
	}
	public

	function createSlots( $start, $end, $slotId, $durationId ) {
		$validSlots = $this->checkSlots( $start, $end, $slotId, $durationId );
		if ( $validSlots[ 'error' ] == 1 ) {
			$validSlots = $validSlots[ 'data' ];
			for ( $i = 0; $i < count( $validSlots ); $i++ ) {
				$validSlots[ $i ][ 'start_time' ] = $validSlots[ $i ][ 'timestamp' ];
				$validSlots[ $i ][ 'end_time' ] = $validSlots[ $i ][ 'endstamp' ];
				$validSlots[ $i ][ 'slot_id' ] = $slotId;
				$validSlots[ $i ][ 'duration_id' ] = $durationId;
				unset( $validSlots[ $i ][ 'timestamp' ], $validSlots[ $i ][ 'time' ], $validSlots[ $i ][ 'endstamp' ] );
			}
			$this->timeslots->insertBatch( $validSlots );
			$this->markBreaks( $slotId );
			return $this->get_error( 1, "App.19" );
		} else {
			return $validSlots;
		}
	}
	public

	function markBreaks( $slotId, $call = "" ) {
		$breaks = $this->durations->where( 'slot_id', $slotId )->groupStart()->where( 'type', 'break' )->groupEnd()->get()->getResultArray();
		$doctor = $this->slots->where( "slots.id=$slotId" )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->get()->getRowArray();
		if ( !empty( $breaks ) ) {
			$unblock_slots[ 'status' ] = "free";
			$unblock_slots[ 'break_id' ] = null;
			$this->timeslots->where( 'start_time >', time() )->where( 'slot_id', $slotId )->where( 'status', 'invalid' )->update( $unblock_slots );
			$slotData = $this->slots->where( 'id', $slotId )->select( '*' )->get()->getRowArray();
			$startDateSimple = $this->getDateMDY( $slotData[ 'start_date' ] );
			$endDateSimple = $this->getDateMDY( $slotData[ 'end_date' ] );
			while ( strtotime( $startDateSimple ) <= ( strtotime( $endDateSimple ) + ( ( 24 * 60 * 60 ) - 1 ) ) ) {
				foreach ( $breaks as $break ) {
					$startBreak = strtotime( $startDateSimple . " " . $break[ 'start' ] );
					$endsBreak = strtotime( $startDateSimple . " " . $break[ 'end' ] );
					$this->timeslots->where( 'slot_id', $slotId )->where( 'status', 'booked' )->where( 'start_time >', time() )->groupStart()->where( "start_time BETWEEN $startBreak AND $endsBreak" );
					$informUser = $this->timeslots->select( '*' )->orWhere( "end_time BETWEEN $startBreak AND $endsBreak" )->groupEnd()->get()->getResultArray();
					if ( !empty( $informUser ) ) {
						$notification = new NotificationModel( $this->request );
						foreach ( $informUser as $user ) {
							unset( $user[ 'id' ] );
							$user[ 'duration_id' ] = null;
							$user[ 'slot_id' ] = null;
							$user[ 'status' ] = 'cancelled';
							$this->timeslots->insert( $user );
							$notification->saveNotification( $user[ 'user_id' ], lang( 'App.17', [ "doctor" => $doctor[ 'name' ], 'date' => date( 'D,M d,Y', $user[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
						}
					}
					$unblock_slots[ 'status' ] = "invalid";
					$unblock_slots[ 'user_id' ] = null;
					$unblock_slots[ 'break_id' ] = $break[ 'id' ];
					$this->timeslots->where( 'slot_id', $slotId )->where( 'start_time>', time() )->groupStart()->where( "start_time BETWEEN $startBreak AND $endsBreak" );
					$this->timeslots->orWhere( "end_time BETWEEN $startBreak AND $endsBreak" )->groupEnd()->update( $unblock_slots );
				}
				$startDateSimple = $this->getDateMDY( strtotime( $startDateSimple . '+ 1 days' ) );
			}
		} else {
			$unblock_slots[ 'status' ] = "free";
			$unblock_slots[ 'break_id' ] = null;
			$this->timeslots->where( 'start_time >', time() )->where( 'slot_id', $slotId )->where( 'status', 'invalid' )->update( $unblock_slots );
		}
		if ( $call != 'noFurtherCall' ) {
			$this->markLeave( $slotId, 'noFurtherCall' );
		}
		return $this->get_error( 1, "App.24" );
	}
	public

	function markLeave( $slotId, $call = "" ) {
		$leaves = $this->durations->where( 'slot_id', $slotId )->groupStart()->where( 'type', 'leave' )->groupEnd()->get()->getResultArray();
		$doctor = $this->slots->where( "slots.id=$slotId" )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->get()->getRowArray();
		if ( !empty( $leaves ) ) {
			$unblock_slots[ 'status' ] = "free";
			$unblock_slots[ 'leave_id' ] = null;
			$this->timeslots->where( 'start_time >', time() )->where( 'slot_id', $slotId )->where( 'status', 'onleave' )->update( $unblock_slots );
			$slotData = $this->slots->where( 'id', $slotId )->select( '*' )->get()->getRowArray();
			foreach ( $leaves as $leave ) {
				$startBreak = $leave[ 'start' ];
				$endsBreak = ( $leave[ 'end' ] + ( 24 * 60 * 60 ) - 1 );
				$this->timeslots->where( 'slot_id', $slotId )->where( 'status', 'booked' )->where( 'start_time >', time() )->groupStart()->where( "start_time BETWEEN $startBreak AND $endsBreak" );
				$informUser = $this->timeslots->select( '*' )->orWhere( "end_time BETWEEN $startBreak AND $endsBreak" )->groupEnd()->get()->getResultArray();
				if ( !empty( $informUser ) ) {
					$notification = new NotificationModel( $this->request );
					foreach ( $informUser as $user ) {
						unset( $user[ 'id' ] );
						$user[ 'duration_id' ] = null;
						$user[ 'slot_id' ] = null;
						$user[ 'status' ] = 'cancelled';
						$this->timeslots->insert( $user );
						$notification->saveNotification( $user[ 'user_id' ], lang( 'App.28', [ "doctor" => $doctor[ 'name' ], 'date' => date( 'D,M d,Y', $user[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
					}
				}
				$unblock_slots[ 'status' ] = "onleave";
				$unblock_slots[ 'user_id' ] = null;
				$unblock_slots[ 'leave_id' ] = $leave[ 'id' ];
				$this->timeslots->where( 'slot_id', $slotId )->where( 'start_time>', time() )->where( 'status!=', time() )->groupStart()->where( "start_time BETWEEN $startBreak AND $endsBreak" );
				$this->timeslots->orWhere( "end_time BETWEEN $startBreak AND $endsBreak" )->groupEnd()->update( $unblock_slots );
			}
		} else {
			$unblock_slots[ 'status' ] = "free";
			$unblock_slots[ 'leave_id' ] = null;
			$this->timeslots->where( 'start_time >', time() )->where( 'slot_id', $slotId )->where( 'status', 'onleave' )->update( $unblock_slots );
		}
		if ( $call != 'noFurtherCall' ) {
			$this->markBreaks( $slotId, 'noFurtherCall' );
		}
		return $this->get_error( 1, "App.29" );
	}
	public

	function deleteSlots( $id ) {
		$get[ 'duration_id' ] = $id;
		$doctor = $this->slots->where( "slots.id IN (SELECT slot_id FROM durations WHERE id=$id)" )->join( 'user', 'user.id = slots.doctor', 'LEFT' )->select( 'user.name' )->get()->getRowArray();
		$res = $this->timeslots->where( $get )->where( 'status', 'booked' )->select( 'user_id,start_time' )->get()->getResultArray();
		if ( !empty( $res ) ) {
			$notification = new NotificationModel( $this->request );
			foreach ( $res as $user ) {
				$notification->saveNotification( $user[ 'user_id' ], lang( 'App.17', [ "doctor" => $doctor[ 'name' ], 'date' => date( 'D,M d,Y', $user[ 'start_time' ] ) ] ), "temp", base_url( $this->get_default( 'logo' ) ), "" );
			}
		}
		$update[ 'status' ] = "cancelled";
		$this->timeslots->where( $get )->where( 'status', 'booked' )->UPDATE( $update );
		$this->timeslots->where( $get )->where( 'status', 'free' )->orWhere( 'status', 'invalid' )->delete();
	}
	public

	function getSlots( $duration, $startDate, $endDate, $startTime, $endTime ) {
		$startDateSimple = $this->getDateMDY( $startDate );
		$endDateSimple = $this->getDateMDY( $endDate );
		$date = array();
		$slots[ 'dates' ] = array();
		$durationSeconds = intval( $duration ) * 60;
		while ( strtotime( $startDateSimple ) <= ( strtotime( $endDateSimple ) + ( ( 24 * 60 * 60 ) - 1 ) ) ) {
			$stampStart = strtotime( $startDateSimple . " " . $startTime );
			$stampEnd = strtotime( $startDateSimple . " " . $endTime );
			$date[ 'day' ] = date( 'D', strtotime( $startDateSimple ) );
			$date[ 'dayCount' ] = date( 'd', strtotime( $startDateSimple ) );
			$date[ 'slots' ] = array();
			for ( $i = $stampStart; $i < $stampEnd;
				( $i += $durationSeconds ) ) {
				$date[ 'slots' ][] = array( 'time' => date( 'h:i', $i ), 'timestamp' => $i, 'endstamp' => ( $i + $durationSeconds ) );
			}
			$slots[ 'dates' ][] = $date;
			unset( $date );
			$startDateSimple = $this->getDateMDY( strtotime( $startDateSimple . '+ 1 days' ) );
		}
		return $slots;
	}
}