var SerializeApp = (function () {
    function SerializeApp() {
    }

    SerializeApp.prototype.run = function () {
        ApiProvider
            .checkLogin()
            .always(DomInteraction.initialize);
    };

    return SerializeApp;
})();
