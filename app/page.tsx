import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Projeto de pintura concluído"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transforme seu Espaço com Pintura e Reforma Profissional
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Qualidade artesanal e atenção aos detalhes para seus projetos residenciais e comerciais
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Solicitar Orçamento Grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                Ver Nosso Portfólio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre Nossa Empresa</h2>
              <p className="text-gray-700 mb-4">
                Com mais de 15 anos de experiência, nossa empresa de pintura e reforma tem entregado resultados
                excepcionais para proprietários de imóveis e empresas. Temos orgulho de nossa atenção aos detalhes e
                compromisso com a satisfação do cliente.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa equipe de profissionais qualificados é dedicada a transformar sua visão em realidade, garantindo
                que cada projeto seja concluído com os mais altos padrões de qualidade e artesanato.
              </p>
              <Link href="/about">
                <Button variant="outline">Saiba Mais Sobre Nós</Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Nossa equipe trabalhando"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Oferecemos uma ampla gama de serviços de pintura e reforma para atender todas as suas necessidades
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pintura Residencial",
                description: "Serviços de pintura interna e externa para casas de todos os tamanhos",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Pintura Comercial",
                description: "Soluções profissionais de pintura para escritórios, lojas e mais",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Reforma de Interiores",
                description: "Serviços completos de renovação para transformar seu espaço de vida ou trabalho",
                image: "/placeholder.svg?height=300&width=400",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <Link href="/services">
                    <Button variant="link" className="p-0">
                      Saiba Mais
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Transformar seu Espaço?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entre em contato hoje para uma consulta e orçamento gratuitos. Nossa equipe está pronta para dar vida à sua
            visão.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary">
              Solicitar Orçamento
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-4 w-4" /> Ligue: (11) 99999-9999
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Não acredite apenas em nossa palavra - ouça nossos clientes satisfeitos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "João Silva",
                role: "Proprietário",
                quote:
                  "A equipe fez um trabalho incrível pintando nossa casa. Eles foram profissionais, eficientes e os resultados superaram nossas expectativas.",
              },
              {
                name: "Sara Oliveira",
                role: "Empresária",
                quote:
                  "Contratamos eles para reformar nosso escritório, e eles entregaram um trabalho de qualidade excepcional, no prazo e dentro do orçamento. Altamente recomendado!",
              },
              {
                name: "Miguel Santos",
                role: "Administrador de Imóveis",
                quote:
                  "A atenção deles aos detalhes e compromisso com a qualidade é incomparável. Eles têm sido nossa empresa de pintura preferida para todas as nossas propriedades.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por Que Nos Escolher</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Estamos comprometidos em fornecer o serviço e os resultados da mais alta qualidade
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Equipe Experiente",
                description: "Nossos profissionais têm anos de experiência no setor",
              },
              {
                title: "Materiais de Qualidade",
                description: "Usamos apenas tintas e materiais da mais alta qualidade",
              },
              {
                title: "Conclusão no Prazo",
                description: "Concluímos projetos no cronograma sem comprometer a qualidade",
              },
              {
                title: "Satisfação do Cliente",
                description: "Sua satisfação é nossa principal prioridade em cada projeto",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

