var DomContact = (function () {
    // Email validation regex
    // Taken from http://www.regular-expressions.info/email.html
    var _emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    // Checks if any of the input required is in an invalid state
    // If so, then we disable the submit button until further
    var _updateSubmitButtonStatus = function () {
        var invalidInputCount =
            $('#contact-body')
                .find(':data(invalid)')
                .length;

        $('#contact-submit')
            .prop('disabled', invalidInputCount > 0);
    };

    var _contactButtonOriginalText = $('#contact-submit').text();

    return {
        initialize: function () {
            // Initialize all fields as input as 'invalid', meaning that their
            // content is not fit to be sent to the server, which is true
            // since they are empty
            $('[id^="contact-input-"]').data('invalid', true);
            _updateSubmitButtonStatus();

            // Autofocus on email field when modal opens
            $('#contact-modal').on('shown.bs.modal', function (event) {
                $('#contact-input-email').focus();
            });

            $('#contact-input-email').on('change input', function () {
                _updateSubmitButtonStatus();

                var value = $(this).val();
                var valid = _emailRegex.test(value);

                $(this)
                    .closest('.form-group')
                    .toggleClass('has-success', valid)
                    .toggleClass('has-error', !valid);

                $(this).data('invalid', !valid);
                _updateSubmitButtonStatus();
            });

            $('#contact-input-subject').on('change input', function () {
                var valid = !!$(this).val();
                $(this).data('invalid', !valid);
                _updateSubmitButtonStatus();
            });

            $('#contact-input-message')
                .on('propertychange input', function () {
                    $(this).data('invalid', !$(this).val());
                    _updateSubmitButtonStatus();
                });

            $('#contact-body')
                .find('form')
                .submit(function () {
                    // Disable submit button to avoid multiple submissions
                    $('#contact-submit')
                        .prop('disabled', 'true')
                        .text('Working...');

                    // Hide any previous error messages
                    $('#contact-errors').fadeOut(function () {
                        // Clear them out from DOM
                        $('#contact-error-messages').empty();
                    });

                    // Build comment request
                    var messageInformation = {
                        email: $('contact-input-contact').val(),
                        subject: $('#contact-input-subject').val(),
                        message: $('#contact-input-message').val()
                    };

                    // Send comment request, handle result
                    ApiProvider
                        .contact(messageInformation)
                        .done(function (response) {
                            // Let's reset the form
                            var contactModal =
                                $('#contact-modal');

                            // Vanilla JS is easier than jQuery when it
                            // comes to resetting forms. Source:
                            // http://stackoverflow.com/a/6364313
                            contactModal.find('form')[0].reset();

                            // Remark all the input fields as invalid,
                            // since they are now empty again
                            $('[id^="contact-input-"]').data('invalid', true);

                            _updateSubmitButtonStatus();

                            contactModal.modal('hide');
                            $('#alert-contact-sent')
                                .slideDown();
                        })
                        .fail(function (response) {
                            // Re-enable submit button if there were
                            // errors
                            $('#contact-submit')
                                .prop('disabled', false);

                            var errors = response.errors;

                            // Append errors to DOM
                            for (var i = 0; i < errors.length; ++i) {
                                $('#contact-error-messages')
                                    .append('- ',
                                    errors[i],
                                    $('<br/>'));
                            }

                            // Display errors
                            $('#contact-errors').fadeIn();
                        })
                        // Reset the text to what it was back
                        // originally
                        .always(function () {
                            $('#contact-submit').text(_contactButtonOriginalText);
                        });

                    event.preventDefault();
                });
        }
    }
})();
