import { ThemeProvider } from "./components/common/theme-provider";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home(401)";
import "./index.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
