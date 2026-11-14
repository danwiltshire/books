import "./globals.css";

export const metadata = {
  title: "Books | The IT reading list",
  description: "A considered collection of books for people who build technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
