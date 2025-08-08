/*
 * @Description: 响应式窗口尺寸
 * @Author: StarTraceDev
 * @Date: 2025-08-08 15:27:16
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-08-08 15:38:30
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowResize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateDimensions = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateDimensions);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions);
  });

  return { width, height };
}
