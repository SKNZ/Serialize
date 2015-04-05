var DomHelper = {
    onJqmPageShow: function (page, callback) {
        $(document)
            .on('pagecontainershow', function (e, ui) {
                var pageId = $('body')
                    .pagecontainer('getActivePage')
                    .prop('id');

                if (pageId == page) {
                    callback(e, ui);
                }
            });
    },
    onJqmPageHide: function (page, callback) {
        $(document)
            .on('pagecontainerhide', function (e, ui) {
                var pageId = $('body')
                    .pagecontainer('getActivePage')
                    .prop('id');

                if (pageId == page) {
                    callback(e, ui);
                }
            });
    },
    showLoading: function () {
        $.mobile.loading('show', {
            textonly: true
        });
        $('body').addClass('ui-disabled').prop('disabled', true);
    },
    hideLoading: function () {
        $.mobile.loading('hide');
        $('body').removeClass('ui-disabled');
    }
};