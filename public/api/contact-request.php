<?php
/**
 * Заявка з форми сторінки «Контакти» → лист на пошту студії (з файлом, якщо його додали).
 * Працює на хостингу з PHP (Hostinger). На GitHub Pages PHP не виконується: форма тоді
 * пропонує людині надіслати лист зі своєї пошти (contact-client.ts, showFailed).
 *
 * Приймає POST (multipart/form-data): name, email, company, site, interest[], budget, message, consent,
 * summary (готовий текст запиту мовою сторінки), subject, locale, page, attachment (файл, необов'язковий),
 * ld_extra (пастка для ботів).
 * Відповідь — JSON { "ok": true } або { "ok": false, "error": "..." }.
 * Ключів і паролів тут немає: лист надсилає стандартна функція mail() хостингу.
 */

const TO = 'contact@lindigo-design.com';
/** Відправник — адреса на домені сайту, інакше пошта хостингу лист не прийме */
const FROM = 'noreply@lindigo-design.com';
const MAX_LEN = 5000;
const MAX_FILE = 10 * 1024 * 1024;
const FILE_TYPES = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png'];

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
$company = oneLine(field('company', 200));
$site = oneLine(field('site', 500));
$budget = oneLine(field('budget', 50));
$message = field('message');
$summary = field('summary');
$subject = oneLine(field('subject', 200)) ?: 'Website request';
$locale = oneLine(field('locale', 5));
$page = oneLine(field('page', 500));
$interest = [];
if (isset($_POST['interest']) && is_array($_POST['interest'])) {
    foreach ($_POST['interest'] as $v) {
        if (is_string($v)) $interest[] = oneLine(mb_substr($v, 0, 50));
    }
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || field('consent', 10) === '') {
    reply(422, ['ok' => false, 'error' => 'invalid']);
}

// Файл: лише PDF, JPG, PNG до 10 МБ; тип перевіряємо за вмістом, а не за назвою
$file = null;
if (isset($_FILES['attachment']) && is_array($_FILES['attachment']) && ($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $f = $_FILES['attachment'];
    if ($f['error'] !== UPLOAD_ERR_OK || $f['size'] > MAX_FILE || !is_uploaded_file($f['tmp_name'])) {
        reply(422, ['ok' => false, 'error' => 'file']);
    }
    $type = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) ?: '';
    if (!isset(FILE_TYPES[$type])) {
        reply(422, ['ok' => false, 'error' => 'file-type']);
    }
    $base = preg_replace('/[^\p{L}\p{N}._ -]+/u', '_', pathinfo((string) $f['name'], PATHINFO_FILENAME)) ?: 'file';
    $file = [
        'name' => mb_substr($base, 0, 80) . '.' . FILE_TYPES[$type],
        'type' => $type,
        'data' => file_get_contents($f['tmp_name']),
    ];
}

$body = implode("\n", [
    "Ім'я / Nom: $name",
    "Email: $email",
    'Компанія / Entreprise: ' . ($company !== '' ? $company : '—'),
    'Сайт / Site: ' . ($site !== '' ? $site : '—'),
    'Цікавить / Intérêt: ' . ($interest ? implode(', ', $interest) : '—'),
    'Бюджет / Budget: ' . ($budget !== '' ? $budget : '—'),
    "Мова / Langue: $locale",
    'Файл / Fichier: ' . ($file ? $file['name'] : '—'),
    '',
    '--- Повідомлення / Message ---',
    $message !== '' ? $message : '—',
    '',
    '--- Як на сторінці / Tel que saisi ---',
    $summary !== '' ? $summary : '—',
    '',
    "Сторінка / Page: $page",
]);

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encodedName = '=?UTF-8?B?' . base64_encode($name) . '?=';
$headers = [
    'From: Lindigo Design <' . FROM . '>',
    "Reply-To: $encodedName <$email>",
    'MIME-Version: 1.0',
];

if ($file) {
    $boundary = 'ld_' . bin2hex(random_bytes(12));
    $headers[] = "Content-Type: multipart/mixed; boundary=\"$boundary\"";
    $fileName = '=?UTF-8?B?' . base64_encode($file['name']) . '?=';
    $body = implode("\r\n", [
        "--$boundary",
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        chunk_split(base64_encode($body)),
        "--$boundary",
        "Content-Type: {$file['type']}; name=\"$fileName\"",
        'Content-Transfer-Encoding: base64',
        "Content-Disposition: attachment; filename=\"$fileName\"",
        '',
        chunk_split(base64_encode($file['data'])),
        "--$boundary--",
    ]);
} else {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
}

$sent = mail(TO, $encodedSubject, $body, implode("\r\n", $headers), '-f' . FROM);

reply($sent ? 200 : 500, ['ok' => $sent]);
