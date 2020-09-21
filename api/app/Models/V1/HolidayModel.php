<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ BranchModel;
class HolidayModel extends AuthenticationModel {
	protected $table = "holidays";
	protected $useTimestamps = false;
	protected $useSoftDeletes = false;
	protected $allowedFields = [ 'name', 'image' ];
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->holiday = $this->db->table( $this->table );
	}
	public

	function deleteData() {
		if ( $this->no_data( 'id' ) ) {
			$id = $this->no_data( 'id' );
			$error = 1;
			$message = "App.32";
			$data = $this->delete_row( $id, $this->table );
			$data[ 'data' ] = array( 'id' => $id );
			return $data;
		} else {
			$error = 0;
			$message = "App.33";
			return $this->get_error( $error, $message );
		}
	}
	public

	function getData( $month = '', $day = "01" ) {
		if ( !empty( $month ) ) {
			$start = strtotime( date( "$month/$day/Y" ) );
			$end = ( strtotime( date( "$month/$day/Y" ) . " +1 month +1 day" ) - 1 );
			$this->holiday->where( 'start >=', $start )->where( 'end <=', $end );
		}
		$sql_more = $this->holiday->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$this->holiday->orderBy( 'id' );
		$result = $this->holiday->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'start_raw' ] = $this->get_date_raw( $result[ $i ][ 'start' ] );
				$result[ $i ][ 'end_raw' ] = $this->get_date_raw( $result[ $i ][ 'end' ] );
				$result[ $i ][ 'start' ] = $this->get_date( $result[ $i ][ 'start' ] );
				$result[ $i ][ 'end' ] = $this->get_date( $result[ $i ][ 'end' ] );
			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
	}
	public

	function add() {
		$data[ 'start' ] = strtotime( $this->no_data( 'start' ) );
		$data[ 'end' ] = strtotime( $this->no_data( 'end' ) ) + ( ( 24 * 60 * 60 ) - 1 );
		if ( strtotime( $data[ "start" ] ) > strtotime( $data[ 'end' ] ) ) {
			return $this->get_error( 0, "App.11" );
		}
		$id = $this->no_data( 'id' );
		if ( !empty( $id ) ) {
			$error = 1;
			$message = "App.30";
			$this->holiday->where( 'id', $id )->update( $data );
		} else {
			$error = 1;
			$message = "App.31";
			$res = $this->holiday->where( $data )->get()->getRowArray();
			if ( empty( $res ) ) {
				$this->holiday->insert( $data );
				$id = $this->db->insertId();
			} else {
				return $this->get_error( 0, "App.20" );
			}
		}
		return $this->get_error( $error, $message );
	}
}