var DomInteraction = (function () {
    var _updateLoginStatus = (function () {
        var _buildLoginForm = function () {
            $("#navbar-right").remove();

            var _makeInputField = function (type, name, placeholder) {
                return $('<div>')
                    .addClass('form-group')
                    .append(
                    $('<input>')
                        .attr('type', type)
                        .attr('name', name)
                        .attr('placeholder', placeholder)
                        .addClass('form-control'));
            };

            var signInButton = $('<button>')
                .attr('type', 'submit')
                .attr('class', 'btn btn-success')
                .html('Sign in'); // @todo Replace html() with text()

            var registerButton = $('<button>')
                .attr('class', 'btn')
                .addClass('button-register')
                .html('Register'); // @todo Replace html() with text()

            $("#navbar").append(
                $('<form>')
                    .attr('id', 'navbar-right')
                    .addClass('navbar-form')
                    .addClass('form-inline')
                    .addClass('navbar-right')
                    .append(
                        _makeInputField('text', 'email', 'Email'),
                        '\n',
                        _makeInputField('password', 'password', 'Password'),
                        '\n',
                        signInButton,
                        '\n',
                        registerButton,
                        'n')
                    .submit(
                    function (event) {
                        ApiProvider.tryLogin({
                            email:
                                $('#navbar-right input[name="email"]').val(),
                            password:
                                $('#navbar-right input[name="password"]').val()
                        }).fail(function (errorMessages) {

                        }).always(_updateLoginStatus);

                        event.preventDefault();
                    }).fadeIn('slow'));
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
                    .attr('id', 'navbar-right')
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
                                .attr('src', 'http://www.gravatar.com/avatar/' +
                                currentUser.emailHash +
                                '.jpg?s=35')
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
            $("#text-welcome").remove();

            $("block-welcome-register")
                .append(
                $("<span>")
                    .attr()
                    .append(
                    $("<button>")
                        .attr("type", "button")
                        .addClass("button-register")
                        .addClass("btn")
                        .addClass("btn-primary")
                        .addClass("center-block")
                        .text("Register now !")
                ));
        };

        return function () {
            var loggedIn = ApiProvider.isLoggedIn();
            // Build right side of navbar
            loggedIn ? _buildLoginForm() : _buildProfileBar();
            loggedIn ? _buildSearchForm() : _buildRegisterNowButton();
        };
    })();

    return {
        initializeDom: function () {
            $('#page-home').show('slide', 'slow', function () {
                $('#main-title').animate({
                    marginTop: '0px',
                    marginBottom: '20.100px'
                }, 'slow', function () {
                    $('#text-welcome').removeClass('invisible').hide().show('fade',
                        'slow');
                    _updateLoginStatus();
                });
            });
        }
    };
})();
