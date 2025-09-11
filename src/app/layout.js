import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
  title: "RideXtra Admin",
  description: "Best app ever 🚀",
   icons: {
    icon: "/Nas-Logo.svg",        // your custom logo
    shortcut: "/Nas-Logo.png",    // fallback for browsers that don't support svg
    apple: "/Nas-Logo.png",       // iOS homescreen
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
