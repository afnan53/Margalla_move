import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";

export default function NotFoundPage({ what = "page" }) {
  usePageTitle("Not found");
  return (
    <section className="state">
      <h1>We can’t find that {what}</h1>
      <p>The link may be old or mistyped.</p>
      <Link className="btn btn-primary" to="/">Browse all classes</Link>
    </section>
  );
}
