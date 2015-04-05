var DomShowList = (function () {
    var _addShow = function (where, show) {
        where
        .append(
            $('<div>')
                .append(
                $('<h4>')
                    .text(show.name +
                    ' ' +
                    show.season +
                    ' ' +
                    show.episode),
                $('<ul>')
                    .append(
                    $('<li>').html('<b>Date</b>: ' + show.date),
                    $('<li>').html('<b>Name</b>: ' + show.episodeName),
                    $('<li>')
                        .addClass(
                        Date.parse(show.date) > new Date()
                            ? 'ui-state-disabled'
                            : '')
                        .append(
                        $('<a>')
                            .text('Yaaaarrr !')
                            .attr('href',
                            encodeURI(BTDIGG_URL +
                            show.name +
                            ' ' +
                            show.season +
                            show.episode))),
                    $('<li>')
                        .addClass(
                        Date.parse(show.date) > new Date()
                            ? 'ui-state-disabled'
                            : '')
                        .append(
                        $('<a>')
                            .text('Subtitles !')
                            .attr('href',
                            encodeURI(SUBSCENE_URL +
                            show.name +
                            ' ' +
                            show.season +
                            show.episode))),
                    $('<li>')
                        .addClass(
                        Date.parse(show.date) > new Date()
                            ? 'ui-state-disabled'
                            : '')
                        .append(
                        $('<a>')
                            .text('See the comments')
                            .attr('href', '#comments')
                            .click(function () {
                                DomStorage.comment.episode = show.id;
                            })),
                    $('<li>')
                        .append(
                        $('<a>')
                            .text('More from this show')
                            .click(function () {
                                DomStorage.show.showId = show.showId;
                            })
                            .attr('href', '#show')))
                    .listview())
                .collapsible());
    };

    return {
        initialize: function () {
            DomHelper.showLoading();
            $('#latest-shows-errors')
                .fadeOut();

            $('#latest-shows-error-messages')
                .empty();

            ApiProvider
                .latestShows()
                .done(function (latestShows) {
                    var where = $('#latest-shows').find('div[role="main"]');
                    latestShows.forEach(function (show) {
                        _addShow(where, show);
                    });
                })
                .fail(function (errors) {
                    // Append errors to DOM
                    for (var i = 0; i < errors.length; ++i) {
                        $('#latest-shows-error-messages')
                            .append('- ',
                            errors[i],
                            '<br/>');
                    }

                    // Display errors
                    $('#latest-shows-errors').fadeIn();
                })
                .always(function () {
                    DomHelper.hideLoading();
                });
        },
        hideYourShows: function () {
            $('#your-shows-link').hide();
        },
        loadYourShows: function () {
            DomHelper.showLoading();
            $('#your-shows-errors')
                .fadeOut();

            $('#your-shows-error-messages')
                .empty();

            ApiProvider
                .yourShows()
                .done(function (yourShows) {
                    var where = $('#your-shows').find('div[role="main"]');
                    yourShows.forEach(function (show) {
                        _addShow(where, show);
                    });
                })
                .fail(function (errors) {
                    // Append errors to DOM
                    for (var i = 0; i < errors.length; ++i) {
                        $('#your-shows-error-messages')
                            .append('- ',
                            errors[i],
                            '<br/>');
                    }

                    // Display errors
                    $('#your-shows-errors').fadeIn();
                })
                .always(function () {
                    DomHelper.hideLoading();
                });
        },
        loadShowShows: function (episodes) {
            var where = $('#show').find('div[role="main"]');

            episodes.forEach(function (episode) {
                _addShow(where, episode);
            });

            where.find('ul li:last-child').remove();
        }
    };
})();
