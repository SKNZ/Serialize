var DomInteraction = (function () {
    return {
        initialize: function () {
            DomLogin.initialize();
            DomComment.initialize();
            DomShow.initialize();
            DomShowList.initialize();
            DomSearch.initialize();
            DomLoginStatus.updateLoginStatus(true);
        }
    }
})();
