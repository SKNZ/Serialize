var DomSearch = (function () {
    var _searchTimer;
    var _lastSearch;

    var _doSearch = function (search) {
        ApiProvider
            .search(search)
            .always(_bind($('#home-search-results'), $.prototype.empty))
            .done(function (results) {
                $('#home-search-loading').hide();
                if (!results.shows.length) {
                    $('#home-search-noresults').fadeIn();
                    return;
                }

                results.shows.forEach(function (show) {
                    $('#home-search-results')
                        .append(
                        $('<span>')
                            .addClass('col-md-2')
                            .addClass('btn')
                            .attr('data-toggle', 'modal')
                            .attr('href', '#show-modal')
                            .css('display', 'inline-block')
                            .text(show.name)
                            .data('show-id', show.id)
                            .data('show-name', show.name)
                            .append(
                            '&nbsp;',
                            (show.subscribed
                                ? $('<span>')
                                .addClass('subscribeState')
                                .addClass('glyphicon glyphicon-ok')
                                : '')));
                });
            })
            .fail(function (response) {
                $('#home-search-loading').hide();
                var errors = response.errors;

                // Append errors to DOM
                for (var i = 0; i < errors.length; ++i) {
                    $('#home-search-error-messages')
                        .append('- ',
                        errors[i],
                        $('<br/>'));
                }

                $('#home-search-errors').fadeIn();
            });
    };
    return {
        inputSearch: function (search) {
            if (search == _lastSearch) {
                return;
            }

            if (!!search) {
                $('#home-search').slideDown();
                $('#home-search-noresults').fadeOut();
                $('#home-search-results').empty();
                $('#home-search-errors')
                    .fadeOut(
                    _bind(
                        $('#home-search-error-messages'),
                        $.prototype.empty));
                $('#home-search-loading').fadeIn();

                clearTimeout(_searchTimer);
                _searchTimer = setTimeout(function () {
                    _doSearch(search);
                }, 1000);
            } else {
                $('#home-search').slideUp();
            }

            _lastSearch = search;
        }
    }
})();
