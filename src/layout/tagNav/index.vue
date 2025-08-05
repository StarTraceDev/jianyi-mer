<!--
 * @Description: 标签导航
 * @Author: StarTraceDev
 * @Date: 2025-08-05 15:57:34
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-05 16:04:43
-->
<template>
  <div>
    <div class="flex gap-2">
      <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
      <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + New Tag
      </el-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
// import { ref, reactive } from 'vue'
import { nextTick, ref } from 'vue'

import type { InputInstance } from 'element-plus'

const inputValue = ref('')
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

defineOptions({ name: 'TagNav' })
</script>

<style lang='scss' scoped></style>
