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

$stmt3 = db::conn()->prepare(<<<'SQL'
INSERT IGNORE INTO `_show` (name) VALUES (:name)
SQL
);

$stmt3->bindParam(':name', $showName);

$stmt2 = db::conn()->prepare(<<<'SQL'
SELECT id
FROM `_show`
WHERE name = :name;
SQL
);

$stmt2->bindParam(':name', $showName);

$stmt = db::conn()->prepare(<<<'SQL'
INSERT INTO episode VALUES (DEFAULT, :name, :season, :episode, :date, :showId)
SQL
);

$stmt->bindParam(':name', $episodeName);
$stmt->bindParam(':season', $season);
$stmt->bindParam(':episode', $episode);
$stmt->bindParam(':date', $time);
$stmt->bindParam(':showId', $showId);

foreach ($schedule as $day) {
    $date = $day['attr'];
    foreach ($day as $hour) {
        $time = $date . ' ' . $hour['attr'];

        foreach ($hour as $show) {
            $showName = $show['name'];
            $episodeName = $show->title;
            $season = strtok($show->ep, 'x');
            $episode = strtok('x');
            echo $showId . ' | ' . $time . ' | ' . $showName . ' | ' . $episodeName . ' | ' . $season . ' | ' . $episode . '<br/>';
            $stmt3->execute();
            $stmt2->execute();
            $showId = $stmt2->fetchColumn();
            $stmt->execute();
        }
    }
}

echo 'lel';