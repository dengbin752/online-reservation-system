import { createSignal } from "solid-js";
import "./App.css";
import solidLogo from "./assets/solid.svg";
import { MyHeader } from "./components/MyHeader";
import viteLogo from "/vite.svg";

function App() {
	const [count, setCount] = createSignal(0);

	return (
		<div>
			<MyHeader />
			<a href="https://vite.dev" target="_blank" rel="noopener">
				<img src={viteLogo} class="logo" alt="Vite logo" />
			</a>
			<a href="https://solidjs.com" target="_blank" rel="noopener">
				<img src={solidLogo} class="logo solid" alt="Solid logo" />
			</a>
		</div>
	);
}

export default App;
