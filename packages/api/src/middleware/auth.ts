import type { AuthenticatedRequest, User } from "@shared/reservation-system";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void => {
	// TODO: Implement JWT authentication
	const token = req.headers.authorization?.replace("Bearer ", "") ?? '';

	if (!token) {
		res.status(401).json({ error: "Authentication token required" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as User
		req.user = decoded;
		next();
	} catch (error) {
		res.status(403).json({ error });
		return;
	}
};

export const authorize = (roles: string[]) => {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({ error: "User not authenticated" });
			return;
		}

		if (!roles.includes(req.user.role)) {
			res.status(403).json({ error: "Insufficient permissions" });
			return;
		}

		next();
	};
};
