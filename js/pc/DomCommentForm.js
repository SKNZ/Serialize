var DomCommentForm = (function () {
    var _makeRatingStar = function (empty) {
        return $('<span>')
            .addClass('text-warning')
            .addClass('comment-block-rating-star')
            .addClass('glyphicon')
            .addClass('glyphicon-star' + (empty ? '-empty' : ''));
    };

    var _loadingImage = $('#comment-loading');
    var _episode;

    var _loadComments = function () {
        // Show the loading circle
        _loadingImage.fadeIn();

        ApiProvider
            .commentsForEpisode(_episode)
            .always(_bind(_loadingImage, $.prototype.hide))
            .done(function (comments) {
                comments.forEach(function (comment, i) {
                    $('#comment-comments')
                        .append(
                        $('<div>')
                            .append(
                            $('<h5>')
                                .append(
                                _makeRatingStar(comment.rating < 1),
                                _makeRatingStar(comment.rating < 2),
                                _makeRatingStar(comment.rating < 3),
                                _makeRatingStar(comment.rating < 4),
                                _makeRatingStar(comment.rating < 5),
                                '&nbsp;',
                                comment.subject
                            ))
                            .append(
                            ($('<p>'))
                                .append(
                                comment.message,
                                '&nbsp;',
                                $('<span>')
                                    .addClass('h6')
                                    .addClass('text-muted')
                                    .append(
                                    ' posted by ',
                                    $('<a>')
                                        .text(comment.firstName +
                                        ' ' +
                                        comment.lastName),
                                    ' on ',
                                    comment.date))));

                    if (i != comments.length - 1) {
                        $('#comment-comments')
                            .append($('<hr/>'));
                    }

                    $('#comment-modal').data('bs.modal').handleUpdate();
                });
            })
            .fail(function (errors) {
                // Append errors to DOM
                for (var i = 0; i < errors.length; ++i) {
                    $('#comment-messages-error-messages')
                        .append('- ', errors[i], $('<br/>'));
                }

                // Display errors
                $('#comment-messages-errors').fadeIn();
            });
    };

    var _handleOpenAndClose = function () {// When modal opens, load comments
        $('#comment-modal').on('shown.bs.modal', function (event) {
            $('#comment-comments').empty();
            // Fetch content according to id
            _episode = $(event.relatedTarget).attr('data-episode');
            _loadComments();

            // Autofocus on subject field
            $('#comment-input-subject').focus();

            $('#comment-messages-errors')
                .fadeOut(
                _bind(
                    $('#comment-messages-error-messages'),
                    $.prototype.empty));
        }).on('hide.bs.modal',
            _bind($('#comment-comments'), $.prototype.empty));
    };

    var _handleRating = function () {
        $('.comment-input-rating-star').click(function () {
            var selectedStars = $(this)
                .prevAll('.comment-input-rating-star')
                .addBack();

            selectedStars
                .removeClass('glyphicon-star-empty')
                .addClass('glyphicon-star');

            $(this)
                .nextAll('.comment-input-rating-star')
                .removeClass('glyphicon-star')
                .addClass('glyphicon-star-empty');

            $('#comment-input-rating').val(selectedStars.length);
        });
    };

    var _postButtonOriginalText = $('#comment-submit').text();

    var _updateSubmitButtonStatus = function () {
        var invalidInputCount =
            $('#comment-body')
                .find(':data(invalid)')
                .length;

        $('#comment-submit')
            .prop('disabled', invalidInputCount > 0);
    };

    var _handleInputs = function () {
        // Check if first name/last name are specified
        $('#comment-input-subject')
            .on('change input', function () {
                $(this).data('invalid', !$(this).val());
                _updateSubmitButtonStatus();
            });

        $('#comment-input-message')
            .on('propertychange input', function () {
                $(this).data('invalid', !$(this).val());
                _updateSubmitButtonStatus();
            });

        $('#comment-body')
            .find('form')
            .submit(
            function () {
                // Disable submit button to avoid multiple submissions
                $('#comment-submit')
                    .prop('disabled', 'true')
                    .text('Working...');

                // Hide any previous error messages
                $('#comment-post-errors').fadeOut('fast')
                // Clear them out from DOM
                $('#comment-post-error-messages').empty();

                // Build comment request
                var comment = {
                    subject: $('#comment-input-subject').val(),
                    rating: $(this).find('.comment-input-rating-star').length,
                    message: $('#comment-input-message').val()
                };

                // Send comment request, handle result
                ApiProvider
                    .commentEpisode(_episode, comment)
                    .done(function () {
                        // Let's reset the form
                        var commentModal =
                            $('#comment-modal');

                        //commentModal.modal('hide')

                        // Vanilla JS is easier than jQuery when it
                        // comes to resetting forms. Source:
                        // http://stackoverflow.com/a/6364313
                        commentModal.find('form')[0].reset();

                        commentModal
                            .find('.comment-input-rating-star:not(:first)')
                            .removeClass('glyphicon-star')
                            .addClass('glyphicon-star-empty');

                        // Remove all comments & reload comments
                        $('#comment-comments').empty();
                        _loadComments();

                        // Remark all the input fields as invalid,
                        // since they are now empty again
                        $('#comment-input-message, #comment-input-subject')
                            .data('invalid', true);

                        _updateSubmitButtonStatus();
                    })
                    .fail(function (errors) {
                        // Re-enable submit button if there were
                        // errors
                        $('#comment-submit')
                            .prop('disabled', false)
                            .text('Pitch me in !');

                        // Append errors to DOM
                        for (var i = 0; i < errors.length; ++i) {
                            $('#comment-post-error-messages')
                                .append('- ',
                                errors[i],
                                $('<br/>'));
                        }

                        // Display errors
                        $('#comment-post-errors').fadeIn();
                    })
                    // Reset the text to what it was back
                    // originally
                    .always(function () {
                        $('#comment-submit').text(_postButtonOriginalText);
                    });

                event.preventDefault();
            });
    };

    return {
        initialize: function () {
            // Initialize all fields as input as 'invalid', meaning that their
            // content is not fit to be sent to the server, which is true
            // since they are empty
            $('#comment-input-message, #comment-input-subject')
                .data('invalid', true);

            _updateSubmitButtonStatus();

            _handleOpenAndClose();
            _handleRating();
            _handleInputs();
        }
    };
})();
