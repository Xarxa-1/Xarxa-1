<?php
$url = 'https://www.meteoprades.net/webcam/imatges/lapena_ara.jpg';

// Estableix les capçaleres perquè el navegador sàpiga que és una imatge
header('Content-Type: image/jpeg');

// Obté la imatge des de l'URL d'origen
echo file_get_contents($url);
?>
