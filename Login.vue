<template>

    <div class="loginFormWrapper">

        <vue-headful
            title="Авторизация в системе | Quick Resto Delivery"
        />

        <form class="loginForm">
            <div
                class="loginForm__logo"
                aria-label="Delivery logo"
            >
                <qr-logo class="loginForm__qrLogo"/>
                <delivery-logo class="loginForm__deliveryLogo"/>
            </div>

            <div
                v-if="wereLastCredentialsWrong"
                class="loginForm__error"
            >
                <info-icon/>
                <p
                    class="loginForm__errorText"
                    v-text="'Неверный пароль или логин. Повторите попытку снова.'"
                />

            </div>

            <base-form-field
                :field-view="fieldView.login"
                v-model="username"
            />

            <base-form-field
                :field-view="fieldView.password"
                v-model="password"
            />

            <base-button
                :disabled="isSubmitButtonDisabled"
                class="loginForm__button"
                type="submit"
                @click="logIn"
                v-text="'Войти'"
            />

        </form>

        <!-- TODO. Добавить что должно происходить по клику на loginForm__link -->
        <!-- См. http://jira.quickresto.org/browse/DEL-27 -->
        <!--<a-->
        <!--class="loginForm__link"-->
        <!--href="#"-->
        <!--v-text="'Проблемы со входом?'"-->
        <!--/>-->

    </div>


</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import VueHeadful from 'vue-headful'

import {
    AUTH_LOGIN,
} from '@/store/modules/auth/action-types'

import {
    isAxiosAuthenticateError,
} from '@/utils'


// @ts-ignore
import BaseButton from '@qr/vue-kit/src/components/BaseButton'
// @ts-ignore
import BaseFormField from '@qr/vue-kit/src/components/BaseFormField'
import InfoIcon from '@qr/vue-kit/src/assets/icons//info.svg'
import QrLogo from '@qr/vue-kit/src/assets/icons/logo.svg'
import DeliveryLogo from '@/assets/icons/logo-delivery.svg'

interface IComponentData {
    username: string
    password: string
    wereLastCredentialsWrong: boolean
}


export default Vue.extend({

    name: 'Login',

    components: {
        BaseFormField,
        BaseButton,
        DeliveryLogo,
        InfoIcon,
        QrLogo,
        VueHeadful,
    },

    data() {
        return ({
            wereLastCredentialsWrong: false,
            username: '',
            password: '',
            fieldView: {
                login: {
                    name: 'login',
                    placeholder: 'Логин',
                    typeOfControl: 'string',
                    label: 'Логин',
                    labelPosition: 'none',
                },
                password: {
                    name: 'password',
                    placeholder: 'Пароль',
                    typeOfControl: 'password',
                    label: 'Пароль',
                    labelPosition: 'none',
                },
            },
        } as IComponentData)
    },

    computed: {
        isSubmitButtonDisabled(): boolean {
            return !this.username || !this.password
        },
    },

    methods: {
        async logIn() {
            this.wereLastCredentialsWrong = false

            try {
                await this.$store.dispatch(
                    AUTH_LOGIN,
                    {
                        username: this.username,
                        password: this.password,
                    },
                )
                this.$router.push('/')
            }
            catch (error) {
                if (
                    isAxiosAuthenticateError(error) ||
                    // TODO Временное (?) решение для обработки не-Latin1 символов в `auth`-полях
                    // http://jira.quickresto.org/browse/DEL-14
                    error.name === 'InvalidCharacterError'
                ) {
                    this.wereLastCredentialsWrong = true
                }
                else {
                    throw error
                }
            }
        },
    },

})

</script>

<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import "../../node_modules/@qr/vue-kit/src/styles/variables/colors.styl"
@import "../../node_modules/@qr/vue-kit/src/styles/mixins/utils.styl"

$formFieldHeight = 40px
$formFieldMargin = 15px


.loginFormWrapper
    position absolute
    top 31%
    left 50%
    width 332px
    height auto
    transform translateX(-50%)


.loginForm
    display flex
    flex-direction column
    padding 28px 36px 36px
    background-color $globalColorWhite
    border-radius 10px
    box-shadow 0 16px 24px 0 rgba(0, 0, 0, 0.15)


.loginForm__logo
    margin 0 auto 8px
    svgContainer()
    flex-direction column


.loginForm__qrLogo
    width 48px
    height @width
    margin-bottom 12px


.loginForm__error
    display flex
    align-items center
    margin-top 17px
    padding 13px 16px
    background-color $globalColorCrimson
    border-radius 4px

    svg
        flex 0 0 auto
        margin-right 10px
        fill $globalColorWhite


.loginForm__errorText
    font-size 12px
    line-height 14px
    color $globalColorWhite


.loginForm__button
    display block
    margin-top $formFieldMargin
    height $formFieldHeight
    font-size 15px
    line-height 18px
    letter-spacing 0.04em

    // Переопределим стандартные свойства кнопки
    font-weight 500
    color $globalColorWhite
    background-color $globalColorCaribbeanGreenAlmost

    &:disabled
        color $globalColorLoblolly
        background-color $globalColorCatskillWhite

    &:hover:not(:disabled),
    &:focus:not(:disabled)
        background-color $globalColorCaribbeanGreenHover


.loginForm__link
    margin 21px auto 0
    text-align center
    font-size 13px
    line-height 15px
    color $globalColorPerano
    text-decoration none


// Переопределим свойства baseFormField'a
/deep/ .baseInput
    height $formFieldHeight
    padding 12px 8px

/deep/ .baseInputPassword__changePasswordVisibilityBtn
    height $formFieldHeight
    width @height
</style>
