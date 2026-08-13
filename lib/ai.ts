import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { Job } from "@/lib/store";

export async function extractResumeText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const name = file.name.toLowerCase();

    if (name.endsWith(".pdf")) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text || "";
    }

    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    return buffer.toString("utf-8");
  } catch {
    return buffer.toString("utf-8");
  }
}

export async function generateAIAnalysis(resumeText: string, job: Job) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You evaluate a candidate resume against a job description. Return valid JSON with score, strengths, missingSkills, suggestions.",
            },
            {
              role: "user",
              content: `Job: ${job.title} | Description: ${job.description} | Requirements: ${job.requirements.join(", ")}. Resume text: ${resumeText}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed?.score && parsed?.strengths) {
            return parsed;
          }
        }
      }
    } catch {
      // fall through to heuristic analysis
    }
  }

  const requirementSet = (job.requirements || []).map((item) => item.toLowerCase());
  const normalizedResume = resumeText.toLowerCase();
  const matched = requirementSet.filter((req) => normalizedResume.includes(req.toLowerCase()));
  const missing = requirementSet.filter((req) => !normalizedResume.includes(req.toLowerCase()));

  const scoreBase = matched.length / Math.max(requirementSet.length, 1);
  const bias = resumeText.length > 500 ? 18 : 10;
  let score = Math.min(98, Math.max(42, Math.round(scoreBase * 100 + bias)));

  if (missing.length === 0) {
    score = 96;
  }

  return {
    score,
    strengths: matched.slice(0, 4),
    missingSkills: missing.slice(0, 3),
    suggestions: [
      matched.length > 0 ? `Strong alignment on ${matched[0]}.` : "Add stronger role-specific keywords to the resume.",
      "Quantify project impact with business metrics and outcomes.",
      "Highlight relevant tools and collaboration experience for faster interview review.",
    ],
  };
}
