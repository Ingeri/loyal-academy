import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Loyal Academy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering learners worldwide with quality education and expert instruction.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@loyalacademy.com" className="hover:text-primary transition">
                  info@loyalacademy.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-primary transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Global Organization</span>
              </div>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold mb-4">Learning</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-muted-foreground hover:text-primary transition">
                  Find Instructors
                </Link>
              </li>
              <li>
                <Link href="/learning-paths" className="text-muted-foreground hover:text-primary transition">
                  Learning Paths
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-muted-foreground hover:text-primary transition">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              &copy; {currentYear} Loyal Academy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
