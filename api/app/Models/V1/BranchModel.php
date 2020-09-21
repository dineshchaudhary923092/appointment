<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ AuthenticationModel;
class BranchModel extends AuthenticationModel {
	protected $table = "branch";
	protected $useTimestamps = false;
	protected $useSoftDeletes = false;
	protected $allowedFields = [ 'name' ];
	public

	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		$this->get_details();
		$this->branch = $this->db->table( $this->table );
		$this->table( 'branch' );
	}
	public

	function getData($search="") {
		$user = $this->user_data;
		if ( $this->no_data( 'branchSearch' )) {
			$search = $this->no_data( 'branchSearch' );
			$this->branch->Like( 'name', $search, 'BOTH' );
		}
		$sql_more = $this->branch->getCompiledSelect( false );
		$offset = $this->no_data( 'offset' ) ? $this->no_data( 'offset' ) : 0;
		$limit = $this->no_data( 'limit' ) == 0 ? 25 : intval( $this->no_data( 'limit' ) );
		$this->branch->orderBy( 'id' );
		$result = $this->branch->get( ( intval( $offset ) * $limit ), $limit )->getResult( 'array' );
		$more = "";
		if ( !empty( $result ) ) {
			$res = $this->db->query( $sql_more . " order by id  " . ( " LIMIT " . ( ( intval( $offset ) + 1 ) * $limit ) . "," . $limit ) )->getRowArray();
			if ( !empty( $res[ 'id' ] ) ) {
				$more = intval( $offset ) + 1;
			}
		}
		return $this->get_error( 1, "Common.15", $result, $more );
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
		$message=[];
		$user = $this->user_data;
		$rules[ 'name' ] = [ 'rules' => 'required|is_unique[branch.name,id,'.$this->no_data( 'id' ).']','label'=>ucfirst($this->table)."`s name", 'errors' => [ 'required' => lang( 'Common.38' ),'is_unique'=>lang('App.14') ] ];
		if ( $this->no_data( 'id' ) ) {
			$rules[ 'id' ] = [ 'rules' => 'required|is_not_unique[branch.id]','label'=>$this->table, 'errors' => [ 'required' => lang( 'Common.38' ), "is_not_unique" => lang( "Validation.0" ) ] ];
		}
		$valid = $this->validate_data( $rules, $message );
		if ( $valid[ 'error' ] == 0 ) {
			return json_encode( $valid );
		}
		$data[ 'name' ] = $this->no_data( 'name' );
		$id = $this->no_data( 'id' );
		if ( !empty( $id ) ) {
			$this->branch->update( $data, [ 'id' => $id ] );
			return $this->get_json( 1, "App.3" );
		} else {
			$this->branch->insert( $data );
			return $this->get_json( 1, "App.2" );
		}
	}
}
?>