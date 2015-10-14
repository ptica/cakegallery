<?php

class PicturesController extends GalleryAppController
{
    public $components = array('Gallery.Util');
    public $uses = array('Gallery.Album', 'Gallery.Picture');

    public function upload()
    {
        $album_id = $_POST['album_id'];

        # Resize attributes configured in bootstrap.php
        $resize_attrs = $this->Picture->getResizeToSize();

        if ($_FILES) {
            $file = $_FILES['file'];

            try {
                # Check if the file have any errors
                $this->Util->checkFileErrors($file);

                # Get file extention
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

                # Validate if the file extention is allowed
                $this->Util->validateExtensions($ext);

                # Generate a random filename
                $filename = $this->Util->getToken();

                $full_name = $filename . "." . $ext;

                # Image Path
                $path = $this->Picture->generateFilePath($album_id, $full_name);

                $main_id = $this->Picture->uploadFile(
                    $path,
                    $album_id,
                    $file['name'],
                    $file['tmp_name'],
                    $resize_attrs['width'],
                    $resize_attrs['height'],
                    $resize_attrs['action'],
                    true
                );


                # Create extra pictures from the original one
                # wanted styles can be reduced by enumerating them in the $_POST['styles']
                $wanted_styles = Configure::read('GalleryOptions.Pictures.styles');
                if (!empty($_POST['styles'])) {
                    $wanted_styles = array_merge($_POST['styles'],array('medium')); // medium style always - used internally
                    $wanted_styles = array_intersect_key(Configure::read('GalleryOptions.Pictures.styles'), array_flip($wanted_styles));
                }

                $this->Picture->createExtraImages(
                    $wanted_styles,
                    $file['name'],
                    $file['tmp_name'],
                    $album_id,
                    $main_id,
                    $filename
                );

                $this->Picture->id = $main_id;
                return new CakeResponse(
                    array(
                        'type' => 'application/json',
                        'status' => 200,
                        'body' => json_encode(array(
                            'picture' => $this->Picture->read(null)
                        ), true)
                    )
                );

            } catch (ForbiddenException $e) {
                $response = $e->getMessage();
                return new CakeResponse(
                    array(
                        'status' => 401,
                        'body' => json_encode($response)
                    )
                );
            }
        }

        $this->render(false, false);
    }

    /**
     * Delete an image and all its versions from database
     * @param $id
     */
    public function delete($id)
    {
        # Delete the picture and all its versions
        $this->Picture->delete($id);

        $this->render(false, false);
    }

    /**
     * Sort pictures from an album
     */
    public function sort()
    {
        if ($this->request->is('post')) {
            $order = explode(",", $_POST['order']);
            $i = 1;
            foreach ($order as $photo) {
                $this->Picture->read(null, $photo);
                $this->Picture->set('order', $i);
                $this->Picture->save();
                $i++;
            }
        }

        $this->render(false, false);
    }


}

?>
