<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ CommonModel;
class AuthenticationModel extends CommonModel {
	protected $table = "";
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
	}
	public

	function update_password() {
		if ( $this->no_data( 'password' ) && $this->no_data( 'secret_key' ) ) {
			$user = $this->get_details();
			if ( $user[ 'error' ] != 1 ) {
				return $this->get_json( 5, "Common.5" );
			}
			$user = $user[ 'data' ];
			if ( $this->no_data( 'old_password' ) && !empty( $user[ 'password' ] ) ) {
				if ( $this->no_data( 'old_password' ) != $this->decrypt( $user[ 'password' ] ) ) {
					return $this->get_json( 0, "Common.42", $this->decrypt( $user[ 'password' ] ) );
				}
			}
			if ( $this->no_data( 'password' ) == $this->decrypt( $user[ 'password' ] ) ) {
				return $this->get_json( 0, "Common.40" );
			}
			$id = $this->no_data( 'secret_key' );
			$data[ 'password' ] = $this->encrypt( $this->no_data( 'password' ) );
			$data[ 'token' ] = $this->get_hash( time() . $this->no_data( 'password' ) );
			$this->builder->where( 'id', $user[ 'id' ] )->update( $data );
			$this->login->where( 'user_id', $user[ 'id' ] )->delete();
			unset( $this->user_data[ 'token' ] );
			return $this->get_json( 1, "Common.14" );
		} else {
			return $this->get_json( 0, "Common.2" );
		}
	}
	public

	function update_password_otp() {
		if ( $this->no_data( 'password' ) && $this->verify_otp( 'reset' ) ) {
			$id = $this->no_data( 'secret_key' );
			$user = $this->decrypt( $id );
			$data[ 'token' ] = $this->get_hash( time() . $this->no_data( 'password' ) );
			$data[ 'password' ] = $this->encrypt( $this->no_data( 'password' ) );
			$this->builder->where( 'id', $user )->update( $data );
			$this->login->where( 'user_id', $user )->delete();
			unset( $this->user_data[ 'token' ] );
			return $this->get_json( 1, "Common.14" );
		} else {
			return $this->get_json( 0, "Common.2" );
		}
	}
	public

	function get_client_ip() {
		$ipaddress = '';
		if ( getenv( 'HTTP_CLIENT_IP' ) )
			$ipaddress = getenv( 'HTTP_CLIENT_IP' );
		else if ( getenv( 'HTTP_X_FORWARDED_FOR' ) )
			$ipaddress = getenv( 'HTTP_X_FORWARDED_FOR' );
		else if ( getenv( 'HTTP_X_FORWARDED' ) )
			$ipaddress = getenv( 'HTTP_X_FORWARDED' );
		else if ( getenv( 'HTTP_FORWARDED_FOR' ) )
			$ipaddress = getenv( 'HTTP_FORWARDED_FOR' );
		else if ( getenv( 'HTTP_FORWARDED' ) )
			$ipaddress = getenv( 'HTTP_FORWARDED' );
		else if ( getenv( 'REMOTE_ADDR' ) )
			$ipaddress = getenv( 'REMOTE_ADDR' );
		else
			$ipaddress = 'UNKNOWN';
		return $ipaddress;
	}
	public

	function update_status( $status ) {
		$data = $this->get_details();
		if ( !empty( $data[ 'data' ][ 'id' ] ) ) {
			$id = $data[ 'data' ][ 'id' ];
			$data_update[ 'login' ] = $status;
			$data_update[ 'last_updated' ] = time();
			$this->builder->where( 'id', $id )->update( $data_update );
		}
	}
	public

	function logout() {
		//		$this->update_status( 'offline' );
		$this->login->where( 'login_id', $this->decrypt( $this->get_cookie( 'token' ) ) )->delete();
		$this->set_cookie( 'token', "" );
		return array( 'error' => 1 );
	}
	public

	function contact_sync() {
		$this->get_details();
		$user_data = $this->user_data;
		if ( $this->no_data( 'list' ) ) {
			$list = $this->no_data( 'list' );
			$this->builder->select( 'name,email,callingcode,phone,buddies.status' );
			$this->builder->join( "buddies", "to_user=user.id AND from_user ={$user_data['id']}", 'LEFT' );
			$contact = json_decode( $list );
			foreach ( $contact[ 'data' ] as $user ) {
				$email = "";
				$this->builder->orGroupStart();
				$this->builder->groupStart();
				foreach ( $user[ 'emailAddresses' ] as $emails ) {
					$this->builder->orWhere( 'email', $emails[ 'email' ] );
				}
				$this->builder->groupEnd();
				$phone = "";
				$this->builder->orGroupStart();
				foreach ( $user[ 'phoneNumbers' ] as $phone ) {
					$phone[ 'number' ] = preg_replace( '/[^0-9]/', '', $phone[ 'number' ] );
					$this->builder->orWhere( 'phone', $phone[ 'number' ] );
					$this->builder->orWhere( 'CONCAT(callingcode,phone)', $phone[ 'number' ] );
				}
				$this->builder->groupEnd();
				$this->builder->groupEnd();
			}
			$res = $this->builder->get()->getResult( 'array' );
			$new_list = array();
			foreach ( $contact[ 'data' ] as $user ) {
				for ( $i = 0; $i < count( $res ); $i++ ) {
					$flag = false;
					foreach ( $user[ 'emailAddresses' ] as $emails ) {
						if ( $emails[ 'email' ] == $res[ $i ][ 'email' ] ) {
							$flag = true;
						}
					}
					foreach ( $user[ 'phoneNumbers' ] as $phone ) {
						$phone[ 'number' ] = preg_replace( '/[^0-9]/', '', $phone[ 'number' ] );
						if ( $phone[ 'phone' ] == $res[ $i ][ 'phone' ] || $phone[ 'phone' ] == $res[ $i ][ 'phone' ] ) {
							$flag = true;
						}
					}
					if ( $flag ) {
						$selected[] = array( 'name' => $this->get_contact_name( $user ), 'phone' => "+" . $res[ $i ][ 'callingcode' ] . $res[ $i ][ 'phone' ], "id" => $this->encrypt( $res[ $i ][ 'id' ] ), "image" => base_url( $res[ $i ][ 'image' ] ), "btn_heading" => ( $res[ $i ][ 'status' ] == "pending" ? "Requested" : ( $res[ $i ][ 'status' ] == "accepted" ? "Sharing" : ( $res[ $i ][ 'status' ] == "blocked" ? "Blocked" : "Request" ) ) ), 'status' => $res[ $i ][ 'status' ] );
					}
				}
			}
			if ( !empty( $selected ) ) {
				return $this->get_json( 1, "Common.15", $selected );
			} else {
				return $this->get_json( 1, "Common.41" );
			}
		} else {
			return $this->get_json( 0, 'Common.2' );
		}
	}

	function get_contact_name( $array ) {
		return $array[ 'givenName' ] . ( !empty( $array[ 'middleName' ] ) ? " " . $array[ 'middleName' ] : "" ) . ( !empty( $array[ 'familyName' ] ) ? " " . $array[ 'familyName' ] : "" );
	}
	public

	function get_details() {
		if ( $this->no_data( 'token' ) || !empty( $this->get_cookie( 'token' ) ) ) {
			$token = $this->no_data( 'token' ) ? $this->no_data( 'token' ) : $this->get_cookie( 'token' );
			if ( ( empty( $this->user_data[ 'id' ] ) && empty( $this->request->userdata[ 'id' ] ) ) && !empty( $token ) ) {
				$sql = "SELECT user.*,login.ip,login.login_token FROM user,login WHERE login.user_id=user.id AND login.login_token='" . $token . "'";
				$this->user_data = $this->db->query( $sql )->getRowArray();
				if ( empty( $this->user_data[ 'id' ] ) ) {
					return $this->get_error( 5, "Common.5", array( 'error_code' => 5 ) );
				}
				$this->user_data[ 'id_enc' ] = $this->encrypt( $this->user_data[ 'id' ] );
				$this->user_data[ 'token' ] = $token;
				if ( empty( $this->user_data[ 'image' ] ) ) {
					$this->user_data[ 'image' ] = $this->get_default( 'user' );
				} else {
					$this->user_data[ 'image' ] = $this->user_data[ 'image' ];
				}
				if ( $this->user_data[ 'status' ] == "B" ) {
					return $this->get_error( 5, "Common.5", array( 'error_code' => 66 ) );
				}

				$user_data = $this->user_data;
				return $this->get_error( 1, "Common.8", $this->user_data );
			} elseif ( !empty( $this->request->userdata[ 'login_token' ] ) ) {
				$this->user_data = $this->request->userdata;
				$user_data = $this->user_data;
				//				$this->user_data[ 'login_token' ] = $this->user_data[ 'token' ] = $this->do_login( $user_data, "update" );
				return $this->get_error( 1, "Common.8", $this->user_data );
			} elseif ( $this->user_data[ 'login_id' ] == $token ) {
				$user_data = $this->user_data;
				//				$this->user_data[ 'login_token' ] = $this->user_data[ 'token' ] = $this->do_login( $user_data, "update" );
				return $this->get_error( 1, "Common.8", $this->user_data );
			}
			else {
				return $this->get_error( 5, "Common.5", array( 'error_code' => 5 ) );
			}
		} else {
			return $this->get_error( 5, "Common.5", array( 'error_code' => 5 ) );
		}
	}
	public

	function refreshToken() {
		$user = $this->get_details();
		if ( $user[ 'error' ] == 1 ) {
			$user_data = $this->user_data;
			$this->user_data[ 'login_token' ] = $this->user_data[ 'token' ] = $this->do_login( $user_data, "update" );
			return $this->get_json( 1, "Common.8", $this->user_data );
		} else {
			return json_encode( $user );
		}
	}
	public

	function redirect_uri() {
		return ""; /*DEFINE*/
	}
	public

	function is_user() {
		$data = $this->get_details();
		$data = $data[ 'data' ];
		if ( !empty( $data[ 'type' ] ) ) {
			if ( $data[ 'type' ] == "U" ) {
				return true;

			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	public

	function verify_route( $type ) {
		$data = $this->get_details();
		if ( $data[ 'error' ] == 5 || ( !empty( $data[ 'status' ] ) && $data[ 'status' ] == "B" ) ) {
			$this->logout();
			if ( $this->no_data( 'app' ) ) {
				return json_encode( $data );
				die;
			} else {
				redirect( base_url( 'login?redirect=' . base_url( $_SERVER[ ' REQUEST_URI' ] ) . "& error_cd=" . $data[ 'error_code' ] ) );
			}
		} else {
			$type = explode( ',', $type );
			$flag = false;
			foreach ( $type as $types ) {
				$flag = $types == $data[ 'data' ][ 'type' ] ? "true" : $flag;
			}
			if ( $flag ) {
				//				$this->update_status( 'online' );
				return true;
			} else {
				if ( $this->no_data( 'app' ) ) {
					die( $this->get_json( 0, "Common.6" ) );
				} else {
					redirect( base_url( 'access-denied?' . $this->redirect_uri() ) );
				}
			}
		}
	}
	public

	function get_type( $res ) {
		switch ( $res ) {
			case "D":
				return "doctor";
				break;
			case "U":
				return "user";
				break;
			case "SA":
				return "admin";
				break;
			case "A":
				return "admin";
				break;
			case "R":
				return "receptionist";
				break;
			default:
				return "user";
		}
	}
	public

	function update_dp() {
		$this->get_details();
		$rules = [ 'file' => $this->checkImage ];
		$valid = $this->validate_data( $rules );
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		$user_account = $user = $this->user_data;
		$id = $user[ 'id' ];
		$res = $this->upload_file( 'file', "", "user/" );
		if ( $res[ 'error' ] == 1 ) {
			if ( !empty( $user_account[ 'image' ] ) && @file_exists( $user_account[ 'image' ] ) && $user_account[ 'image' ] != "/assets/images/user.png" ) {
				$this->delete_file( $user_account[ 'image' ] );
			}
			$this->user_data[ 'image' ] = $data[ 'image' ] = $res[ 'msg' ];
			$this->builder->where( 'id', $id )->update( $data );
			return $this->get_json( 1, "Common.39", array( "user" => $data ) );
		} else {
			return json_encode( $res );
		}
	}
	public

	function update_user_data() {
		$this->get_details();
		$user = $this->user_data;
		$rules = [ 'otp' => [ 'label' => lang( 'Headings.2' ), 'rules' => 'required|is_natural' ], 'phone' => [ 'label' => lang( 'Headings.1' ), 'rules' => 'required|is_unique[user.phone,id,' . $user[ 'id' ] . ']' ], 'country' => 'required', 'callingcode' => [ 'label' => 'Calling code', 'rules' => 'required' ] ];
		if ( $this->no_data( 'email' ) ) {
			$this->checkEmail[ 'rules' ] = 'valid_email|is_unique[user.email,id,' . $user[ 'id' ] . ']';
			$rules[ 'email' ] = $this->checkEmail;
		}
		if ( $this->no_data( 'phone' ) && $this->no_data( 'phone' ) != $this->user_data[ 'phone' ] ) {
			$valid = $this->validate_data( $rules, [ 'otp' => [ 'required' => lang( 'Common.38' ), 'is_natural' => lang( 'Common.12' ) ], 'phone' => [ 'required' => lang( 'Common.37' ), 'is_unique' => lang( 'Common.11' ) ], 'country' => [ 'required' => lang( 'Common.38' ) ] ] );
			if ( $valid[ 'error' ] == 0 ) {
				return json_encode( $valid );
			}
		}
		$change_email = false;
		if ( !empty( $user[ 'id' ] ) ) {
			if ( $this->no_data( 'name' ) ) {
				$this->user_data[ 'name' ] = $data[ 'name' ] = $this->no_data( 'name' );
				if ( ( $this->no_data( 'email' ) && $this->verify_otp( 'profile' ) ) || $this->no_data( 'email' ) == $this->user_data[ 'email' ] ) {
					$this->user_data[ 'email' ] = $data[ 'email' ] = $this->no_data( 'email' );
					if ( $data[ 'email' ] != $this->user_data[ 'email' ] ) {
						$change_email = true;
					}
				} elseif ( !$this->verify_otp( 'profile' ) ) {
					return $this->get_json( 0, "Common.12" );
				}
				if ( $this->no_data( 'phone' ) && $this->no_data( 'phone' ) != $this->user_data[ 'phone' ] ) {
					if ( $this->verify_otp( 'profile' ) ) {
						$this->user_data[ 'country' ] = $data[ 'country' ] = $this->no_data( 'country' );
						$this->user_data[ 'callingcode' ] = $data[ 'callingcode' ] = $this->no_data( 'callingcode' );
						$this->user_data[ 'phone' ] = $data[ 'phone' ] = $this->no_data( 'phone' );
					} else {
						return $this->get_json( 0, "Common.12" );
					}
				}

				$id = $user[ 'id' ];
				if ( !empty( $data[ 'email' ] ) ) {
					$this->builder->Where( 'email', $data[ 'email' ] );
				} else {
					$this->builder->where( 'phone', $data[ 'phone' ] );
				}
				$res = $this->builder->where( 'id!=', $id )->get()->getRowArray();
				if ( !empty( $res[ 'id' ] ) ) {
					return json_encode( $this->get_error_msg( 0, str_replace( '{field}', lang( 'Headings.0' ) . '/' . lang( 'Headings.1' ), lang( 'Common.11' ) ) ) );
				}
				$this->builder->where( 'id', $id )->update( $data );
				if ( $change_email ) {
					$send_mail[ 'receiver' ] = $user[ 'id' ];
					$send_mail[ 'type' ] = 1;
					$send_mail[ 'campaign_id' ] = '1';
					$this->db->table( 'send_mail' )->insert( $send_mail );
				}
				$user = $this->user_data;
				$user[ 'id' ] = $this->encrypt( $user[ 'id' ] );
				unset( $user[ 'password' ], $user[ 'login_id' ], $user[ 'status' ], $user[ 'type' ], $user[ 'status_phone' ] );
				return $this->get_json( 1, "Common.39", array( "user" => $user ) );
			} else {
				return $this->get_json( 0, "Common.2" );
			}
		} else {
			return $this->get_json( 5, "Common.6" );
		}
	}
	public

	function do_login( $res, $type = "create" ) {
		if ( $type == "create" ) {
			$logindata[ 'ip' ] = $this->get_client_ip();
			$logindata[ 'useragent' ] = $_SERVER[ 'HTTP_USER_AGENT' ];
			$logindata[ 'user_id' ] = $res[ 'id' ];
			$res_login = $this->login->where( $logindata )->get()->getRowArray();
			$logindata[ 'timestamp' ] = microtime();
			$logindata[ 'expiry' ] = $this->no_data( 'remember' ) ? strtotime( '+1 month' ) : 0;
			$res[ 'token_data' ] = $res[ 'token' ];
			if ( empty( $res_login ) ) {
				$res[ 'token' ] = $logindata[ 'login_token' ] = $this->encrypt( $logindata[ 'user_id' ] . $logindata[ 'useragent' ] . $logindata[ 'ip' ] . microtime( true ) * 10000 );
				$this->login->insert( $logindata );
				$res[ 'login_id' ] = $this->db->insertId();
			} else {
				$res[ 'token' ] = $logindata[ 'login_token' ] = $this->encrypt( $logindata[ 'user_id' ] . $logindata[ 'useragent' ] . $logindata[ 'ip' ] . microtime( true ) * 10000 );
				$this->login->update( $logindata );
				$res[ 'login_id' ] = $res_login[ 'login_id' ];
			}
			$this->user_data = $res;
			if ( $this->request->getPost( 'app' ) != "xhr" ) {
				$this->set_cookie( 'token', $logindata[ 'login_token' ], ( $this->no_data( 'remember' ) ? ( strtotime( '+1 month' ) - time() ) : 0 ) );
			}
			$user = $this->user_data;
			$user[ 'id' ] = $this->encrypt( $user[ 'id' ] );
			unset( $user[ 'password' ], $user[ 'login_id' ], $user[ 'status' ], $user[ 'status_phone' ] );
			return $this->get_json( 1, "Common.8", array( "user" => $user, "goto" => $this->get_type( $res[ 'type' ] ) ) );
		} else {
			$res_get = $this->login->where( 'login_token', $res[ 'login_token' ] )->get()->getRowArray();
			$logindata[ 'ip' ] = $this->get_client_ip();
			$logindata[ 'useragent' ] = $_SERVER[ 'HTTP_USER_AGENT' ];
			$logindata[ 'user_id' ] = $res[ 'id' ];
			$logindata[ 'timestamp' ] = microtime();
			$res_get[ 'token' ] = $logindata[ 'login_token' ] = $this->encrypt( $logindata[ 'user_id' ] . $logindata[ 'useragent' ] . $logindata[ 'ip' ] . microtime( true ) * 10000 );
			$this->login->where( 'login_token', $res[ 'login_token' ] )->update( $logindata );
			if ( $this->request->getPost( 'app' ) != "xhr" ) {
				$res_get[ 'expiry' ] = intval( $res_get[ 'expiry' ] );
				$this->set_cookie( 'token', $logindata[ 'login_token' ], ( $res_get[ 'expiry' ] != 0 && $res_get[ 'expiry' ] > time() ? time() - $res_get[ 'expiry' ] : 0 ) );
			}
			$this->user_data = $res;
			return $logindata[ 'login_token' ];
		}
	}
	public

	function send_message( $message, $number, $country = "91" ) {
		$client = \Config\ Services::curlrequest();
		$data[ 'country' ] = $country;
		$data[ 'sms' ] = '[{"message":"' . $message . '","to":["' . $number . '"]}]';
		$url = "https://api.msg91.com/api/v2/sendsms";
		$data_curl[ 'header' ] = array(
			"authkey: " . getenv( 'authentication_key' ),
			"content-type: application/json"
		);
		$data_curl[ 'http_errors' ] = false;
		$data_curl[ 'body' ] = "{ \"sender\": \"" . getenv( 'SMS_NAME' ) . "\", \"route\": \"4\", \"country\": \"$country\", \"sms\": [ { \"message\": \"$message\", \"to\": [ \"$number\"] } ] }";
		try {
			$response = $client->request( 'POST', $url, $data_curl );
			if ( $response->getStatusCode() == 200 ) {
				return $this->get_error( 1, "Common.21" );
			} else {
				return $this->get_error( 0, 'Common.20' );
			}
		} catch ( Exception $e ) {
			return $this->get_error( 0, "Common.20" );
		}
	}

	public

	function send_otp() {
		$this->get_details();
		$rules = [];
		$message = [];
		$type = $this->no_data( 'type' ) ? $this->no_data( 'type' ) : "signup";
		if ( $this->no_data( 'phone' ) ) {
			$message = [ 'phone' => [ 'required' => lang( 'Common.37' ) ], 'callingcode' => [ 'required' => lang( 'Common.38' ) ] ];
			$rules = [ 'phone' => 'required', 'callingcode' => [ 'label' => 'Calling code', 'rules' => 'required' ] ];
		}
		if ( $this->no_data( 'email' ) ) {
			$rules[ 'email' ] = $this->checkEmail;
			if ( $type == "reset" ) {
				$rules[ 'email' ][ 'rules' ] = 'valid_email';
			}
		}
		$valid = $this->validate_data(
			$rules, $message
		);
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		if ( ( $this->no_data( 'phone' ) && getenv( 'confirmation' ) == "phone" ) || ( $this->no_data( 'email' ) && getenv( 'confirmation' ) == "email" ) ) {

			if ( $this->no_data( 'phone' ) ) {
				$phone = $this->no_data( 'phone' );
				$callingcode = $this->no_data( 'callingcode' );
				$this->builder->groupStart();
				$this->builder->where( 'phone', $phone );
				if ( $this->no_data( 'callingcode' ) ) {
					$this->builder->where( 'callingcode', $callingcode );
				}
				$this->builder->groupEnd();
			}
			if ( $this->no_data( 'email' ) ) {
				$this->builder->orWhere( 'email', $this->no_data( 'email' ) );
			}
			$res = $this->builder->get()->getRowArray();
			if ( ( empty( $res ) && $type != "reset" ) || ( $type == "reset" && !empty( $res ) ) ) {
				$otp = $this->get_random( '4', 'otp' );
				$timestamp = time();
				$hash = $this->get_hash( $this->no_data( 'phone' ) . $type . $timestamp . $otp );
				$send = array( 'timestamp' => $timestamp, 'hash' => $hash );
				$message = str_replace( '{otp}', $otp, lang( 'Common.44' ) );
				if ( $this->no_data( 'phone' ) ) {
					$sent = $this->send_message( $message, $phone );
				} else if ( $this->no_data( 'email' ) ) {
					$email[ 'email' ] = $this->no_data( 'email' );
					if ( !empty( $res ) ) {
						$email[ 'name' ] = $this->get_name( $res[ 'name' ] );
					}
					$email[ 'subject' ] = lang( 'Common.46' );
					$email[ 'message' ] = str_replace( '{otp}', $otp, lang( 'Common.45' ) );
					$sent = $this->sendmail( 'email/signup/html.php', $email, $email[ 'email' ] );
				} else {
					return $this->get_json( 1, "Common.1", $send );
				}
				if ( $sent[ 'error' ] == 0 && ENVIRONMENT == "production" ) {
					return $send;
				}
				if ( ( $type == "reset" ) && !empty( $res[ 'id' ] ) ) {
					$send[ 'secret_key' ] = $this->encrypt( $res[ 'id' ] );
				} elseif ( !empty( $res[ 'id' ] ) ) {
					return $this->get_json( 0, "Common.5" );
				}
				if ( ENVIRONMENT != "production" ) {
					$send[ 'otp' ] = $otp;
				}
				return $this->get_json( 1, "Common.10", $send );
			} else {
				return json_encode( $this->get_error_msg( 0, str_replace( '{field}', lang( 'Headings.1' ), lang( 'Common.11' ) ) ) );
			}
		} else {
			return $this->get_json( 0, "Common.2" );
		}
	}
	public

	function verify_otp( $type = "signup" ) {
		return $this->no_data( 'hash' ) == $this->get_hash( $this->no_data( 'phone' ) . $type . $this->no_data( 'timestamp' ) . $this->no_data( 'otp' ) );
	}
	public

	function register() {
		$rules = [];
		$message = [];
		$rules = [ 'otp' => [ 'label' => lang( 'Headings.2' ), 'rules' => 'required|is_natural' ] ];
		$message = [ 'otp' => [ 'required' => lang( 'Common.38' ), 'is_natural' => lang( 'Common.12' ) ], 'country' => [ 'required' => lang( 'Common.38' ) ] ];
		if ( $this->no_data( 'phone' ) ) {
			$rules[ 'country' ] = [ 'rules' => 'required' ];
			$message[ 'country' ] = [ 'required' => lang( 'Common.38' ) ];
			$rules[ 'callingcode' ] = [ 'label' => 'Calling code', 'rules' => 'required' ];
			$message[ 'callingcode' ] = [ 'required' => lang( 'Common.38' ) ];
			$rules[ 'phone' ] = [ 'label' => lang( 'Headings.1' ), 'rules' => 'required|is_unique[user.phone,phone,0]' ];
			$message[ 'phone' ] = [ 'required' => lang( 'Common.37' ), 'is_unique' => lang( 'Common.11' ) ];
		}
		if ( $this->no_data( 'email' ) ) {
			$rules[ 'email' ] = $this->checkEmail;
		}
		$valid = $this->validate_data( $rules, $message );
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		if ( $this->verify_otp( 'signup' ) ) {
			$subscribe[ 'phone' ] = $data[ 'phone' ] = $this->no_data( 'phone' );
			$subscribe[ 'name' ] = $data[ 'name' ] = $this->no_data( 'name' );
			if ( $this->no_data( 'email' ) ) {
				$subscribe[ 'email' ] = $data[ 'email' ] = $this->no_data( 'email' );
			}
			$data[ 'password' ] = $this->encrypt( $this->no_data( 'password' ) );
			$data[ 'token' ] = $this->get_hash( $this->no_data( 'password' ) );
			$data[ 'signup_stamp' ] = time();
			$data[ 'country' ] = strtoupper( $this->no_data( 'country' ) );
			$data[ 'callingcode' ] = $this->no_data( 'callingcode' );
			if ( getenv( 'confirmation' ) == "phone" ) {
				$data[ 'status_phone' ] = "Y";
			} else {
				$data[ 'status' ] = "Y";
			}
			$data[ 'image' ] = "assets/images/user.png";

			$data[ 'type' ] = "U";
			$this->builder->insert( $data );
			$id = $this->db->insertId();
			$send_mail[ 'receiver' ] = $id;
			$send_mail[ 'campaign_id' ] = '1';
			$data[ 'id' ] = $id;
			if ( $this->no_data( 'email' ) ) {
				$this->db->table( 'send_mail' )->insert( $send_mail );
			}
			$data_update[ 'username' ] = $this->get_username( $data[ 'name' ], $id );
			$this->builder->where( 'id', $id )->update( $data_update );
			return $this->do_login( $data );
		} else {
			return $this->get_json( 0, "Common.12" );
		}
	}
	public

	function request_password() {
		if ( $this->no_data( 'username' ) ) {
			$sql = "SELECT * FROM  user  WHERE (user.email='" . $this->no_data( 'username' ) . "' OR user.phone='" . $this->no_data( 'username' ) . " OR concat(user.callingcode,user.phone)='" . str_replace( '+', "", $this->no_data( 'username' ) ) . "') ";
			$res = $this->db->query( $sql )->getResult( 'array' );
			if ( !empty( $res ) ) {
				$send_mail[ 'receiver' ] = $res[ 'id' ];
				$send_mail[ 'campaign_id' ] = '2';
				$send_mail[ 'timestamp' ] = time();
				$this->db->table( 'send_mail' )->insert( $send_mail );
				return $this->get_json( 1, "Common.13" );
			} else {
				return $this->get_json( 0, "Common.5" );
			}
		} else {
			return $this->get_json( 0, "Common.2" );
		}
	}
	public
	function login_user() {
		if ( $this->no_data( 'username' ) && $this->no_data( 'password' ) ) {
			$username = $this->no_data( 'username' );
			$password = $this->no_data( 'password' );
			if ( filter_var( $username, FILTER_VALIDATE_EMAIL ) ) {
				$this->builder->where( 'email', $username );
			} else {
				$username = preg_replace( '/[^0-9]/', '', $username );
				if ( intval( $username ) < 1000 ) {
					return $this->get_json( 0, "Common.2",$username);
				}
				$this->builder->Where( 'phone', $username )->orWhere( 'CONCAT(callingcode,phone)', $username )->orWhere( 'CONCAT("+",callingcode,phone)', $username );
			}
			$this->builder->select( '*' );
			//			print_r($res);die;
			$res = $this->builder->get()->getRowArray();
			//			print_r($res);die;
			if ( !empty( $res ) ) {
				if ( $res[ 'status' ] == "B" ) {
					return $this->get_json( 0, "Common.66" );
				}
				if ( ( string )$this->decrypt( $res[ 'password' ] ) == ( string )$password ) {
					return $this->do_login( $res );
				} else {
					return $this->get_json( 0, "Common.9" );
				}
			} else {
				return $this->get_json( 0, "Common.5" );
			}
		} else {
			return $this->get_json( 0, "Common.2" );
		}
	}
	//COMMON FUNCTION 
}
?>