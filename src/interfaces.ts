import type {
  Application, NextFunction, Request, Response, Router,
} from 'express';

interface Error {
  status: number,
  message: string
}
interface Config {
  LOG_FORMAT: string
  ORIGIN: string
  CREDENTIALS: boolean
}
interface Routes {
  path?: string;
  router: Router;
}
interface Middleware {
  MiddlewareError: (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  initializeMiddlewares: (app: Application, config: Config) => void
  initializeErrorHandling: () => void
  initializeRoutes: (routes: Routes[]) => void
}

export default Middleware;
