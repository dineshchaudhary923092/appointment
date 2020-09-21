<?php
namespace App\ Models\ V1;
use App\ Models\ V1\ CommonModel;
class EmailModel extends CommonModel{
	protected $table = "send_mail";
	public
	function __construct( $requestInstace ) {
		parent::__construct( $requestInstace );
		define( 'email', 'email_lib/' );
	}
	public

	function sendmail( $template = "", $data, $email = "" ) {
		$mail = \Config\ Services::email();
		$config[ 'protocol' ] = 'smtp';
		$config[ 'SMTPHost' ] = getenv( 'email_hostname' );
		$config[ 'SMTPUser' ] = getenv( 'email_usermail' );
		$config[ 'SMTPPass' ] = getenv( 'email_password' );
		$config[ 'SMTPPort' ] = getenv( 'email_port' );
		$config[ 'SMTPCrypto' ] = getenv( 'email_encryption' );
		$subject = $data[ 'subject' ];
		$mail->initialize( $config );
		$data[ 'base_url' ] = base_url();
		if ( empty( $template ) ) {
			if ( empty( $data[ 'message' ] ) ) {
				return false;
			} else {
				$message = $data[ 'message' ];
			}
		} else {
			$data = array('data'=>$data) ;
			$message = view( $template, $data );
		}
		if ( empty( $email ) ) {
			$mail->setTo( 'sharma.himanshu0405@gmail.com' );
		} else {
			$mail->setTo( $email );
		}
		$mail->SetFrom( getenv( 'email_usermail' ), getenv( 'email_username' ) );
		$mail->setReplyTo( getenv( 'email_usermail' ), getenv( 'email_username' ) );
		$mail->setSubject( $subject);
		$mail->setMessage( $message );
		return $mail->Send()?$this->get_error( 1, "Common.61" ):$this->get_error( 0, "Common.61" );

	}
}
?>