var DomInteraction = (function () {
    return {
        initialize: function () {
            $('#footer-to-top')
                .click(function (event) {
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    event.preventDefault();
                });

            DomLogin.initialize();
            DomComment.initialize();
            DomShow.initialize();
            DomShowList.initialize();
            DomSearch.initialize();
            DomLoginStatus.updateLoginStatus(true);
        }
    }
})();
