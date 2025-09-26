import {
	createCouchbaseConnection,
	type UserModel,
	UserRepository,
} from "@database/reservation-system";
import {
	type AuthResponse,
	comparePassword,
	generateJWTToken,
	hashPassword,
	type IAuthService,
	type RegisterInput,
	type User
} from "@shared/reservation-system";
import { v4 as uuidv4 } from "uuid";

export class AuthService implements IAuthService {
	async login(email: string, password: string): Promise<AuthResponse> {
		// TODO: security log: Login attempt
		console.log("Login attempt for:", email);

		const connection = createCouchbaseConnection()
		await connection.connect()
		const userRepos = new UserRepository(connection);
		const user = await userRepos.findByEmail(email)
		if (!user) {
			throw new Error("User not found");
		}
		if (!comparePassword(password, user.password || '')) {
			throw new Error("Invalid password");
		}

		const token = generateJWTToken({id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET || "secret", process.env.JWT_EXPIRES_IN || "1h");
		const refreshToken = generateJWTToken({id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET || "secret", process.env.JWT_REFRESH_EXPIRES_IN || "7d");
		// TODO: save refresh token to database
		const userUpdated = await userRepos.updateByDocId(user.id, {refreshToken})
		if (!userUpdated) {
			throw new Error("User not found");
		}
		const {password: _, ...outWithoutPassword} = userUpdated
		return { user: outWithoutPassword, token, refreshToken };
	}

	async register(userData: RegisterInput): Promise<AuthResponse> {
		// TODO: security check for registering
		console.log("Registration attempt for:", userData.email);

		const connection = createCouchbaseConnection()
		await connection.connect()
		const userRepos = new UserRepository(connection);

		// TODO: check if user already exists
		const existingUser = await userRepos.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("User already exists");
		}

		const id = uuidv4();
		const token = generateJWTToken({id, email: userData.email, role: userData.role}, process.env.JWT_SECRET || "secret", process.env.JWT_EXPIRES_IN || "1h");
		const refreshToken = generateJWTToken({id, email: userData.email, role: userData.role}, process.env.JWT_SECRET || "secret", process.env.JWT_REFRESH_EXPIRES_IN || "7d");

		const user: UserModel = {
			...userData,
			id,
			password: await hashPassword(userData.password),
			role: userData.role,
			refreshToken,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const out = await userRepos.create(user);
		// omit password
		const {password, ...outWithoutPassword} = out
		// TODO: remember token 
		// save the token to cache server, so that user can logout
		return { user: outWithoutPassword, token, refreshToken };
	}

	async refreshToken(email: string, refreshToken: string): Promise<AuthResponse> {
		// TODO: security check for refresh token logic
		console.log("Refresh token attempt");

		const connection = createCouchbaseConnection()
		await connection.connect()
		const userRepos = new UserRepository(connection)
		const user = await userRepos.findByEmail(email)
		if (!user || user.refreshToken !== refreshToken) {
			throw new Error("Invalid refresh token");
		}

		const token = generateJWTToken({id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET || "secret", process.env.JWT_EXPIRES_IN || "1h");
		const newRefreshToken = generateJWTToken({id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET || "secret", process.env.JWT_REFRESH_EXPIRES_IN || "7d");
		const userUpdated = await userRepos.updateByDocId(user.id, {refreshToken})
		if (!userUpdated) {
			throw new Error("User not found");
		}
		const {password: _, ...outWithoutPassword} = userUpdated
		return { user: outWithoutPassword, token, refreshToken: newRefreshToken };
	}

	async logout(token: string): Promise<void> {
		// TODO: Implement logout logic
		console.log("Logout attempt for token:", token);
		// TODO: clearn token cache
	}

	async getUserById(id: string): Promise<User | null> {
		const connection = createCouchbaseConnection()
		await connection.connect()
		const userRepos = new UserRepository(connection)
		const user = await userRepos.findById(id)
		return user
	}

	async getUserByEmail(email: string): Promise<User | null> {
		// get user by email
		const userRepos = new UserRepository(createCouchbaseConnection());
		const user = await userRepos.findByEmail(email);
		return user
	}
}
