document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit').addEventListener('click', function() {
        var question = document.getElementById('question').value;
        var responseElement = document.getElementById('response');

        if (question) {
            fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-instruct",
                    prompt: question,
                    max_tokens: 100
                })
            })
            .then(response => response.json())
            .then(data => {
                responseElement.innerText = data.choices[0].text.trim();
            })
            .catch(error => {
                console.error('Error:', error);
                responseElement.innerText = "Error fetching response.";
            });
        } else {
            responseElement.innerText = "Please enter a question.";
        }
    });
});
