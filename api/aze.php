<?php

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

$schedule = simplexml_load_file('aze.xml');

$showId = null;
$date = null;
$time = null;
$showName = null;
$episodeName = null;
$season = null;
$episode = null;


$stmt = db::conn()->prepare(<<<'SQL'
INSERT INTO episode VALUES (DEFAULT, :name, :season, :episode, :date, :showId)
SQL
);

$stmt->bindParam(':name', $episodeName);
$stmt->bindParam(':season', $season);
$stmt->bindParam(':episode', $episode);
$stmt->bindParam(':date', $date);
$stmt->bindParam(':showId', $showId);

foreach ($schedule as $day) {
    $date = $day['attr'];
    foreach ($day as $hour) {
        $time = $hour['attr'];

        foreach ($hour as $show) {
            $showName = $show['name'];
            $episodeName = $show->title;
            $season = strtok($show->ep, 'x');
            $episode = strtok('x');
            echo $date . ' | ' . $time . ' | ' . $showName . ' | ' . $episodeName . ' | ' . $season . ' | ' . $episode . '<br/>';
            $stmt->execute();
        }
    }
}

echo 'lel';