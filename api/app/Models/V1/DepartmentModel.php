<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
use App\ Models\ V1\ BranchModel;
class DepartmentModel extends AuthenticationModel {
	protected $table = "department";
	protected $useTimestamps = false;
	protected $useSoftDeletes = false;
	protected $allowedFields = [ 'name', 'image' ];
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->department = $this->db->table( $this->table );
	}
	public
	function getData() {
		$user = $this->user_data;
		if ( $this->no_data( 'departmentSearch' ) ) {
			$search = $this->no_data( 'search' );
			$this->department->Like( 'name', $search, 'BOTH' );
		}
		if ( $this->no_data( 'branch' ) ) {
			$branch_id = $this->no_data( 'branch' );
			$this->department->where( 'branch', $branch_id );
		}
		$sql_more = $this->department->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$this->department->orderBy( 'id' );
		$result = $this->department->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
		$data = $result;
		$BrachModel = new BranchModel( \Config\ Services::request() );	
		$res = [];
		$res['department'] = $data;
		$res['branches'] = $BrachModel->getData();
		$res['branches'] = $res['branches']['data'];
		for($i=0;$i<count($res['department']);$i++){
			foreach($res['branches'] as $branch){
				if($res['department'][$i]['branch']==$branch['id']){
					$res['department'][$i]['branchName']=$branch['name'];
				}
			}
		}
		}
		return $this->get_error( 1, "Common.15", $res, $more );
	}
	public
	function deleteData() {
		$user = $this->user_data;
		$id = $this->no_data( 'id' );
		$table = $this->table;
		$id = $id;
		if ( !empty( $table ) && !empty( $id ) ) {
			$data =  $this->delete_row( $id, $table ) ;
			$data['data'] = array('id'=>$id);
			return $data;
		} else {
			return $this->get_error( 0, 'Common.2' );
		}
	}
	public
	function add() {
		$rules = [];
		$message = [];
		if ( isset( $_FILES[ 'file' ] ) && !empty( $_FILES[ 'file' ][ 'name' ] ) ) {
			$rules = [ 'file' => $this->checkImage ];
		}
		if ( $this->no_data( 'id' ) ) {
			$rules[ 'id' ] = [ 'rules' => 'required|is_not_unique[department.id]', 'label' => $this->table, 'errors' => [ 'required' => lang( 'Common.38' ), "is_not_unique" => lang( "Validation.0" ) ] ];
		}
		$rules[ 'branch' ] = [ 'rules' => 'required|is_not_unique[branch.name]', 'errors' => [ 'required' => lang( 'Common.38' ), "is_not_unique" => lang( "Validation.0" ) ] ];
		$rules[ 'name' ] = [ 'rules' => 'required', 'label' => ucfirst( $this->table ) . "`s name", 'errors' => [ 'required' => lang( 'Common.38' ) ] ];
		$valid = $this->validate_data( $rules, $message );
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		$user = $this->user_data;
		if ( !$this->no_data( 'name' ) ) {
			return $this->get_json( 0, "Common.2" );
		}
		$data[ 'name' ] = $this->no_data( 'name' );
		$data[ 'branch' ] = $this->no_data( 'branch' );
		$data[ 'branch' ] = $this->db->table('branch')->where('name',$data[ 'branch' ])->get()->getRowArray();
		$data[ 'branch' ] = $data[ 'branch' ]['id'];
		$id = $this->no_data( 'id' );
		$res = $this->upload_file( 'file', "", $this->table . "/" );
		$data[ 'image' ] = $res[ 'error' ] == 1 ? $res[ 'msg' ] : $this->get_default( 'logo' );
		if ( !empty( $id ) ) {
			if ( $res[ 'error' ] == 1 ) {
				$depratment = $this->department->getWhere( [ 'id' => $id ] )->getRowArray();
				if ( !empty( $depratment[ 'image' ] ) && $depratment[ 'image' ] != $this->get_default( 'logo' ) ) {
					$this->delete_file( $depratment[ 'image' ] );
				}
			}else{
				unset($data[ 'image' ]);
			}
			$this->department->update( $data, [ 'id' => $id ] );
			return $this->get_json( 1, "App.5" );
		} else {
			$branchExists = $this->department->where(array('name'=>$data[ 'name' ],'branch'=>$data[ 'branch' ]))->get()->getRowArray();
			if(!empty($branchExists['name'])){
			return $this->get_json( 0, "App.15" );	
			}
			$this->department->insert( $data );
			return $this->get_json( 1, "App.4" );
		}
	}
}
?>