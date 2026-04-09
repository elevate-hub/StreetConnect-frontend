import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import { Home, ShoppingBag, User, LayoutDashboard, ChefHat, Truck, Settings } from 'lucide-react';

const BottomNav = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { cartCount } = useCart();

  if (!user) return null;

  const navClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 text-xs transition-colors ${isActive ? 'text-primary' : 'text-text-secondary'}`;

  const customerNav = [
    { to: '/customer', icon: Home, label: t('nav.home') },
    { to: '/customer/orders', icon: ShoppingBag, label: t('nav.orders') },
    { to: '/customer/cart', icon: ChefHat, label: t('customer.cart'), badge: cartCount },
    { to: '/customer/profile', icon: User, label: t('nav.profile') }
  ];

  const vendorNav = [
    { to: '/vendor/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/vendor/menu', icon: ChefHat, label: t('nav.menu') },
    { to: '/vendor/orders', icon: ShoppingBag, label: t('nav.orders') },
    { to: '/vendor/settings', icon: Settings, label: t('nav.settings') }
  ];

  const deliveryNav = [
    { to: '/delivery', icon: Truck, label: t('delivery.available_jobs') },
    { to: '/delivery/active', icon: ShoppingBag, label: t('delivery.active_delivery') },
    { to: '/delivery/earnings', icon: LayoutDashboard, label: t('nav.earnings') },
    { to: '/delivery/profile', icon: User, label: t('nav.profile') }
  ];

  const navItems = user.role === 'customer' ? customerNav : user.role === 'vendor' ? vendorNav : user.role === 'delivery' ? deliveryNav : [];

  if (navItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end className={navClass}>
            <div className="relative">
              <item.icon size={20} />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
