var ApiProvider = (function () {
    var _loggedIn = false;
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
    };

    return {
        isLoggedIn: function () {
            return _loggedIn;
        },
        tryLogin: function (authCredentials) {
            console.log("attempting login for user " +
                        authCredentials.email +
                        ":" +
                        authCredentials.password);

            var deferred = $.Deferred();

            _apiRequest("user/session", "post", {
                authCredentials: authCredentials
            })/*.done(function (response) {
             // @TODO parse user from response
             }).fail(_bind(deferred, deferred.fail))*/
                .always(function (response) {
                            if (authCredentials.email == "azerty") {
                                _loggedIn = true;
                                deferred.resolve(_currentUser);
                            }
                            else {
                                deferred.reject(false);
                                _loggedIn = false;
                            }
                        });

            return deferred.promise();
        },
        logOut: function () {
            console.log("attempting logout");

            var deferred = $.Deferred();

            _apiRequest("user/session", "delete")/*.done(function (response) {
             // @TODO parse user from response
             }).fail(_bind(deferred, deferred.fail))*/
                .always(
                function (response) {
                    _loggedIn = false;
                    deferred.resolve(_currentUser);
                });

            return deferred.promise();
        },
        getCurrentUser: function () {
            return _currentUser;
        },
        isEmailInUse: function (email) {
            var deferred = $.Deferred();

            _apiRequest("user/exists", "post", {
                email: email
            }).always(function (reponse) {
                email != "florandara@gmail.com"
                ? deferred.resolve()
                : deferred.reject();
            });

            return deferred.promise();
        }
    };
})
();
