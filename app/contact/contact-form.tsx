"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de email válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor, insira um número de telefone válido.",
  }),
  serviceType: z.enum(["residential", "commercial", "remodeling", "other"], {
    required_error: "Por favor, selecione um tipo de serviço.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
  requestEstimate: z.boolean().default(false),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  address: z.string().optional(),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestEstimate, setRequestEstimate] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "residential",
      message: "",
      requestEstimate: false,
      preferredDate: "",
      preferredTime: "",
      address: "",
    },
  })

  // Efeito para carregar as datas disponíveis
  useEffect(() => {
    // Simulação de datas disponíveis (em um sistema real, isso viria da API)
    const today = new Date()
    const dates: Date[] = []

    // Adicionar os próximos 30 dias como disponíveis, exceto finais de semana
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Excluir sábados (6) e domingos (0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }

    setAvailableDates(dates)
  }, [])

  // Efeito para carregar os horários disponíveis quando uma data é selecionada
  useEffect(() => {
    if (selectedDate) {
      // Simulação de horários disponíveis (em um sistema real, isso viria da API)
      const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

      // Filtrar horários já agendados (simulação)
      const bookedTimes: string[] = []
      if (selectedDate.getDate() % 2 === 0) {
        bookedTimes.push("09:00", "15:00")
      } else {
        bookedTimes.push("10:00", "16:00")
      }

      const availableTimes = times.filter((time) => !bookedTimes.includes(time))
      setAvailableTimeSlots(availableTimes)

      // Atualizar o formulário com a data selecionada
      form.setValue("preferredDate", selectedDate.toISOString().split("T")[0])
    }
  }, [selectedDate, form])

  // Função para verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear(),
    )
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Formulário enviado!",
        description: requestEstimate
          ? "Sua solicitação de orçamento foi recebida. Entraremos em contato o mais breve possível."
          : "Entraremos em contato o mais breve possível.",
      })
      form.reset()
      setRequestEstimate(false)
      setSelectedDate(undefined)
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="joao@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Serviço</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="residential" />
                    </FormControl>
                    <FormLabel className="font-normal">Pintura Residencial</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="commercial" />
                    </FormControl>
                    <FormLabel className="font-normal">Pintura Comercial</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="remodeling" />
                    </FormControl>
                    <FormLabel className="font-normal">Reforma de Interiores</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="font-normal">Outros Serviços</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestEstimate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    setRequestEstimate(checked as boolean)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Solicitar orçamento</FormLabel>
                <FormDescription>Marque esta opção para agendar uma visita técnica para orçamento</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {requestEstimate && (
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-medium">Informações para Orçamento</h3>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro, cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Preferencial</FormLabel>
                    <FormDescription>Selecione uma data disponível no calendário abaixo</FormDescription>
                    <div className="p-2 border rounded-md">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => !isDateAvailable(date) || date < new Date()}
                        className="rounded-md border"
                        modifiers={{
                          available: availableDates,
                        }}
                        modifiersStyles={{
                          available: {
                            backgroundColor: "hsl(var(--primary) / 0.1)",
                          },
                        }}
                      />
                    </div>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Preferencial</FormLabel>
                    <FormDescription>Selecione um horário disponível para a data escolhida</FormDescription>
                    <Select
                      disabled={!selectedDate || availableTimeSlots.length === 0}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte-nos sobre seu projeto..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Por favor, forneça detalhes sobre seu projeto, incluindo cronograma e orçamento, se aplicável.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : requestEstimate ? "Solicitar Orçamento" : "Enviar Mensagem"}
        </Button>
      </form>
    </Form>
  )
}

