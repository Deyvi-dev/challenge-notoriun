<template>
  <Card class="w-full shadow-lg">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Validação de e-mail</CardTitle>
      <CardDescription class="text-lg mt-2">
        Insira o código de 6 dígitos enviado para
        <span class="font-medium text-primary">{{ email }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="flex justify-center">
        <PinInput
          id="pin-input"
          v-model="code"
          placeholder="○"
          @complete="handleSubmit"
        >
          <PinInputGroup class="gap-2">
            <template v-for="(_, index) in 6" :key="index">
              <PinInputInput
                class="h-12 w-12 rounded-md border text-center text-xl font-semibold"
                :index="index"
              />
              <PinInputSeparator v-if="index !== 5" />
            </template>
          </PinInputGroup>
        </PinInput>
      </div>

      <div class="text-center">
        <p class="text-sm text-muted-foreground mb-4">
          Não recebeu o código? Verifique sua caixa de spam ou
        </p>
        <Button
          variant="link"
          type="button"
          class="text-primary font-medium"
          :disabled="isResending"
          @click="resendCode"
        >
          {{ isResending ? "Reenviando..." : "Solicite um novo código" }}
        </Button>
      </div>

      <div class="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          type="button" 
          @click="$emit('back')"
          :disabled="isLoading"
        >
          Voltar
        </Button>
        <Button 
          type="submit" 
          :disabled="isLoading || !isComplete" 
          @click="handleSubmit"
          class="min-w-[120px]"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Verificando...
          </span>
          <span v-else>Continuar</span>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
  PinInputSeparator,
} from '@/components/ui/pin-input';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  email: string,
  password: string
}>();

const emit = defineEmits(['back', 'verified']);
const { toast } = useToast();
const authStore = useAuthStore();
const code = ref(["", "", "", "", "", ""]);
const isLoading = ref(false);
const isResending = ref(false);

const isComplete = computed(() => code.value.every((digit) => digit !== ""));

onMounted(() => {
  code.value[0] = ""; // Focus the first input
});

const handleSubmit = async () => {
  if (!isComplete.value) return;
  
  try {
    isLoading.value = true;
    await api.post('/users/verify-email', {
      email: props.email,
      code: code.value.join(""),
    });
    
    // Authenticate user after successful verification
    const response = await api.post('/auth/login', {
      email: props.email,
      password: props.password
    });
    
    const { access_token, user } = response.data;
    authStore.setToken(access_token);
    authStore.setUser(user);
    
    toast({
      title: "Sucesso!",
      description: "E-mail verificado com sucesso.",
    });
    
    emit('verified');
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erro!",
      description: error.response?.data?.message || "Código inválido.",
    });
  } finally {
    isLoading.value = false;
  }
};

const resendCode = async () => {
  try {
    isResending.value = true;
    await api.post(`/users/resend-code/${props.email}`);
    
    toast({
      title: "Código reenviado!",
      description: "Verifique seu e-mail.",
    });
    
    // Limpar o código atual
    code.value = ["", "", "", "", "", ""];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erro!",
      description: error.response?.data?.message || "Erro ao reenviar o código.",
    });
  } finally {
    isResending.value = false;
  }
};
</script>
