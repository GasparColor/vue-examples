<template>
    <div> <!-- обертка нужна, чтобы высота блока была равна высоте содержимого -->
        <div class="baseOrderItems">


            <div
                :class="{ '--editable' : !$props.readonly }"
                class="baseOrderItems__content"
            >

                <div
                    :class="{ '--emptyOrder': isEmptyOrder }"
                    class="baseOrderItems__sectionHeader --topLevelHeading"
                >
                    <h3
                        class="baseOrderItems__sectionHeaderTitle"
                        v-text="'Состав заказа'"
                    />

                    <!-- TODO
                     <h3
                        class="baseOrderItems__sectionHeaderTitle"
                        v-text="'Новый заказ'"
                    />

                    <div
                        v-if="!$props.offerObject.dishItems"
                        class="baseOrderItems__client"
                    >
                        <p class="baseOrderItems__clientStatus">Новый клиент</p>
                        <p class="baseOrderItems__clientBonus">0 бонусов</p>
                    </div> -->

                </div>



                <div
                    v-if="!isEmptyOrder"
                    class="baseOrderItems__orderList"
                >
                    <!-- Состав заказа -->
                    <div
                        v-for="(dish, index) in $props.offerObject.dishItems"
                        :key="index"
                        :class="{
                            '--hasInnerRow': (dish.modifiers && dish.modifiers.length > 0)
                        }"
                        class="baseOrderItems__row"
                    >
                        <div
                            class="baseOrderItems__rowInner"
                        >
                            <div
                                class="baseOrderItems__col --title"
                                v-text="dish.name"
                            />
                            <div class="baseOrderItems__col --quantity">

                                <base-input-number
                                    :value="dish.quantity"
                                    :disabled="$props.readonly"
                                    :show-spinners="!$props.readonly"
                                />

                            </div>

                            <base-static-number
                                :value="dish.price"
                                class="baseOrderItems__col --value"
                            />

                            <div
                                v-if="!$props.readonly"
                                class="baseOrderItems__col --remove"
                                @click="removeItem(dish.name)"
                            >
                                <close-icon/>
                            </div>
                        </div>

                        <div
                            v-for="(modifier, index) in dish.modifiers"
                            v-if="modifier.quantity > 0"
                            :key="index"
                            class="baseOrderItems__row --inner"
                        >

                            <div
                                class="baseOrderItems__col --title"
                                v-text="modifier.name"
                            />
                            <div class="baseOrderItems__col --quantity">
                                <base-input-number
                                    :value="modifier.quantity"
                                    :disabled="$props.readonly"
                                    :show-spinners="!$props.readonly"
                                />
                            </div>
                            <base-static-number
                                :value="modifier.price"
                                class="baseOrderItems__col --value"
                            />
                            <div
                                v-if="!$props.readonly"
                                class="baseOrderItems__col --remove"
                                @click="removeItem(modifier.name)"
                            >
                                <close-icon/>
                            </div>
                        </div>

                    </div>
                    <!-- /Состав заказа -->

                    <!-- Скидки -->
                    <div
                        v-if="$props.offerObject.discounts.length > 0"
                        class="baseOrderItems__discounts"
                    >
                        <div class="baseOrderItems__sectionHeader">
                            <h3
                                class="baseOrderItems__sectionHeaderTitle"
                                v-text="'Скидки'"
                            />
                        </div>

                        <div
                            v-for="(discount, index) in $props.offerObject.discounts"
                            :key="index"
                            class="baseOrderItems__row"
                        >
                            <div
                                class="baseOrderItems__rowInner --discounts"
                            >
                                <div class="baseOrderItems__col --svgContainer">
                                    <arrow-left-icon/>
                                </div>
                                <div
                                    class="baseOrderItems__col --title"
                                    v-text="discount.name"
                                />

                                <base-static-number
                                    :value="discount.value"
                                    :postfix="discount.valueType === 'percentage' ? '%' : ''"
                                    :fraction-count="(discount.valueType === 'percentage'
                                        ? 0
                                        : 2
                                    )"
                                    class="baseOrderItems__col --value"
                                />

                                <div
                                    v-if="!$props.readonly"
                                    class="baseOrderItems__col --remove"
                                    @click="removeItem(discount.name)"
                                >
                                    <close-icon/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- /Скидки -->


                    <!-- Надбавки -->
                    <div
                        v-if="$props.offerObject.markups.length > 0"
                        class="baseOrderItems__markups"
                    >
                        <div class="baseOrderItems__sectionHeader">
                            <h3
                                class="baseOrderItems__sectionHeaderTitle"
                                v-text="'Надбавки'"
                            />
                        </div>

                        <div
                            v-for="(markups, index) in $props.offerObject.markups"
                            :key="index"
                            class="baseOrderItems__row "
                        >
                            <div
                                class="baseOrderItems__rowInner --markups"
                            >
                                <div class="baseOrderItems__col --svgContainer">
                                    <arrow-left-icon/>
                                </div>
                                <div
                                    class="baseOrderItems__col --title"
                                    v-text="markups.name"
                                />

                                <base-static-number
                                    :value="markups.value"
                                    :postfix="markups.valueType === 'percentage' ? '%' : ''"
                                    :fraction-count="markups.valueType === 'percentage' ? 0 : 2"
                                    class="baseOrderItems__col --value"
                                />
                            </div>

                        </div>
                    </div>
                    <!-- /Надбавки -->

                </div>
                <div
                    v-else
                    class="baseOrderItems__emptyOrder"
                >
                    <pizza-icon/>
                    <p class="baseOrderItems__emptyOrderText">
                        В заказе нет блюд. Добавьте блюда из меню доставки
                    </p>
                </div>

                <!-- Summary -->
                <dl class="baseOrderItems__summary">

                    <div class="baseOrderItems__summaryItemWrapper --totalSum">
                        <dt
                            class="baseOrderItems__summaryItemName"
                            v-text="'Итого'"
                        />

                        <dd
                            class="baseOrderItems__summaryItemValue"
                        >
                            <base-static-number
                                :value="$props.offerObject.totalSum"
                            />
                        </dd>
                    </div>

                    <div class="baseOrderItems__summaryItemWrapper">
                        <dt
                            class="baseOrderItems__summaryItemName"
                            v-text="'Сумма'"
                        />

                        <dd
                            class="baseOrderItems__summaryItemValue"
                        >
                            <base-static-number
                                :value="$props.offerObject.nomenclatureItemsSum"
                            />
                        </dd>
                    </div>

                    <div class="baseOrderItems__summaryItemWrapper">
                        <dt
                            class="baseOrderItems__summaryItemName"
                            v-text="'Скидки'"
                        />

                        <dd
                            class="baseOrderItems__summaryItemValue"
                        >
                            <base-static-number
                                :value="$props.offerObject.discountsSum"
                            />
                        </dd>
                    </div>

                    <div class="baseOrderItems__summaryItemWrapper">
                        <dt
                            class="baseOrderItems__summaryItemName"
                            v-text="'Надбавки'"
                        />

                        <dd
                            class="baseOrderItems__summaryItemValue"
                        >
                            <base-static-number
                                :value="$props.offerObject.markupsSum"
                            />
                        </dd>
                    </div>

                    <!-- типы оплат -->
                    <div
                        v-if="$props.offerObject.paymentTypes"
                        class="baseOrderItems__summaryPaymentTypes"
                    >
                        <div
                            v-for="(payment, index) in $props.offerObject.paymentTypes"
                            :key="index"
                            class="baseOrderItems__summaryItemWrapper"
                        >
                            <dt
                                class="baseOrderItems__summaryItemName"
                                v-text="payment.name"
                            />

                            <dd
                                class="baseOrderItems__summaryItemValue"
                            >
                                <base-static-number
                                    :value="payment.value"
                                />
                            </dd>
                        </div>
                    </div>
                    <!-- /типы оплат -->

                </dl>
                <!-- /Summary -->

            </div>

            <div
                v-if="!$props.readonly"
                class="baseOrderItems__footer"
            >
                <base-button
                    class="baseOrderItems__footerBtn"
                    @click="cancelOrder"
                    v-text="'Отменить'"
                />

                <base-button
                    :disabled="isEmptyOrder"
                    class="baseOrderItems__footerBtn --create"
                    @click="createOrder"
                    v-text="'Создать заказ'"
                />

            </div>

        </div>
    </div>

