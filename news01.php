<?php
// URL de la pàgina a llegir
$url = "https://lecturesdelamissa.blogspot.com/";

// Obtenir tot el contingut HTML de la pàgina
$html = file_get_contents($url);

if ($html === false) {
    die("No s'ha pogut obtenir el contingut de la URL.");
}

// Buscar la posició inicial de la paraula "Lectures"
$start = strpos($html, "Lectures");
if ($start === false) {
    die("No s'ha trobat la paraula 'Lectures' en el contingut.");
}

// Buscar la posició final de la paraula "Inici" després de la paraula "Lectures"
$end = strpos($html, "Inici", $start);
if ($end === false) {
    die("No s'ha trobat la paraula 'Inici' en el contingut després de 'Lectures'.");
}

// Extreure el text entre les dues posicions
$substring = substr($html, $start, $end - $start);

// Mostrar el resultat
echo $substring;
?>
