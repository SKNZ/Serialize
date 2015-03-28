var DomSearch = (function () {
    var _searchTimer;
    var _lastSearch;

    var _doSearch = function (search) {
        ApiProvider
            .search(search)
            .always(_bind($('#home-search-results'), $.prototype.empty))
            .done(function (results) {
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
                            .css('display', 'inline-block')
                            .text(show.name)
                            .append(
                            '&nbsp;',
                            (show.subscribed
                                ? $('<span>')
                                .addClass('subscribeState')
                                .addClass('glyphicon glyphicon-ok')
                                : ''))
                            .click(function () {
                                var that = $(this);

                                that.find('.subscribeState')
                                    .remove();

                                that.append(
                                    $('<img>')
                                        .addClass('subscribeState')
                                        .attr('src', 'img/loading.gif'));

                                $('#home-search-subscribe-errors')
                                    .fadeOut(
                                    _bind(
                                        $('#home-search-subscribe-error-messages'),
                                        $.prototype.empty));

                                ApiProvider
                                    .subscribe(show.id)
                                    .always(function () {
                                        that.find('.subscribeState').remove();
                                    })
                                    .done(function (response) {
                                        if (response.subscribed) {
                                            that.append(
                                                $('<span>')
                                                    .addClass('subscribeState')
                                                    .addClass('glyphicon')
                                                    .addClass('glyphicon-ok'));
                                        }
                                    })
                                    .fail(function (response) {
                                        var errors = response.errors;

                                        // Append errors to DOM
                                        for (var i = 0;
                                            i < errors.length;
                                            ++i)
                                        {
                                            $('#home-search-subscribe-error-messages')
                                                .append('- ',
                                                errors[i],
                                                $('<br/>'));
                                        }

                                        $('#home-search-subscribe-errors').fadeIn();
                                    });
                            })
                            .fadeIn());
                });
            })
            .fail(function (response) {
                var errors = response.errors;

                // Append errors to DOM
                for (var i = 0; i < errors.length; ++i) {
                    $('#home-search-error-messages')
                        .append('- ',
                        errors[i],
                        $('<br/>'));
                }

                $('#home-search-errors').fadeIn();
            })
            .always(_bind($('#home-search-loading'), $.prototype.hide));
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
