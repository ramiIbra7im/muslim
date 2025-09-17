import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/sidebar/Sidebar';
import { Readex_Pro, Amiri } from 'next/font/google';
import styles from './RootLayout.module.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// الخطوط
const ReadexPro = Readex_Pro({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
});
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'], // حسب احتياجك
  display: 'swap',
});

// ✅ هنا الميتا داتا
export const metadata = {
  title: "نسك المسلم - مواقيت الصلاة والأذكار",
  description:
    "موقع نسك المسلم لعرض مواقيت الصلاة، الأذان، الأذكار والأدعية مع تجربة روحانية مميزة.",
  keywords: ["نسك", "مسلم", "أذان", "مواقيت الصلاة", "أذكار", "قرآن"],
  authors: [{ name: "نسك المسلم" }],
  robots: "index, follow",
  openGraph: {
    title: "نسك المسلم - مواقيت الصلاة والأذكار",
    description:
      "موقع نسك المسلم لعرض مواقيت الصلاة، الأذان، الأذكار والأدعية مع تجربة روحانية مميزة.",
    url: "https://muslim-rb.vercel.app",
    siteName: "نسك المسلم",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "نسك المسلم",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نسك المسلم - مواقيت الصلاة والأذكار",
    description:
      "موقع نسك المسلم لعرض مواقيت الصلاة، الأذان، الأذكار والأدعية مع تجربة روحانية مميزة.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
};

// ✅ الـ Layout
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ReadexPro.className}>
        <div className={styles.wrapper}>
          {/* Sidebar */}
          <Sidebar />

          {/* المحتوى الرئيسي */}
          <main className={styles.mainContent}>{children}</main>
        </div>

        {/* Toast Container يظهر في كل الصفحات */}
        <ToastContainer position="top-left" />
      </body>
    </html>
  );
}
