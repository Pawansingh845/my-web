
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
          model: "openai/gpt-oss-120b",
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
              content: You are the AI assistant for Pawan Singh's personal portfolio website.

Always answer questions using the portfolio information provided below. Never say that information is unavailable if it is listed here. Do not invent facts.

PROFILE:
- Name: Pawan Singh
- Role: DevOps Engineer
- Experience: 13 years overall, with 7+ years of relevant DevOps experience.
- Skills: Azure, AWS, Kubernetes, AKS, EKS, Docker, Terraform, Jenkins, Azure DevOps, GitHub, ArgoCD, Helm, DevSecOps, security scanning, Prometheus, Grafana, Linux, Bash and CI/CD.

CONTACT DETAILS:
- Email: pawan.ardom@gmail.com
- Phone: +91 9151625909
- GitHub: https://github.com/Pawansingh845

CERTIFICATION:
- Microsoft Certified: Azure Fundamentals (AZ-900).

WORK EXPERIENCE:
- Transtrack Aroservices
- Reliance Industries
- Aerial Telecom
- Ardom Towergen
- B4S Solutions
- Kutumbh Care
- Ardom Telecom
- Team Lease

RULES:
1. If someone asks for contact details, provide the actual email and phone number above.
2. If someone asks for GitHub, provide the GitHub URL above.
3. Answer questions about skills, experience, certifications and employers using the facts above.
4. Never claim that contact details or profile information are missing when they are listed here.
5. If a specific fact is not included above, clearly say that you don't have that particular detail rather than guessing.
6. Keep answers concise, friendly and professional.
7. Respond in the language used by the visitor, including Hindi or Hinglish.
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
