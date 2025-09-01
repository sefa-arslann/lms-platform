'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Kullanıcılar', href: '/admin/users', icon: UsersIcon },
  { name: 'Kurslar', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Siparişler', href: '/admin/orders', icon: CurrencyDollarIcon },
  { name: 'Cihazlar', href: '/admin/devices', icon: DevicePhoneMobileIcon },
  { name: 'Mesajlar', href: '/admin/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Raporlar', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'CMS', href: '/admin/cms', icon: DocumentTextIcon },
  { name: 'Ayarlar', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
