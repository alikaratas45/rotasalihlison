
'use client';

import { redirect } from 'next/navigation';

export default function BrosurlerPage() {
  // Sayfa komple kaldırıldığı için ana sayfaya yönlendiriyoruz
  redirect('/');
}
