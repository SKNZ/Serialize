var DomShow = (function () {
    var _show;

    return {
        initialize: function () {
            var closedByThis = false;

            $('#show-modal').on('show.bs.modal', function (event) {
                $('#show-shows-table').hide();
                $('#show-shows-sample').hide();
                $('#show-subscribe').hide();
                $('#show-loading').fadeIn();
                $('#show-errors').fadeOut('fast');
                $('#show-error-messages').empty();

                var relatedTarget = $(event.relatedTarget);

                $('#show-name').text(relatedTarget.data('show-name'));

                var showId = relatedTarget.data('show-id');

                $('#show-subscribe')
                    .click(function () {
                        var that = $(this);

                        $('#show-errors').fadeOut('fast');
                        $('#show-error-messages').empty();
                        var _textBefore = that.text();

                        that.text('Working...')
                            .addClass('disabled');

                        ApiProvider
                            .toggleSubscription(showId, !_show.subscribed)
                            .done(function (subscribed) {
                                that.toggleClass('btn-success', !subscribed)
                                    .toggleClass('btn-danger', subscribed)
                                    .text(subscribed
                                        ? 'Unsubscribe'
                                        : 'Subscribe')
                                    .fadeIn();

                                _show.subscribed = subscribed;
                            })
                            .fail(function (errors) {
                                // Append errors to DOM
                                for (var i = 0; i < errors.length; ++i) {
                                    $('#show-error-messages')
                                        .append('- ',
                                        errors[i],
                                        $('<br/>'));

                                    that.text(_textBefore);
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
                        _show = show;
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
