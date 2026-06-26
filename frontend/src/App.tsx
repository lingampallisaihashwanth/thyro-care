import { Outlet, Route, Routes } from "react-router-dom";
import { FloatingContactButtons } from "./components/FloatingContactButtons";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { About } from "./pages/About";
import { Certifications } from "./pages/Certifications";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { Tests } from "./pages/Tests";

const AppShell = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
    <FloatingContactButtons />
  </div>
);

const NotFound = () => (
  <main className="bg-white px-4 py-20 text-center sm:px-6 lg:px-8">
    <p className="text-sm font-bold uppercase text-thyro-green">404</p>
    <h1 className="mt-3 text-4xl font-black text-thyro-navy">Page not found</h1>
    <p className="mx-auto mt-4 max-w-md text-slate-600">
      The page you are looking for is not available.
    </p>
  </main>
);

export const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/certifications" element={<Certifications />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
