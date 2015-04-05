var DomLoginForm = (function () {
    var _loginButtonOriginalText = $('#login-submit').text();

    var _updateSubmitButtonStatus = function () {
        var invalidInputCount =
            $('#login-body')
                .find('input:data(invalid)')
                .length;

        $('#login-submit')
            .prop('disabled', invalidInputCount > 0);
    };

    return {
        initialize: function () {
            // Initialize all fields as input as 'invalid', meaning that their
            // content is not fit to be sent to the server, which is true
            // since they are empty
            $('[id^="login-input-"]').data('invalid', true);
            _updateSubmitButtonStatus();

            // Autofocus on email field when modal opens
            $('#login-modal').on(
                'shown.bs.modal', function () {
                    $('#login-input-email').focus()
                });


            $('#login-input-email').on('change input', function () {
                var value = $(this).val();
                var valid = EMAIL_REGEX.test(value);

                $(this).closest('.form-group')
                    .toggleClass('has-success', valid)
                    .toggleClass('has-error', !valid);

                $(this).data('invalid', !valid);
                _updateSubmitButtonStatus();
            });

            $('#login-input-password').on('change input', function () {
                var valid = !!$(this).val();
                $(this).data('invalid', !valid);
                _updateSubmitButtonStatus();
            });

            $('#login-body')
                .find('form')
                .submit(
                function () {
                    // Hide any previous error messages
                    $('#login-errors').fadeOut(function () {
                        // Clear them out from DOM
                        $('#login-error-messages').empty();
                    });

                    $('#login-submit')
                        .prop('disabled', true)
                        .text('Working...');

                    var authCredentials = {
                        email: $('#login-input-email').val(),
                        password: $('#login-input-password').val()
                    };

                    ApiProvider
                        .tryLogin(authCredentials)
                        .done(function () {
                            $('#comment-modal').find('form')[0].reset();
                            var loginModal = $('#login-modal');
                            loginModal.modal('hide');

                            loginModal
                                .find('.form-group')
                                .removeClass('has-success')
                                .removeClass('has-error')
                                .removeClass('has-warning');

                            // Remark all the input fields as invalid,
                            // since they are now empty again
                            $('[id^="login-input-"]')
                                .data('invalid', true);

                            _updateSubmitButtonStatus();

                            // Vanilla JS is easier
                            // than jQuery when it
                            // comes to resetting
                            // forms. Source:
                            // http://stackoverflow.com/a/6364313
                            $('#login-body').find('form')[0].reset();

                            var alertLoggedIn = $('#alert-logged-in');
                            alertLoggedIn.slideDown();
                            setTimeout(
                                _bind(alertLoggedIn, $.prototype.slideUp),
                                3000);
                        })
                        .fail(function (errors) {
                            // Re-enable submit button if there were
                            // errors
                            $('#login-submit')
                                .prop('disabled', false)
                                .text('Pitch me in !');

                            // Append errors to DOM
                            for (var i = 0; i < errors.length; ++i) {
                                $('#login-error-messages')
                                    .append('- ',
                                    errors[i],
                                    $('<br/>'));
                            }

                            // Display errors
                            $('#login-errors').fadeIn();
                            $('#login-submit').prop('disabled', false);
                        })
                        .always(function () {
                            $('#login-submit')
                                .text(_loginButtonOriginalText);
                            DomLoginStatus.updateLoginStatus();
                        });

                    event.preventDefault();
                });
        }
    };
})();
