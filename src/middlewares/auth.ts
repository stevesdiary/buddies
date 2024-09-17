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

const authenticateUserOrAdmin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  // First, try to authenticate the user
  try {
    const userToken = req.headers.authorization?.split(" ")[1];
    if (userToken) {
      const decodedUser = jwt.verify(userToken, userSecret) as UserJwtPayload;
      if (decodedUser.UserInfo) {
        req.user = {
          user_id: decodedUser.UserInfo.user_id,
          role: decodedUser.UserInfo.role,
        };
        console.log('Authenticated User:', req.user);
        return next();
      }
    }
  } catch (err) {
    console.log('User authentication failed:', err);
  }

  // If user authentication fails, try to authenticate the admin
  try {
    const adminToken = req.headers.authorization?.split(" ")[1];
    if (adminToken) {
      const decodedAdmin = jwt.verify(adminToken, adminSecret) as AdminJwtPayload;
      if (decodedAdmin.AdminInfo) {
        req.admin = {
          admin_id: decodedAdmin.AdminInfo.admin_id,
          role: decodedAdmin.AdminInfo.role,
        };
        return next();
      }
    }
  } catch (err) {
    console.log('Admin authentication failed:', err);
  }

  res.status(401).json({
    status: "error",
    message: "Authentication required",
  });
};

const authorizeUserOrAdmin = (allowedUserRoles: UserRole[], allowedAdminRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && typeof req.user.role === 'string') {
      console.log('User authorized:', req.user.role);
      return next();
    }

    if (req.admin && typeof req.admin.role === 'string') {
      console.log('Admin authorized:', req.admin.role);
      return next();
    }
    res.status(403).json({
      statusCode: 403,
      message: "Access forbidden: You cannot access this resource",
    });
  };
};
export { authenticateUserOrAdmin, authorizeUserOrAdmin };
