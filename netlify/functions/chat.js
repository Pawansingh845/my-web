
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
      throw new Error("GROQ_API_KEY is not configured");
    }

    const body = JSON.parse(event.body || "{}");
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
              content: `You are the AI assistant on Pawan Singh's
DevOps portfolio website.

Pawan's stated skills include Azure, AWS, Kubernetes,
Docker, Terraform, Jenkins, CI/CD, DevSecOps,
monitoring, Linux and Git.

Answer in the language used by the visitor.
Be friendly, concise and professional.
Only state facts about Pawan that are provided here
or explicitly published on his portfolio.
Do not invent employers, certifications, projects,
contact details or achievements.
For unknown personal details, suggest contacting Pawan
through the portfolio's contact section.
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
      console.error("Groq API returned status:", response.status);

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "AI service is temporarily unavailable. Please try again."
        })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty AI response");
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
        error: "Something went wrong. Please try again."
      })
    };
  }
};
