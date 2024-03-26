<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$imageUrl = $data['imageUrl'] ?? '';

if (!empty($imageUrl)) {
    $apiKey = 'AIzaSyAXhxfp8dsKjcdOl4OpB-CsJVaLmwts2eg'; // Make sure to replace with your actual API key
    $url = 'https://vision.googleapis.com/v1/images:annotate?key=' . $apiKey;

    $curl = curl_init($url);
    $postData = [
        'requests' => [
            [
                'image' => ['source' => ['imageUri' => $imageUrl]],
                'features' => [['type' => 'DOCUMENT_TEXT_DETECTION']], // Changed to DOCUMENT_TEXT_DETECTION
            ]
        ]
    ];

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($response === false) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to connect to the API: ' . $err]);
    } else {
        $responseArray = json_decode($response, true);
        if (isset($responseArray['responses'][0]['error'])) {
            echo json_encode([
                'status' => 'error', 
                'message' => 'API returned an error: ' . $responseArray['responses'][0]['error']['message']
            ]);
        } else {
            // Extracted the full text from the image
            $fullTextAnnotation = $responseArray['responses'][0]['fullTextAnnotation']['text'] ?? 'No text found.';
            echo json_encode([
                'status' => 'success', 
                'message' => 'Full text received.', 
                'data' => ['text' => $fullTextAnnotation] // Providing the full text directly
            ]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No image URL provided.']);
}
