import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="text-xl font-bold">Page not found</div>
        <div className="opacity-70">The page you’re looking for doesn’t exist.</div>
        <div className="card-actions mt-2">
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

