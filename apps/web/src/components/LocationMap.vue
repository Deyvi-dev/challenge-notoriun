<template>
  <Card class="w-full shadow-lg">
    <CardHeader class="space-y-2">
      <CardTitle class="text-2xl font-bold">A localização está correta?</CardTitle>
      <CardDescription class="text-gray-600">Verifique a localização identificada e ajuste se for necessário</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <div class="relative">
          <div v-if="!mapLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <div id="map" class="w-full h-[500px] rounded-lg shadow-inner transition-all duration-300"></div>
        </div>

        <div class="flex justify-between items-center pt-4">
          <Button 
            variant="outline" 
            type="button" 
            @click="$emit('back')"
            class="hover:bg-gray-100 transition-colors"
          >
            Voltar
          </Button>
          <Button 
            type="button" 
            @click="saveLocation" 
            :disabled="isLoading"
            class="min-w-[120px] transition-all duration-200 hover:opacity-90"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Salvando...
            </span>
            <span v-else>Continuar</span>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Search from '@arcgis/core/widgets/Search'
import Graphic from '@arcgis/core/Graphic'
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import Popup from "@arcgis/core/widgets/Popup"
import * as locator from "@arcgis/core/rest/locator.js";
import api from '@/lib/axios'
import router from '@/router'

interface AddressProps {
  address: string;
  number: string;
  city: string;
  state: string;
  neighborhood: string;
  cep: string;
}

const props = defineProps<{
  addressData: AddressProps;
}>()

const emit = defineEmits(['back', 'location-selected'])
const { toast } = useToast()
const isLoading = ref(false)
let view: MapView
let currentLocation: Point | null = null
const mapLoaded = ref(false)
const locationData = ref({
  address: '',
  city: '',
  state: '',
  cep: '',
  neighborhood: '',
})

onMounted(async () => {
  try {
    const fullAddress = `${props.addressData.address}, ${props.addressData.number} - ${props.addressData.city}, ${props.addressData.state}`

    const map = new Map({
      basemap: 'streets-vector'
    })

    view = new MapView({
      container: 'map',
      map: map,
      zoom: 15,
      ui: {
        components: ['zoom']
      },
      popup: new Popup({
        dockEnabled: true,
        dockOptions: {
          position: "auto"
        }
      })
    })

    const search = new Search({
      view: view,
      popupEnabled: false,
      resultGraphicEnabled: false,
      searchTerm: fullAddress
    })

    view.ui.add(search, 'top-right')

    await view.when()
    mapLoaded.value = true

    search.on('select-result', (event) => {
      if (event.result?.feature?.geometry) {
        const location = event.result.feature.geometry as Point
        currentLocation = location
        view.goTo({ target: location, zoom: 16 })
        addMarker(location)
      }
    })

    const searchResult = await search.search(fullAddress)
    if (searchResult.results[0]?.results[0]?.feature) {
      const location = searchResult.results[0].results[0].feature.geometry as Point
      currentLocation = location
      view.goTo({ target: location, zoom: 16 })
      addMarker(location)
    }

    view.on('click', async (event) => {
      try {
        currentLocation = event.mapPoint
        addMarker(event.mapPoint)
        view.goTo({ target: event.mapPoint, zoom: view.zoom })
        
        const params = {
          location: event.mapPoint
        };

        const response = await locator.locationToAddress("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer", params);
      
        if (response && response.attributes) {
          locationData.value = {
            address: response.attributes.StAddr || response.address || '',
            city: response.attributes.City || '',
            state: response.attributes.Region || '',
            cep: response.attributes.Postal || '',
            neighborhood: response.attributes.Neighborhood || ''
          }

          view.popup.open({
            title: "Endereço Selecionado",
            content: `
              <div class="p-2">
                <p><strong>Endereço:</strong> ${locationData.value.address}</p>
                <p><strong>Cidade:</strong> ${locationData.value.city}</p>
                <p><strong>Estado:</strong> ${locationData.value.state}</p>
                <p><strong>CEP:</strong> ${locationData.value.cep}</p>
              </div>
            `,
            location: event.mapPoint
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Atenção',
            description: 'Não foi possível encontrar um endereço para esta localização.',
          })
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: 'Erro ao obter o endereço do local selecionado.',
        })
      }
    })
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Erro ao carregar o mapa.',
    })
  }
})

const addMarker = (location: Point) => {
  view.graphics.removeAll()
  
  const marker = new Graphic({
    geometry: location,
    symbol: new SimpleMarkerSymbol({
      color: [59, 130, 246],
      size: 12,
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    })
  })

  view.graphics.add(marker)
}

const saveLocation = async () => {
  if (!currentLocation) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: 'Selecione uma localização no mapa.',
    })
    return
  }

  try {
    isLoading.value = true
    const locationPayload = {
      latitude: currentLocation.latitude.toString(),
      longitude: currentLocation.longitude.toString(),
      address: locationData.value.address || props.addressData.address,
      city: locationData.value.city || props.addressData.city,
      cep:  locationData.value.cep || props.addressData.cep,
      state: locationData.value.state || props.addressData.state,
      neighborhood: locationData.value.neighborhood || props.addressData.neighborhood,
    }
    
    await api.put('/users/profile/location', locationPayload)
    toast({
      title: 'Sucesso!',
      description: 'Localização salva com sucesso.',
    })
    emit('location-selected', locationPayload)
    router.push('/')
    window.location.href = '/'
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Erro!',
      description: error.response?.data?.message || 'Erro ao salvar a localização.',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import 'https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/light/main.css';
@import "https://js.arcgis.com/calcite-components/2.13.2/calcite.css";
</style>
