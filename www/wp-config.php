<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define('DB_NAME', 'geotest');

/** Имя пользователя MySQL */
define('DB_USER', 'root');

/** Пароль к базе данных MySQL */
define('DB_PASSWORD', '');

/** Имя сервера MySQL */
define('DB_HOST', 'localhost');

/** Кодировка базы данных для создания таблиц. */
define('DB_CHARSET', 'utf8');

/** Схема сопоставления. Не меняйте, если не уверены. */
define('DB_COLLATE', '');

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'b`F%VL<;sz_gg+hW@%p+uKm3M{{Yz[Yb6D8875wx)kdG+>+8u=wPmQYTTzuznM2>');
define('SECURE_AUTH_KEY',  'z-PB%cy!5x)(yOq|X.]L&.(/?jA)tG;6l@mb[=$?ACPwDka>9{$(vFB77TrLyCj$');
define('LOGGED_IN_KEY',    'gfm]bzG4hUpi %N# F??*>I;cg>hHt/{vR3E9mYc;oH%=Vtsw2g( j3r.DVAB?pt');
define('NONCE_KEY',        'iBgH[B<u4}A2cet9.j0^UH6,kl:&qV2@Q0%t(5Fz>Yf?7Ua+?9#OTp` #.6JX^% ');
define('AUTH_SALT',        'VgSW|DG$gKK&%j|LZrMH=,nQ9.yR@6&=r@Fh-7&!p9bCR+1Sk)emwVGfQQ5z_8),');
define('SECURE_AUTH_SALT', 'F|4d4gzQAzzV8Q~4Qlrv~@0E*(:p5a7~*+M?0`=:%S1yeOwrnRMjoA[)<peUe2IM');
define('LOGGED_IN_SALT',   'eEV*(OZD|SEEZ93kf-VVTWnbgfa6#Hz?v:k;Z2FK#ZX[I>O+bL9Gs _035Km{7kv');
define('NONCE_SALT',       'f0>x vpB=lC)59n?&{d>!aaPG.u1ZYXPwJM@d?AWXU7u>*y0Z}]Ow]q!YxE93dgV');

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix  = 'wp_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Инициализирует переменные WordPress и подключает файлы. */
require_once(ABSPATH . 'wp-settings.php');
