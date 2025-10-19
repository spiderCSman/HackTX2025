import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Tarot from "./pages/Tarot";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public entry point */}
        <Route path="/" element={<Landing />} />

        {/* Authentication pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Main in-app routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/tarot" element={<Tarot />} />
      </Routes>
    </Router>
  );
}
