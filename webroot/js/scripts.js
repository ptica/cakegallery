Dropzone.options.drop = {
    init: function () {
        this.on("success", function (file, response) {
            // remember the returned picture id
            // so we can send sorted ids on queuecomplete
            var id = response.picture.Picture.id;
            if (id) {
                $(file.previewElement).data('id', id);
            }
        });
        this.on("queuecomplete", function () {
            // upon completition send sorted ids
            // to retain order inspite of parallelUploads
            var baseuri = jQuery("body").data("plugin-base-url");
            var sorted = $('.dropzone .dz-preview').map(function(i,e){ return $(e).data('id'); }).toArray().join(',');
            $.post(baseuri + '/pictures/sort', {
                order: sorted
            }, function (response) {
                $(".alert-success").fadeIn(600).html(__('Order Saved!'));
                window.setTimeout(function () {
                    $(".alert-success").fadeOut(600)
                }, 2000);
            });
        });
        this.on("addedfile", function (file) {

            // Create the remove button
            var removeButton = Dropzone.createElement('<button class="btn btn-sm btn-danger"><i class="fa fa-trash-o"></i></button>');
            var viewButton = Dropzone.createElement('<button class="btn btn-sm btn-info pull-right"><i class="fa fa-search"></i></button>');

            var base_url = jQuery("#folderinfo").data("public-folder-path");

            var name = file.name;
            var cover = ((file.cover == 'Y') ? true : false);
            var file_id = file.id;
            var path = base_url + name;
            var th_path = base_url + "TH/" + name;

            // Capture the Dropzone instance as closure.
            var _this = this;


            viewButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                jQuery("#pictureName").html(name);
                jQuery(".img-preview-full").attr('src', path);
                jQuery("#modalViewPicture").modal('show');
            });


            // Removing file
            removeButton.addEventListener("click", function (e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();

                var resp = confirm(__("Are you sure?"));

                if (resp) {
                    var baseuri = jQuery("body").data("plugin-base-url");

                    $.ajax({
                        url: baseuri + "/pictures/delete/" + file_id,
                        context: document.body
                    }).done(function () {
                            // Remove the file preview.
                            _this.removeFile(file);
                        });
                }


            });

            if (file.id) {
                // Add the button to the file preview element.
                file.previewElement.appendChild(removeButton);
            }
        });
    }
};
Dropzone.autoDiscover = false;

function saveOrder() {
    var baseuri = jQuery("body").data("plugin-base-url");
    var sorted = $("#sortable").sortable("toArray").join(",");
    $.post(baseuri + '/pictures/sort', {
        order: sorted
    }, function (response) {
        $(".alert-success").fadeIn(600).html(__('Order Saved!'));
        window.setTimeout(function () {
            $(".alert-success").fadeOut(600)
        }, 2000);
    });
}

$(function () {
    $('.confirm-delete').on('click', function (e) {
        var link = this;

        e.preventDefault();

        var resp = confirm(__("Are you sure?"));

        if (resp) {
            window.location = link.href;
        }
    })

    $('.modal-upload').on('hidden.bs.modal', function (e) {
        window.location.reload();
    })


    $('.th-pictures-container')
        .mouseover(function (e) {
            $(this).children('.icons-manage-image').show();
            e.stopPropagation();
        })
        .mouseout(function (e) {
            $(this).children('.icons-manage-image').hide();
        })


    $('.remove-picture').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var _this = $(this);

        var $box = _this.parent().parent().parent();

        var file_id = $(this).data('file-id');

        var resp = confirm(__("Are you sure?"));

        if (resp) {
            var baseuri = jQuery("body").data("plugin-base-url");

            $.ajax({
                url: baseuri + "/pictures/delete/" + file_id,
                context: document.body
            }).done(function () {
                    // Remove the file preview.
                    $box.hide(300);
                });
        }
    })

    $("#sortable").sortable({
        opacity: 0.5,
        update: function (event, ui) {
            saveOrder();
        }
    });
    $("#sortable").disableSelection();

    $('.popovertrigger').popover({
        html: true
    });

    $('.panel-heading.options, .close-config, .open-config').bind('click', function () {
        $('.panel.options').slideToggle(300);
    })
})

/**
 * A dummy gettext translation function, so this file has no dependency on
 * a particular js implementation of gettext
 */
if (typeof __ == 'undefined') {
    var __ = function (msg) {
        return (typeof App != 'undefined' && typeof App.i18n != 'undefined' ? App.i18n.gettext(msg) : msg);
    };
}
