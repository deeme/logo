//import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
//import { Ratelimit } from "@upstash/ratelimit";
//import { Redis } from "@upstash/redis";
import dedent from "dedent";
import OpenAI from "openai";
import { z } from "zod";

//let ratelimit: Ratelimit | undefined;

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("", { status: 404 });
  }

  const json = await req.json();
  const data = z
    .object({
      companyName: z.string(),
      // selectedLayout: z.string(),
      selectedStyle: z.string(),
      selectedPrimaryColor: z.string(),
      selectedBackgroundColor: z.string(),
      additionalInfo: z.string().optional(),
      selectedModel: z.string(),
    })
    .parse(json);

  // OpenAI 配置
  const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
  };

  // 初始化 OpenAI 客户端
  const openai = new OpenAI(configuration);

/*
  // Add rate limiting if Upstash API keys are set & no BYOK, otherwise skip
  if (process.env.UPSTASH_REDIS_REST_URL) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      // Allow 3 requests per 2 months on prod
      limiter: Ratelimit.fixedWindow(3, "60 d"),
      analytics: true,
      prefix: "logocreator",
    });
  }

  if (ratelimit) {
    const identifier = user.id;
    const { success, remaining } = await ratelimit.limit(identifier);
    (await clerkClient()).users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        remaining,
      },
    });

    if (!success) {
      return new Response(
        "免费试用额度已用完，请联系作者充值 credits.",
        {
          status: 429,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }
  }
*/

  const flashyStyle =
    "Flashy, attention grabbing, bold, futuristic, and eye-catching. Use vibrant neon colors with metallic, shiny, and glossy accents.";

  const techStyle =
    "highly detailed, sharp focus, cinematic, photorealistic, Minimalist, clean, sleek, neutral color pallete with subtle accents, clean lines, shadows, and flat.";

  const modernStyle =
    "modern, forward-thinking, flat design, geometric shapes, clean lines, natural colors with subtle accents, use strategic negative space to create visual interest.";

  const playfulStyle =
    "playful, lighthearted, bright bold colors, rounded shapes, lively.";

  const abstractStyle =
    "abstract, artistic, creative, unique shapes, patterns, and textures to create a visually interesting and wild logo.";

  const minimalStyle =
    "minimal, simple, timeless, versatile, single color logo, use negative space, flat design with minimal details, Light, soft, and subtle.";

  const styleLookup: Record<string, string> = {
    Flashy: flashyStyle,
    Tech: techStyle,
    Modern: modernStyle,
    Playful: playfulStyle,
    Abstract: abstractStyle,
    Minimal: minimalStyle,
  };

  const prompt = dedent`A single logo, high-quality, award-winning professional design, made for both digital and print media, only contains a few vector shapes, ${styleLookup[data.selectedStyle]}

  Primary color is ${data.selectedPrimaryColor.toLowerCase()} and background color is ${data.selectedBackgroundColor.toLowerCase()}. The company name is ${data.companyName}, make sure to include the company name in the logo. ${data.additionalInfo ? `Additional info: ${data.additionalInfo}` : ""}`;

  try {
    // 调用 OpenAI API 生成图像
    const response = await openai.chat.completions.create({
      model: data.selectedModel,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ],
    });

    // 从返回的消息中提取图片URL
    const message = response.choices[0].message;
    let imageUrl;
    // 更精确地提取 URL
    if (message.content) {
      const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif))/gi;
      const urls = message.content.match(urlRegex);
      imageUrl = urls ? urls[0].replace(')"', '') : null;
    }

    console.log("提取的图片URL:", imageUrl);
    return Response.json({ imageUrl }, { status: 200 });
  } catch (error) {
    throw error;
  }
}

export const runtime = "edge";
