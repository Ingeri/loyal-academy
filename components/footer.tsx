import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Link2,
  Camera,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/footer-bg.png"
          alt="Footer Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-primary/90" />

      {/* Footer Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Institute Info */}
          <div>
            <img
              src="/lli-logo.png"
              alt="LOYAL Leadership Institute Logo"
              className="mb-4 h-16 w-16 object-contain"
            />

            <h3 className="mb-3 font-serif text-xl font-bold text-white">
              LOYAL Leadership Institute
            </h3>

            <p className="mb-5 text-sm leading-7 text-white/75">
              Empowering minds, inspiring leadership, and developing ethical,
              confident, and impactful leaders for a better tomorrow.
            </p>

            <div className="space-y-3 text-sm text-white/75">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a
                  href="mailto:info@loyalleadershipinstitute.org"
                  className="transition hover:text-accent"
                >
                  info@loyalleadershipinstitute.org
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <a
                  href="tel:+250000000000"
                  className="transition hover:text-accent"
                >
                  +250 000 000 000
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Learning
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="text-white/75 transition hover:text-accent">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white/75 transition hover:text-accent">
                  Leadership Programs
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white/75 transition hover:text-accent">
                  Career Development
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white/75 transition hover:text-accent">
                  Public Speaking
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Company
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-white/75 transition hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white/75 transition hover:text-accent">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-white/75 transition hover:text-accent">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/75 transition hover:text-accent">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Legal
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-white/75 transition hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/75 transition hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/75 transition hover:text-accent">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-white/75 transition hover:text-accent">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/15 pt-8">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-center text-sm text-white/65 sm:text-left">
              &copy; {currentYear} LOYAL Leadership Institute. All rights reserved.
            </p>

            <div className="flex gap-4">
              <a href="https://facebook.com" className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-accent hover:text-primary">
                <Globe className="h-4 w-4" />
              </a>

              <a href="https://twitter.com" className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-accent hover:text-primary">
                <MessageCircle className="h-4 w-4" />
              </a>

              <a href="https://linkedin.com" className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-accent hover:text-primary">
                <Link2 className="h-4 w-4" />
              </a>

              <a href="https://instagram.com" className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-accent hover:text-primary">
                <Camera className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}