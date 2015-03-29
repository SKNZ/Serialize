var DomShowList = (function () {
    const _btdiggURL = 'http://btdigg.org/search?q=';
    const _subsceneURL = 'http://subscene.com/subtitles/release?q=';

    var _addShow = function (show, tbody) {
        tbody.append(
            $('<tr>')
                .append(
                $('<td>').text(show.date),
                $('<td>')
                    .append(
                    $('<a>')
                        .attr('data-toggle', 'modal')
                        .attr('href', '#show-modal')
                        .data('show-id', show.id)
                        .data('show-name', show.name)
                        .text(show.name)),
                $('<td>').text(show.season),
                $('<td>').text(show.episode),
                $('<td>').text(show.episodeName),
                $('<td>')
                    .append(
                    $('<a>')
                        .addClass('btn ')
                        .addClass('btn-sm')
                        .addClass('btn-primary')
                        .addClass('btn-block')
                        .text('Yaaaarrr !')
                        .attr('href',
                        encodeURI(_btdiggURL +
                        show.name +
                        ' ' +
                        show.season +
                        show.episode))),
                $('<td>')
                    .append(
                    $('<a>')
                        .addClass('btn')
                        .addClass('btn-sm')
                        .addClass('btn-info')
                        .addClass('btn-block')
                        .text('Subs !')
                        .attr('href',
                        encodeURI(_subsceneURL +
                        show.name +
                        ' ' +
                        show.season +
                        show.episode))),
                $('<td>')
                    .append(
                    $('<button>')
                        .addClass('btn')
                        .addClass('btn-sm')
                        .addClass('btn-success')
                        .addClass('btn-block')
                        .addClass(Date.parse(show.date) >
                        new Date() ? 'disabled' : '')
                        .attr('data-episode', show.id)
                        .text('Comments')
                        .click(function () {
                            if (ApiProvider.isLoggedIn()) {
                                $('#comment-modal').modal();
                            } else {
                                var alertRequiresLogin =
                                    $('#alert-requires-login');

                                alertRequiresLogin
                                    .slideDown();

                                setTimeout(
                                    _bind(
                                        alertRequiresLogin,
                                        $.prototype.slideUp),
                                    5000);
                            }
                        }))));
    };

    return {
        initialize: function () {
            ApiProvider
                .latestShows()
                .always(_bind($('#home-latest-shows-loading'),
                    $.prototype.hide))
                .done(function (latestShows) {
                    var table = $('#home-latest-shows-table');
                    var tbody = table.find('tbody');

                    for (var i = 0; i < latestShows.length; ++i) {
                        _addShow(latestShows[i], tbody);
                    }

                    table.show('fast');
                    $('#home-latest-shows-sample').remove();
                })
                .fail(function () {
                    $('#home-latest-shows-error').fadeIn();
                });
        },
        loadYourShows: function () {
            $('#home-your-shows-loading')
                .fadeIn();

            $('#home-your-shows-table').fadeOut();

            $('#home-your-shows')
                .slideDown();

            ApiProvider
                .yourShows()
                .always(function ()  {
                    $('#home-your-shows-loading').hide();
                })
                .done(function (latestShows) {
                    var table = $('#home-your-shows-table');
                    var tbody = table.find('tbody');

                    latestShows.forEach(function (episode) {
                        _addShow(episode, tbody);
                    });

                    table.show('fast');
                    $('#home-your-shows-sample').remove();
                })
                .fail(function () {
                    $('#home-your-shows-error').fadeIn();
                });
        },
        hideYourShows: function () {
            $('#home-your-shows')
                .fadeOut(function () {
                    $(this)
                        .find('tr:not(:first)')
                        .remove();
                });
        },
        addShowShows: function (episodes) {
            var tbody = $('#show-shows-table').find('tbody');

            episodes.forEach(function (episode) {
                _addShow(episode, tbody);
            });
        }
    }
})();
