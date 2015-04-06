var DomSearch = (function () {
    return {
        initialize: function () {
            $('#search-form')
                .submit(function () {
                    var val = $('#search-input-query').val();

                    $('#search-form')
                        .find('input[type="submit"]')
                        .prop('disabled',  true);

                    $('#search-errors')
                        .fadeOut();

                    $('#search-error-messages')
                        .empty();

                    if (val) {
                        DomHelper.showLoading();
                        $('.search-result').remove();

                        ApiProvider
                            .search(val)
                            .done(function (shows) {
                                var where = $('#search').find('[role="main"]');

                                shows.forEach(function (show) {
                                    where
                                        .append(
                                        $('<a>')
                                            .attr('href', '#show')
                                            .addClass('search-result')
                                            .addClass('ui-btn')
                                            .addClass('ui-corner-all')
                                            .addClass('ui-btn-icon-right')
                                            //.addClass('ui-btn-inherit')
                                            .addClass('ui-icon-arrow-r')
                                            .text(show.name)
                                            .click(function () {
                                                DomStorage.show.showId =
                                                    show.id;
                                            }));
                                })
                            })
                            .fail(function (errors) {
                                // Append errors to DOM
                                for (var i = 0; i < errors.length; ++i) {
                                    $('#search-error-messages')
                                        .append('- ',
                                        errors[i],
                                        '<br/>');
                                }

                                // Display errors
                                $('#search-errors').fadeIn();
                            })
                            .always(function () {
                                $('#search-form')
                                    .find('input[type="submit"]')
                                    .prop('disabled',  false);

                                DomHelper.hideLoading();
                            });
                    }

                    event.preventDefault();
                });
        }
    };
})();
