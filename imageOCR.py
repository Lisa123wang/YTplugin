import base64
import requests

# OpenAI API Key
api_key = "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"

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
image_path = "ocrtest.jpg"

# Getting the base64 string
base64_image = encode_image(image_path)

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "give me full text in this image, keep the format which identify from pictures"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ],
    "max_tokens": 500
}

response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

# Assuming the text you want is in the 'choices' part of the response, adjust as needed
try:
    # Trying to extract the text assuming a specific response format
    # Adjust the path according to the actual response format you get
    extracted_text = response.json()['choices'][0]['message']['content']
    print(extracted_text)
except KeyError:
    # In case the response structure is different than expected, print an error message
    print("Could not find the text in the response. Please check the response structure.")
