import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
  title: "RideXtra Admin",
  description: "Best app ever 🚀",
  icons: {
    icon: "/Nas-Logo.svg", // <-- place your custom favicon in /public/myicon.png
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
