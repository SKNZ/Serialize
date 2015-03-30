var DomShow = (function () {

    return {
        initialize: function () {
            var closedByThis = false;

            $('#show-modal').on('show.bs.modal', function (event) {
                $('#show-shows-table').hide();
                $('#show-shows-sample').hide();
                $('#show-subscribe').hide();
                $('#show-loading').fadeIn();
                $('#show-errors').fadeOut(
                    _bind(
                        $('#show-error-messages'),
                        $.prototype.empty));

                var relatedTarget = $(event.relatedTarget);

                $('#show-name').text(relatedTarget.data('show-name'));

                var showId = relatedTarget.data('show-id');

                $('#show-subscribe')
                    .click(function () {
                        var that = $(this);

                        that.text('Working...')
                            .addClass('disabled');

                        $('#show-errors').fadeOut(
                            _bind(
                                $('#show-error-messages'),
                                $.prototype.empty));

                        ApiProvider
                            .toggleSubscription(showId)
                            .done(function (subscribed) {
                                that.toggleClass('btn-success', !subscribed)
                                    .toggleClass('btn-danger', subscribed)
                                    .text(subscribed ? 'Unsubscribe' : 'Subscribe')
                                    .fadeIn();
                            })
                            .fail(function (errors) {
                                // Append errors to DOM
                                for (var i = 0; i < errors.length; ++i) {
                                    $('#show-error-messages')
                                        .append('- ',
                                        errors[i],
                                        $('<br/>'));
                                }

                                // Display errors
                                $('#show-errors').fadeIn();
                            })
                            .always(function () {
                                $('#show-subscribe')
                                    .removeClass('disabled');
                            });
                    });

                ApiProvider
                    .showData(showId)
                    .always(function () {
                        $('#show-loading').hide();
                    })
                    .done(function (show) {
                        $('#show-subscribe')
                            .toggleClass('btn-success', !show.subscribed)
                            .toggleClass('btn-danger', show.subscribed)
                            .text(show.subscribed ? 'Unsubscribe' : 'Subscribe')
                            .fadeIn();

                        DomShowList.addShowShows(show.episodes);

                        $('#show-shows-table')
                            .find('td:nth-child(2)')
                            .hide();

                        $('#show-shows-table')
                            .fadeIn('fast');
                    })
                    .fail(function (response) {
                        var errors = response.errors;

                        // Append errors to DOM
                        for (var i = 0; i < errors.length; ++i) {
                            $('#show-error-messages')
                                .append('- ',
                                errors[i],
                                $('<br/>'));
                        }

                        // Display errors
                        $('#show-errors').fadeIn();
                    });

                $('#comment-modal').on('show.bs.modal.fromShow', function () {
                    $('#show-modal').modal('hide');
                    closedByThis = true;
                }).on('hide.bs.modal.fromShow', function () {
                    relatedTarget.click();
                    closedByThis = false;
                });
            }).on('hidden.bs.modal', function () {
                $('#show-shows-sample')
                    .show();

                if (!closedByThis) {
                    $('#comment-modal')
                        .off('show.bs.modal.fromShow')
                        .off('hide.bs.modal.fromShow');
                }

                $(this)
                    .find('tr:not(:first)')
                    .remove();
            });
        }
    };
})();
