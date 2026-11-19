import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import DataGate from "../components/DataGate.jsx";
import SummaryBox from "../components/SummaryBox.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { EXPERIENCE_LEVELS, checkEligibility } from "../rules/eligibilityRule.js";
import { validateForm } from "../rules/validateForm.js";

function Field({ id, label, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="error-text" id={`${id}-error`}>Error: {error}</p>}
    </div>
  );
}

function Checkout() {
  const { plan, classesById, conflicts, summary, formValues, setFormValues, placeBooking } = useBooking();
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef(null);

  const errors = validateForm(formValues);
  const show = (name) => (touched[name] || submitted ? errors[name] : undefined);

  // Eligibility rule is checked against the experience level chosen in the form.
  const eligibility = formValues.experience
    ? plan.flatMap((i) => {
        const cls = classesById.get(i.classId);
        const r = cls ? checkEligibility(cls.level, formValues.experience) : { ok: true };
        return r.ok ? [] : [{ classId: cls.id, title: cls.title, message: r.message }];
      })
    : [];
  const blockers = [...conflicts, ...eligibility];

  // Updating one field copies the object, so other valid input is kept.
  const change = (name) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const blur = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }));

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || blockers.length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    placeBooking();
    navigate("/confirmation");
  }

  if (plan.length === 0) {
    return (
      <section className="state">
        <h1>Nothing to book yet</h1>
        <Link className="btn btn-primary" to="/">Browse classes</Link>
      </section>
    );
  }

  const problems = submitted ? Object.values(errors).length + blockers.length : 0;
  const attrs = (name) => ({
    "aria-invalid": Boolean(show(name)),
    "aria-describedby": show(name) ? `${name}-error` : undefined,
    onBlur: blur(name),
  });

  return (
    <>
      <h1>Your details</h1>
      <p className="lead">This is a demo: use made-up details. Nothing is sent or stored.</p>
      <div className="two-col">
        <form onSubmit={handleSubmit} noValidate>
          {problems > 0 && (
            <div className="notice notice-error" role="alert" tabIndex={-1} ref={summaryRef}>
              <strong>Please fix {problems} problem{problems === 1 ? "" : "s"} before booking:</strong>
              <ul>
                {Object.values(errors).map((m) => <li key={m}>{m}</li>)}
                {blockers.map((b, i) => <li key={`${b.classId}-${i}`}>{b.title}: {b.message}</li>)}
              </ul>
            </div>
          )}
          <Field id="fullName" label="Full name" error={show("fullName")}>
            <input id="fullName" autoComplete="name" value={formValues.fullName} onChange={change("fullName")} {...attrs("fullName")} />
          </Field>
          <Field id="email" label="Email" error={show("email")}>
            <input id="email" type="email" autoComplete="email" value={formValues.email} onChange={change("email")} {...attrs("email")} />
          </Field>
          <Field id="phone" label="Mobile number" hint="Example: 0300-1234567" error={show("phone")}>
            <input id="phone" type="tel" autoComplete="tel" value={formValues.phone} onChange={change("phone")} {...attrs("phone")} />
          </Field>
          <Field id="experience" label="Your experience level" hint="Advanced classes need Intermediate or Advanced." error={show("experience")}>
            <select id="experience" value={formValues.experience} onChange={change("experience")} {...attrs("experience")}>
              <option value="">Choose…</option>
              {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field id="notes" label="Notes for the coach (optional)" hint={`${formValues.notes.length}/200 characters`} error={show("notes")}>
            <textarea id="notes" rows="3" value={formValues.notes} onChange={change("notes")} {...attrs("notes")} />
          </Field>
          <div className="field">
            <label className="inline">
              <input id="agree" type="checkbox" checked={formValues.agree} onChange={change("agree")} {...attrs("agree")} />
              I accept the studio policy (demo).
            </label>
            {show("agree") && <p className="error-text" id="agree-error">Error: {errors.agree}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-wide">Confirm booking (simulated)</button>
          <Link className="btn btn-secondary btn-wide" to="/plan">Back to plan</Link>
        </form>
        <SummaryBox summary={summary} />
      </div>
    </>
  );
}

export default function CheckoutPage() {
  usePageTitle("Your details");
  return <DataGate><Checkout /></DataGate>;
}
