<template>
    <div class="baseImageSelect">
        <div
            v-if="imageUrl"
            :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
            class="baseImageSelect__image"
        />
        <default-account-img
            v-else
            class="baseImageSelect__image --default"
        />
        <base-input-file
            :disabled="$props.disabled"
            class="baseImageSelect__inputFile"
            @input="onImageSelected"
        />
    </div>
</template>

<script>
import DefaultAccountImg from '../assets/icons/account.svg'
import BaseInputFile from './BaseInputFile'
import BaseModalError from './BaseModalError'

const selectErrorText = 'Выбранное изображение должно быть в формате JPG или PNG и не должно превышать 5 МБ'

export default {
    name: 'BaseImageSelect',

    components: {
        BaseInputFile,
        DefaultAccountImg,
    },

    props: {
        value: {
            type: [String, File],
            required: false,
            default: null,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data: () => ({
        selectedImageDataUrl: null,
    }),

    computed: {
        valueModel: {
            get() {
                return this.$props.value
            },
            set(newVal) {
                this.$emit('input', newVal)
            },
        },
        imageUrl() {
            return this.selectedImageDataUrl || this.valueModel
        },
    },

    watch: {
        valueModel: {
            immediate: true,
            handler(newValue) {
                if (newValue instanceof File) {
                    const reader = new FileReader()
                    reader.onload = (evt) => {
                        this.selectedImageDataUrl = evt.target.result
                    }
                    reader.readAsDataURL(newValue)
                }
            },
        },
    },

    methods: {
        onImageSelected(selectedFile) {
            if (
                selectedFile &&
                selectedFile.size < 5000000 &&
                selectedFile.type.includes('image')
            ) {
                this.valueModel = selectedFile
            }
            else {
                this.$qrKitOpenModal(
                    BaseModalError,
                    {
                        mainErrorText: selectErrorText,
                    },
                )
            }
        },
    },
}

</script>

<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import '../styles/mixins/utils.styl'

.baseImageSelect
    display flex
    flex-direction column

.baseImageSelect__image
    width 66px
    height @width
    userAvatarBgImageStyles()

    &.--default
        padding 25px

.baseImageSelect__inputFile
    margin-top 7px
</style>
