var DomShows = (function () {
    const _btdiggURL = 'http://btdigg.org/search?q=';
    const _subsceneURL = 'http://subscene.com/subtitles/release?q=';

    var _addShow = function (show, tbody) {
        tbody.append(
            $('<tr>')
                .append(
                $('<td>').text(show.date),
                $('<td>').text(show.name),
                $('<td>').text(show.season),
                $('<td>').text(show.episode),
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

    var _addLatestShows = function () {
        ApiProvider
            .latestShows()
            .always(_bind($('#home-latest-shows-loading'),
                $.prototype.hide))
            .done(function (latestShows) {
                for (var i = 0; i < latestShows.length; ++i)
                {
                    var tbody = $('#home-latest-shows-table').find('tbody');
                    _addShow(latestShows[i], tbody);
                }

                $('#home-latest-shows-table').show('fast');
                $('#home-latest-shows-sample').remove();
            })
            .fail(function () {
                $('#home-latest-shows-error').fadeIn();
            });
    };

    return {
        initialize: function () {
            _addLatestShows();
        }
    }
})();
