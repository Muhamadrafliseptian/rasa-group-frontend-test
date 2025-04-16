<template>
  <div class="container mt-4">
    <h3 class="mb-4 fw-bold">📚 Data Buku</h3>
    <button class="btn btn-sm mb-3 btn-primary" @click="showModal">Tambah Mahasiswa</button>

    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Cari mahasiswa..." v-model="search" @input="fetchstudent" />
    </div>
    <ModalC ref="myModal" modalId="exampleModal" title="Data Buku">
      <template #body>
        <label for="" class="mb-2">Nama</label>
        <InputC type="text" placeholder="masukkan nama mahasiswa" v-model="studentForm.name" />
        <label for="">NIM</label>
        <InputC type="text" placeholder="masukkan nim" v-model="studentForm.nim" />
        <!-- <label for="">active</label> -->
        <InputC type="text" hidden placeholder="masukkan status mahasiswa" v-model="studentForm.active" />
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="hideModal">Tutup</button>
        <button class="btn btn-primary" @click="submitStudent">Simpan</button>
      </template>
    </ModalC>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light text-center">
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>NIM</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="student.length === 0">
            <td colspan="7" class="text-center">Tidak ada data.</td>
          </tr>
          <tr v-for="(students, index) in student" :key="students.id" class="text-center">
            <td>{{ index + 1 }}</td>
            <td>{{ students.name }}</td>
            <td>{{ students.nim }}</td>
            <td>{{ students.active === true ? 'Aktif' : 'Tidak Aktif' }}</td>
            <td>
              <div class="row">
                <div class="d-flex justify-content-center">
                  <button class="btn btn-sm btn-info me-2" @click="editStudent(students)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteStudent(students.id)">Delete</button>
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
        <li class="page-item" :class="{ disabled: student.length < limit }">
          <button class="page-link" @click="nextPage" :disabled="student.length < limit">Next</button>
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
      student: [],
      search: '',
      page: 1,
      limit: 10,
      studentForm: {
        name: '',
        nim: '',
        active: true,
      },
      isEdit: false,
      selectedStudentId: null,
    }
  },
  components: {
    ModalC,
    InputC
  },
  methods: {
    async fetchstudent() {
      try {
        const res = await api.get('student', {
          params: {
            page: this.page,
            limit: this.limit,
            search: this.search
          }
        })
        this.student = res.data.data
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
    async deleteStudent(id) {
      try {
        const res = await api.delete(`student/${id}`)
        if (res.data.statusCode === 200) {
          alert('Buku berhasil dihapus')
          this.fetchstudent()
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
      this.selectedStudentId = null
    },

    async submitStudent() {
      try {
        if (this.isEdit && this.selectedStudentId) {
          const res = await api.put(`/student/${this.selectedStudentId}`, this.studentForm)
          if (res.data.statusCode === 200) {
            alert('Buku berhasil diubah!')
          }
        } else {
          const res = await api.post('/student', this.studentForm)
          if (res.data.statusCode === 201) {
            alert('Buku berhasil ditambahkan!')
          }
        }

        this.fetchstudent()
        this.hideModal()

        this.studentForm = {
          name: '',
          nim: '',
          active: '',
        }
        this.isEdit = false
        this.selectedStudentId = null
      } catch (err) {
        alert('Terjadi kesalahan saat menyimpan buku.')
      }
    },

    editStudent(student) {
      this.isEdit = true
      this.selectedStudentId = student.id
      this.studentForm = {
        name: student.name,
        nim: student.nim,
        active: student.active,
      }
      this.showModal()
    }
  },
  watch: {
    page() {
      this.fetchstudent()
    },
    search() {
      this.fetchstudent()
    }
  },
  mounted() {
    this.fetchstudent()
  }
}
</script>