import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import type winston from 'winston';
import type { Application } from 'express';
import type Middleware from './interfaces';

class Middlewares {
  #app: Application;

  #logger: winston.Logger;

  #stream: morgan.StreamOptions;

  constructor(app: Application, logger: winston.Logger, stream: morgan.StreamOptions) {
    this.#app = app;
    this.#logger = logger;
    this.#stream = stream;
  }

  public MiddlewareError: Middleware['MiddlewareError'] = (error, req, res, next) => {
    try {
      const status = error.status || 500;
      const message = error.message || JSON.stringify({ message: 'Something went wrong' });

      this.#logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

      res.status(status).json(JSON.parse(message));
    } catch (err) {
      next(err);
    }
  };

  public initializeErrorHandling: Middleware['initializeErrorHandling'] = () => {
    this.#app.use(this.MiddlewareError);
  };

  public initializeMiddlewares: Middleware['initializeMiddlewares'] = (config) => {
    const {
      LOG_FORMAT, ORIGIN, CREDENTIALS,
    } = config;
    const stream = this.#stream;
    this.#app.use(morgan(LOG_FORMAT, { stream }));
    this.#app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.#app.use(hpp());
    this.#app.use(helmet());
    this.#app.use(compression());
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cookieParser());
  };

  public initializeRoutes: Middleware['initializeRoutes'] = (routes) => {
    routes.forEach((route) => {
      this.#app.use('/', route.router);
    });
  };
}
export default Middlewares;
