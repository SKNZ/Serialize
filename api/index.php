<?php

session_cache_limiter(false);
session_start();

use Slim\Slim;

require 'vendor/autoload.php';
$app = new Slim(array(//    'debug' => true
));

function error(array $errors = ['An unknown error happened '], $errorCode = 200)
{
    Slim::getInstance()->contentType('application/json');
    Slim::getInstance()->halt(200, json_encode([
        'success' => false,
        'errors' => $errors
    ]));
}

function ok($response = null)
{
    $response =
        $response != null
            ? array_merge(['success' => true], $response)
            : ['success' => true];

    Slim::getInstance()->contentType('application/json');
    Slim::getInstance()->response->body(json_encode($response));
}

function auth()
{
    if (!isset($_SESSION['auth'])) {
        error(['Authentication required']);
    }
}

$app->error(function (\Exception $e) use ($app) {
    error();
});

$pdo = new PDO('mysql:host=localhost;dbname=serialize', 'root', '');
$pdo->exec('SET CHARACTER SET utf8');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Users
$app->group('/user', function () use ($app) {
    // Authentication
    $app->group('/session', function () use ($app) {
        // Login
        $app->post('/', function () use ($app) {
            $jsonBody = json_decode($app->request->getBody());

            if (!isset($jsonBody->authCredentials)) {
                error(['Invalid data format']);
            }

            $authCredentials = $jsonBody->authCredentials;

            if (!isset($authCredentials->email)
                || !filter_var($authCredentials->email, FILTER_VALIDATE_EMAIL)
            ) {
                error(['Your must specify a valid email address']);
            }

            if (!isset($authCredentials->password)
                || empty($authCredentials->password)
            ) {
                error(['Your must specify a password']);
            }

            if ($authCredentials->email != 'florandara@gmail.com') {
                error(['You fucked up mate !', 'Alright mate, cheers mate !']);
            }

            $_SESSION['auth'] = true;
            ok([
                'currentUser' => [
                    'email' => 'florandara@gmail.com',
                    'emailHash' => 'e00cf05e1611a154bc3f5764cebbc822',
                    'firstName' => 'Floran',
                    'lastName' => 'NARENJI-SHESHKALANI'
                ]
            ]);
        });

        // Logout
        $app->delete('/', 'auth', function () use ($app) {
            session_destroy();
        });

        // Connected ?
        $app->get('/', 'auth', function () use ($app) {
            ok([
                'currentUser' => [
                    'email' => 'florandara@gmail.com',
                    'emailHash' => 'e00cf05e1611a154bc3f5764cebbc822',
                    'firstName' => 'Floran',
                    'lastName' => 'NARENJI-SHESHKALANI'
                ]
            ]);
        });
    });

    // Emails exists
    $app->get('/exists/:mail', function ($mail) use ($app) {
        if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            error(['Not a valid mail address']);
        }

        if ($mail != 'florandara@gmail.com') {
            error(['Not a valid mail address']);
        }

        ok();
    });

    // Registration
    $app->put('/', function () use ($app) {
        $jsonBody = json_decode($app->request->getBody());

        if (!isset($jsonBody->accountInformation)) {
            error(['Invalid data format']);
        }

        $formErrors = [];

        $accountInformation = $jsonBody->accountInformation;
        if (!isset($accountInformation->email)
            || !filter_var($accountInformation->email, FILTER_VALIDATE_EMAIL)
        ) {
            $formErrors[] = 'You must specify a valid mail address';
        }

        if (!isset($accountInformation->password)
            || empty($accountInformation->password)
        ) {
            $formErrors[] = 'You must specify a password';
        } else {

            $passwordRegexes = [
                '/[A-Z]/',
                '/[a-z]/',
                '/[0-9]/',
                '/^.{8,}$/'
            ];

            $passwordRegexesErrors = [
                'Password must have at least one uppercase character',
                'Password must have at least one lowercase character',
                'Password must have at least one numeric character',
                'Password must be at least 8 charaters long'
            ];

            for ($i = 0; $i < count($passwordRegexes); ++$i) {
                if (!preg_match($passwordRegexes[$i], $accountInformation->password)) {
                    $formErrors[] = $passwordRegexesErrors[$i];
                }
            }
        }

        if (!isset($accountInformation->passwordConfirmation) || empty($accountInformation->passwordConfirmation)) {
            $formErrors[] = 'You must confirm your password';
        } else if (isset($accountInformation->password) && $accountInformation->passwordConfirmation != $accountInformation->password) {
            $formErrors[] = 'Your password confirmation does not match';
        }

        if (!isset($accountInformation->firstName) || empty($accountInformation->firstName)) {
            $formErrors[] = 'You must specify a first name';
        }

        if (!isset($accountInformation->lastName) || empty($accountInformation->lastName)) {
            $formErrors[] = 'You must specify a last name';
        }

        if (!isset($accountInformation->description)) {
            $accountInformation->description = '';
        }

        if (!isset($accountInformation->weeklyDigest)) {
            $accountInformation->weeklyDigest = false;
        }

        if (!isset($accountInformation->newsLetter)) {
            $accountInformation->newsletter = false;
        }

        if (count($formErrors)) {
            error($formErrors);
        }

        if ($accountInformation->firstName != 'Floran') {
            error($formErrors);
        }

        ok();
    });
});

