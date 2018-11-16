<template>
    <div class="baseInputPassword">
        <base-input
            :type="passwordInputType"
            :placeholder="$props.placeholder"
            :disabled="$props.disabled"
            v-model="valueModel"
            class="baseInputPassword__input"
        />

        <button
            :disabled="$props.disabled"
            class="baseInputPassword__changePasswordVisibilityBtn"
            type="button"
            tabindex="-1"
            @click="showPassword = !showPassword"
        >
            <component
                :is="passwordIconName"
                class="baseInputPassword__icon"
            />
        </button>

    </div>

</template>

<script>

import BaseInput from './BaseInput'
import PasswordHide from '../assets/icons/password-hide.svg'
import PasswordShow from '../assets/icons/password-show.svg'

export default {
    name: 'BaseInputPassword',

    components: {
        BaseInput,
        PasswordHide,
        PasswordShow,
    },

    props: {
        value: {
            type: String,
            required: false,
            default: '',
        },

        placeholder: {
            type: String,
            required: false,
            default: '',
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return ({
            showPassword: false,
        })
    },

    computed: {
        valueModel: {
            get() {
                return this.$props.value
            },
            set(newVal) {
                this.$emit('input', newVal)
            },
        },
        passwordIconName() {
            return this.showPassword ? 'PasswordShow' : 'PasswordHide'
        },
        passwordInputType() {
            return this.showPassword ? 'text' : 'password'
        },
    },

}
</script>

<style lang="stylus">
@import '../styles/mixins/controlsInputs.styl'
@import '../styles/variables/controlsInputs.styl'

.baseInputPassword
    position relative
    width 100%

    // У инпута ввода пароля делаем паддинг справа, равный размеру кнопки "показать/скрыть пароль"
    .baseInputPassword__input
        padding-right $baseInputHeight

&.--invalid:not(.--disabled)
    /deep/ .baseInput
        @extends $baseInputContainerInvalid

.baseInputPassword__changePasswordVisibilityBtn
    position absolute
    display flex
    align-items center
    top 0
    right 0
    height $baseInputHeight
    width @height
    border none
    background-color transparent
    cursor pointer

    &:disabled
        cursor auto

.baseInputPassword__icon
    margin-top 2px

</style>
