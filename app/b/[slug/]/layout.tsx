import { SelectionProvider } from "@/lib/selection-context";
import RequestProviderWrapper from "@/components/RequestProviderWrapper";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SelectionProvider>
      <RequestProviderWrapper>{children}</RequestProviderWrapper>
    </SelectionProvider>
  );
}