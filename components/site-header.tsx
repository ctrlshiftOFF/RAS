"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Sobre", href: "/about" },
    { name: "Serviços", href: "/services" },
    { name: "Portfólio", href: "/portfolio" },
    { name: "Depoimentos", href: "/testimonials" },
    { name: "Contato", href: "/contact" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              R.A.S.
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-gray-700",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span>(11) 99999-9999</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Área Administrativa
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm">Solicitar Orçamento</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button type="button" className="text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Abrir menu principal</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <div className="flex items-center text-sm font-medium mb-2">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Área Administrativa
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Solicitar Orçamento</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

