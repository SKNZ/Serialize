var ApiProvider = (function () {
    var _loggedIn = true;
    var _baseURI = "/api/";

    var _currentUser = {
        email: "florandara@gmail.com",
        emailHash: "e00cf05e1611a154bc3f5764cebbc822",
        firstName: "Floran",
        lastName: "NARENJI-SHESHKALANI"
    };

    var _apiRequest = function (call, method, data) {
        var deferred = $.Deferred();

        console.log("Sending " + method + ' to "' + call + '"');

        setTimeout(function () {
            deferred.resolve({});
        }, 1000);

        return deferred.promise();
    }

    return {
        isLoggedIn: function () {
            return _loggedIn;
        },
        tryLogin: function (authCredentials) {
            //console.log("attempting login for user " + authCredentials.email + ":" + authCredentials.password);

            var deferred = $.Deferred();

            _apiRequest("user/login", "post", {
                authCredentials: authCredentials
            }).done(function (response) {
                // @TODO parse user from response
                deferred.resolve(_currentUser);
            }).fail(_bind(deferred, deferred.fail));

            return deferred.promise();
        },
        getCurrentUser: function () {
            return _currentUser;
        }
    }
})();
