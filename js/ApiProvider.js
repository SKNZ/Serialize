var ApiProvider = (function () {
    var _loggedIn = false;
    var _baseURI = "api/";

    var _currentUser = {
        email: "florandara@gmail.com",
        emailHash: "e00cf05e1611a154bc3f5764cebbc822",
        firstName: "Floran",
        lastName: "NARENJI-SHESHKALANI"
    };

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
                        "florandara@gmail.com")
                    {
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
        latestShows: function () {
            var deferred = $.Deferred();

            _apiRequest("show/latest", "get")
                .done(function (response) {
                    response = {
                        latestShows: [
                            {
                                id: 30,
                                date: '12/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E05',
                                episodeName: 'Swag'
                            },
                            {
                                id: 29,
                                date: '06/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E04',
                                episodeName: 'Swag'
                            },
                            {
                                id: 28,
                                date: '02/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E03',
                                episodeName: 'CupidityAzerty'
                            },
                            {
                                id: 27,
                                date: '28/09/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E02',
                                episodeName: 'Aazekpqsdk'
                            },
                            {
                                id: 26,
                                date: '22/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E01',
                                episodeName: 'Hipster'
                            }
                        ]
                    };
                    deferred.resolve(response.latestShows);
                });

            return deferred.promise();
        },
        yourShows: function () {
            var deferred = $.Deferred();

            _apiRequest("show/latest", "get")
                .done(function (response) {
                    response = {
                        latestShows: [
                            {
                                id: 30,
                                date: '12/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E05',
                                episodeName: 'SwagNpLelTopKek'
                            },
                            {
                                id: 29,
                                date: '06/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E04',
                                episodeName: 'SwagNpLelTopKek'
                            },
                            {
                                id: 28,
                                date: '02/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E03',
                                episodeName: 'SwagNpLelTopKek'
                            },
                            {
                                id: 27,
                                date: '28/09/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E02',
                                episodeName: 'SwagNpLelTopKek'
                            },
                            {
                                id: 26,
                                date: '22/10/2015',
                                name: 'Game of Thrones',
                                season: 'S03',
                                episode: 'E01',
                                episodeName: 'SwagNpLelTopKek'
                            }
                        ]
                    };
                    deferred.resolve(response.latestShows);
                });

            return deferred.promise();
        },
        commentsForEpisode: function (episode) {
            var _deferred = $.Deferred();

            _apiRequest('episode/' + episode + '/comments', "get")
                .always(function (response) {
                    var response = {
                        comments: [
                            {
                                id: 14,
                                date: '12/10/2015',
                                user: {
                                    firstName: "Jean",
                                    lastName: "Balbien"
                                },
                                rating: 5,
                                message: "Coucou, je suis le vomi."
                            },
                            {
                                id: 13,
                                date: '12/10/2015',
                                user: {
                                    firstName: "Jean",
                                    lastName: "Sairien"
                                },
                                rating: 4,
                                message: "J'AIME LES PATES, SURTOUT AVEC DE LA SAUCE AUX PATES."
                            },
                            {
                                id: 12,
                                date: '12/10/2015',
                                user: {
                                    firstName: "Jean",
                                    lastName: "Bombeur"
                                },
                                rating: 3,
                                message: "SALUT C COOL LE SON SORS DES ENCEINTES."
                            },
                            {
                                id: 11,
                                date: '12/10/2015',
                                user: {
                                    firstName: "Jean",
                                    lastName: "Kuhl-Tamer"
                                },
                                rating: 2,
                                message: "Salut j'ai le swag, je suis un hipster mdr swag yolo. Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo."
                            },
                            {
                                id: 10,
                                date: '11/10/2015',
                                user: {
                                    firstName: "Jean",
                                    lastName: "Peuplu"
                                },
                                rating: 1,
                                message: "Salut j'ai le swag, je suis un hipster mdr swag yolo. Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo."
                            }
                        ]
                    };

                    _deferred.resolve(response.comments);
                    //_deferred.reject({
                    //    errors: [
                    //        "You fucked up m8",
                    //        "Your SWAG is underwhelming"
                    //    ]
                    //});
                });

            return _deferred;
        },
        commentEpisode: function (episode, comment) {
            var deferred = $.Deferred();

            _apiRequest("episode/" + episode + "/", "post", {
                comment: comment
            }).always(function (response) {
                if (comment.subject != "cool") {
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
        },
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
                    deferred.resolve(response);
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
        },
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
        },
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
                                        date: '12/26/2015'
                                    },
                                    {
                                        id: 16,
                                        name: 'Gamotron',
                                        season: 'S03',
                                        episode: 'E04',
                                        episodeName: 'Swaggens',
                                        date: '12/25/2015'
                                    },
                                    {
                                        id: 17,
                                        name: 'Gamotron',
                                        season: 'S03',
                                        episode: 'E03',
                                        episodeName: 'Hipster',
                                        date: '12/25/2015'
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
        },
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
    };
})
();
