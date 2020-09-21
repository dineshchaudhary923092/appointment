<?php
namespace App\ Models\ V1;
use CodeIgniter\ Model;
class CommonModel extends Model {
	public $user_data;
	protected $request;
	public $AES_METHOD = 'aes-256-cbc';
	public $iv;
	public $password;
	protected $checkEmail = "";
	protected $checkImage = "";
	public
	function __construct( $requestInstace ) {
		parent::__construct();
		$this->builder = $this->db->table( 'user' );
		$this->login = $this->db->table( 'login' );
		$this->checkEmail = [ 'label' => lang( 'Headings.0' ), 'rules' => 'valid_email|is_unique[user.email,email,0]', 'errors' => [ 'valid_email' => lang( 'Common.35' ), 'is_unique' => lang( 'Common.11' ) ] ];
		$this->checkImage = [ 'label' => lang( 'Headings.4' ), 'rules' => 'uploaded[file]|max_size[file,10240]|is_image[file]', 'errors' => [ 'uploaded' => 'Please select a file to upload', 'max_size' => 'Image should be less than 10MB', 'is_image' => 'Please provide a valid image file' ] ];
		$this->iv = getenv( 'encryption_iv' );
		$this->password = getenv( 'encryption_key' );
		$this->request = $requestInstace;
		//		$this->db->query( "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));" );
		helper( 'cookie' );
	}
	public
	function between( $value, $start, $end ) {
		return ( $value >= $start && $value < $end );
	}

	public
	function get_default( $type ) {
		return "assets/images/$type.png";
	}
	public

	function get_options() {
		return json_encode( $this->db->table( 'options' )->get()->getResult( "array" ) );
	}
	public
	function get_name( $str ) {
		return substr( $str, 0, strpos( $str, " " ) );
	}
	public
	function delete_row( $id, $table ) {
		$res = $this->db->table( $table )->getWhere( [ 'id' => $id ], 1 )->getRowArray();
		if ( !empty( $res[ 'image' ] ) && $res[ 'image' ] != $this->get_default( 'user' ) ) {
			$this->delete_file( $res[ 'image' ] );
		}
		$this->db->table( $table )->where( 'id', $id )->delete();
		return $this->get_error( 1, "Common.47",array('id'=>$id));
	}
	public

	function sendmail( $template = "", $data, $mail = "" ) {
		$data[ 'color_background' ] = getenv( 'color_background' );
		$data[ 'color_text' ] = getenv( 'color_text' );
		$data[ 'app_name' ] = getenv( 'app_name' );
		$EmailModel = new\ App\ Models\ V1\ EmailModel( $this->request );
		return $EmailModel->sendmail( $template, $data, $mail );
	}
	public

	function upload_file( $field = "file", $type = "", $folder = "" ) {
		$DropboxModel = new\ App\ Models\ V1\ DropboxModel( $this->request );
		return $DropboxModel->upload_file( $field, $type, $folder );
	}
	public

	function delete_file( $path ) {
		$DropboxModel = new\ App\ Models\ V1\ DropboxModel( $this->request );
		return $DropboxModel->delete_file_system( $path );
	}
	public

	function get_hash( $data ) {
		return hash( 'sha256', $data );
	}
	public

	function get_username( $name, $id ) {
		return preg_replace( '/-+/', '-', preg_replace( "![^a-z0-9]+!i", "-", $name ) ) . "-" . $id;
	}
	public

	function get_date( $timestamp ) {
		return date( 'M d, Y', $timestamp );
	}
	public

	function getDateMDY( $timestamp ) {
		return date( 'm/d/y', $timestamp );
	}
	public

	function get_date_raw( $timestamp ) {
		return date( 'D,d M Y H:i', $timestamp );
	}
	public function ampm($time){
		return(date("h:i A",strtotime($this->getdateMDY(time())." ".$time)));
	}
	public function ampmto24($time){
		return(date("G:i",strtotime($this->getdateMDY(time())." ".$time)));
	}
	public

