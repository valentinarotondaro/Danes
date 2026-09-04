<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label }]
  rows: { type: Array, required: true },
  rowKey: { type: String, default: '$id' },
})
defineEmits(['edit', 'delete'])
</script>

<template>
  <table class="w-full border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-neutral-200 text-neutral-500">
        <th v-for="col in columns" :key="col.key" class="py-2 pr-4 font-medium">{{ col.label }}</th>
        <th class="py-2 pr-4 font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row[rowKey]" class="border-b border-neutral-100">
        <td v-for="col in columns" :key="col.key" class="py-3 pr-4 text-neutral-900">
          {{ row[col.key] }}
        </td>
        <td class="py-3 pr-4">
          <button @click="$emit('edit', row)" class="text-[#C8102E] hover:underline">Edit</button>
          <button @click="$emit('delete', row)" class="ml-3 text-neutral-400 hover:text-red-600">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
