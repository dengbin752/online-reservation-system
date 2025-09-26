import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error("Error:", error);

	// Handle specific error types
	if (error.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			error: error.message,
		});
	}

	if (error.name === "UnauthorizedError") {
		return res.status(401).json({
			success: false,
			error: "Unauthorized",
		});
	}

	if (error.name === "ForbiddenError") {
		return res.status(403).json({
			success: false,
			error: "Forbidden",
		});
	}

	if (error.name === "NotFoundError") {
		return res.status(404).json({
			success: false,
			error: "Resource not found",
		});
	}

	// Default error
	res.status(500).json({
		success: false,
		error: "Internal server error",
	});
};
