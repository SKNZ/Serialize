var DomInteraction = (function () {
    var wasLoggedIn = ApiProvider.isLoggedIn();

    var _updateLoginStatus = (function () {
        var _buildLoginForm = function () {
            $('#navbar-right').remove();

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
                .addClass('btn')
                .addClass('btn-success')
                .html('Sign in'); // @todo Replace html() with text()

            var registerButton = $('<button>')
                .attr('type', 'reset')
                .addClass('btn')
                .addClass('button-register')
                .click(_bind($('#registrationModal'), $.prototype.modal))
                .html('Register'); // @todo Replace html() with text()

            $('#navbar').append(
                $('<form>')
                    .attr('id', 'navbar-right')
                    .addClass('navbar-form')
                    .addClass('form-inline')
                    .addClass('navbar-right')
                    .append(
                    /*_makeInputField('text', 'email', 'Email'),
                     '\n',
                     _makeInputField('password', 'password', 'Password'),
                     '\n',*/
                    signInButton,
                    '\n',
                    registerButton,
                    '\n')
                    .submit(
                    function (event) {
                        ApiProvider.tryLogin({
                                                 email: $('#navbar-right input[name="email"]').val(),
                                                 password: $('#navbar-right input[name="password"]').val()
                                             }).fail(function (errorMessages) {

                        }).always(_updateLoginStatus);

                        event.preventDefault();
                    }).fadeIn('slow'));
        };

        var _buildProfileBar = function () {
            $('#navbar-right').remove();
            var currentUser = ApiProvider.getCurrentUser();

            var _makeGlyphicon = function (glyphicon, text) {
                return $('<li>')
                    .append(
                    $('<a>')
                        .attr('href', '#')
                        .addClass('glyphicon')
                        .addClass('glyphicon-' + glyphicon)
                        .append($('<div>')
                                    .addClass('navbar-collapsed-right-item')
                                    .addClass('hidden-sm hidden-md hidden-lg')
                                    .text(text)));
            };

            $('#navbar').append(
                $('<ul>')
                    .hide()
                    .attr('id', 'navbar-right')
                    .addClass('nav')
                    .addClass('navbar-nav')
                    .addClass('navbar-right')
                    .append(_makeGlyphicon('envelope', 'Notifications'))
                    .append(_makeGlyphicon('cog', 'Account'))
                    .append(
                    _makeGlyphicon('off', 'Disconnect')
                        .click(function () {
                                   ApiProvider
                                       .logOut()
                                       .always(_updateLoginStatus);
                               }))
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
                                // We wait for the gravatar image to be loaded,
                                // so the effect looks better
                                function () {
                                    $('#navbar-right').fadeIn(1000);
                                })))));
        };

        var _buildSearchForm = function () {
            $('#block-welcome-register').empty();

        };

        var _buildRegisterNowButton = function () {
            $('#block-welcome-register')
                .empty()
                .append(
                $('<span>')
                    .append(
                    $('<button>')
                        .attr('type', 'button')
                        .addClass('button-register')
                        .addClass('btn')
                        .addClass('btn-primary')
                        .addClass('center-block')
                        .click(_bind($('#registrationModal'),
                                     $.prototype.modal))
                        .text('Register now !')
                ));
        };

        return function (init) {
            init = init || false;
            var loggedIn = ApiProvider.isLoggedIn();

            if (wasLoggedIn == loggedIn && !init) {
                return;
            }

            // Build right side of navbar
            loggedIn ? _buildProfileBar() : _buildLoginForm();
            loggedIn ? _buildSearchForm() : _buildRegisterNowButton();

            wasLoggedIn = loggedIn;
        };
    })();

    var _registrationFormValidation = function () {
        // Initialize all fields as input as 'invalid', meaning that their
        // content is not fit to be sent to the server
        $('[id^="registration-input-"]').data('invalid', true);

        // Regex taken from http://www.regular-expressions.info/email.html
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        var passwordRegexes = [
            /[A-Z]/,
            /[a-z]/,
            /[0-9]/,
            /^.{8,}$/
        ];

        var passwordRegexesErrors = [
            $('#registration-error-uppercase'),
            $('#registration-error-lowercase'),
            $('#registration-error-numeric'),
            $('#registration-error-length')
        ];

        var emailAvailabilityCheck;

        var _updateSubmitButtonStatus = function () {
            var invalidInputCount =
                $('#registration-body')
                    .find('input:data(invalid)')
                    .length;

            $("#registration-submit")
                .toggleClass('disabled', invalidInputCount > 0);
        };

        $('#registration-input-email-ajax').hide();
        $('#registration-input-email').on('change input', function () {
            // Since we are going to check the email with the server, we'd
            // rather not have the user press the Submit button in the meantime
            // Thus every modification of this field disables submitting until
            // we know if the mail's in use or not.
            $(this).data('invalid', true);
            _updateSubmitButtonStatus();

            var value = $(this).val();
            var valid = emailRegex.test(value);

            $(this).closest('.form-group')
                .removeClass('has-error')
                .removeClass('has-success')
                .addClass('has-warning');

            clearTimeout(emailAvailabilityCheck);

            if (!valid) {
                $(this).closest('.form-group')
                    .addClass('has-error');
                return;
            }

            emailAvailabilityCheck = setTimeout(function (that) {
                $('#registration-input-email-ajax')
                    .hide()
                    .removeClass('invisible')
                    .fadeIn('fast');

                ApiProvider.isEmailInUse(value)
                    .done(function () {
                              $(that).data('invalid', true)
                                  .closest('.form-group')
                                  .addClass('has-error');
                          })
                    .fail(function () {
                              $(that).data('invalid', false)
                                  .closest('.form-group')
                                  .addClass('has-success');
                          })
                    .always(function () {
                                $(that)
                                    .closest('.form-group')
                                    .removeClass('has-warning');

                                $('#registration-input-email-ajax')
                                    .fadeOut('fast');

                                _updateSubmitButtonStatus();
                            });
            }, 1000, this);
        });

        $('#registration-input-password').on('change input', function () {
            var value = $(this).val();
            var valid = true;

            for (var i = 0; i < passwordRegexes.length; ++i) {
                if (!passwordRegexes[i].test(value)) {
                    valid = false;
                    passwordRegexesErrors[i].addClass('error-highlight');
                } else {
                    passwordRegexesErrors[i].removeClass('error-highlight');
                }
            }

            $(this)
                .closest('.form-group')
                .toggleClass('has-success', valid);

            $(this).data('invalid', !valid);
            _updateSubmitButtonStatus();

            $('#registration-input-password-confirmation').trigger('change');
        });

        $('#registration-input-password-confirmation')
            .on('change input', function () {
                    var passwordConfirmation =
                        $("#registration-input-password-confirmation").val();

                    var password = $("#registration-input-password").val();

                    if (!password || !passwordConfirmation) {
                        return;
                    }

                    var valid = passwordConfirmation == password;

                    $("#registration-input-password-confirmation")
                        .closest('.form-group')
                        .toggleClass('has-success', valid)
                        .toggleClass('has-error', !valid);

                    $(this).data('invalid', !valid);
                    _updateSubmitButtonStatus();
                });

        $('#registration-input-first-name, #registration-input-last-name')
            .on('change input', function () {
                    $(this).data('invalid', !$(this).val());
                    _updateSubmitButtonStatus();
                });
    };

    return {
        initializeDom: function () {
            $('#page-home').show('slide', 'slow', function () {
                $('#main-title').animate({
                                             marginTop: '0px',
                                             marginBottom: '20.100px'
                                         }, 'slow', function () {
                    $('#text-welcome')
                        .removeClass('invisible')
                        .hide()
                        .show('fade', 'slow');
                    _updateLoginStatus(true);
                });
            });

            _registrationFormValidation();
        }
    };
})();
