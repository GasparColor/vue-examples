<template>
    <the-current-section
        :section-view="sectionView"
        class="personalView"
    >

        <div class="personalView__content">
            <div class="personalView__fields">
                <base-form-field
                    v-for="field in currentView.personalFields"
                    :key="field.name"
                    :field-view="field"
                    v-model="personalData[field.name]"
                    class="personalView__field"
                />
            </div>

            <base-form-field-control
                v-model="userAvatar"
                :field-view="currentView.avatarView"
            />

        </div>

        <div class="personalView__buttons">
            <base-action-button
                :disabled="isButtonDisabled"
                :payload="{
                    personalData: personalData,
                    isAvatarChanged: isAvatarChanged,
                    isPersonalDataChanged: isPersonalDataChanged,
                    userAvatar: userAvatar,
                }"
                :actions-map="actions"
                title="Сохранить"
                class="personalView__button"
                type="savePersonalData"
                @succes="makeTheValidatorFieldsDirty"
            />
        </div>

    </the-current-section>
</template>

<script>
import {
    get,
    some,
    mapValues,
} from 'lodash-es'

import * as actions from '@/actions'

import TheCurrentSection from '@/components/TheCurrentSection'
import BaseFormField from '@qr/vue-kit/src/components/BaseFormField'
import BaseFormFieldControl from '@qr/vue-kit/src/components/BaseFormFieldControl'
import BaseActionButton from '@qr/vue-kit/src/components/BaseActionButton'

const personalViewFieldDefaults = {
    labelPosition: 'side',
    labelColor: 'light',
}

export default {
    name: 'Personal',

    // Создать экземплар валидатора, который будет использоваться в текущем
    // представлении и его потомках http://vee-validate.logaretm.com/advanced.html#injection
    $_veeValidate: {
        validator: 'new',
    },

    components: {
        TheCurrentSection,
        BaseFormField,
        BaseFormFieldControl,
        BaseActionButton,
    },

    /**
     * @returns {{sectionView : ISectionView}}
     */
    data() {
        return {
            sectionView: {
                title: 'Личные данные',
                type: 'custom',
            },
            currentView: {
                personalFields: [
                    {
                        ...personalViewFieldDefaults,
                        label: 'Имя',
                        name: 'first_name',
                        typeOfControl: 'string',
                    },
                    {
                        ...personalViewFieldDefaults,
                        label: 'Фамилия',
                        name: 'last_name',
                        typeOfControl: 'string',
                    },
                    {
                        ...personalViewFieldDefaults,
                        label: 'E-mail',
                        name: 'email',
                        typeOfControl: 'string',
                        validator: 'required|email',
                    },
                    {
                        ...personalViewFieldDefaults,
                        label: 'Телефон',
                        name: 'phone_number',
                        typeOfControl: 'phone',
                        validator: 'required|phone',
                    },
                ],
                avatarView: {
                    name: 'userAvatar',
                    typeOfControl: 'imageSelect',
                },
            },
            personalData: {
                first_name: this.$store.state.user.first_name,
                last_name: this.$store.state.user.last_name,
                email: this.$store.state.user.email,
                phone_number: this.$store.state.user.phone_number,
            },
            userAvatar: this.$store.state.user.user_avatar,
        }
    },

    computed: {
        // `mapValues` - хак, чтобы переделать `Module` в `Object`
        actions: () => mapValues(actions, action => action),

        isButtonDisabled() {
            // Кнопка сохранения заблокирована, если есть ошибки валидации,
            // или значение полей форм не менялось.
            return this.errors.any() || (!this.isPersonalDataChanged && !this.isAvatarChanged)
        },

        isPersonalDataChanged() {
            // На момент инициализации компонента, объект `this.fields`, еще не имеет полей,
            // поэтому используем функцию `lodash.get`, c значением по умолчанию `false`
            return some(
                this.currentView.personalFields,
                field => get(this.fields[field.name], 'dirty', false),
            )
        },

        isAvatarChanged() {
            // На момент инициализации компонента, объект `this.fields`, еще не имеет полей,
            // поэтому используем функцию `lodash.get`, c значением по умолчанию `false`
            return get(this.fields[this.currentView.avatarView.name], 'dirty', false)
        },
    },

    methods: {
        makeTheValidatorFieldsDirty() {
            // После фиксации изменений, помечаем все поля формы как "чистые".
            this.$validator.fields.map(field => field.setFlags({ dirty: false }))
        },
    },
}
</script>

<style scoped lang="stylus">
@import "../../node_modules/@qr/vue-kit/src/styles/variables/colors.styl"
@import '../../node_modules/@qr/vue-kit/src/styles/mixins/utils.styl'

.personalView
    max-width 538px

.personalView__content
    display flex
    justify-content space-between
    padding-bottom 20px

.personalView__fields
    width 340px

.personalView__buttons
    display flex
    justify-content flex-end
    flex-wrap wrap
    border-top 1px solid $globalColorMystic

.personalView__button
    margin-top 16px
    &:not(:first-child)
        margin-left 8px

/deep/ .baseFormField__label
    flex-shrink 0
    width 140px
    padding-right 10px
    word-break break-all
</style>
