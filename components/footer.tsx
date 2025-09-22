"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const footerSections = [
  {
    title: "خدماتنا",
    links: [
      { name: "تصميم جرافيك", href: "/services/graphic-design" },
      { name: "إعلانات وسائل التواصل", href: "/services/social-media" },
      { name: "تصميم مواقع ويب", href: "/services/web-design" },
      { name: "الطباعة والنشر", href: "/services/printing" },
      { name: "التسويق الرقمي", href: "/services/digital-marketing" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { name: "من نحن", href: "/about" },
      { name: "فريق العمل", href: "/team" },
      { name: "أعمالنا", href: "/portfolio" },
      { name: "الأخبار", href: "/news" },
      { name: "الوظائف", href: "/careers" },
    ],
  },
  {
    title: "الدعم",
    links: [
      { name: "مركز المساعدة", href: "/help" },
      { name: "تواصل معنا", href: "/contact" },
      { name: "الأسئلة الشائعة", href: "/faq" },
      { name: "سياسة الخصوصية", href: "/privacy" },
      { name: "شروط الاستخدام", href: "/terms" },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "فيسبوك" },
  { icon: Twitter, href: "#", label: "تويتر" },
  { icon: Instagram, href: "#", label: "إنستغرام" },
  { icon: Linkedin, href: "#", label: "لينكد إن" },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="text-3xl font-bold mb-4">
                <span className="text-brand-yellow">خط</span>
                <span className="text-brand-blue mx-2">الإعلان</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                شركة رائدة في مجال الإعلان والتسويق الرقمي، نقدم حلولاً إبداعية ومتطورة لمساعدة عملائنا في تحقيق أهدافهم
                التسويقية.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+966503502717</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>promovision.ad@gmail.com</span>
                </div>s
                <div className="flex items-center space-x-3 space-x-reverse text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>الدمام حي الشفاء فاطمة الزهراء</span>
                  <span>البحرين</span>
                </div>
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-lg mb-4 text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="max-w-md mx-auto text-center">
              <h3 className="font-semibold text-lg mb-2">اشترك في نشرتنا الإخبارية</h3>
              <p className="text-muted-foreground mb-4 text-sm">احصل على آخر الأخبار والعروض الحصرية</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="أدخل بريدك الإلكتروني" className="text-right" />
                <Button className="bg-primary hover:bg-primary/90">اشتراك</Button>
              </div>
            </div>
                </motion.div> */}
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground"
            >
              © 2024 خط الإعلان. جميع الحقوق محفوظة.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 space-x-reverse"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>

            {/* Scroll to Top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button variant="ghost" size="icon" onClick={scrollToTop} className="hover:bg-primary/10">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
