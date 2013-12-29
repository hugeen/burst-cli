define(function(require) {

    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options = options || {};

        function later() {
            previous = new Date;
            timeout = null;
            result = func.apply(context, args);
        }

        return function() {
            var now = new Date;
            if (!previous && options.leading === false) {
                previous = now;
            }

            var remaining = wait - (now - previous);
            context = this;
            args = arguments;

            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }

            return result;
        };
    }

    return {
        throttle: throttle
    };

});