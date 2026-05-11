import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const isProduction = process.env.NODE_ENV === "production";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const redis = isProduction
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

export async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const key = `ratelimit:${ip}`;
  const now = Date.now();

  if (isProduction && redis) {
    try {
      const [count, resetTime] = await redis.mget<[string, string]>(key, `${key}:reset`);
      
      if (!resetTime || now > parseInt(resetTime)) {
        const pipeline = redis.pipeline();
        pipeline.set(key, "1", { ex: 60 });
        pipeline.set(`${key}:reset`, (now + WINDOW_MS).toString(), { ex: 60 });
        await pipeline.exec();
        return null;
      }

      if (parseInt(count) >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
          { status: 429 }
        );
      }

      await redis.incr(key);
      return null;
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
    }
  }

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return null;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 }
    );
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  return null;
}
