"use client";

/**
 * Bu sağlayıcı artık kullanılmamaktadır.
 * Uygulama doğrudan AppWrapper kullanmaktadır.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
