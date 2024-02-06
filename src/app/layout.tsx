import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './index';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farmácia Unitau',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <Layout>{children}</Layout>
    </html>
  )
}
