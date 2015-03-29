var DomLoginStatus = (function () {
    var _wasLoggedIn = ApiProvider.isLoggedIn();

    var _buildLoginForm = function () {
        $('#navbar-right').remove();

        var signInButton = $('<button>')
            .attr('type', 'button')
            .addClass('btn')
            .addClass('btn-success')
            .attr('data-toggle', 'modal')
            .attr('href', '#login-modal')
            .text('Sign in');

        var registerButton = $('<button>')
            .attr('type', 'button')
            .addClass('btn')
            .addClass('button-register')
            .attr('data-toggle', 'modal')
            .attr('href', '#registration-modal')
            .text('Register');

        $('#navbar').append(
            $('<div>')
                .attr('id', 'navbar-right')
                .addClass('navbar-form')
                .addClass('form-inline')
                .addClass('navbar-right')
                .append(
                signInButton,
                '\n',
                registerButton,
                '\n').fadeIn('slow'));
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
                            .always(DomLoginStatus.updateLoginStatus);
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
        $('#home-welcome-action')
            .empty()
            .append(
            $('<div>')
                .hide()
                .addClass('form-group')
                .append(
                $('<input>')
                    .attr('id', 'home-welcome-search')
                    .attr('type', 'text')
                    .attr('placeholder', 'Search')
                    .addClass('form-control')
                    .on('change input', function () {
                        DomSearch.inputSearch($(this).val());
                    }))
                .on("remove", function () {
                    $('#home-search')
                        .fadeOut(_bind(
                            $('#home-search-results'),
                            $.prototype.empty));
                })
                .fadeIn('slow'));
    };

    var _buildRegisterNowButton = function () {
        $('#home-welcome-action')
            .empty()
            .append(
            $('<span>')
                .append(
                $('<button>')
                    .attr('type', 'button')
                    .attr('data-toggle', 'modal')
                    .attr('href', '#registration-modal')
                    .addClass('button-register')
                    .addClass('btn')
                    .addClass('btn-primary')
                    .addClass('center-block')
                    .text('Register now !')
            ));
    };

    return {
        updateLoginStatus: function (init) {
            init = init || false;
            var loggedIn = ApiProvider.isLoggedIn();

            if (_wasLoggedIn == loggedIn && !init) {
                return;
            }

            // Build right side of navbar
            loggedIn ? _buildProfileBar() : _buildLoginForm();
            loggedIn ? _buildSearchForm() : _buildRegisterNowButton();
            loggedIn ? DomShowList.loadYourShows() : DomShowList.hideYourShows();

            _wasLoggedIn = loggedIn;
        }
    };
})();
