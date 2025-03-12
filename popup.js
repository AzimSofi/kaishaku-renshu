document.addEventListener("DOMContentLoaded", function() {
  const apiKeyInput = document.getElementById("apiKey");
  const modelInput = document.getElementById("model");
  const interpretationInput = document.getElementById("interpretation");
  const checkButton = document.getElementById("check");
  const clearButton = document.getElementById("clear");
  const responseDiv = document.getElementById("response");

  chrome.storage.sync.get(["apiKey", "model", "selectedText", "interpretation", "aiResponse"], function(data) {
    apiKeyInput.value = data.apiKey || "";
    modelInput.value = data.model || "gemini-2.0-flash";
    interpretationInput.value = data.interpretation || "";
    responseDiv.innerText = data.aiResponse || "";
    const selectedText = data.selectedText;

    apiKeyInput.addEventListener("change", function() {
      chrome.storage.sync.set({ apiKey: apiKeyInput.value });
    });
    modelInput.addEventListener("change", function() {
      chrome.storage.sync.set({ model: modelInput.value });
    });

    interpretationInput.addEventListener("change", function() {
      chrome.storage.sync.set({ interpretation: interpretationInput.value });
    });

    checkButton.addEventListener("click", function() {
      const apiKey = apiKeyInput.value;
      const model = modelInput.value;
      const interpretation = interpretationInput.value;

      fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
              原文: 「${selectedText}」
              ユーザーの解釈: 「[${interpretation}]」

              この解釈は原文と一致するか？（０から１００までのスコアをつけてください。）
              それに応じて、ユーザーの解釈を修正してください。
              それに、間違い文法と不自然な表現を修正してください、こっちもスコアをつけてください（０から１００まで）。
              
              ※まずユーザーのスコアを表示してください、（解釈と文法と表現のスコア）。
              ※できるだけ簡潔の回答にしてください。
              `            
            }]
          }]
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            responseDiv.innerText = "Error: " + data.error.message;
          } else {
            let aiResponse = data.candidates[0].content.parts[0].text;
            aiResponse = aiResponse.replace(/\*/g, '');
            responseDiv.innerText = aiResponse;
            chrome.storage.sync.set({ aiResponse: aiResponse });
          }
        });
    });

    clearButton.addEventListener("click", function() {
      responseDiv.innerText = "";
      chrome.storage.sync.set({ aiResponse: "" });
    });
  });
});
