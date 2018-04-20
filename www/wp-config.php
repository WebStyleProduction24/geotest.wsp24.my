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
define('AUTH_KEY',         '8]TGcP[c^>M*3he-v0sZQ-Rf(;Ia9VH)tC$sw>Q Sb0dCGQTNVO,#1@#j&=m5MsW');
define('SECURE_AUTH_KEY',  'Ypys6a9a&Sx{kc,)CMAIQla(b|:Oh]&BU:4:dx%5 M%YISg|#t:(fSG1kL3zieJn');
define('LOGGED_IN_KEY',    '<)QmRvHu,Hk589%IS40AtKARKs~zq`Cucr)!|:Q8d.yY;h?J+,;=ZwM09IjfW&<6');
define('NONCE_KEY',        '=T6cQ|}s~i.aV(XrboJ^PS Hsxa.*jJM9g,_hOF`ajAF@GGnHHf%vcF5j@aNm^f3');
define('AUTH_SALT',        '[eu~<&zR2jI*}S/9dMN2sgsAbjM<yPo%%O<|ZU]3VKNr@LrZ+(B5d{e^e#LO4c%2');
define('SECURE_AUTH_SALT', 'v7K7`vWlXAj>uj,ImU4)b/u??.$Q[37= tjCisSSS>(-QPrjk-n[2(bveg6Y~S7q');
define('LOGGED_IN_SALT',   '@^~KSNOM[dU{R_>]1h<5<$`f(8(d>3>?an16=&d|e^CD(@d9B1/+:KJiKn6mQ#_x');
define('NONCE_SALT',       'H~BwPUz!]%7iP&dTq=:%eAuoG/ 3i-]A^3{%X2j2VY0RB0M_s}oL/  W4}D3X[z+');

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
