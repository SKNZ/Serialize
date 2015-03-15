var DomInteraction = (function () {
    var _buildRightOfNavbar = (function () {
        var _buildLoginForm = function () {
            return $('<form>')
                .prop('id', 'navbar-right')
                .prop('class', 'navbar-form navbar-right')
                .append(
                $('<div>')
                    .prop('class', 'form-group')
                    .append(
                    $('<input>')
                        .prop('type', 'text')
                        .prop('name', 'email')
                        .prop('placeholder', 'Email')
                        .prop('class', 'form-control')))
                .append('\n')
                .append(
                $('<div>')
                    .prop('class', 'form-group')
                    .append(
                    $('<input>')
                        .prop('type', 'password')
                        .prop('name', 'password')
                        .prop('placeholder', 'password')
                        .prop('class', 'form-control')))
                .append('\n')
                .append(
                $('<button>')
                    .prop('type', 'submit')
                    .prop('class', 'btn btn-success')
                    .html('Sign in'))
                .append('\n')
                .append(
                $('<button>')
                    .prop('type', 'submit')
                    .prop('class', 'btn')
                    .html('Register'))
                .append('\n')
                .submit(function (event) {
                            var email = $('#navbar-right input[name="email"]').val(),
                                password = $('#navbar-right input[name="password"]').val();
                            ApiProvider.tryLogin(email, password);
                            event.preventDefault();
                        });
        };

        var _buildProfileBar = function () {
            return $('span')
                .html('0 notifications | Floran NARENJI (SKNZ)')
        };

        return function () {
            $("#navbar-right").remove();
            $("#navbar").append((ApiProvider.isLoggedIn()
                                    ? _buildProfileBar()
                                    : _buildLoginForm()).fadeIn(1000)
            );
        };
    })();

    return {
        initializeDom: function () {
            _buildRightOfNavbar();
        }
    };
})();
