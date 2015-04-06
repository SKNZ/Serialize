<?php

session_cache_limiter(false);
session_start();

class db {

    private static $pdo = null;


    /**
     * @return PDO
     */
    public static function conn() {
        if (is_null(self::$pdo)) {
            self::$pdo =
                new PDO('mysql:host=localhost;dbname=serialize', 'root', '');
            self::$pdo->exec('SET CHARACTER SET utf8');
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,
                                     PDO::FETCH_ASSOC);
        }

        return self::$pdo;
    }
}

db::conn(); // Initialize the database connection straight away

use Slim\Slim;

require 'vendor/autoload.php';
$app = new Slim([
//    'debug' => true
                ]);

function error(array $errors = ['An unknown error happened '],
               $errorCode = 200) {
    Slim::getInstance()->contentType('application/json');
    Slim::getInstance()->halt(200,
                              json_encode([
                                              'success' => false,
                                              'errors' => $errors
                                          ]));
}

function ok($response = null) {
    $response =
        $response != null
            ? array_merge(['success' => true], $response)
            : ['success' => true];

    Slim::getInstance()->contentType('application/json');
    Slim::getInstance()->response->body(json_encode($response));
}

function auth() {
    if (!isset($_SESSION['auth'])) {
        error(['Authentication required']);
    }
}

$app->error(function (\Exception $e) use ($app) {
    error();
});

