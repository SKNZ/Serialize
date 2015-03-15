var SerializeApp = (function () {
    function SerializeApp() {
    }

    SerializeApp.prototype.run = function () {
        DomInteraction.initializeDom();
    };

    return SerializeApp;
})();
