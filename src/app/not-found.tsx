import { ActionLink } from "@/components/action-link";

export default function NotFoundPage() {
  return (
    <section className="flex flex-1 items-center justify-center bg-ink px-5 py-28">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-bold uppercase text-red-400">404</p>
        <h1 className="mt-3 font-display text-5xl font-black text-cream md:text-7xl">
          Page not found.
        </h1>
        <p className="mt-5 leading-8 text-cream/82">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <ActionLink href="/">Back to Home</ActionLink>
        </div>
      </div>
    </section>
  );
}
