<template>
    <div class="container mt-4">
        <h3 class="mb-4 fw-bold">📚 Data Buku</h3>
        <button class="btn btn-sm mb-3 btn-primary" @click="showModal">Tambah Buku</button>

        <div class="mb-3">
            <input type="text" class="form-control" placeholder="Cari judul buku..." v-model="search"
                @input="fetchBooks" />
        </div>
        <ModalC ref="myModal" modalId="exampleModal" title="Data Buku">
            <template #body>
                <label for="" class="mb-2">Buku</label>
                <InputC type="text" placeholder="masukkan nama buku" v-model="bookForm.title" />
                <label for="">Penulis</label>
                <InputC type="text" placeholder="masukkan nama penulis" v-model="bookForm.author" />
                <label for="">Penerbit</label>
                <InputC type="text" placeholder="masukkan nama penerbit" v-model="bookForm.publisher" />
                <label for="">Tahun terbit</label>
                <InputC type="text" placeholder="masukkan tahun terbit" v-model="bookForm.year" />
                <label for="">ISBN</label>
                <InputC type="text" placeholder="masukkan nomor isbn" v-model="bookForm.isbn" />
            </template>
            <template #footer>
                <button class="btn btn-secondary" @click="hideModal">Tutup</button>
                <button class="btn btn-primary" @click="submitBook">Simpan</button>
            </template>
        </ModalC>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-light text-center">
                    <tr>
                        <th>No</th>
                        <th>Judul</th>
                        <th>Penulis</th>
                        <th>Penerbit</th>
                        <th>Tahun</th>
                        <th>ISBN</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="books.length === 0">
                        <td colspan="7" class="text-center">Tidak ada data.</td>
                    </tr>
                    <tr v-for="(book, index) in books" :key="book.id" class="text-center">
                        <td>{{ index + 1 }}</td>
                        <td>{{ book.title }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ book.publisher }}</td>
                        <td>{{ book.year }}</td>
                        <td>{{ book.isbn }}</td>
                        <td>
                            <div class="row">
                                <div class="d-flex justify-content-center">
                                    <button class="btn btn-sm btn-info me-2" @click="editBook(book)">Edit</button>
                                    <button class="btn btn-sm btn-danger" @click="deleteBook(book.id)">Delete</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-outline-secondary" :disabled="page === 1" @click="prevPage">Sebelumnya</button>
            <span>Halaman {{ page }} dari {{ Math.ceil(total / limit) }}</span>
            <button class="btn btn-outline-secondary" :disabled="page >= Math.ceil(total / limit)"
                @click="nextPage">Berikutnya</button>
        </div>
    </div>
</template>

<script>
import api from '@/services/api'
import ModalC from '@/components/modal/ModalC.vue'
import InputC from '@/components/modal/InputC.vue'

export default {
    data() {
        return {
            books: [],
            search: '',
            page: 1,
            limit: 10,
            total: 0,
            bookForm: {
                title: '',
                author: '',
                publisher: '',
                year: '',
                isbn: ''
            },
            isEdit: false,
            selectedBookId: null,
        }
    },
    components: {
        ModalC,
        InputC
    },
    methods: {
        async fetchBooks() {
            try {
                const res = await api.get('books', {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        search: this.search
                    }
                })
                this.total = res.data.total
                this.books = res.data.data
            } catch (err) {
                console.error('Gagal fetch buku:', err)
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
        async deleteBook(id) {
            try {
                const res = await api.delete(`books/${id}`)
                if (res.data.statusCode === 200) {
                    alert('Buku berhasil dihapus')
                    this.fetchBooks()
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
            this.selectedBookId = null
        },

        async submitBook() {
            try {
                if (this.isEdit && this.selectedBookId) {
                    const res = await api.put(`/books/${this.selectedBookId}`, this.bookForm)
                    if (res.data.statusCode === 200) {
                        alert('Buku berhasil diubah!')
                    }
                } else {
                    const res = await api.post('/books', this.bookForm)
                    if (res.data.statusCode === 201) {
                        alert('Buku berhasil ditambahkan!')
                    }
                }

                this.fetchBooks()
                this.hideModal()

                this.bookForm = {
                    title: '',
                    author: '',
                    publisher: '',
                    year: '',
                    isbn: ''
                }
                this.isEdit = false
                this.selectedBookId = null
            } catch (err) {
                alert('Terjadi kesalahan saat menyimpan buku.')
            }
        },

        editBook(book) {
            this.isEdit = true
            this.selectedBookId = book.id
            this.bookForm = {
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                year: book.year,
                isbn: book.isbn
            }
            this.showModal()
        }
    },
    watch: {
        page() {
            this.fetchBooks()
        },
        search() {
            this.page = 1;
            this.fetchBooks()
        }
    },
    mounted() {
        this.fetchBooks()
    }
}
</script>