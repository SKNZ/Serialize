var DomInteraction = (function () {
    var _loadLatestShows = (function () {
        const _btdiggURL = 'http://btdigg.org/search?q=';
        const _subsceneURL = 'http://subscene.com/subtitles/release?q=';

        var _tbody = $('#home-latest-shows-table').find('tbody');

        var _addShow = function (show) {
            _tbody.append(
                $('<tr>')
                    .append(
                    $('<td>').text(show.date),
                    $('<td>').text(show.name),
                    $('<td>').text(show.season),
                    $('<td>').text(show.episode),
                    $('<td>')
                        .append(
                        $('<a>')
                            .addClass('btn ')
                            .addClass('btn-sm')
                            .addClass('btn-primary')
                            .addClass('btn-block')
                            .text('Yaaaarrr !')
                            .attr('href',
                            encodeURI(_btdiggURL +
                                      show.name +
                                      ' ' +
                                      show.season +
                                      show.episode))),
                    $('<td>')
                        .append(
                        $('<a>')
                            .addClass('btn')
                            .addClass('btn-sm')
                            .addClass('btn-info')
                            .addClass('btn-block')
                            .text('Subs !')
                            .attr('href',
                            encodeURI(_subsceneURL +
                                      show.name +
                                      ' ' +
                                      show.season +
                                      show.episode))),
                    $('<td>')
                        .append(
                        $('<button>')
                            .addClass('btn')
                            .addClass('btn-sm')
                            .addClass('btn-success')
                            .addClass('btn-block')
                            .attr('data-episode', show.id)
                            .text('Comments')
                            .click(function () {
                                if (ApiProvider.isLoggedIn()) {
                                    $('#comment-modal').modal();
                                } else {
                                    $('#comment-modal').modal();
                                    return;
                                    var alertRequiresLogin =
                                        $('#alert-requires-login');

                                    alertRequiresLogin
                                        .slideDown();

                                    setTimeout(
                                        _bind(alertRequiresLogin,
                                            $.prototype.slideUp),
                                        5000
                                    );
                                }
                            }))));
        };

        return function () {
            ApiProvider
                .latestShows()
                .always(_bind($('#home-latest-shows-loading'),
                    $.prototype.hide))
                .done(function (latestShows) {
                    for (var i = 0; i < latestShows.length; ++i)
                    {
                        _addShow(latestShows[i]);
                    }

                    $('#home-latest-shows-table').show('fast');
                    $('#home-latest-shows-sample').remove();
                })
                .fail(function () {

                });
        }
    })();

    return {
        initialize: function () {
            // data-hide is a property you put on a clickable
            // when it is clicked, it will search for the neareast element
            // matching the selector specified
            // ex: <button data-hide="#toBeHidden"></button>
            // will hide #toBeHidden when clicked
            $('[data-hide]').on('click', function () {
                var target = $(this).attr('data-hide');
                $(this).closest(target).slideUp();
            });

            $('#home-latest-shows-table').hide().removeClass('hidden');

            // Slide the home page in
            $('#home-body').show('slide', 'slow', function () {
                // Animate the title so that it moves up
                $('#home-welcome-title').animate({
                    marginTop: '0px',
                    marginBottom: '20.100px'
                }, 'slow', function () {

                    // Show welcome text
                    $('#home-welcome-text')
                        .removeClass('invisible')
                        .hide()
                        .show('fade', 'slow');

                    // Check if user is authenticated, update the page
                    // accordingly.
                    DomLoginStatus.updateLoginStatus(true);

                    _loadLatestShows();
                });
            });

            // Set up registration form hooks
            DomRegistrationForm.initialize();

            // Set up login form hooks
            DomLoginForm.initialize();

            // Set up comment form hooks
            DomCommentForm.initialize();

            // Modals when their content is modified do not automatically
            // recalculate the backdrop's height. As such, we recalculate it
            // regularly as long as the modal is open.
            var updateModalDropbackInterval;
            $(document).on('shown.bs.modal', function (e) {
                updateModalDropbackInterval = setInterval(function () {
                    $(e.target).data('bs.modal').handleUpdate();
                }, 100);
            }).on('hidden.bs.modal', function () {
                clearInterval(updateModalDropbackInterval);
            });

        }
    };
})
();
