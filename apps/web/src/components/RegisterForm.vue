<template>
  <Card class="w-full shadow-lg">
    <CardContent>
      <Form
        :validation-schema="schema"
        :initial-values="props.formValues"
        v-slot="{ errors }"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Nome completo*</FormLabel>
            <FormControl>
              <Input 
                id="name" 
                v-bind="field"
                placeholder="Nome Sobrenome" 
              />
            </FormControl>
            <FormMessage>{{ errors.name }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="phone">
          <FormItem>
            <FormLabel>Celular*</FormLabel>
            <FormControl>
              <Input
                id="phone"
                v-bind="field"
                v-mask="'(##) #####-####'"
                placeholder="(00) 00000-0000"
              />
            </FormControl>
            <FormMessage>{{ errors.phone }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="email">
          <FormItem>
            <FormLabel>E-mail*</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                v-bind="field"
                placeholder="exemplo@email.com.br"
              />
            </FormControl>
            <FormMessage>{{ errors.email }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="password">
          <FormItem>
            <FormLabel>Senha*</FormLabel>
            <FormControl>
              <Input
                id="password"
                type="password"
                v-bind="field"
                placeholder="Sua senha"
              />
            </FormControl>
            <FormMessage>{{ errors.password }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirme a senha*</FormLabel>
            <FormControl>
              <Input
                id="confirmPassword"
                type="password"
                v-bind="field"
                placeholder="Digite sua senha novamente"
              />
            </FormControl>
            <FormMessage>{{ errors.confirmPassword }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex justify-between items-center mt-6">
          <Button variant="outline" type="button" @click="router.push('/login')">
            Já tenho uma conta
          </Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Cadastrando...' : 'Continuar' }}
          </Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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
import api from '@/lib/axios'

const props = defineProps<{
  formValues?: Record<string, any>
}>()

const emit = defineEmits(['submit'])
const router = useRouter()
const { toast } = useToast()
const isLoading = ref(false)

const schema = toTypedSchema(z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(9, "Celular inválido"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}))

const handleSubmit = async (values: any) => {
  try {
    isLoading.value = true
    await api.post('/users', values)
    toast({
      title: 'Sucesso!',
      description: 'Cadastro inicial realizado com sucesso.',
    })
    emit('submit', values)
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: error.response?.data?.message || 'Ocorreu um erro ao cadastrar.',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
