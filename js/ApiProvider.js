var ApiProvider = (function () {
    var _loggedIn = false;
    var _baseURI = "api/";

    var _currentUser;

    var _apiRequest = function (call, method, data) {
        var deferred = $.Deferred();

        data = JSON.stringify(data);
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
            var deferred = $.Deferred();

            _apiRequest("user/session", "post", {
                authCredentials: authCredentials
            })
                .done(function (response) {
                    _loggedIn = true;

                    _currentUser = response.currentUser;

                    deferred.resolve(_currentUser);
                })
                .fail(function (response) {
                    deferred.reject(response.errors);
                    _loggedIn = false;
                    _currentUser = {};
                });

            return deferred.promise();
        },
        logOut: function () {
            var deferred = $.Deferred();

            _apiRequest("user/session", "delete")
                .always(
                function () {
                    _loggedIn = false;
                    _currentUser = {};
                    deferred.resolve();
                });

            return deferred.promise();
        },
        getCurrentUser: function () {
            return _currentUser;
        },
        isEmailInUse: function (email) {
            return _apiRequest("user/exists/" +
                encodeURIComponent(email),
                "get");
        },
        tryRegister: function (accountInformation) {
            var deferred = $.Deferred();

            _apiRequest("user/", "put", {
                accountInformation: accountInformation
            })
                .done(_bind(deferred, deferred.resolve))
                .fail(function (response) {
                    deferred.reject(response.errors);
                });

            return deferred.promise();
        },
        latestShows: function () {
            var deferred = $.Deferred();

            _apiRequest("show/latest", "get")
                .done(function (response) {
                    deferred.resolve(response.latestShows);
                });

            return deferred.promise();
        }
        ,
        yourShows: function () {
            var deferred = $.Deferred();

            _apiRequest("show/your", "get")
                .done(function (response) {
                    deferred.resolve(response.yourShows);
                });

            return deferred.promise();
        }
        ,
        commentsForEpisode: function (episode) {
            var _deferred = $.Deferred();

            _apiRequest('episode/' + episode + '/comment', "get")
                .always(function (response) {
                    _deferred.resolve(response.comments);
                });

            return _deferred;
        }
        ,
        commentEpisode: function (episode, comment) {
            var deferred = $.Deferred();

            _apiRequest("episode/" + episode + "/", "post", {
                comment: comment
            }).always(function (response) {
                if (comment.subject != "cool") {<
                    deferred.resolve(comment);
                } else {
                    response = {
                        errors: [
                            "Couldn't reach the database",
                            "Your subject is invalid"
                        ]
                    };
                    deferred.reject(response);
                }
            });

            return deferred.promise();
        }
        ,
        search: function (search) {
            var deferred = $.Deferred();

            _apiRequest("show/search", "post", {
                search: search
            }).always(function (response) {
                if (search != "aze") {
                    response = {
                        shows: (search == "qsd" ? [] : [
                            {
                                id: 12,
                                name: 'Game of Thrones',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'House of Cards',
                                subscribed: true
                            },
                            {
                                id: 15,
                                name: 'NCIS',
                                subscribed: true
                            },
                            {
                                id: 16,
                                name: 'Person of Interest',
                                subscribed: false
                            },
                            {
                                id: 15,
                                name: 'Person of Swagterest',
                                subscribed: false
                            },
                            {
                                id: 14,
                                name: 'Tards of Interest',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'Les hipsters a Miami',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'Les hipsters a Miami',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'Les hipsters a Miami',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'Les hipsters a Miami',
                                subscribed: false
                            },
                            {
                                id: 13,
                                name: 'Les hipsters a Miami',
                                subscribed: false
                            }
                        ])
                    };
                    deferred.resolve(response.shows);
                } else {
                    response = {
                        errors: [
                            "Couldn't reach the database",
                            "Your search request was invalid"
                        ]
                    };
                    deferred.reject(response);
                }
            });

            return deferred.promise();
        }
        ,
        toggleSubscription: function (showId) {
            var deferred = $.Deferred();

            _apiRequest("show/subscribe", "post", {
                show: showId
            }).always(function (response) {
                if (showId != 12) {
                    response = {
                        subscribed: false
                    };
                    deferred.resolve(response.subscribed);
                } else {
                    response = {
                        errors: [
                            "Couldn't reach the database",
                            "Your didn't pay for this DLC m8"
                        ]
                    };
                    deferred.reject(response.errors);
                }
            });

            return deferred.promise();
        }
        ,
        showData: function (showId) {
            var deferred = $.Deferred();

            _apiRequest("show/" + showId, "get")
                .always(function (response) {
                    if (showId != 13) {
                        response = {
                            show: {
                                id: showId,
                                name: 'Game of thrones',
                                subscribed: true,
                                episodes: [
                                    {
                                        id: 15,
                                        name: 'Gamotron',
                                        season: 'S03',
                                        episode: 'E05',
                                        episodeName: 'TopKek',
                                        date: '12/26/2015',
                                        showId: 13

                                    },
                                    {
                                        id: 16,
                                        name: 'Gamotron',
                                        season: 'S03',
                                        episode: 'E04',
                                        episodeName: 'Swaggens',
                                        date: '12/25/2015',
                                        showId: 13
                                    },
                                    {
                                        id: 17,
                                        name: 'Gamotron',
                                        season: 'S03',
                                        episode: 'E03',
                                        episodeName: 'Hipster',
                                        date: '12/25/2015',
                                        showId: 13
                                    }
                                ]
                            }
                        };
                        deferred.resolve(response.show);
                    } else {
                        response = {
                            errors: [
                                "Couldn't reach the database",
                                "Your didn't pay for this DLC m8"
                            ]
                        };
                        deferred.reject(response);
                    }
                });

            return deferred.promise();
        }
        ,
        contact: function (messageInformation) {
            var deferred = $.Deferred();

            _apiRequest("contact", "post", {
                messageInformation: messageInformation
            })
                .always(function (response) {
                    if (messageInformation.subject != "aze") {
                        response = {
                            success: true
                        };
                        deferred.resolve(response.success);
                    } else {
                        response = {
                            errors: [
                                "Couldn't reach the database",
                                "Get your wallet out, this mail gonna cost you shit"
                            ]
                        };
                        deferred.reject(response);
                    }
                });

            return deferred.promise();
        }
    }
        ;
})
();
