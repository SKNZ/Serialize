var DomInteraction = (function () {
    return {
        initialize: function () {
            // data-hide is a property you put on a clickable
            // when it is clicked, it will search for the neareast element
            // matching the selector specified
            // ex: <button data-hide="#toBeHidden"></button>
            // will hide #toBeHidden when clicked
            $('[data-hide]').on('click', function () {
                var target = $(this).attr('data-hide');
                $(this).closest(target).slideUp();
            });

            // Slide the home page in
            $('#page-home').show('slide', 'slow', function () {
                // Animate the title so that it moves up
                $('#main-title').animate({
                                             marginTop: '0px',
                                             marginBottom: '20.100px'
                                         }, 'slow', function () {

                    // Show welcome text
                    $('#text-welcome')
                        .removeClass('invisible')
                        .hide()
                        .show('fade', 'slow');

                    // Check if user is authenticated, update the page
                    // accordingly.
                    DomLoginStatus.updateLoginStatus(true);
                });
            });

            // Set up registration form hooks
            DomRegistrationForm.initialize();

            // Set up login form hooks
            DomLoginForm.initialize();
        }
    };
})
();
