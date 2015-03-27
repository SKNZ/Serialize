var DomCommentForm = (function () {
    return {
        initialize: function () {
            // When modal opens, load comments
            $('#comment-modal').on('shown.bs.modal', function (event) {
                // Autofocus on subject field
                $('#comment-input-subject').focus();

                // Fetch content according to id
                var episode = $(event.relatedTarget).data('episode');

                // Show the loading circle
                $('#comment-loading').fadeIn();

                var _makeRatingStar = function (empty) {
                    return $('<span>')
                        .addClass('text-warning')
                        .addClass('comment-block-rating-star')
                        .addClass('glyphicon')
                        .addClass('glyphicon-star' + (empty ? '-empty' : ''));
                };

                ApiProvider
                    .commentsForEpisode(episode)
                    .always(_bind($('#comment-loading'), $.prototype.hide))
                    .done(function (comments) {
                        for (var i = 0; i < comments.length; ++i) {
                            var comment = comments[i];

                            $('#comment-comments')
                                .append(
                                $('<div>')
                                    .append(
                                    $('<p>')
                                        .append(
                                        _makeRatingStar(comment.rating < 1),
                                        _makeRatingStar(comment.rating < 2),
                                        _makeRatingStar(comment.rating < 3),
                                        _makeRatingStar(comment.rating < 4),
                                        _makeRatingStar(comment.rating < 5),
                                        '&nbsp;',
                                        comment.message,
                                        $('<span>')
                                            .addClass('h6')
                                            .addClass('text-muted')
                                            .append(
                                            ' posted by ',
                                            $('<a>')
                                                .text(comment.user.firstName +
                                                      ' ' +
                                                      comment.user.lastName),
                                            ' on ',
                                            comment.date))),
                                $('<hr/>'));

                            $('#comment-modal').data('bs.modal').handleUpdate();
                        }
                    })
                    .fail(function (response) {
                        var errors = response.errors;

                        // Append errors to DOM
                        for (var i = 0; i < errors.length; ++i) {
                            $('#comment-messages-errors')
                                .append('- ',
                                errors[i],
                                $('<br/>'));
                        }

                        // Display errors
                        $('#login-errors').fadeIn();
                    })
            }).on('hide.bs.modal', function () {
                $('#comment-comments').empty();

            });

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
        }
    };
})();
