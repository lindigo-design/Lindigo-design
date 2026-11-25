<?php
/**
 * Заявка з калькулятора вартості (крок 6) → лист на пошту студії.
 * Працює на хостингу з PHP (Hostinger). На GitHub Pages PHP не виконується: форма тоді
 * пропонує людині надіслати той самий лист зі своєї пошти (calculator-client.ts, showFailed).
 *
 * Приймає POST (FormData): name, email, site, comment, call, service, estimate, subject, locale, page, ld_extra (пастка для ботів: нейтральна назва, щоб автозаповнення її не чіпало).
 * Відповідь — JSON { "ok": true } або { "ok": false, "error": "..." }.
 * Ключів і паролів тут немає: лист надсилає стандартна функція mail() хостингу.
 */

const TO = 'contact@lindigo-design.com';
/** Відправник — адреса на домені сайту, інакше пошта хостингу лист не прийме */
const FROM = 'noreply@lindigo-design.com';
const MAX_LEN = 5000;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Текст поля: без керувальних символів, обрізаний до межі */
function field(string $name, int $max = MAX_LEN): string
{
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = preg_replace('/[^\P{C}\n\t]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

/** Один рядок для заголовків листа: без переносів (захист від підміни заголовків) */
function oneLine(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(405, ['ok' => false, 'error' => 'method']);
}

// Бот заповнив приховане поле — відповідаємо «гаразд», але лист не надсилаємо
if (field('ld_extra') !== '') {
    reply(200, ['ok' => true]);
}

$name = oneLine(field('name', 200));
$email = oneLine(field('email', 200));
$site = oneLine(field('site', 500));
$comment = field('comment');
$estimate = field('estimate');
$service = oneLine(field('service', 200));
$subject = oneLine(field('subject', 200)) ?: 'Calculator request';
$call = field('call', 10) === 'yes' ? 'так / oui / yes' : (field('call', 10) === 'no' ? 'ні / non / no' : '—');
$locale = oneLine(field('locale', 5));
$page = oneLine(field('page', 500));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, ['ok' => false, 'error' => 'invalid']);
}

$body = implode("\n", [
    "Ім'я / Nom: $name",
    "Email: $email",
    'Сайт / Site: ' . ($site !== '' ? $site : '—'),
    "Подзвонити / Appel: $call",
    "Мова / Langue: $locale",
    '',
    '--- Коментар / Commentaire ---',
    $comment !== '' ? $comment : '—',
    '',
    '--- Розрахунок / Estimation ---',
    $estimate !== '' ? $estimate : $service,
    '',
    "Сторінка / Page: $page",
]);

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encodedName = '=?UTF-8?B?' . base64_encode($name) . '?=';
$headers = implode("\r\n", [
    'From: Lindigo Design <' . FROM . '>',
    "Reply-To: $encodedName <$email>",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(TO, $encodedSubject, $body, $headers, '-f' . FROM);

reply($sent ? 200 : 500, ['ok' => $sent]);
