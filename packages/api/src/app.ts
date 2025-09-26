import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "@shared/reservation-system";
import cors from "cors";
import dotenv from "dotenv";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { authenticate } from "./middleware";
import { resolvers } from "./resolvers";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
if (process.env.NODE_ENV === "development") {
	app.use(
		helmet({
			contentSecurityPolicy: false,
		}),
	);
} else {
	app.use(helmet());
}
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "development"
				? "*"
				: process.env.FRONTEND_URL || "http://localhost:3001",
		credentials: true,
	}),
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
	res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// GraphQL setup
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Start the server
const startServer = async () => {
	await server.start();

	// Apply the GraphQL middleware
	app.use(
		"/api/graphql",
		authenticate,
		expressMiddleware(server, {
			context: async ({ req }: { req: Request }) => {
				// Add your context here
				return { req };
			},
		}),
	);

	const routes = await import("./routes");
	app.use("/api/auth", routes.authRouter);

	// Error handling middleware
	app.use(
		(err: Error, req: Request, res: Response, next: express.NextFunction) => {
			console.error(err.stack);
			res.status(500).json({ error: "Something went wrong!" });
		},
	);

	// 404 handler
	app.use("/*splat", (req: Request, res: Response) => {
		res.status(404).json({ error: "Route not found" });
	});

	app.listen(PORT, () => {
		console.log(`🚀 Server ready at http://localhost:${PORT}`);
		console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/api/graphql`);
	});
};

startServer().catch((error) => {
	console.error("Failed to start server:", error);
	process.exit(1);
});

export default app;
