<?php

/**
 * The goal of this file is to allow developers a location
 * where they can overwrite core procedural functions and
 * replace them with their own. This file is loaded during
 * the bootstrap process and is called during the frameworks
 * execution.
 *
 * This can be looked at as a `master helper` file that is
 * loaded early on, and may also contain additional functions
 * that you'd like to use throughout your entire application
 *
 * @link: https://codeigniter4.github.io/CodeIgniter4/
 */
class secure {
	private static $AES_METHOD = 'aes-256-cbc';
	private static $iv = "";
	private static $password = "";
	public function __construct(){
		secure::$iv = getenv('encryption_iv');
		secure::$password = getenv('encryption_key');
	}
	public static

	function encrypt( $message ) {
		try {
			$iv = substr( hash( 'sha256', self::$iv ), 0, 16 );
			$ciphertext = openssl_encrypt( $message, self::$AES_METHOD, substr( hash( 'sha256', self::$password ), 0, 32 ), OPENSSL_RAW_DATA, $iv );
			$ciphertext_hex = bin2hex( $ciphertext );
			$iv_hex = bin2hex( $iv );
			return "$ciphertext_hex";
		} catch ( Exception $e ) {
			return "";
		}
	}

	public static

	function decrypt( $ciphered ) {
		try {
			$iv = substr( hash( 'sha256', self::$iv ), 0, 16 );
			$ciphertext = hex2bin( $ciphered );
			$data = openssl_decrypt( $ciphertext, self::$AES_METHOD, substr( hash( 'sha256', self::$password ), 0, 32 ), OPENSSL_RAW_DATA, $iv );
			return $data;
		} catch ( Exception $e ) {
			return "";
		}
	}
	public static

	function get_hash( $data ) {
		return hash( 'sha256', $data );
	}
	public static

	function get_username( $name, $id ) {
		return preg_replace( '/-+/', '-', preg_replace( "![^a-z0-9]+!i", "-", $name ) ) . "-" . $id;
	}
	public static

	function get_date( $timestamp ) {
		return date( 'M dS Y', $timestamp );
	}
	public static

	function get_random( $length, $type = "" ) {
		$characters = $type != "otp" ? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' : "0123456789";
		$charactersLength = strlen( $characters );
		$randomString = '';
		for ( $i = 0; $i < $length; $i++ ) {
			$randomString .= $characters[ rand( 0, $charactersLength - 1 ) ];
		}
		return $randomString;
	}
}