</template>

<script lang="ts">

import Vue from 'vue'

// Components

// @ts-ignore
import BaseInputNumber from '@qr/vue-kit/src/components/BaseInputNumber'
// @ts-ignore
import BaseStaticNumber from '@qr/vue-kit/src/components/BaseStaticNumber'
// @ts-ignore
import BaseButton from '@qr/vue-kit/src/components/BaseButton'

// Types
import IOrder from '../api/definitions/entity/IOrder'

// Icons

import ArrowLeftIcon from '../assets/icons/arrow-left.svg'
import CloseIcon from '@qr/vue-kit/src/assets/icons/close.svg'
import PizzaIcon from '../assets/icons/pizza.svg'


export default Vue.extend({
    name: 'BaseOrderItems',

    components: {
        ArrowLeftIcon,
        BaseButton,
        BaseInputNumber,
        BaseStaticNumber,
        CloseIcon,
        PizzaIcon,
    },

    props: {
        readonly: {
            type: Boolean,
            required: true,
        },
        offerObject: {
            type: Object as () => IOrder,
            required: true,
        },
    },

    computed: {
        isEmptyOrder() : boolean {
            return !(
                this.$props.offerObject.dishItems &&
                this.$props.offerObject.dishItems.length > 0
            )
        },
    },

    methods: {

        // todo
        removeItem() : void {
            // alert('Remove')
        },
        cancelOrder() : void {
            // alert('Cancel')
        },
        createOrder() : void {
            // alert('Create')
        },
    },
})

