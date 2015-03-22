var DomCommentForm = (function () {
    return {
        initialize: function () {
            // Autofocus on subject field when modal opens
            $('#comment-modal').on('shown.bs.modal', function () {
                $('#comment-input-subject').focus();
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
