<template>
  <div class="w-full mx-auto space-y-8 p-4">
    <Card class="w-full bg-white/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader class="space-y-1 border-b p-6">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-2xl font-bold">Informações do Perfil</CardTitle>
            <CardDescription class="text-muted-foreground mt-1">Suas informações cadastrais</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-6">
        <div v-if="isLoading" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 8" :key="i" class="space-y-2">
              <Skeleton class="h-4 w-20" />
              <Skeleton class="h-10 w-full" />
            </div>
          </div>
        </div>

        <form v-else class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField v-slot="{ field }" name="cnpj">
              <FormItem>
                <FormLabel class="font-medium">CNPJ</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="field"
                      v-model="form.cnpj"
                      v-mask="'##.###.###/####-##'"
                      placeholder="00.000.000/0000-00"
                      readonly
                      class="pl-10 bg-white/50"
                    />
                    <BuildingIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="cep">
              <FormItem>
                <FormLabel class="font-medium">CEP</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="field"
                      v-model="form.cep"
                      v-mask="'#####-###'"
                      placeholder="00000-000"
                      readonly
                      class="pl-10 bg-white/50"
                    />
                    <MapPinIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="state">
              <FormItem>
                <FormLabel class="font-medium">Estado</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input 
                      v-bind="field"
                      v-model="form.state" 
                      readonly 
                      class="pl-10 bg-white/50"
                      placeholder="Digite o estado"
                    />
                    <MapIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="city">
              <FormItem>
                <FormLabel class="font-medium">Cidade</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input 
                      v-bind="field"
                      v-model="form.city" 
                      readonly 
                      class="pl-10 bg-white/50"
                      placeholder="Digite a cidade"
                    />
                    <HomeIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="neighborhood">
              <FormItem>
                <FormLabel class="font-medium">Bairro</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input 
                      v-bind="field"
                      v-model="form.neighborhood" 
                      readonly 
                      class="pl-10 bg-white/50"
                      placeholder="Digite o bairro"
                    />
                    <LandmarkIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="address">
              <FormItem>
                <FormLabel class="font-medium">Endereço</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input 
                      v-bind="field"
                      v-model="form.address" 
                      readonly 
                      class="pl-10 bg-white/50"
                      placeholder="Digite o endereço"
                    />
                    <AtSignIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="number">
              <FormItem>
                <FormLabel class="font-medium">Número</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input 
                      v-bind="field"
                      v-model="form.number" 
                      readonly 
                      class="pl-10 bg-white/50"
                      placeholder="Digite o número"
                    />
                    <HashIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="email">
              <FormItem>
                <FormLabel class="font-medium">Email</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="field"
                      v-model="form.email"
                      type="email"
                      placeholder="seu@email.com"
                      readonly
                      class="pl-10 bg-white/50"
                    />
                    <MailIcon class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </form>
      </CardContent>
    </Card>

    <Card class="w-full bg-white/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader class="space-y-1 border-b p-6">
        <CardTitle class="text-2xl font-bold">Localização</CardTitle>
        <CardDescription class="text-muted-foreground">Sua localização registrada</CardDescription>
      </CardHeader>
      <CardContent class="p-6">
        <div class="relative rounded-lg overflow-hidden shadow-inner">
          <div v-if="!mapLoaded || isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
          <div id="map" class="w-full h-[400px]"></div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import Graphic from '@arcgis/core/Graphic'
import api from '@/lib/axios'
import { useForm } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import { z } from 'zod'
import { 
  BuildingIcon,
  MapPinIcon,
  MapIcon,
  HomeIcon,
  LandmarkIcon,
  AtSignIcon,
  HashIcon,
  MailIcon,
} from 'lucide-vue-next'
import { formatCNPJ, formatCEP, formatPhone } from '@/utils/format'

interface UserProfile {
  cnpj: string
  cep: string
  state: string
  city: string
  neighborhood: string
  address: string
  number: string
  email: string
  latitude?: string
  longitude?: string
}

const schema = toFormValidator(
  z.object({
    cnpj: z.string()
      .min(18, 'CNPJ inválido')
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato de CNPJ inválido'),
    cep: z.string()
      .min(9, 'CEP inválido')
      .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido'),
    state: z.string().min(2, 'Estado é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    address: z.string().min(2, 'Endereço é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  })
)

const { toast } = useToast()
const isLoading = ref(true)
const mapLoaded = ref(false)
let view: MapView

const form = reactive<UserProfile>({
  cnpj: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  address: '',
  number: '',
  email: '',
})

const { setValues } = useForm({
  validationSchema: schema,
  initialValues: form
})

const loadUserProfile = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/users/profile')
    const userData = response.data

    const formattedData = {
      ...userData,
      cnpj: formatCNPJ(userData.cnpj || ''),
      cep: formatCEP(userData.cep || ''),
      phone: formatPhone(userData.phone || '')
    }

    Object.assign(form, formattedData)
    setValues(formattedData)

    if (userData.latitude && userData.longitude) {
      initializeMap({
        latitude: parseFloat(userData.latitude),
        longitude: parseFloat(userData.longitude)
      })
    }
  } catch (error: any) {
    toast({
      title: 'Erro',
      description: 'Não foi possível carregar os dados do perfil',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const initializeMap = async (location: { latitude: number; longitude: number }) => {
  const map = new Map({
    basemap: 'streets-vector'
  })

  view = new MapView({
    container: 'map',
    map: map,
    zoom: 15,
    center: [location.longitude, location.latitude]
  })

  const point = new Point({
    longitude: location.longitude,
    latitude: location.latitude
  })

  const markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40],
    outline: {
      color: [255, 255, 255],
      width: 2
    }
  })

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol
  })

  view.graphics.add(pointGraphic)
  
  view.when(() => {
    mapLoaded.value = true
  })
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style>
@import 'https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/light/main.css';
@import "https://js.arcgis.com/calcite-components/2.13.2/calcite.css";
</style>
