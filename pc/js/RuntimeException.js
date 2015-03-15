var RuntimeException = (function () {
    var _message;

    function RuntimeException(message) {
        _message = message;
    }

    RuntimeException.prototype.getMessage = function () {
        return _message;
    };

    return RuntimeException;
})();
