import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { ZodTypeAny } from "zod";
import { env } from "../config/env";

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

const parseIfPresent = (
  schema: ZodTypeAny | undefined,
  value: unknown
): unknown => (schema ? schema.parse(value) : value);

export const validate =
  (schemas: RequestSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (env.NODE_ENV === "development" && schemas.body) {
        console.info("[booking-api] request body received", req.body);
      }

      req.body = parseIfPresent(schemas.body, req.body);
      req.params = parseIfPresent(schemas.params, req.params) as Request["params"];
      req.query = parseIfPresent(schemas.query, req.query) as Request["query"];

      next();
    } catch (error) {
      if (env.NODE_ENV === "development" && error instanceof ZodError) {
        console.error("[booking-api] validation errors", error.issues);
      }

      next(error);
    }
  };
