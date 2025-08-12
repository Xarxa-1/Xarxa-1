<?php
if (!isset($_GET['url'])) {
    die("Falta el paràmetre 'url'");
}

$url = $_GET['url'];

// Configura cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Segueix redireccions
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// User-Agent d'un navegador real
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36");
// Accepta HTTPS sense problemes (no recomanable en producció sense validació)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$contingut = curl_exec($ch);
curl_close($ch);

// Si cURL falla, mostra un error
if (!$contingut) {
    die("No s'ha pogut carregar el contingut");
}

// Filtrat mínim — només anuncis evidents:
$patrons = [
    '#<script[^>]*>.*?</script>#is',               // tots els scripts
    '#<iframe[^>]*>.*?</iframe>#is',               // iframes
    '#<div[^>]*class="[^"]*(ads|advert|banner)[^"]*"[^>]*>.*?</div>#is', // DIVs amb classe d'anunci
];
$net = preg_replace($patrons, '', $contingut);

// Mostra el contingut net
echo $net;
?>
