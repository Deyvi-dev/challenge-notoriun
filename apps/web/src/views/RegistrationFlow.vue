<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="container mx-auto max-w-4xl p-6">
      <div class="block w-full">
        <Stepper 
          v-model="stepIndex"
          :allowChangeStep="false"
          class="block w-full"
        >
          <div class="flex w-full flex-start gap-2">
            <StepperItem
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              class="relative flex w-full flex-col items-center justify-center"
              :step="step.step"
              :disabled="!isStepEnabled(step.step)"
            >
              <StepperSeparator
                v-if="step.step !== steps[steps.length - 1].step"
                class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full"
                :class="[
                  state === 'completed' ? 'bg-primary' : 'bg-muted',
                  { 'opacity-50': !isStepEnabled(step.step) }
                ]"
              />

              <StepperTrigger as-child>
                <Button
                  :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                  size="icon"
                  class="z-10 rounded-full shrink-0"
                  :class="[
                    state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                    !isStepEnabled(step.step) && 'opacity-50 cursor-not-allowed'
                  ]"
                  :disabled="!isStepEnabled(step.step)"
                >
                  <Check v-if="state === 'completed'" class="size-5" />
                  <Circle v-if="state === 'active'" />
                  <Dot v-if="state === 'inactive'" />
                </Button>
              </StepperTrigger>

              <div class="mt-5 flex flex-col items-center text-center">
                <StepperTitle
                  :class="[
                    state === 'active' && 'text-primary',
                    !isStepEnabled(step.step) && 'text-muted-foreground'
                  ]"
                  class="text-sm font-semibold transition lg:text-base"
                >
                  {{ step.title }}
                </StepperTitle>
                <StepperDescription
                  :class="[
                    state === 'active' && 'text-primary',
                    !isStepEnabled(step.step) && 'text-muted-foreground'
                  ]"
                  class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                >
                  {{ step.description }}
                </StepperDescription>
              </div>
            </StepperItem>
          </div>

          <div class="mt-8">
            <!-- Initial Registration -->
            <template v-if="stepIndex === 1">
              <RegisterForm 
                :form-values="formData"
                @submit="handleRegisterSubmit" 
              />
            </template>

            <!-- Email Verification -->
            <template v-if="stepIndex === 2">
              <VerifyEmail
                :email="formData.email"
                :password="formData.password"
                @verified="handleEmailVerified"
                @back="handleBack"
              />
            </template>

            <!-- Complete Registration -->
            <template v-if="stepIndex === 3">
              <CompleteRegistrationForm
                :form-values="formData"
                @submit="handleCompleteSubmit"
                @back="handleBack"
              />
            </template>

            <!-- Location Selection -->
            <template v-if="stepIndex === 4">
              <LocationMap 
                :address-data="{
                  address: formData.address,
                  number: formData.number,
                  city: formData.city,
                  state: formData.state,
                  neighborhood: formData.neighborhood,
                  cep: formData.cep
                }"
                @location-selected="handleLocationSubmit"
                @back="handleBack"
              />
            </template>
          </div>
        </Stepper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Check, Circle, Dot } from "lucide-vue-next";
import RegisterForm from "@/components/RegisterForm.vue";
import VerifyEmail from "@/components/VerifyEmail.vue";
import CompleteRegistrationForm from "@/components/CompleteRegistrationForm.vue";
import LocationMap from "@/components/LocationMap.vue";

const router = useRouter();
const { toast } = useToast();
const stepIndex = ref(1);

// Controle de steps completados
const completedSteps = ref<number[]>([]);

interface FormData {
  email: string;
  name: string;
  phone: string;
  password: string;
  cnpj: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  number: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
}

const formData = ref<FormData>({
  email: "",
  name: "",
  phone: "",
  password: "",
  cnpj: "",
  cep: "",
  address: "",
  city: "",
  state: "",
  number: "",
  neighborhood: "",
  latitude: null,
  longitude: null,
});

const steps = [
  {
    step: 1,
    title: "Cadastro Inicial",
    description: "Informações básicas",
  },
  {
    step: 2,
    title: "Verificação",
    description: "Confirme seu e-mail",
  },
  {
    step: 3,
    title: "Complemento",
    description: "Dados adicionais",
  },
  {
    step: 4,
    title: "Localização",
    description: "Confirme seu endereço",
  },
];

// Verifica se um step está habilitado
const isStepEnabled = (step: number) => {
  if (step === 1) return true;
  return completedSteps.value.includes(step - 1);
};

// Marca um step como completo
const completeStep = (step: number) => {
  if (!completedSteps.value.includes(step)) {
    completedSteps.value.push(step);
  }
};

const handleBack = () => {
  if (stepIndex.value > 1) {
    stepIndex.value--;
  }
};

const handleRegisterSubmit = (values: Partial<FormData>) => {
  formData.value = { ...formData.value, ...values };
  completeStep(1);
  stepIndex.value++;
};

const handleEmailVerified = () => {
  completeStep(2);
  stepIndex.value++;
};

const handleCompleteSubmit = async (values: Partial<FormData>) => {
  try {
    formData.value = { ...formData.value, ...values };
    completeStep(3);
    stepIndex.value++;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao processar os dados do formulário.",
    });
  }
};

const handleLocationSubmit = (data: { latitude: number; longitude: number }) => {
  formData.value = { ...formData.value, ...data };
  completeStep(4);
  router.push("/success");
};

// Watch para impedir navegação direta para steps não habilitados
watch(stepIndex, (newStep) => {
  if (!isStepEnabled(newStep)) {
    const lastCompletedStep = Math.max(...completedSteps.value, 1);
    stepIndex.value = lastCompletedStep;
    
    toast({
      variant: "destructive",
      title: "Ação não permitida",
      description: "Complete o passo atual antes de avançar.",
    });
  }
});
</script>
