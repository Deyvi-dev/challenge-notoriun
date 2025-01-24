<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Informações complementares</CardTitle>
      <CardDescription>Complete seu cadastro</CardDescription>
    </CardHeader>
    <CardContent>
      <Form
        :validation-schema="schema"
        :initial-values="props.formValues"
        v-slot="{ errors }"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField v-slot="{ field }" name="cnpj">
            <FormItem>
              <FormLabel>Número do CNPJ*</FormLabel>
              <FormControl>
                <Input
                  id="cnpj"
                  v-bind="field"
                  v-mask="'##.###.###/####-##'"
                  placeholder="Digite o número do CNPJ"
                />
              </FormControl>
              <FormMessage>{{ errors.cnpj }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="cep">
            <FormItem>
              <FormLabel>CEP*</FormLabel>
              <div class="flex gap-2">
                <FormControl>
                  <Input
                    id="cep"
                    v-bind="field"
                    v-mask="'#####-###'"
                    placeholder="Digite o CEP"
                    @blur="fetchAddress"
                  />
                </FormControl>
                <Button type="button" variant="outline" @click="fetchAddress" :disabled="isLoadingCep">
                  <span v-if="isLoadingCep">...</span>
                  <span v-else>Buscar</span>
                </Button>
              </div>
              <FormMessage>{{ errors.cep }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="state">
            <FormItem>
              <FormLabel>Estado*</FormLabel>
              <FormControl>
                <Input id="state" v-bind="field" readonly />
              </FormControl>
              <FormMessage>{{ errors.state }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="city">
            <FormItem>
              <FormLabel>Cidade*</FormLabel>
              <FormControl>
                <Input id="city" v-bind="field" readonly />
              </FormControl>
              <FormMessage>{{ errors.city }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="neighborhood">
            <FormItem>
              <FormLabel>Bairro*</FormLabel>
              <FormControl>
                <Input id="neighborhood" v-bind="field" />
              </FormControl>
              <FormMessage>{{ errors.neighborhood }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="address">
            <FormItem>
              <FormLabel>Endereço*</FormLabel>
              <FormControl>
                <Input id="address" v-bind="field" />
              </FormControl>
              <FormMessage>{{ errors.address }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="number">
            <FormItem>
              <FormLabel>Número*</FormLabel>
              <FormControl>
                <Input id="number" v-bind="field" />
              </FormControl>
              <FormMessage>{{ errors.number }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="complement">
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input id="complement" v-bind="field" />
              </FormControl>
              <FormMessage>{{ errors.complement }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-between mt-6">
          <Button variant="outline" type="button" @click="$emit('back')">
            Voltar
          </Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Continuar' }}
          </Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import axios from 'axios'
import api from '@/lib/axios'

const props = defineProps<{
  formValues?: Record<string, any>
}>()

const emit = defineEmits(['back', 'submit'])
const isLoading = ref(false)
const isLoadingCep = ref(false)
const { toast } = useToast()

const schema = toTypedSchema(z.object({
  cnpj: z.string().min(18, "CNPJ inválido"),
  cep: z.string().min(9, "CEP inválido"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
}))

const fetchAddress = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const cep = target.value.replace(/\D/g, '')
  if (cep.length !== 8) return

  try {
    isLoadingCep.value = true
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    const data = response.data

    if (data.erro) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'CEP não encontrado.',
      })
      return
    }

    const form = document.querySelector('form')
    if (form) {
      const stateInput = form.querySelector('#state') as HTMLInputElement
      const cityInput = form.querySelector('#city') as HTMLInputElement
      const neighborhoodInput = form.querySelector('#neighborhood') as HTMLInputElement
      const addressInput = form.querySelector('#address') as HTMLInputElement

      if (stateInput) stateInput.value = data.uf
      if (cityInput) cityInput.value = data.localidade
      if (neighborhoodInput) neighborhoodInput.value = data.bairro
      if (addressInput) addressInput.value = data.logradouro
      ;[stateInput, cityInput, neighborhoodInput, addressInput].forEach(input => {
        if (input) {
          input.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })
    }
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao buscar o CEP.',
    })
  } finally {
    isLoadingCep.value = false
  }
}

const handleSubmit = async (values: any) => {
  try {
    isLoading.value = true
    const formData = {
      ...values,
      cnpj: values.cnpj.replace(/\D/g, ''),
      cep: values.cep.replace(/\D/g, ''),
    }
    
    await api.put('/users/profile', formData)
    toast({
      title: 'Sucesso!',
      description: 'Informações salvas com sucesso.',
    })
    emit('submit', formData) // Emite os dados para o componente pai
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: error.response?.data?.message || 'Erro ao salvar as informações.',
    })
    return // Retorna em caso de erro para não avançar
  } finally {
    isLoading.value = false
  }
}
</script>
