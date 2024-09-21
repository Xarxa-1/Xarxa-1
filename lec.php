<?php
$self = $_SERVER['PHP_SELF']; //Obtenemos la p?gina en la que nos encontramos
echo '<meta charset="utf-8"><meta name="viewport" content="width=device-width; initial-scale=1.0; user-scalable=1;" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="msapplication-navbutton-color" content="#000000" />
<meta name="theme-color" content="#000000" />

<link rel="apple-touch-icon" sizes="57x57" href="lec/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="lec/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="lec/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="lec/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="lec/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="lec/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="lec/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="lec/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="lec/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="lec/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="lec/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="lec/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="lec/favicon-16x16.png">
<link rel="manifest" href="/lec/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="lec/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">

<link href="http://fonts.googleapis.com/css?family=Signika" rel="stylesheet" type="text/css" /><font color="#000000" face="Signika">
<title>Lec</title>
<body bgcolor="#e8ffba" style="position:absolute; left: 1px; top: 2px;><font color="#000000" face="Signika">';
echo '<style type="text/css">
p,h1,h2,div {margin:0}</style>';
echo date("H:i:s d-m-Y",time()+18000);
echo '<style type="text/css">
/* permanece oculto en cualquier pantalla... */
#boton-agrandar-ancho {
    display: none;
}
/* ...pero se muestra para anchos mayores */
@media screen and (min-width: 100px) {
    #boton-agrandar-ancho {
        cursor: pointer;
        display: inline;
        margin: 4px 4px 0 0;
        padding: 0;
        border: 0;
        background-color: transparent;
        font-size: 1.5em;
        font-weight: bold;
        color: orange;
        background-image: none;
        float: right;
    }
div {
	width:450px;
	font-size: 2em;
	text-align: justify;
	font-family: Signika;
}
}</style>';



echo '<CENTER><div style="margin-left:1px;padding:0px;background-color:#590000;font-color:#000000f;width=99%"><h2></h2></div></CENTER>';
$url = "http://lecturesdelamissa.blogspot.com/"; 
$raw = file_get_contents($url); 
preg_match('/<h3 class="post-title entry-title" style="color: #11304c; font-family: &quot;Trebuchet MS&quot;, Trebuchet, sans-serif; font-size: 17px; font-stretch: normal; font-weight: normal; line-height: normal; margin: 0px; position: relative;">(.*)post-footer/isU',$raw,$texto); 
echo '<body><div class"boton-agrandar-ancho">';
echo $texto[1];
echo '<p><hr>';

?>