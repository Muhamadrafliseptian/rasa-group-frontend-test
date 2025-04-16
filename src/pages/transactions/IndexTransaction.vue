<template>
    <div class="container mt-4">

        <div class="mb-4">
            <h3 class="mb-4 fw-bold">🔁 Form Peminjaman Buku</h3>

            <form @submit.prevent="pinjamBuku">
                <div class="mb-3">
                    <label for="student" class="form-label">Mahasiswa</label>
                    <select class="form-select" v-model="selectedStudent">
                        <option value="">Pilih Mahasiswa</option>
                        <option v-for="student in students" :key="student.id" :value="student.id">
                            {{ student.name }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="book" class="form-label">Buku</label>
                    <select class="form-select" v-model="selectedBook" @change="filterRacks"
                        :disabled="!selectedStudent">
                        <option value="">Pilih Buku</option>
                        <option v-for="book in books" :key="book.id" :value="book.id">
                            {{ book.title }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="rack" class="form-label">Rak Buku</label>
                    <select class="form-select" v-model="selectedRack" :disabled="!selectedBook">
                        <option value="">Pilih Rak</option>
                        <option v-for="rack in filteredRacks" :key="rack.id" :value="rack.id">
                            {{ rack.location }} (Stok: {{ rack.stock }})
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="duration" class="form-label">Durasi Pinjam (Hari)</label>
                    <input type="number" class="form-control" v-model="duration" min="1" max="14"
                        :disabled="!selectedRack" />
                </div>

                <button type="button" class="btn btn-secondary me-3" @click="addBookToBorrow"
                    :disabled="!selectedRack || !duration">
                    Tambah Buku
                </button>

                <button v-if="borrowedBooks.length > 0" type="submit" class="btn btn-primary">
                    Pinjam Buku
                </button>
            </form>

        </div>

        <div v-if="borrowedBooks.length > 0" class="mb-3">
            <h5>Daftar buku yang akan dipinjam:</h5>
            <ul>
                <li v-for="(item, index) in borrowedBooks" :key="index">
                    {{ item.bookTitle }} - Rak: {{ item.rackLocation }}
                    <button class="btn btn-sm btn-danger" @click="removeBook(index)">Hapus</button>
                </li>
            </ul>
        </div>

        <div class="mb-3">
            <input type="text" class="form-control" placeholder="Cari nama mahasiswa..." v-model="search"
                @input="fetchTransactions" />
        </div>
        <h3 class="mb-4 fw-bold">🔁 Data Transaksi</h3>

        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-light text-center">
                    <tr>
                        <th>No</th>
                        <th>Nama Mahasiswa</th>
                        <th>Tanggal Pinjam</th>
                        <th>Tanggal Dikembalikan</th>
                        <th>Status</th>
                        <th>Buku</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="transactions.length === 0">
                        <td colspan="7" class="text-center">Tidak ada data.</td>
                    </tr>
                    <tr v-for="(trx, index) in transactions" :key="trx.transaction_id" class="text-center">
                        <td>{{ index + 1 + (page - 1) * limit }}</td>
                        <td>{{ trx.student_name }}</td>
                        <td>{{ formatDate(trx.loan_date) }}</td>
                        <td>{{ trx.return_date_at ? formatDate(trx.return_date_at) : '-' }}</td>
                        <td>
                            <span :class="getBadgeClass(trx.status)">
                                {{ trx.status }}
                            </span>
                        </td>
                        <td>
                            <ul class="text-start mb-0">
                                <li v-for="book in trx.books" :key="book.book_id">
                                    {{ book.title }}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-success" v-if="trx.status === 'dipinjam'"
                                @click="markAsReturned(trx.transaction_id)">
                                Tandai Dikembalikan
                            </button>
                            <span v-else class="text-muted"> - </span>
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
                <li class="page-item" :class="{ disabled: transactions.length < limit }">
                    <button class="page-link" @click="nextPage" :disabled="transactions.length < limit">Next</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            transactions: [],
            search: "",
            page: 1,
            limit: 10,
            students: [],
            books: [],
            racks: [],
            selectedStudent: "",
            selectedBook: "",
            selectedRack: "",
            filteredRacks: [],
            duration: 14,
            borrowedBooks: [],
        };
    },
    methods: {
        async fetchTransactions() {
            try {
                const res = await api.get("/transactions", {
                    params: {
                        page: this.page,
                        limit: this.limit,
                        search: this.search,
                    },
                });
                this.transactions = res.data.data;
            } catch (err) {
                console.error("Gagal mengambil data transaksi:", err);
            }
        },
        async fetchStudents() {
            try {
                const res = await api.get("/student");
                this.students = res.data.data;
            } catch (err) {
                console.error("Gagal mengambil data mahasiswa:", err);
            }
        },
        async fetchBooks() {
            try {
                const res = await api.get("/books");
                this.books = res.data.data;
            } catch (err) {
                console.error("Gagal mengambil data buku:", err);
            }
        },
        async fetchRacks() {
            try {
                const res = await api.get("/inventory");
                this.racks = res.data.data;
                this.filteredRacks = [...this.racks];
            } catch (err) {
                console.error("Gagal mengambil data rak:", err);
            }
        },
        filterRacks() {
            if (!this.selectedBook) {
                this.filteredRacks = [...this.racks];
            } else {
                this.filteredRacks = this.racks.filter(rack => rack.book_id === this.selectedBook);
            }
        },
        addBookToBorrow() {
            const book = this.books.find(b => b.id === this.selectedBook);
            const rack = this.racks.find(r => r.id === this.selectedRack);
            if (book && rack) {
                this.borrowedBooks.push({
                    bookTitle: book.title,
                    rackLocation: rack.location,
                    book_id: book.id,
                    inventory_id: rack.id,
                });
                this.selectedBook = "";
                this.selectedRack = "";
            } else {
                alert("Pilih buku dan rak yang sesuai.");
            }
        },
        removeBook(index) {
            this.borrowedBooks.splice(index, 1);
        },
        async pinjamBuku() {
            const payload = {
                student_id: this.selectedStudent,
                books: this.borrowedBooks.map(item => ({
                    book_id: item.book_id,
                    inventory_id: item.inventory_id,
                })),
                duration: this.duration,
            };

            console.log("Payload yang akan dikirim:", payload);

            try {
                const res = await api.post("/transactions", payload);
                if (res.data.message) {
                    alert("Buku berhasil dipinjam!");
                    this.borrowedBooks = [];
                    this.fetchTransactions();
                }
            } catch (err) {
                alert("Gagal meminjam buku. Coba lagi.");
                console.error(err);
            }
        },

        async markAsReturned(transactionId) {
            if (!confirm("Apakah Anda yakin ingin menandai transaksi ini sebagai dikembalikan?"))
                return;
            try {
                const res = await api.put(`/transactions/${transactionId}/status`, {
                    status: "dikembalikan",
                });
                if (res.data.message) {
                    alert("Transaksi berhasil ditandai sebagai dikembalikan.");
                    this.fetchTransactions();
                }
            } catch (err) {
                alert("Gagal mengubah status transaksi.");
            }
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        },

        getBadgeClass(status) {
            return {
                "badge bg-warning text-dark": status === "dipinjam",
                "badge bg-success": status === "dikembalikan",
            };
        },
        nextPage() {
            this.page++;
        },
        prevPage() {
            if (this.page > 1) this.page--;
        },
    },
    watch: {
        page() {
            this.fetchTransactions();
        },
        search() {
            this.fetchTransactions();
        },
    },
    mounted() {
        this.fetchStudents();
        this.fetchBooks();
        this.fetchRacks();
        this.fetchTransactions();
    },
};
</script>