// Users
$app->group('/user',
    function () use ($app) {
        // Authentication
        $app->group('/session',
            function () use ($app) {
                // Login
                $app->post('/',
                    function () use ($app) {
                        $jsonBody = json_decode($app->request->getBody());

                        if (!isset($jsonBody->authCredentials)) {
                            error(['Invalid data format']);
                        }

                        $authCredentials = $jsonBody->authCredentials;

                        if (!isset($authCredentials->email)
                            || !filter_var($authCredentials->email,
                                           FILTER_VALIDATE_EMAIL)
                        ) {
                            error(['Your must specify a valid email address']);
                        }

                        if (!isset($authCredentials->password)
                            || empty($authCredentials->password)
                        ) {
                            error(['Your must specify a password']);
                        }

                        $user = null;
                        try {
                            $db = db::conn();
                            $stmt = $db->prepare(<<<'SQL'
SELECT *
FROM user
WHERE email = ?;
SQL
                            );

                            $stmt->execute([$authCredentials->email]);
                            if (!$stmt->rowCount()) {
                                error(['Invalid credentials']);
                            }

                            $user = $stmt->fetch();
                            if (!password_verify($authCredentials->password,
                                                 $user['password'])
                            ) {
                                error(['Invalid credentials']);
                            }

                            $stmt = $db->prepare(<<<'SQL'
SELECT *
FROM user
JOIN user_email_validation ON user.id = user_email_validation.id
WHERE user.email = ?;
SQL
                            );

                            $stmt->execute([$authCredentials->email]);
                            if ($stmt->rowCount()) {
                                error(['Your must confirm your mail address']);
                            }
                        } catch (PDOException $e) {
                            error(['Unknown database error']);
                        }

                        unset($user['password']);
                        // Gravatar
                        $user['emailHash'] =
                            md5(strtolower(trim($user['email'])));

                        $_SESSION['auth'] = true;
                        $_SESSION['currentUser'] = $user;
                        ok([
                               'currentUser' => $user
                           ]);
                    });

                // Logout
                $app->delete('/',
                             'auth',
                    function () use ($app) {
                        session_destroy();
                        ok();
                    });

                // Connected ?
                $app->get('/',
                          'auth',
                    function () use ($app) {
                        ok([
                               'currentUser' => $_SESSION['currentUser']
                           ]);
                    });
            });

        // Email available
        $app->get('/exists/:email',
            function ($email) use ($app) {
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    error(['Not a valid mail address']);
                }

                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT *
FROM user
WHERE email = ?
SQL
                    );

                    $stmt->execute([$email]);
                    if ($stmt->rowCount()) {
                        error(['Email in use']);
                    }
                } catch (PDOException $e) {
                    error(['Unknown database error']);
                }

                ok();
            });

        // Mail confirm
        $app->get('/confirm/:token',
            function ($token) use ($app) {
                if (empty($token)) {
                    error(['Invalid token']);
                }

                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
            DELETE
            FROM user_email_validation
            WHERE token = ?
SQL
                    );
                    $stmt->execute([$token]);
                    if (!$stmt->rowCount()) {
                        error(['Invalid token']);
                    };
                } catch (PDOException $e) {
                    error(['Unknown database error', $e->getMessage()]);
                }

                $app->redirect('http'
                               . (isset($_SERVER['HTTPS']) ? 's' : '')
                               . '://'
                               . $_SERVER['HTTP_HOST']
                               . $app->request->getRootUri()
                               . '/../');
            });

        // Registration
        $app->put('/',
            function () use ($app) {
                $jsonBody = json_decode($app->request->getBody());

                if (!isset($jsonBody->accountInformation)) {
                    error(['Invalid data format']);
                }

                $formErrors = [];

                $accountInformation = $jsonBody->accountInformation;
                if (!isset($accountInformation->email)
                    || !filter_var($accountInformation->email,
                                   FILTER_VALIDATE_EMAIL)
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
                        if (!preg_match($passwordRegexes[$i],
                                        $accountInformation->password)
                        ) {
                            $formErrors[] = $passwordRegexesErrors[$i];
                        }
                    }
                }

                if (!isset($accountInformation->passwordConfirmation)
                    || empty($accountInformation->passwordConfirmation)
                ) {
                    $formErrors[] = 'You must confirm your password';
                } else {
                    if (isset($accountInformation->password)
                        && $accountInformation->passwordConfirmation !=
                           $accountInformation->password
                    ) {
                        $formErrors[] =
                            'Your password confirmation does not match';
                    }
                }

                if (!isset($accountInformation->firstName)
                    || empty($accountInformation->firstName)
                ) {
                    $formErrors[] = 'You must specify a first name';
                }

                if (!isset($accountInformation->lastName)
                    || empty($accountInformation->lastName)
                ) {
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

                $db = db::conn();
                try {
                    $stmt = $db->prepare(<<<'SQL'
SELECT *
FROM user
WHERE email = :email
SQL
                    );

                    $stmt->execute([':email' => $accountInformation->email]);

                    if ($stmt->rowCount()) {
                        error(['This mail address is already in use']);
                    }

                    $db->beginTransaction();
                    $stmt = $db->prepare(<<<'SQL'
INSERT INTO user
        (email, password, firstName, lastName, description, weeklyDigest, newsletter)
VALUES (:email, :password, :firstName, :lastName, :description, :weeklyDigest, :newsletter)
SQL
                    );

                    $accountInformation->password =
                        password_hash($accountInformation->password,
                                      PASSWORD_BCRYPT);

                    $stmt->bindValue(':email',
                                     $accountInformation->email,
                                     PDO::PARAM_STR);

                    $stmt->bindValue(':password',
                                     $accountInformation->password,
                                     PDO::PARAM_STR);

                    $stmt->bindValue(':firstName',
                                     $accountInformation->firstName,
                                     PDO::PARAM_STR);

                    $stmt->bindValue(':lastName',
                                     $accountInformation->lastName,
                                     PDO::PARAM_STR);

                    $stmt->bindValue(':description',
                                     $accountInformation->description,
                                     PDO::PARAM_STR);

                    $stmt->bindValue(':weeklyDigest',
                                     $accountInformation->weeklyDigest,
                                     PDO::PARAM_BOOL);

                    $stmt->bindValue(':newsletter',
                                     $accountInformation->newsletter,
                                     PDO::PARAM_BOOL);

                    $stmt->execute();

                    $userId = $db->lastInsertId();
                    $randString = bin2hex(openssl_random_pseudo_bytes(30));

                    $db->prepare(<<<'SQL'
INSERT INTO user_email_validation VALUES (?, ?)
SQL
                    )->execute([$userId, $randString]);

                    mail($accountInformation->email,
                         'Serialize account activation',
                         'Please activate your Serialize account at: '
                         . 'http'
                         . (isset($_SERVER['HTTPS']) ? 's' : '')
                         . '://'
                         . $_SERVER['HTTP_HOST']
                         . $app->request->getRootUri()
                         . '/user/confirm/'
                         . urlencode($randString));

                    $db->commit();
                } catch (PDOException $e) {
                    $db->rollBack();
                    error(['Unknown database error',
                           $e->getMessage(),
                           $e->getLine(),
                           $e->getTraceAsString()]);
                }

                ok();
            });
    });

