var DomLoginStatus = (function () {
    var _wasLoggedIn = ApiProvider.isLoggedIn();

    return {
        updateLoginStatus: function (init) {
            init = init || false;
            var loggedIn = ApiProvider.isLoggedIn();

            if (_wasLoggedIn == loggedIn && !init) {
                return;
            }

            $('#login-link').toggle(!loggedIn);
            $('#disconnect').toggle(loggedIn);
            $('#your-shows-link').toggle(loggedIn);
            $('#search-link').toggle(loggedIn);
            loggedIn ? DomShowList.loadYourShows() : DomShowList.hideYourShows();

            _wasLoggedIn = loggedIn;
        }
    };
})();