	function get_random( $length, $type = "" ) {
		$characters = $type != "otp" ? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' : "0123456789";
		$charactersLength = strlen( $characters );
		$randomString = '';
		for ( $i = 0; $i < $length; $i++ ) {
			$randomString .= $characters[ rand( 0, $charactersLength - 1 ) ];
		}
		return $randomString;
	}
	public

	function decrypt( $ciphered ) {
		try {
			$iv = substr( hash( 'sha256', $this->iv ), 0, 16 );
			$ciphertext = hex2bin( $ciphered );
			$data = openssl_decrypt( $ciphertext, $this->AES_METHOD, substr( hash( 'sha256', $this->password ), 0, 32 ), OPENSSL_RAW_DATA, $iv );
			return $data;
		} catch ( Exception $e ) {
			return "";
		}
	}
	public

	function encrypt( $message ) {
		try {
			$iv = substr( hash( 'sha256', $this->iv ), 0, 16 );
			$ciphertext = openssl_encrypt( $message, $this->AES_METHOD, substr( hash( 'sha256', $this->password ), 0, 32 ), OPENSSL_RAW_DATA, $iv );
			$ciphertext_hex = bin2hex( $ciphertext );
			$iv_hex = bin2hex( $iv );
			return "$ciphertext_hex";
		} catch ( Exception $e ) {
			return "";
		}
	}
	public

	function get_error( $error, $msg, $data = "", $more = "" ) {
		return array( "error" => $error, "msg" => ( !empty( lang( "$msg" ) ) ? lang( "$msg" ) : "" ), "data" => ( !empty( $data ) ? $data : array() ), "more" => ( !empty( $more ) ? $more : "" ), "token" => ( !empty( $this->user_data[ 'token' ] ) ? $this->user_data[ 'token' ] : "" ) );
	}
	public

	function get_first_error( $code = 0, $array ) {
		if ( !empty( $array ) ) {
			foreach ( $array as $key => $value ) {
				return $this->get_error_msg( $code, $value );
			}
		}
		return "";
	}
	public

	function get_error_msg( $error, $msg, $data = "", $more = "" ) {
		return ( array( "error" => $error, "msg" => $msg, "data" => ( !empty( $data ) ? $data : array() ), "more" => ( !empty( $more ) ? $more : "" ), "token" => ( !empty( $this->user_data[ 'token' ] ) ? $this->user_data[ 'token' ] : "" ) ) );
	}
	public
	function validate_data( $rules, $msg = array() ) {
		$validation = \Config\ Services::validation();
		$validation->setRules( $rules, $msg );
		$validation->withRequest( $this->request )->run();
		$error = $this->get_first_error( 0, $validation->getErrors() );
		if ( !empty( $error ) ) {
			return $error;
		}
		return array( 'error' => 1 );
	}
	public

	function get_json( $error, $msg, $data = "", $more = "" ) {
		return json_encode( array( "error" => $error, "msg" => ( !empty( lang( "$msg" ) ) ? lang( "$msg" ) : "" ), "data" => ( !empty( $data ) ? $data : array() ), "more" => ( !empty( $more ) ? $more : "" ), "token" => ( !empty( $this->user_data[ 'token' ] ) ? $this->user_data[ 'token' ] : "" ) ) );
	}
	public

	function get_hms( $sec ) {
		$return = gmdate( "H,i,s", ( int )$sec );
		$return = explode( ',', $return );
		$str = "";
		$str .= !empty( $return[ 0 ] ) && $return[ 0 ] != 0 ? $return[ 0 ] . "h, ": "";
		$str .= !empty( $return[ 1 ] ) && $return[ 1 ] != 0 ? $return[ 1 ] . "m, ": "";
		$str .= !empty( $return[ 2 ] ) ? $return[ 2 ] . "s": "";
		//	echo $str;die;	
		return $str;
	}
	public