$app->group('/show',
    function () use ($app) {
        // Latest shows
        $app->get('/latest',
            function () use ($app) {
                $shows = [];
                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT episode.id,
        episode.showId,
        CONCAT('E', LPAD(episode.episode, IF(episode > 99, 3, 2), '0')) AS episode,
        CONCAT('S', LPAD(episode.season, 2, '0')) AS season,
        episode.episodeName,
        DATE_FORMAT(episode.date, '%Y-%m-%d %k:%i') AS date,
        _show.id AS showId,
        `_show`.name
FROM episode
JOIN `_show` ON episode.showId = `_show`.id
WHERE date BETWEEN DATE_SUB(NOW(), INTERVAL 10 DAY) AND NOW()
ORDER BY date DESC
LIMIT 10;
SQL
                    );

                    $stmt->execute();
                    $shows = $stmt->fetchAll();
                } catch (PDOException $e) {
                    error(['Unknown database error']);
                }

                ok([
                       'latestShows' => $shows
                   ]);
            });

        // Your shows
        $app->get('/your',
                  'auth',
            function () use ($app) {

                $shows = [];
                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT episode.id,
        episode.showId,
        CONCAT('E', LPAD(episode.episode, IF(episode > 99, 3, 2), '0')) AS episode,
        CONCAT('S', LPAD(episode.season, 2, '0')) AS season,
        episode.episodeName,
        DATE_FORMAT(episode.date, '%Y-%m-%d %k:%i') AS date,
        _show.id AS showId,
        `_show`.name
FROM episode
JOIN `_show` ON episode.showId = `_show`.id
JOIN user_show ON user_show.showId = `_show`.id
WHERE date > NOW()
  AND user_show.userId = ?
ORDER BY date DESC
LIMIT 10;
SQL
                    );

                    $stmt->execute([$_SESSION['currentUser']['id']]);
                    $shows = $stmt->fetchAll();
                } catch (PDOException $e) {
                    error(['Unknown database error', $e->getMessage()]);
                }

                ok([
                       'yourShows' => $shows
                   ]);
            });

        // Search
        $app->post('/search',
                   'auth',
            function () use ($app) {
                $jsonBody = json_decode($app->request->getBody());

                if (!isset($jsonBody->search) || empty($jsonBody->search)) {
                    error(['You must specify the search terms.']);
                }

                $shows = [];
                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT _show.*, IF(user_show.userId = :user, TRUE, FALSE) AS subscribed
FROM `_show`
LEFT JOIN user_show ON `_show`.id = user_show.showId
WHERE MATCH (name) AGAINST (:search);
SQL
                    );

                    $stmt->execute([':search' => $jsonBody->search,
                                    ':user' => $_SESSION['currentUser']['id']]);
                    $shows = $stmt->fetchAll();
                } catch (PDOException $e) {
                    error(['Unknown database error', $e->getMessage()]);
                }

                foreach ($shows as &$show) {
                    $show['subscribed'] = boolval($show['subscribed']);
                }

                ok([
                       'shows' => $shows
                   ]);
            });

        // Subscribe
        $app->post('/:id/subscribe',
                   'auth',
            function ($id) use ($app) {
                if (!filter_var($id, FILTER_VALIDATE_INT)) {
                    error(['Invalid parameter ']);
                }

                $jsonBody = json_decode($app->request->getBody());
                if (!isset($jsonBody->subscribed)
                    || filter_var($jsonBody->subscribed,
                                  FILTER_VALIDATE_BOOLEAN,
                                  FILTER_NULL_ON_FAILURE) === null
                ) {
                    error(['Invalid data format']);
                }

                try {
                    if (boolval($jsonBody->subscribed)) {
                        $stmt = db::conn()->prepare(<<<'SQL'
REPLACE INTO user_show VALUES (:user, :show)
SQL
                        );

                        $stmt->execute(
                            [
                                ':user' => $_SESSION['currentUser']['id'],
                                ':show' => $id
                            ]);
                    } else {
                        $stmt = db::conn()->prepare(<<<'SQL'
DELETE FROM user_show WHERE showId = :show AND userId = :user
SQL
                        );
                        $stmt->execute(
                            [
                                ':user' => $_SESSION['currentUser']['id'],
                                ':show' => $id
                            ]);
                    }

                } catch (PDOException $e) {
                    error(['Unknown database error', $e->getMessage()]);
                }

                ok(['subscribed' => $jsonBody->subscribed]);
            });

        // Get show
        $app->get('/:id',
            function ($id) use ($app) {
                if (!filter_var($id, FILTER_VALIDATE_INT)) {
                    error(['Invalid parameter']);
                }

                $show = null;
                try {
                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT id,
        name,
        IF(user_show.userId = :user, TRUE, FALSE) AS subscribed
FROM `_show`
LEFT JOIN user_show ON user_show.showId = `_show`.id
WHERE id = :show
SQL
                    );
                    $stmt->execute([
                                       'show' => $id,
                                       'user' => $_SESSION['auth'] ? $_SESSION['currentUser']['id'] : -1
                                   ]);
                    $show = $stmt->fetch();

                    $stmt = db::conn()->prepare(<<<'SQL'
SELECT *,
        CONCAT('E', LPAD(episode.episode, IF(episode > 99, 3, 2), '0')) AS episode,
        CONCAT('S', LPAD(episode.season, 2, '0')) AS season,
        DATE_FORMAT(episode.date, '%Y-%m-%d %k:%i') AS date
FROM episode
JOIN `_show` ON `_show`.id = episode.showId
WHERE episode.showId = ?
ORDER BY date DESC
SQL
                    );

                    $stmt->execute([$id]);

                    $show['subscribed'] = boolval($show['subscribed']);
                    $show['episodes'] = $stmt->fetchAll();
                } catch (PDOException $e) {
                    error(['Unknown database error', $e->getMessage()]);
                }

                ok([
                       'show' => $show
                   ]);
            });
    });

