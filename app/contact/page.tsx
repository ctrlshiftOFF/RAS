import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: "Contato - R.A.S.",
  description: "Entre em contato com nossa equipe para um orçamento gratuito em seu projeto de pintura e reforma.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Entre em contato com nossa equipe para um orçamento gratuito ou para discutir suas necessidades de pintura e
          reforma.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Envie-nos uma Mensagem</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-gray-600">(11) 99999-9999</p>
                  <p className="text-gray-600">Segunda - Sexta: 8h - 18h</p>
                  <p className="text-gray-600">Sábado: 9h - 14h</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">contato@ras.com.br</p>
                  <p className="text-gray-600">orcamentos@ras.com.br</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-semibold">Localização do Escritório</h3>
                  <p className="text-gray-600">Rua das Tintas, 123</p>
                  <p className="text-gray-600">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Áreas de Atendimento</h3>
              <p className="text-gray-600 mb-2">Fornecemos serviços de pintura e reforma nas seguintes áreas:</p>
              <ul className="grid grid-cols-2 gap-2 text-gray-600">
                <li>São Paulo</li>
                <li>Guarulhos</li>
                <li>Osasco</li>
                <li>Santo André</li>
                <li>São Bernardo</li>
                <li>E regiões próximas</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 h-[300px] bg-gray-200 rounded-lg">
            {/* Map would go here - placeholder for now */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">Mapa Interativo</div>
          </div>
        </div>
      </div>
    </div>
  )
}