</script>


<style scoped lang="stylus">
@import '../../node_modules/@qr/vue-kit/src/styles/variables/colors.styl'
@import '../../node_modules/@qr/vue-kit/src/styles/mixins/utils.styl'
@import '../styles/variables/colors.styl'
@import '../styles/variables/sizes.styl'

$boldFontWeight = 400
$contentIndentValue = 32px
$separatorWidth = 'calc(100% - 2 * %s)' % $contentIndentValue

// Данные сепараторы появляются только в режиме редактирования
hoverSeparator()
    &::after
        position absolute
        content ''
        width $separatorWidth
        height 1px
        background-color $globalColorWhite
        bottom -1px
        z-index 99


addItemsSeparator(side)
    position relative
    &::before
        position absolute
        content ''
        width $separatorWidth
        height 1px
        {side} 0
        background-color $globalColorMystic


.baseOrderItems
    display flex
    flex-direction column
    border-radius $topLevelBlock__borderRadius
    background-color $topLevelBlock__bgColor
    overflow auto
    max-height 100%


.baseOrderItems__sectionHeader
    display flex
    align-items center
    margin 0 $contentIndentValue
    border-bottom 1px solid $globalColorGeyser
    padding 35px 0 30px

    &.--emptyOrder
        padding 22px 0 20px


.baseOrderItems__sectionHeaderTitle
    font-size 16px
    line-height 19px
    color $app__textColor
    font-weight $boldFontWeight


// этим селектором растягиваем сепаратор под заголовком верхнего уровня
.baseOrderItems__sectionHeader.--topLevelHeading + .baseOrderItems__orderList
    .baseOrderItems__row:first-child .baseOrderItems__rowInner::before
        width 100%
        left 0


.baseOrderItems__emptyOrder
    display flex
    flex-direction column
    justify-content center
    align-items center
    align-content center
    min-height 450px

    svg
        fill $globalColorGullGray


.baseOrderItems__emptyOrderText
    margin-top 25px
    width 230px
    text-align center
    font-size 13px
    line-height 19px
    color $globalColorGullGray


.baseOrderItems__content
    display flex
    flex-direction column
    flex-shrink 0

    &.--editable
        padding 0

        .baseOrderItems__sectionHeaderTitle
            padding-left 30px

        .baseOrderItems__sectionHeader:not(.--emptyOrder)
            border-bottom none

        .baseOrderItems__sectionHeader,
        .baseOrderItems__row
            margin 0

            &.--inner
                padding 2px $contentIndentValue
                position relative

                &:hover
                    background-color $globalColorCatskillWhite
                    &:last-child
                        &::before
                            background-color $globalColorCatskillWhite

                &:last-child
                    addItemsSeparator('bottom')

                    &::before
                        display none

                    &:hover
                        hoverSeparator()

            &:not(.--hasInnerRow):hover
                .baseOrderItems__col.--remove
                    position absolute
                    right 0
                    display block

        .baseOrderItems__rowInner
            padding 0 $contentIndentValue
            addItemsSeparator('top')

        .baseOrderItems__rowInner:hover
            position relative
            background-color $globalColorCatskillWhite

            &:not(.--markups)
                hoverSeparator()

            &:not(.--markups)::before
                display none

        .baseOrderItems__markups
            .baseOrderItems__rowInner
                addItemsSeparator('top')
                &:hover
                    background-color transparent

        .baseOrderItems__row
            border none
            position relative
            &:last-child
                addItemsSeparator('bottom')

        .baseOrderItems__markups,
        .baseOrderItems__discounts
            .baseOrderItems__sectionHeader
                margin 0 $contentIndentValue

            .baseOrderItems__sectionHeaderTitle
                padding-left 0