$app->group('/show', function () use ($app) {
    $app->get('/latest', function () use ($app) {
        ok([
            'latestShows' => [
                [
                    'id' => 30,
                    'date' => '12/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E05',
                    'episodeName' => 'Swag',
                    'showId' => 13
                ],
                [
                    'id' => 29,
                    'date' => '06/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E04',
                    'episodeName' => 'Swag',
                    'showId' => 13
                ],
                [
                    'id' => 28,
                    'date' => '02/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E03',
                    'episodeName' => 'CupidityAzerty',
                    'showId' => 13
                ],
                [
                    'id' => 27,
                    'date' => '28/09/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E02',
                    'episodeName' => 'Aazekpqsdk',
                    'showId' => 13
                ],
                [
                    'id' => 26,
                    'date' => '22/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E01',
                    'episodeName' => 'Hipster',
                    'showId' => 13
                ]
            ]
        ]);
    });

    $app->get('/your', 'auth', function () use ($app) {
        ok([
            'yourShows' => [
                [
                    'id' => 30,
                    'date' => '12/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E05',
                    'episodeName' => 'Swag',
                    'showId' => 13
                ],
                [
                    'id' => 29,
                    'date' => '06/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E04',
                    'episodeName' => 'Swag',
                    'showId' => 13
                ],
                [
                    'id' => 28,
                    'date' => '02/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E03',
                    'episodeName' => 'CupidityAzerty',
                    'showId' => 13
                ],
                [
                    'id' => 27,
                    'date' => '28/09/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E02',
                    'episodeName' => 'Aazekpqsdk',
                    'showId' => 13
                ],
                [
                    'id' => 26,
                    'date' => '22/10/2015',
                    'name' => 'Game of Thrones',
                    'season' => 'S03',
                    'episode' => 'E01',
                    'episodeName' => 'Hipster',
                    'showId' => 13
                ]
            ]
        ]);
    });

    $app->post('/search', 'auth', function () use ($app) {
        $jsonBody = json_decode($app->request->getBody());

        if (!isset($jsonBody->search) || empty($jsonBody->search)) {
            error('You must specify the search terms.');
        }

        if ($jsonBody->search == "aze") {
            error(['TopKek ']);
        }

        if ($jsonBody->search == "qsd") {
            ok(['shows' => []]);
            return;
        }

        ok([
            'shows' => [
                [
                    'id' => 12,
                    'name' => 'Game of Thrones',
                    'subscribed' => false
                ],
                [
                    'id' => 13,
                    'name' => 'House of Cards',
                    'subscribed' => true
                ],
                [
                    'id' => 15,
                    'name' => 'NCIS',
                    'subscribed' => true
                ],
                [
                    'id' => 16,
                    'name' => 'Person of Interest',
                    'subscribed' => false
                ],
                [
                    'id' => 15,
                    'name' => 'Person of Swagterest',
                    'subscribed' => false
                ],
                [
                    'id' => 14,
                    'name' => 'Tards of Interest',
                    'subscribed' => false
                ],
                [
                    'id' => 13,
                    'name' => 'Les hipsters a Miami',
                    'subscribed' => false
                ]
            ]
        ]);
    });

    $app->post('/:id/subscribe', 'auth', function ($id) use ($app) {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            error(['Invalid parameter ']);
        }

        ok(['subscribed' => false]);
    });

    $app->get('/:id', function ($id) use ($app) {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            error(['Invalid parameter']);
        }

        if ($id == 13) {
            error(["SWEG", "TOPCAKE"]);
        }

        ok([
            'show' => [
                'id' => $id,
                'name' => 'Game of Thrones',
                'subscribed' => true,
                'episodes' => [
                    [
                        'id' => 15,
                        'name' => 'Gamotron',
                        'season' => 'S03',
                        'episode' => 'E05',
                        'episodeName' => 'TopKek',
                        'date' => '12/26/2015',
                        'showId' => 13
                    ],
                    [
                        'id' => 16,
                        'name' => 'Gamotron',
                        'season' => 'S03',
                        'episode' => 'E04',
                        'episodeName' => 'Swaggens',
                        'date' => '12/25/2015',
                        'showId' => 13
                    ],
                    [
                        'id' => 17,
                        'name' => 'Gamotron',
                        'season' => 'S03',
                        'episode' => 'E03',
                        'episodeName' => 'Hipster',
                        'date' => '12/25/2015',
                        'showId' => '13'
                    ],
                ]
            ]
        ]);
    });
});

