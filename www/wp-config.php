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
define('AUTH_KEY',         'Y4d.b(rJ/f=[n0El~u:#R2MQ(nu&(mKu2+ALd#*^1:E*B5KcFQg_/5.l1U<5hp+j');
define('SECURE_AUTH_KEY',  '?BXBF[~l7L&F4u+m-)10ljSN~+l,>T.|j)V%?&_{HtMy?i+U_{^M[j:WNZ7U,A1X');
define('LOGGED_IN_KEY',    'UU`MWbn_@er1|.Ts,7%6:T&8w$b-9uKOR^+(<5`Eyz~45.QL$NXptxg=!(1<uv.J');
define('NONCE_KEY',        '~Pq+sf@.SL(mDxHh6=PFo_|y;(6ek/.BWi~R?R7C]{r*#D.TkEOaZ:&eQdw/~kB/');
define('AUTH_SALT',        '868|ttC6_ZTz_<D4rPkiw/LtLm%x`-PBAL~@hf%;n^{5h=>*x)$(;{ {Tb%YUv:1');
define('SECURE_AUTH_SALT', 'f?v{&E_#kn+$LGd{3a0T,p^X3bdjvNV rUbaF(P~44&gZLU;O8qg}aVn@o~pa+ !');
define('LOGGED_IN_SALT',   'lthxdesV,)FFL0`/INX<1VuI0B.%oQ^VG2+>*!7%kN!)P#nu@X3 p8l>RdL9O`<.');
define('NONCE_SALT',       '8#eket!/|R@Ane! AGH[h1-/,~bo@-k+-jTcOwf)vqDcB$4NpRqsQ+pY*?x=,x>F');

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
