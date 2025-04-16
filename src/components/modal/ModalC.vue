<template>
    <div class="modal fade" tabindex="-1" :id="modalId" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
    props: {
        modalId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: 'Modal Title',
        },
    },
    setup(props) {
        const modalRef = ref(null)
        let bsModal

        onMounted(() => {
            const bootstrap = window.bootstrap
            if (bootstrap) {
                bsModal = new bootstrap.Modal(modalRef.value)
            }
        })

        const openModal = () => {
            bsModal?.show()
        }

        const closeModal = () => {
            bsModal?.hide()
        }

        return {
            modalRef,
            openModal,
            closeModal,
        }
    },
}
</script>