<template>
    <div class="container mt-4">
        <h3 class="mb-4 fw-bold">📚 Data Buku</h3>
        <button class="btn btn-sm mb-3 btn-primary" @click="showModal">Tambah Buku (Rak)</button>

        <div class="mb-3">
            <input type="text" class="form-control" placeholder="Cari buku rak..." v-model="search"
                @input="fetchinventory" />
        </div>
        <ModalC ref="myModal" modalId="exampleModal" title="Data Rak">
            <template #body>
                <label for="" class="mb-2">Judul</label>
                <select class="form-select mb-3" v-model="inventoryForm.book_id">
                    <option value="">Pilih buku</option>
                    <option v-for="book in books" :key="book.id" :value="book.id">
                        {{ book.title }}
                    </option>
                </select>

                <label for="">Stock</label>
                <InputC type="text" placeholder="masukkan stock" v-model="inventoryForm.stock" />
                <label for="">Lokasi</label>
                <InputC type="text" placeholder="masukkan status mahasiswa" v-model="inventoryForm.location" />
            </template>
            <template #footer>
                <button class="btn btn-secondary" @click="hideModal">Tutup</button>
                <button class="btn btn-primary" @click="submitinventory">Simpan</button>
            </template>
        </ModalC>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-light text-center">
                    <tr>
                        <th>No</th>
                        <th>Judul</th>
                        <th>Stock</th>
                        <th>Lokasi</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="inventory.length === 0">
                        <td colspan="7" class="text-center">Tidak ada data.</td>
                    </tr>
                    <tr v-for="(inventory, index) in inventory" :key="inventory.id" class="text-center">
                        <td>{{ index + 1 }}</td>
                        <td>{{ inventory.title }}</td>
                        <td>{{ inventory.stock }}</td>
                        <td>{{ inventory.location }}</td>
                        <td>
                            <div class="row">
                                <div class="d-flex justify-content-center">
                                    <button class="btn btn-sm btn-info me-2"
                                        @click="editinventory(inventory)">Edit</button>
                                    <button class="btn btn-sm btn-danger"
                                        @click="deleteinventory(inventory.id)">Delete</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: page === 1 }">
                    <button class="page-link" @click="prevPage" :disabled="page === 1">Prev</button>
                </li>
                <li class="page-item disabled">
                    <span class="page-link">Page {{ page }}</span>
                </li>
                <li class="page-item" :class="{ disabled: inventory.length < limit }">
                    <button class="page-link" @click="nextPage" :disabled="inventory.length < limit">Next</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import api from '@/services/api'
import ModalC from '@/components/modal/ModalC.vue'
import InputC from '@/components/modal/InputC.vue'

export default {
    data() {
        return {
            inventory: [],
            search: '',
            page: 1,
            limit: 10,
            inventoryForm: {
                book_id: '',
                location: '',
                stock: '',
            },
            books: [],
            isEdit: false,
            selectedinventoryId: null,
        }
    },
    components: {
        ModalC,
        InputC
    },
    methods: {
        async fetchinventory() {
            try {
                const res = await api.get('inventory', {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        search: this.search
                    }
                })
                this.inventory = res.data.data
            } catch (err) {
                console.error('Gagal fetch buku:', err)
            }
        },
        async fetchBooks() {
            try {
                const res = await api.get('/books') // pastikan endpoint ini mengembalikan list buku
                this.books = res.data.data
            } catch (err) {
                console.error('Gagal mengambil data buku:', err)
            }
        },

        nextPage() {
            this.page++
        },
        prevPage() {
            if (this.page > 1) {
                this.page--
            }
        },
        async deleteinventory(id) {
            try {
                const res = await api.delete(`inventory/${id}`)
                if (res.data.statusCode === 200) {
                    alert('Buku berhasil dihapus')
                    this.fetchinventory()
                }

            } catch (err) {

            }
        },
        showModal() {
            this.$refs.myModal.openModal()
        },
        hideModal() {
            this.$refs.myModal.closeModal()
            this.isEdit = false
            this.selectedinventoryId = null
        },

        async submitinventory() {
            try {
                if (this.isEdit && this.selectedinventoryId) {
                    const res = await api.put(`/inventory/${this.selectedinventoryId}`, this.inventoryForm)
                    if (res.data.statusCode === 200) {
                        alert('Buku berhasil diubah!')
                    }
                } else {
                    const res = await api.post('/inventory', this.inventoryForm)
                    if (res.data.statusCode === 201) {
                        alert('Buku berhasil ditambahkan!')
                    }
                }

                this.fetchinventory()
                this.hideModal()

                this.inventoryForm = {
                    book_id: '',
                    location: '',
                    stock: '',
                }
                this.isEdit = false
                this.selectedinventoryId = null
            } catch (err) {
                alert('Terjadi kesalahan saat menyimpan buku.')
            }
        },

        editinventory(inventory) {
            this.isEdit = true
            this.selectedinventoryId = inventory.id
            this.inventoryForm = {
                book_id: inventory.book_id,
                location: inventory.location,
                stock: inventory.stock,
            }
            this.showModal()
        }
    },
    watch: {
        page() {
            this.fetchinventory()
        },
        search() {
            this.fetchinventory()
        }
    },
    mounted() {
        this.fetchBooks()
        this.fetchinventory()
    }
}
</script>