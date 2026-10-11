
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing from the function environment.");

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Server configuration issue: API key is missing."
        })
      };
    }

    let body;

    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON request." })
      };
    }

    const message = body.message;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 1000
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Please send a message up to 1000 characters."
        })
      };
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are the AI assistant on Pawan Singh's DevOps portfolio website.

Pawan's stated skills include Azure, AWS, Kubernetes,
Docker, Terraform, Jenkins, CI/CD, DevSecOps,
monitoring, Linux and Git.

Answer in the language used by the visitor.
Be friendly, concise and professional.
Only state facts about Pawan provided here or explicitly published on his portfolio.
Do not invent employers, certifications, projects, contact details or achievements.
For unknown personal details, suggest contacting Pawan through the portfolio's contact section.
You may answer general DevOps technical questions too.`
            },
            {
              role: "user",
              content: message.trim()
            }
          ],
          temperature: 0.4,
          max_tokens: 500
        })
      }
    );

    if (!response.ok) {
      // Read the error body once and log details server-side.
      return {
  statusCode: 502,
  headers,
  body: JSON.stringify({
    error: `Groq API failed with HTTP ${response.status}`
  })
};
      console.error("Groq API error:", {
        status: response.status,
        details: errorBody.slice(0, 1500)
      });

      let userMessage = "AI service is temporarily unavailable. Please try again.";

      if (response.status === 401 || response.status === 403) {
        userMessage = "AI service authentication failed. Please contact the site owner.";
      } else if (response.status === 429) {
        userMessage = "AI service is busy or its usage limit has been reached. Please try again later.";
      }

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: userMessage })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Groq returned no message content.");

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "AI returned an empty response. Please try again."
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Chat function error:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Chat server error. Please try again."
      })
    };
  }
};
