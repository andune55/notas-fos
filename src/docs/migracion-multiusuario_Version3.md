# Migración a Multiusuario: Resumen Esquemático

## 1. **Contexto**
- Antes: La app guardaba las notas en localStorage con una única clave (por lo que todos los usuarios compartían datos si usaban el mismo navegador).
- Ahora: Cada usuario tiene su propio espacio de datos, seguro, aislado y sin mezcla accidental.

---

## 2. **Cambios en el Store de Usuario (`storeUser.ts`)**
- **Persistencia:** El usuario sigue usando `zustand` con `persist` para mantener su sesión entre recargas.
- **Limpieza de estado:**  
  - Al hacer `login` o `logout`, se limpia el estado y la caché del store de notas (`useNotaStore`), así nunca se heredan datos de otro usuario.
  - Ejemplo:
    ```typescript
    login: (token, usuario) => {
      useNotaStore.setState({ listas: { 'Mi lista': [] }, listaActiva: 'Mi lista' })
      set({ token, usuario })
    }
    ```

---

## 3. **Cambios en el Store de Notas (`store.ts`)**
- **Eliminación de persistencia local:**  
  - Se quitó el middleware `persist` para evitar la rehidratación automática de datos de otro usuario.
  - El estado de notas solo existe en memoria durante la sesión del usuario.
- **Sincronización con el backend:**  
  - Al loguearse o cambiar de usuario, el frontend recarga las notas desde el backend (`initFromServer()`).
  - Si no hay usuario, el estado de notas queda limpio.

---

## 4. **Sincronización entre Stores**
- El store de usuario controla la vida útil del store de notas:
  - **Al cambiar de usuario o cerrar sesión**, borra el estado de notas en memoria para asegurar que nunca se muestren datos de otro usuario.

---

## 5. **Consecuencias y buenas prácticas**
- **Aislamiento total:** Un usuario nunca ve ni temporalmente notas de otro.
- **No hace falta limpiar la caché del navegador manualmente**.
- **El almacenamiento local solo contiene la sesión del usuario**, no sus notas.
- **El backend sigue siendo la fuente de verdad** para las notas de cada usuario.

---

## 6. **Código clave de ejemplo**

```typescript
// storeUser.ts
login: (token, usuario) => {
  useNotaStore.setState({ listas: { 'Mi lista': [] }, listaActiva: 'Mi lista' })
  set({ token, usuario })
},
logout: () => {
  useNotaStore.setState({ listas: { 'Mi lista': [] }, listaActiva: 'Mi lista' })
  set({ token: null, usuario: null })
}
```

```typescript
// store.ts (notas)
// Quitar el middleware persist y asegurarse de limpiar el estado cuando cambia el usuario
```

---

## 7. **Resumen de pasos para migrar**

1. **Quitar persist** del store de notas.
2. **Limpiar el estado de notas** al hacer login/logout.
3. **Recargar las notas desde el backend** al iniciar sesión.
4. **Mantener persist solo en el store de usuario**.

---

## 8. **Notas finales**
- Si algún día quieres persistencia offline por usuario, deberás implementar un mecanismo que espere a que el usuario esté cargado antes de hidratar el estado de notas.
- Con este patrón, la app es segura, limpia y multiusuario real.
