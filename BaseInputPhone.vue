<template>
    <input
        ref="input"
        v-model="valueModel"
        :disabled="$props.disabled"
        class="baseInputPhone"
    >

</template>

<script>
export default {

    name: 'BaseInputPhone',

    props: {
        value: {
            type: String,
            required: false,
            default: null,
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        valueModel: {
            get() {
                const phoneNumber = this.$props.value

                if (phoneNumber !== null) {
                    // Форматируем введенный номер используя фильтр
                    return this.$options.filters.formatPhone(phoneNumber) || phoneNumber
                }
                return '+'

            },
            set(newVal) {
                let valueToEmit = newVal

                if (newVal !== '') {

                    // Переписать значение в инпуте, т.к.
                    // если эмитим невалидное, обратно в пропах не вернется,
                    // и через форматирование в геттере не пройдет
                    this.$refs.input.value = this.$options.filters.formatPhone(newVal)

                    // Эмитим неформатированный и только цифры
                    valueToEmit = newVal.replace(/[^\d]+/g, '')
                }

                this.$emit('input', valueToEmit)
            },
        },
    },
}
</script>


<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import '../styles/variables/controlsInputs.styl'
@import '../styles/mixins/controlsInputs.styl'

.baseInputPhone
    @extends $baseInputContainer
    @extends $baseInput

    &:disabled
        @extends $baseInputDisabled

    &:focus
        @extends $baseInputContainerActive

    &:hover:not(:disabled):not(:focus)
        @extends $baseInputContainerHover

    &.--invalid:not(:disabled)
        @extends $baseInputContainerInvalid


</style>
