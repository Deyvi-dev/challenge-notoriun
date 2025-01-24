<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="w-full max-w-md shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle class="text-lg font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="login" class="space-y-4 p-4">
          <div class="form-group mb-4">
            <Label for="email" class="text-sm font-bold">E-mail*</Label>
            <Input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="exemplo@email.com.br"
              required
              class="border rounded-md p-2 w-full"
            />
          </div>
          <div class="form-group mb-4">
            <Label for="password" class="text-sm font-bold">Password:</Label>
            <Input
              type="password"
              id="password"
              placeholder="*****"
              v-model="form.password"
              required
              class="border rounded-md p-2 w-full"
            />
          </div>
          <Button type="submit" class="w-full  rounded-md p-2">Login</Button>
        </form>
        <div v-if="errorMessage" class="error-message text-red-500 font-bold mt-2">{{ errorMessage }}</div>
        <div class="mt-4 text-center">
          <p class="text-sm">Se você não possui uma conta, <router-link to="/register" class="text-blue-500 underline">cadastre-se aqui</router-link>.</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast' 
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/axios';

const router = useRouter();
const { toast } = useToast();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});
const errorMessage = ref('');

const login = async () => {
  try {
    const response = await api.post('/auth/login', form.value);
    const { access_token, user } = response.data;

    authStore.setToken(access_token);
    authStore.setUser(user);
    
    toast({
      title: 'Login Successful!',
      description: 'You are now logged in.',
    });
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Login failed.';
    toast({
      variant: 'destructive',
      title: 'Error!',
      description: errorMessage.value,
    });
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
</style>
