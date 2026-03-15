// A simple PHP API for demonstration purposes.

<?php

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$books = [
    ["id" => 1, "title" => "Clean Code", "author" => "Robert C. Martin"],
    ["id" => 2, "title" => "The Pragmatic Programmer", "author" => "Andrew Hunt"]
];

if ($method === 'GET' && $path === '/php/health') {
    http_response_code(200);
    echo json_encode(["status" => "ok", "message" => "PHP API is working"]);
    exit;
}

if ($method === 'GET' && $path === '/php/books') {
    http_response_code(200);
    echo json_encode($books);
    exit;
}

if ($method === 'POST' && $path === '/php/books') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['title']) || !isset($input['author'])) {
        http_response_code(400);
        echo json_encode(["error" => "title and author are required"]);
        exit;
    }

    $newBook = [
        "id" => 3,
        "title" => $input["title"],
        "author" => $input["author"]
    ];

    http_response_code(201);
    echo json_encode($newBook);
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Route not found"]);