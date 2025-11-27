import { motion } from 'framer-motion'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import CurrencySelector from '../common/CurrencySelector.jsx'
import Container from '../common/Container.jsx'

export default function Footer() {
  const { isAuthenticated } = useAuth()
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  const footerLinks = {
    shop: [
      { name: 'Wallets', href: '#' },
      { name: 'Bags', href: '#' },
      { name: 'Belts', href: '#' },
      { name: 'Footwear', href: '#' },
      { name: 'Accessories', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Customization', href: '#customize' },
      { name: 'Sustainability', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    support: [
      { name: 'FAQs', href: '#' },
      { name: 'Shipping & Returns', href: '#' },
      { name: 'Care Guide', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms & Conditions', href: '#' },
    ],
  }

  return (
    <footer 
      id="about" 
      className="w-full mt-auto"
      style={{ backgroundColor: themeColors.primary, color: themeColors.surface }}
    >
      <Container>
        {/* Main Footer Content */}
        <div
          className={`grid gap-8 py-12 ${
            isAuthenticated ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div 
              className="font-bold text-xl mb-4"
              style={{ color: themeColors.surface }}
            >
              IVOLEX
            </div>
            <p 
              className="text-sm mb-6 leading-relaxed"
              style={{ color: `${themeColors.surface}CC` }}
            >
              Crafting premium goods with passion and precision since 2010. 
              Each piece tells a story of craftsmanship and elegance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div 
                className="flex items-center gap-3 text-sm"
                style={{ color: `${themeColors.surface}CC` }}
              >
                <MapPin size={16} />
                <span>Riyadh, Saudi Arabia</span>
              </div>
              <div 
                className="flex items-center gap-3 text-sm"
                style={{ color: `${themeColors.surface}CC` }}
              >
                <Phone size={16} />
                <span>+966 50 123 4567</span>
              </div>
              <div 
                className="flex items-center gap-3 text-sm"
                style={{ color: `${themeColors.surface}CC` }}
              >
                <Mail size={16} />
                <span>hello@ivolex.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ backgroundColor: `${themeColors.surface}20` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <IconComponent 
                      size={18} 
                      style={{ color: themeColors.surface }}
                    />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div 
              className="font-semibold mb-4"
              style={{ color: themeColors.surface }}
            >
              Shop
            </div>
            <ul className="space-y-3 text-sm">
              {footerLinks.shop.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: `${themeColors.surface}CC` }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div 
              className="font-semibold mb-4"
              style={{ color: themeColors.surface }}
            >
              Company
            </div>
            <ul className="space-y-3 text-sm">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: `${themeColors.surface}CC` }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div 
              className="font-semibold mb-4"
              style={{ color: themeColors.surface }}
            >
              Support
            </div>
            <ul className="space-y-3 text-sm">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: `${themeColors.surface}CC` }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Currency Selector - Only shown when not authenticated */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div 
                className="font-semibold mb-4"
                style={{ color: themeColors.surface }}
              >
                Preferences
              </div>
              <p 
                className="text-sm mb-4"
                style={{ color: `${themeColors.surface}CC` }}
              >
                Set your regional preferences for localized pricing and content.
              </p>
              <CurrencySelector variant="footer" showRegion={true} />
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-6"
          style={{ borderTop: `1px solid ${themeColors.border}40` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div 
              className="text-sm"
              style={{ color: `${themeColors.surface}AA` }}
            >
              © 2024 IVOLEX. All rights reserved.
            </div>

            {/* Currency Selector - Only shown when not authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center gap-4">
                <CurrencySelector variant="footer" showRegion={false} />
              </div>
            )}

            {/* Developer Information */}
            <div 
              className="text-sm text-center md:text-right"
              style={{ color: `${themeColors.surface}AA` }}
            >
              Developed by Limitless Infotech Solution Pvt Ltd.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <div 
                className="text-xs mr-2"
                style={{ color: `${themeColors.surface}AA` }}
              >
                We accept:
              </div>
              <div className="flex items-center gap-2">
                {['visa', 'mastercard', 'amex', 'paypal'].map(method => (
                  <div
                    key={method}
                    className="w-8 h-5 rounded border flex items-center justify-center text-[8px] font-bold"
                    style={{ 
                      backgroundColor: `${themeColors.surface}20`,
                      borderColor: `${themeColors.border}40`,
                      color: `${themeColors.surface}CC`,
                    }}
                  >
                    {method.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  )
}