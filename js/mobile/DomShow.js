var DomShow = (function () {
    return {
        initialize: function () {
            DomHelper.onJqmPageShow('show', function (e, ui) {
                DomHelper.showLoading();
                $('#show-errors')
                    .fadeOut();

                $('#your-shows-messages')
                    .empty();

                ApiProvider
                    .showData(DomStorage.show.showId)
                    .done(function (show) {
                        $('#show')
                            .find('h1')
                            .text(show.name);

                        $('#show-subscribe')
                            .text(show.subscribed
                                ? 'Unsubscribe'
                                : 'Subscribe')
                            .off('click')
                            .click(function () {
                                DomHelper.showLoading();
                                $('#show-errors')
                                    .fadeOut();

                                $('#show-error-messages')
                                    .empty();

                                ApiProvider
                                    .toggleSubscription(show.id,
                                    !show.subscribed)
                                    .done(function (subscribed) {
                                        $('#show-subscribe')
                                            .text(subscribed
                                                ? 'Unsubscribe'
                                                : 'Subscribe');
                                        show.subscribed = subscribed;
                                    })
                                    .fail(function (errors) {
                                        // Append errors to DOM
                                        for (var i = 0;
                                            i <
                                            errors.length;
                                            ++i)
                                        {
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
                    .fail(function (errors) {
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