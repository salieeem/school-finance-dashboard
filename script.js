// Dashboard App
class DashboardApp {
    constructor() {
        this.currentPage = 'home';
        this.studentsData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showPage('home');
        this.loadStudentsData();
    }

    setupEventListeners() {
        // Desktop sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.setActiveLink(link);
            });
        });

        // Mobile bottom navigation
        const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.showPage(page);
                this.setActiveMobileItem(item);
            });
        });

        // Students page specific handlers
        this.setupStudentsPageHandlers();
        
        // Form submissions
        this.setupFormHandlers();
        
        // Button click handlers
        this.setupButtonHandlers();
    }

    setupStudentsPageHandlers() {
        // Search functionality
        const searchInput = document.getElementById('search-siswa');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }

        // Filter dropdowns
        const filterKelas = document.getElementById('filter-kelas');
        const filterStatus = document.getElementById('filter-status');
        
        if (filterKelas) {
            filterKelas.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('select-all-siswa');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Individual checkboxes
        const studentCheckboxes = document.querySelectorAll('.student-checkbox');
        studentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectAllState();
            });
        });

        // Add student button
        const addStudentBtn = document.getElementById('add-siswa-btn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                this.showAddStudentModal();
            });
        }

        // Import students button
        const importStudentBtn = document.getElementById('import-siswa-btn');
        if (importStudentBtn) {
            importStudentBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }

        // View, Edit, Delete buttons for students
        this.setupStudentActionButtons();
    }

    setupStudentActionButtons() {
        // View buttons
        const viewButtons = document.querySelectorAll('#siswa-page .btn-icon.view');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const nis = row.querySelector('td:nth-child(2)').textContent;
                this.showStudentDetail(nis);
            });
        });

        // Edit buttons
        const editButtons = document.querySelectorAll('#siswa-page .btn-icon.edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const nis = row.querySelector('td:nth-child(2)').textContent;
                this.showEditStudentModal(nis);
            });
        });

        // Delete buttons
        const deleteButtons = document.querySelectorAll('#siswa-page .btn-icon.delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const nis = row.querySelector('td:nth-child(2)').textContent;
                const name = row.querySelector('.student-name').textContent;
                this.showDeleteStudentConfirm(nis, name);
            });
        });
    }

    loadStudentsData() {
        // Sample students data
        this.studentsData = [
            {
                nis: '2024001',
                name: 'Ahmad Rizki',
                email: 'ahmad.rizki@email.com',
                kelas: '10A',
                statusSPP: 'lunas',
                tunggakan: 0,
                status: 'aktif',
                avatar: 'https://via.placeholder.com/32'
            },
            {
                nis: '2024002',
                name: 'Siti Fatimah',
                email: 'siti.fatimah@email.com',
                kelas: '10B',
                statusSPP: 'tunggakan',
                tunggakan: 1500000,
                status: 'aktif',
                avatar: 'https://via.placeholder.com/32'
            },
            {
                nis: '2024003',
                name: 'Budi Santoso',
                email: 'budi.santoso@email.com',
                kelas: '11A',
                statusSPP: 'lunas',
                tunggakan: 0,
                status: 'aktif',
                avatar: 'https://via.placeholder.com/32'
            },
            {
                nis: '2023001',
                name: 'Dewi Lestari',
                email: 'dewi.lestari@email.com',
                kelas: '12A',
                statusSPP: 'lunas',
                tunggakan: 0,
                status: 'lulus',
                avatar: 'https://via.placeholder.com/32'
            }
        ];
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.add('hidden');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update page title
        this.updatePageTitle(pageId);
        
        // Update current page
        this.currentPage = pageId;
    }

    setActiveLink(activeLink) {
        // Remove active class from all links
        const links = document.querySelectorAll('.sidebar .nav-link');
        links.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    setActiveMobileItem(activeItem) {
        // Remove active class from all items
        const items = document.querySelectorAll('.mobile-bottom-nav .nav-item');
        items.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        activeItem.classList.add('active');
    }

    updatePageTitle(pageId) {
        const titleElement = document.querySelector('.page-title');
        const titles = {
            'home': 'Dashboard Keuangan',
            'siswa': 'Data Siswa',
            'pemasukan': 'Data Pemasukan',
            'pengeluaran': 'Data Pengeluaran',
            'laporan': 'Laporan Keuangan',
            'profile': 'Profile Admin'
        };

        titleElement.textContent = titles[pageId] || 'Dashboard';
    }

    // Students page methods
    filterStudents(searchTerm) {
        const rows = document.querySelectorAll('#student-table-body tr');
        rows.forEach(row => {
            const name = row.querySelector('.student-name').textContent.toLowerCase();
            const nis = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const kelas = row.querySelector('.kelas-badge').textContent.toLowerCase();
            
            if (name.includes(searchTerm.toLowerCase()) || 
                nis.includes(searchTerm.toLowerCase()) || 
                kelas.includes(searchTerm.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    applyFilters() {
        const kelasFilter = document.getElementById('filter-kelas').value;
        const statusFilter = document.getElementById('filter-status').value;
        const rows = document.querySelectorAll('#student-table-body tr');
        
        rows.forEach(row => {
            let showRow = true;
            
            if (kelasFilter) {
                const kelas = row.querySelector('.kelas-badge').textContent;
                if (!kelas.includes(kelasFilter)) {
                    showRow = false;
                }
            }
            
            if (statusFilter) {
                const statusBadges = row.querySelectorAll('.status-badge');
                let hasMatchingStatus = false;
                statusBadges.forEach(badge => {
                    if (badge.classList.contains(statusFilter)) {
                        hasMatchingStatus = true;
                    }
                });
                if (!hasMatchingStatus) {
                    showRow = false;
                }
            }
            
            row.style.display = showRow ? '' : 'none';
        });
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        const selectAllCheckbox = document.getElementById('select-all-siswa');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        selectAllCheckbox.checked = checkedCount === checkboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }

    showAddStudentModal() {
        const modalHTML = `
            <div class="modal-overlay" id="add-student-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Tambah Siswa Baru</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="add-student-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>NIS</label>
                                    <input type="text" name="nis" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Nama Lengkap</label>
                                    <input type="text" name="name" class="form-control" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Kelas</label>
                                    <select name="kelas" class="form-control" required>
                                        <option value="">Pilih Kelas</option>
                                        <option value="10A">10A</option>
                                        <option value="10B">10B</option>
                                        <option value="11A">11A</option>
                                        <option value="11B">11B</option>
                                        <option value="12A">12A</option>
                                        <option value="12B">12B</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select name="status" class="form-control" required>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak-aktif">Tidak Aktif</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Batal</button>
                        <button type="submit" form="add-student-form" class="btn btn-primary">Simpan</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup form submission
        document.getElementById('add-student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddStudent(new FormData(e.target));
        });
        
        // Setup close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }

    handleAddStudent(formData) {
        const studentData = {
            nis: formData.get('nis'),
            name: formData.get('name'),
            email: formData.get('email'),
            kelas: formData.get('kelas'),
            status: formData.get('status'),
            statusSPP: 'lunas',
            tunggakan: 0,
            avatar: 'https://via.placeholder.com/32'
        };

        // Add to students data
        this.studentsData.push(studentData);
        
        // Close modal
        this.closeModal();
        
        // Show success notification
        this.showNotification('Siswa berhasil ditambahkan!', 'success');
        
        // Refresh table (in real app, this would update the table)
        console.log('Student added:', studentData);
    }

    showEditStudentModal(nis) {
        const student = this.studentsData.find(s => s.nis === nis);
        if (!student) return;

        const modalHTML = `
            <div class="modal-overlay" id="edit-student-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Edit Data Siswa</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-student-form">
                            <input type="hidden" name="nis" value="${student.nis}">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>NIS</label>
                                    <input type="text" value="${student.nis}" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Nama Lengkap</label>
                                    <input type="text" name="name" value="${student.name}" class="form-control" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value="${student.email}" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Kelas</label>
                                    <select name="kelas" class="form-control" required>
                                        <option value="10A" ${student.kelas === '10A' ? 'selected' : ''}>10A</option>
                                        <option value="10B" ${student.kelas === '10B' ? 'selected' : ''}>10B</option>
                                        <option value="11A" ${student.kelas === '11A' ? 'selected' : ''}>11A</option>
                                        <option value="11B" ${student.kelas === '11B' ? 'selected' : ''}>11B</option>
                                        <option value="12A" ${student.kelas === '12A' ? 'selected' : ''}>12A</option>
                                        <option value="12B" ${student.kelas === '12B' ? 'selected' : ''}>12B</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select name="status" class="form-control" required>
                                    <option value="aktif" ${student.status === 'aktif' ? 'selected' : ''}>Aktif</option>
                                    <option value="tidak-aktif" ${student.status === 'tidak-aktif' ? 'selected' : ''}>Tidak Aktif</option>
                                    <option value="lulus" ${student.status === 'lulus' ? 'selected' : ''}>Lulus</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Batal</button>
                        <button type="submit" form="edit-student-form" class="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup form submission
        document.getElementById('edit-student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditStudent(new FormData(e.target));
        });
        
        // Setup close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }

    handleEditStudent(formData) {
        const nis = formData.get('nis');
        const studentIndex = this.studentsData.findIndex(s => s.nis === nis);
        
        if (studentIndex !== -1) {
            this.studentsData[studentIndex] = {
                ...this.studentsData[studentIndex],
                name: formData.get('name'),
                email: formData.get('email'),
                kelas: formData.get('kelas'),
                status: formData.get('status')
            };
        }
        
        // Close modal
        this.closeModal();
        
        // Show success notification
        this.showNotification('Data siswa berhasil diperbarui!', 'success');
        
        console.log('Student updated:', this.studentsData[studentIndex]);
    }

    showStudentDetail(nis) {
        const student = this.studentsData.find(s => s.nis === nis);
        if (!student) return;

        const modalHTML = `
            <div class="modal-overlay" id="student-detail-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Detail Siswa</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="student-detail-card">
                            <div class="student-avatar-section">
                                <img src="${student.avatar}" alt="Avatar" class="student-detail-avatar">
                            </div>
                            <div class="student-info-section">
                                <h4>${student.name}</h4>
                                <p><strong>NIS:</strong> ${student.nis}</p>
                                <p><strong>Email:</strong> ${student.email}</p>
                                <p><strong>Kelas:</strong> ${student.kelas}</p>
                                <p><strong>Status:</strong> <span class="status-badge ${student.status}">${student.status}</span></p>
                                <p><strong>Status SPP:</strong> <span class="status-badge ${student.statusSPP}">${student.statusSPP}</span></p>
                                <p><strong>Tunggakan:</strong> ${this.formatCurrency(student.tunggakan)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Tutup</button>
                        <button type="button" class="btn btn-primary" onclick="app.showEditStudentModal('${student.nis}')">Edit</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }

    showDeleteStudentConfirm(nis, name) {
        if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${name}"?`)) {
            const studentIndex = this.studentsData.findIndex(s => s.nis === nis);
            if (studentIndex !== -1) {
                this.studentsData.splice(studentIndex, 1);
                this.showNotification('Data siswa berhasil dihapus!', 'success');
                console.log('Student deleted:', name);
            }
        }
    }

    showImportModal() {
        const modalHTML = `
            <div class="modal-overlay" id="import-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Import Data Siswa</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="import-section">
                            <div class="import-info">
                                <p>Upload file Excel (.xlsx atau .xls) yang berisi data siswa.</p>
                                <p><strong>Format yang diperlukan:</strong></p>
                                <ul>
                                    <li>Kolom A: NIS</li>
                                    <li>Kolom B: Nama Lengkap</li>
                                    <li>Kolom C: Email</li>
                                    <li>Kolom D: Kelas</li>
                                    <li>Kolom E: Status</li>
                                </ul>
                            </div>
                            <div class="file-upload-area">
                                <input type="file" id="import-file" accept=".xlsx,.xls" style="display: none;">
                                <div class="file-drop-zone" onclick="document.getElementById('import-file').click()">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Klik untuk pilih file atau drag & drop</p>
                                    <small>Maksimal 5MB</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Batal</button>
                        <button type="button" class="btn btn-primary" onclick="app.handleImport()">Import</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }

    handleImport() {
        // Simulate import process
        this.showNotification('Import sedang diproses...', 'info');
        
        setTimeout(() => {
            this.showNotification('Data siswa berhasil diimport!', 'success');
            this.closeModal();
        }, 2000);
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.remove();
        });
    }

    setupFormHandlers() {
        // Profile form handler
        const profileForm = document.querySelector('.profile-form form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }
    }

    setupButtonHandlers() {
        // Add income button
        const addIncomeBtn = document.querySelector('#pemasukan-page .btn-primary');
        if (addIncomeBtn) {
            addIncomeBtn.addEventListener('click', () => {
                this.showModal('Tambah Pemasukan');
            });
        }

        // Add expense button
        const addExpenseBtn = document.querySelector('#pengeluaran-page .btn-primary');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                this.showModal('Tambah Pengeluaran');
            });
        }

        // Edit buttons (non-student)
        const editButtons = document.querySelectorAll('.btn-icon.edit:not(#siswa-page .btn-icon.edit)');
        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showModal('Edit Data');
            });
        });

        // Delete buttons (non-student)
        const deleteButtons = document.querySelectorAll('.btn-icon.delete:not(#siswa-page .btn-icon.delete)');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showDeleteConfirm();
            });
        });

        // Export PDF button
        const exportBtn = document.querySelector('#laporan-page .btn-secondary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToPDF();
            });
        }
    }

    handleProfileUpdate() {
        // Simulate profile update
        this.showNotification('Profile berhasil diperbarui!', 'success');
    }

    showModal(title) {
        // Simple modal simulation
        this.showNotification(`${title} - Fitur akan dikembangkan lebih lanjut`, 'info');
    }

    showDeleteConfirm() {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            this.showNotification('Data berhasil dihapus!', 'success');
        }
    }

    exportToPDF() {
        // Simulate PDF export
        this.showNotification('Laporan PDF sedang diproses...', 'info');
        
        setTimeout(() => {
            this.showNotification('Laporan PDF berhasil diunduh!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2dce89' : type === 'error' ? '#f5365c' : '#5e72e4'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Global variable for app instance
let app;

// Additional CSS for modal and notifications
const additionalStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
        margin: 0;
        color: #172b4d;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #8898aa;
        padding: 0;
        width: 30px;
        height: 30px;
    }

    .modal-close:hover {
        color: #172b4d;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .student-detail-card {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .student-detail-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
    }

    .student-info-section h4 {
        margin-bottom: 1rem;
        color: #172b4d;
    }

    .student-info-section p {
        margin-bottom: 0.5rem;
        color: #8898aa;
    }

    .import-section {
        text-align: center;
    }

    .import-info {
        margin-bottom: 2rem;
        text-align: left;
    }

    .import-info ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }

    .file-drop-zone {
        border: 2px dashed #e9ecef;
        border-radius: 8px;
        padding: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .file-drop-zone:hover {
        border-color: #5e72e4;
        background: #f8f9fe;
    }

    .file-drop-zone i {
        font-size: 3rem;
        color: #8898aa;
        margin-bottom: 1rem;
    }

    .file-drop-zone p {
        margin: 0.5rem 0;
        color: #172b4d;
    }

    .file-drop-zone small {
        color: #8898aa;
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 1rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .student-detail-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;

// Add additional styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new DashboardApp();
});

// Add some sample data interaction
document.addEventListener('DOMContentLoaded', () => {
    // Simulate real-time data updates
    setInterval(() => {
        updateNotificationBadge();
    }, 30000); // Update every 30 seconds
});

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-icon .badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        badge.textContent = newCount;
        
        if (newCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}
