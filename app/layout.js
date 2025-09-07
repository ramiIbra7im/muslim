import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/sidebar/Sidebar';
import { Cairo, Readex_Pro } from 'next/font/google';
import styles from './RootLayout.module.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

const ReadexPro = Readex_Pro({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ReadexPro.className}>
        <div className={styles.wrapper}>
          {/* Sidebar */}
          <Sidebar />

          {/* المحتوى الرئيسي */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>

        {/* Toast Container يظهر في كل الصفحات */}
        <ToastContainer position="top-left" />
      </body>
    </html>
  );
}
