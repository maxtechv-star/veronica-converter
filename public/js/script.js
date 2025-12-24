document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const videoFileInput = document.getElementById('videoFile');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadArea = document.getElementById('uploadArea');
    const dropZone = document.getElementById('dropZone');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const convertBtn = document.getElementById('convertBtn');

    // File selection
    selectFileBtn.addEventListener('click', () => {
        videoFileInput.click();
    });

    // File input change
    videoFileInput.addEventListener('change', handleFileSelect);

    // Remove file
    removeFileBtn.addEventListener('click', () => {
        videoFileInput.value = '';
        fileInfo.style.display = 'none';
    });

    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('dragover');
    }

    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            videoFileInput.files = files;
            handleFileSelect({ target: videoFileInput });
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        
        if (file.size > maxSize) {
            alert('File size exceeds 10MB limit. Please choose a smaller file.');
            videoFileInput.value = '';
            return;
        }
        
        // Check if it's a video file
        if (!file.type.startsWith('video/')) {
            alert('Please select a video file.');
            videoFileInput.value = '';
            return;
        }
        
        // Display file info
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const file = videoFileInput.files[0];
            if (!file) {
                alert('Please select a video file first.');
                return;
            }
            
            // Show progress container
            progressContainer.style.display = 'block';
            fileInfo.style.display = 'none';
            convertBtn.disabled = true;
            
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) {
                    progress = 90;
                    clearInterval(interval);
                }
                
                progressFill.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
            }, 300);
            
            // Prepare form data
            const formData = new FormData(uploadForm);
            
            // Send to server
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                clearInterval(interval);
                progress = 100;
                progressFill.style.width = '100%';
                progressText.textContent = '100%';
                
                setTimeout(() => {
                    if (data.success) {
                        window.location.href = `/convert?file=${encodeURIComponent(data.filename)}`;
                    } else {
                        alert('Error: ' + data.error);
                        progressContainer.style.display = 'none';
                        fileInfo.style.display = 'block';
                        convertBtn.disabled = false;
                    }
                }, 500);
            })
            .catch(error => {
                clearInterval(interval);
                console.error('Error:', error);
                alert('An error occurred during upload.');
                progressContainer.style.display = 'none';
                fileInfo.style.display = 'block';
                convertBtn.disabled = false;
            });
        });
    }

    // Share functions for convert page
    window.shareOnTwitter = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('I just converted a video to MP3 using Veronica Converter!');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    window.shareOnFacebook = function() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    window.copyLink = function() {
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        alert('Link copied to clipboard!');
    };
});