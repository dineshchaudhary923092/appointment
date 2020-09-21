<?php
namespace App\ Models\ V1;
use CodeIgniter\ Model;
class DropboxModel extends Model {
	protected $table = "media";
	public

	function __construct( $requestInstace ) {
		parent::__construct();
		$this->request = $requestInstace;
		//requestInstace is required to get file
	}
	public

	function getformat( $strpos ) {
		if ( $strpos == "folder" ) {
			return "folder";
		}
		if ( $strpos == "application/msword" || $strpos == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || strpos( $strpos, "powerpoint" ) ) {
			return "word";
		} elseif ( $strpos == "application/pdf" ) {
			return "pdf";
		}
		elseif ( strpos( $strpos, "powerpoint" ) !== false || strpos( $strpos, "presentation" ) !== false ) {
			return "ppt";
		}
		elseif ( strpos( $strpos, "ms-excel" ) !== false || strpos( $strpos, "presentation" ) !== false ) {
			return "excel";
		}
		elseif ( strpos( $strpos, "application/zip" ) !== false || strpos( $strpos, "application/x-rar-compressed" ) !== false ) {
			return "zip";
		}
		elseif ( strpos( $strpos, "image" ) !== false ) {
			return "image";
		}
		elseif ( strpos( $strpos, "video" ) !== false ) {
			return "video";
		}
		elseif ( strpos( $strpos, "audio" ) !== false ) {
			return "music";
		} else {
			return "file";
		}
	}
	public

	function check_name( $name, $parent ) {
		$res = $this->db->where( 'parent', $parent )->where( 'name', $name )->get( 'file_system' )->row_array();
		return ( empty( $res ) ? $name : $name );
	}
	public

	function add_folder() {
		$data[ 'name' ] = $this->input->post( 'name' );
		$data[ 'type' ] = "folder";
		$data[ 'timestamp' ] = time();
		$data[ 'parent' ] = $this->input->post( 'parent' ) == "" ? 0 : secure::decrypt( $this->input->post( 'parent' ) );
		if ( $this->input->post( 'id' ) != "" ) {
			$id = secure::decrypt( $this->input->post( 'id' ) );
			$this->db->where( 'id', $id );
			$this->db->update( 'file_system', $data );
		} else {
			$data[ 'name' ] = $this->check_name( $this->input->post( 'name' ), $data[ 'parent' ] );
			$this->db->insert( 'file_system', $data );
			$id = $this->db->insert_id();
		}
		$data[ 'id' ] = secure::encrypt( $id );
		return array( 'error' => 1, 'msg' => "Folder Created", 'data' => $data );
	}
	public

	function delete_file( $id ) {
		$id = secure::decrypt( $id );
		$this->db->select( '*' );
		$this->db->from( 'file_system' );
		$res = $this->db->where( 'id', $id )->get()->result_array();
		foreach ( $res as $files ) {
			if ( $files[ 'type' ] != "folder" && file_exists( 'dropbox/' . $files[ 'timestamp' ] . "/" . $files[ 'name' ] ) ) {
				unlink( 'dropbox/' . $files[ 'timestamp' ] . "/" . $files[ 'name' ] );
				rmdir( 'dropbox/' . $files[ 'timestamp' ] );
			} elseif ( $files[ 'type' ] == 'folder' ) {
				$this->delete_folder( $files[ 'id' ] );
			}
		}
		$this->db->where( 'id', $id );
		$this->db->delete( 'file_system' );
		return array( 'error' => 1, 'msg' => "File removed", 'data' => "" );
	}
	public

	function delete_folder( $id ) {
		$id = secure::decrypt( $id );
		$this->db->select( '*' );
		$this->db->from( 'file_system' );
		$res = $this->db->where( 'parent', $id )->where( 'type', "folder" )->get()->result_array();
		if ( !empty( $res ) ) {
			foreach ( $res as $files ) {
				if ( $files[ 'type' ] != "folder" && file_exists( 'dropbox/' . $files[ 'timestamp' ] . "/" . $files[ 'name' ] ) ) {
					unlink( 'dropbox/' . $files[ 'timestamp' ] . "/" . $files[ 'name' ] );
					rmdir( 'dropbox/' . $files[ 'timestamp' ] );
				} elseif ( $files[ 'type' ] == 'folder' ) {
					$this->delete_folder( secure::encrypt( $files[ 'id' ] ) );
				}
			}
		}
		$this->db->where( 'id', $id );
		$this->db->delete( 'file_system' );
		$this->db->where( 'parent', $id )->delete( 'file_system' );
		return array( 'error' => 1, 'msg' => "Folder removed", 'data' => "" );
	}
	public

