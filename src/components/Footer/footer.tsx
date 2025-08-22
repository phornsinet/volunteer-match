import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image src="/logoremove.png" alt="Volunteer World Logo" width={100} height={40} />
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
  <span className="text-gray-700 font-semibold">Social</span>
  <div className="flex space-x-3">

    <Link href="#" className="text-gray-600 hover:text-gray-900">
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.77-1.63 1.563V12h2.77l-.44 2.893h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    </Link>

    <Link href="#" className="text-gray-600 hover:text-gray-900">
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.901 1.055h3.402L14.453 9.21 22.864 24h-7.14L9.444 14.868 3.51 24H.107l8.47-12.787L.344 1.055h7.52L13.344 7.64 18.901 1.055zm-1.84 1.638L7.94 13.095l-.64-.966L16.42 2.723l.64.966z" />
      </svg>
    </Link>

    <Link href="#" className="text-gray-600 hover:text-gray-900">
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.77 1.69 4.918 4.918.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.252-1.69 4.77-4.918 4.918-1.265.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.77-1.69-4.918-4.918-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.252 1.69-4.77 4.918-4.918 1.265-.058 1.646-.07 4.85-.07zm0 2.155c-3.193 0-3.568.012-4.825.071-2.99.136-4.086 1.408-4.222 4.222-.058 1.256-.07 1.631-.07 4.825s.012 3.568.07 4.825c.136 2.99 1.408 4.086 4.222 4.222 1.256.058 1.631.07 4.825.07s3.568-.012 4.825-.07c2.99-.136 4.086-1.408 4.222-4.222.058-1.256.07-1.631.07-4.825s-.012-3.568-.07-4.825c-.136-2.99-1.408-4.086-4.222-4.222-1.256-.058-1.631-.07-4.825-.07zm-5.592 5.512c0 1.21.98 2.19 2.19 2.19s2.19-.98 2.19-2.19-.98-2.19-2.19-2.19-2.19.98-2.19 2.19zm8.567.001c0-1.21-.98-2.19-2.19-2.19s-2.19.98-2.19 2.19.98 2.19 2.19 2.19 2.19-.98 2.19-2.19z" />
      </svg>
    </Link>
  </div>
</div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
            <Link href="/contact" className="hover:text-gray-900">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