	function get_payment_status( $str ) {
		switch ( $str ) {
			case "pending":
				return "Pending";
			case "payment_done":
				return "Paid";
			case "payment_failed":
				return "Failed";
			case "order_delivered":
				return "Delivered";
			case "order_delivered":
				return "Delivered";
			case "order_returned":
				return "Delivered";
			default:
				return "NA";
		}
	}
	public

	function update_stats( $option, $sign, $id ) {
		$this->db->query( "UPDATE options SET `value` = `value` $sign $id  WHERE key_data='$option' " );
	}
	public

	function get_option( $key = "" ) {
		if ( !empty( $key ) ) {
			$res = $this->db->where( 'key_data', $key )->get( 'options' )->row_array();
			return isset( $res[ 'value' ] ) ? $res[ 'value' ] : "";
		} else {
			return $this->db->get( 'options' )->result_array();
		}
	}
	public

	function calculate_time_span( $post ) {
		$seconds = time() - $post;
		$year = floor( $seconds / 31556926 );
		$months = floor( $seconds / 2629743 );
		$week = floor( $seconds / 604800 );
		$day = floor( $seconds / 86400 );
		$hours = floor( $seconds / 3600 );
		$mins = floor( ( $seconds - ( $hours * 3600 ) ) / 60 );
		$secs = floor( $seconds % 60 );
		if ( $seconds < 60 )$time = $secs . " seconds ago";
		else if ( $seconds < 3600 )$time = ( $mins == 1 ) ? "Just now" : $mins . " mins ago";
		else if ( $seconds < 86400 )$time = ( $hours == 1 ) ? $hours . " hour ago": $hours . " hours ago";
		else if ( $seconds < 604800 )$time = ( $day == 1 ) ? $day . " day ago": $day . " days ago";
		else if ( $seconds < 2629743 )$time = ( $week == 1 ) ? $week . " week ago": $week . " weeks ago";
		else if ( $seconds < 31556926 )$time = ( $months == 1 ) ? $months . " month ago": $months . " months ago";
		else $time = ( $year == 1 ) ? $year . " year ago": $year . " years ago";
		return $time;
	}
	public

	function set_option( $key, $value ) {
		$this->db->query( "INSERT INTO options(key_data,value) VALUES ('$key','$value') ON DUPLICATE KEY UPDATE key_data = VALUES(key_data),value=VALUES(value) " );
		return $value;
	}
	public

	function unset_post() {
		foreach ( $_POST as $key => $value ) {
			unset( $_POST[ $key ] );
		}
	}
	public

	function go_to( $key = "" ) {
		redirect( base_url( $key ) );
	}
	public

	function replace_image( $string ) {
		return preg_replace( '/(https?:\/\/[^ ]+?(?:\.jpg|\.png|\.gif|\.jpeg))/', '<img src="$1" alt="$1" />', $string );
	}
	public

	function insert_subscriber( $data ) {
		if ( !empty( $data[ 'email' ] ) ) {
			$res = $this->subscribers->select( 'id' )->from( 'subscribers' )->where( 'email', $data[ 'email' ] )->get()->row_array();
			if ( empty( $res ) ) {
				$this->db->insert( 'subscribers', $data );
			}
		}
	}
	public

	function set_cookie( $name, $value, $time = "" ) {
		if ( $time != 0 ) {
			set_cookie( $name, $value, $time );
		} else {
			set_cookie( $name, $value, 0 );
		}
		return true;
	}
	public

	function get_cookie( $name ) {
		$this->request->getCookie( $name );
	}
	public

