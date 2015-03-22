var DomInteraction = (function () {
    var _loadLatestShows = (function () {
        const _btdiggURL = 'http://btdigg.org/search?q=';
        const _subsceneURL = 'http://subscene.com/subtitles/release?q=';

        var _tbody = $('#home-latest-shows-table').find('tbody');

        var _addShow = function (show) {
            _tbody.append(
                $('<tr>')
                    .hide()
                    .append($('<td>').text(show.date))
                    .append($('<td>').text(show.name))
                    .append($('<td>').text(show.season))
                    .append($('<td>').text(show.episode))
                    .append(
                    $('<td>')
                        .append(
                        $('<a>')
                            .addClass('btn btn-sm btn-primary btn-block')
                            .text('Yaaaarrr !')
                            .attr('href',
                                  encodeURI(_btdiggURL +
                                            show.name +
                                            ' ' +
                                            show.season +
                                            show.episode))))
                    .append(
                    $('<td>')
                        .append(
                        $('<a>')
                            .addClass('btn btn-sm btn-info  btn-block')
                            .text('Subs !')
                            .attr('href',
                                  encodeURI(_subsceneURL +
                                            show.name +
                                            ' ' +
                                            show.season +
                                            show.episode))))
                    .append(
                    $('<td>')
                        .append(
                        $('<button>')
                            .addClass('btn btn-sm btn-success btn-block')
                            .text('Comment')
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
                                   })))
                    .fadeIn('fast'));
        };


        return function () {
            ApiProvider
                .latestShows()
                .done(function (latestShows) {
                          for (var i = 0; i < latestShows.length;
                               ++i) {
                              _addShow(latestShows[i]);
                          }
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
        }
    };
})
();
