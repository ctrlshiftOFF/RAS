import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">R.A.S.</h3>
            <p className="mb-4 text-gray-300">
              Serviços profissionais de pintura e reforma para propriedades residenciais e comerciais.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-white">
                  Portfólio
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-white">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/residential" className="text-gray-300 hover:text-white">
                  Pintura Residencial
                </Link>
              </li>
              <li>
                <Link href="/services/commercial" className="text-gray-300 hover:text-white">
                  Pintura Comercial
                </Link>
              </li>
              <li>
                <Link href="/services/interior" className="text-gray-300 hover:text-white">
                  Reforma de Interiores
                </Link>
              </li>
              <li>
                <Link href="/services/wall-repair" className="text-gray-300 hover:text-white">
                  Reparos em Paredes e Tetos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>contato@ras.com.br</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>Rua das Tintas, 123, São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} R.A.S. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

