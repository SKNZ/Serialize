var DomLogin = (function () {
    return {
        initialize: function () {
            $('#login-form')
                .submit(function () {
                    DomHelper.showLoading();
                    $(this)
                        .find('input[type="submit"]')
                        .prop('disabled',  true);

                    $('#login-errors')
                        .fadeOut();

                    $('#login-error-messages')
                        .empty();

                    var authCredentials = {
                        email: $('#login-input-email').val(),
                        password: $('#login-input-password').val()
                    };

                    ApiProvider
                        .tryLogin(authCredentials)
                        .done(function () {
                            $('#login-form')[0].reset();
                            $.mobile.changePage('#home');
                        })
                        .fail(function (errors) {
                            // Append errors to DOM
                            for (var i = 0; i < errors.length; ++i) {
                                $('#login-error-messages')
                                    .append('- ',
                                    errors[i],
                                    '<br/>');
                            }

                            // Display errors
                            $('#login-errors').fadeIn();
                        })
                        .always(function () {
                            $('#login-form')
                                .find('input[type="submit"]')
                                .prop('disabled',  false);

                            DomHelper.hideLoading();
                            DomLoginStatus.updateLoginStatus();
                        });

                    event.preventDefault();
                });

            $('#disconnect')
                .click(function () {
                    DomHelper.showLoading();
                    ApiProvider
                        .logOut()
                        .always(function () {
                            DomLoginStatus.updateLoginStatus();
                            DomHelper.hideLoading();
                        });
                });
        }
    };
})();