	function video_thumb( $source, $new ) {
		$command = "ffmpeg -i /var/www/lincoll/public_html/$source -ss 01 -vframes 1 /var/www/lincoll/public_html/$new 2>&1";
		$systeout = shell_exec( $command );
		return true;
	}
	public

	function add_product_file( $field = "file", $folder = "" ) {
		if ( empty( $_FILES[ $field ] ) ) {
			return array( 'error' => 0, 'msg' => "No file provided" );
		}
		$folder = "product/" . time();
		$image = $this->upload_file( $field, "", $folder );
		if ( $image[ 'error' ] == 1 ) {
			$folder = "dropbox/" . $folder;
			$data[ 'file' ] = $folder . "/" . $image[ 'msg' ];
			$format = $this->getformat( mime_content_type( $folder . "/" . $image[ 'msg' ] ) );
			$data[ 'file' ] = $folder . "/" . $image[ 'msg' ];
			$data[ 'type' ] = $format == "image" ? "img" : "video";
			if ( !is_dir( $folder . "/" . "thumb" ) ) {
				mkdir( $folder . "/" . "thumb", 0777 );
			}
			$thumbpath = $folder . "/" . "thumb/thumb.jpg";
			if ( $format == 'image' ) {
				$this->resize_image( 400, 400, $folder . "/" . $image[ 'msg' ], $thumbpath );
				$this->set_orientation( $thumbpath );
			} else {
				$this->video_thumb( "new/" . $folder . "/" . $image[ 'msg' ], "new/" . $thumbpath );
				$this->resize_image( 400, 400, $thumbpath, $thumbpath );
			}

			$data[ 'thumb' ] = $thumbpath;
			$this->db->insert( 'media', $data );
			$data[ 'id' ] = $this->db->insert_id();
			return array( 'error' => 1, 'msg' => 'file uplaoded', 'data' => $data );
		} else {
			return $image;
		}
	}
	public

	function set_orientation( $source, $quality = 90, $destination = null ) {
		if ( $destination === null ) {
			$destination = $source;
		}
		$info = getimagesize( $source );
		if ( $info[ 'mime' ] === 'image/jpeg' ) {
			$exif = @exif_read_data( $source );
			if ( !empty( $exif[ 'Orientation' ] ) && in_array( $exif[ 'Orientation' ], [ 2, 3, 4, 5, 6, 7, 8 ] ) ) {
				if ( in_array( $exif[ 'Orientation' ], [ 3, 4 ] ) ) {
					$config[ 'rotation_angle' ] = '180';
				}

				if ( in_array( $exif[ 'Orientation' ], [ 5 ] ) ) {
					$config[ 'rotation_angle' ] = '-90';
				}
				if ( in_array( $exif[ 'Orientation' ], [ 6, 5 ] ) ) {
					$config[ 'rotation_angle' ] = '270';
				}
				if ( in_array( $exif[ 'Orientation' ], [ 7, 8 ] ) ) {
					$config[ 'rotation_angle' ] = '90';
				}
				if ( !empty( $config[ 'rotation_angle' ] ) ) {
					$image = \Config\ Services::image( 'gd' )->withFile( $source )->reorient()->rotate( $config[ 'rotation_angle' ] )->save( $source, $quality );
					return true;
				}
				if ( !empty( $config[ 'rotation_angle' ] ) && !$image ) {
					return false;
				}
			}
		}
		return true;
	}
	public