$app->group('/episode', function () use ($app) {
    $app->group('/:id/comment', 'auth', function () use ($app) {
        $app->get('/', function ($id) use ($app) {
            if (!filter_var($id, FILTER_VALIDATE_INT)) {
                error('Invalid parameter');
            }

            ok([
                'success' => true,
                'comments' =>
                    [
                        [
                            'id' => 14,
                            'date' => '12/10/2015',
                            'user' => [
                                'firstName' => "Jean",
                                'lastName' => "Balbien"
                            ],
                            'rating' => 5,
                            'subject' => 'ASSALA MALECOUM',
                            'message' => "Coucou, je suis le vomi."
                        ],
                        [
                            'id' => 13,
                            'date' => '12/10/2015',
                            'user' => [
                                'firstName' => "Jean",
                                'lastName' => "Sairien"
                            ],
                            'rating' => 4,
                            'subject' => 'HELLO CAY BAIE DEUX OS',
                            'message' => "J'AIME LES PATES, SURTOUT AVEC DE LA SAUCE AUX PATES."
                        ],
                        [
                            'id' => 12,
                            'date' => '12/10/2015',
                            'user' => [
                                'firstName' => "Jean",
                                'lastName' => "Bombeur"
                            ],
                            'rating' => 3,
                            'subject' => 'VROOM VROOM RATATATATATA',
                            'message' => "SALUT C COOL LE SON SORS DES ENCEINTES."
                        ],
                        [
                            'id' => 11,
                            'date' => '12/10/2015',
                            'user' => [
                                'firstName' => "Jean",
                                'lastName' => "Kuhl-Tamer"
                            ],
                            'rating' => 2,
                            'subject' => 'IMACHOUBALAHABESSOULEIMACHOUB DJAMILA POPOPOPOA',
                            'message' => "Salut j'ai le swag, je suis un hipster mdr swag yolo. Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo."
                        ],
                        [
                            'id' => 10,
                            'date' => '11/10/2015',
                            'user' => [
                                'firstName' => "Jean",
                                'lastName' => "Peuplu"
                            ],
                            'rating' => 1,
                            'subject' => 'BRUUUUUBRUUUUUUUBRAAAAAH',
                            'message' => "Salut j'ai le swag, je suis un hipster mdr swag yolo. Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo.Salut j'ai le swag, je suis un hipster mdr swag yolo."
                        ]
                    ]
            ]);
        });

        $app->post('/', function ($id) use ($app) {
            if (!filter_var($id, FILTER_VALIDATE_INT)) {
                error(['Invalid parameter']);
            }

            $jsonBody = json_decode($app->request->getBody());
            if (!isset($jsonBody->comment)) {
                error(['Invalid data format']);
            }

            $comment = $jsonBody->comment;
            $formErrors = [];

            if (!isset($comment->subject) || empty($comment->subject)) {
                $formErrors[] = 'You must specify a subject';
            }

            if (!isset($comment->rating)
                || !filter_var($comment->rating, FILTER_VALIDATE_INT)
                || empty($comment->rating)
                || !($comment->rating >= 1 && $comment->rating <= 5)
            ) {
                $formErrors[] = 'You must specify a numeric rating between 1 and 5 ' . $comment->rating;
            }

            if (!isset($comment->message)) {
                $formErrors[] = 'You must specify a message';
            }

            if (count($formErrors)) {
                error($formErrors);
            }

            if ($comment->subject == 'cool') {
                error(['FAYEUL ']);
            }

            ok();
        });
    });
});

$app->post('/contact', function () use ($app) {
    $jsonBody = json_decode($app->request->getBody());
    if (!isset($jsonBody->messageInformation)) {
        error(['Invalid data format']);
    }

    $messageInformation = $jsonBody->messageInformation;
    $formErrors = [];

    if (!isset($messageInformation->email)
        || !filter_var($messageInformation->email, FILTER_VALIDATE_EMAIL)
    ) {
        $formErrors[] = 'You must specify a valid mail address';
    }

    if (!isset($messageInformation->subject) || empty($messageInformation->subject)) {
        $formErrors[] = 'You must specify a subject';
    }

    if (!isset($messageInformation->message) || empty($messageInformation->message)) {
        $formErrors[] = 'Your message was empty';
    }

    if (count($formErrors)) {
        error($formErrors);
    }

    if ($messageInformation->subject == 'aze') {
        error(['You fucked up m8']);
    }

    ok([
        'success' => true
    ]);
});

$app->run();
