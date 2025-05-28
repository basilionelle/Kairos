'use client';

import { useRouter, usePathname } from 'next/navigation';
import WishNotification from './WishNotification';

export default function WishNotificationWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  const handleViewWish = (wishId: string) => {
    // If already on wishlist page, scroll to the wish
    if (pathname === '/wishlist') {
      const wishElement = document.getElementById(`wish-${wishId}`);
      if (wishElement) {
        wishElement.scrollIntoView({ behavior: 'smooth' });
        // Add a highlight effect
        wishElement.classList.add('highlight-wish');
        setTimeout(() => {
          wishElement.classList.remove('highlight-wish');
        }, 2000);
      }
    } else {
      // Otherwise navigate to the wishlist page
      router.push(`/wishlist?highlight=${wishId}`);
    }
  };

  return <WishNotification onViewWish={handleViewWish} />;
}
