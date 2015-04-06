var ApiProvider = (function () {
    var _loggedIn = false;
    var _baseURI = "api/";

    var _currentUser;

    var _apiRequest = function (call, method, data) {
        var deferred = $.Deferred();

        console.log(JSON.stringify(data));
        $.ajax({
            url: _baseURI + call,
            method: method,
            data: JSON.stringify(data),
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            console.log('TOPKEK ' + textStatus);
            console.log(data);
            if (!data.success) {
                deferred.reject(data)
            } else {
                deferred.resolve(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('TOPKEK ' + textStatus);
            console.log(errorThrown);
            deferred.reject({errors: ['Unknown server error', errorThrown]});
        });

        return deferred.promise();
    };

    return {
        checkLogin: function () {
            var deferred = $.Deferred();

            _apiRequest('user/session', 'get')
                .done(function (response) {
                    _loggedIn = true;
                    _currentUser = response.currentUser;
                    deferred.resolve();
                })
                .fail(function () {
                    _loggedIn = false;
                    _currentUser = {};
                    deferred.reject();
                });

            return deferred;
        },
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
        },
        yourShows: function () {
            var deferred = $.Deferred();

            _apiRequest("show/your", "get")
                .done(function (response) {
                    deferred.resolve(response.yourShows);
                });

            return deferred.promise();
        },
        commentsForEpisode: function (episode) {
            var deferred = $.Deferred();

            _apiRequest('episode/' + episode + '/comment', "get")
                .done(function (response) {
                    deferred.resolve(response.comments);
                })
                .fail(function (response) {
                    deferred.reject(response.errors);
                });

            return deferred;
        },
        commentEpisode: function (episode, comment) {
            var deferred = $.Deferred();

            _apiRequest("episode/" + episode + "/comment", "post", {
                comment: comment
            })
                .done(_bind(deferred, deferred.resolve))
                .fail(function (response) {
                    deferred.reject(response.errors);
                });

            return deferred.promise();
        },
        search: function (search) {
            var deferred = $.Deferred();

            _apiRequest("show/search", "post", {
                search: search
            }).done(function (response) {
                deferred.resolve(response.shows);
            }).fail(function (response) {
                deferred.reject(response.errors);
            });

            return deferred.promise();
        },
        toggleSubscription: function (showId, subscribed) {
            var deferred = $.Deferred();

            _apiRequest("show/" + showId + "/subscribe", "post", {
                subscribed: subscribed
            })
                .done(function (response) {
                    deferred.resolve(response.subscribed);
                }).fail(function (response) {
                    deferred.reject(response.errors);
                });

            return deferred.promise();
        },
        showData: function (showId) {
            var deferred = $.Deferred();

            _apiRequest("show/" + showId, "get")
                .done(function (response) {
                    deferred.resolve(response.show);
                }).fail(function (response) {
                    deferred.reject(response.errors);
                });

            return deferred.promise();
        },
        contact: function (messageInformation) {
            var deferred = $.Deferred();

            _apiRequest("contact", "post", {
                messageInformation: messageInformation
            }).done(function (response) {
                deferred.resolve(response.success);
            }).fail(function (response) {
                deferred.reject(response.errors);
            });

            return deferred.promise();
        }
    };
})();
