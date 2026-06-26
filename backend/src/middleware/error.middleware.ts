import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { AppError } from "../types/errors";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    const responseBody = {
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.issues
      }
    };

    if (env.NODE_ENV === "development") {
      console.error("[booking-api] final response", {
        statusCode: 400,
        body: responseBody
      });
    }

    res.status(400).json(responseBody);
    return;
  }

  if (error instanceof AppError) {
    const responseBody = {
      status: "error",
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && env.NODE_ENV !== "production"
          ? { details: error.details }
          : {})
      }
    };

    if (env.NODE_ENV === "development" || error.statusCode >= 500) {
      console.error("[api-error]", {
        method: req.method,
        path: req.originalUrl,
        statusCode: error.statusCode,
        code: error.code,
        message: error.message,
        details: error.details
      });
    }

    res.status(error.statusCode).json(responseBody);
    return;
  }

  const responseBody = {
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      ...(env.NODE_ENV !== "production" && error instanceof Error
        ? { details: error.message }
        : {})
    }
  };

  console.error("[api-error]", {
    method: req.method,
    path: req.originalUrl,
    statusCode: 500,
    message: error instanceof Error ? error.message : "Unknown error"
  });

  res.status(500).json(responseBody);
};
