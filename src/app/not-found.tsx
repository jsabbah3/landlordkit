import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-6xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-ink/65">
        The page may have moved. Browse the free landlord tools instead.
      </p>
      <ButtonLink href="/tools" className="mt-6">
        Browse tools
      </ButtonLink>
    </Container>
  );
}