$app->group('/episode',
    function () use ($app) {
        $app->group('/:id/comment',
                    'auth',
            function () use ($app) {
                // Get comments
                $app->get('/',
                    function ($id) use ($app) {
                        if (!filter_var($id, FILTER_VALIDATE_INT)) {
                            error(['Invalid parameter']);
                        }

                        $comments = [];
                        try {
                            $stmt = db::conn()->prepare(<<<'SQL'
SELECT episode_comments.*,
      user.firstName,
      user.lastName,
        DATE_FORMAT(date, '%Y-%m-%d %k:%i') AS date
FROM episode_comments
JOIN user ON user.id = episode_comments.userId
WHERE episodeId = ?
ORDER BY date DESC
SQL
                            );
                            $stmt->execute([$id]);
                            $comments = $stmt->fetchAll();

                            foreach ($comments as &$comment) {
                                unset($comment['userId']);
                            }
                        } catch (PDOException $e) {
                            error(['Unknown database error', $e->getMessage()]);
                        }

                        ok([
                               'comments' => $comments
                           ]);
                    });

                // Post comment
                $app->post('/',
                    function ($id) use ($app) {
                        if (!filter_var($id, FILTER_VALIDATE_INT)) {
                            error(['Invalid parameter']);
                        }

                        $jsonBody = json_decode($app->request->getBody());
                        if (!isset($jsonBody->comment)) {
                            error(['Invalid data format']);
                        }

                        $comment = $jsonBody->comment;
                        $formErrors = [];

                        if (!isset($comment->subject)
                            || empty($comment->subject)
                        ) {
                            $formErrors[] = 'You must specify a subject';
                        }

                        if (!isset($comment->rating)
                            || !filter_var($comment->rating,
                                           FILTER_VALIDATE_INT)
                            || empty($comment->rating)
                            || !($comment->rating >= 1 && $comment->rating <= 5)
                        ) {
                            $formErrors[] =
                                'You must specify a numeric rating between 1 and 5';
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

                        try {
                            $stmt = db::conn()->prepare(<<<'SQL'
INSERT INTO episode_comments
        (episodeId, userId, date, rating, subject, message)
VALUES  (:episode, :user, NOW(), :rating, :subject, :message)
SQL
                            );
                            $stmt->bindParam(':episode', $id, PDO::PARAM_INT);
                            $stmt->bindParam(':user',
                                             $_SESSION['currentUser']['id'],
                                             PDO::PARAM_INT);
                            $stmt->bindParam(':rating', $comment->rating);
                            $stmt->bindParam(':subject', $comment->subject);
                            $stmt->bindParam(':message', $comment->message);

                            $stmt->execute();
                        } catch (PDOException $e) {
                            error(['Unknown database error']);
                        }

                        ok();
                    });
            });
    });

$app->post('/contact',
    function () use ($app) {
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

        if (!isset($messageInformation->subject)
            || empty($messageInformation->subject)
        ) {
            $formErrors[] = 'You must specify a subject';
        }

        if (!isset($messageInformation->message)
            || empty($messageInformation->message)
        ) {
            $formErrors[] = 'Your message was empty';
        }

        if (count($formErrors)) {
            error($formErrors);
        }

        mail('florandara@gmail.com',
             '[Serialize] ' . $messageInformation->subject,
             $messageInformation->message,
             'From: ' . $messageInformation->email);

        ok([
               'success' => true
           ]);
    });

$app->run();
