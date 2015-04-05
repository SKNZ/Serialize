var DomComment = (function () {
    var _loadComments = function () {
        DomHelper.showLoading();

        $('#comments-errors')
            .fadeOut();

        $('#comments-error-messages')
            .empty();

        ApiProvider
            .commentsForEpisode(DomStorage.comment.episode)
            .done(function (comments) {
                var where =
                    $('#comments')
                        .find('div[role="main"]');

                comments.forEach(function (comment) {
                    where
                        .append(
                        $('<div>')
                            .addClass('comments-comment')
                            .append(
                            '<hr/>',
                            $('<h5>')
                                .append(
                                comment.rating > 0 ? '★' : '☆',
                                comment.rating > 1 ? '★' : '☆',
                                comment.rating > 2 ? '★' : '☆',
                                comment.rating > 3 ? '★' : '☆',
                                comment.rating > 4 ? '★' : '☆',
                                "&nbsp;",
                                comment.subject),
                            $('<p>')
                                .append(
                                comment.message,
                                "&nbsp;",
                                $('<span>')
                                    .addClass('text-muted')
                                    .append(
                                    'posted by',
                                    "&nbsp;",
                                    $('<a>')
                                        .attr('href', '')
                                        .text(
                                        comment.user.firstName
                                        + ' '
                                        + comment.user.lastName),
                                    ' on ',
                                    comment.date
                                ))));
                });
            })
            .fail(function (errors) {
                // Append errors to DOM
                for (var i = 0; i < errors.length; ++i) {
                    $('#comments-error-messages')
                        .append('- ',
                        errors[i],
                        '<br/>');
                }

                // Display errors
                $('#comments-errors').fadeIn();
            })
            .always(function () {
                DomHelper.hideLoading();
                $('#comments-form')
                    .find('input[type="submit"]')
                    .prop('disabled', false);
            });
    };

    var _onSubmit = function () {
        $('#comments-form')
            .submit(function () {
                DomHelper.showLoading();

                // Build comment request
                var comment = {
                    subject: $('#comments-input-subject').val(),
                    rating: $('#comments-input-rating').val(),
                    message: $('#comments-input-message').val()
                };

                $('#comments-errors')
                    .fadeOut('fast');

                $('#comments-error-messages')
                    .empty();

                $('#comments-form')
                    .find('input[type="submit"]')
                    .prop('disabled', true);

                ApiProvider
                    .commentEpisode(DomStorage.comment.episode, comment)
                    .done(function () {
                        $('.comments-comment').remove();
                        _loadComments();
                        $('#comments-form')[0].reset();
                    })
                    .fail(function (errors) {
                        // Append errors to DOM
                        for (var i = 0; i < errors.length; ++i) {
                            $('#comments-error-messages')
                                .append('- ',
                                errors[i],
                                '<br/>');
                        }

                        // Display errors
                        $('#comments-errors').fadeIn('fast');
                    })
                    .always(function () {

                        $('#comments-form')
                            .find('input[type="submit"]')
                            .prop('disabled', false);

                        DomHelper.hideLoading();
                    });

                event.preventDefault();
            });
    };

    return {
        initialize: function () {
            _onSubmit();
            DomHelper.onJqmPageShow('comments', _loadComments);
            DomHelper.onJqmPageHide('comments', function () {
                $('.comments-comment').remove();
            });
        }
    };
})();