var DomInteraction = (function () {
    return {
        initialize: function () {
            // data-hide is a property you put on a clickable.
            // When it is clicked, it will search for the neareast element
            // matching the selector specified
            // ex: <button data-hide="#toBeHidden"></button>
            // will hide #toBeHidden when the button is clicked
            $('[data-hide]').on('click', function () {
                var target = $(this).attr('data-hide');
                $(this).closest(target).slideUp();
            });

            // Modals when their content is modified do not automatically
            // recalculate the backdrop's height. As such, we recalculate it
            // regularly as long as the modal is open.
            var updateModalDropbackInterval;
            $(document).on('shown.bs.modal', function (e) {
                updateModalDropbackInterval = setInterval(function () {
                    $(e.target).data('bs.modal').handleUpdate();
                }, 100);
            }).on('hidden.bs.modal', function () {
                clearInterval(updateModalDropbackInterval);
            });

            $('#footer-to-top')
                .click(function (event) {
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    event.preventDefault();
                });

            // Slide the home page in
            $('#home-body').show('slide', 'slow', function () {
                // Animate the title so that it moves up
                $('#home-welcome-title').animate({
                    marginTop: '0px',
                    marginBottom: '20.100px'
                }, 'slow', function () {

                    // Show welcome text
                    $('#home-welcome-text')
                        .removeClass('invisible')
                        .hide()
                        .show('fade', 'slow');
                });
            });

            $('#navbar-go-about').click(function (event) {
                $('#home-body')
                    .hide('slide', {direction: 'right'},
                    function () {
                        $('#about-body')
                            .show('slide', {direction: 'left'});
                    });

                $('#navbar-go-home')
                    .closest('li')
                    .removeClass('active');

                $(this)
                    .closest('li')
                    .addClass('active');

                event.preventDefault();
            });

            $('#navbar-go-home, .navbar-brand').click(function (event) {
                $('#about-body').hide('slide', {direction: 'left'},
                    function () {
                        $('#home-body').show('slide', {direction: 'right'});
                    });

                $('#navbar-go-about')
                    .closest('li')
                    .removeClass('active');

                $('#navbar-go-home')
                    .closest('li')
                    .addClass('active');

                event.preventDefault();
            });

            // Check if user is authenticated, update the page
            // accordingly.
            DomLoginStatus.updateLoginStatus(true);

            // Set up registration form hooks
            DomRegistrationForm.initialize();

            // Set up login form hooks
            DomLoginForm.initialize();

            // Set up comment form hooks
            DomCommentForm.initialize();

            // Load shows
            DomShowList.initialize();

            // Set up show modal hooks
            DomShow.initialize();

            // Set up contact form hooks
            DomContact.initialize();
        }
    };
})();
