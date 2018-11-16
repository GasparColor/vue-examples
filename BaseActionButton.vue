<template>
    <base-button
        :color-type="$props.colorType"
        :disabled="$props.disabled"
        :text="$props.title"
        @click="executeAction()"
    />
</template>

<script>
import BaseButton from './BaseButton'


export default {
    name: 'BaseActionButton',

    components: {
        BaseButton,
    },

    props: {

        // Набор экшнов, из которых происходит выполнение
        actionsMap: {
            type: Object,
            required: true,
        },

        // Тип экшна
        type: {
            type: String,
            required: true,
        },

        // Текст кнопки
        title: {
            type: String,
            required: true,
        },

        // Цвет кнопки с экшном
        colorType: {
            type: String,
            required: false,
            default: '',
        },

        // Состояние заблокированности
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },

        // Данные для выполнения экшна
        payload: {
            type: Object,
            required: false,
            default: () => {},
        },

    },

    methods: {
        async executeAction() {
            const actionType = this.$props.type

            /* eslint-disable import/namespace */
            if (this.$props.actionsMap[actionType]) {
                const result = await this.$props.actionsMap[actionType](this.$props.payload)

                // В первую очередь эмитим для родителя, а только потом для остальной системы
                if (result.type === 'DISMISS') {
                    this.$emit('dismiss', result.payload)
                    this.$_eventBus.$emit(`dismiss/${actionType}`)
                }
                if (result.type === 'SUCCESS') {
                    this.$emit('success', result.payload)
                    this.$_eventBus.$emit(`success/${actionType}`)
                }
                if (result.type === 'ERROR') {
                    this.$emit('error', result.payload)
                    this.$_eventBus.$emit(`error/${actionType}`)
                }
            }
            else {
                throw new Error(`Unknown action type '${actionType}'`)
            }
            /* eslint-enable import/namespace */
        },
    },
}
</script>
