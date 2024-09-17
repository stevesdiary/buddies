import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const userSecret = process.env.USER_JWT_SECRET || "";
const adminSecret = process.env.ADMIN_JWT_SECRET || "";
// const UserRole = process.env.USER_ROLE || 'user';
// const AdminRole = process.env.ADMIN_ROLE || 'admin';
type UserRole = 'basic' | 'premium';
type AdminRole = 'junior' | 'senior' | 'master'; //these will be in the env

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: UserRole[];
      };
      admin?: {
        admin_id: string;
        role: AdminRole[];
      };
    }
  }
}

interface UserJwtPayload extends JwtPayload {
  UserInfo: {
    user_id: string;
    role: UserRole[];
  };
}

interface AdminJwtPayload extends JwtPayload {
  AdminInfo: {
    admin_id: string;
    role: AdminRole[];
  };
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
				status: "error",
				message: "User token required",
				data: null,
				error: null,
        });
      return;
    }

    const decoded = jwt.verify(token, userSecret) as UserJwtPayload;
    if (decoded.UserInfo && Array.isArray(decoded.UserInfo.role)) {
      req.user = {
        user_id: decoded.UserInfo.user_id,
        role: decoded.UserInfo.role,
      };
      next();
    } else {
      res.status(401).json({
				status: "error",
				message: "gggg You are not authorized to access this resource!",
				data: null,
				error: null,
      });
    }
  } catch (error) {
    // return next(error);
			console.error('Authentication Error:', error);
			res.status(500).json({ status: 'error', message: 'Internal server error', data: null, error: error});
  }
};

const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log('Authorization called!', req.headers.authorization)
    if (!token) {
      res.status(401).json({
				status: "error",
				message: "Access token required",
				data: null,
				error: null,
			});
      return;
    }

    const decoded = jwt.verify(token, adminSecret) as AdminJwtPayload;
    if (decoded.AdminInfo && typeof decoded.AdminInfo?.role === 'string') {
      req.admin = {
        admin_id: decoded.AdminInfo.admin_id,
        role: decoded.AdminInfo.role,
      }
      next();
    } else {
      res.status(401).json({
				status: "error",
				message: "You are not authorized to access this resource!",
				data: decoded.AdminInfo.role,
				error: null,
      });
    }
  } catch (error) {
    // return next(error);
			console.error('Authentication Error:', error);
			res.status(500).json({ status: 'error', message: 'Internal server error', data: null, error: error });
  }
};

const authorizeUser = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || typeof req.user.role !== 'string') {
      res.status(403).json({
				statusCode: 403,
				message: "Access forbidden: User authorization required",
        });
      return;
    }

    const hasAllowedRole = allowedRoles.includes(req.user.role);
    if (hasAllowedRole) {
      next();
    } else {
      res.status(403).json({
				statusCode: 403,
				message: "You do not have the required access to this resource",
			});
    }
  };
};

const authorizeAdmin = (allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin || typeof req.admin.role !== 'string') {
			console.log('Authorization called!', req.admin?.role)
      res.status(403).json({
				statusCode: 403,
				message: "Access forbidden: Admin authorization required",
			});
      return;
    }

    const hasAllowedRole = allowedRoles.includes(req.admin.role);
    if (hasAllowedRole) {
      next();
    } else {
      res.status(403).json({
				statusCode: 403,
				message: "You are not authorized to access this resource",
      });
    }
  };
};

export { authenticateUser, authorizeUser, authorizeAdmin, authenticateAdmin };
