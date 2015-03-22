var ApiProvider = (function () {
    var _loggedIn = false;
    var _baseURI = "/api/";

    var _currentUser;

    var _apiRequest = function (call, method, data) {
        var deferred = $.Deferred();

        console.log("Sending " + method + ' to "' + call + '"');
        console.log(data);

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
                            if (authCredentials.email ==
                                "florandara@gmail.com") {
                                _loggedIn = true;

                                _currentUser = {
                                    email: "florandara@gmail.com",
                                    emailHash: "e00cf05e1611a154bc3f5764cebbc822",
                                    firstName: "Floran",
                                    lastName: "NARENJI-SHESHKALANI"
                                };

                                deferred.resolve(_currentUser);
                            }
                            else {
                                response = {
                                    errors: [
                                        "You fucked up mate !",
                                        "Alright mate, cheers mate !"
                                    ]
                                };
                                deferred.reject(response);
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
                    _currentUser = {};
                });

            return deferred.promise();
        },
        getCurrentUser: function () {
            return _currentUser;
        },
        isEmailInUse: function (email) {
            var deferred = $.Deferred();

            _apiRequest("user/" + email, "get").always(function (reponse) {
                email != "florandara@gmail.com"
                    ? deferred.resolve()
                    : deferred.reject();
            });

            return deferred.promise();
        },
        tryRegister: function (accountInformation) {
            var deferred = $.Deferred();

            _apiRequest("user/", "put", {
                accountInformation: accountInformation
            }).always(function (response) {
                if (accountInformation.firstName != "Floran") {
                    deferred.resolve(accountInformation);
                } else {
                    response = {
                        errors: [
                            "Couldn't reach the database",
                            "Your first name is invalid"
                        ]
                    };
                    deferred.reject(response);
                }
            });

            return deferred.promise();
        },
        latestShow: function () {
            var deferred = $.Deferred();

            _apiRequest("shows/latest", "get")
                .done(function (response) {
                          response = {
                              latest: [
                                  {
                                      date: '12/10/2015',
                                      name: 'Gamotron',
                                      season: 'S05',
                                      episode: 'E05'
                                  },
                                  {
                                      date: '06/10/2015',
                                      name: 'Gamotron',
                                      season: 'S05',
                                      episode: 'E04'
                                  },
                                  {
                                      date: '02/10/2015',
                                      name: 'Gamotron',
                                      season: 'S05',
                                      episode: 'E03'
                                  },
                                  {
                                      date: '28/09/2015',
                                      name: 'Gamotron',
                                      season: 'S05',
                                      episode: 'E02'
                                  },
                                  {
                                      date: '22/10/2015',
                                      name: 'Gamotron',
                                      season: 'S05',
                                      episode: 'E03'
                                  }
                              ]
                          };
                          deferred.resolve(response);
                      });

            return deferred.promise();
        }
    };
})
();
