import { type Application, type Request, type Response } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import type { Socket } from "node:net";
import type { ClientRequest, IncomingMessage } from "node:http";
import { config } from "../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import type { ServiceConfig } from "../types/service";
import logger from "./logger";
export class ServiceProxy {
  private static readonly serviceConfigs: ServiceConfig[] = [
    {
      path: "/api/v1/auth",
      url: config.AUTH_SERVICE_URL,
      pathRewrite: { "^/": "/auth/" },
      name: "auth-service",
      timeout: 15000,
      requireAuth: false
    },
    {
      path: "/api/v1/events",
      url: config.EVENT_SERVICE_URL,
      pathRewrite: { "^/": "/events/" },
      name: "event-service",
      timeout: 15000,
      requireAuth: true
    },
  ];

  private static createProxyConfig(serviceConfig: ServiceConfig) {
    return {
      target: serviceConfig.url,
      changeOrigin: true,
      pathRewrite: serviceConfig.pathRewrite,
      proxyTimeout: serviceConfig.timeout ?? config.DEFAULT_TIMEOUT,
      timeout: serviceConfig.timeout ?? config.DEFAULT_TIMEOUT,
      on: {
        proxyReq: (proxyReq: ClientRequest, req: Request) => {
          fixRequestBody(proxyReq, req);
          const forwardedPath = proxyReq.path ?? "/";
          const forwardedUrl = new URL(forwardedPath, serviceConfig.url).toString();
          (req as Request & { forwardedUrl?: string }).forwardedUrl = forwardedUrl;
          logger.info("Proxy request", {
            service: serviceConfig.name,
            method: req.method,
            incomingPath: req.originalUrl,
            forwardedUrl
          });
        },
        proxyRes: (proxyRes: IncomingMessage, req: Request) => {
          const forwardedUrl = (req as Request & { forwardedUrl?: string }).forwardedUrl;
          logger.info("Proxy response", {
            service: serviceConfig.name,
            method: req.method,
            incomingPath: req.originalUrl,
            statusCode: proxyRes.statusCode,
            forwardedUrl: forwardedUrl ?? serviceConfig.url
          });
        },
        error: (err: Error, req: Request, res: Response | Socket, target?: unknown) =>
          this.handleProxyError(err, req, res, target)
      }
    };
  }

  private static handleProxyError(err: Error, _req: Request, res: Response | Socket, target?: unknown) {
    const targetStr = typeof target === "string" ? target : JSON.stringify(target);
    logger.error("Error proxying request", {
      error: err.message,
      stack: err.stack,
      target: targetStr
    });

    if ("status" in res && !res.headersSent) {
      res.status(502).json({
        message: `Failed to connect to ${targetStr ?? "target service"}`,
        status: 502,
        timestamp: new Date().toISOString()
      });
    }
  }

  public static setupProxies(app: Application): void {
    this.serviceConfigs.forEach((serviceConfig) => {
      const proxy = createProxyMiddleware(this.createProxyConfig(serviceConfig));

      if (serviceConfig.requireAuth) {
        app.use(serviceConfig.path, AuthMiddleware.requireAuth, proxy);
      } else {
        app.use(serviceConfig.path, proxy);
      }

      logger.info("Proxy configured", {
        service: serviceConfig.name,
        path: serviceConfig.path,
        target: serviceConfig.url,
        protected: Boolean(serviceConfig.requireAuth)
      });
    });
  }
}

export const proxyServices = (app: Application): void => {
  ServiceProxy.setupProxies(app);
};
