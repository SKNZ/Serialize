var DomInteraction = (function () {
    var _updateLoginStatus = (function () {
        var _buildLoginForm = function () {
            $("#navbar-right").remove();

            var _makeInputField = function (type, name, placeholder) {
                return $('<div>')
                    .addClass('form-group')
                    .append(
                    $('<input>')
                        .prop('type', type)
                        .prop('name', name)
                        .prop('placeholder', placeholder)
                        .addClass('form-control'));
            };

            var signInButton = $('<button>')
                .prop('type', 'submit')
                .prop('class', 'btn btn-success')
                .html('Sign in'); // @todo Replace html() with text()

            var registerButton = $('<button>')
                .prop('class', 'btn')
                .addClass('button-register')
                .html('Register'); // @todo Replace html() with text()

            return $('<form>')
                .prop('id', 'navbar-right')
                .addClass('navbar-form')
                .addClass('navbar-right')
                .append(_makeInputField('text', 'email', 'Email'))
                .append('\n')
                .append(_makeInputField('password', 'password', 'Password'))
                .append('\n')
                .append(signInButton)
                .append('\n')
                .append(registerButton)
                .append('\n')
                .submit(
                function (event) {
                    ApiProvider.tryLogin({
                        email: $('#navbar-right input[name="email"]').val(),
                        password: $('#navbar-right input[name="password"]').val()
                    }).fail(function (errorMessages) {

                    }).always(_updateLoginStatus);

                    event.preventDefault();
                });
        };

        var _buildProfileBar = function () {
            $("#navbar-right").remove();
            var currentUser = ApiProvider.getCurrentUser();

            var _makeGlyphicon = function (glyphicon, text) {
                return $('<li>')
                    .append(
                    $('<a>')
                        .addClass('glyphicon')
                        .addClass('glyphicon-' + glyphicon)
                        .append($('<div>')
                                    .addClass('navbar-collapsed-right-item')
                                    .addClass('hidden-sm hidden-md hidden-lg')
                                    .text(text)));
            }

            $("#navbar").append(
                $('<ul>')
                    .hide()
                    .prop('id', 'navbar-right')
                    .addClass('nav')
                    .addClass('navbar-nav')
                    .addClass('navbar-right')
                    .append(_makeGlyphicon('envelope', 'Notifications'))
                    .append(_makeGlyphicon('cog', 'Account'))
                    .append(_makeGlyphicon('off', 'Disconnect'))
                    .append(
                    $('<li>')
                        .addClass('hidden-xs')
                        .append(
                        $('<a>')
                            .append(
                            $('<img>')
                                .addClass('img-responsive')
                                .addClass('img-circle')
                                .addClass('navbar-gravatar')
                                .prop('src', 'http://www.gravatar.com/avatar/' +
                                             currentUser.emailHash +
                                             '.jpg?s=19')
                                .load(
                                // We wait for the animation to be loaded,
                                // so the effect looks better
                                function () {
                                    $("#navbar-right").fadeIn(1000);
                                })))));
        };

        var _buildSearchForm = function () {
        };

        var _buildRegisterNowButton = function () {

        };

        return function () {
            var loggedIn = ApiProvider.isLoggedIn();
            // Build right side of navbar
            loggedIn ? _buildProfileBar() : _buildLoginForm();
            loggedIn ? _buildSearchForm() : _buildRegisterNowButton();
        };
    })();

    return {
        initializeDom: function () {
            $('#page-home').show('slide', 1000, function () {
                $('#main-title').animate({
                    marginTop: '0px',
                    marginBottom: '20.100px'
                }, 1000, function () {
                    $('#text-welcome').removeClass('invisible').hide().show('fade', 1000);
                    _updateLoginStatus();
                });
            });
        }
    };
})();
