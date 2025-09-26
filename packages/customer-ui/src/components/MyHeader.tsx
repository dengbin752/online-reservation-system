import { A, useMatch, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export function MyHeader() {
	const isLogRegView = useMatch(() => "/logreg");
	const isGuestView = useMatch(() => "/");
	const isEmployeeView = useMatch(() => "/employee");

	const navigate = useNavigate();
	const [me, setMe] = createSignal(null);

	const handleLogout = () => {
		localStorage.clear();
		setMe(null);
	    setTimeout(() => navigate("/logreg"), 0);
	};

	onMount(() => {
		const user = JSON.parse(localStorage.getItem("auth:user") || "null");
		if (user) {
			setMe(user);
		}
	});

	return (
		<header class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-800">Hilton Restaurants</h1>
			<nav class="flex space-x-4">
				{!me() && (
					<A
						href="/logreg"
						classList={{
							"px-4 py-2 text-sm font-medium rounded-full shadow-sm transition": true,
							"text-gray-700 bg-white hover:bg-gray-100": !isLogRegView(),
							"text-blue-700 bg-blue-100": !!isLogRegView(),
						}}
					>
						Login / Register
					</A>
				)}
				{me() && (
					<A
						href="#"
						onClick={handleLogout}
						classList={{
							"px-4 py-2 text-sm font-medium rounded-full shadow-sm transition": true,
							"text-gray-700 bg-white hover:bg-gray-100": !isLogRegView(),
							"text-blue-700 bg-blue-100": !!isLogRegView(),
						}}
					>
						Logout
					</A>
				)}
				<A
					href="/"
					end={true}
					classList={{
						"px-4 py-2 text-sm font-medium rounded-full shadow-sm transition": true,
						"text-gray-700 bg-white hover:bg-gray-100": !isGuestView(),
						"text-blue-700 bg-blue-100": !!isGuestView(),
					}}
				>
					Guest View
				</A>
				<A
					href="/employee"
					classList={{
						"px-4 py-2 text-sm font-medium rounded-full shadow-sm transition": true,
						"text-gray-700 bg-white hover:bg-gray-100": !isEmployeeView(),
						"text-blue-700 bg-blue-100": !!isEmployeeView(),
					}}
				>
					Employee View
				</A>
			</nav>
		</header>
	);
}
