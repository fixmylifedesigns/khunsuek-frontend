import { AuthProvider } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import "./globals.css";

export const metadata = {
  title: "Khunsuek Muay Thai Gym",
  description: "Experience authentic Muay Thai training in Thailand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