	function contact_us() {
		if ( $this->no_data( 'email' ) != "" && $this->no_data( 'name' ) != "" ) {
			$data_insert[ 'email' ] = $data[ 'email' ] = $this->no_data( 'email' );
			$data_insert[ 'name' ] = $data[ 'name' ] = $this->no_data( 'name' );
			if ( $this->no_data( 'phone' ) ) {
				$data_insert[ 'phone' ] = $data[ 'phone' ] = $this->no_data( 'phone' );
			}
			if ( $this->no_data( 'message' ) != "" ) {
				$data[ 'Message' ] = $this->no_data( 'message' );
			}
			$message = "";
			foreach ( $data as $key => $value ) {
				$message .= ucfirst( $key ) . " :- $value <br>";
			}
			$data[ 'email' ] = $this->no_data( 'email' );
			$data[ 'message' ] = $message;
			$data[ 'subject' ] = " Received a query from " . $data[ 'name' ];

			if ( $this->sendmail( '', $data ) ) {
				$data[ 'token' ] = uniqid( "TOcken" );
				$this->session->set_userdata( 'token', $data[ 'token' ] );
				return $this->get_error( 1, "Common.0" );
			} else {
				return $this->get_error( 0, "Common.1" );
			}
		} else {
			return $this->get_error( 0, "Common.2" );
		}
	}
	public

	function no_data( $key, $type = 'post' ) {
		if ( $type = "post" ) {
			$data = $this->request->getPost( $key );
		} elseif ( $type = "get" ) {
			$data = $this->getGet( $key );
		}
		elseif ( $type = "both" ) {
			$data = $this->request->getVar( $key );
		}
		elseif ( $type = "none" ) {
			$data = $key;
		}
		return !empty( $data ) || !is_null( $data ) ? $data : false;
	}
	public

	function subscribe_us() {
		//		if($this->session->token==$this->no_data('token')){
		if ( $this->no_data( 'email' ) != "" ) {
			$data_insert[ 'email' ] = $data[ 'email' ] = $this->no_data( 'email' );
			if ( $this->insert_subscriber( $data_insert ) ) {
				$data[ 'token' ] = uniqid( "TOcken" );
				$this->session->set_userdata( 'token', $data[ 'token' ] );
				return $this->get_error( 1, "Common.4" );
			} else {
				return $this->get_error( 0, "Common.1" );
			}
		} else {
			return $this->get_error( 0, "Common.2" );
		}
	}
	public

	function apply_coupon() {
		$amount = $this->no_data( 'amount' );
		$coupon = $this->no_data( 'coupon' ) != "" ? $this->no_data( 'coupon' ) : $this->no_data( 'discount' );
		if ( $this->no_data( 'discount_type' ) == "discount" ) {
			$return[ 'applied_amount' ] = $amount - $coupon;
			$return[ 'discount_amount' ] = $coupon;
			$return[ 'msg' ] = "Discount applied";
			$return[ 'promo' ] = $coupon . " %";
			$return[ 'total' ] = $amount;
			$return[ 'error' ] = 1;
			return $return;
		} else {
			if ( !empty( $amount ) && !empty( $coupon ) ) {
				$res = $this->db->where( 'code', $coupon )->where( 'expiry >', time() )->get( 'promo' )->row_array();
				if ( !empty( $res[ 'code' ] ) ) {
					if ( $res[ 'type' ] == "flat" ) {
						if ( $res[ 'discount' ] > $amount ) {
							return $this->get_error( 0, "Common.77" );
						}
						$return[ 'applied_amount' ] = $amount - $res[ 'discount' ];
						$return[ 'discount_amount' ] = $res[ 'discount' ];
						$return[ 'promo' ] = $res[ 'code' ];
						$return[ 'msg' ] = "Discount applied";
						$return[ 'total' ] = $amount;
						$return[ 'error' ] = 1;
					} else {
						$return[ 'discount_amount' ] = intval( $amount * ( $res[ 'discount' ] / 100 ), 2 );
						$return[ 'applied_amount' ] = $amount - $return[ 'discount_amount' ];
						$return[ 'promo' ] = $res[ 'code' ];
						$return[ 'msg' ] = "Discount applied";
						$return[ 'total' ] = $amount;
						$return[ 'error' ] = 1;
					}
					return $return;
				} else {
					return $this->get_error( 0, "Common.77" );
				}
			} else {
				return $this->get_error( 0, "Common.2" );
			}
		}
	}
}
?>