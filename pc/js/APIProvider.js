var ApiProvider = (function () {
    var _loggedIn = false;

    return {
        isLoggedIn: function () {
            return _loggedIn;
        },
        tryLogin: function (username, password) {
            console.log("attempting login for user " + username + ":" + password);
            var d = new $.Deferred();
            setTimeout(function() {
                _loggedIn = !_loggedIn;
                d.resolve();
            }, 1000);
            return d.promise();
        }
    }
})();
