<?php
namespace App\ Filters;
use Config\ Services;
use CodeIgniter\ Filters\ FilterInterface;
use CodeIgniter\ HTTP\ RequestInterface;
use CodeIgniter\ HTTP\ ResponseInterface;
use App\ Models\ V1\ AuthenticationModel;

/**
 * IsNotLogged filter will check if user is not logged in.
 */
class isNotLogged
implements FilterInterface {
	public
	function before( RequestInterface $request, $arguments = null ) {
		$Auth = new AuthenticationModel( \Config\ Services::request() );
		$User = $Auth->get_details();
		if ( $User[ 'error' ] == 1 ) {
			if ( $request->getPost( 'app' ) == "xhr" ) {
				die( $Auth->get_json( 0, "Common.34" ) );
			} else {
				$to = $Auth->get_type( $User[ 'type' ] );
				$msg = $Auth->get_json( 0, "Common.34" );
				return redirect( 'hs' )->to( base_url( $to ) )->with( 'error', $msg );
			}
		}
	}
	public
	function after( RequestInterface $request, ResponseInterface $response, $arguments = null ) {}
}