.baseOrderItems__row
    display flex
    align-items center
    flex-direction column
    margin 0 $contentIndentValue
    font-size 13px
    line-height 18px
    color $app__textColor
    border-bottom 1px solid $globalColorMystic

    &.--hasInnerRow .baseOrderItems__rowInner
        min-height 32px

        &:hover
            .baseOrderItems__col.--remove
                position absolute
                right 0
                display block

    &.--inner
        flex-direction row
        border-bottom none
        margin 0
        width 100%

        .baseOrderItems__col
            padding 0
            font-size 12px
            line-height 18px

            &:not(.--quantity)
                color $globalColorSlateGray

            &.--remove
                padding 0 10px !important

        &:hover
            .baseOrderItems__col.--quantity
                & /deep/ .baseInputNumber__button
                    display flex

        &:last-child
            padding-bottom 5px


.baseOrderItems__rowInner
    flex-direction row
    display flex
    align-items center
    width 100%

    &:hover
        & .baseOrderItems__col.--quantity
            & /deep/ .baseInputNumber__button
                display flex


.baseOrderItems__col
    padding 8px 0 8px

    &.--svgContainer
        svgContainer()
        margin-right 10px
        padding 0
        width 16px
        height @width
        border-radius 50%

        & svg
            width 8px
            height @width
            fill $globalColorWhite

    &.--title
        width 180px
        padding-right 25px

    &.--quantity
        width 80px
        text-align center

    &.--value
        margin-left auto
        font-size 13px
        line-height 18px

    &.--remove
        display none
        padding 0 10px
        svg
            width 10px
            height @width
            fill $globalColorLoblolly
            &:hover
                cursor pointer
                fill $globalColorBittersweetAlmost


.baseOrderItems__discounts
    .baseOrderItems__sectionHeader
        padding-top 25px
        padding-bottom 13px

    .baseOrderItems__row
        border none !important
        &:last-of-type
            border-bottom 1px solid $globalColorMystic

    .baseOrderItems__col.--svgContainer
        background-color $globalColorCerulean

        & svg
            transform rotate(-90deg)


.baseOrderItems__markups
    .baseOrderItems__sectionHeader
        padding-top 16px
        padding-bottom 12px

        .baseOrderItems__sectionHeaderTitle
            font-size 13px
            line-height 15px

    .baseOrderItems__row
        border none !important
        &:last-of-type
            border-bottom 1px solid $globalColorMystic

    .baseOrderItems__col.--svgContainer
        background-color $globalColorBittersweetAlmost

        & svg
            transform rotate(90deg)


.baseOrderItems__summary
    display flex
    flex-direction column
    padding 24px $contentIndentValue 24px


.baseOrderItems__summary,
.baseOrderItems__summaryItemValue .baseStaticNumber
    font-size 13px
    line-height 15px
    color $app__textColor


.baseOrderItems__summaryItemWrapper
    display flex
    flex-direction row
    justify-content space-between
    padding 5px 0

    &.--totalSum,
    &.--totalSum .baseStaticNumber
        font-size 20px
        line-height 24px
        font-weight $boldFontWeight


.baseOrderItems__summaryItemName
    position relative

    &::after
        position absolute
        right -4px
        content ':'


.baseOrderItems__summaryPaymentTypes
    margin-top 11px
    padding-top 11px
    font-size 12px
    line-height 14px
    color $globalColorSlateGray
    border-top 1px solid $globalColorMystic

    .baseOrderItems__summaryItemValue .baseStaticNumber
        padding 0
        color $globalColorSlateGray


.baseOrderItems__footer
    display flex
    flex-shrink 0
    margin-top auto
    justify-content space-between
    padding 0 $contentIndentValue 20px


.baseOrderItems__footerBtn
    display block
    padding 10px
    font-size 15px
    font-weight $boldFontWeight
    line-height 18px
    height auto
    min-width 150px

    &.--create
        color $globalColorWhite
        background-color $globalColorCaribbeanGreenAlmost

        &:hover:not(:disabled)
            background-color $globalColorCaribbeanGreenHover

    &:disabled
        color $globalColorLoblolly
        background-color $globalColorCatskillWhite


// Меняем стили `baseInputNumber` в соответствии с макетом
/deep/ .baseInputNumber
    width 70px
    height 28px
    min-height @height
    background-color transparent
    border-color transparent

    .baseInputNumber__button
        display none
        flex-basis 16px

    &:hover,
    &.--active
        .baseInputNumber__button
            display flex

    &.--wo-spinners
        border none
        background none
        pointer-events none

        .baseInputNumber__button
            display none

        .baseInputNumber__input
            text-align center
            &:disabled
                color $app__textColor


//todo
/*.baseOrderItems__client
    display flex
    flex-direction column
    padding-right 34px
    margin-left auto
    text-align right


.baseOrderItems__clientStatus
    font-size 13px
    line-height 15px
    color $globalColorNileBlue


.baseOrderItems__clientBonus
    font-size 12px
    line-height 14px
    color $globalColorSlateGray*/

</style>
