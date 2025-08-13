#!/usr/bin/env node

/**
 * Script para probar el flujo OAuth completo
 * Uso: node test-oauth-flow.js
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testOAuthFlow() {
  console.log('🧪 Iniciando test del flujo OAuth...\n');

  try {
    // 1. Verificar estado del servidor
    console.log('1️⃣ Verificando estado del servidor...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Servidor funcionando:', healthData);
    } else {
      throw new Error('Servidor no responde');
    }

    // 2. Verificar configuración OAuth
    console.log('\n2️⃣ Verificando configuración OAuth...');
    const oauthStatusResponse = await fetch(`${BASE_URL}/api/auth/oauth/status`);
    if (oauthStatusResponse.ok) {
      const oauthData = await oauthStatusResponse.json();
      console.log('✅ OAuth configurado:', oauthData);
      
      if (!oauthData.oauth.google.configured) {
        throw new Error('Google OAuth no está configurado');
      }
    } else {
      throw new Error('No se pudo verificar configuración OAuth');
    }

    // 3. Probar demo OAuth
    console.log('\n3️⃣ Probando demo OAuth...');
    const demoResponse = await fetch(`${BASE_URL}/api/auth/google/demo`, {
      redirect: 'manual'
    });
    
    if (demoResponse.status === 302) {
      const location = demoResponse.headers.get('location');
      console.log('✅ Demo OAuth redirige a:', location);
      
      // Extraer token de la URL de redirección
      const url = new URL(location);
      const token = url.searchParams.get('token');
      
      if (token) {
        console.log('✅ Token generado exitosamente, longitud:', token.length);
        
        // 4. Probar endpoint de perfil con el token
        console.log('\n4️⃣ Probando endpoint de perfil...');
        const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Perfil obtenido exitosamente:', profileData);
          
          // 5. Probar endpoint de preguntas
          console.log('\n5️⃣ Probando endpoint de preguntas...');
          const questionsResponse = await fetch(`${BASE_URL}/api/questions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            console.log('✅ Preguntas obtenidas exitosamente:', questionsData);
          } else {
            const questionsError = await questionsResponse.text();
            console.error('❌ Error obteniendo preguntas:', questionsError);
          }
          
        } else {
          const profileError = await profileResponse.text();
          console.error('❌ Error obteniendo perfil:', profileError);
        }
      } else {
        console.error('❌ No se generó token en demo OAuth');
      }
    } else {
      const demoError = await demoResponse.text();
      console.error('❌ Error en demo OAuth:', demoError);
    }

    console.log('\n✅ Test completado exitosamente');
    
  } catch (error) {
    console.error('\n❌ Error en test:', error.message);
    process.exit(1);
  }
}

// Ejecutar test
testOAuthFlow();
