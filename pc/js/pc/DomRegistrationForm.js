var DomRegistrationForm = function () {
    // Checks if any of the input required is in an invalid state
    // If so, then we disable the submit button until further
    var _updateSubmitButtonStatus = function () {
        var invalidInputCount =
            $('#registration-body')
                .find('input:data(invalid)')
                .length;

        $('#registration-submit')
            .prop('disabled', invalidInputCount > 0);
    };

    return {
        initialize: function () {
            // Initialize all fields as input as 'invalid', meaning that their
            // content is not fit to be sent to the server, which is true
            // since they are empty
            $('[id^="registration-input-"]').data('invalid', true);
            _updateSubmitButtonStatus();

            // Autofocus on email field when modal opens
            $('#registration-modal').on(
                'shown.bs.modal',
                _bind(
                    $('#registration-input-email'),
                    $.prototype.focus));

            // Email validation regex
            // Taken from http://www.regular-expressions.info/email.html
            var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

            // Every time the user enters a valid email address, we're going to
            // check with the server if it's already registered or not.
            // To avoid spamming the server, we add a 1 second delay to this
            // request
            // Every time the users modifies the email address, we reschedule
            // this request one second later. This variable stores the scheduled
            // task so that it can be cancelled.
            var emailAvailabilityCheck;

            $('#registration-input-email').on('change input', function () {
                // Since we are going to check the email with the server, we'd
                // rather not have the user press the Submit button in the
                // meantime Thus every modification of this field disables
                // submitting until we know if the mail's in already registered
                // or not.
                $(this).data('invalid', true);
                _updateSubmitButtonStatus();

                var value = $(this).val();
                var valid = emailRegex.test(value);

                $(this).closest('.form-group')
                    .removeClass('has-error')
                    .removeClass('has-success')
                    .addClass('has-warning'); // Set to warning state until
                                              // server response

                // Cancel previous server request
                clearTimeout(emailAvailabilityCheck);

                if (!valid) {
                    // If the email is not valid, visual error state
                    $(this)
                        .closest('.form-group')
                        .addClass('has-error');

                    // Also, stop here since we also don't to ask the server if
                    // an invalid email address is in use
                    return;
                }

                // Schedule checking email address availabity in 1 second
                emailAvailabilityCheck = setTimeout(function (that) {
                    // Show the helper text
                    $('#registration-input-email-ajax').fadeIn('fast');

                    // Send request to server
                    ApiProvider.isEmailInUse(value)
                        .done(function () {
                                  // Error state if email in use
                                  $(that).data('invalid', true)
                                      .closest('.form-group')
                                      .addClass('has-error');
                              })
                        .fail(function () {
                                  // Success state if email not in use
                                  $(that).data('invalid', false)
                                      .closest('.form-group')
                                      .addClass('has-success');
                              })
                        .always(function () {
                                    // Remove warning state
                                    $(that)
                                        .closest('.form-group')
                                        .removeClass('has-warning');

                                    // Hide helper text
                                    $('#registration-input-email-ajax')
                                        .fadeOut('fast');

                                    // Refresh submit button
                                    _updateSubmitButtonStatus();
                                });
                }, 1000, this);
            });

            // These regexes represent the four conditions necessary for a
            // password to be considered "safe enough".
            var passwordRegexes = [
                /[A-Z]/,
                /[a-z]/,
                /[0-9]/,
                /^.{8,}$/
            ];

            // For each of those error, there is a piece of text that must be
            // highlighted correspondingly. These are the selector for this.
            var passwordRegexesErrors = [
                $('#registration-error-uppercase'),
                $('#registration-error-lowercase'),
                $('#registration-error-numeric'),
                $('#registration-error-length')
            ];

            $('#registration-input-password').on('change input', function () {
                var value = $(this).val();
                var valid = true;

                // For each regex
                for (var i = 0; i < passwordRegexes.length; ++i) {
                    if (!passwordRegexes[i].test(value)) {
                        valid = false;
                        passwordRegexesErrors[i].addClass('error-highlight');
                    } else {
                        passwordRegexesErrors[i].removeClass('error-highlight');
                    }
                }

                // Visual error state
                $(this)
                    .closest('.form-group')
                    .toggleClass('has-success', valid);

                $(this).data('invalid', !valid);
                _updateSubmitButtonStatus();

                // Since we modify the password, we must also recheck that
                // password
                // confirmation is valid, thus we trigger the "change" event
                // manually so that the checks happen again.
                $('#registration-input-password-confirmation')
                    .trigger('change');
            });

            // Password confirmation check
            $('#registration-input-password-confirmation')
                .on('change input', function () {
                        var passwordConfirmation =
                            $('#registration-input-password-confirmation')
                                .val();

                        var password = $('#registration-input-password').val();

                        // If either is empty, stop here, no error messages
                        // until the user types something
                        if (!password || !passwordConfirmation) {
                            return;
                        }

                        var valid = passwordConfirmation == password;

                        // Visual error state
                        $('#registration-input-password-confirmation')
                            .closest('.form-group')
                            .toggleClass('has-success', valid)
                            .toggleClass('has-error', !valid);

                        $(this).data('invalid', !valid);
                        _updateSubmitButtonStatus();
                    });

            // Check if first name/last name are specified
            $('#registration-input-first-name, #registration-input-last-name')
                .on('change input', function () {
                        $(this).data('invalid', !$(this).val());
                        _updateSubmitButtonStatus();
                    });

            // Save the button text
            var registrationButtonOriginalText =
                $('#registration-submit').text();

            // Handle form submission
            $('#registration-body')
                .find('form')
                .submit(
                function () {
                    // Disable submit button to avoid multiple submissions
                    $('#registration-submit')
                        .prop('disabled', 'true')
                        .text('Working...');

                    // Hide any previous error messages
                    $('#registration-errors').fadeOut(function () {
                        // Clear them out from DOM
                        $('#registration-error-messages').empty();
                    });

                    // Build registration request
                    var accountInformation = {
                        email: $('#registration-input-email').val(),
                        password: $('#registration-input-password').val(),
                        passwordConfirmation: $('#registration-input-password-confirmation').val(),
                        firstName: $('#registration-input-first-name').val(),
                        lastName: $('#registration-input-last-name').val(),
                        description: $('#registration-input-description').val(),
                        weeklyDigest: $('#registration-weekly-digest').is(':checked'),
                        newsletter: $('#registration-newsletter').is(':checked')
                    };

                    // Send registration request, handle result
                    ApiProvider
                        .tryRegister(accountInformation)
                        .done(function (response) {
                                  // Let's reset the form
                                  var registrationModal =
                                      $('#registration-modal');

                                  registrationModal.modal('hide');

                                  // Vanilla JS is easier than jQuery when it
                                  // comes to resetting forms. Source:
                                  // http://stackoverflow.com/a/6364313
                                  registrationModal.find('form')[0].reset();

                                  registrationModal
                                      .find('.form-group')
                                      .removeClass('has-success')
                                      .removeClass('has-error')
                                      .removeClass('has-warning');

                                  // Remark all the input fields as invalid,
                                  // since they are now empty again
                                  $('[id^="registration-input-"]')
                                      .data('invalid', true);

                                  _updateSubmitButtonStatus();

                                  // Show the alert about mail confirmation
                                  $('#alert-mail-sent').slideDown();
                              })
                        .fail(function (response) {
                                  // Re-enable submit button if there were
                                  // errors
                                  $('#registration-submit')
                                      .prop('disabled', false)
                                      .text('Pitch me in !');

                                  var errors = response.errors;

                                  // Append errors to DOM
                                  for (var i = 0; i < errors.length; ++i) {
                                      $('#registration-error-messages')
                                          .append('- ',
                                                  errors[i],
                                                  $('<br/>'));
                                  }

                                  // Display errors
                                  $('#registration-errors').fadeIn();
                              })
                        .always(function () {
                                    // Reset the text to what it was back
                                    // originally
                                    $('#registration-submit')
                                        .text(registrationButtonOriginalText);
                                });

                    event.preventDefault();
                });
        }
    };
}();
