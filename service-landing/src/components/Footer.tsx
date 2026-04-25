import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-slate-300 hover:text-white">Documentation</Link></li>
              <li><Link href="/docs/quickstart" className="text-slate-300 hover:text-white">Quickstart</Link></li>
              <li><Link href="/status" className="text-slate-300 hover:text-white">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">License</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Follow</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">GitHub</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-slate-400">
            © 2026 Scholarship API. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
