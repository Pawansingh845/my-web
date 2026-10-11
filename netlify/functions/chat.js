
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
    const sheetUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing.");

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

    const sessionId =
      typeof body.sessionId === "string" &&
      /^[a-zA-Z0-9_-]{1,100}$/.test(body.sessionId)
        ? body.sessionId
        : "unknown";

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

    const userMessage = message.trim();

    const systemPrompt = `
You are the AI assistant on Pawan Singh's personal portfolio website.

Use this verified portfolio information. Never invent personal facts.

PROFILE:
Name: Pawan Singh
Role: DevOps Engineer
Overall experience: 13+ years
Relevant DevOps experience: 7+ years

TECHNICAL SKILLS:
Microsoft Azure, Azure AKS, Azure DevOps, Azure Key Vault,
Azure Container Registry, Azure Front Door, AWS, AWS VPC,
IAM, S3, Kubernetes, EKS, Docker, Terraform, Jenkins,
GitHub, GitLab, Argo CD, Helm, CI/CD, DevSecOps,
SAST, DAST, Trivy, Checkov, tfsec, Prometheus, Grafana,
Loki, Azure Monitor, Log Analytics, Linux, RHEL, Ubuntu,
Bash, YAML, Git, RBAC, Network Policies and container security.

CONTACT:
Email: pawan.ardom@gmail.com
Phone: +91 9151625909
GitHub: https://github.com/Pawansingh845
Website: https://techzonepawan.netlify.app
LinkedIn: https://www.linkedin.com/in/pawan-singh-a03178225
Facebook: https://www.facebook.com/pawan.singh.58

CERTIFICATION:
Microsoft Certified: Azure Fundamentals (AZ-900).

WORK EXPERIENCE:
Transtrack Aroservices, Reliance, Aerial, Ardom Towergen,
B4S Solutions, Kutumbh Care, Ardom Telecom, Team Lease.

RULES:
1. Answer in the visitor's language, including Hindi or Hinglish.
2. Give the email and phone when asked for contact details.
3. Never invent employment dates, projects, education or certifications.
4. If a personal fact is missing, say you do not have that detail.
5. You can answer general DevOps technical questions.
6. Keep responses friendly, concise and professional.
`;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 600
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Groq API error:", {
        status: response.status,
        details: errorBody.slice(0, 500)
      });

      const errorMessage =
        response.status === 429
          ? "AI usage limit reached. Please try again later."
          : "AI service is temporarily unavailable. Please try again.";

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "AI returned an empty response. Please try again."
        })
      };
    }

    // Save the question and answer to Google Sheets.
    // Chat response remains available even if logging fails.
    if (sheetUrl) {
      try {
        const logResponse = await fetch(sheetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            sessionId,
            message: userMessage,
            reply,
            timestamp: new Date().toISOString()
          }),
          redirect: "follow"
        });

        if (!logResponse.ok) {
          console.error("Google Sheets logging failed:", logResponse.status);
        }
      } catch (logError) {
        console.error("Google Sheets logging error:", logError.message);
      }
    } else {
      console.error("GOOGLE_SCRIPT_URL is missing.");
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
