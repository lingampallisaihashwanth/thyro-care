import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { env } from "../config/env";
import { AppError } from "../types/errors";
import type { AuthenticatedUser } from "../types/api";

const getBearerToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader) {
    throw new AppError(401, "Authorization header is required", "UNAUTHORIZED");
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
      401,
      "Authorization header must use Bearer token format",
      "UNAUTHORIZED"
    );
  }

  return token;
};

const toAuthenticatedUser = (payload: string | JwtPayload): AuthenticatedUser => {
  if (typeof payload === "string" || !payload.sub) {
    throw new AppError(401, "Invalid token payload", "UNAUTHORIZED");
  }

  return {
    id: String(payload.sub),
    email: typeof payload.email === "string" ? payload.email : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined
  };
};

export const authenticateJwt = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = getBearerToken(req.headers.authorization);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.accessToken = token;
    req.user = toAuthenticatedUser(decoded);
    req.supabase = supabase;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Invalid or expired token", "UNAUTHORIZED"));
  }
};

export const authenticateUnlessDevelopment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (env.NODE_ENV === "development") {
    req.supabase = supabase;
    next();
    return;
  }

  authenticateJwt(req, res, next);
};
