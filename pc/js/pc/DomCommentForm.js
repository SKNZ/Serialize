var DomCommentForm = (function () {
    return {
        initialize: function () {
            $('.comment-input-rating-star').hover(function () {
                $(this)
                    .prevAll('.comment-input-rating-start')
                    .addBack()
                    .removeClass('glyphicon-star-empty')
                    .addClass('glyphicon-star');

                $(this)
                    .nextAll('.comment-input-rating-star')
                    .removeClass('glyphicon-star')
                    .addClass('glyphicon-star-empty');

                $('#comment-input-rating')
                    .val($('.comment-input-rating-star.glyphicon-star').length);
            });
        }
    };
})();
