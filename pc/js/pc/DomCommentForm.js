var DomCommentForm = (function () {
    return {
        initialize: function () {
            // When modal opens
            $('#comment-modal').on('shown.bs.modal', function (event) {
                // Autofocus on subject field
                $('#comment-input-subject').focus();

                // Fetch content according to id
                var episode = $(event.relatedTarget).data('episode');

                ApiProvider
                    .commentsForEpisode(episode)
                    .always(function () {
                        $('#comment-loading').hide();
                    })
                    .done(function (comments) {

                    })
                    .fail(function() {

                    });
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
