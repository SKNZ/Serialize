var DomShow = (function () {
    return {
        initialize: function () {
            DomHelper.onJqmPageShow('show', function (e, ui) {
                DomHelper.showLoading();
                $('#show-errors')
                    .fadeOut(function () {
                        $(this).find('span').empty();
                    });

                ApiProvider
                    .showData(DomStorage.show.showId)
                    .done(function (show) {
                        $('#show').find('h1')
                            .text(show.name);

                        $('#show-subscribe')
                            .text(show.subscribed
                                ? 'Unsubscribe'
                                : 'Subscribe')
                            .off('click')
                            .click(function () {
                                DomHelper.showLoading();
                                $('#show-errors')
                                    .fadeOut(function () {
                                        $(this).find('span').empty();
                                    });

                                ApiProvider
                                    .toggleSubscription(show.id)
                                    .done(function (subscribed) {
                                        $('#show-subscribe')
                                            .text(subscribed
                                                ? 'Unsubscribe'
                                                : 'Subscribe');
                                    })
                                    .fail(function (response) {
                                        var errors = response.errors;

                                        // Append errors to DOM
                                        for (var i = 0; i < errors.length; ++i) {
                                            $('#show-error-messages')
                                                .append('- ',
                                                errors[i],
                                                '<br/>');
                                        }

                                        // Display errors
                                        $('#show-errors').fadeIn();
                                    })
                                    .always(function () {
                                        DomHelper.hideLoading();
                                    });
                            });

                        DomShowList.loadShowShows(show.episodes);
                    })
                    .fail(function (response) {
                        var errors = response.errors;

                        // Append errors to DOM
                        for (var i = 0; i < errors.length; ++i) {
                            $('#show-error-messages')
                                .append('- ',
                                errors[i],
                                '<br/>');
                        }

                        // Display errors
                        $('#show-errors').fadeIn();
                    })
                    .always(function () {
                        DomHelper.hideLoading();
                    });
            });
            DomHelper.onJqmPageHide('show', function () {
                $('#show').find('.ui-collapsible').empty();
            });
        }
    }
})();