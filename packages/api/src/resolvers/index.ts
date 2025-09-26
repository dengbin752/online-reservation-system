import {
	createCouchbaseConnection,
	ReservationRepository,
	TableRepository,
} from "@database/reservation-system";
import {
	type createReservationSchema,
	type createTableSchema,
	type PaginatedResponse,
	type PaginationParams,
	type Reservation,
	type ReservationFilters,
	ReservationStatus,
	type Table,
	TableStatus,
	type User,
} from "@shared/reservation-system";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";

type CreateTableInput = z.infer<typeof createTableSchema>;
type CreateReservationInput = z.infer<typeof createReservationSchema>;
type ReservationWithCustomer = Reservation & {
	customer: Pick<User, "email" | "firstName" | "lastName" | "phone">;
};

const resolvers = {
	Query: {
		me: () => {
			// TODO: Implement user authentication
			return null;
		},
		users: () => {
			// TODO: Implement user service
			return [];
		},
		tables: () => {
			// TODO: Implement table service
			return [];
		},
		table: () => {
			// TODO: Implement table service
			return null;
		},
		reservations: async (
			_: any,
			{
				filters,
				pagination,
			}: { filters?: ReservationFilters; pagination?: PaginationParams },
		): Promise<PaginatedResponse<ReservationWithCustomer>> => {
			try {
				const connection = createCouchbaseConnection();
				await connection.connect()
				const reservationRepos = new ReservationRepository(connection);
				const results = await reservationRepos.findAll(filters, pagination);
				await connection.disconnect()
				return results;
			} catch (error) {
				console.error("Error fetching reservations:", error);
				throw new Error("Failed to fetch reservations");
			}
		},
		reservation: () => {
			// TODO: Implement reservation service
			return null;
		},
		customerReservations: async (
			_: any,
			{ customerId }: { customerId: string },
		) => {
			try {
				const connection = createCouchbaseConnection();
				await connection.connect();
				const reservationRepos = new ReservationRepository(connection);
				const reservations =
					await reservationRepos.findByCustomerId(customerId);
					await connection.disconnect()
				return reservations;
			} catch (error) {
				console.error("Database error:", error);
				throw error;
			}
		},
		availableTables: () => {
			// TODO: Implement table availability service
			return { tables: [], date: new Date(), time: "19:00", partySize: 2 };
		},
	},
	Mutation: {
		// in REST API
		// login: () => {
		// 	// TODO: Implement authentication service
		// 	return { user: null, token: "", refreshToken: "" };
		// },
		// register: () => {
		// 	// TODO: Implement authentication service
		// 	return { user: null, token: "", refreshToken: "" };
		// },
		// refreshToken: () => {
		// 	// TODO: Implement authentication service
		// 	return { user: null, token: "", refreshToken: "" };
		// },
		// logout: () => {
		// 	// TODO: Implement authentication service
		// 	return true;
		// },
		// createTable: () => {
		createTable: async (_: any, { input }: { input: CreateTableInput }) => {
			try {
				if (!input.number || !input.capacity || !input.location) {
					throw new Error(
						"Missing required fields: number, capacity, and location are required",
					);
				}

				const newTable: Table = {
					id: uuidv4(),
					number: input.number,
					capacity: input.capacity,
					location: input.location,
					status: TableStatus.AVAILABLE,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const connection = createCouchbaseConnection();
				await connection.connect();
				const tableRepos = new TableRepository(connection);
				const table = tableRepos.create(newTable);
				return table;
			} catch (error) {
				console.error("Error creating table:", error);
				throw new Error(`Failed to create table: ${(error as Error).message}`);
			}
		},
		updateTable: () => {
			// TODO: Implement table service
			return null;
		},
		deleteTable: () => {
			// TODO: Implement table service
			return true;
		},
		updateTableStatus: () => {
			// TODO: Implement table service
			return null;
		},
		createReservation: async (
			_: any,
			{ input }: { input: CreateReservationInput },
		) => {
			try {
				if (
					!input.customerId ||
					!input.tableId ||
					!input.date ||
					!input.time ||
					!input.partySize
				) {
					throw new Error(
						"Missing required fields: customId, tableId, date, time, partySize are required",
					);
				}

				const newReservation: Reservation = {
					id: uuidv4(),
					title: input.title,
					customerId: input.customerId,
					tableId: input.tableId,
					date: new Date(input.date),
					time: input.time,
					partySize: input.partySize,
					status: ReservationStatus.PENDING,
					specialRequests: input.specialRequests,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const connection = createCouchbaseConnection();
				await connection.connect();
				const reservationRepos = new ReservationRepository(connection);
				const table = reservationRepos.create(newReservation);
				return table;
			} catch (error) {
				console.error("Error creating table:", error);
				throw new Error(`Failed to create table: ${(error as Error).message}`);
			}
		},
		updateReservation: () => {
			// TODO: Implement reservation service
			return null;
		},
		cancelReservation: async (_: any, { id }: { id: string }) => {
			try {
				const connection = createCouchbaseConnection();
				await connection.connect();
				const reservationRepos = new ReservationRepository(connection);
				const reservation = await reservationRepos.findByDocId(id);
				await reservationRepos.deleteByDocId(id);
				return reservation;
			} catch (error) {
				console.error("Error deleting reservation:", error);
				throw new Error(
					`Failed to delete reservation: ${(error as Error).message}`,
				);
			}
		},
		updateReservationStatus: async (_: any, {id, status}: {id: string, status: ReservationStatus}): Promise<{id: string, status: ReservationStatus}> => {
			try {
				const connection = createCouchbaseConnection();
				await connection.connect();
				const reservationRepos = new ReservationRepository(connection);
				const updatedReservation = await reservationRepos.updateStatusById(id, status);
				await connection.disconnect();
				return updatedReservation;
			} catch (error) {
				console.error("Error updating reservation status:", error);
				throw new Error("Failed to update reservation status");
			}
		},
	},
	Date: {
		serialize: (value: Date) => value.toISOString(),
		parseValue: (value: string) => new Date(value),
		parseLiteral: (value: any) => new Date(value.value),
	},
};

export { resolvers };
