var DomSearch = (function () {
    return {
        doSearch: function (search) {
            ApiProvider
                .search(search)
                .done(function (results) {
                    if (!results.shows.length) {
                        $('#home-search-noresults').fadeIn();
                        return;
                    }

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
                .always(_bind($('#home-search-loading'), $.prototype.fadeOut));
        }
    }
})();
