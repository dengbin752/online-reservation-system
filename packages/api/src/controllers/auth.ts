import type {
	AuthResponse,
	LoginInput,
	RegisterInput
} from "@shared/reservation-system";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/auth";

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	login = async (req: Request, res: Response): Promise<void> => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}

			const loginInput: LoginInput = req.body;
			const result: AuthResponse = await this.authService.login(
				loginInput.email,
				loginInput.password,
			);

			res.json(result);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Login failed" });
		}
	};

	register = async (req: Request, res: Response): Promise<void> => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}

			const registerInput: RegisterInput = req.body;
			const result: AuthResponse =
				await this.authService.register(registerInput);

			res.status(201).json(result);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Registration failed" });
		}
	};

	logout = async (req: Request, res: Response): Promise<void> => {
		try {
			const { token } = req.body;
			await this.authService.logout(token);

			res.json({ message: "Logout successful" });
		} catch (error) {
			res.status(500).json({ error: "Logout failed" });
		}
	};
}
