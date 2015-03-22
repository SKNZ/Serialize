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

// Not used anymore, but still quite stylé !
var dependencyInjector = (function () {
    var availableDependencies = {};

    return function (dependencyName, requiredDependencies, constructor) {
        var args = requiredDependencies.map(function (requiredDependency) {
            if (!(requiredDependency in availableDependencies)) {
                throw new RuntimeException("dependency " +
                                           dependencyName +
                                           "required unavailable dependency " +
                                           requiredDependency +
                                           " !");
            }

            return availableDependencies[requiredDependency];
        });

        // It took me hours to find this piece of code.
        // In the end, calling the constructor requires having a context
        // ("this") created before it is called.
        // To create the context, we just create a new object.
        // Passing the prototype is compulsory if we want to have its functions.
        var dependency = Object.create(constructor.prototype);
        constructor.apply(dependency, []);

        availableDependencies[dependencyName] = dependency;
        return dependency;
    };
})();

// Closure factory
var _bind = function (object, method) {
    return function () {
        method.apply(object, arguments);
    };
};