	function recursiveDelete( $str ) {
		if ( is_file( $str ) ) {
			return @unlink( $str );
		} elseif ( is_dir( $str ) ) {
			$scan = glob( rtrim( $str, '/' ) . '/*' );
			foreach ( $scan as $index => $path ) {
				$this->recursiveDelete( $path );
			}
			return @rmdir( $str );
		}
	}
	public

	function delete_media( $id = "" ) {
		$id = empty( $id ) ? $this->input->post( 'id' ) : $id;
		if ( !empty( $id ) ) {
			$res = $this->db->where( 'id', $id )->get( 'media' )->row_array();
			if ( empty( $res[ 'id' ] ) ) {
				return $this->input->get_error( 1, "Common.85" );
			}
			$fold = explode( '/', $res[ 'file' ] );
			$fold = $fold[ ( count( $fold ) - 2 ) ];
			$this->recursiveDelete( "dropbox/product/$fold" );
			@rmdir( "dropbox/product/$fold" );
			$res = $this->db->where( 'id', $id )->delete( 'media' );
			return $this->input->get_error( 1, "Common.86" );
		} else {
			return $this->input->get_error( 0, "Common.2" );
		}
	}
	public

	function resize_image( $width = "100", $height = "100", $source, $new ) {
		$file = $source;
		if ( file_exists( $file ) ) {
			$this->set_orientation( $source );
			$image = \Config\ Services::image( 'gd' )->withFile( $source )->reorient()->resize( $width, $height, true )->save( $new );
			return array( 'error' => 1 );
		}
	}
	public

	function upload_file( $field = "file", $type = "", $folder = "users" ) {
		$field = empty( $field ) ? "file" : $field;
		$file = $this->request->getFile( $field );
		if ( empty( $file )) {
			$result = array( 'error' => 0, 'msg' => "Please upload the file before you hit submit" );
			return $result;
		}
		
		if ( !$file->isValid() ) {
			return array( 'error' => 0, 'msg' => "The file you uploaded is invalid" );
		}
		$path = 'dropbox' . ( !empty( $folder ) ? "/" . $folder : "" );
		$mime = $file->getMimeType();
		$mime = $this->getformat( $mime );
		$cfile = $file->getName();
		$cfile = $cfile;
		$cfile = time() . "-" . preg_replace( '/-+/', '-', preg_replace( "![^a-z0-9.]+!i", "-", $cfile ) );
		try {
			$file->move( $path, $cfile );
			$result = array( 'error' => 1, 'msg' => $path . $cfile, "path" => $path, "mime" => $mime );
			return $result;
		} catch ( Exception $e ) {
			$result = array( 'error' => 0, 'msg' => $e );
			return $result;
		}
	}
	public

	function delete_file_system( $path ) {
		if ( file_exists( $path ) ) {
			unlink( $path );
		}
		return ( true );
	}
	public

	function get_files() {
		$parent = $this->input->post( 'parent' ) == "" ? 0 : secure::decrypt( $this->input->post( 'parent' ) );
		$this->db->select( '*' )->from( 'file_system' );
		$this->db->where( 'parent', $parent );
		if ( $this->input->post( 'search' ) != "" ) {
			$this->db->where( 'name LIKE "%' . $this->input->post( 'search' ) . '%"' );
		}
		$res = $this->db->order_by( 'type' )->get()->result_array();
		if ( $parent != 0 ) {
			$back = $this->db->where( 'id', $parent )->get( 'file_system' )->row_array();
			$back = isset( $back[ 'parent' ] ) && $back[ 'parent' ] != 0 ? secure::encrypt( $back[ 'parent' ] ) : secure::encrypt( 0 );
		} else {
			$back = "";
		}
		if ( !empty( $res ) ) {

			for ( $i = 0; $i <= count( $res ) - 1; $i++ ) {
				$res[ $i ][ "id_enc" ] = secure::encrypt( $res[ $i ][ "id" ] );
				if ( $res[ $i ][ "type" ] != "folder" ) {}
				unset( $res[ $i ][ "id" ] );
			}
			return array( 'error' => 1, 'msg' => "Check data", 'data' => $res, 'back' => $back );
		} else {
			return array( 'error' => 0, 'msg' => "No folder/files available", 'data' => "", 'back' => $back );
		}
	}
}
?>