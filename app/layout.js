import { cookies } from "next/headers";
import { getTheme } from "../lib/themes.js";
import "./globals.css";

export const metadata = {
  title: "Books | The IT reading list",
  description: "A considered collection of books for people who build technology.",
};

export default async function RootLayout({ children }) {
  const theme = getTheme((await cookies()).get("books-theme")?.value);

  return (
    <html lang="en" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
