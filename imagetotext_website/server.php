<?php

$openai_api_key = '';

// Assuming you receive an image URL from a form or API request
$imageUrl = $_POST['imageUrl']; // Or $_GET, depending on your form method

// Function to call OpenAI's API for image analysis
function analyzeImageWithOpenAI($imageUrl, $api_key) {
    $ch = curl_init('https://api.openai.com/v1/chat/completions');

    $data = [
        "model" => "gpt-4-vision-preview",
        "messages" => [
            [
                "role" => "user",
                "content" => [
                    ["type" => "text", "text" => "What’s in this image?"],
                    ["type" => "image_url", "image_url" => ["url" => $imageUrl]]
                ]
            ]
        ],
        "max_tokens" => 300
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key,
    ];

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

$response = analyzeImageWithOpenAI($imageUrl, $openai_api_key);
echo $response;
?>
