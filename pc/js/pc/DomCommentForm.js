var DomCommentForm = (function () {
    return {
        initialize: function () {
            $('.comment-input-rating-star').hover(function () {
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
