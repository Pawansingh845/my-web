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

    const systemPrompt = `
You are the AI assistant on Pawan Singh's personal portfolio website.

Use the following verified portfolio information to answer questions.
Never say a detail is unavailable if it is provided below.
Never invent personal facts or achievements.

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

CONTACT DETAILS:
Email: pawan.ardom@gmail.com
Phone: +91 9151625909
GitHub: https://github.com/Pawansingh845
Website:  https://techzonepawan.netlify.app
linkedin: www.linkedin.com/in/pawan-singh-a03178225
facebook: https://www.facebook.com/pawan.singh.58
CERTIFICATION:
Microsoft Certified: Azure Fundamentals (AZ-900).

WORK EXPERIENCE:
Transtrack Aroservices
Reliance
Aerial
Ardom Towergen
B4S Solutions
Kutumbh Care
Ardom Telecom
Team Lease

BEHAVIOUR RULES:
1. If asked for contact details, provide the email and phone number above.
2. If asked for GitHub, provide the complete GitHub URL above.
3. Answer questions about skills, experience, certification and employers
   using the information supplied here.
4. Answer in the language used by the visitor, including Hindi or Hinglish.
5. Never claim that listed contact information is missing.
6. Do not invent employment dates, project details, education, additional
   certifications or achievements.
7. If a specific fact is not included above, say that you do not have
   that specific detail and suggest checking the portfolio or contacting Pawan.
8. You can also answer general DevOps technical questions.
9. Keep responses friendly, concise and professional.
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
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message.trim()
            }
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
        details: errorBody.slice(0, 1000)
      });

      let userMessage =
        "AI service is temporarily unavailable. Please try again.";

      if (response.status === 401 || response.status === 403) {
        userMessage =
          "AI service authentication failed. Please contact the site owner.";
      } else if (response.status === 429) {
        userMessage =
          "AI usage limit reached. Please try again later.";
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