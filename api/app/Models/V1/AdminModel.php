<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
class AdminModel extends AuthenticationModel {
	protected $table = "user";
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
	}
	public

	function get_users( $type ) {
		$user = $this->user_data;
		//		$type = $this->no_data( 'type' );
		if ( ( $type == "A" || $type == "SA" ) && $user[ 'type' ] == "A" ) {
			return $this->get_json( 0, "Common.34" );
		}
		if ( !empty( $type ) ) {
			$this->builder->where( 'type', $type );
			if ( $type = "D" || $type = "R" ) {
				$this->builder->Select( 'user.*,department.name as department_name,department.image as department_image,user.branch,branch.name as branch_name' );
				$this->builder->join( 'department', "department.id=user.department", "left" );
				$this->builder->join( 'branch', "branch.id=user.branch", "left" );
			}
			if ( $this->no_data( 'department' ) ) {
				$department = $this->no_data( 'department' );
				$this->builder->where( "user.department", $department );
			}
		} else {
			$this->builder->where( 'type!=', "SA" );
		}
		if ( $this->no_data( 'userSearch' ) ) {
			$search = $this->no_data( 'userSearch' );
			$this->builder->groupStart()->orLike( 'user.name', $search, 'BOTH' );
			$this->builder->orLike( 'phone', $search, 'BOTH' );
			$this->builder->orLike( 'email', $search, 'BOTH' )->groupEnd();
		}
		$sql_more = $this->builder->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' );
		$limit = $this->no_data( 'limit' ) == "" ? 25 : intval( $this->no_data( 'limit' ) );
		$this->builder->orderBy( 'user.id' )->limit( ( intval( $offset ) * $limit ), $limit );
		$result = $this->builder->get()->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by user.id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
			for ( $i = 0; $i < count( $result ); $i++ ) {
				$result[ $i ][ 'id' ] = $this->encrypt( $result[ $i ][ 'id' ] );
				$result[ $i ][ 'password' ] = $this->decrypt( $result[ $i ][ 'password' ] );
			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
	}
	public
	function getCount() {
		$data[ 'admin' ] = $this->builder->SELECT( 'count(id) as admin' )->where( 'type', 'A' )->get()->getRowArray();
		$data[ 'admin' ] = !empty( $data[ 'admin' ][ 'admin' ] ) ? $data[ 'admin' ][ 'admin' ] : 0;
		$data[ 'users' ] = $this->builder->SELECT( 'count(id) as users' )->where( 'type', 'U' )->get()->getRowArray();
		$data[ 'users' ] = !empty( $data[ 'users' ][ 'users' ] ) ? $data[ 'users' ][ 'users' ] : 0;
		$data[ 'receptionist' ] = $this->builder->SELECT( 'count(id) as receptionist' )->where( 'type', 'R' )->get()->getRowArray();
		$data[ 'receptionist' ] = !empty( $data[ 'receptionist' ][ 'receptionist' ] ) ? $data[ 'receptionist' ][ 'receptionist' ] : 0;
		$data[ 'doctor' ] = $this->builder->SELECT( 'count(id) as doctor' )->where( 'type', 'D' )->get()->getRowArray();
		$data[ 'doctor' ] = !empty( $data[ 'doctor' ][ 'doctor' ] ) ? $data[ 'doctor' ][ 'doctor' ] : 0;
		$data[ 'branch' ] = $this->db->table( 'branch' )->SELECT( 'count(id) as branch' )->get()->getRowArray();
		$data[ 'branch' ] = !empty( $data[ 'branch' ][ 'branch' ] ) ? $data[ 'branch' ][ 'branch' ] : 0;
		$data[ 'department' ] = $this->db->table( 'department' )->SELECT( 'count(id) as department' )->get()->getRowArray();
		$data[ 'department' ] = !empty( $data[ 'department' ][ 'department' ] ) ? $data[ 'department' ][ 'department' ] : 0;
		return $this->get_error( 1, "Common.15", $data );
	}
	public

	function delete_user() {
		$user = $this->user_data;
		$id = $this->no_data( 'id' );
		$table = $this->table;
		$id = $this->decrypt( $id );
		if ( !empty( $table ) && !empty( $id ) ) {
			$data = $this->delete_row( $id, $table );
			$data[ 'data' ] = array( 'id' => $id );
			return $data;
		} else {
			return $this->get_error( 0, 'Common.2' );
		}
	}
	public

	function add_user() {
		$user = $this->user_data;
		$rules = [];
		$message = [];
		$type = $data[ 'type' ] = $this->no_data( 'type' );
		$id = $this->no_data( 'id' ) ? $this->decrypt( $this->no_data( 'id' ) ) : 0;
		//		echo $id;
		if ( $this->no_data( 'phone' ) ) {
			$rules = [ 'country' => 'required', 'callingcode' => [ 'label' => 'Calling code', 'rules' => 'required' ] ];
			$message = [ 'country' => [ 'required' => lang( 'Common.38' ) ] ];
			$rules[ 'phone' ] = [ 'label' => lang( 'Headings.1' ), 'rules' => "required|is_unique[user.phone,id,$id]" ];
			$message[ 'phone' ] = [ 'required' => lang( 'Common.37' ), 'is_unique' => lang( 'Common.11' ) ];
		}
		if ( $this->no_data( 'email' ) ) {
			$rules[ 'email' ] = $this->checkEmail;
			$rules[ 'email' ][ 'rules' ] = "valid_email|is_unique[user.email,id,$id]";
		}
		if ( isset( $_FILES[ 'file' ] ) && !empty( $_FILES[ 'file' ][ 'name' ] ) ) {
			$rules = [ 'file' => $this->checkImage ];
		}
		if ( $type == "D" ) {
			$rules[ 'department' ] = [ 'rules' => 'required|is_not_unique[department.name]', 'errors' => [ 'required' => lang( 'Common.38' ), "is_not_unique" => lang( "Validation.0" ) ] ];
		}
		if ( $type == "D" || $type == "R" ) {
			$rules[ 'branch' ] = [ 'rules' => 'required|is_not_unique[branch.name]', 'errors' => [ 'required' => lang( 'Common.38' ), "is_not_unique" => lang( "Validation.0" ) ] ];
		}
		$valid = $this->validate_data( $rules, $message );
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		if ( $this->no_data( 'phone' ) ) {
			$subscribe[ 'phone' ] = $data[ 'phone' ] = $this->no_data( 'phone' );
		}
		$subscribe[ 'name' ] = $data[ 'name' ] = $this->no_data( 'name' );
		$type = $data[ 'type' ] = $this->no_data( 'type' );
		if ( $user[ 'type' ] == $type || $type == "SA" ) {
			return $this->get_json( 0, "Common.34" );
		}
		if ( $this->no_data( 'email' ) ) {
			$subscribe[ 'email' ] = $data[ 'email' ] = $this->no_data( 'email' );
		}
		$data[ 'password' ] = $this->encrypt( $this->no_data( 'password' ) );
		$data[ 'token' ] = $this->get_hash( $this->no_data( 'password' ) );
		$data[ 'last_updated' ] = $data[ 'signup_stamp' ] = time();
		$data[ 'country' ] = strtoupper( $this->no_data( 'country' ) );
		$data[ 'callingcode' ] = $this->no_data( 'callingcode' );
		$data[ 'slot_duration' ] = $this->no_data( 'slot_duration' );
		if ( $this->no_data( 'branch' ) ) {
			$branch = $this->no_data( 'branch' );
			$branch = $this->db->table( 'branch' )->where( 'name', $branch )->get()->getRowArray();
			$data[ 'branch' ] = $branch[ 'id' ];
		}
		if ( $this->no_data( 'department' ) ) {
			$department = $this->no_data( 'department' );
			$department = $this->db->table( 'department' )->where( 'name', $department )->get()->getRowArray();
			$data[ 'department' ] = $department[ 'id' ];
		}
		if ( getenv( 'confirmation' ) == "phone" ) {
			$data[ 'status_phone' ] = "Y";
		} else {
			$data[ 'status' ] = "Y";
		}
		if ( isset( $_FILES[ 'file' ] ) && !empty( $_FILES[ 'file' ][ 'name' ] ) ) {
			$res = $this->upload_file( 'file', "", "user/" );
			if ( $res[ 'error' ] == 1 ) {
				$data[ 'image' ] = $res[ 'msg' ];
				if ( $id != 0 ) {
					$new_user = $this->builder->where( 'id', $id )->get()->getRowArray();
					if ( !empty( $new_user[ 'image' ] ) && $new_user[ 'image' ] != "/assets/images/user.png" ) {
						$this->delete_file( $new_user[ 'image' ] );
					}
				}
			}
		}

		$data[ 'type' ] = $type;
		if ( $id != 0 ) {
			$this->builder->where( 'id', $id )->update( $data );
			$data[ 'id' ] = $this->encrypt( $id );
			$data[ 'password' ] = $this->decrypt( $data[ 'password' ] );
			return $this->get_json( 1, "App.1", $data );
		} else {
			if ( empty( $data[ 'image' ] ) ) {
				$data[ 'image' ] = "assets/images/user.png";
			}
			$this->builder->insert( $data );
			$id = $this->db->insertId();
			$data[ 'id' ] = $id;
			$data_update[ 'username' ] = $this->get_username( $data[ 'name' ], $id );
			$this->builder->where( 'id', $id )->update( $data_update );
			$data[ 'id' ] = $this->encrypt( $id );
			$data[ 'password' ] = $this->decrypt( $data[ 'password' ] );
			$data[ 'username' ] = $data_update[ 'username' ];
			return $this->get_json( 1, "App.0", $data );
		}
	}
}