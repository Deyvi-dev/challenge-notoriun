import { type VariantProps, cva } from 'class-variance-authority'
import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = defineComponent({
  name: 'Label',
  props: {
    class: { type: String as PropType<string>, required: false },
    for: { type: String as PropType<string>, required: false },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'label',
        {
          class: cn(labelVariants(), props.class),
          for: props.for,
        },
        slots.default?.()
      )
  },
})

export { Label, labelVariants }
export type LabelVariants = VariantProps<typeof labelVariants>
