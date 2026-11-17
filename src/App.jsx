import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import DemoPanel from "./components/DemoPanel.jsx";
import PlanBar from "./components/PlanBar.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1} className="wrap">
        <Routes>
          <Route path="/" element={<ClassesPage />} />
          <Route path="/classes/:id" element={<ClassDetailsPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <PlanBar />
      <footer className="wrap site-footer">
        <p>Margalla Move Studio is a fictional demo business in Islamabad. Bookings are simulated and no payment is taken.</p>
        <DemoPanel />
      </footer>
    </>
  );
}
