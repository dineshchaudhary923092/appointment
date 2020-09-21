<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
class NotificationModel extends AuthenticationModel {
	protected $notify = "";
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->notify = $this->db->table( 'notification' );
		$this->get_details();
	}
	public

	function getNotification() {
		$user = $this->user_data;
		$this->notify->select( '*' );
		$this->notify->where( 'to_user', $user[ 'id' ] );
		$this->notify->where( 'type!=', 'temp' );
		if ( $this->no_data( 'search' ) != "" ) {
			$search = $this->no_data( 'search' );
			$this->notify->where( 'heading LIKE "%' . $search . '%"' );
		}
		$sql_more = $this->notify->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' );
		$limit = $this->no_data( 'limit' ) == "" ? 25 : intval( $this->no_data( 'limit' ) );
		$this->notify->order_by( 'id' )->limit( ( intval( $offset ) * $limit ), $limit );
		$result = $this->notify->get()->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			$ids = [];
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$ids . push( $result[ $i ][ 'id' ] );
				$result[ $i ][ 'id' ] = $this->encrypt( $result[ $i ][ 'id' ] );
				$result[ $i ][ 'type_id' ] = !empty( $result[ $i ][ 'type_id' ] ) ? $this->encrypt( $result[ $i ][ 'type_id' ] ) : "";
			}
			$this->notify->whereIn( 'id', $ids )->update( array( 'seen' => 'y' ) );
		}
		return $this->get_json( 1, "Common.15", $result, $more );
	}

	public

	function sendnotification() {
		$data = $this->notify->where( 'push', 'n' )->join( 'firebase', 'firebase.user_id = user.id', 'LEFT' )->get()->getRowArray();
		if ( !empty( $data ) ) {
			if ( !empty( $data[ 'firebase' ] ) ) {
				$msg = $data[ 'heading' ];
				$title = "Appointment update";
				$img = $data[ 'image' ];
				$content = array(
					"en" => $msg
				);
				$headings = array(
					"en" => $title
				);
				if ( $img == '' ) {
					$fields = array(
						'app_id' => getenv( 'PUSH_AUTH_KEY' ),
						"headings" => $headings,
						'include_player_ids' => array( $to ),
						'large_icon' => base_url( 'assets/images/logo.png' ),
						'content_available' => true,
						'contents' => $content
					);
				} else {
					$ios_img = array(
						"id1" => base_url( $img )
					);
					$fields = array(
						'app_id' => getenv( 'PUSH_AUTH_KEY' ),
						"headings" => $headings,
						'include_player_ids' => array( $to ),
						'contents' => $content,
						"big_picture" => base_url( $img ),
						'large_icon' => base_url( 'assets/images/logo.png' ),
						'content_available' => true,
						"ios_attachments" => $ios_img
					);

				}
				$headers = array(
					'Authorization: key=' . getenv( 'PUSH_APP_KEY' ),
					'Content-Type: application/json; charset=utf-8'
				);
				$ch = curl_init();
				curl_setopt( $ch, CURLOPT_URL, 'https://onesignal.com/api/v1/notifications' );
				curl_setopt( $ch, CURLOPT_POST, true );
				curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
				curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
				curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );
				$result = curl_exec( $ch );
				curl_close( $ch );
			}
			$this->notify->where( 'id',$data['id']  );
			if($data['type']=="temp"){
			$this->notify->delete();	
			}else{
			$this->notify->update(array('push'=>'n'));	
			}
		}
	}
	public

	function saveNotification( $to, $heading, $type = "info", $image = "assets/images/logo.png", $id = "" ) {
		$user = $this->user_data;
		$data[ 'from_user' ] = $user[ 'id' ];
		$data[ 'to_user' ] = $to;
		$data[ 'heading' ] = $heading;
		$data[ 'type' ] = $type;
		$data[ 'image' ] = $image;
		$data[ 'timestamp' ] = time();
		$data[ 'type_id' ] = "";
		$this->notify->insert( $data );
		return $this->db->insertId();
	}
}