import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer(){
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ]

  const footerLinks = {
    shop: [
      { name: "Wallets", href: "#" },
      { name: "Bags", href: "#" },
      { name: "Belts", href: "#" },
      { name: "Footwear", href: "#" },
      { name: "Accessories", href: "#" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Customization", href: "#customize" },
      { name: "Sustainability", href: "#" },
      { name: "Careers", href: "#" }
    ],
    support: [
      { name: "FAQs", href: "#" },
      { name: "Shipping & Returns", href: "#" },
      { name: "Care Guide", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" }
    ]
  }

  return (
    <footer id="about" className="bg-stone-900 text-stone-200">
      <div className="container-xl">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="font-bold text-xl text-white mb-4">IVOLEX</div>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed">
              Crafting premium leather goods with passion and precision since 2010.
              Each piece tells a story of craftsmanship and elegance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <MapPin size={16} />
                <span>Riyadh, Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <Phone size={16} />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
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
                    className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <IconComponent size={18} />
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
            <div className="font-semibold text-white mb-4">Shop</div>
            <ul className="space-y-3 text-sm text-stone-400">
              {footerLinks.shop.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a href={link.href} className="hover:text-white transition-colors duration-200">
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
            <div className="font-semibold text-white mb-4">Company</div>
            <ul className="space-y-3 text-sm text-stone-400">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a href={link.href} className="hover:text-white transition-colors duration-200">
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
            <div className="font-semibold text-white mb-4">Support</div>
            <ul className="space-y-3 text-sm text-stone-400">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a href={link.href} className="hover:text-white transition-colors duration-200">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-stone-800 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-stone-500">
              © 2024 IVOLEX. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-stone-500 mr-2">We accept:</div>
              <div className="flex items-center gap-2">
                {['visa', 'mastercard', 'amex', 'paypal'].map((method) => (
                  <div
                    key={method}
                    className="w-8 h-5 bg-stone-700 rounded border border-stone-600 flex items-center justify-center text-[8px] font-bold text-stone-300"
                  >
                    {method.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
