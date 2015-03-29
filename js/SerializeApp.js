var SerializeApp = (function () {
    function SerializeApp() {
    }

    SerializeApp.prototype.run = function () {
        DomInteraction.initialize();
    };

    return SerializeApp;
})();
