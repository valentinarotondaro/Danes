// The small black message after an action ("Danish for work saved.").
// Module-level state like useAuth: any component can show a toast and the
// one <AdminToast> in the layout displays it, even after a route change.

import { ref } from 'vue'

const toast = ref(null) // { title, text } or null
let timer = null

export function useToast() {
  function showToast(title, text = '') {
    toast.value = { title, text }
    clearTimeout(timer)
    timer = setTimeout(hideToast, 5000)
  }

  function hideToast() {
    toast.value = null
  }

  return { toast, showToast, hideToast }
}
