import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MemeVerse</h3>
            <p className="text-muted-foreground">
              Your ultimate destination for exploring, creating, and sharing the best memes on the internet.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memes" className="text-muted-foreground hover:text-primary transition-colors">
                  Explore Memes
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-muted-foreground hover:text-primary transition-colors">
                  Upload Meme
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-muted-foreground mb-4">Follow us on social media for the latest memes and updates.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Reddit
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} MemeVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

