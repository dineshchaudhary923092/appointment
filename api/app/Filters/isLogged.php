<?php
namespace App\ Filters;
//namespace CodeIgniter\Filters\isLogged;
use Config\ Services;
use CodeIgniter\ Filters\ FilterInterface;
use CodeIgniter\ HTTP\ RequestInterface;
use CodeIgniter\ HTTP\ ResponseInterface;
use App\ Models\ V1\ AuthenticationModel;

/**
 * IsLogged filter will check if user is logged in or not
 */
class isLogged
implements FilterInterface {
	public

	function before( RequestInterface $request, $arguments = null ) {
		$Auth = new AuthenticationModel( \Config\ Services::request() );
		$User = $Auth->get_details();
		if ( $User[ 'error' ] != 1 ) {
			if ( $request->getPost( 'app' ) == "xhr" ) {
				die( $Auth->get_json( 5, "Common.33" ) );
			} else {
				$msg = $Auth->get_json( 5, "Common.33" );
				return redirect()->back()->with( 'error', $msg );
			}
		}
		
		$request->userdata = $User['data'];
	}
	public

	function after( RequestInterface $request, ResponseInterface $response, $arguments = null ) {}
}