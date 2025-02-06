import { Button } from "@/components/ui/button"
import { SiFacebook, SiGithub, SiInstagram, SiLinkedin, SiTwitch } from "@icons-pack/react-simple-icons"

export default function Footer(){
  return (
    <footer className="bg-background text-foreground py-8 border-border border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:underline">About Us</a></li>
              <li><a href="/" className="hover:underline">Careers</a></li>
              <li><a href="/" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2">
              <li>Content Filtering</li>
              <li>Support with ArXiv</li>
              <li>UI Built With Shadcn</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <SiFacebook></SiFacebook>
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <SiGithub></SiGithub>
                  <span className="sr-only">Github</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <SiInstagram></SiInstagram>
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <SiLinkedin></SiLinkedin>
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p>&copy; {new Date().getFullYear()} CiteGeist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

