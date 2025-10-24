// Diary App JavaScript
(function() {
    'use strict';

    // DOM Elements
    const diaryForm = document.getElementById('diaryForm');
    const entryTitle = document.getElementById('entryTitle');
    const entryContent = document.getElementById('entryContent');
    const entriesList = document.getElementById('entriesList');
    const entryCount = document.querySelector('.entry-count');

    // Initialize app
    let entries = [];

    // Load entries from localStorage on page load
    function loadEntries() {
        const storedEntries = localStorage.getItem('diaryEntries');
        if (storedEntries) {
            entries = JSON.parse(storedEntries);
        }
        renderEntries();
    }

    // Save entries to localStorage
    function saveEntries() {
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }

    // Format date to Japanese format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    }

    // Add new entry
    function addEntry(title, content) {
        const entry = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toISOString()
        };
        
        entries.unshift(entry); // Add to beginning of array
        saveEntries();
        renderEntries();
    }

    // Delete entry
    function deleteEntry(id) {
        if (confirm('この日記を削除してもよろしいですか？')) {
            entries = entries.filter(entry => entry.id !== id);
            saveEntries();
            renderEntries();
        }
    }

    // Render all entries
    function renderEntries() {
        // Update entry count
        entryCount.textContent = `${entries.length}件の日記`;

        // Clear list
        entriesList.innerHTML = '';

        // Show empty message if no entries
        if (entries.length === 0) {
            entriesList.innerHTML = '<p class="empty-message">まだ日記がありません。最初の日記を書いてみましょう！</p>';
            return;
        }

        // Render each entry
        entries.forEach(entry => {
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card';
            
            entryCard.innerHTML = `
                <div class="entry-header">
                    <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
                    <span class="entry-date">${formatDate(entry.date)}</span>
                </div>
                <p class="entry-content">${escapeHtml(entry.content)}</p>
                <div class="entry-actions">
                    <button class="btn-delete" data-id="${entry.id}">削除</button>
                </div>
            `;
            
            entriesList.appendChild(entryCard);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteEntry(id);
            });
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Handle form submission
    diaryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = entryTitle.value.trim();
        const content = entryContent.value.trim();
        
        if (title && content) {
            addEntry(title, content);
            
            // Clear form
            entryTitle.value = '';
            entryContent.value = '';
            
            // Focus back on title input
            entryTitle.focus();
        }
    });

    // Initialize the app when DOM is ready
    loadEntries();
})();
